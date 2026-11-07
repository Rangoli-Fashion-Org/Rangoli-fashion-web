import React from 'react';
import { Sparkles, Feather, Award, HeartHandshake } from 'lucide-react';

export const BrandBenefits: React.FC = () => {
  const hallmarks = [
    {
      icon: <Sparkles className="w-6 h-6 text-[#C9A34A]" />,
      title: 'Artisanal Heritage',
      subtitle: 'Celebrated Indian weaves, Jaipur block prints, and royal zari embroidery.',
    },
    {
      icon: <Feather className="w-6 h-6 text-[#C9A34A]" />,
      title: 'Pure Comfort Fabrics',
      subtitle: 'Breathable combed mulmul, pure cotton, chanderi, and lustrous silk blends.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#C9A34A]" />,
      title: 'Bespoke Tailoring',
      subtitle: 'Precision sizing designed to flatter every body shape effortlessly.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#C9A34A]" />,
      title: 'Ethical Craftsmanship',
      subtitle: 'Sustainably crafted in small artisanal batches with direct artisan support.',
    },
  ];

  return (
    <section className="bg-[#FAF6F0] py-14 sm:py-20 border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-16 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#003D2D]/5 border border-[#C9A34A]/40 text-[#003D2D] text-xs font-semibold uppercase tracking-widest">
            <span>The Rangoli Hallmark</span>
          </div>

          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            <div className="h-px w-10 sm:w-16 bg-[#C9A34A]/60" />
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#191714] font-medium tracking-tight">
              Designed with Devotion, Made to Cherish
            </h2>
            <div className="h-px w-10 sm:w-16 bg-[#C9A34A]/60" />
          </div>

          <p className="text-xs sm:text-sm text-[#746D62] max-w-lg">
            Every thread woven with patience, every stitch placed with intention.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {hallmarks.map((h, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-[#E8DFD0] hover:border-[#C9A34A] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#FFF8ED] border border-[#C9A34A]/40 group-hover:border-[#C9A34A] flex items-center justify-center mb-4 shadow-2xs group-hover:scale-110 transition-all duration-300">
                {h.icon}
              </div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#191714] mb-2">
                {h.title}
              </h3>
              <p className="text-xs text-[#746D62] leading-relaxed">
                {h.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
