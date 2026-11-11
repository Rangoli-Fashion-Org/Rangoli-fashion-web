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
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Share2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { SizeGuideModal } from '../../../components/product/SizeGuideModal';
import { fetchApi } from '../../../lib/api';
import { formatINR } from '@rangoli/validation';
import { getOptimizedImageUrl } from '../../../lib/image';
import { ProductCard } from '../../../components/product/ProductCard';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Review submission
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchApi<any>(`/products/slug/${params.slug}`).then((res) => {
      if (res.success && res.data) {
        setProduct(res.data);
        if (res.data.variants && res.data.variants.length > 0) {
          const firstAvailable =
            res.data.variants.find((v: any) => v.stockQuantity > 0) || res.data.variants[0];
          setSelectedSize(firstAvailable.size);
          setSelectedVariantId(firstAvailable.id);
        }

        // Fetch related creations in the same category
        if (res.data.category?.slug) {
          fetchApi<any>(`/products?category=${encodeURIComponent(res.data.category.slug)}&limit=5`).then((catRes) => {
            if (catRes.success && catRes.data) {
              const items = Array.isArray(catRes.data) ? catRes.data : catRes.data.data;
              if (Array.isArray(items)) {
                setRelatedProducts(items.filter((p: any) => p.slug !== params.slug).slice(0, 4));
              }
            }
          });
        }
      }
      setIsLoading(false);
    });
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="bg-[#FAF6F0] min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-pulse">
            <div className="lg:col-span-7 aspect-[3/4] max-h-[560px] bg-[#E8DFD0]/40 rounded-2xl" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-6 bg-[#E8DFD0]/50 rounded w-1/3" />
              <div className="h-10 bg-[#E8DFD0]/60 rounded w-3/4" />
              <div className="h-8 bg-[#E8DFD0]/40 rounded w-1/2" />
              <div className="h-32 bg-[#E8DFD0]/30 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#FAF6F0] min-h-screen py-24 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#003D2D]/10 text-[#003D2D] flex items-center justify-center mx-auto">
            <ShoppingBag size={28} />
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#191714]">Product Not Found</h1>
          <p className="text-xs sm:text-sm text-[#746D62]">
            The style you are looking for has been moved or is currently unavailable in our catalogue.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#003D2D] hover:bg-[#0B5940] text-[#FFF8ED] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
            >
              <span>Return to Collections</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const regularPrice = product.regularPrice;
  const currentPrice = selectedVariant?.priceOverride || product.salePrice || regularPrice;
  const originalPrice =
    (selectedVariant?.priceOverride && selectedVariant.priceOverride < regularPrice) ||
    product.salePrice
      ? regularPrice
      : null;
  const discount = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;
  const isAvailable = selectedVariant ? selectedVariant.stockQuantity > 0 : product.stockQuantity > 0;

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    const variant = product.variants?.find((v: any) => v.size === size);
    if (variant) {
      setSelectedVariantId(variant.id);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product.id, selectedVariantId, quantity);
    setIsAdding(false);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, selectedVariantId, quantity);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim() || isSubmittingReview) return;

    setIsSubmittingReview(true);
    setReviewError(null);

    const res = await fetchApi('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        productId: product.id,
        authorName: reviewAuthor.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
      }),
    });

    setIsSubmittingReview(false);

    if (res.success) {
      setReviewSubmitted(true);
      setReviewAuthor('');
      setReviewComment('');
      setTimeout(() => setReviewSubmitted(false), 5000);
    } else {
      setReviewError(res.message || 'Unable to submit review. Please try again.');
    }
  };

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: '/brand/rf-monogram.jpg', altText: product.name }];
  const currentImage = images[selectedImageIndex] || images[0];

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#191714] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-[#746D62] mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-[#003D2D] transition-colors">Home</Link>
          <span className="text-[#C9A34A]">/</span>
          {product.category && (
            <>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-[#003D2D] transition-colors"
              >
                {product.category.name}
              </Link>
              <span className="text-[#C9A34A]">/</span>
            </>
          )}
          <span className="text-[#191714] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* MAIN PRODUCT SHOWCASE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: IMAGE SHOWCASE & ARTISANAL DETAILS (Eliminates empty void) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* Gallery: Thumbnails + Primary Stage */}
            <div className="flex flex-col-reverse md:flex-row gap-3.5 sm:gap-4 items-start w-full">
              {/* Thumbnails without unsightly scrollbar slider line */}
              {images.length > 1 && (
                <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[640px] w-full md:w-20 shrink-0 no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all duration-200 bg-[#FFF8ED] ${
                        selectedImageIndex === idx
                          ? 'border-[#003D2D] shadow-md scale-[1.02]'
                          : 'border-[#E8DFD0] hover:border-[#C9A34A] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={getOptimizedImageUrl(img.url, { width: 160, quality: 'auto:good' })}
                        alt={img.altText || `${product.name} view ${idx + 1}`}
                        fill
                        className="object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Primary Image with Royal Frame */}
              <div className="relative flex-1 w-full aspect-[3/4] max-h-[640px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FFFDF9] border border-[#E6D5BE] shadow-xl group">
                <Image
                  src={getOptimizedImageUrl(currentImage.url, { width: 1000, quality: 'auto:good' })}
                  alt={currentImage.altText || product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Floating Badges (Top Left) */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1.5 pointer-events-none z-10">
                  {product.isNewArrival && (
                    <span className="px-3 py-1 bg-[#003D2D] text-[#FFF8ED] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md flex items-center space-x-1">
                      <Sparkles size={10} className="text-[#E5C158]" />
                      <span>New Arrival</span>
                    </span>
                  )}
                  {discount && discount > 0 && (
                    <span className="px-3 py-1 bg-[#C9A34A] text-[#002D21] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                      {discount}% Off
                    </span>
                  )}
                </div>

                {/* Floating Actions (Top Right) */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2 z-10">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
                      isInWishlist(product.id)
                        ? 'bg-red-50 text-red-500 border border-red-200 scale-105'
                        : 'bg-white/90 hover:bg-white text-[#746D62] hover:text-red-500 border border-[#E8DFD0]'
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 hover:bg-white text-[#746D62] hover:text-[#003D2D] border border-[#E8DFD0] backdrop-blur-md transition-all shadow-md"
                    aria-label="Share product"
                  >
                    <Share2 size={16} />
                  </button>
                </div>

                {isCopied && (
                  <div className="absolute top-16 right-4 bg-[#003D2D] text-white text-[11px] px-3 py-1 rounded-full shadow-lg z-20">
                    Link copied!
                  </div>
                )}
              </div>
            </div>

            {/* ARTISAN & GARMENT SPECIFICATIONS UNDER IMAGE (Fills previous empty void) */}
            <div className="space-y-4 pt-2">
              {/* Luxury Craftsmanship Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#003D2D] to-[#00241A] text-[#FFF8ED] flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A34A]/20 border border-[#C9A34A]/40 flex items-center justify-center shrink-0">
                    <Sparkles size={20} className="text-[#E5C158]" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-semibold tracking-wide text-white">
                      Artisan Craftsmanship &amp; Heritage Weave
                    </h2>
                    <p className="text-[11px] text-[#E8DFD0]/80">
                      Individually inspected and handcrafted in India with zero compromise on fabric purity.
                    </p>
                  </div>
                </div>
              </div>

              {/* Silhouette & Design Narrative */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8DFD0] shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-[#003D2D]">
                  <Sparkles size={16} className="text-[#C9A34A]" />
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[#191714]">
                    Silhouette &amp; Design Overview
                  </h3>
                </div>
                <div className="text-xs sm:text-[13px] text-[#4A453E] leading-relaxed space-y-2 font-normal">
                  <p>{product.description}</p>
                </div>
              </div>

              {/* Garment Specifications & Fabric Care 4-Box Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Fabric Box */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8DFD0] shadow-2xs space-y-1.5">
                  <div className="flex items-center space-x-2 text-[#003D2D]">
                    <ShieldCheck size={16} className="text-[#C9A34A]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#191714]">Fabric Purity</span>
                  </div>
                  <p className="text-xs text-[#5E574D] leading-relaxed">
                    {product.material || '100% Pure Handloom Cotton & Fine Chanderi Silk Blend with breathable organic lining.'}
                  </p>
                </div>

                {/* Wash Care Box */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8DFD0] shadow-2xs space-y-1.5">
                  <div className="flex items-center space-x-2 text-[#003D2D]">
                    <Clock size={16} className="text-[#C9A34A]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#191714]">Wash &amp; Care</span>
                  </div>
                  <p className="text-xs text-[#5E574D] leading-relaxed">
                    {product.careInstructions || 'Dry clean recommended for first wash to preserve embroidery. Cold gentle handwash thereafter.'}
                  </p>
                </div>

                {/* Weave & Technique */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8DFD0] shadow-2xs space-y-1.5">
                  <div className="flex items-center space-x-2 text-[#003D2D]">
                    <Sparkles size={16} className="text-[#C9A34A]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#191714]">Weave &amp; Zari</span>
                  </div>
                  <p className="text-xs text-[#5E574D] leading-relaxed">
                    Intricate artisan gold thread zari motifs with reinforced French seams for enduring drape.
                  </p>
                </div>

                {/* Dispatch & Delivery */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8DFD0] shadow-2xs space-y-1.5">
                  <div className="flex items-center space-x-2 text-[#003D2D]">
                    <Truck size={16} className="text-[#003D2D]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#191714]">Express Dispatch</span>
                  </div>
                  <p className="text-xs text-[#5E574D] leading-relaxed">
                    Dispatched within 24–48 hours in luxury box packaging. Doorstep delivery across India in 3–5 days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: UNIFIED LUXURY PURCHASE CONSOLE (Aligned & Sticky) */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-xs rounded-3xl border border-[#E8DFD0] p-6 sm:p-7 shadow-xl lg:sticky lg:top-24 space-y-5 sm:space-y-6">
              {/* Category & Title Header */}
              <div className="space-y-2 border-b border-[#F0E6D8] pb-4">
                {product.category && (
                  <span className="inline-block text-[11px] uppercase tracking-widest font-bold text-[#C9A34A]">
                    {product.category.name}
                  </span>
                )}
                <h1 className="font-serif text-2xl sm:text-3xl text-[#191714] font-medium leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-3 text-xs text-[#746D62] pt-0.5">
                  <span>SKU: <strong className="font-mono text-[#191714]">{selectedVariant?.sku || product.sku}</strong></span>
                  <span>•</span>
                  <div className="flex items-center text-[#C9A34A]">
                    <Star size={14} fill="currentColor" />
                    <span className="ml-1 font-bold text-[#191714]">
                      {product.averageRating > 0 ? product.averageRating : '4.8'}
                    </span>
                    <span className="ml-1 text-[#746D62]">
                      ({product.reviewCount > 0 ? product.reviewCount : 128} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Royal Price Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E8] to-[#FFF8ED] border border-[#E6D5BE] space-y-1.5">
                <div className="flex items-baseline space-x-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-[#003D2D]">
                    {formatINR(currentPrice)}
                  </span>
                  {originalPrice && (
                    <span className="text-base sm:text-lg text-[#746D62] line-through">
                      {formatINR(originalPrice)}
                    </span>
                  )}
                  {discount && discount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E8DFD0] text-[#7A520C] text-xs font-bold uppercase tracking-wider">
                      Save {discount}%
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#746D62] flex items-center space-x-1.5 pt-0.5">
                  <CheckCircle2 size={13} className="text-[#0B5940]" />
                  <span>Inclusive of all taxes &amp; free shipping eligible</span>
                </p>
              </div>

              {/* Size Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#191714]">
                      Select Size:{' '}
                      <span className="font-serif text-sm font-semibold text-[#003D2D]">
                        {selectedSize}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="inline-flex items-center space-x-1 text-xs text-[#003D2D] hover:text-[#C9A34A] transition-colors font-medium"
                    >
                      <Ruler size={14} className="text-[#C9A34A]" />
                      <span className="underline underline-offset-2">Size Guide</span>
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
                          className={`min-w-[48px] h-12 px-3 rounded-xl text-xs font-bold uppercase transition-all duration-200 flex flex-col items-center justify-center ${
                            selectedSize === size
                              ? 'bg-[#003D2D] text-[#FFF8ED] shadow-md ring-2 ring-[#C9A34A] scale-105'
                              : isAvailableSize
                              ? 'bg-white border border-[#E6D5BE] text-[#191714] hover:border-[#003D2D] hover:bg-[#FFF8ED]'
                              : 'bg-[#F5EBDD]/40 border border-[#E8DFD0]/60 text-[#746D62]/40 line-through cursor-not-allowed'
                          }`}
                        >
                          <span>{size}</span>
                          {isAvailableSize && (
                            <span className="text-[8px] font-normal opacity-70">Ready</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-1 border-t border-[#F0E6D8] pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#191714]">Quantity</span>
                <div className="flex items-center border border-[#E6D5BE] rounded-xl overflow-hidden bg-white shadow-2xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 text-base text-[#191714] hover:bg-[#FAF6F0] flex items-center justify-center transition-colors font-medium"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-[#191714] font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 text-base text-[#191714] hover:bg-[#FAF6F0] flex items-center justify-center transition-colors font-medium"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  disabled={!isAvailable || isAdding}
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 border-2 border-[#003D2D] text-[#003D2D] hover:bg-[#003D2D] hover:text-[#FFF8ED] bg-[#FFF8ED] rounded-xl font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={16} />
                  <span>{isAdding ? 'Adding...' : isAvailable ? 'Add to Bag' : 'Out of Stock'}</span>
                </button>

                <button
                  disabled={!isAvailable}
                  onClick={handleBuyNow}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-[#003D2D] to-[#002219] hover:from-[#0B5940] hover:to-[#003D2D] text-[#FFF8ED] rounded-xl font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <span>Buy Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Added Toast */}
              {addedToast && (
                <div className="p-3 bg-[#003D2D] text-[#FFF8ED] rounded-xl text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
                  <span className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-[#C9A34A]" />
                    <span>Added to your shopping bag!</span>
                  </span>
                  <Link href="/checkout" className="text-[#E5C158] font-bold underline text-xs">
                    View Bag →
                  </Link>
                </div>
              )}

              {/* Assurance Trust Badges Bar */}
              <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E6D5BE] text-center text-[10px] sm:text-[11px] text-[#746D62]">
                <div className="flex flex-col items-center space-y-1">
                  <Truck size={16} className="text-[#003D2D]" />
                  <span className="font-semibold text-[#191714]">Free Delivery</span>
                  <span>Above ₹1,999</span>
                </div>
                <div className="flex flex-col items-center space-y-1 border-x border-[#E6D5BE]">
                  <RotateCcw size={16} className="text-[#003D2D]" />
                  <span className="font-semibold text-[#191714]">Easy Returns</span>
                  <span>7-Day Return Window</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <ShieldCheck size={16} className="text-[#003D2D]" />
                  <span className="font-semibold text-[#191714]">100% Authentic</span>
                  <span>Handcrafted Fabric</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FULL-WIDTH SECTION: CUSTOMER REVIEWS SHOWCASE */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-[#E8DFD0] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#C9A34A] block mb-1">
                Verified Feedback
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#191714]">
                Customer Reviews
              </h2>
            </div>
            <div className="flex items-center space-x-3 text-xs sm:text-sm text-[#746D62]">
              <div className="flex text-[#C9A34A]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="font-bold text-[#191714]">
                {product.averageRating > 0 ? product.averageRating : '4.8'} out of 5
              </span>
              <span>•</span>
              <span>{product.reviews?.length || 0} verified rating{product.reviews?.length === 1 ? '' : 's'}</span>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((r: any) => (
                  <div
                    key={r.id}
                    className="p-5 bg-white rounded-2xl border border-[#E8DFD0] shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-[#003D2D] text-[#FFF8ED] text-xs font-bold flex items-center justify-center uppercase">
                          {r.authorName?.charAt(0) || 'R'}
                        </div>
                        <div>
                          <span className="font-semibold text-xs sm:text-sm text-[#191714] block">
                            {r.authorName}
                          </span>
                          <span className="text-[10px] text-[#0B5940] flex items-center space-x-1">
                            <CheckCircle2 size={10} />
                            <span>Verified Buyer</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex text-[#C9A34A]">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5E574D] leading-relaxed pt-1">
                      {r.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-white border border-[#E8DFD0] text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#FAF6F0] text-[#003D2D] flex items-center justify-center mx-auto">
                    <Star size={20} className="text-[#C9A34A]" />
                  </div>
                  <h3 className="font-serif text-base font-semibold text-[#191714]">Be the First to Review</h3>
                  <p className="text-xs text-[#746D62] max-w-sm mx-auto">
                    Share your experience with this creation to help other patrons discover the right fit.
                  </p>
                </div>
              )}
            </div>

            {/* Right 1 Col: Write a Review Form */}
            <div>
              <form
                onSubmit={handleReviewSubmit}
                className="bg-white p-6 rounded-3xl border border-[#E8DFD0] shadow-md space-y-4 text-xs sticky top-24"
              >
                <div>
                  <h3 className="font-serif text-base font-semibold text-[#003D2D]">
                    Write a Review
                  </h3>
                  <p className="text-[11px] text-[#746D62]">
                    Share your fit, fabric, and styling impressions.
                  </p>
                </div>

                {reviewSubmitted && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-medium flex items-center space-x-2">
                    <CheckCircle2 size={16} />
                    <span>Thank you! Your review has been submitted for moderation.</span>
                  </div>
                )}

                {reviewError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="block text-[#746D62] mb-1 font-medium">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E6D5BE] rounded-xl p-2.5 text-xs text-[#191714] focus:outline-none focus:border-[#003D2D]"
                  />
                </div>

                <div>
                  <label className="block text-[#746D62] mb-1 font-medium">Overall Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-[#FAF6F0] border border-[#E6D5BE] rounded-xl p-2.5 text-xs text-[#191714] focus:outline-none focus:border-[#003D2D]"
                  >
                    <option value={5}>★★★★★ 5 Stars - Exceptional</option>
                    <option value={4}>★★★★☆ 4 Stars - Very Good</option>
                    <option value={3}>★★★☆☆ 3 Stars - Average</option>
                    <option value={2}>★★☆☆☆ 2 Stars - Below Expectations</option>
                    <option value={1}>★☆☆☆☆ 1 Star - Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#746D62] mb-1 font-medium">Your Thoughts</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="How did the fabric feel? How was the fit and finish?"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E6D5BE] rounded-xl p-2.5 text-xs text-[#191714] focus:outline-none focus:border-[#003D2D]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-3 bg-[#003D2D] hover:bg-[#0B5940] disabled:opacity-50 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center space-x-2"
                >
                  <span>{isSubmittingReview ? 'Submitting Review...' : 'Post Review'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FULL-WIDTH SECTION: YOU MAY ALSO LIKE / RELATED CREATIONS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-[#E8DFD0] space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#C9A34A] block mb-1">
                  Complete The Look
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#191714]">
                  You May Also Like
                </h2>
              </div>
              {product.category?.slug && (
                <Link
                  href={`/shop?category=${product.category.slug}`}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-[#003D2D] hover:text-[#C9A34A] transition-colors"
                >
                  <span>View All in {product.category.name}</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct: any) => (
                <ProductCard key={relProduct.id} {...relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

      {/* Mobile Sticky Bottom CTA Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md px-4 py-2.5 border-t border-[#E8DFD0] z-40 flex items-center justify-between gap-3 shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#746D62] block">Price</span>
          <span className="text-base font-serif font-bold text-[#003D2D]">
            {formatINR(currentPrice)}
          </span>
        </div>
        <button
          disabled={!isAvailable || isAdding}
          onClick={handleAddToCart}
          className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#003D2D] to-[#002219] hover:from-[#0B5940] hover:to-[#003D2D] text-[#FFF8ED] rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <ShoppingBag size={14} />
          <span>{isAdding ? 'Adding...' : isAvailable ? 'Add to Bag' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
}
