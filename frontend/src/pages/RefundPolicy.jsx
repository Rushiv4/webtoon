import React from 'react';
import { RotateCw, Heart, AlertCircle, CheckCircle } from 'lucide-react';

const RefundPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-2xl flex items-center justify-center mx-auto">
                    <RotateCw className="text-red-500" size={32} />
                </div>
                <h1 className="text-4xl font-black dark:text-white tracking-tight">Refund & Cancellation Policy</h1>
                <p className="text-gray-500 font-bold italic">Last Updated: March 24, 2026</p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-300">
                <section>
                    <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                        <AlertCircle size={24} className="text-red-500" /> 1. Overview
                    </h2>
                    <p className="font-medium leading-relaxed">
                        We strive to provide the best reading experience. Since our services involve digital content that is accessible immediately after purchase, we have a clear refund policy to ensure fairness to both our readers and creators.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                        <CheckCircle size={24} className="text-[#00dc64]" /> 2. Cancellation
                    </h2>
                    <p className="font-medium leading-relaxed">
                        You can cancel your subscription at any time through your account settings or by contacting our support team. Upon cancellation, you will continue to have access to premium features until the end of your current billing period.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                        <RotateCw size={24} className="text-blue-500" /> 3. Refund Eligibility
                    </h2>
                    <ul className="list-disc pl-6 space-y-4 font-medium">
                        <li>
                            <span className="font-black text-gray-800 dark:text-white">Technical Issues:</span> If you are unable to access the service due to a technical fault on our end that we cannot resolve within 48 hours, you may be eligible for a pro-rated refund.
                        </li>
                        <li>
                            <span className="font-black text-gray-800 dark:text-white">Accidental Subscription:</span> Refund requests made within 24 hours of purchase, provided no premium content has been read or downloaded, will be considered.
                        </li>
                        <li>
                            <span className="font-black text-gray-800 dark:text-white">Fraudulent Transactions:</span> We will process full refunds for confirmed fraudulent transactions as per the guidelines of our payment partner, Razorpay.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                        <Heart size={24} className="text-pink-500" /> 4. Processing Time
                    </h2>
                    <p className="font-medium leading-relaxed">
                        Once a refund is approved, it will be processed through Razorpay and typically takes 5–7 business days to reflect in your original payment method.
                    </p>
                </section>

                <section className="bg-red-50 dark:bg-red-950/10 p-8 rounded-[2rem] border border-red-100 dark:border-red-900/20">
                    <h2 className="text-xl font-black text-red-600 dark:text-red-400 mb-4">How to Request a Refund</h2>
                    <p className="font-bold text-sm text-gray-700 dark:text-gray-300">
                        Please email us at <span className="text-red-500 underline font-black">support@webtoonapp.com</span> with your transaction ID and reason for the refund request.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default RefundPolicy;
