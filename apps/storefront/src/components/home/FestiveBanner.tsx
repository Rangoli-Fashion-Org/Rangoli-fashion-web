'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { getOptimizedImageUrl } from '../../lib/image';

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
    sectionData?.customData?.imageUrl ||
    'https://res.cloudinary.com/ijivdhjz/image/upload/v1794211703/cms/festive/fxbewntsuzv8tzzd9p6q.png';

  return (
    <section className="py-4 sm:py-6 md:py-7 bg-gradient-to-b from-[#F7EDE0] to-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <Link
          href={ctaUrl}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden sm:min-h-[290px] md:min-h-[340px] lg:min-h-[370px] flex flex-col sm:flex-row sm:items-center shadow-lg border border-[#C9A34A]/40 bg-[#00251B] block group"
        >
          {/* Mobile Top Image View - Guarantees the Festive Card Image is 100% visible on mobile */}
          <div className="relative w-full h-52 sm:hidden overflow-hidden bg-[#002D21]">
            <Image
              src={getOptimizedImageUrl(imageUrl, { width: 800, quality: 'auto:good' })}
              alt={title}
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover object-right"
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#00251B] via-[#00251B]/60 to-transparent pointer-events-none" />
          </div>

          {/* Desktop/Tablet Full-Card Background Image */}
          <div className="hidden sm:block absolute inset-0">
            <Image
              src={getOptimizedImageUrl(imageUrl, { width: 1400, quality: 'auto:good' })}
              alt={title}
              fill
              loading="lazy"
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-right"
            />
            {/* Rich Emerald Gradient Overlay on the Left blending into the right image */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00251B] via-[#002D21]/85 to-transparent sm:w-3/4 md:w-2/3 pointer-events-none" />
          </div>

          {/* Text & CTA Content */}
          <div className="relative z-20 px-5 pb-6 pt-2 sm:p-10 md:p-14 lg:p-16 max-w-full sm:max-w-md md:max-w-lg text-left flex flex-col justify-center space-y-2 sm:space-y-3.5">
            <div className="inline-flex items-center space-x-2 text-[#E5C158] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="shrink-0">✦</span>
              <span>{badgeText}</span>
              <span className="shrink-0">✦</span>
            </div>

            <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#FFF8ED] font-normal leading-tight tracking-tight">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-[#FFF8ED]/85 font-light leading-relaxed max-w-md">
              {description}
            </p>

            <div className="pt-1.5 sm:pt-2">
              <span className="inline-flex items-center space-x-2 px-5 sm:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-[#DFC37A] via-[#E5C158] to-[#C9A34A] hover:from-[#FFF2BD] hover:to-[#DFC37A] text-[#00251B] rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all duration-200">
                <span>{ctaText}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};
