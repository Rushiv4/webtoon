import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github, Mail, ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="text-3xl font-black tracking-tighter text-[#00dc64]">
                            WEBTOON
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed">
                            The ultimate destination for manga, manhwa, and manhua. Experience stories like never before.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:text-[#00dc64] transition">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:text-[#00dc64] transition">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:text-[#00dc64] transition">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-black dark:text-white mb-6 tracking-tight">Quick Links</h4>
                        <ul className="space-y-4 font-bold text-sm text-gray-500 dark:text-gray-400">
                            <li><Link to="/" className="hover:text-[#00dc64] transition">Home</Link></li>
                            <li><Link to="/explore" className="hover:text-[#00dc64] transition">Explore</Link></li>
                            <li><Link to="/pricing" className="hover:text-[#00dc64] transition">Pricing Plans</Link></li>
                            <li><Link to="/login" className="hover:text-[#00dc64] transition">My Account</Link></li>
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div>
                        <h4 className="text-lg font-black dark:text-white mb-6 tracking-tight">Legal & Support</h4>
                        <ul className="space-y-4 font-bold text-sm text-gray-500 dark:text-gray-400">
                            <li><Link to="/privacy-policy" className="hover:text-[#00dc64] transition">Privacy Policy</Link></li>
                            <li><Link to="/refund-policy" className="hover:text-[#00dc64] transition">Refund & Cancellation</Link></li>
                            <li><a href="#" className="hover:text-[#00dc64] transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-[#00dc64] transition">Help Center</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-black dark:text-white mb-6 tracking-tight">Newsletter</h4>
                        <p className="text-gray-500 dark:text-gray-400 font-bold text-xs mb-4">
                            Subscribe to get the latest updates on new chapters and titles.
                        </p>
                        <div className="flex gap-2">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-[#00dc64]"
                            />
                            <button className="bg-[#00dc64] text-white p-2 rounded-xl hover:bg-[#00b953] transition">
                                <Mail size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-gray-400 font-black tracking-widest uppercase">
                        © 2026 WEBTOON APP. All Rights Reserved.
                    </p>
                    
                    <div className="flex items-center gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-1.5 text-[10px] font-black dark:text-white">
                            <ShieldCheck size={14} className="text-[#00dc64]" /> RAZORPAY SECURE
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black dark:text-white uppercase tracking-tighter">
                            Verified Merchant
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
