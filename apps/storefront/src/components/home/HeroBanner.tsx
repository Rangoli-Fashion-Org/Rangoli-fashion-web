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

  const activeBanner = banners[currentIndex] || {
    id: 'default-hero',
    title: 'Style for Every Occasion',
    subtitle:
      'Discover handcrafted ethnic elegance, luxury chanderi silk kurtis, and contemporary festive co-ords tailored to perfection.',
    desktopImageUrl: '/brand/festive-edit-banner.png',
    ctaText: 'Shop the Collection',
    ctaUrl: '/shop',
  };

  // Format title: If it has "Occasion", style "Occasion" with italic gold calligraphy
  // and break cleanly across 2 natural editorial lines on mobile
  const renderTitle = (titleText: string) => {
    if (titleText.includes('Occasion')) {
      const parts = titleText.split('Occasion');
      return (
        <>
          <span className="block sm:inline">{parts[0]}</span>
          <span className="font-serif italic text-[#E5C158] drop-shadow-md">Occasion</span>
          {parts[1]}
        </>
      );
    }

    // For any custom banner title, wrap nicely so it doesn't leave an awkward orphan word
    const words = titleText.trim().split(/\s+/);
    if (words.length >= 3) {
      const mid = Math.ceil(words.length / 2);
      const firstLine = words.slice(0, mid).join(' ');
      const secondLine = words.slice(mid).join(' ');
      return (
        <>
          <span className="block sm:inline">{firstLine}</span>{' '}
          <span className="block sm:inline">{secondLine}</span>
        </>
      );
    }
    return titleText;
  };

  // Format subtitle cleanly on mobile into crisp, balanced phrases
  const renderSubtitle = (subText: string) => {
    // If it's the standard default subtitle, divide it at the comma for elegant reading
    if (subText.includes(',')) {
      const parts = subText.split(',');
      return (
        <>
          <span className="block sm:inline">{parts[0].trim()}</span>
          {parts.length > 1 && (
            <span className="block sm:inline text-white/80 mt-0.5 sm:mt-0">
              {`, ${parts.slice(1).join(',').trim()}`}
            </span>
          )}
        </>
      );
    }
    return subText;
  };

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[520px] sm:h-[500px] md:h-[540px] lg:h-[600px] xl:h-[640px] overflow-hidden bg-[#002D21]"
    >
      {/* 1. Full-Width Background Banner Image */}
      <div className="absolute inset-0 w-full h-full">
        {/* Mobile image (< 640px): uses the dedicated mobile banner, falls back to desktop image */}
        {(activeBanner.mobileImageUrl || activeBanner.desktopImageUrl) && (
          <div className="absolute inset-0 sm:hidden">
            <Image
              key={`hero-m-${activeBanner.id}-${currentIndex}`}
              src={activeBanner.mobileImageUrl || activeBanner.desktopImageUrl}
              alt={activeBanner.title}
              fill
              priority
              sizes="100vw"
              className={`object-cover ${
                activeBanner.mobileImageUrl ? 'object-top' : 'object-[75%_top]'
              }`}
            />
          </div>
        )}

        {/* Desktop/Tablet image (>= 640px) */}
        {activeBanner.desktopImageUrl && (
          <div className="absolute inset-0 hidden sm:block">
            <Image
              key={`hero-d-${activeBanner.id}-${currentIndex}`}
              src={activeBanner.desktopImageUrl}
              alt={activeBanner.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        )}

        {/* Editorial Luxury Scrim & Contrast Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001F17]/95 via-[#001F17]/50 to-transparent sm:bg-gradient-to-r sm:from-black/85 sm:via-black/55 sm:to-black/15 pointer-events-none" />
      </div>

      {/* 2. Text and CTA Placed Directly On Top - Centered vertically on mobile with slight top offset */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 w-full -mt-6 sm:mt-0 pb-6 sm:pb-0">
          <div className="max-w-xl sm:max-w-2xl space-y-2.5 sm:space-y-4 text-left">
            {/* Editorial Eyebrow Tag */}
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFF8ED] text-[9px] sm:text-xs font-medium uppercase tracking-widest shadow-sm">
              <span className="text-[#E5C158] shrink-0">✦</span>
              <span>Festive &amp; Everyday Elegance</span>
              <span className="text-[#E5C158] shrink-0">✦</span>
            </div>

            {/* Headline Title */}
            <h1 className="font-serif text-[28px] sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal leading-[1.2] sm:leading-[1.12] tracking-tight drop-shadow-md">
              {renderTitle(activeBanner.title)}
            </h1>

            {/* Subtitle / Description */}
            {activeBanner.subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-sm sm:max-w-lg leading-relaxed font-light drop-shadow">
                {renderSubtitle(activeBanner.subtitle)}
              </p>
            )}

            {/* Call-to-Action Button */}
            <div className="pt-2 sm:pt-2">
              <Link
                href={activeBanner.ctaUrl || '/shop'}
                className="inline-flex items-center space-x-2 px-5 sm:px-8 py-2.5 sm:py-3.5 bg-[#FFF8ED] text-[#003D2D] hover:bg-[#C9A34A] hover:text-[#002D21] rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-widest shadow-xl transition-all duration-300 group"
              >
                <span>{activeBanner.ctaText || 'Shop the Collection'}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Slider Arrow Controls (Rendered if multiple banners) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Banner"
            className="absolute left-2.5 sm:left-6 top-[35%] sm:top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200"
          >
            <ChevronLeft size={18} className="sm:w-[22px] sm:h-[22px]" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Banner"
            className="absolute right-2.5 sm:right-6 top-[35%] sm:top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200"
          >
            <ChevronRight size={18} className="sm:w-[22px] sm:h-[22px]" />
          </button>
        </>
      )}

      {/* 4. Carousel Slide Indicators / Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3.5 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-7 sm:w-9 bg-[#E5C158] shadow-lg shadow-[#E5C158]/50'
                  : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
