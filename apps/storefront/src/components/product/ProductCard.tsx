'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatINR } from '@rangoli/validation';
import { getOptimizedImageUrl } from '../../lib/image';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  regularPrice: number;
  salePrice?: number | null;
  discountPercentage?: number | null;
  images?: Array<{ url: string; altText?: string; isPrimary?: boolean }>;
  averageRating?: number;
  reviewCount?: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  slug,
  regularPrice,
  salePrice,
  discountPercentage,
  images = [],
  isNewArrival,
  isBestSeller,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlisted = isInWishlist(id);

  const displayPrice = salePrice || regularPrice;
  const originalPrice = salePrice ? regularPrice : null;
  const discount =
    discountPercentage ||
    (salePrice && regularPrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : null);

  // Primary cover image and secondary sub-image for hover reveal
  const primaryImg = images.find((img: any) => img.isPrimary) || images[0];
  const secondaryImg = images.find((img: any) => img !== primaryImg);

  const primaryUrl = getOptimizedImageUrl(primaryImg?.url, { width: 420, quality: 'auto:good' });
  const secondaryUrl = secondaryImg ? getOptimizedImageUrl(secondaryImg.url, { width: 420, quality: 'auto:good' }) : null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border border-[#E8DFD0] p-1.5 sm:p-2.5 shadow-2xs select-none"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full rounded-lg sm:rounded-xl overflow-hidden bg-[#FAF6F0]">
        <Link href={`/products/${slug}`} className="relative block w-full h-full">
          {/* Primary Cover Image */}
          <Image
            src={primaryUrl}
            alt={name}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-top transition-opacity duration-300 ${
              secondaryUrl && isHovered ? 'group-hover:opacity-0' : ''
            }`}
          />

          {/* Second Sub Image revealed on Hover (Desktop only, deferred until hover) */}
          {secondaryUrl && isHovered && (
            <div className="hidden sm:block absolute inset-0">
              <Image
                src={secondaryUrl}
                alt={`${name} secondary view`}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 33vw, 25vw"
                className="object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          )}
        </Link>

        {/* Top-Left Badges (Bestseller, New & Discount) */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 pointer-events-none z-10">
          {isBestSeller && (
            <span className="px-1.5 sm:px-2.5 py-0.5 bg-gradient-to-r from-[#8B6B23] to-[#C9A34A] text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-wider rounded shadow-xs text-center border border-[#E5C158]/50">
              BESTSELLER
            </span>
          )}
          {isNewArrival && !isBestSeller && (
            <span className="px-1.5 sm:px-2.5 py-0.5 bg-[#003D2D] text-[#FFF8ED] text-[8px] sm:text-[10px] font-bold uppercase tracking-wider rounded shadow-xs text-center">
              NEW
            </span>
          )}
          {discount && discount > 0 && (
            <span className="px-1.5 sm:px-2 py-0.5 bg-[#DFC37A] text-[#191714] text-[8px] sm:text-[10px] font-bold uppercase tracking-wider rounded shadow-xs text-center">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(id);
          }}
          className={`absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-xs z-10 ${
            wishlisted
              ? 'bg-red-50 text-red-500 border border-red-200'
              : 'bg-white/90 hover:bg-white text-[#746D62] hover:text-red-500 border border-[#E8DFD0]'
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart size={13} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Details Block */}
      <div className="pt-2 sm:pt-3 px-0.5 sm:px-1 pb-0.5 sm:pb-1 flex flex-col flex-1 justify-between space-y-2 sm:space-y-2.5">
        <div>
          <Link href={`/products/${slug}`} className="block">
            <h3 className="font-serif text-[11px] sm:text-sm font-semibold text-[#191714] line-clamp-2 leading-snug">
              {name}
            </h3>
          </Link>

          {/* Pricing Display */}
          <div className="mt-1 sm:mt-1.5 flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2">
            <span className="font-bold text-[#191714] text-[13px] sm:text-base font-sans">
              {formatINR(displayPrice)}
            </span>
            {originalPrice && (
              <span className="line-through text-[#746D62] text-[10px] sm:text-xs">
                {formatINR(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Full-Width Add to Bag Pill Button matching reference */}
        <button
          onClick={() => addToCart(id, null, 1)}
          className="w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-md sm:rounded-lg bg-[#F5EADC] hover:bg-[#003D2D] text-[#191714] hover:text-[#FFF8ED] border border-[#E6D5BE] hover:border-[#003D2D] text-[11px] sm:text-xs font-semibold flex items-center justify-center space-x-1 sm:space-x-1.5 transition-colors duration-200"
        >
          <ShoppingBag size={12} className="shrink-0" />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
};
