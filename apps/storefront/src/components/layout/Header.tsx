'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../lib/api';
import { formatINR } from '@rangoli/validation';
import { getOptimizedImageUrl } from '../../lib/image';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openDrawer } = useCart();
  const { wishlistIds } = useWishlist();
  const { user } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [announcement, setAnnouncement] = useState('Complimentary Express Delivery on Orders Above ₹1,999');

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch store settings for announcement
    fetchApi<Record<string, string>>('/settings/public').then((res) => {
      if (res.success && res.data?.announcement_bar_text) {
        setAnnouncement(res.data.announcement_bar_text);
      }
    });
  }, []);

  // Live Search Debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      fetchApi<any>(`/products?search=${encodeURIComponent(searchQuery.trim())}&limit=6`).then((res) => {
        if (res.success && res.data) {
          const items = Array.isArray(res.data) ? res.data : res.data.data;
          setSearchResults(Array.isArray(items) ? items : []);
        } else {
          setSearchResults([]);
        }
        setIsSearching(false);
        setHasSearched(true);
      });
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search on escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      searchInputRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectProduct = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/products/${slug}`);
  };

  const trendingTags = [
    'Premium Kurti Set',
    'Cotton Kurti Set',
    'Cord Set',
    'Tunic',
    'Silk Saree',
    'Festive Wear',
  ];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'New Arrivals', href: '/shop?filter=new_arrivals' },
    { label: 'Premium Kurti Set', href: '/shop?category=premium-kurti-set' },
    { label: 'Cotton Kurti Set', href: '/shop?category=cotton-kurti-set' },
    { label: 'Cord Set', href: '/shop?category=cord-set' },
    { label: 'Top & Kurties', href: '/shop?category=top-kurties' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#00271D] text-[#FAF6F0] py-1.5 sm:py-2 px-3 sm:px-4 text-xs font-medium tracking-wide border-b border-[#0B5940]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between">
          <div className="flex items-center justify-center sm:justify-start space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs text-center sm:text-left leading-tight">
            <Sparkles size={12} className="text-[#C9A34A] animate-pulse shrink-0" />
            <span className="font-light line-clamp-1">{announcement}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6 text-[11px] text-[#FAF6F0]/80 shrink-0">
            <span className="flex items-center space-x-1">
              <ShieldCheck size={12} className="text-[#C9A34A] shrink-0" />
              <span>100% Authentic Handloom</span>
            </span>
            <span className="h-3 w-px bg-[#0B5940]" />
            <span>Hassle-Free Returns</span>
            <span className="h-3 w-px bg-[#0B5940]" />
            <span>Secure UPI &amp; Cards</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#003D2D]/95 backdrop-blur-md text-white px-3 sm:px-4 lg:px-8 py-2 sm:py-2.5 border-b border-[#0B5940]/60 transition-all duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-[#F5EBDD] hover:text-[#C9A34A] focus:outline-none rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Official Company Logo - Responsive visual scale */}
          <Link href="/" className="flex items-center group py-0.5 shrink-0">
            <div className="relative h-11 w-32 sm:h-16 sm:w-52 md:h-[68px] md:w-64 flex items-center -my-1.5 sm:-my-3">
              <Image
                src="/brand/company-logo.png"
                alt="Rangoli Fashions"
                fill
                priority
                className="object-contain object-left group-hover:brightness-110 transition-all drop-shadow-sm sm:scale-110 origin-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7 text-sm font-medium tracking-wide">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-colors py-1 relative text-[13px] tracking-wide ${
                    isActive
                      ? 'text-[#C9A34A] font-semibold'
                      : 'text-[#FFF8ED]/90 hover:text-[#DFC37A]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C9A34A] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3 text-[#FFF8ED] shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 hover:text-[#C9A34A] transition-colors"
              aria-label="Search catalog"
            >
              <Search size={18} className="sm:w-[19px] sm:h-[19px]" />
            </button>

            {/* Account Icon */}
            <Link
              href={user ? '/account' : '/account/login'}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 hover:text-[#C9A34A] transition-colors"
              aria-label="Customer account"
            >
              <User size={18} className="sm:w-[19px] sm:h-[19px]" />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/account#wishlist"
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 hover:text-[#C9A34A] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={18} className="sm:w-[19px] sm:h-[19px]" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-[#C9A34A] text-[#002D21] text-[9px] sm:text-[10px] font-bold rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 flex items-center justify-center shadow-xs">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={openDrawer}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 hover:text-[#C9A34A] transition-colors relative flex items-center"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={18} className="sm:w-[19px] sm:h-[19px]" />
              <span className="ml-1 sm:ml-1.5 bg-[#C9A34A] text-[#002D21] text-[10px] sm:text-[11px] font-bold rounded-full h-4 min-w-[16px] px-1 sm:px-1.5 flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Luxury Live Search Modal & Dropdown */}
        {isSearchOpen && (
          <div ref={searchContainerRef} className="relative max-w-3xl mx-auto pt-3 pb-2 transition-all">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search kurti sets, co-ords, tunics, sarees, festive wear..."
                className="w-full pl-11 pr-14 py-3 bg-[#FAF6F0] rounded-full text-xs text-[#191714] placeholder-[#746D62] focus:outline-none focus:ring-2 focus:ring-[#C9A34A] shadow-xl border border-[#C9A34A]/30 transition-all"
              />
              <Search
                size={16}
                className="absolute left-4 text-[#746D62] pointer-events-none"
              />
              <div className="absolute right-3.5 flex items-center space-x-1">
                {isSearching && (
                  <Loader2 size={15} className="text-[#C9A34A] animate-spin" />
                )}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="text-[#746D62] hover:text-[#191714] p-1 rounded-full transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="text-[#746D62] hover:text-[#191714] p-1 rounded-full transition-colors ml-0.5"
                  aria-label="Close search"
                >
                  <X size={15} />
                </button>
              </div>
            </form>

            {/* Live Dropdown Results */}
            <div className="absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-[#E8DFD0] overflow-hidden z-50 animate-fadeIn divide-y divide-[#F5EBDD]">
              {/* Case 1: When user has typed and results exist */}
              {searchResults.length > 0 && (
                <div>
                  <div className="px-4 py-2.5 bg-[#FAF6F0] border-b border-[#E8DFD0] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#191714]">
                      Found {searchResults.length} creations for &quot;{searchQuery}&quot;
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="text-[#003D2D] hover:underline font-bold text-[11px] flex items-center space-x-0.5"
                    >
                      <span>View All</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#F5EBDD]">
                    {searchResults.map((product) => {
                      const primaryImg =
                        product.images?.find((img: any) => img.isPrimary) ||
                        product.images?.[0];
                      const imgUrl = getOptimizedImageUrl(primaryImg?.url, {
                        width: 150,
                        quality: 'auto:good',
                      });
                      const displayPrice = product.salePrice || product.regularPrice;
                      const hasDiscount =
                        product.salePrice &&
                        product.salePrice < product.regularPrice;

                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product.slug)}
                          className="flex items-center space-x-3.5 p-3 hover:bg-[#FAF6F0] cursor-pointer transition-colors group"
                        >
                          <div className="relative w-12 h-16 sm:w-14 sm:h-18 rounded-lg overflow-hidden bg-[#F5EBDD] shrink-0 border border-[#E8DFD0]">
                            <Image
                              src={imgUrl}
                              alt={product.name}
                              fill
                              className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-xs sm:text-sm font-medium text-[#191714] group-hover:text-[#003D2D] truncate transition-colors">
                              {product.name}
                            </h4>
                            {product.category?.name && (
                              <span className="inline-block text-[10px] uppercase tracking-wider text-[#746D62] mt-0.5">
                                {product.category.name}
                              </span>
                            )}
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="font-bold text-xs sm:text-sm text-[#003D2D]">
                                {formatINR(displayPrice)}
                              </span>
                              {hasDiscount && (
                                <>
                                  <span className="text-[11px] text-[#A49B8D] line-through">
                                    {formatINR(product.regularPrice)}
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FAF3E5] text-[#7A520C] border border-[#C9A34A]/40">
                                    {product.discountPercentage ||
                                      Math.round(
                                        ((product.regularPrice - product.salePrice) /
                                          product.regularPrice) *
                                          100
                                      )}
                                    % OFF
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <ArrowRight
                            size={14}
                            className="text-[#A49B8D] group-hover:text-[#003D2D] group-hover:translate-x-1 transition-all shrink-0"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-2.5 bg-[#FAF6F0] text-center border-t border-[#E8DFD0]">
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#003D2D] hover:text-[#0A5640] transition-colors"
                    >
                      <span>Explore all matching collections in store</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Case 2: Searched with no results */}
              {hasSearched && !isSearching && searchResults.length === 0 && (
                <div className="p-6 text-center space-y-3">
                  <p className="font-serif text-sm font-semibold text-[#191714]">
                    No creations found for &quot;{searchQuery}&quot;
                  </p>
                  <p className="text-xs text-[#746D62]">
                    Try checking your spelling or explore our popular categories below:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                    {trendingTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchQuery(tag);
                        }}
                        className="px-2.5 py-1 rounded-full bg-[#FAF6F0] hover:bg-[#003D2D] text-[#191714] hover:text-[#FFF8ED] border border-[#E8DFD0] text-[11px] font-medium transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Case 3: Empty query - Trending & quick suggestions */}
              {!searchQuery.trim() && (
                <div className="p-5 space-y-3">
                  <div className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7A520C]">
                    <Sparkles size={12} className="text-[#C9A34A]" />
                    <span>Popular &amp; Trending Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchQuery(tag);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#FAF6F0] hover:bg-[#003D2D] text-[#191714] hover:text-[#FFF8ED] border border-[#E8DFD0] text-xs font-medium transition-colors flex items-center space-x-1"
                      >
                        <Tag size={11} className="text-[#C9A34A]" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative bg-[#002D21] w-4/5 max-w-sm h-full shadow-2xl z-10 flex flex-col justify-between py-6 px-6 text-[#FFF8ED]">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#0B5940]">
                <div className="relative h-14 w-44 flex items-center">
                  <Image
                    src="/brand/company-logo.png"
                    alt="Rangoli Fashions"
                    fill
                    className="object-contain object-left scale-110 origin-left"
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#C9A34A] hover:text-white p-1"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col space-y-4 pt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-serif tracking-wide hover:text-[#C9A34A] transition-colors py-1 flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={14} className="text-[#C9A34A]/60" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#0B5940] space-y-3">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2.5 text-sm text-[#FFF8ED] hover:text-[#C9A34A] py-1"
              >
                <User size={18} />
                <span>{user ? `My Account (${user.fullName || 'User'})` : 'Sign In / Register'}</span>
              </Link>
              <Link
                href="/account#wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2.5 text-sm text-[#FFF8ED] hover:text-[#C9A34A] py-1"
              >
                <Heart size={18} />
                <span>My Wishlist ({wishlistIds.length})</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
