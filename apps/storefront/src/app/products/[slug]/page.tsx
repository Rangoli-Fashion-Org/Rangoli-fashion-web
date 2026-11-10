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
  const [isAdding, setIsAdding] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
          const firstAvailable =
            res.data.variants.find((v: any) => v.stockQuantity > 0) || res.data.variants[0];
          setSelectedSize(firstAvailable.size);
          setSelectedVariantId(firstAvailable.id);
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

        {/* MAIN PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: IMAGE SHOWCASE GALLERY */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3.5 sm:gap-4 items-start">
            {/* Vertical / Horizontal Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[580px] w-full md:w-20 shrink-0 scrollbar-thin">
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
            <div className="relative flex-1 w-full aspect-[3/4] max-h-[620px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FFFDF9] border border-[#E6D5BE] shadow-xl group">
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

          {/* RIGHT: PRODUCT INFO, PRICING & ACTIONS */}
          <div className="lg:col-span-5 flex flex-col space-y-5 sm:space-y-6">
            {/* Title & Category Eyebrow */}
            <div className="space-y-1.5">
              {product.category && (
                <span className="text-[11px] uppercase tracking-widest font-bold text-[#C9A34A]">
                  {product.category.name}
                </span>
              )}
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#191714] font-medium leading-tight">
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

            {/* Pricing Box with Royal Border */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E8] to-[#FFF8ED] border border-[#E6D5BE] shadow-xs space-y-1">
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
              <p className="text-[11px] text-[#746D62] flex items-center space-x-1.5 pt-1">
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
            <div className="flex items-center space-x-4 pt-1">
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
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
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

            {/* Assurance Trust Badges */}
            <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-white border border-[#E6D5BE] text-center text-[10px] sm:text-[11px] text-[#746D62]">
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

            {/* Collapsible Details Accordions */}
            <div className="space-y-2.5 pt-2 text-xs">
              {/* Product Details */}
              <div className="border border-[#E6D5BE] rounded-2xl bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                  className="w-full p-4 flex items-center justify-between font-serif text-sm font-semibold text-[#191714] text-left hover:bg-[#FAF6F0] transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Sparkles size={14} className="text-[#C9A34A]" />
                    <span>Product Details &amp; Silhouette</span>
                  </span>
                  {openAccordion === 'details' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'details' && (
                  <div className="p-4 pt-1 text-[#746D62] leading-relaxed border-t border-[#FAF2E6] font-light">
                    {product.description}
                  </div>
                )}
              </div>

              {/* Material & Care */}
              <div className="border border-[#E6D5BE] rounded-2xl bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                  className="w-full p-4 flex items-center justify-between font-serif text-sm font-semibold text-[#191714] text-left hover:bg-[#FAF6F0] transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <ShieldCheck size={14} className="text-[#C9A34A]" />
                    <span>Fabric Composition &amp; Care</span>
                  </span>
                  {openAccordion === 'care' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'care' && (
                  <div className="p-4 pt-1 text-[#746D62] leading-relaxed border-t border-[#FAF2E6] space-y-2 font-light">
                    <p>
                      <strong className="text-[#191714] font-medium">Fabric:</strong>{' '}
                      {product.material || '100% Pure Handloom Cotton & Fine Chanderi Silk Blend'}
                    </p>
                    <p>
                      <strong className="text-[#191714] font-medium">Care Instructions:</strong>{' '}
                      {product.careInstructions ||
                        'Dry clean recommended for first wash to preserve embroidery. Subsequently gentle cold hand wash with mild detergent. Dry in shade.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery & Dispatch */}
              <div className="border border-[#E6D5BE] rounded-2xl bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full p-4 flex items-center justify-between font-serif text-sm font-semibold text-[#191714] text-left hover:bg-[#FAF6F0] transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Clock size={14} className="text-[#C9A34A]" />
                    <span>Shipping, Dispatch &amp; Exchanges</span>
                  </span>
                  {openAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="p-4 pt-1 text-[#746D62] leading-relaxed border-t border-[#FAF2E6] space-y-1.5 font-light">
                    <p>• Dispatched within 24 to 48 business hours from our Jaipur atelier.</p>
                    <p>• Express delivery across India within 3–5 business days.</p>
                    <p>• Hassle-free 7-day doorstep exchange and return policy.</p>
                  </div>
                )}
              </div>
            </div>

            {/* CUSTOMER REVIEWS SECTION */}
            <div className="pt-6 border-t border-[#E6D5BE] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-medium text-[#191714]">
                  Customer Reviews
                </h3>
                <span className="text-xs text-[#746D62]">
                  {product.reviews?.length || 0} verified rating{product.reviews?.length === 1 ? '' : 's'}
                </span>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-3">
                  {product.reviews.map((r: any) => (
                    <div
                      key={r.id}
                      className="p-4 bg-white rounded-2xl border border-[#E6D5BE] shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#191714]">{r.authorName}</span>
                        <div className="flex text-[#C9A34A]">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#746D62] leading-relaxed font-light">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-white border border-[#E6D5BE] text-center space-y-1">
                  <p className="font-serif text-sm font-semibold text-[#191714]">Be the First to Review</p>
                  <p className="text-xs text-[#746D62]">
                    Share your experience with this outfit to assist other shoppers.
                  </p>
                </div>
              )}

              {/* Write Review Form */}
              <form
                onSubmit={handleReviewSubmit}
                className="bg-white p-5 rounded-2xl border border-[#E6D5BE] shadow-xs space-y-3 text-xs"
              >
                <h4 className="font-serif text-sm font-semibold text-[#003D2D]">
                  Write a Review
                </h4>
                {reviewSubmitted && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-medium flex items-center space-x-2">
                    <CheckCircle2 size={16} />
                    <span>Thank you! Your review has been submitted for moderation.</span>
                  </div>
                )}
                <div>
                  <label className="block text-[#746D62] mb-1 font-medium">Your Full Name</label>
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
                  <label className="block text-[#746D62] mb-1 font-medium">Rating</label>
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
                  <label className="block text-[#746D62] mb-1 font-medium">Review Comments</label>
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
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#003D2D] hover:bg-[#0B5940] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
                >
                  Post Review
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
