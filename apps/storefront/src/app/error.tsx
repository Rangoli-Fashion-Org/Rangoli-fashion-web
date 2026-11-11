'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service safely
    console.error('[Storefront Error Boundary]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#FAF6F0] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8DFD0] shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#003D2D]/10 text-[#003D2D] flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-semibold text-[#191714]">
            Something went momentarily wrong
          </h2>
          <p className="text-xs sm:text-sm text-[#746D62] leading-relaxed">
            We encountered a temporary issue while loading this page. Our team has been notified. Please try refreshing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-5 bg-[#003D2D] hover:bg-[#0B5940] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-5 border border-[#E8DFD0] hover:bg-[#FAF6F0] text-[#191714] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Home size={14} />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

