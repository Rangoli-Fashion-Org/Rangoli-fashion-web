'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { fetchApi } from '../../lib/api';

export const NewArrivals: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<any[]>('/products/new-arrivals?limit=4').then((res) => {
      if (res.success && res.data) {
        setProducts(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="py-14 md:py-20 bg-white border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex items-center justify-center space-x-4 mb-10 md:mb-14">
          <div className="h-px w-12 sm:w-20 bg-[#C9A34A]/60" />
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#191714] font-medium tracking-tight text-center">
            New Arrivals
          </h2>
          <div className="h-px w-12 sm:w-20 bg-[#C9A34A]/60" />
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-[#F5EBDD]/60 animate-pulse rounded-md" />
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
          <div className="text-center py-12 px-4 rounded-xl bg-[#FFF8ED] border border-[#E8DFD0] max-w-lg mx-auto">
            <h3 className="font-serif text-xl font-medium text-[#191714]">Fresh Styles Coming Soon</h3>
            <p className="mt-2 text-sm text-[#746D62]">
              Our newest artisanal ethnic garments are being carefully tailored. Explore our current catalog in the meantime!
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center space-x-2 px-6 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-full text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/shop?filter=new_arrivals"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-[#FAF6F0] border border-[#003D2D] text-[#003D2D] hover:bg-[#003D2D] hover:text-[#FFF8ED] rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300"
            >
              <span>View All New Arrivals</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

