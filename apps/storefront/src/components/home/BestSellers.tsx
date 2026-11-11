'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { fetchApi } from '../../lib/api';

const DEFAULT_BEST_SELLERS = [
  {
    id: 'bs-1',
    name: 'Varanasi Pure Katan Silk Zari Saree',
    slug: 'varanasi-pure-katan-silk-zari-saree',
    regularPrice: 8499,
    salePrice: 6999,
    discountPercentage: 18,
    averageRating: 4.9,
    reviewCount: 42,
    images: [
      {
        url: 'https://res.cloudinary.com/ijivdhjz/image/upload/v1794044221/categories/tqr5ayqaxciykqickcre.png',
        isPrimary: true,
      },
    ],
  },
  {
    id: 'bs-2',
    name: 'Royal Emerald Chanderi Anarkali Suit Set',
    slug: 'royal-emerald-chanderi-anarkali-suit-set',
    regularPrice: 5999,
    salePrice: 4799,
    discountPercentage: 20,
    averageRating: 4.8,
    reviewCount: 38,
    images: [
      {
        url: 'https://res.cloudinary.com/ijivdhjz/image/upload/v1794044984/categories/p74heoman1gxeciylnzu.png',
        isPrimary: true,
      },
    ],
  },
  {
    id: 'bs-3',
    name: 'Heritage Zardozi Embroidered Velvet Lehenga',
    slug: 'heritage-zardozi-embroidered-velvet-lehenga',
    regularPrice: 16999,
    salePrice: 13999,
    discountPercentage: 18,
    averageRating: 5.0,
    reviewCount: 56,
    images: [
      {
        url: 'https://res.cloudinary.com/ijivdhjz/image/upload/v1794045186/categories/chowyzvouiqak6fko8dj.png',
        isPrimary: true,
      },
    ],
  },
  {
    id: 'bs-4',
    name: 'Festive Handwoven Georgette Flared Kurti',
    slug: 'festive-handwoven-georgette-flared-kurti',
    regularPrice: 3299,
    salePrice: 2499,
    discountPercentage: 24,
    averageRating: 4.7,
    reviewCount: 29,
    images: [
      {
        url: 'https://res.cloudinary.com/ijivdhjz/image/upload/v1794045263/categories/iedqnkdzhaepjug2xpax.png',
        isPrimary: true,
      },
    ],
  },
];

export const BestSellers: React.FC = () => {
  const [products, setProducts] = useState<any[]>(DEFAULT_BEST_SELLERS);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    // Attempt to fetch best-sellers endpoint; fallback to popular products if unavailable
    fetchApi<any[]>('/products/best-sellers?limit=8').then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setProducts(res.data);
      } else {
        // Fallback query to general products sorted by popularity
        fetchApi<any>('/products?sort=popularity&limit=8').then((prodRes) => {
          if (prodRes.success && prodRes.data) {
            const list = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.data;
            if (list && list.length > 0) {
              setProducts(list);
            }
          }
        });
      }
    });
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const displayedProducts = products.slice(
    pageIndex * itemsPerPage,
    (pageIndex + 1) * itemsPerPage
  );

  return (
    <section className="relative py-8 sm:py-10 md:py-12 bg-gradient-to-b from-[#F6ECE0] via-[#FAF6F0] to-[#FFFDF9] overflow-hidden border-t border-[#E8DFD0]/60">
      {/* Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201, 163, 74, 0.08) 0%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 z-10">
        {/* Section Heading */}
        <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-9 space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1 rounded-full bg-[#F4E6CF] border border-[#C9A34A]/50 text-[#7A520C] text-[9px] sm:text-xs font-bold uppercase tracking-widest shadow-2xs">
            <Award size={12} className="text-[#C9A34A]" />
            <span>Most Loved by Patrons</span>
            <span>✦</span>
          </div>

          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl text-[#191714] font-semibold tracking-tight">
            Best Sellers
          </h2>

          <p className="text-[11px] sm:text-sm text-[#746D62] max-w-md sm:max-w-lg px-2">
            Our most-coveted silhouettes, celebrated across India for timeless grace, regal comfort, and heirloom craftsmanship.
          </p>
        </div>

        {/* Product Grid with Carousel Controls */}
        <div className="relative">
          {totalPages > 1 && (
            <>
              <button
                onClick={() => setPageIndex((prev) => (prev - 1 + totalPages) % totalPages)}
                aria-label="Previous best sellers"
                className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#E8DFD0] shadow-md text-[#191714] hover:bg-[#003D2D] hover:text-white items-center justify-center transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPageIndex((prev) => (prev + 1) % totalPages)}
                aria-label="Next best sellers"
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
                isBestSeller={true}
              />
            ))}
          </div>

          {/* Carousel Dots if multiple pages */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPageIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === pageIndex
                      ? 'w-6 bg-[#003D2D]'
                      : 'w-2 bg-[#D5C7B2] hover:bg-[#C9A34A]'
                  }`}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-6 sm:mt-7 text-center">
          <Link
            href="/shop?sort=popularity"
            className="inline-flex items-center space-x-2 px-6 sm:px-7 py-2.5 bg-white hover:bg-[#003D2D] border border-[#C9A34A] hover:border-[#003D2D] text-[#191714] hover:text-[#FFF8ED] rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-200 shadow-2xs"
          >
            <span>Explore All Best Sellers</span>
            <ArrowRight size={14} className="shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
};
