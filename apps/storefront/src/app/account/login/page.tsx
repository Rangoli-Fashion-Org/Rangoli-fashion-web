'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { getSessionId } from '../../../lib/api';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { refreshCart } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login(email, password);
    if (res.success) {
      await refreshCart();
      router.push('/account');
    } else {
      setError(res.message || 'Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-white p-8 sm:p-10 rounded-2xl border border-[#E8DFD0] shadow-lg">
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#191714]">Sign In</h1>
          <p className="text-xs text-[#746D62] mt-1.5">
            Welcome back to Rangoli Fashions
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
            />
          </div>

          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-md font-semibold text-xs tracking-wider uppercase shadow-md transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#E8DFD0] text-center text-xs text-[#746D62]">
          <p>
            Don&apos;t have an account yet?{' '}
            <Link href="/account/register" className="font-semibold text-[#003D2D] hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
