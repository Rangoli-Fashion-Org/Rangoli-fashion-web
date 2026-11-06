import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const FestiveBanner: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-[#FFF8ED] border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#FFF8ED] via-[#F5EBDD] to-[#EBDDC9] border border-[#C9A34A]/40 shadow-lg p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Text */}
          <div className="max-w-lg z-10 text-left space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C9A34A]">
              Special Occasions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#191714] font-normal leading-tight">
              Festive Edit
            </h2>
            <p className="text-sm sm:text-base text-[#746D62] leading-relaxed">
              Elegant looks crafted with intricate embroidery and rich fabrics for your special moments.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?category=premium-kurti-set"
                className="inline-flex items-center space-x-2 px-7 py-3 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-full text-xs font-semibold tracking-wider uppercase shadow-md transition-all duration-300 group"
              >
                <span>Shop Now</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative w-full max-w-sm aspect-[4/3] sm:aspect-[16/10] rounded-xl overflow-hidden shadow-xl border-2 border-white/80 bg-[#FAF6F0]">
            <Image
              src="/brand/rangoli-logo.jpg"
              alt="Rangoli Fashions Festive Edit"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

