import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Calendar, CreditCard, IndianRupee, ArrowLeft, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await api.get('/payments/history');
                setPayments(res.data);
            } catch (err) {
                console.error('Error fetching payment history:', err);
                setError('Failed to load payment history.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPayments();
        } else {
            setLoading(false);
        }
    }, [user]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatAmount = (amountInPaise) => {
        return `₹${(amountInPaise / 100).toFixed(2)}`;
    };

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-black dark:text-white mb-3">Login Required</h2>
                    <p className="text-gray-500 font-bold mb-6">Please log in to view your payment history.</p>
                    <Link to="/login" className="inline-block bg-[#00dc64] text-white font-black px-8 py-3 rounded-2xl hover:bg-[#00b953] transition">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <Link
                to="/"
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-white font-bold transition mb-10 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>

            <div className="mb-10">
                <h1 className="text-4xl font-black dark:text-white tracking-tight flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#00dc64]/10 rounded-2xl flex items-center justify-center">
                        <Receipt size={24} className="text-[#00dc64]" />
                    </div>
                    Payment History
                </h1>
                <p className="text-gray-400 font-bold mt-3 ml-16">Your recent transactions and subscriptions</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-32">
                    <Loader2 className="animate-spin text-[#00dc64]" size={40} />
                </div>
            ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 p-6 rounded-2xl text-red-500 font-bold flex items-center gap-3">
                    <AlertCircle size={20} /> {error}
                </div>
            ) : payments.length === 0 ? (
                <div className="text-center py-32 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CreditCard size={36} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-xl font-black dark:text-white mb-2">No Payments Yet</h3>
                    <p className="text-gray-400 font-bold mb-8">You haven't made any purchases yet.</p>
                    <Link to="/pricing" className="bg-[#00dc64] text-white font-black px-8 py-3 rounded-2xl hover:bg-[#00b953] transition shadow-lg shadow-[#00dc64]/30">
                        View Plans
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Summary Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Payments</p>
                            <p className="text-3xl font-black dark:text-white">{payments.length}</p>
                        </div>
                        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Spent</p>
                            <p className="text-3xl font-black text-[#00dc64]">
                                {formatAmount(payments.reduce((sum, p) => sum + (p.amount || 0), 0))}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Current Plan</p>
                            <p className="text-3xl font-black text-violet-500">{payments[0]?.plan_name || 'Free'}</p>
                        </div>
                    </div>

                    {/* Payment Records */}
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-black dark:text-white">Transaction Records</h3>
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-black/20 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                        <th className="text-left py-4 px-6">Date</th>
                                        <th className="text-left py-4 px-6">Plan</th>
                                        <th className="text-left py-4 px-6">Amount</th>
                                        <th className="text-left py-4 px-6">Status</th>
                                        <th className="text-left py-4 px-6">Transaction ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment) => (
                                        <tr key={payment.id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {formatDate(payment.created_at)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="bg-[#00dc64]/10 text-[#00dc64] px-3 py-1 rounded-full text-xs font-black">
                                                    {payment.plan_name}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-black dark:text-white flex items-center gap-1">
                                                    <IndianRupee size={14} />
                                                    {(payment.amount / 100).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black ${
                                                    payment.status === 'success'
                                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-500'
                                                        : 'bg-red-50 dark:bg-red-900/20 text-red-500'
                                                }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-xs text-gray-400 font-mono">
                                                    {payment.razorpay_payment_id}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                            {payments.map((payment) => (
                                <div key={payment.id} className="p-5 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <span className="bg-[#00dc64]/10 text-[#00dc64] px-3 py-1 rounded-full text-xs font-black">
                                            {payment.plan_name}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                                            payment.status === 'success'
                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-500'
                                                : 'bg-red-50 dark:bg-red-900/20 text-red-500'
                                        }`}>
                                            {payment.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-black dark:text-white flex items-center gap-1">
                                            <IndianRupee size={18} />
                                            {(payment.amount / 100).toFixed(2)}
                                        </span>
                                        <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                                            <Calendar size={12} />
                                            {formatDate(payment.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-mono truncate">
                                        ID: {payment.razorpay_payment_id}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;
