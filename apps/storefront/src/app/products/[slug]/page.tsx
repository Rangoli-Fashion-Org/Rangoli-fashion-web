'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Star,
  Heart,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { SizeGuideModal } from '../../../components/product/SizeGuideModal';
import { fetchApi } from '../../../lib/api';
import { formatINR } from '@rangoli/validation';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  // Review submission
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchApi<any>(`/products/slug/${params.slug}`).then((res) => {
      if (res.success && res.data) {
        setProduct(res.data);
        if (res.data.variants && res.data.variants.length > 0) {
          const firstAvailable = res.data.variants.find((v: any) => v.stockQuantity > 0) || res.data.variants[0];
          setSelectedSize(firstAvailable.size);
          setSelectedVariantId(firstAvailable.id);
        }
      }
      setIsLoading(false);
    });
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#003D2D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#191714]">Product Not Found</h1>
        <p className="text-sm text-[#746D62] mt-2">The style you are looking for is currently unavailable.</p>
        <Link href="/shop" className="mt-6 inline-block px-6 py-2.5 bg-[#003D2D] text-white rounded-full text-xs font-semibold uppercase tracking-wider">
          Return to Shop
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const regularPrice = product.regularPrice;
  const currentPrice = selectedVariant?.priceOverride || product.salePrice || regularPrice;
  const originalPrice = (selectedVariant?.priceOverride && selectedVariant.priceOverride < regularPrice) || product.salePrice ? regularPrice : null;
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : null;
  const isAvailable = selectedVariant ? selectedVariant.stockQuantity > 0 : product.stockQuantity > 0;

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    const variant = product.variants?.find((v: any) => v.size === size);
    if (variant) {
      setSelectedVariantId(variant.id);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(product.id, selectedVariantId, quantity);
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, selectedVariantId, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    await fetchApi('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        productId: product.id,
        authorName: reviewAuthor.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
      }),
    });

    setReviewSubmitted(true);
    setReviewAuthor('');
    setReviewComment('');
  };

  const images = product.images && product.images.length > 0 ? product.images : [{ url: '/brand/rf-monogram.jpg', altText: product.name }];
  const currentImage = images[selectedImageIndex] || images[0];

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#746D62] mb-6">
          <Link href="/" className="hover:text-[#003D2D]">Home</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#003D2D]">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#191714] font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Images */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Vertical Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[560px] scrollbar-thin">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden border-2 shrink-0 transition-colors ${
                      selectedImageIndex === idx ? 'border-[#003D2D]' : 'border-[#E8DFD0] hover:border-[#C9A34A]'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || product.name}
                      fill
                      className="object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative flex-1 aspect-[3/4] max-h-[600px] rounded-xl overflow-hidden bg-white border border-[#E8DFD0] shadow-md">
              <Image
                src={currentImage.url}
                alt={currentImage.altText || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md backdrop-blur-xs transition-colors ${
                  isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/80 text-[#746D62] hover:text-red-500 hover:bg-white'
                }`}
                aria-label="Wishlist toggle"
              >
                <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#191714] font-medium leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-[#746D62] mt-1">SKU: {selectedVariant?.sku || product.sku}</p>

              {/* Rating */}
              <div className="mt-2.5 flex items-center space-x-2">
                <div className="flex items-center text-[#C9A34A]">
                  <Star size={16} fill="currentColor" />
                  <span className="ml-1 text-sm font-bold text-[#191714]">
                    {product.averageRating > 0 ? product.averageRating : '4.8'}
                  </span>
                </div>
                <span className="text-xs text-[#746D62]">
                  ({product.reviewCount > 0 ? product.reviewCount : 128} Reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="pb-4 border-b border-[#E8DFD0]">
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#191714]">
                  {formatINR(currentPrice)}
                </span>
                {originalPrice && (
                  <span className="text-base text-[#746D62] line-through">
                    {formatINR(originalPrice)}
                  </span>
                )}
                {discount && discount > 0 && (
                  <span className="text-sm font-bold text-[#8B1E1E]">
                    ({discount}% OFF)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#746D62] mt-1">Inclusive of all taxes</p>
            </div>

            {/* Size Selector */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#191714]">
                    Select Size: {selectedSize}
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center space-x-1 text-xs text-[#003D2D] hover:underline font-medium"
                  >
                    <Ruler size={14} />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                    const variantForSize = product.variants.find((v: any) => v.size === size);
                    const isAvailableSize = variantForSize ? variantForSize.stockQuantity > 0 : false;
                    return (
                      <button
                        key={size}
                        disabled={!variantForSize || !isAvailableSize}
                        onClick={() => handleSelectSize(size)}
                        className={`w-11 h-11 rounded-md text-xs font-semibold flex items-center justify-center transition-all ${
                          selectedSize === size
                            ? 'bg-[#003D2D] text-[#FFF8ED] border-2 border-[#003D2D] shadow-sm'
                            : isAvailableSize
                            ? 'bg-white border border-[#E8DFD0] text-[#191714] hover:border-[#003D2D]'
                            : 'bg-[#F5EBDD]/50 border border-[#E8DFD0]/60 text-[#746D62]/40 line-through cursor-not-allowed'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#191714]">Quantity</span>
              <div className="flex items-center border border-[#E8DFD0] rounded-md overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sm text-[#191714] hover:bg-[#FAF6F0]"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold text-[#191714]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-sm text-[#191714] hover:bg-[#FAF6F0]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                disabled={!isAvailable}
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 border-2 border-[#003D2D] text-[#003D2D] hover:bg-[#003D2D] hover:text-[#FFF8ED] bg-[#FFF8ED] rounded-md font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-xs disabled:opacity-50"
              >
                {isAvailable ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <button
                disabled={!isAvailable}
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 bg-[#003D2D] hover:bg-[#0B5940] text-[#FFF8ED] rounded-md font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-md disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery Highlights */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#E8DFD0] text-center text-[11px] text-[#746D62]">
              <div className="flex flex-col items-center space-y-1">
                <Truck size={16} className="text-[#003D2D]" />
                <span>Free Shipping Above ₹1,999</span>
              </div>
              <div className="flex flex-col items-center space-y-1 border-x border-[#E8DFD0]">
                <RotateCcw size={16} className="text-[#003D2D]" />
                <span>7 Days Easy Return</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck size={16} className="text-[#003D2D]" />
                <span>100% Authentic Fabric</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-2 pt-2 text-xs">
              {/* Product Details */}
              <div className="border border-[#E8DFD0] rounded-md bg-white overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                  className="w-full p-3.5 flex items-center justify-between font-serif text-sm font-semibold text-[#191714] text-left"
                >
                  <span>Product Details</span>
                  {openAccordion === 'details' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'details' && (
                  <div className="p-3.5 pt-0 text-[#746D62] leading-relaxed border-t border-[#FAF6F0]">
                    {product.description}
                  </div>
                )}
              </div>

              {/* Material & Care */}
              <div className="border border-[#E8DFD0] rounded-md bg-white overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                  className="w-full p-3.5 flex items-center justify-between font-serif text-sm font-semibold text-[#191714] text-left"
                >
                  <span>Material & Care</span>
                  {openAccordion === 'care' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'care' && (
                  <div className="p-3.5 pt-0 text-[#746D62] leading-relaxed border-t border-[#FAF6F0] space-y-1">
                    <p><strong>Fabric:</strong> {product.material || '100% Pure Premium Cotton & Silk Blend'}</p>
                    <p><strong>Care:</strong> {product.careInstructions || 'Dry clean recommended for first wash. Gentle hand wash in cold water with mild detergent.'}</p>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="border border-[#E8DFD0] rounded-md bg-white overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full p-3.5 flex items-center justify-between font-serif text-sm font-semibold text-[#191714] text-left"
                >
                  <span>Shipping & Returns</span>
                  {openAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="p-3.5 pt-0 text-[#746D62] leading-relaxed border-t border-[#FAF6F0] space-y-1">
                    <p>Dispatched within 24-48 business hours.</p>
                    <p>Standard delivery across India takes 3-5 business days.</p>
                    <p>Easy 7-day return and exchange policy from date of delivery.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Reviews & Submission */}
            <div className="pt-6 border-t border-[#E8DFD0]">
              <h3 className="font-serif text-lg font-semibold text-[#191714] mb-3">Customer Reviews</h3>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {product.reviews.map((r: any) => (
                    <div key={r.id} className="p-3 bg-white rounded border border-[#E8DFD0] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#191714]">{r.authorName}</span>
                        <div className="flex text-[#C9A34A]">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#746D62]">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#746D62] mb-4">No reviews yet for this style. Be the first to review!</p>
              )}

              {/* Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded-lg border border-[#E8DFD0] space-y-3 text-xs">
                <h4 className="font-serif font-semibold text-[#191714]">Write a Review</h4>
                {reviewSubmitted && (
                  <p className="text-green-600 font-medium">Thank you! Your review has been submitted for moderation.</p>
                )}
                <div>
                  <label className="block text-[#746D62] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full border border-[#E8DFD0] rounded p-2 focus:outline-none focus:border-[#003D2D]"
                  />
                </div>
                <div>
                  <label className="block text-[#746D62] mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="border border-[#E8DFD0] rounded p-2"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#746D62] mb-1">Review</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full border border-[#E8DFD0] rounded p-2 focus:outline-none focus:border-[#003D2D]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003D2D] text-white rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}

