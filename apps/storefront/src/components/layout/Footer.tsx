'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Heart,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

/**
 * Footer link column.
 * Mobile (< md): collapsible accordion with a rotating chevron arrow.
 * Tablet/Desktop (>= md): always expanded, chevron hidden.
 */
const FooterColumn: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
  <div className="border-b border-[#0B5940] md:border-b-0 md:space-y-4">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center justify-between py-4 md:py-0 md:pb-2 md:border-b md:border-[#0B5940] md:cursor-default text-left"
    >
      <h4 className="font-serif text-sm font-semibold text-[#E5C158] tracking-widest uppercase">
        {title}
      </h4>
      <ChevronDown
        size={18}
        className={`md:hidden text-[#C9A34A] shrink-0 transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 md:max-h-none md:opacity-100 ${
        isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
      } md:pb-0`}
    >
      {children}
    </div>
  </div>
);

export const Footer: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggle = (key: string) => setOpenSection((prev) => (prev === key ? null : key));

  return (
    <footer className="bg-[#00271D] text-[#F5EBDD] border-t border-[#0B5940]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 md:gap-10 lg:gap-12">
          {/* Brand Identity & Story */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 pb-6 md:pb-0 border-b border-[#0B5940] md:border-b-0">
            <Link href="/" className="inline-flex items-center">
              <div className="relative h-12 w-48">
                <Image
                  src="/brand/company-logo.png"
                  alt="Rangoli Fashions"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#F5EBDD]/80 leading-relaxed max-w-sm font-light">
              A luxury ethnic fashion house dedicated to preserving classical Indian textiles, royal zari embroidery, and pure breathable silhouettes for modern celebrations.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#003D2D] border border-[#0B5940] flex items-center justify-center text-[#C9A34A] hover:bg-[#C9A34A] hover:text-[#002D21] transition-all hover:scale-105 shadow-xs"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#003D2D] border border-[#0B5940] flex items-center justify-center text-[#C9A34A] hover:bg-[#C9A34A] hover:text-[#002D21] transition-all hover:scale-105 shadow-xs"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#003D2D] border border-[#0B5940] flex items-center justify-center text-[#C9A34A] hover:bg-[#C9A34A] hover:text-[#002D21] transition-all hover:scale-105 shadow-xs"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#003D2D] border border-[#0B5940] flex items-center justify-center text-[#C9A34A] hover:bg-[#C9A34A] hover:text-[#002D21] transition-all hover:scale-105 shadow-xs"
                aria-label="WhatsApp Concierge"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Curated Categories */}
          <FooterColumn title="Collections" isOpen={openSection === 'collections'} onToggle={() => toggle('collections')}>
            <ul className="space-y-3 md:space-y-2.5 text-[13px] md:text-xs text-[#F5EBDD]/80">
              <li>
                <Link href="/shop?filter=new_arrivals" className="hover:text-[#E5C158] transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link href="/shop?category=premium-kurti-set" className="hover:text-[#E5C158] transition-colors">Premium Kurti Set</Link>
              </li>
              <li>
                <Link href="/shop?category=cotton-kurti-set" className="hover:text-[#E5C158] transition-colors">Cotton Kurti Set</Link>
              </li>
              <li>
                <Link href="/shop?category=cord-set" className="hover:text-[#E5C158] transition-colors">Cord Set</Link>
              </li>
              <li>
                <Link href="/shop?category=top-kurties" className="hover:text-[#E5C158] transition-colors">Top &amp; Kurties</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#E5C158] transition-colors font-medium text-[#C9A34A]">View All Styles →</Link>
              </li>
            </ul>
          </FooterColumn>

          {/* Customer Care / Concierge */}
          <FooterColumn title="Concierge" isOpen={openSection === 'concierge'} onToggle={() => toggle('concierge')}>
            <ul className="space-y-3 md:space-y-2.5 text-[13px] md:text-xs text-[#F5EBDD]/80">
              <li>
                <Link href="/track-order" className="hover:text-[#E5C158] transition-colors">Track Your Order</Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-[#E5C158] transition-colors">Returns &amp; Exchanges</Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-[#E5C158] transition-colors">Shipping &amp; Delivery</Link>
              </li>
              <li>
                <Link href="/contact#faq" className="hover:text-[#E5C158] transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E5C158] transition-colors">Contact Support</Link>
              </li>
            </ul>
          </FooterColumn>

          {/* House of Rangoli */}
          <FooterColumn title="About Rangoli" isOpen={openSection === 'about'} onToggle={() => toggle('about')}>
            <ul className="space-y-3 md:space-y-2.5 text-[13px] md:text-xs text-[#F5EBDD]/80">
              <li>
                <Link href="/about" className="hover:text-[#E5C158] transition-colors">Our Story &amp; Heritage</Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-[#E5C158] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-[#E5C158] transition-colors">Terms of Service</Link>
              </li>
              <li className="pt-2 text-[11px] text-[#C9A34A] flex items-center space-x-1">
                <ShieldCheck size={13} className="shrink-0" />
                <span>Verified Artisan Partners</span>
              </li>
            </ul>
          </FooterColumn>
        </div>
      </div>

      {/* Bottom Legal & Payment Ribbon */}
      <div className="border-t border-[#0B5940]/70 bg-[#001F17] py-5 sm:py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] sm:text-xs text-[#F5EBDD]/70 gap-4">
          <p className="text-center md:text-left leading-relaxed">
            © 2026 Rangoli Fashions. All rights reserved. Handcrafted with{' '}
            <Heart size={12} className="inline-block align-[-2px] text-[#C9A34A] fill-[#C9A34A]" /> in India.
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="px-2 sm:px-2.5 py-1 bg-white/10 rounded-md text-[9px] sm:text-[10px] font-bold text-white tracking-widest">UPI</span>
            <span className="px-2 sm:px-2.5 py-1 bg-white/10 rounded-md text-[9px] sm:text-[10px] font-bold text-white tracking-widest">VISA</span>
            <span className="px-2 sm:px-2.5 py-1 bg-white/10 rounded-md text-[9px] sm:text-[10px] font-bold text-white tracking-widest">MASTERCARD</span>
            <span className="px-2 sm:px-2.5 py-1 bg-white/10 rounded-md text-[9px] sm:text-[10px] font-bold text-white tracking-widest">RUPAY</span>
            <span className="px-2 sm:px-2.5 py-1 bg-[#003D2D] border border-[#0B5940] rounded-md text-[9px] sm:text-[10px] font-semibold text-[#C9A34A] tracking-wider">RAZORPAY SECURED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
