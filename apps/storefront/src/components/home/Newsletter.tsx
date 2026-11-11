'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Crown, Mail, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { getOptimizedImageUrl } from '../../lib/image';

const DEFAULT_NEWSLETTER_IMAGE =
  'https://res.cloudinary.com/ijivdhjz/image/upload/v1794219095/cms/rangoli_prime_circle/l1k34dvad8t0bfnct1yv.png';

export const Newsletter: React.FC = () => {
  const [sectionData, setSectionData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchApi<any[]>('/homepage/sections').then((res) => {
      if (res.success && res.data) {
        const primeSec = res.data.find(
          (s: any) =>
            s.sectionKey === 'rangoli_prime_circle' || s.sectionKey === 'newsletter_signup'
        );
        if (primeSec) {
          setIsVisible(primeSec.isVisible);
          setSectionData(primeSec);
        }
      }
    });
  }, []);

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
      setMessage(
        res.message || 'Thank you for subscribing! Check your inbox for your exclusive offers.'
      );
      setEmail('');
    } else {
      setStatus('error');
      setMessage(res.message || 'Something went wrong. Please try again.');
    }
  };

  if (!isVisible) {
    return null;
  }

  const badgeText =
    sectionData?.customData?.badgeText || 'The Rangoli Prime Circle';
  const headline =
    sectionData?.customData?.headline ||
    (sectionData?.title && sectionData.title !== 'The Rangoli Prime Circle'
      ? sectionData.title
      : 'Curated Elegance,\nDelivered to Your Inbox');
  const description =
    sectionData?.customData?.description ||
    'Receive private seasonal previews, hand-picked festive edits, and exclusive offers straight to your inbox.';
  // "Join Prime" CTA removed — always use a neutral "Subscribe" label,
  // even if an older CMS record still stores "Join Prime".
  const storedCta = (sectionData?.customData?.ctaText || '').trim();
  const ctaText = storedCta && !/join\s*prime/i.test(storedCta) ? storedCta : 'Subscribe';
  const imageUrl = sectionData?.customData?.imageUrl || DEFAULT_NEWSLETTER_IMAGE;

  return (
    <section className="bg-gradient-to-b from-[#F7EDE0] to-[#F0E3D1] pt-4 pb-8 sm:pt-6 sm:pb-14">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[240px] sm:min-h-[320px] md:min-h-[370px] lg:min-h-[410px] flex flex-col sm:flex-row sm:items-center sm:justify-center bg-gradient-to-r from-[#002219] via-[#003224] to-[#002219] text-[#FFF8ED] shadow-xl border border-[#C9A34A]/50 text-center">
          {/* Mobile Dedicated Visual Top Banner - Guarantees CTA Artwork is 100% visible on Mobile */}
          <div className="relative w-full h-44 xs:h-52 sm:hidden overflow-hidden bg-[#00251B]">
            <Image
              src={getOptimizedImageUrl(imageUrl, { width: 800, quality: 'auto:good' })}
              alt={headline}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#002219] via-[#002219]/75 to-transparent pointer-events-none" />
          </div>

          {/* Desktop/Tablet Full-Card Background Cover */}
          <div className="hidden sm:block absolute inset-0">
            <Image
              src={getOptimizedImageUrl(imageUrl, { width: 1400, quality: 'auto:good' })}
              alt={headline}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
            />
            {/* Very light center vignette only so background artwork remains bright and fully visible */}
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-xl mx-auto px-4 pb-8 pt-3 sm:px-12 md:px-16 sm:py-12 md:pl-16 lg:pl-20 space-y-2.5 sm:space-y-4">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-3.5 py-1 rounded-full bg-black/25 backdrop-blur-xs border border-[#C9A34A]/50 text-[#E5C158] text-[9px] sm:text-xs font-semibold uppercase tracking-widest">
              <Crown size={12} className="text-[#E5C158] shrink-0" />
              <span>{badgeText}</span>
            </div>

            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-[42px] text-white font-normal tracking-tight leading-[1.2] drop-shadow-md whitespace-pre-line">
              {headline}
            </h2>

            <p className="text-[11px] sm:text-sm text-white/90 leading-relaxed font-light max-w-md mx-auto drop-shadow-xs">
              {description}
            </p>

            {status === 'success' ? (
              <div className="mt-5 p-3.5 rounded-xl bg-black/40 backdrop-blur-md border border-[#C9A34A]/60 flex items-center justify-center space-x-2 text-xs sm:text-sm text-[#FFF8ED] font-medium">
                <CheckCircle2 size={16} className="text-[#E5C158]" />
                <span>{message}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-5 flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto pt-1"
              >
                <div className="relative w-full sm:flex-1">
                  <Mail
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#746D62]"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-[#FFF8ED] text-[#191714] text-xs sm:text-sm placeholder-[#746D62] focus:outline-none focus:ring-2 focus:ring-[#C9A34A] shadow-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#DFC37A] via-[#E5C158] to-[#C9A34A] hover:from-[#FFF2BD] hover:to-[#DFC37A] text-[#00251B] font-semibold text-xs tracking-wide transition-all duration-200 shadow-lg disabled:opacity-60 flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <span>{status === 'loading' ? 'Subscribing...' : ctaText}</span>
                  <ArrowRight size={13} />
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="text-xs text-red-300 font-medium pt-1">{message}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
