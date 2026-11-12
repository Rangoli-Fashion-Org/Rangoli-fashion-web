'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Feather,
  ArrowRight,
} from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { getOptimizedImageUrl } from '../../lib/image';

interface AboutData {
  heading?: string;
  brandStory?: string;
  mission?: string;
  vision?: string;
  imageUrl?: string;
}

/* 1. Lotus Royal Flourish Divider */
function GoldOrnament({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center space-x-3 my-3.5 ${className}`}>
      <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A34A]/70 to-[#C9A34A]" />
      <svg
        className="w-5 h-5 text-[#C9A34A]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3.5C12 3.5 10.2 7 8 8.5C5.8 10 3 9.5 3 9.5C3 9.5 4.8 12.5 8 13.5C10.5 14.3 12 17.5 12 17.5C12 17.5 13.5 14.3 16 13.5C19.2 12.5 21 9.5 21 9.5C21 9.5 18.2 10 16 8.5C13.8 7 12 3.5 12 3.5Z" />
        <path d="M12 7.5C12 7.5 10.8 10 9 11.2C7.2 12.4 5.5 12 5.5 12C5.5 12 7 14 9.5 14.5C11 14.8 12 17 12 17C12 17 13 14.8 14.5 14.5C17 14 18.5 12 18.5 12C18.5 12 16.8 12.4 15 11.2C13.2 10 12 7.5 12 7.5Z" />
        <circle cx="12" cy="19.5" r="1" fill="#C9A34A" />
      </svg>
      <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#C9A34A]/70 to-[#C9A34A]" />
    </div>
  );
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<AboutData>('/settings/about-content').then((res: { success: boolean; data: AboutData }) => {
      if (res.success && res.data) {
        setData(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  const heading = data?.heading || 'Crafting Timeless Indian Elegance';
  const brandStory =
    data?.brandStory ||
    "Born from a reverence for India's textile heritage, Rangoli Fashions blends traditional craftsmanship with contemporary silhouettes. Every piece is designed to bring timeless elegance, comfort and a touch of royal sophistication to your celebrations.";
  const mission =
    data?.mission ||
    "To celebrate India's rich textile heritage by creating elegant, comfortable and consciously crafted ethnic wear.";
  const vision =
    data?.vision ||
    'To be a trusted ethnic wear brand that brings Indian craftsmanship to a global stage while empowering artisan communities.';
  const heroImage =
    data?.imageUrl ||
    'https://res.cloudinary.com/ijivdhjz/image/upload/v1794475302/about/t4fa9wsun8uyb78smv7e.png';

  /* Story 2x2 Feature Items with refined luxury badges */
  const storyFeatures = [
    {
      title: 'Handpicked Natural Fabrics',
      icon: (
        <svg
          className="w-5 h-5 text-[#C9A34A]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20c0 0 2-8 9-11s9-5 9-5-2 9-5 12-10 4-13 4z" />
          <path d="M4 20c4-4 8-7 13-11" />
        </svg>
      ),
    },
    {
      title: 'Ethically Crafted Weaves',
      icon: (
        <svg
          className="w-5 h-5 text-[#C9A34A]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.4" />
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      ),
    },
    {
      title: 'Flattering Silhouettes',
      icon: (
        <svg
          className="w-5 h-5 text-[#C9A34A]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 3h6l2 4-2 2 4 11H5l4-11-2-2 2-4z" />
          <path d="M9 3a3 3 0 0 0 6 0" />
          <path d="M12 6v5" />
        </svg>
      ),
    },
    {
      title: 'Intricate Zari Detailing',
      icon: (
        <svg
          className="w-5 h-5 text-[#C9A34A]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
  ];

  /* 4 Pillars of Our Craft */
  const pillars = [
    {
      title: 'Artisanal Integrity',
      description: 'Handloom fabrics sourced directly from traditional artisan clusters across Rajasthan & Gujarat.',
      icon: (
        <svg
          className="w-7 h-7 text-[#E5C158]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3c-1.5 3-3 6.5-3 9.5 0 3 1.5 5 3 6.5 1.5-1.5 3-3.5 3-6.5 0-3-1.5-6.5-3-9.5z" />
          <path d="M9 12.5C6.5 11 4.5 10.5 3 11c0 3 2 6 5.5 7.5" />
          <path d="M15 12.5C17.5 11 19.5 10.5 21 11c0 3-2 6-5.5 7.5" />
          <path d="M7 17.5c-2 .5-3.5 2-4 3.5 2 .5 4 0 6-1" />
          <path d="M17 17.5c2 .5 3.5 2 4 3.5-2 .5-4 0-6-1" />
        </svg>
      ),
    },
    {
      title: 'Flawless Tailoring',
      description: 'Engineered for fluid drape, effortless everyday movement, and royal comfort.',
      icon: (
        <svg
          className="w-7 h-7 text-[#E5C158]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 19h18" />
          <path d="M4 19V7a2 2 0 0 1 2-2h10a3 3 0 0 1 3 3v2" />
          <path d="M19 10v9" />
          <path d="M8 5v4" />
          <path d="M8 12v4" />
          <circle cx="16" cy="11" r="2.5" />
          <path d="M16 11h.01" />
        </svg>
      ),
    },
    {
      title: 'Royal Color Palettes',
      description: 'Opulent jewel emeralds, rich rubies, soothing ivories, and delicate zari borders.',
      icon: (
        <svg
          className="w-7 h-7 text-[#E5C158]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z" />
          <circle cx="7.5" cy="10.5" r="1" fill="#E5C158" />
          <circle cx="10.5" cy="6.5" r="1" fill="#E5C158" />
          <circle cx="14.5" cy="6.5" r="1" fill="#E5C158" />
          <circle cx="17.5" cy="10.5" r="1" fill="#E5C158" />
        </svg>
      ),
    },
    {
      title: 'Quality Assurance',
      description: 'Multi-stage quality audits ensuring lasting seam strength, colorfastness, and durable embroidery.',
      icon: (
        <svg
          className="w-7 h-7 text-[#E5C158]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 18.5c-4.5-2.5-5.8-6.2-5.8-6.2V6.2L12 3.8l5.8 2.4V12.3s-1.3 3.7-5.8 6.2z" strokeWidth="0.8" strokeDasharray="1.5 2.5" />
          <path d="m9.5 12 2 2 3.5-3.5" strokeWidth="1.8" />
        </svg>
      ),
    },
  ];

  /* 4 Stats Banner Columns */
  const milestones = [
    {
      number: '10,000+',
      label: 'Delighted Patrons',
      sub: 'Across India & worldwide',
      icon: (
        <svg
          className="w-7 h-7 text-[#E5C158] mx-auto mb-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      number: '100%',
      label: 'Authentic Handcraft',
      sub: 'Pure cotton, silk & chanderi',
      icon: (
        <svg
          className="w-7 h-7 text-[#E5C158] mx-auto mb-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5" />
          <path d="M8 8c-2 1-3 3-3 5 0 2.5 1.8 4.7 4 5" />
          <path d="M16 8c2 1 3 3 3 5 0 2.5-1.8 4.7-4 5" />
          <path d="M7 6c-1.5 1-2.5 2.5-2.5 4" />
          <path d="M17 6c1.5 1 2.5 2.5 2.5 4" />
          <circle cx="12" cy="4" r="1" fill="#E5C158" />
        </svg>
      ),
    },
    {
      number: '150+',
      label: 'Exclusive Designs',
      sub: 'Curated seasonal festive edits',
      icon: (
        <svg
          className="w-7 h-7 text-[#E5C158] mx-auto mb-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 12 12 17 22 12" />
          <polyline points="2 17 12 22 22 17" />
        </svg>
      ),
    },
    {
      number: '4.9 ★',
      label: 'Average Customer Rating',
      sub: 'Based on verified reviews',
      icon: (
        <svg className="w-7 h-7 text-[#E5C158] fill-[#E5C158] mx-auto mb-2" viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-[#FAF6F0] min-h-screen">
        <section className="bg-[#00271D] py-20 sm:py-28 animate-pulse text-center">
          <div className="max-w-2xl mx-auto px-4 space-y-4">
            <div className="h-4 w-36 bg-white/10 rounded-full mx-auto" />
            <div className="h-10 w-3/4 bg-white/20 rounded mx-auto" />
            <div className="h-4 w-1/2 bg-white/10 rounded mx-auto" />
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
          <div className="lg:col-span-5 h-[480px] bg-[#E8DFD0]/60 rounded-t-full rounded-b-2xl" />
          <div className="lg:col-span-7 space-y-5">
            <div className="h-4 w-32 bg-[#E8DFD0]/80 rounded" />
            <div className="h-10 w-3/4 bg-[#E8DFD0] rounded" />
            <div className="h-28 w-full bg-[#E8DFD0]/50 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#191714]">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#00271D] via-[#003828] to-[#002217] text-[#FFF8ED] py-20 sm:py-28 overflow-hidden">
        {/* Subtle Luxury Pattern Background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #C9A34A 1px, transparent 1px), radial-gradient(circle at 80% 70%, #C9A34A 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3.5 z-10">
          <p className="text-[#C9A34A] text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase">
            ABOUT RANGOLI FASHIONS
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-normal leading-[1.15] text-white">
            Crafting Timeless <br />
            Indian <span className="italic text-[#E5C158] font-normal">Elegance</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#F5EBDD]/80 max-w-xl mx-auto leading-relaxed font-light pt-1">
            Where India&apos;s rich textile heritage meets refined craftsmanship to create ethnic wear for every celebration.
          </p>

          {/* Lotus Flourish Ornament */}
          <GoldOrnament className="pt-2" />
        </div>
      </section>

      {/* 2. THE STORY / SINCE INCEPTION SECTION */}
      <section className="relative py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Royal Arch Frame with Generous Headroom */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px]">
              {/* Outer Golden Border Arch */}
              <div className="relative p-2.5 sm:p-3 rounded-t-full rounded-b-2xl border-2 border-[#C9A34A] bg-[#FFFDF9] shadow-[0_12px_36px_-6px_rgba(201,163,74,0.22)]">
                {/* Inner Delicate Matting Hairline */}
                <div className="relative p-1 rounded-t-full rounded-b-xl border border-[#E6D7C3]">
                  {/* Portrait Photograph Arch */}
                  <div className="relative aspect-[3/4] w-full rounded-t-full rounded-b-lg overflow-hidden bg-[#002D21]">
                    {heroImage && (
                      <Image
                        src={getOptimizedImageUrl(heroImage, { width: 900, quality: 'auto:good' })}
                        alt="Rangoli Fashions Craftsmanship"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 420px"
                        className="object-cover object-[center_12%]"
                      />
                    )}
                    {/* Subtle Base Shade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: The Brand Narrative */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C9A34A]">
                  SINCE INCEPTION
                </span>
                <div className="w-12 h-px bg-[#C9A34A]" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#191714] leading-[1.2]">
                Honoring the Sacred <br />
                Weaves of India
              </h2>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-[#5F584D] font-light">
              {brandStory}
            </p>

            {/* 4 Feature Items with Luxury Circular Badges (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-3">
              {storyFeatures.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3.5 group">
                  <div className="w-9 h-9 rounded-full bg-[#FAF3E7] border border-[#C9A34A]/30 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[#C9A34A] group-hover:bg-[#F6ECE0] transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-xs sm:text-[13px] font-medium text-[#241F1A] tracking-wide">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2.5 px-8 py-3.5 bg-[#003828] hover:bg-[#00271D] hover:shadow-lg hover:shadow-[#003828]/20 border border-[#004D38] text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 group"
              >
                <span>EXPLORE THE COLLECTION</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#E5C158]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR MISSION & VISION */}
      <section className="py-14 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#191714]">
            Our Mission &amp; Vision
          </h2>
          <GoldOrnament />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Mission Card */}
          <div className="p-7 sm:p-9 bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EC] rounded-2xl border border-[#E6D7C3] shadow-[0_6px_25px_-5px_rgba(201,163,74,0.12)] flex items-start space-x-5 hover:border-[#C9A34A] hover:shadow-md transition-all duration-300">
            <div className="shrink-0 text-[#C9A34A] pt-1">
              <Feather className="w-11 h-11 stroke-[1.3]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#191714]">
                Our Mission
              </h3>
              <p className="text-xs sm:text-sm text-[#5F584D] leading-relaxed font-light">
                {mission}
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="p-7 sm:p-9 bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EC] rounded-2xl border border-[#E6D7C3] shadow-[0_6px_25px_-5px_rgba(201,163,74,0.12)] flex items-start space-x-5 hover:border-[#C9A34A] hover:shadow-md transition-all duration-300">
            <div className="shrink-0 text-[#C9A34A] pt-1">
              {/* Faceted Diamond Wireframe */}
              <svg
                className="w-11 h-11 text-[#C9A34A]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
                <path d="M2 9h20M10 3l-2 6 4 12 4-12-2-6M6 3l4 6M18 3l-4 6" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#191714]">
                Our Vision
              </h3>
              <p className="text-xs sm:text-sm text-[#5F584D] leading-relaxed font-light">
                {vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE PILLARS OF OUR CRAFT */}
      <section className="py-14 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C9A34A]">
            The Rangoli Standard
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#191714]">
            The Pillars of Our Craft
          </h2>
          <p className="text-xs sm:text-sm text-[#5F584D] font-light leading-relaxed">
            What goes into every stitch, silhouette, and heirloom garment we create.
          </p>
          <GoldOrnament />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EC] rounded-2xl border border-[#E6D7C3] shadow-[0_4px_20px_-4px_rgba(201,163,74,0.1)] hover:border-[#C9A34A] hover:shadow-[0_8px_25px_-5px_rgba(201,163,74,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center space-y-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#003828] text-[#E5C158] border border-[#C9A34A]/50 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                {p.icon}
              </div>
              <h3 className="font-serif text-base sm:text-lg font-medium text-[#191714]">
                {p.title}
              </h3>
              <p className="text-xs text-[#5F584D] leading-relaxed font-light">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STATS / ACHIEVEMENTS RIBBON */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-16">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C9A34A]">
            A Legacy of Excellence
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#191714]">
            Our Journey in Numbers
          </h2>
          <p className="text-xs sm:text-sm text-[#5F584D] font-light leading-relaxed">
            A testament to the devotion, craftsmanship, and customer trust behind Rangoli Fashions.
          </p>
          <GoldOrnament />
        </div>

        <div className="bg-gradient-to-r from-[#00271D] via-[#003828] to-[#00271D] text-white rounded-3xl py-10 px-6 sm:px-10 shadow-xl border border-[#C9A34A]/30">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {milestones.map((m, idx) => (
              <div key={idx} className={`space-y-1.5 ${idx !== 0 ? 'pt-6 lg:pt-0 lg:pl-6' : ''}`}>
                {m.icon}
                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#E5C158] tracking-tight">
                  {m.number}
                </p>
                <p className="text-xs sm:text-sm font-medium text-white/95 tracking-wide">{m.label}</p>
                <p className="text-[11px] text-[#FAF6F0]/65 font-light">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WEAR THE STORY / BOTTOM CTA SECTION */}
      <section className="py-16 sm:py-24 text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191714] leading-tight">
          Wear the Story. Feel the Heritage.
        </h2>

        <p className="text-xs sm:text-sm text-[#5F584D] max-w-md mx-auto leading-relaxed font-light">
          Discover our latest collections, crafted with devotion and a deep respect for India&apos;s timeless artistry.
        </p>

        <div className="pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2.5 px-8 py-3.5 bg-[#FFFDF9] hover:bg-[#FAF3E7] text-[#191714] hover:text-[#003828] border border-[#C9A34A] rounded-full text-xs font-semibold tracking-widest uppercase transition-all shadow-sm group"
          >
            <span>DISCOVER THE COLLECTION</span>
            <ArrowRight size={14} className="text-[#C9A34A] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
