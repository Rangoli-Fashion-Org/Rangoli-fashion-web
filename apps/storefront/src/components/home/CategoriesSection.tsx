'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { getOptimizedImageUrl } from '../../lib/image';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: '8929cbdc-97ce-49c0-902f-69869db999f5',
    name: 'Premium Kurti Set',
    slug: 'premium-kurti-set',
    imageUrl: 'https://res.cloudinary.com/ijivdhjz/image/upload/v1794044221/categories/tqr5ayqaxciykqickcre.png',
    displayOrder: 1,
  },
  {
    id: 'cd71aad3-e52c-4f81-9cfc-aebb8f08d827',
    name: 'Cotton Kurti Set',
    slug: 'cotton-kurti-set',
    imageUrl: 'https://res.cloudinary.com/ijivdhjz/image/upload/v1794044984/categories/p74heoman1gxeciylnzu.png',
    displayOrder: 2,
  },
  {
    id: '148b9440-9ef5-4b24-a99c-e5393e6fc57a',
    name: 'Cord Set',
    slug: 'cord-set',
    imageUrl: 'https://res.cloudinary.com/ijivdhjz/image/upload/v1794045186/categories/chowyzvouiqak6fko8dj.png',
    displayOrder: 3,
  },
  {
    id: 'c3e5ccd3-b6a1-49ca-8839-ad715f524025',
    name: 'Top & Kurties',
    slug: 'top-kurties',
    imageUrl: 'https://res.cloudinary.com/ijivdhjz/image/upload/v1794045263/categories/iedqnkdzhaepjug2xpax.png',
    displayOrder: 4,
  },
];

export const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchApi<CategoryItem[]>('/categories').then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setCategories(res.data);
      }
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

      <div className="relative max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 z-10">
        {/* Royal Section Heading with Gold Filigree Flourishes */}
        <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-9 space-y-1.5">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <span className="text-[#C9A34A] text-xs sm:text-base shrink-0">✦</span>
            <div className="h-px w-8 sm:w-20 bg-gradient-to-r from-transparent to-[#C9A34A] shrink-0" />
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl text-[#191714] font-medium tracking-tight">
              Shop by Category
            </h2>
            <div className="h-px w-8 sm:w-20 bg-gradient-to-l from-transparent to-[#C9A34A] shrink-0" />
            <span className="text-[#C9A34A] text-xs sm:text-base shrink-0">✦</span>
          </div>
          <p className="text-[11px] sm:text-sm text-[#746D62] max-w-md sm:max-w-lg px-2">
            Discover handcrafted styles, timeless traditions, and contemporary ethnic essentials.
          </p>
        </div>

        {/* 4 Royal Jharokha Arched Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${encodeURIComponent(category.slug)}`}
              className="block group select-none"
            >
              {/* Outer Warm Arch Niche / Royal Halo */}
              <div className="p-1 sm:p-2 bg-[#F3E6D6] rounded-t-[64px] sm:rounded-t-[96px] md:rounded-t-[116px] rounded-b-xl sm:rounded-b-3xl shadow-xs border border-[#E6D5BE]">
                {/* Inner Arched Card */}
                <div className="relative aspect-[3/4.5] sm:aspect-[3/4.6] w-full rounded-t-[58px] sm:rounded-t-[90px] md:rounded-t-[110px] rounded-b-lg sm:rounded-b-2xl overflow-hidden bg-[#002D21]">
                  {/* Category Image */}
                  {category.imageUrl ? (
                    <Image
                      src={getOptimizedImageUrl(category.imageUrl, { width: 600, quality: 'auto:good' })}
                      alt={category.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-[#003D2D] to-[#002018] flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#C9A34A]/50 flex items-center justify-center mb-2 sm:mb-3 shrink-0">
                        <span className="font-serif text-[#C9A34A] text-base sm:text-lg font-bold">RF</span>
                      </div>
                      <span className="text-white/60 text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold">
                        {category.name}
                      </span>
                    </div>
                  )}

                  {/* Bottom Gradient Overlay for optimal text contrast */}
                  <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#0a1b14] via-[#0a1b14]/75 to-transparent pointer-events-none group-hover:from-[#05130e] transition-colors duration-300" />

                  {/* Centered Category Title & Luxury Floating Pill/Arrow */}
                  <div className="absolute bottom-0 inset-x-0 px-2 sm:px-3 pb-3 sm:pb-4 pt-6 z-10 flex flex-col items-center justify-end text-center">
                    <h3 className="font-serif text-sm sm:text-base md:text-lg lg:text-xl text-[#FFF8ED] font-normal tracking-wide leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] whitespace-pre-line group-hover:text-[#E5C158] transition-colors duration-300">
                      {formatCategoryTitle(category.name)}
                    </h3>

                    {/* Refined Gold Exploration Badge with Arrow */}
                    <div className="mt-2 sm:mt-2.5 inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 hover:bg-[#C9A34A] backdrop-blur-md border border-[#C9A34A]/50 text-[#E5C158] hover:text-[#002D21] transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:bg-[#C9A34A] group-hover:text-[#002D21]">
                      <span className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider">
                        Explore
                      </span>
                      <ArrowRight size={11} className="sm:w-3 sm:h-3 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
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
