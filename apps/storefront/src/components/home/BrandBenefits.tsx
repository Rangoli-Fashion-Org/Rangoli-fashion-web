'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Gem, Sparkles, Feather, Award, Crown, Scissors, Heart } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export const BrandBenefits: React.FC = () => {
  const [whyChooseSection, setWhyChooseSection] = useState<any>(null);
  const [hallmarkSection, setHallmarkSection] = useState<any>(null);

  useEffect(() => {
    fetchApi<any[]>('/homepage/sections').then((res) => {
      if (res.success && res.data) {
        const whySec = res.data.find((s: any) => s.sectionKey === 'why_choose_us');
        const hallSec = res.data.find((s: any) => s.sectionKey === 'brand_benefits');
        if (whySec) setWhyChooseSection(whySec);
        if (hallSec) setHallmarkSection(hallSec);
      }
    });
  }, []);

  const pillarIcons = [
    <Gem key="0" className="w-6 h-6 text-[#DFC37A]" />,
    <Scissors key="1" className="w-6 h-6 text-[#DFC37A]" />,
    <Feather key="2" className="w-6 h-6 text-[#DFC37A]" />,
    <Award key="3" className="w-6 h-6 text-[#DFC37A]" />,
  ];

  const hallmarkIcons = [
    <Crown key="0" className="w-6 h-6 text-[#C9A34A]" />,
    <Feather key="1" className="w-6 h-6 text-[#C9A34A]" />,
    <Sparkles key="2" className="w-6 h-6 text-[#C9A34A]" />,
    <Heart key="3" className="w-6 h-6 text-[#C9A34A]" />,
  ];

  const defaultWhyChoosePillars = [
    {
      title: 'Premium Fabrics',
      subtitle: 'Breathable, comfortable and long-lasting.',
    },
    {
      title: 'Exclusive Designs',
      subtitle: 'Timeless styles with a modern touch.',
    },
    {
      title: 'Crafted with Care',
      subtitle: 'Attention to every detail and finish.',
    },
    {
      title: 'Trusted Quality',
      subtitle: 'Loved by thousands across India.',
    },
  ];

  const defaultHallmarks = [
    {
      title: 'Artisanal Heritage',
      subtitle: 'Celebrating Indian artistry, passed down through generations.',
    },
    {
      title: 'Pure Comfort Fabrics',
      subtitle: 'Breathable, skin-friendly materials that blend tradition with everyday ease.',
    },
    {
      title: 'Bespoke Tailoring',
      subtitle: 'Thoughtfully designed silhouettes with a flattering, modern fit.',
    },
    {
      title: 'Ethical Craftsmanship',
      subtitle: 'Sustainably created with care for people, fabric and tradition.',
    },
  ];

  const showWhyChoose = whyChooseSection ? whyChooseSection.isVisible : true;
  const showHallmark = hallmarkSection ? hallmarkSection.isVisible : true;

  const whyChooseTitle = whyChooseSection?.title || 'Why Choose Rangoli';
  const whyChooseImageUrl = whyChooseSection?.customData?.imageUrl || '';
  const whyChooseItems =
    Array.isArray(whyChooseSection?.customData?.items) &&
    whyChooseSection.customData.items.length === 4
      ? whyChooseSection.customData.items
      : defaultWhyChoosePillars;

  const hallmarkBadge =
    hallmarkSection?.customData?.badgeText || 'The Rangoli Hallmark';
  const hallmarkTitle =
    hallmarkSection?.title || 'Designed with Devotion, Made to Cherish';
  const hallmarkDescription =
    hallmarkSection?.customData?.description ||
    hallmarkSection?.subtitle ||
    'Finely finished, woven with patience, every stitch a part of a rich tradition.';
  const hallmarkItems =
    Array.isArray(hallmarkSection?.customData?.items) &&
    hallmarkSection.customData.items.length === 4
      ? hallmarkSection.customData.items
      : defaultHallmarks;

  if (!showWhyChoose && !showHallmark) {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-[#F6ECE0] via-[#FDF7EE] to-[#F7EDE0]">
      {/* 1. "WHY CHOOSE RANGOLI" EMERALD SECTION */}
      {showWhyChoose && (
        <section className="py-5 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#002219] via-[#003527] to-[#002219] border border-[#C9A34A]/50 shadow-xl px-6 py-8 sm:px-12 sm:py-10">
              {whyChooseImageUrl && (
                <>
                  <Image
                    src={whyChooseImageUrl}
                    alt={whyChooseTitle}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                </>
              )}

              <div className="relative z-10">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FFF8ED] text-center font-normal tracking-tight mb-8 sm:mb-10">
                  {whyChooseTitle}
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-[#C9A34A]/25">
                  {whyChooseItems.map((pillar: any, idx: number) => (
                    <div
                      key={idx}
                      className={`flex flex-col items-center text-center px-3 ${
                        idx !== 0 ? 'pt-5 sm:pt-0 lg:pl-6' : ''
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#004231]/90 backdrop-blur-xs border border-[#C9A34A]/40 flex items-center justify-center mb-3 shadow-inner">
                        {pillarIcons[idx]}
                      </div>
                      <h3 className="font-serif text-sm sm:text-base font-semibold text-[#FFF8ED] mb-1">
                        {pillar.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-[#FFF8ED]/80 max-w-[200px] leading-relaxed">
                        {pillar.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. "THE RANGOLI HALLMARK" — DESIGNED WITH DEVOTION, MADE TO CHERISH */}
      {showHallmark && (
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center text-center mb-7 sm:mb-9 space-y-2">
              <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-[#F4E6CF] border border-[#C9A34A]/50 text-[#7A520C] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                <span>{hallmarkBadge}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#191714] font-semibold tracking-tight">
                {hallmarkTitle}
              </h2>

              <p className="text-xs sm:text-sm text-[#746D62] max-w-lg">
                {hallmarkDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {hallmarkItems.map((h: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-[#E6D5BE] shadow-xs"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFFDF9] to-[#F4E7D3] border border-[#C9A34A]/45 flex items-center justify-center mb-3.5 shadow-2xs">
                    {hallmarkIcons[idx]}
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-semibold text-[#191714] mb-1.5">
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
      )}
    </div>
  );
};
