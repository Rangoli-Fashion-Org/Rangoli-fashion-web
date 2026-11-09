'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../lib/api';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { itemCount, openDrawer } = useCart();
  const { wishlistIds } = useWishlist();
  const { user } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcement, setAnnouncement] = useState('Complimentary Express Delivery on Orders Above ₹1,999');

  useEffect(() => {
    // Fetch store settings for announcement
    fetchApi<Record<string, string>>('/settings/public').then((res) => {
      if (res.success && res.data?.announcement_bar_text) {
        setAnnouncement(res.data.announcement_bar_text);
      }
    });
  }, []);

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

        {/* Expandable Luxury Search Drawer */}
        {isSearchOpen && (
          <div className="max-w-3xl mx-auto pt-3 pb-2 transition-all">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search kurti sets, co-ords, chanderi silks, festive wear..."
                className="w-full pl-11 pr-12 py-3 bg-[#FAF6F0] rounded-full text-xs text-[#191714] placeholder-[#746D62] focus:outline-none focus:ring-2 focus:ring-[#C9A34A] shadow-lg"
              />
              <Search
                size={16}
                className="absolute left-4 text-[#746D62] pointer-events-none"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-4 text-[#746D62] hover:text-[#191714] p-1"
              >
                <X size={15} />
              </button>
            </form>
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
