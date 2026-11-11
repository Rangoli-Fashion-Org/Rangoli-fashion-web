'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { isValidEmail } from '@rangoli/validation';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { refreshCart } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please provide a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    const res = await login(email.trim(), password);
    if (res.success) {
      await refreshCart();
      router.push('/account');
    } else {
      setError(res.message || 'Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE0] py-12 sm:py-16 md:py-20 flex items-center justify-center px-4 overflow-hidden">
      {/* Ambient Silk Weave & Warm Gold Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(201, 163, 74, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 80% 70%, rgba(0, 61, 45, 0.08) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#E8DFD0] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Brand Story */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#003D2D] via-[#002B20] to-[#001F17] p-8 sm:p-10 text-[#FFF8ED] flex flex-col justify-between relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 40% 30%, rgba(229, 193, 88, 0.25) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 space-y-6">
              {/* Official Brand Logo */}
              <div className="relative w-48 h-20 sm:w-56 sm:h-24">
                <Image
                  src="/brand/rangoli-brand-logo.png"
                  alt="Rangoli Fashions"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>

              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A34A]/20 border border-[#C9A34A]/40 text-[#E5C158] text-[10px] font-bold uppercase tracking-widest">
                <Sparkles size={11} className="text-[#E5C158]" />
                <span>Patron Sign In</span>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-snug">
                  Welcome Back to <span className="italic font-medium text-[#E5C158]">Rangoli</span>
                </h2>
                <p className="text-xs text-[#E8DFD0]/80 leading-relaxed">
                  Access your orders, tracked shipments, curated wishlist, and saved delivery addresses with ease.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <span className="font-serif font-semibold text-[#E5C158] block">Your Patron Privileges</span>
                <p className="text-[11px] text-[#E8DFD0]/70">
                  Enjoy saved payment methods, complimentary blouse customization tracking, and one-click festive checkout.
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center space-x-2 text-[11px] text-[#E8DFD0]/70">
              <ShieldCheck size={14} className="text-[#C9A34A] shrink-0" />
              <span>Protected by 256-bit SSL Encryption</span>
            </div>
          </div>

          {/* Right Column: Sign In Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
            <div className="mb-6 space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#FAF3E5] border border-[#C9A34A]/40 text-[#7A520C] text-[9px] font-bold uppercase tracking-widest">
                <span>✦</span>
                <span>Patron Access</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#191714]">
                Sign In to Your Account
              </h1>
              <p className="text-xs text-[#746D62]">
                Please enter your registered credentials below.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center space-x-2 animate-fadeIn">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#191714] font-medium mb-1.5">
                  Email Address <span className="text-[#C9A34A]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#746D62]">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3.5 py-3 border border-[#E8DFD0] rounded-xl text-[#191714] placeholder-[#A49B8D] focus:outline-none focus:border-[#003D2D] focus:ring-2 focus:ring-[#003D2D]/10 bg-[#FCFAF6] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[#191714] font-medium">
                    Password <span className="text-[#C9A34A]">*</span>
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#746D62]">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-[#E8DFD0] rounded-xl text-[#191714] placeholder-[#A49B8D] focus:outline-none focus:border-[#003D2D] focus:ring-2 focus:ring-[#003D2D]/10 bg-[#FCFAF6] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#746D62] hover:text-[#191714] transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-[#003D2D] to-[#0A5640] hover:from-[#002B20] hover:to-[#003D2D] text-[#FFF8ED] rounded-xl font-semibold text-xs tracking-wider uppercase shadow-md transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 mt-4"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#FFF8ED] border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#E8DFD0] text-center text-xs text-[#746D62]">
              <p>
                Don&apos;t have an account yet?{' '}
                <Link
                  href="/account/register"
                  className="font-semibold text-[#003D2D] hover:text-[#0B5940] underline ml-1"
                >
                  Create Patron Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
