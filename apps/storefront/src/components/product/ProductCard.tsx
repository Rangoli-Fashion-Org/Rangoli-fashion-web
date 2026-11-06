'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
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
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlisted = isInWishlist(id);

  const displayPrice = salePrice || regularPrice;
  const originalPrice = salePrice ? regularPrice : null;
  const discount = discountPercentage || (salePrice && regularPrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : null);
  const imageUrl = images[0]?.url || '/brand/rf-monogram.jpg';

  return (
    <div className="group relative flex flex-col bg-white rounded-md border border-[#E8DFD0]/70 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image Box */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5EBDD]/40">
        <Link href={`/products/${slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
            wishlisted
              ? 'bg-red-50 text-red-500'
              : 'bg-white/80 text-[#746D62] hover:text-red-500 hover:bg-white'
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <Link href={`/products/${slug}`} className="block">
            <h3 className="font-serif text-sm md:text-base font-medium text-[#191714] line-clamp-1 group-hover:text-[#003D2D] transition-colors">
              {name}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="mt-1.5 flex items-baseline flex-wrap gap-2 text-xs md:text-sm">
            <span className="font-bold text-[#191714]">
              {formatINR(displayPrice)}
            </span>
            {originalPrice && (
              <span className="line-through text-[#746D62] text-[11px] md:text-xs">
                {formatINR(originalPrice)}
              </span>
            )}
            {discount && discount > 0 && (
              <span className="text-[#8B1E1E] font-semibold text-[11px] md:text-xs">
                ({discount}% OFF)
              </span>
            )}
          </div>
        </div>

        {/* Rating and Quick Add */}
        <div className="mt-2.5 pt-2 border-t border-[#F5EBDD] flex items-center justify-between text-xs">
          {averageRating > 0 ? (
            <div className="flex items-center space-x-1 text-[#746D62]">
              <span className="flex items-center text-[#C9A34A] font-semibold">
                <Star size={13} fill="currentColor" className="mr-0.5" />
                {averageRating}
              </span>
              <span>({reviewCount})</span>
            </div>
          ) : (
            <span className="text-[11px] text-[#746D62]/70">Premium Ethnic</span>
          )}

          <button
            onClick={() => addToCart(id, null, 1)}
            className="text-[11px] font-medium text-[#003D2D] hover:text-[#C9A34A] uppercase tracking-wider transition-colors"
          >
            + Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
