'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export const FestiveBanner: React.FC = () => {
  const [sectionData, setSectionData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchApi<any[]>('/homepage/sections').then((res) => {
      if (res.success && res.data) {
        const festive = res.data.find((s: any) => s.sectionKey === 'festive_edit');
        if (festive) {
          setIsVisible(festive.isVisible);
          setSectionData(festive);
        }
      }
    });
  }, []);

  if (!isVisible || !sectionData) {
    return null;
  }

  const badgeText = sectionData.customData?.badgeText || sectionData.subtitle || 'Special Occasions';
  const title = sectionData.title || 'The Festive Capsule';
  const description = sectionData.customData?.description || 'Thoughtfully crafted with intricate zari embroidery, rich chanderi silks, and opulent silhouettes for your most treasured celebrations.';
  const ctaText = sectionData.customData?.ctaText || 'Shop the Festive Edit';
  const ctaUrl = sectionData.customData?.ctaUrl || '/shop';
  const imageUrl = sectionData.customData?.imageUrl || '/brand/company-logo.png';

  return (
    <section className="py-14 md:py-20 bg-[#FFF8ED] border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#002D21] via-[#003829] to-[#004A37] border border-[#C9A34A]/50 shadow-2xl p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 text-[#FFF8ED]">
          {/* Subtle Golden Glow / Ornament in background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A34A]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text Content */}
          <div className="max-w-xl z-10 text-left space-y-5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E5C158] text-xs font-semibold uppercase tracking-widest">
              <Sparkles size={12} className="animate-pulse" />
              <span>{badgeText}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
              {title}
            </h2>

            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-light">
              {description}
            </p>

            <div className="pt-3">
              <Link
                href={ctaUrl}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-[#FFF8ED] text-[#003D2D] hover:bg-[#C9A34A] hover:text-[#002D21] rounded-full text-xs sm:text-sm font-semibold uppercase tracking-widest shadow-xl transition-all duration-300 group"
              >
                <span>{ctaText}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Image / Visual Frame */}
          <div className="relative w-full md:w-1/2 aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black/20">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
