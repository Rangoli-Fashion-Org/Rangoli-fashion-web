'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { fetchApi } from '../../lib/api';

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string | null;
  desktopImageUrl: string;
  mobileImageUrl?: string | null;
  ctaText: string;
  ctaUrl: string;
}

export const HeroBanner: React.FC = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<BannerItem[]>('/banners').then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setBanners(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <section className="relative w-full bg-[#FFF8ED] py-16 sm:py-24 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-64 sm:h-96 rounded-2xl bg-[#E8DFD0]/40" />
        </div>
      </section>
    );
  }

  // If no banners configured in admin, return null
  if (banners.length === 0) {
    return null;
  }

  const activeBanner = banners[currentIndex];

  return (
    <section className="relative w-full bg-[#FFF8ED] overflow-hidden border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6 z-10 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#F5EBDD] rounded-full border border-[#C9A34A]/40 text-xs font-medium text-[#003D2D]">
              <span className="w-2 h-2 rounded-full bg-[#C9A34A]" />
              <span>Festive &amp; Everyday Elegance</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#191714] font-normal leading-[1.15] tracking-tight whitespace-pre-line">
              {activeBanner.title}
            </h1>

            {activeBanner.subtitle && (
              <p className="text-sm sm:text-base md:text-lg text-[#746D62] max-w-lg leading-relaxed font-normal">
                {activeBanner.subtitle}
              </p>
            )}

            <Link
              href={activeBanner.ctaUrl || '/shop'}
              className="inline-flex items-center space-x-2.5 px-7 py-3.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-full text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <span>{activeBanner.ctaText || 'Shop the Collection'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Slider Dots */}
            {banners.length > 1 && (
              <div className="flex items-center space-x-2 pt-4">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-8 bg-[#003D2D]' : 'w-2.5 bg-[#003D2D]/20 hover:bg-[#003D2D]/50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Image / Hero Visual */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/60 bg-[#F5EBDD]">
              <Image
                src={activeBanner.desktopImageUrl}
                alt={activeBanner.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
