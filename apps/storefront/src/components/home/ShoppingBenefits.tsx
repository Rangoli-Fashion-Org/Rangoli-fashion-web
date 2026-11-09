import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Award } from 'lucide-react';

export const ShoppingBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <Truck className="w-5 h-5 text-[#003D2D]" />,
      title: 'Complimentary Delivery',
      subtitle: 'On orders above ₹2,999',
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-[#003D2D]" />,
      title: 'Easy Returns',
      subtitle: 'Hassle-free 7-day returns',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#003D2D]" />,
      title: 'Secure Payments',
      subtitle: 'UPI, Cards & NetBanking',
    },
    {
      icon: <Award className="w-5 h-5 text-[#003D2D]" />,
      title: 'Authentic Products',
      subtitle: 'Handpicked & quality assured',
    },
  ];

  return (
    <section className="relative bg-gradient-to-r from-[#FFFDF9] via-[#FAF2E6] to-[#FFFDF9] border-y border-[#E5D4BC]/80 py-4 sm:py-5 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E5D4BC]/70">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className={`flex items-center space-x-3.5 ${idx !== 0 ? 'pt-3 sm:pt-0 sm:pl-6' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFFDF9] to-[#F4E7D3] border border-[#C9A34A]/45 flex items-center justify-center shrink-0 shadow-2xs">
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
