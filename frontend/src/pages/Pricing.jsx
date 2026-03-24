import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Star, Shield, Smartphone, Download, Globe, Heart } from 'lucide-react';

const PricingCard = ({ title, price, description, features, icon: Icon, color, popular }) => {
  const navigate = useNavigate();
  
  const handleUpgrade = () => {
    const params = new URLSearchParams();
    params.append('plan', title);
    params.append('price', price);
    navigate(`/checkout?${params.toString()}`);
  };

  return (
    <div className={`relative flex flex-col p-8 rounded-[2rem] transition-all duration-300 transform hover:-translate-y-2 ${
      popular 
        ? 'bg-gradient-to-b from-[#00dc64]/10 to-transparent border-2 border-[#00dc64] shadow-2xl shadow-[#00dc64]/20' 
        : 'bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 shadow-xl'
    }`}>
      {popular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00dc64] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
          Most Popular
        </span>
      )}

      <div className="mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
          <Icon className="text-white" size={28} />
        </div>
        <h3 className="text-2xl font-black dark:text-white mb-2">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black dark:text-white">{price}</span>
          {price !== 'Free' && <span className="text-gray-400 font-bold">/mo</span>}
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex-grow space-y-4 mb-10">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="mt-1 p-0.5 bg-[#00dc64]/10 rounded-full">
              <Check size={14} className="text-[#00dc64] stroke-[3]" />
            </div>
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={handleUpgrade}
        className={`w-full py-4 rounded-2xl font-black transition-all duration-300 ${
        popular 
          ? 'bg-[#00dc64] text-white hover:bg-[#00b953] shadow-lg shadow-[#00dc64]/30' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}>
        {price === 'Free' ? 'Get Started' : 'Upgrade Now'}
      </button>
    </div>
  );
};

const Pricing = () => {
  const tiers = [
    {
      title: 'Free Reader',
      price: 'Free',
      description: 'The perfect way to start your journey into the world of webtoons with zero commitment.',
      icon: Smartphone,
      color: 'bg-blue-500',
      features: [
        'Access to 50,000+ free titles',
        'Standard image quality',
        'Community comments access',
        'Basic library sync across devices',
        'Ad-supported reading experience'
      ]
    },
    {
      title: 'Elite Member',
      price: '$9.99',
      description: 'Designed for the true enthusiast who wants the best reading experience every single day.',
      popular: true,
      icon: Zap,
      color: 'bg-[#00dc64]',
      features: [
        'Zero advertisements forever',
        'High-speed offline downloads',
        'Early access to new chapters',
        'HD Plus image rendering',
        'Exclusive premium-only titles'
      ]
    },
    {
      title: 'Legendary',
      price: '$19.99',
      description: 'The ultimate collection for master readers who want to support creators and own it all.',
      icon: Star,
      color: 'bg-violet-500',
      features: [
        'Everything in Elite plan',
        'Ultra HD 4K image quality',
        'Priority 24/7 VIP support',
        'Special digital badges & profile',
        '10% Discount on physical merch',
        'Support creators directly'
      ]
    }
  ];

  return (
    <div className="py-12 md:py-20 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-6xl font-black dark:text-white tracking-tight leading-tight">
          Choose Your <span className="text-[#00dc64]">Reading</span> Journey
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold text-lg px-4">
          Unlock the full potential of your favorite stories with our flexible pricing models.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {tiers.map((tier, idx) => (
          <PricingCard key={idx} {...tier} />
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-white/5 rounded-[3rem] p-12 max-w-5xl mx-auto text-center border border-gray-100 dark:border-gray-800">
        <div className="flex flex-wrap justify-center gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-black">
                <Shield className="text-[#00dc64]" /> Secure SSL
            </div>
            <div className="flex items-center gap-2 text-xl font-black">
                <Globe className="text-blue-500" /> Global Access
            </div>
            <div className="flex items-center gap-2 text-xl font-black">
                <Heart className="text-red-500" /> Creator Owned
            </div>
        </div>
        <p className="mt-8 text-gray-400 font-bold text-sm">
            Trusted by over 5 million readers worldwide. Cancel any time.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
