'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { getOptimizedImageUrl } from '../../lib/image';

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
  const [banners, setBanners] = useState<BannerItem[]>([
    {
      id: '2eb1f108-a121-454e-a3bd-ecf067aa7c14',
      title: 'Style for Every Occasion',
      subtitle:
        'Discover elegant and comfortable styles for everyday and special moments.',
      desktopImageUrl:
        'https://res.cloudinary.com/ijivdhjz/image/upload/v1794040395/banners/tv02v3lbcmbcotvbgtr8.png',
      mobileImageUrl:
        'https://res.cloudinary.com/ijivdhjz/image/upload/v1794227508/banners/mobile/etlpb34xbb12aiz4ds5l.png',
      ctaText: 'Shop the Collection',
      ctaUrl: '/shop',
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchApi<BannerItem[]>('/banners').then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setBanners(res.data);
      }
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

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const activeBanner = banners[currentIndex] || {
    id: 'default-hero',
    title: 'Style for Every Occasion',
    subtitle:
      'Discover elegant and comfortable styles for everyday and special moments.',
    desktopImageUrl: 'https://res.cloudinary.com/ijivdhjz/image/upload/v1794040395/banners/tv02v3lbcmbcotvbgtr8.png',
    mobileImageUrl: 'https://res.cloudinary.com/ijivdhjz/image/upload/v1794227508/banners/mobile/etlpb34xbb12aiz4ds5l.png',
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
      className="relative w-full"
    >
      {/* ============================================================ */}
      {/* 1. MOBILE HERO BANNER (Matches user's reference design)       */}
      {/* Photo at top with soft gradient fade into cream background  */}
      {/* Title, subtitle, CTA placed down, centered                  */}
      {/* ============================================================ */}
      <div
        className="sm:hidden relative w-full bg-[#FAF4EB] flex flex-col justify-between overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Image Showcase with Soft Bottom Gradient Fade */}
        <div className="relative w-full h-[370px] xs:h-[410px] overflow-hidden bg-[#FAF4EB]">
          {(activeBanner.mobileImageUrl || activeBanner.desktopImageUrl) && (
            <Image
              key={`hero-m-${activeBanner.id}-${currentIndex}`}
              src={getOptimizedImageUrl(activeBanner.mobileImageUrl || activeBanner.desktopImageUrl, {
                width: 900,
                quality: 'auto:good',
              })}
              alt={activeBanner.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
          )}
          {/* Seamless Bottom Gradient Fade into Solid Cream Card */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#FAF4EB] via-[#FAF4EB]/85 to-transparent pointer-events-none" />
        </div>

        {/* Bottom Content Area: Placed Down, Centered */}
        <div className="relative z-10 px-6 pt-1 pb-7 flex flex-col items-center text-center space-y-3 -mt-8">
          {/* Title - Serif Italic, 2 Lines, Elegant Charcoal */}
          <h1 className="font-serif italic text-[32px] xs:text-[36px] text-[#191714] font-normal tracking-tight leading-[1.15]">
            {activeBanner.title.includes('Occasion') ? (
              <>
                Style for<br />Every Occasion
              </>
            ) : (
              activeBanner.title
            )}
          </h1>

          {/* Subtitle - Soft charcoal description */}
          <p className="text-xs xs:text-[13px] text-[#4A453E] max-w-[270px] xs:max-w-[300px] leading-relaxed font-normal">
            {activeBanner.subtitle || 'Discover elegant and comfortable styles for everyday and special moments.'}
          </p>

          {/* Pill CTA Button - Royal Emerald with Gold Accent */}
          <div className="pt-1">
            <Link
              href={activeBanner.ctaUrl || '/shop'}
              className="inline-flex items-center space-x-2 px-7 py-3 bg-[#003828] hover:bg-[#00271D] text-[#FFF8ED] rounded-full text-xs font-semibold tracking-wide shadow-md transition-all duration-200"
            >
              <span>{activeBanner.ctaText || 'Shop the Collection'}</span>
              <ArrowRight size={14} className="text-[#E5C158]" />
            </Link>
          </div>

          {/* Carousel Slide Indicators / Dots */}
          {banners.length > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-2.5 h-2.5 bg-[#003828]'
                      : 'w-2 h-2 bg-[#D1C5B4]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. DESKTOP / TABLET HERO BANNER (>= 640px)                   */}
      {/* Full-width editorial background image with left-aligned copy */}
      {/* ============================================================ */}
      <div className="hidden sm:block relative w-full h-[500px] md:h-[540px] lg:h-[600px] xl:h-[640px] overflow-hidden bg-[#002D21]">
        {/* Full-Width Background Banner Image */}
        <div className="absolute inset-0 w-full h-full">
          {activeBanner.desktopImageUrl && (
            <Image
              key={`hero-d-${activeBanner.id}-${currentIndex}`}
              src={getOptimizedImageUrl(activeBanner.desktopImageUrl, { width: 1920, quality: 'auto:good' })}
              alt={activeBanner.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}

          {/* Editorial Luxury Scrim & Contrast Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15 pointer-events-none" />
        </div>

        {/* Text and CTA Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          <div className="max-w-7xl mx-auto px-10 lg:px-16 w-full">
            <div className="max-w-xl sm:max-w-2xl space-y-4 text-left">
              {/* Editorial Eyebrow Tag */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFF8ED] text-xs font-medium uppercase tracking-widest shadow-sm">
                <span className="text-[#E5C158] shrink-0">✦</span>
                <span>Festive &amp; Everyday Elegance</span>
                <span className="text-[#E5C158] shrink-0">✦</span>
              </div>

              {/* Headline Title */}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-normal leading-[1.12] tracking-tight drop-shadow-md">
                {renderTitle(activeBanner.title)}
              </h1>

              {/* Subtitle / Description */}
              {activeBanner.subtitle && (
                <p className="text-sm md:text-base text-white/90 max-w-lg leading-relaxed font-light drop-shadow">
                  {renderSubtitle(activeBanner.subtitle)}
                </p>
              )}

              {/* Call-to-Action Button */}
              <div className="pt-2">
                <Link
                  href={activeBanner.ctaUrl || '/shop'}
                  className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#FFF8ED] text-[#003D2D] hover:bg-[#C9A34A] hover:text-[#002D21] rounded-full text-xs font-semibold uppercase tracking-widest shadow-xl transition-all duration-300 group"
                >
                  <span>{activeBanner.ctaText || 'Shop the Collection'}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Arrow Controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Banner"
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Banner"
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Desktop Carousel Indicators / Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
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
      </div>
    </section>
  );
};
