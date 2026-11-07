import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

export const ShoppingBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <Truck className="w-5 h-5 text-[#003D2D]" />,
      title: 'Complimentary Delivery',
      subtitle: 'On orders above ₹1,999 across India',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#003D2D]" />,
      title: 'Artisanal Handcraft',
      subtitle: 'Pure cotton, silk & zari details',
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-[#003D2D]" />,
      title: 'Seamless Exchanges',
      subtitle: 'Hassle-free 7-day pickup service',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#003D2D]" />,
      title: 'Secure Payments',
      subtitle: '100% Encrypted UPI, Cards & NetBanking',
    },
  ];

  return (
    <section className="bg-white border-b border-[#E8DFD0] py-6 sm:py-8 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3.5 p-3 sm:p-4 rounded-xl bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] border border-[#E8DFD0]/60 hover:border-[#C9A34A]/50 transition-all duration-200 group"
            >
              <div className="w-11 h-11 rounded-full bg-white border border-[#C9A34A]/30 group-hover:border-[#C9A34A] flex items-center justify-center shrink-0 shadow-2xs transition-colors">
                {b.icon}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-xs sm:text-sm font-semibold text-[#191714] leading-snug">
                  {b.title}
                </span>
                <span className="text-[11px] text-[#746D62] mt-0.5 leading-tight">
                  {b.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
