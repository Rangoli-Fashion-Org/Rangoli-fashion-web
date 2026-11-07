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

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 bg-[#FFF8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/5] bg-[#E8DFD0]/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no categories exist, return null
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FFF8ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Cards Responsive Grid matching user's reference design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${encodeURIComponent(category.slug)}`}
              className="group relative aspect-[3/5] rounded-2xl sm:rounded-[22px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 block bg-[#002D21]"
            >
              {/* Full-Card Background Image */}
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-[#003D2D] to-[#002018] flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full border border-[#C9A34A]/50 flex items-center justify-center mb-3">
                    <span className="font-serif text-[#C9A34A] text-lg font-bold">RF</span>
                  </div>
                  <span className="text-white/60 text-[11px] uppercase tracking-widest font-semibold">
                    Upload image in Admin
                  </span>
                </div>
              )}

              {/* Bottom Dark Gradient Vignette Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

              {/* Text Overlay: Serif Title and "Explore →" aligned at bottom-left */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10 flex flex-col items-start text-left">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-white font-normal sm:font-medium leading-tight drop-shadow-sm whitespace-pre-line">
                  {category.name}
                </h3>

                <div className="inline-flex items-center space-x-1.5 text-white/95 group-hover:text-[#E5C158] text-xs sm:text-sm font-medium tracking-wide mt-2 sm:mt-2.5 transition-colors">
                  <span>Explore</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
