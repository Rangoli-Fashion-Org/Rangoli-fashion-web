'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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

  if (!isVisible) {
    return null;
  }

  const badgeText = sectionData?.customData?.badgeText || 'THE FESTIVE EDIT';
  const title = sectionData?.title || 'Festive Elegance';
  const description =
    sectionData?.customData?.description ||
    'Elegant looks crafted with intricate embroidery and rich fabrics for your special moments.';
  const ctaText = sectionData?.customData?.ctaText || 'Explore the Edit';
  const ctaUrl = sectionData?.customData?.ctaUrl || '/shop';
  const imageUrl =
    sectionData?.customData?.imageUrl || '/brand/festive-edit-banner.png';

  return (
    <section className="py-4 sm:py-6 md:py-7 bg-gradient-to-b from-[#F7EDE0] to-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={ctaUrl}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[240px] sm:min-h-[290px] md:min-h-[340px] lg:min-h-[370px] flex items-center shadow-lg border border-[#C9A34A]/40 bg-[#002D21] block group"
        >
          {/* Full-Card Background Image */}
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-right"
          />

          {/* Rich Emerald Gradient Overlay on the Left blending into the right image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00251B] via-[#002D21]/95 sm:via-[#002D21]/85 to-transparent w-full sm:w-3/4 md:w-2/3 pointer-events-none" />

          {/* Left Text & CTA Content */}
          <div className="relative z-20 p-6 sm:p-10 md:p-14 lg:p-16 max-w-sm sm:max-w-md md:max-w-lg text-left flex flex-col justify-center space-y-2.5 sm:space-y-3.5">
            <div className="inline-flex items-center space-x-2 text-[#E5C158] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
              <span>✦</span>
              <span>{badgeText}</span>
              <span>✦</span>
            </div>

            <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#FFF8ED] font-normal leading-tight tracking-tight">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-[#FFF8ED]/85 font-light leading-relaxed max-w-md">
              {description}
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center space-x-2 px-6 sm:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-[#DFC37A] via-[#E5C158] to-[#C9A34A] hover:from-[#FFF2BD] hover:to-[#DFC37A] text-[#00251B] rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all duration-200">
                <span>{ctaText}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};
