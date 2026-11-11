import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#FAF6F0] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8DFD0] shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#C9A34A]/15 text-[#003D2D] flex items-center justify-center mx-auto">
          <Compass size={32} className="text-[#C9A34A]" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A34A]">
            Page Not Found • 404
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#191714]">
            Lost in the Drape
          </h1>
          <p className="text-xs sm:text-sm text-[#746D62] leading-relaxed">
            The page or creation you are searching for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#003D2D] hover:bg-[#0B5940] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
          >
            <span>Return to Storefront</span>
            <ArrowRight size={14} className="text-[#E5C158]" />
          </Link>
        </div>
      </div>
    </div>
  );
}

