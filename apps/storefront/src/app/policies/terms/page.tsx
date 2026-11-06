import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-[#191714] mb-2 text-center">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-[#746D62] text-center mb-8">
          Last updated: November 2026
        </p>

        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8DFD0] shadow-xs text-xs sm:text-sm text-[#746D62] space-y-5 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#003D2D]">Agreement to Terms</h2>
            <p>
              By accessing and shopping with Rangoli Fashions, you acknowledge and agree to be bound by these Terms and Conditions and our associated store policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#003D2D]">Product Representation</h2>
            <p>
              We strive to display garment colors, embroidery, and textures as accurately as possible. However, slight variations in color tone may occur due to photography lighting and different screen calibrations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#003D2D]">Pricing and Availability</h2>
            <p>
              All prices are listed in Indian Rupees (INR) and are inclusive of applicable GST taxes. We reserve the right to correct any typographical pricing errors.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
