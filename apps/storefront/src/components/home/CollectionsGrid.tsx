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

  useEffect(() => {
    fetchApi<CollectionItem[]>('/collections').then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setCollections(res.data);
      }
    });
  }, []);

  // Default collections matching the reference design
  const displayCollections = collections.length > 0 ? collections : [
    { id: '1', name: 'Premium Kurti Set', slug: 'premium-kurti-set', imageUrl: '/brand/rf-monogram.jpg' },
    { id: '2', name: 'Cotton Kurti Set', slug: 'cotton-kurti-set', imageUrl: '/brand/rf-monogram.jpg' },
    { id: '3', name: 'Cord Set', slug: 'cord-set', imageUrl: '/brand/rf-monogram.jpg' },
    { id: '4', name: 'Top & Kurties', slug: 'top-kurties', imageUrl: '/brand/rf-monogram.jpg' },
  ];

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

        {/* 4 Collection Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {displayCollections.map((col) => (
            <Link
              key={col.id}
              href={`/shop?collection=${col.slug}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block bg-[#E8DFD0]"
            >
              <Image
                src={col.imageUrl || '/brand/rf-monogram.jpg'}
                alt={col.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                <h3 className="font-serif text-base sm:text-lg md:text-xl font-semibold leading-tight drop-shadow-xs">
                  {col.name}
                </h3>
                <div className="mt-2 inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-[#DFC37A] group-hover:text-white transition-colors">
                  <span>Explore</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

