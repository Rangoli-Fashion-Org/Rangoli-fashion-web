'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Award,
  Crown,
  Feather,
  Scissors,
  ArrowRight,
  Gem,
  CheckCircle2,
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

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);

  useEffect(() => {
    fetchApi<AboutData>('/settings/about-content').then((res: { success: boolean; data: AboutData }) => {
      if (res.success && res.data) {
        setData(res.data);
      }
    });
  }, []);

  const heading = data?.heading || 'Crafting Timeless Indian Elegance';
  const brandStory =
    data?.brandStory ||
    'Born from a deep reverence for India’s classical textile heritage, Rangoli Fashions blends centuries-old craftsmanship with contemporary everyday silhouettes. Every piece is an invitation to experience luxury that is effortless, breathable, and unmistakably royal.';
  const mission =
    data?.mission ||
    'To preserve classical artisanal techniques, honor handloom communities, and offer discerning women across the world thoughtfully crafted ethnic luxury at honest prices.';
  const vision =
    data?.vision ||
    'To stand as India’s most cherished modern ethnic fashion house, where heritage weaves and contemporary elegance gracefully coexist in every festive celebration and everyday moment.';
  const heroImage = data?.imageUrl || '/brand/festive-edit-banner.png';

  const pillars = [
    {
      icon: <Gem className="w-5 h-5 text-[#C9A34A]" />,
      title: 'Artisanal Integrity',
      description: 'Finely spun fabrics sourced directly from authentic handloom centers across Rajasthan and Gujarat.',
    },
    {
      icon: <Scissors className="w-5 h-5 text-[#C9A34A]" />,
      title: 'Flawless Tailoring',
      description: 'Engineered for fluid drape and supreme ease, ensuring day-to-evening comfort without compromise.',
    },
    {
      icon: <Crown className="w-5 h-5 text-[#C9A34A]" />,
      title: 'Royal Color Palettes',
      description: 'Deep jewel emeralds, rich rubies, soothing ivories, and delicate zari borders that celebrate celebration.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#C9A34A]" />,
      title: '100% Quality Assurance',
      description: 'Multi-stage quality audits guaranteeing seam strength, colorfastness, and durable gold embroidery.',
    },
  ];

  const milestones = [
    { number: '10,000+', label: 'Delighted Patrons', sub: 'Across India & worldwide' },
    { number: '100%', label: 'Authentic Handcraft', sub: 'Pure cotton, silk & modal' },
    { number: '150+', label: 'Exclusive Designs', sub: 'Fresh seasonal drops' },
    { number: '4.9 ★', label: 'Average Customer Rating', sub: 'Based on verified reviews' },
  ];

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#191714]">
      {/* 1. HERO BANNER */}
      <section className="relative bg-[#00271D] text-[#FFF8ED] py-20 sm:py-28 overflow-hidden">
        {/* Subtle Decorative Background Texture */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #C9A34A 1px, transparent 1px), radial-gradient(circle at 80% 70%, #C9A34A 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#003D2D] border border-[#C9A34A]/50 text-[#E5C158] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] shadow-sm">
            <Sparkles size={12} className="text-[#C9A34A]" />
            <span>The Heritage of Rangoli</span>
            <Sparkles size={12} className="text-[#C9A34A]" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-tight text-white">
            {heading}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#F5EBDD]/80 max-w-2xl mx-auto leading-relaxed font-light pt-2">
            Where classical Indian embroidery, opulent silhouettes, and breathable everyday fabrics celebrate the timeless spirit of womanhood.
          </p>

          {/* Golden Flourish Divider */}
          <div className="flex items-center justify-center space-x-3 pt-4">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#C9A34A]" />
            <span className="text-[#C9A34A] text-sm">✦</span>
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#C9A34A]" />
          </div>
        </div>
      </section>

      {/* 2. THE STORY / BRAND LEGACY SECTION */}
      <section className="relative py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Editorial Image with Royal Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-2 sm:p-2.5 bg-[#F3E6D6] rounded-t-[100px] sm:rounded-t-[140px] rounded-b-3xl border border-[#E6D5BE] shadow-xl">
              <div className="relative aspect-[3/4.2] w-full rounded-t-[92px] sm:rounded-t-[132px] rounded-b-2xl overflow-hidden bg-[#002D21]">
                <Image
                  src={getOptimizedImageUrl(heroImage, { width: 900, quality: 'auto:good' })}
                  alt="Rangoli Fashions Heritage"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                {/* Soft Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Floating Luxury Badge */}
            <div className="absolute -bottom-4 -right-2 sm:-bottom-5 sm:right-4 bg-white/95 backdrop-blur-md border border-[#C9A34A] rounded-2xl p-3.5 sm:p-4 shadow-xl flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#003D2D] text-[#C9A34A] flex items-center justify-center shrink-0">
                <Crown size={20} />
              </div>
              <div className="text-left">
                <p className="font-serif text-xs sm:text-sm font-semibold text-[#003D2D]">Handcrafted Perfection</p>
                <p className="text-[10px] text-[#746D62]">Authentic Indian Artisans</p>
              </div>
            </div>
          </div>

          {/* Right: The Brand Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#C9A34A]">
                Since Inception
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#191714] leading-tight">
                Honoring the Sacred Weaves of India
              </h2>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-[#746D62] font-light">
              {brandStory}
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-[#746D62] font-light">
              We believe true ethnic luxury isn’t reserved for once-a-year celebrations. It lives in the delicate breath of pure Jaipur cotton, the soft luster of modal chanderi, and the quiet dignity of a co-ord set tailored precisely for your everyday comfort.
            </p>

            {/* Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Handpicked Natural Fabrics',
                'Ethically Compensated Weavers',
                'Timeless, Flattering Silhouettes',
                'Intricate Zari & Block Detailing',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs font-medium text-[#191714]">
                  <CheckCircle2 size={16} className="text-[#003D2D] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2.5 px-6 py-3 bg-[#003D2D] hover:bg-[#0B5940] text-[#FFF8ED] rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-md group"
              >
                <span>Explore the Collection</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION (ARCHED CARDS) */}
      <section className="bg-gradient-to-b from-[#F3E8D8] via-[#FAF2E6] to-[#FAF6F0] py-16 sm:py-20 border-y border-[#E6D5BE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#C9A34A]">
              Our Guiding Purpose
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#191714]">
              Mission &amp; Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="relative p-8 sm:p-10 bg-white rounded-3xl border border-[#E6D5BE] shadow-md flex flex-col justify-between space-y-4 hover:border-[#C9A34A] transition-colors">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#003D2D] text-[#C9A34A] flex items-center justify-center shadow-md">
                  <Feather size={22} />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#003D2D]">
                  Our Mission
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#746D62] font-light">
                  {mission}
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-semibold text-[#C9A34A]">
                <span>Artisan Empowerment</span>
                <span className="mx-2">•</span>
                <span>Pure Craftsmanship</span>
              </div>
            </div>

            {/* Vision */}
            <div className="relative p-8 sm:p-10 bg-white rounded-3xl border border-[#E6D5BE] shadow-md flex flex-col justify-between space-y-4 hover:border-[#C9A34A] transition-colors">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#003D2D] text-[#C9A34A] flex items-center justify-center shadow-md">
                  <Award size={22} />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#003D2D]">
                  Our Vision
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#746D62] font-light">
                  {vision}
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-semibold text-[#C9A34A]">
                <span>Global Heritage</span>
                <span className="mx-2">•</span>
                <span>Modern Elegance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUR PILLARS OF CRAFTSMANSHIP */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#C9A34A]">
            The Rangoli Standard
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#191714]">
            Pillars of Our Craft
          </h2>
          <p className="text-xs text-[#746D62]">
            What goes into every stitch, silhouette, and garment we deliver.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl border border-[#E8DFD0] shadow-xs flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAF2E6] border border-[#C9A34A]/40 flex items-center justify-center shadow-2xs">
                {p.icon}
              </div>
              <h3 className="font-serif text-base font-semibold text-[#191714]">
                {p.title}
              </h3>
              <p className="text-xs text-[#746D62] leading-relaxed font-light">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STATS / ACHIEVEMENTS RIBBON */}
      <section className="bg-[#002D21] text-white py-12 sm:py-16 border-y border-[#0B5940]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#0B5940]/70">
            {milestones.map((m, idx) => (
              <div key={idx} className={`space-y-1 ${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-4' : ''}`}>
                <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#E5C158]">
                  {m.number}
                </p>
                <p className="text-xs sm:text-sm font-medium text-white">{m.label}</p>
                <p className="text-[10px] text-[#FAF6F0]/70">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-16 sm:py-20 text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
        <Heart size={28} className="text-[#C9A34A] mx-auto fill-[#C9A34A]" />
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#191714]">
          Wear the Story. Feel the Heritage.
        </h2>
        <p className="text-xs sm:text-sm text-[#746D62] max-w-lg mx-auto leading-relaxed font-light">
          Experience our latest celebratory edits and discover the perfect balance of royal elegance and breathable comfort.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 px-7 py-3 bg-[#003D2D] hover:bg-[#0B5940] text-[#FFF8ED] rounded-full text-xs font-semibold tracking-wider uppercase transition-colors shadow-lg"
          >
            <span>Shop New Arrivals</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
