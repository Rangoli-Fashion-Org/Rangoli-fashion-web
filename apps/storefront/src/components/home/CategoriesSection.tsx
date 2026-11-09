'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { fetchApi } from '../../lib/api';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
}

export const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<CategoryItem[]>('/categories').then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setCategories(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  // Format category name so 3-word titles wrap gracefully like the reference design
  const formatCategoryTitle = (name: string) => {
    const trimmed = name.trim();
    if (trimmed.toLowerCase() === 'premium kurti set' || trimmed.toLowerCase() === 'premium kurthi set') {
      const words = trimmed.split(/\s+/);
      return `${words[0]}\n${words.slice(1).join(' ')}`;
    }
    if (trimmed.toLowerCase() === 'cotton kurti set' || trimmed.toLowerCase() === 'cotton kurthi set') {
      const words = trimmed.split(/\s+/);
      return `${words[0]}\n${words.slice(1).join(' ')}`;
    }
    return trimmed;
  };

  if (isLoading) {
    return (
      <section className="py-8 sm:py-11 md:py-12 bg-[#FFF8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4.6] bg-[#E8DFD0]/40 rounded-t-[80px] rounded-b-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="relative pt-8 pb-6 sm:pt-11 sm:pb-8 md:pt-12 md:pb-10 bg-gradient-to-b from-[#FFFDF9] via-[#FDF6EB] to-[#F7EDE0] overflow-hidden">
      {/* Soft Warm Radial Glow Behind Category Cards */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(201, 163, 74, 0.12) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Royal Section Heading with Gold Filigree Flourishes */}
        <div className="flex flex-col items-center justify-center text-center mb-7 sm:mb-9 space-y-1.5">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            <span className="text-[#C9A34A] text-sm sm:text-base">✦</span>
            <div className="h-px w-10 sm:w-20 bg-gradient-to-r from-transparent to-[#C9A34A]" />
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#191714] font-medium tracking-tight">
              Shop by Category
            </h2>
            <div className="h-px w-10 sm:w-20 bg-gradient-to-l from-transparent to-[#C9A34A]" />
            <span className="text-[#C9A34A] text-sm sm:text-base">✦</span>
          </div>
          <p className="text-xs sm:text-sm text-[#746D62] max-w-lg">
            Discover handcrafted styles, timeless traditions, and contemporary ethnic essentials.
          </p>
        </div>

        {/* 4 Royal Jharokha Arched Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${encodeURIComponent(category.slug)}`}
              className="block group select-none"
            >
              {/* Outer Warm Arch Niche / Royal Halo */}
              <div className="p-1.5 sm:p-2 bg-[#F3E6D6] rounded-t-[76px] sm:rounded-t-[96px] md:rounded-t-[116px] rounded-b-2xl sm:rounded-b-3xl shadow-xs border border-[#E6D5BE]">
                {/* Inner Arched Card */}
                <div className="relative aspect-[3/4.6] w-full rounded-t-[70px] sm:rounded-t-[90px] md:rounded-t-[110px] rounded-b-xl sm:rounded-b-2xl overflow-hidden bg-[#002D21]">
                  {/* Category Image */}
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-[#003D2D] to-[#002018] flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 rounded-full border border-[#C9A34A]/50 flex items-center justify-center mb-3">
                        <span className="font-serif text-[#C9A34A] text-lg font-bold">RF</span>
                      </div>
                      <span className="text-white/60 text-[11px] uppercase tracking-widest font-semibold">
                        {category.name}
                      </span>
                    </div>
                  )}

                  {/* Bottom-Only Rich Espresso Vignette so model stays bright and text has high contrast */}
                  <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#140C08]/95 via-[#140C08]/65 to-transparent pointer-events-none" />

                  {/* Centered Editorial Category Title & Gold Circle Arrow */}
                  <div className="absolute bottom-0 inset-x-0 px-3 pb-3.5 sm:pb-4 pt-6 z-10 flex flex-col items-center justify-end text-center">
                    <h3 className="font-serif text-base sm:text-lg md:text-xl lg:text-[22px] text-[#FFF8ED] font-normal tracking-wide leading-[1.2] drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)] whitespace-pre-line">
                      {formatCategoryTitle(category.name)}
                    </h3>

                    {/* Circular Gold Arrow Button */}
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#C9A34A] via-[#E5C158] to-[#F5DF98] text-[#00251B] flex items-center justify-center mt-2 shadow-md">
                      <ArrowRight size={13} className="stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
