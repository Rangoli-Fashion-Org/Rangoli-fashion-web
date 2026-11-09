'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { fetchApi } from '../../lib/api';

export const NewArrivals: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    fetchApi<any[]>('/products/new-arrivals?limit=8').then((res) => {
      if (res.success && res.data) {
        setProducts(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const displayedProducts = products.slice(
    pageIndex * itemsPerPage,
    (pageIndex + 1) * itemsPerPage
  );

  return (
    <section className="relative py-8 sm:py-10 md:py-12 bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F1] to-[#F6ECE0] overflow-hidden">
      {/* Subtle Ambient Gold Radial Light */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 50% 45%, rgba(201, 163, 74, 0.09) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 z-10">
        {/* Section Heading */}
        <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-9 space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1 rounded-full bg-[#F4E6CF] border border-[#C9A34A]/50 text-[#7A520C] text-[9px] sm:text-xs font-bold uppercase tracking-widest shadow-2xs">
            <span>✦</span>
            <span>Fresh Off The Loom</span>
            <span>✦</span>
          </div>

          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl text-[#191714] font-semibold tracking-tight">
            New Arrivals
          </h2>

          <p className="text-[11px] sm:text-sm text-[#746D62] max-w-md sm:max-w-lg px-2">
            Our latest hand-picked silhouettes, celebratory palettes, and breathable festive luxury.
          </p>
        </div>

        {/* Product Grid with Carousel Controls */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-[#FAF6F0] animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="relative">
            {/* Left & Right Carousel Buttons on Desktop */}
            {totalPages > 1 && (
              <>
                <button
                  onClick={() => setPageIndex((prev) => (prev - 1 + totalPages) % totalPages)}
                  aria-label="Previous products"
                  className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#E8DFD0] shadow-md text-[#191714] hover:bg-[#003D2D] hover:text-white items-center justify-center transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPageIndex((prev) => (prev + 1) % totalPages)}
                  aria-label="Next products"
                  className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#E8DFD0] shadow-md text-[#191714] hover:bg-[#003D2D] hover:text-white items-center justify-center transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {(displayedProducts.length > 0 ? displayedProducts : products.slice(0, 4)).map((p) => (
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

            {/* Carousel Dots */}
            <div className="flex items-center justify-center space-x-2 mt-6">
              {Array.from({ length: Math.max(totalPages, 3) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => i < totalPages && setPageIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === pageIndex
                      ? 'w-6 bg-[#003D2D]'
                      : 'w-2 bg-[#D5C7B2] hover:bg-[#C9A34A]'
                  }`}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-14 px-6 rounded-3xl bg-white border border-[#E8DFD0] max-w-md mx-auto space-y-3">
            <Sparkles size={28} className="text-[#C9A34A] mx-auto" />
            <h4 className="font-serif text-lg font-semibold text-[#191714]">New Collection Arriving Soon</h4>
            <p className="text-xs text-[#746D62]">
              Our artisans are finishing the latest festive drop. Check back soon or explore our existing categories.
            </p>
          </div>
        )}

        {/* Bottom Call to Action matching reference */}
        <div className="mt-6 sm:mt-7 text-center">
          <Link
            href="/shop?filter=new_arrivals"
            className="inline-flex items-center space-x-2 px-6 sm:px-7 py-2.5 bg-white hover:bg-[#003D2D] border border-[#C9A34A] hover:border-[#003D2D] text-[#191714] hover:text-[#FFF8ED] rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-200 shadow-2xs"
          >
            <span>View All New Arrivals</span>
            <ArrowRight size={14} className="shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
};
