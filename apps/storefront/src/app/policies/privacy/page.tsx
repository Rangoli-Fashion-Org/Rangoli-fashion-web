import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-[#191714] mb-2 text-center">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#746D62] text-center mb-8">
          Last updated: November 2026
        </p>

        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8DFD0] shadow-xs text-xs sm:text-sm text-[#746D62] space-y-5 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#003D2D]">Your Privacy Matters</h2>
            <p>
              Rangoli Fashions values the trust you place in us. We adhere to the highest standards for secure transactions and customer data privacy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#003D2D]">Information Collected</h2>
            <p>
              We collect your name, shipping address, contact number, and email strictly to fulfill orders, process payments, and provide delivery notifications. We never sell or share your personal data with third-party marketers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#003D2D]">Payment Security</h2>
            <p>
              All online transactions are processed through PCI-DSS Level 1 compliant gateways (Razorpay). Rangoli Fashions does not store your credit/debit card numbers or CVV.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
