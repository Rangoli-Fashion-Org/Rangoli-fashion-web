'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff, Sparkles, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { isValidEmail, isValidIndianPhone } from '@rangoli/validation';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please provide a valid email address');
      return;
    }

    if (phoneNumber && !isValidIndianPhone(phoneNumber)) {
      setError('Please provide a valid 10-digit Indian mobile number');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    const res = await register(fullName.trim(), email.trim(), password, phoneNumber.trim() || undefined);
    if (res.success) {
      router.push('/account');
    } else {
      setError(res.message || 'Registration failed. Please check your details and try again.');
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
          
          {/* Left Column: Brand Story & Patron Privileges */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#003D2D] via-[#002B20] to-[#001F17] p-8 sm:p-10 text-[#FFF8ED] flex flex-col justify-between relative overflow-hidden">
            {/* Subtle Gold Foil Glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 40% 30%, rgba(229, 193, 88, 0.25) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 space-y-6">
              {/* Emblem / Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C9A34A] shadow-md bg-[#FFF8ED]">
                  <Image
                    src="/favicon.png"
                    alt="Rangoli Fashions Emblem"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="block font-serif text-lg font-bold tracking-wider uppercase text-[#E5C158]">
                    Rangoli
                  </span>
                  <span className="block text-[10px] tracking-[0.25em] text-[#C9A34A] uppercase">
                    Haute Couture
                  </span>
                </div>
              </div>

              {/* Eyebrow */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A34A]/20 border border-[#C9A34A]/40 text-[#E5C158] text-[10px] font-bold uppercase tracking-widest">
                <Sparkles size={11} className="text-[#E5C158]" />
                <span>Patron Circle</span>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-snug">
                  Begin Your Journey of <span className="italic font-medium text-[#E5C158]">Pure Grace</span>
                </h2>
                <p className="text-xs text-[#E8DFD0]/80 leading-relaxed">
                  Join our cherished circle of patrons to enjoy handloom exclusives, bespoke drape consultations, and timeless festive silhouettes.
                </p>
              </div>

              {/* Privilege List */}
              <div className="pt-4 space-y-3.5 border-t border-white/10 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#C9A34A]/20 border border-[#C9A34A]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle size={12} className="text-[#E5C158]" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#FFF8ED]">Direct-from-Loom Purity</span>
                    <p className="text-[11px] text-[#E8DFD0]/70">Silk Mark certified weaves directly from master artisans.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#C9A34A]/20 border border-[#C9A34A]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle size={12} className="text-[#E5C158]" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#FFF8ED]">Complimentary Tailoring</span>
                    <p className="text-[11px] text-[#E8DFD0]/70">Bespoke fall-pico and blouse customization on all sarees.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#C9A34A]/20 border border-[#C9A34A]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle size={12} className="text-[#E5C158]" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#FFF8ED]">Priority Festive Previews</span>
                    <p className="text-[11px] text-[#E8DFD0]/70">Private 24-hour advance access to new festive drop collections.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom trust note */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center space-x-2 text-[11px] text-[#E8DFD0]/70">
              <ShieldCheck size={14} className="text-[#C9A34A] shrink-0" />
              <span>100% Secure & Encrypted Personal Data</span>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
            <div className="mb-6 space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#FAF3E5] border border-[#C9A34A]/40 text-[#7A520C] text-[9px] font-bold uppercase tracking-widest">
                <span>✦</span>
                <span>Member Registration</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#191714]">
                Create Your Account
              </h1>
              <p className="text-xs text-[#746D62]">
                Please provide your details below to establish your profile.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center space-x-2 animate-fadeIn">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-[#191714] font-medium mb-1.5">
                  Full Name <span className="text-[#C9A34A]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#746D62]">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maharani Gayatri Devi"
                    className="w-full pl-10 pr-3.5 py-3 border border-[#E8DFD0] rounded-xl text-[#191714] placeholder-[#A49B8D] focus:outline-none focus:border-[#003D2D] focus:ring-2 focus:ring-[#003D2D]/10 bg-[#FCFAF6] transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
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
                    placeholder="patron@rangolifashions.com"
                    className="w-full pl-10 pr-3.5 py-3 border border-[#E8DFD0] rounded-xl text-[#191714] placeholder-[#A49B8D] focus:outline-none focus:border-[#003D2D] focus:ring-2 focus:ring-[#003D2D]/10 bg-[#FCFAF6] transition-all"
                  />
                </div>
              </div>

              {/* Mobile Phone Number */}
              <div>
                <label className="block text-[#191714] font-medium mb-1.5">
                  Mobile Number <span className="text-[#746D62] text-[10px] font-normal">(For order delivery updates)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#746D62]">
                    <Phone size={15} />
                    <span className="ml-1.5 text-xs font-semibold text-[#191714] border-r border-[#E8DFD0] pr-2">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    className="w-full pl-20 pr-3.5 py-3 border border-[#E8DFD0] rounded-xl text-[#191714] placeholder-[#A49B8D] focus:outline-none focus:border-[#003D2D] focus:ring-2 focus:ring-[#003D2D]/10 bg-[#FCFAF6] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#191714] font-medium mb-1.5">
                  Password <span className="text-[#C9A34A]">*</span> <span className="text-[#746D62] text-[10px] font-normal">(Min. 6 characters)</span>
                </label>
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

              {/* Terms check */}
              <p className="text-[11px] text-[#746D62] leading-relaxed pt-1">
                By registering, you agree to Rangoli Fashions&apos;{' '}
                <Link href="/policies/terms" className="text-[#003D2D] underline font-medium hover:text-[#0B5940]">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/policies/privacy" className="text-[#003D2D] underline font-medium hover:text-[#0B5940]">
                  Privacy Policy
                </Link>.
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-[#003D2D] to-[#0A5640] hover:from-[#002B20] hover:to-[#003D2D] text-[#FFF8ED] rounded-xl font-semibold text-xs tracking-wider uppercase shadow-md transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 mt-4"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#FFF8ED] border-t-transparent rounded-full animate-spin" />
                    <span>Establishing Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-8 pt-6 border-t border-[#E8DFD0] text-center text-xs text-[#746D62]">
              <p>
                Already have a patron account?{' '}
                <Link
                  href="/account/login"
                  className="font-semibold text-[#003D2D] hover:text-[#0B5940] underline ml-1"
                >
                  Sign In Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
