import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#00dc64]/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Shield className="text-[#00dc64]" size={32} />
                </div>
                <h1 className="text-4xl font-black dark:text-white tracking-tight">Privacy Policy</h1>
                <p className="text-gray-500 font-bold italic">Last Updated: March 24, 2026</p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-300">
                <section>
                    <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                        <Lock size={24} className="text-[#00dc64]" /> 1. Information We Collect
                    </h2>
                    <p className="font-medium leading-relaxed">
                        We collect information you provide directly to us when you create an account, subscribe to our premium plans, or communicate with us. This includes your name, email address, and payment information processed through our secure partner, Razorpay.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                        <Eye size={24} className="text-blue-500" /> 2. How We Use Your Data
                    </h2>
                    <p className="font-medium leading-relaxed">
                        Your data is used to provide, maintain, and improve our services, including processing your subscriptions, sending you technical notices, and providing customer support. We do not sell your personal data to third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                        <Shield size={24} className="text-violet-500" /> 3. Data Security
                    </h2>
                    <p className="font-medium leading-relaxed">
                        We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. All payment transactions are encrypted using SSL technology and processed securely through Razorpay.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                        <FileText size={24} className="text-orange-500" /> 4. Cookies
                    </h2>
                    <p className="font-medium leading-relaxed">
                        We use cookies to improve your experience on our website, remember your preferences, and understand how you use our platform. You can disable cookies in your browser settings if you prefer.
                    </p>
                </section>

                <section className="bg-gray-50 dark:bg-white/5 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-black dark:text-white mb-4">Contact Us</h2>
                    <p className="font-bold text-sm">
                        If you have any questions about this Privacy Policy, please contact us at:
                        <br />
                        <span className="text-[#00dc64]">support@webtoonapp.com</span>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
