'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { fetchApi } from '../../lib/api';

export const NewArrivals: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<any[]>('/products/new-arrivals?limit=8').then((res) => {
      if (res.success && res.data) {
        setProducts(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="py-14 md:py-24 bg-white border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#003D2D]/5 border border-[#C9A34A]/40 text-[#003D2D] text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={12} className="text-[#C9A34A]" />
            <span>Fresh Off The Loom</span>
          </div>

          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            <div className="h-px w-10 sm:w-16 bg-[#C9A34A]/60" />
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#191714] font-medium tracking-tight">
              New Arrivals
            </h2>
            <div className="h-px w-10 sm:w-16 bg-[#C9A34A]/60" />
          </div>

          <p className="text-xs sm:text-sm text-[#746D62] max-w-lg">
            Our latest hand-picked silhouettes, celebratory palette, and breathable festive luxury.
          </p>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-[#FAF6F0] animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                regularPrice={p.regularPrice}
                salePrice={p.salePrice}
                discountPercentage={p.discountPercentage}
                images={p.images}
                averageRating={p.averageRating}
                reviewCount={p.reviewCount}
                isNewArrival={p.isNewArrival}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 rounded-3xl bg-[#FAF6F0] border border-[#E8DFD0] max-w-md mx-auto space-y-3">
            <Sparkles size={28} className="text-[#C9A34A] mx-auto" />
            <h4 className="font-serif text-lg font-semibold text-[#191714]">New Collection Arriving Soon</h4>
            <p className="text-xs text-[#746D62]">
              Our artisans are finishing the latest festive drop. Check back soon or explore our existing categories.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors mt-2"
            >
              <span>Explore All Styles</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Bottom Call to Action */}
        {products.length > 0 && (
          <div className="mt-12 sm:mt-16 text-center">
            <Link
              href="/shop?filter=new_arrivals"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-transparent border-2 border-[#003D2D] hover:bg-[#003D2D] text-[#003D2D] hover:text-[#FFF8ED] rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-xs hover:shadow-lg group"
            >
              <span>View All New Arrivals</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
