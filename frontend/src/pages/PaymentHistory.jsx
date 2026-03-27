import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Tremor, AreaChart, BarChart3, Users, Loader2, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/payments/report');
            setPayments(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch payments', err);
            setError('Unable to load payment reports. Ensure you have admin privileges.');
            setLoading(false);
        }
    };

    // Calculate Summary Stats
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount / 100), 0);
    const successfulPayments = payments.filter(p => p.status === 'success');
    const uniqueSubscribers = new Set(payments.map(p => p.user_email)).size;

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader2 className="animate-spin text-[#00dc64]" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 text-center">
                <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 font-bold mb-6">
                    {error}
                </div>
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 mx-auto text-gray-500 hover:text-black transition font-bold"
                >
                    <ArrowLeft size={18} /> Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <button 
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#00dc64] transition font-bold mb-4 text-sm uppercase tracking-wider"
                    >
                        <ArrowLeft size={16} /> Admin Dashboard
                    </button>
                    <h1 className="text-4xl font-black dark:text-white tracking-tight flex items-center gap-3">
                        <DollarSign className="text-[#00dc64] bg-[#00dc64]/10 p-2 rounded-xl" size={40} />
                        Revenue & Subscriptions
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold mt-2">
                        Comprehensive overview of all transactions and subscriber activity.
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-black shadow-xl shadow-gray-200 dark:shadow-none hover:scale-105 transition-transform">
                    <Download size={18} /> Export JSON
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-100/50 dark:shadow-none">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-sm">Total Revenue (INR)</h3>
                        <AreaChart className="text-[#00dc64]" size={24} />
                    </div>
                    <p className="text-5xl font-black dark:text-white tracking-tighter">₹{totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-100/50 dark:shadow-none">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-sm">Successful Transactions</h3>
                        <ShieldCheck className="text-blue-500" size={24} />
                    </div>
                    <p className="text-5xl font-black dark:text-white tracking-tighter">{successfulPayments.length}</p>
                </div>

                <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-100/50 dark:shadow-none">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-sm">Premium Subscribers</h3>
                        <Users className="text-violet-500" size={24} />
                    </div>
                    <p className="text-5xl font-black dark:text-white tracking-tighter">{uniqueSubscribers}</p>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[2rem] border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-2xl font-black dark:text-white">Recent Transactions</h2>
                    <BarChart3 className="text-gray-400" size={24} />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8f9fa] dark:bg-black/20 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest">
                            <tr>
                                <th className="p-6">Date</th>
                                <th className="p-6">User / Email</th>
                                <th className="p-6">Plan</th>
                                <th className="p-6">Amount</th>
                                <th className="p-6">Payment ID</th>
                                <th className="p-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm font-medium dark:text-gray-300">
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-500 font-bold">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                                        <td className="p-6">{new Date(payment.created_at).toLocaleDateString()}</td>
                                        <td className="p-6">
                                            <p className="font-black text-gray-900 dark:text-white">{payment.username}</p>
                                            <p className="text-xs text-gray-400">{payment.user_email}</p>
                                        </td>
                                        <td className="p-6">
                                            <span className="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 px-3 py-1 rounded-full text-xs font-black">
                                                {payment.plan_name}
                                            </span>
                                        </td>
                                        <td className="p-6 font-black text-[#00dc64]">
                                            {payment.currency === 'INR' ? '₹' : '$'}
                                            {(payment.amount / 100).toLocaleString()}
                                        </td>
                                        <td className="p-6 font-mono text-xs text-gray-400">
                                            {payment.razorpay_payment_id}
                                        </td>
                                        <td className="p-6">
                                            <span className="flex items-center gap-1.5 text-[#00dc64] text-xs font-black bg-[#00dc64]/10 w-fit px-3 py-1 rounded-full">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#00dc64]" />
                                                {payment.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;
