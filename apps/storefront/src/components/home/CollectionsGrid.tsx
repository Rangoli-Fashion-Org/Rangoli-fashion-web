'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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
              <div key={i} className="aspect-[3/4] bg-[#E8DFD0]/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no collections created in admin, do not show hardcoded mock collections
  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="py-14 md:py-20 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Decorative Lines */}
        <div className="flex items-center justify-center space-x-4 mb-10 md:mb-14">
          <div className="h-px w-12 sm:w-20 bg-[#C9A34A]/60" />
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#191714] font-medium tracking-tight text-center">
            Shop by Collection
          </h2>
          <div className="h-px w-12 sm:w-20 bg-[#C9A34A]/60" />
        </div>

        {/* Collection Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/shop?collection=${col.slug}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block bg-[#E8DFD0]"
            >
              {col.imageUrl ? (
                <Image
                  src={col.imageUrl}
                  alt={col.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#003D2D]/10 text-[#003D2D] font-serif text-lg font-bold p-4 text-center">
                  {col.name}
                </div>
              )}

              {/* Gradient Overlay & Title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                <span className="font-serif text-base sm:text-lg font-medium tracking-wide">
                  {col.name}
                </span>
                <span className="inline-flex items-center space-x-1 text-xs text-[#C9A34A] font-semibold mt-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>Explore Collection</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
