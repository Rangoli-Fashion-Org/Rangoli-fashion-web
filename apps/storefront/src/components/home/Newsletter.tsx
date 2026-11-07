'use client';

import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
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
      setMessage(res.message || 'Welcome to the Privé Circle. Check your inbox for your ₹500 voucher code!');
      setEmail('');
    } else {
      setStatus('error');
      setMessage(res.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="bg-[#FAF6F0] py-14 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#002D21] via-[#003829] to-[#002319] text-[#FFF8ED] px-6 sm:px-14 py-14 sm:py-20 text-center shadow-2xl overflow-hidden border border-[#C9A34A]/50">
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#C9A34A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#C9A34A]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Decorative Corner Filigrees */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#C9A34A]/40 rounded-tl-xl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#C9A34A]/40 rounded-br-xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C9A34A]/40 text-[#E5C158] text-[11px] sm:text-xs font-semibold uppercase tracking-widest">
              <Sparkles size={12} className="animate-pulse" />
              <span>The Rangoli Privé Circle</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal tracking-tight leading-tight">
              Curated Elegance, Delivered to Your Inbox
            </h2>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-light max-w-md mx-auto">
              Receive private seasonal previews, handpicked festive edits, and enjoy an exclusive <strong>₹500 welcome voucher</strong> on your first order.
            </p>

            {status === 'success' ? (
              <div className="mt-6 p-4 rounded-xl bg-white/15 backdrop-blur-md border border-[#C9A34A]/60 flex items-center justify-center space-x-2 text-xs sm:text-sm text-[#FFF8ED] font-medium">
                <CheckCircle2 size={18} className="text-[#E5C158]" />
                <span>{message}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full sm:flex-1 px-6 py-4 rounded-full bg-white text-[#191714] text-xs sm:text-sm placeholder-[#746D62] focus:outline-none focus:ring-2 focus:ring-[#C9A34A] shadow-md"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C9A34A] hover:bg-[#E5C158] text-[#002D21] font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-xl hover:shadow-[#C9A34A]/40 disabled:opacity-60 flex items-center justify-center space-x-2 group"
                >
                  <span>{status === 'loading' ? 'Joining...' : 'Join Privé'}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="text-xs text-red-300 font-medium pt-2">{message}</p>
            )}

            <p className="text-[11px] text-white/50 pt-2">
              We respect your privacy. No spam, only handpicked ethnic luxury.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
