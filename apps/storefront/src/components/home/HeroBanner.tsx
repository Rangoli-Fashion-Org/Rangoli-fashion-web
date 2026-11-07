'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchApi<BannerItem[]>('/banners').then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setBanners(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  // Auto-advance slides every 6 seconds when not hovered and multiple banners exist
  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length, isHovered, currentIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (isLoading) {
    return (
      <section className="relative w-full h-[420px] sm:h-[480px] lg:h-[580px] bg-[#002D21]/15 animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C9A34A] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  // If no banners configured in admin, return null
  if (banners.length === 0) {
    return null;
  }

  const activeBanner = banners[currentIndex];

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[420px] sm:h-[480px] md:h-[520px] lg:h-[580px] xl:h-[620px] overflow-hidden bg-[#002D21]"
    >
      {/* 1. Full-Width Background Banner Image (Supports desktop & mobile optimized) */}
      <div className="absolute inset-0 w-full h-full">
        {/* Desktop Image */}
        <div className="relative w-full h-full hidden sm:block">
          <Image
            key={`desktop-${activeBanner.id}-${currentIndex}`}
            src={activeBanner.desktopImageUrl}
            alt={activeBanner.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center transition-transform duration-1000 ease-out scale-100 hover:scale-[1.02]"
          />
        </div>

        {/* Mobile Image (Falls back to desktop image if mobile not uploaded) */}
        <div className="relative w-full h-full sm:hidden">
          <Image
            key={`mobile-${activeBanner.id}-${currentIndex}`}
            src={activeBanner.mobileImageUrl || activeBanner.desktopImageUrl}
            alt={activeBanner.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* 2. Editorial Luxury Scrim & Contrast Gradient Overlay */}
        {/* Dark left/bottom gradient ensures text is 100% readable regardless of image brightness */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/50 sm:to-black/10 pointer-events-none" />
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      </div>

      {/* 3. Text and CTA Placed Directly On Top of the Full-Width Banner */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end sm:justify-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full pb-10 sm:pb-0">
          <div className="max-w-2xl sm:max-w-3xl space-y-3 sm:space-y-4 text-left">
            {/* Editorial Eyebrow Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#FFF8ED] text-[10px] sm:text-xs font-medium uppercase tracking-widest shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158] animate-pulse" />
              <span>Festive &amp; Everyday Elegance</span>
            </div>

            {/* Headline Title */}
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal leading-[1.15] sm:leading-[1.12] tracking-tight drop-shadow-md whitespace-pre-line">
              {activeBanner.title}
            </h1>

            {/* Subtitle / Description */}
            {activeBanner.subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-xl leading-relaxed font-light drop-shadow">
                {activeBanner.subtitle}
              </p>
            )}

            {/* Call-to-Action Button */}
            <div className="pt-2">
              <Link
                href={activeBanner.ctaUrl || '/shop'}
                className="inline-flex items-center space-x-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#FFF8ED] text-[#003D2D] hover:bg-[#C9A34A] hover:text-[#002D21] rounded-full text-xs font-semibold uppercase tracking-widest shadow-xl hover:shadow-[#C9A34A]/40 transition-all duration-300 group"
              >
                <span>{activeBanner.ctaText || 'Shop the Collection'}</span>
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Left & Right Slider Arrow Controls (Rendered if multiple banners) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Banner"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Banner"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* 5. Bottom Carousel Slide Indicators / Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-9 bg-[#E5C158] shadow-lg shadow-[#E5C158]/50'
                  : 'w-2.5 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
