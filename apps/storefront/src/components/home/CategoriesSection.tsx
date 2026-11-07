'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
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

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 bg-[#FFF8ED] border-b border-[#E8DFD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-3 mb-10">
            <div className="h-4 w-32 bg-[#E8DFD0]/60 rounded-full animate-pulse" />
            <div className="h-8 w-64 bg-[#E8DFD0]/80 rounded-md animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[4/5] bg-[#E8DFD0]/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no categories exist in admin, do not render empty section
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-20 bg-[#FAF6F0] border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Decorative Accents */}
        <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#003D2D]/5 border border-[#C9A34A]/40 text-[#003D2D] text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={12} className="text-[#C9A34A]" />
            <span>Curated Silhouettes</span>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-1">
            <div className="h-px w-10 sm:w-16 bg-[#C9A34A]/60" />
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#191714] font-medium tracking-tight">
              Shop by Category
            </h2>
            <div className="h-px w-10 sm:w-16 bg-[#C9A34A]/60" />
          </div>

          <p className="text-xs sm:text-sm text-[#746D62] max-w-lg mt-1">
            Explore handcrafted ethnic wear, everyday cotton sets, and statement festive ensembles tailored for modern elegance.
          </p>
        </div>

        {/* Dynamic Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${encodeURIComponent(category.slug)}`}
              className="group flex flex-col items-center text-center bg-white rounded-2xl p-3 sm:p-4 border border-[#E8DFD0] hover:border-[#C9A34A] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Image Container */}
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#E8DFD0]/60 mb-3 sm:mb-4">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover object-top group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-[#C9A34A] bg-[#FFF8ED]">
                    <div className="w-12 h-12 rounded-full bg-[#003D2D]/10 flex items-center justify-center mb-2">
                      <Sparkles size={22} className="text-[#003D2D]" />
                    </div>
                    <span className="font-serif text-xs font-semibold text-[#191714] line-clamp-1">{category.name}</span>
                  </div>
                )}

                {/* Subtle Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Title & Action */}
              <h3 className="font-serif text-sm sm:text-base font-semibold text-[#191714] group-hover:text-[#003D2D] transition-colors line-clamp-1 mb-1">
                {category.name}
              </h3>

              {category.description && (
                <p className="text-[11px] text-[#746D62] line-clamp-1 mb-2 px-1">
                  {category.description}
                </p>
              )}

              <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#C9A34A] group-hover:text-[#003D2D] transition-colors uppercase tracking-wider mt-auto pt-1">
                <span>Explore</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
