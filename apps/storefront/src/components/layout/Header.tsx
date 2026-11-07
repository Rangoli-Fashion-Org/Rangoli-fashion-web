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
  ChevronDown,
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
  const [categories, setCategories] = useState<any[]>([]);
  const [announcement, setAnnouncement] = useState('Free Shipping on Orders Above ₹1,999');

  useEffect(() => {
    // Fetch dynamic categories from API
    fetchApi<any[]>('/categories').then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setCategories(res.data);
      }
    });

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
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-[#FAF6F0] border-b border-[#E8DFD0] py-1.5 px-4 text-xs font-medium text-[#191714]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[#C9A34A]">🚚</span>
            <span>{announcement}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6 text-[#746D62]">
            <span>Easy Returns</span>
            <span className="h-3 w-px bg-[#E8DFD0]" />
            <span>Secure Payments</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#003D2D] text-white px-4 lg:px-8 py-3.5 transition-all duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-[#F5EBDD] hover:text-[#C9A34A] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-11 sm:h-12 w-36 sm:w-44 flex items-center">
              <Image
                src="/brand/company-logo.png"
                alt="Rangoli Fashions"
                fill
                priority
                className="object-contain object-left group-hover:brightness-110 transition-all"
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
                  className={`transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#C9A34A] font-semibold'
                      : 'text-[#FFF8ED]/90 hover:text-[#DFC37A]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C9A34A]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-5 text-[#FFF8ED]">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:text-[#C9A34A] transition-colors p-1"
              aria-label="Search catalog"
            >
              <Search size={20} />
            </button>

            {/* Account Icon */}
            <Link
              href={user ? '/account' : '/account/login'}
              className="hover:text-[#C9A34A] transition-colors p-1"
              aria-label="Customer account"
            >
              <User size={20} />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/account#wishlist"
              className="hover:text-[#C9A34A] transition-colors p-1 relative hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9A34A] text-[#191714] text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={openDrawer}
              className="hover:text-[#C9A34A] transition-colors p-1 relative flex items-center"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={20} />
              <span className="ml-1.5 bg-[#C9A34A] text-[#002D21] text-[11px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                {itemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="max-w-3xl mx-auto pt-3 pb-1 transition-all">
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
                placeholder="Search kurtis, cord sets, festive wear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#002D21] border border-[#C9A34A]/50 rounded-full py-2 pl-4 pr-10 text-sm text-[#FFF8ED] placeholder-[#FFF8ED]/50 focus:outline-none focus:border-[#C9A34A]"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 text-[#C9A34A] hover:text-[#DFC37A]"
                aria-label="Submit search"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative bg-[#002D21] w-4/5 max-w-sm h-full shadow-2xl z-10 flex flex-col justify-between py-6 px-6 text-[#FFF8ED]">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#0B5940]">
                <div className="relative h-10 w-36 flex items-center">
                  <Image
                    src="/brand/company-logo.png"
                    alt="Rangoli Fashions"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#C9A34A] hover:text-white p-1"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col space-y-4 py-6 text-base font-medium">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-[#C9A34A] transition-colors py-1.5 border-b border-[#0B5940]/50"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/track-order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#C9A34A] transition-colors py-1.5"
                >
                  Track Order
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-[#0B5940] flex flex-col space-y-3 text-sm">
              <Link
                href={user ? '/account' : '/account/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-[#C9A34A] hover:text-white"
              >
                <User size={18} />
                <span>{user ? `Account (${user.fullName})` : 'Sign In / Register'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

