import React from 'react';
import { Sparkles, Feather, Tag, PackageCheck } from 'lucide-react';

export const BrandBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#C9A34A]" />,
      title: 'Curated Styles',
      subtitle: 'Trendy & timeless',
    },
    {
      icon: <Feather className="w-5 h-5 text-[#C9A34A]" />,
      title: 'Premium Quality',
      subtitle: 'Comfortable fabrics',
    },
    {
      icon: <Tag className="w-5 h-5 text-[#C9A34A]" />,
      title: 'Great Value',
      subtitle: 'Fashion at the right price',
    },
    {
      icon: <PackageCheck className="w-5 h-5 text-[#C9A34A]" />,
      title: 'Easy Shopping',
      subtitle: 'Simple & secure',
    },
  ];

  return (
    <section className="bg-[#FAF6F0] py-10 border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {benefits.map((b, idx) => (
            <div key={idx} className="flex flex-col items-center p-3">
              <div className="w-10 h-10 rounded-full bg-[#FFF8ED] border border-[#C9A34A]/30 flex items-center justify-center mb-2.5">
                {b.icon}
              </div>
              <h4 className="font-serif text-sm sm:text-base font-semibold text-[#191714]">
                {b.title}
              </h4>
              <p className="text-xs text-[#746D62] mt-0.5">
                {b.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
