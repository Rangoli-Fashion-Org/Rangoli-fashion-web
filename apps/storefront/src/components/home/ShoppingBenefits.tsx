import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

export const ShoppingBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <Truck className="w-6 h-6 text-[#003D2D]" />,
      title: 'Free Shipping',
      subtitle: 'Above ₹1,999',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-[#003D2D]" />,
      title: 'Easy Returns',
      subtitle: 'Hassle-free',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#003D2D]" />,
      title: 'Secure Payments',
      subtitle: '100% Safe',
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#003D2D]" />,
      title: 'Support',
      subtitle: 'Quick Assistance',
    },
  ];

  return (
    <section className="bg-white border-b border-[#E8DFD0] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3.5 p-3 rounded-lg hover:bg-[#FAF6F0] transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFF8ED] border border-[#E8DFD0] flex items-center justify-center shrink-0">
                {b.icon}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-sm sm:text-base font-semibold text-[#191714]">
                  {b.title}
                </span>
                <span className="text-xs text-[#746D62]">
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
