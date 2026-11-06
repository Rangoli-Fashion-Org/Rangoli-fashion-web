import React from 'react';

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-[#191714] mb-2 text-center">
          Returns &amp; Exchanges Policy
        </h1>
        <p className="text-xs text-[#746D62] text-center mb-8">
          Last updated: November 2026
        </p>

        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8DFD0] shadow-xs text-xs sm:text-sm text-[#746D62] space-y-5 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#003D2D]">7-Day Hassle-Free Returns</h2>
            <p>
              At Rangoli Fashions, we stand behind the beauty and craftsmanship of our garments. If you are not completely satisfied with your purchase, you may request a return or exchange within 7 days of delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#003D2D]">Conditions for Return</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Items must be unworn, unwashed, and undamaged.</li>
              <li>Original tags, spare buttons, and brand packaging must be intact.</li>
              <li>Custom-tailored or altered garments are not eligible for returns.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#003D2D]">Refund Process</h2>
            <p>
              Once your returned garment is inspected and approved at our facility, refunds will be initiated to your original payment method within 5-7 business days. For COD orders, refund will be transferred via bank NEFT or UPI.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
