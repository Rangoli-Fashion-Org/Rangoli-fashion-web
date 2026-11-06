'use client';

import React, { useState } from 'react';
import { fetchApi } from '../../lib/api';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    const res = await fetchApi<{ message?: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim() }),
    });

    if (res.success) {
      setStatus('success');
      setMessage(res.message || 'Thank you for subscribing to Rangoli Fashions!');
      setEmail('');
    } else {
      setStatus('error');
      setMessage(res.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="bg-[#FAF6F0] py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-[#003D2D] text-[#FFF8ED] px-6 sm:px-12 py-12 sm:py-16 text-center shadow-xl overflow-hidden border border-[#C9A34A]/40">
          {/* Decorative Gold Leaf Flourish Corners */}
          <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-[#C9A34A]/30 rounded-tl-3xl pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-[#C9A34A]/30 rounded-br-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-medium tracking-tight">
              Stay in the Fashion Loop
            </h2>
            <p className="text-xs sm:text-sm text-[#F5EBDD]/80">
              Get updates on new arrivals, exclusive festive edits and special promotions.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full sm:flex-1 px-5 py-3 rounded-full bg-white text-[#191714] text-sm placeholder-[#746D62] focus:outline-none focus:ring-2 focus:ring-[#C9A34A]"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#C9A34A] text-[#002D21] font-semibold text-xs tracking-wider uppercase hover:bg-[#DFC37A] transition-colors shadow-sm disabled:opacity-60"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            {message && (
              <p
                className={`text-xs mt-3 font-medium ${
                  status === 'success' ? 'text-[#DFC37A]' : 'text-red-300'
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

