'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fetchApi } from '../../lib/api';

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
}

export const CollectionsGrid: React.FC = () => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<CollectionItem[]>('/collections').then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setCollections(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <section className="py-14 md:py-20 bg-[#FAF6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-[#E8DFD0]/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no collections created in admin, return null
  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="py-14 md:py-20 bg-[#FAF6F0] border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#003D2D]/5 border border-[#C9A34A]/40 text-[#003D2D] text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={12} className="text-[#C9A34A]" />
            <span>Seasonal Drops</span>
          </div>

          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            <div className="h-px w-10 sm:w-16 bg-[#C9A34A]/60" />
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#191714] font-medium tracking-tight">
              Shop by Collection
            </h2>
            <div className="h-px w-10 sm:w-16 bg-[#C9A34A]/60" />
          </div>

          <p className="text-xs sm:text-sm text-[#746D62] max-w-lg">
            Immerse yourself in themed capsules designed for every festivity and intimate celebration.
          </p>
        </div>

        {/* Collection Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/shop?collection=${encodeURIComponent(col.slug)}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block bg-[#002D21]"
            >
              {col.imageUrl ? (
                <Image
                  src={col.imageUrl}
                  alt={col.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  className="object-cover object-top group-hover:scale-106 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#003D2D]/20 text-white font-serif text-lg font-bold p-4 text-center">
                  {col.name}
                </div>
              )}

              {/* Gradient Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              {/* Text & Button */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 text-white z-10">
                <span className="font-serif text-lg sm:text-xl font-medium tracking-wide leading-tight">
                  {col.name}
                </span>
                <span className="inline-flex items-center space-x-1.5 text-xs text-[#E5C158] font-medium mt-2 transform group-hover:translate-x-1 transition-transform duration-200">
                  <span>Explore Capsule</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
