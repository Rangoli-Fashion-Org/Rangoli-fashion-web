import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#002D21] text-[#F5EBDD] border-t border-[#0B5940]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center">
              <div className="relative h-12 w-44">
                <Image
                  src="/brand/company-logo.png"
                  alt="Rangoli Fashions"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-sm text-[#F5EBDD]/80 leading-relaxed max-w-sm">
              A fashion destination offering thoughtfully curated Indian ethnic styles for everyday grace and special celebrations.
            </p>

            <div className="flex items-center space-x-4 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#003D2D] border border-[#0B5940] flex items-center justify-center text-[#C9A34A] hover:bg-[#C9A34A] hover:text-[#002D21] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#003D2D] border border-[#0B5940] flex items-center justify-center text-[#C9A34A] hover:bg-[#C9A34A] hover:text-[#002D21] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#003D2D] border border-[#0B5940] flex items-center justify-center text-[#C9A34A] hover:bg-[#C9A34A] hover:text-[#002D21] transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#003D2D] border border-[#0B5940] flex items-center justify-center text-[#C9A34A] hover:bg-[#C9A34A] hover:text-[#002D21] transition-colors"
                aria-label="WhatsApp"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-[#FFF8ED] tracking-wider border-b border-[#0B5940] pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F5EBDD]/80">
              <li>
                <Link href="/" className="hover:text-[#C9A34A] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/shop?filter=new_arrivals" className="hover:text-[#C9A34A] transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link href="/shop?category=premium-kurti-set" className="hover:text-[#C9A34A] transition-colors">Premium Kurti Set</Link>
              </li>
              <li>
                <Link href="/shop?category=cotton-kurti-set" className="hover:text-[#C9A34A] transition-colors">Cotton Kurti Set</Link>
              </li>
              <li>
                <Link href="/shop?category=cord-set" className="hover:text-[#C9A34A] transition-colors">Cord Set</Link>
              </li>
              <li>
                <Link href="/shop?category=top-kurties" className="hover:text-[#C9A34A] transition-colors">Top & Kurties</Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-[#FFF8ED] tracking-wider border-b border-[#0B5940] pb-2">
              Help
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F5EBDD]/80">
              <li>
                <Link href="/track-order" className="hover:text-[#C9A34A] transition-colors">Track Order</Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-[#C9A34A] transition-colors">Returns & Exchanges</Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-[#C9A34A] transition-colors">Shipping Info</Link>
              </li>
              <li>
                <Link href="/contact#faq" className="hover:text-[#C9A34A] transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C9A34A] transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-[#FFF8ED] tracking-wider border-b border-[#0B5940] pb-2">
              About
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F5EBDD]/80">
              <li>
                <Link href="/about" className="hover:text-[#C9A34A] transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/about#story" className="hover:text-[#C9A34A] transition-colors">Our Story</Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-[#C9A34A] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-[#C9A34A] transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#0B5940]/60 bg-[#00251B] py-5 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-[#F5EBDD]/70 gap-4">
          <p>© 2026 Rangoli Fashions. All Rights Reserved.</p>
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-semibold text-white tracking-wider">VISA</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-semibold text-white tracking-wider">MASTERCARD</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-semibold text-white tracking-wider">UPI</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-semibold text-white tracking-wider">RUPAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

