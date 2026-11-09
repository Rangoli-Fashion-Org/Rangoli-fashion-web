'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatINR } from '@rangoli/validation';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  regularPrice: number;
  salePrice?: number | null;
  discountPercentage?: number | null;
  images?: Array<{ url: string; altText?: string }>;
  averageRating?: number;
  reviewCount?: number;
  isNewArrival?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  slug,
  regularPrice,
  salePrice,
  discountPercentage,
  images = [],
  averageRating = 0,
  reviewCount = 0,
  isNewArrival,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlisted = isInWishlist(id);

  const displayPrice = salePrice || regularPrice;
  const originalPrice = salePrice ? regularPrice : null;
  const discount = discountPercentage || (salePrice && regularPrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : null);

  // Primary cover image and secondary sub image
  const primaryImg = images.find((img: any) => img.isPrimary) || images[0];
  const secondaryImg = images.find((img: any) => img !== primaryImg);

  const primaryUrl = primaryImg?.url || '/brand/rf-monogram.jpg';
  const secondaryUrl = secondaryImg?.url || null;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-[#E8DFD0] overflow-hidden shadow-2xs">
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF6F0]">
        <Link href={`/products/${slug}`} className="relative block w-full h-full">
          {/* Primary Cover Image */}
          <Image
            src={primaryUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-top transition-opacity duration-300 ${
              secondaryUrl ? 'group-hover:opacity-0' : ''
            }`}
          />

          {/* Second Sub Image revealed on Hover */}
          {secondaryUrl && (
            <Image
              src={secondaryUrl}
              alt={`${name} secondary view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
        </Link>

        {/* Floating Badges (New Arrival / Discount) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {isNewArrival && (
            <span className="px-2.5 py-1 bg-[#003D2D] text-[#FFF8ED] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
              New
            </span>
          )}
          {discount && discount > 0 && (
            <span className="px-2.5 py-1 bg-[#C9A34A] text-[#002D21] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm z-10 ${
            wishlisted
              ? 'bg-red-50 text-red-500 scale-105'
              : 'bg-white/80 hover:bg-white text-[#746D62] hover:text-red-500 hover:scale-105'
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Details Block */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white space-y-3">
        <div>
          <Link href={`/products/${slug}`} className="block">
            <h3 className="font-serif text-sm sm:text-base font-medium text-[#191714] line-clamp-1 group-hover:text-[#003D2D] transition-colors leading-snug">
              {name}
            </h3>
          </Link>

          {/* Pricing Display */}
          <div className="mt-2 flex items-baseline flex-wrap gap-2 text-xs sm:text-sm">
            <span className="font-bold text-[#191714] text-sm sm:text-base font-serif">
              {formatINR(displayPrice)}
            </span>
            {originalPrice && (
              <span className="line-through text-[#746D62] text-[11px] sm:text-xs">
                {formatINR(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Rating & Quick Add to Bag Action */}
        <div className="pt-2 border-t border-[#F5EBDD] flex items-center justify-between text-xs">
          {averageRating > 0 ? (
            <div className="flex items-center space-x-1 text-[#746D62] text-[11px]">
              <span className="flex items-center text-[#C9A34A] font-semibold">
                <Star size={12} fill="currentColor" className="mr-0.5" />
                {averageRating}
              </span>
              <span>({reviewCount})</span>
            </div>
          ) : (
            <span className="text-[11px] text-[#746D62]/80 uppercase tracking-widest font-medium">
              Ethnic Edit
            </span>
          )}

          <button
            onClick={() => addToCart(id, null, 1)}
            className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#003D2D] hover:text-[#C9A34A] uppercase tracking-wider transition-colors group/btn"
          >
            <ShoppingBag size={12} className="group-hover/btn:scale-110 transition-transform" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
};
