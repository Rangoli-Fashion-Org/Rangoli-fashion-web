'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, login } = useAdminAuth();

  const [username, setUsername] = useState('rangoliadmin');
  const [password, setPassword] = useState('Rangolifashion@2026');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect immediately to dashboard without showing login form
  useEffect(() => {
    const hasLocalSession = typeof window !== 'undefined' && (localStorage.getItem('rf_admin_user') || localStorage.getItem('rf_admin_token'));
    if (user || hasLocalSession) {
      router.replace('/admin/dashboard');
    }
  }, [user, router]);

  // Don't render login form if already authenticated
  if (user || (typeof window !== 'undefined' && (localStorage.getItem('rf_admin_user') || localStorage.getItem('rf_admin_token')))) {
    return (
      <div className="min-h-screen bg-[#002D21] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A34A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login(username, password);
    if (res.success) {
      router.replace('/admin/dashboard');
    } else {
      let msg = res.message || 'Invalid admin credentials';
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('network')) {
        msg = 'Cannot connect to backend API at http://localhost:4000. Please ensure the API is running in Terminal 2 (npm run dev:api).';
      }
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#002D21] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FAF6F0] rounded-2xl shadow-2xl p-8 sm:p-10 border border-[#C9A34A]/50">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-xl bg-[#003D2D] p-2 border border-[#C9A34A] shadow-md mb-4 flex items-center justify-center">
            <Image
              src="/brand/rf-monogram.jpg"
              alt="Rangoli Fashions"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#191714]">
            Admin Console
          </h1>
          <p className="text-xs text-[#746D62] mt-1 uppercase tracking-widest font-semibold">
            Rangoli Fashions Enterprise
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#191714] font-semibold mb-1">Admin Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. rangoliadmin"
              className="w-full bg-white border border-[#E8DFD0] rounded-lg p-3 text-[#191714] focus:outline-none focus:border-[#003D2D]"
            />
          </div>

          <div>
            <label className="block text-[#191714] font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-white border border-[#E8DFD0] rounded-lg p-3 text-[#191714] focus:outline-none focus:border-[#003D2D]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#003D2D] hover:bg-[#0B5940] text-[#FFF8ED] font-semibold text-xs uppercase tracking-widest rounded-lg shadow-md transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-[#E8DFD0] text-center text-[11px] text-[#746D62]">
          Authorized Administrator Access Only
        </div>
      </div>
    </div>
  );
}
