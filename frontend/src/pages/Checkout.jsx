import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

import { CreditCard, Shield, CheckCircle, ArrowLeft, Lock, Info, Loader2 } from 'lucide-react';
import api from '../services/api';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const plan = searchParams.get('plan') || 'Free Reader';
    const priceStr = searchParams.get('price') || 'Free';
    const rawAmount = parseFloat(priceStr.replace(/[^\d.]/g, '')) || 0;
    const isINR = priceStr.includes('₹') || priceStr.toLowerCase().includes('rs');
    const amount = isINR ? rawAmount : Math.round(rawAmount * 80);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Load Razorpay Script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayPayment = async (e) => {
        if (e) e.preventDefault();
        
        if (amount === 0) {
            setIsSuccess(true);
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const res = await loadRazorpayScript();
            if (!res) {
                setError('Razorpay SDK failed to load. Check your internet connection.');
                setIsProcessing(false);
                return;
            }

            // 1. Create Order on Backend
            const { data: order } = await api.post('/payments/create-order', {
                amount: amount, // 'amount' is already in INR from the state calculation above
                currency: 'INR',
                receipt: `receipt_${Date.now()}`
            });

            // 2. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
                amount: order.amount,
                currency: order.currency,
                name: 'Webtoon Premium',
                description: `Subscription for ${plan}`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        // 3. Verify Payment on Backend
                        const verifyRes = await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan_name: plan,
                            amount: Math.round(amount * 100), // Convert INR amount to paise
                        });

                        if (verifyRes.data.success) {
                            setIsSuccess(true);
                        } else {
                            setError('Payment verification failed.');
                        }
                    } catch (err) {
                        setError('Error verifying payment.');
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: 'Guest User',
                    email: 'user@example.com',
                },
                theme: {
                    color: '#00dc64',
                },
                modal: {
                    ondismiss: () => setIsProcessing(false)
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error('Payment Error:', err);
            setError('Failed to initiate payment. Please try again.');
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-[#1e1e1e] rounded-[3rem] p-10 text-center shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-[#00dc64]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-[#00dc64]" />
                    </div>
                    <h1 className="text-3xl font-black dark:text-white mb-4 tracking-tight">Welcome Aboard!</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">
                        Your <span className="text-[#00dc64]">{plan}</span> subscription is now active. Enjoy unlimited access.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-[#00dc64] text-white font-black rounded-2xl hover:bg-[#00b953] transition shadow-lg shadow-[#00dc64]/30"
                    >
                        Start Reading
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <button
                onClick={() => navigate('/pricing')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-white font-bold transition mb-10 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Plans
            </button>

            <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    <section className="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-50 dark:border-gray-800">
                        <h2 className="text-3xl font-black dark:text-white mb-4 tracking-tight">Checkout</h2>
                        <p className="text-gray-400 font-bold mb-8">Review your plan and complete your secure payment via Razorpay.</p>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 p-4 rounded-2xl text-red-500 font-bold text-sm mb-8 flex items-center gap-3">
                                <Info size={18} /> {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="p-6 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-black dark:text-white text-lg">{plan}</h4>
                                    <span className="text-[#00dc64] font-black text-xl">{priceStr}</span>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                                        <CheckCircle size={14} className="text-[#00dc64]" /> Premium Content Access
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                                        <CheckCircle size={14} className="text-[#00dc64]" /> High-Speed Downloads
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={handleRazorpayPayment}
                                disabled={isProcessing}
                                className={`w-full py-5 bg-[#00dc64] text-white font-black rounded-3xl transition-all shadow-xl shadow-[#00dc64]/30 flex items-center justify-center gap-3 text-lg ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#00b953] hover:-translate-y-1'}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Securely Connecting...
                                    </>
                                ) : (
                                    <>
                                        Pay with Razorpay
                                        <Shield size={20} />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-400 font-bold">
                                By clicking the button above, you agree to our 
                                <Link to="/privacy-policy" className="text-[#00dc64] hover:underline mx-1">Privacy Policy</Link> 
                                and 
                                <Link to="/refund-policy" className="text-[#00dc64] hover:underline mx-1">Refund Policy</Link>.
                            </p>

                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#f8f9fa] dark:bg-white/5 rounded-[2.5rem] p-10 border border-gray-200 dark:border-gray-800 sticky top-32">
                        <h3 className="text-xl font-black dark:text-white mb-6 tracking-tight">Order Summary</h3>
                        <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-black text-[#00dc64]">{plan}</p>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Monthly Subscription</p>
                                </div>
                                <span className="font-black dark:text-white">{priceStr}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-6">
                            <span className="text-lg font-black dark:text-white">Total</span>
                            <span className="text-2xl font-black text-[#00dc64]">{priceStr}</span>
                        </div>

                        <div className="space-y-4 mt-6">
                            <div className="flex gap-3 items-center text-xs text-gray-500 font-bold bg-white dark:bg-black/10 p-4 rounded-2xl">
                                <Lock size={14} className="text-[#00dc64]" />
                                Secure Encryption Enabled
                            </div>
                            <div className="flex gap-3 items-center text-xs text-gray-500 font-bold bg-white dark:bg-black/10 p-4 rounded-2xl">
                                <Info size={14} className="text-blue-500" />
                                Payment processed by Razorpay
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
