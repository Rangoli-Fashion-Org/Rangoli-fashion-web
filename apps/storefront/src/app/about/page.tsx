import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#C9A34A]">
            The Heritage &amp; Craft
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#191714]">
            About Rangoli Fashions
          </h1>
          <div className="w-16 h-0.5 bg-[#C9A34A] mx-auto mt-4" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DFD0] p-8 sm:p-12 shadow-sm space-y-8 leading-relaxed text-sm text-[#746D62]">
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#FFF8ED] border border-[#E8DFD0]">
            <Image
              src="/brand/rangoli-logo.jpg"
              alt="Rangoli Fashions Craftsmanship"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[#003D2D]">Our Story</h2>
            <p>
              Born from a deep reverence for India&apos;s rich textile heritage, <strong>Rangoli Fashions</strong> curates ethnic garments that celebrate classical artisanal techniques while honoring modern comfort and silhouette.
            </p>
            <p>
              From royal Jaipur block prints and intricate zari embroidery to breathable pure cotton co-ords and opulent festive suits, every piece in our collection is thoughtfully designed to make you feel graceful, dignified, and effortlessly comfortable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E8DFD0]">
            <div className="p-5 bg-[#FFF8ED] rounded-xl border border-[#E8DFD0] space-y-2">
              <h3 className="font-serif text-lg font-semibold text-[#003D2D]">Our Mission</h3>
              <p className="text-xs">
                To bring authentic, premium Indian ethnic wear directly to discerning women worldwide with uncompromising quality and affordable luxury.
              </p>
            </div>
            <div className="p-5 bg-[#FFF8ED] rounded-xl border border-[#E8DFD0] space-y-2">
              <h3 className="font-serif text-lg font-semibold text-[#003D2D]">Our Vision</h3>
              <p className="text-xs">
                To be the foremost global destination for refined Indian silhouettes, bridging centuries-old craftsmanship with contemporary everyday fashion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
