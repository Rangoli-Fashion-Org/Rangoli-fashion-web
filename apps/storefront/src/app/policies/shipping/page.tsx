import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-[#191714] mb-2 text-center">
          Shipping &amp; Delivery Information
        </h1>
        <p className="text-xs text-[#746D62] text-center mb-8">
          Last updated: November 2026
        </p>

        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8DFD0] shadow-xs text-xs sm:text-sm text-[#746D62] space-y-5 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#003D2D]">Free Shipping Threshold</h2>
            <p>
              We offer complimentary standard shipping across India on all orders exceeding <strong>₹1,999</strong>. For orders below this threshold, a flat shipping charge of ₹99 applies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#003D2D]">Dispatch &amp; Delivery Timelines</h2>
            <p>
              All orders are dispatched from our Jaipur atelier within 24–48 hours of order confirmation. Transit times range between 3 to 5 business days depending on delivery location.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#003D2D]">Order Tracking</h2>
            <p>
              As soon as your shipment is packed and picked up by our courier partners, an SMS and email notification containing your live tracking reference will be dispatched.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

