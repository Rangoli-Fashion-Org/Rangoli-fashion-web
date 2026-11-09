'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ArrowUp, ArrowDown, Edit3, X, ExternalLink, Sparkles, FolderTree } from 'lucide-react';
import { fetchAdminApi } from '@/lib/admin-api';
import { ImageDropzone } from '@/components/admin/ImageDropzone';

interface PillarItem {
  title: string;
  subtitle: string;
}

const DEFAULT_WHY_CHOOSE_PILLARS: PillarItem[] = [
  { title: 'Premium Fabrics', subtitle: 'Breathable, comfortable and long-lasting.' },
  { title: 'Exclusive Designs', subtitle: 'Timeless styles with a modern touch.' },
  { title: 'Crafted with Care', subtitle: 'Attention to every detail and finish.' },
  { title: 'Trusted Quality', subtitle: 'Loved by thousands across India.' },
];

const DEFAULT_HALLMARK_CARDS: PillarItem[] = [
  { title: 'Artisanal Heritage', subtitle: 'Celebrating Indian artistry, passed down through generations.' },
  { title: 'Pure Comfort Fabrics', subtitle: 'Breathable, skin-friendly materials that blend tradition with everyday ease.' },
  { title: 'Bespoke Tailoring', subtitle: 'Thoughtfully designed silhouettes with a flattering, modern fit.' },
  { title: 'Ethical Craftsmanship', subtitle: 'Sustainably created with care for people, fabric and tradition.' },
];

const UNWANTED_SECTION_KEYS = ['announcement_bar', 'shop_by_collection', 'footer', 'newsletter_signup'];

export default function HomepageCmsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');

  // Editing modal state
  const [editingSection, setEditingSection] = useState<any | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [description, setDescription] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pillars, setPillars] = useState<PillarItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const loadSections = async () => {
    setIsLoading(true);
    const res = await fetchAdminApi<any[]>('/homepage/admin/sections');
    if (res.success && res.data) {
      const filtered = res.data.filter(
        (s: any) => !UNWANTED_SECTION_KEYS.includes(s.sectionKey)
      );
      setSections(filtered);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleOpenEdit = (sec: any) => {
    setEditingSection(sec);
    setTitle(sec.title || '');
    setSubtitle(sec.subtitle || '');

    if (sec.sectionKey === 'rangoli_prime_circle') {
      setBadgeText(sec.customData?.badgeText || 'The Rangoli Prime Circle');
      setDescription(
        sec.customData?.description ||
          'Receive private seasonal previews, hand-picked festive edits, and exclusive offers straight to your inbox.'
      );
      setCtaText(sec.customData?.ctaText || 'Join Prime');
      setCtaUrl('');
      setImageUrl(sec.customData?.imageUrl || '');
      setPillars([]);
    } else if (sec.sectionKey === 'why_choose_us') {
      setBadgeText(sec.customData?.badgeText || 'Why Choose Us');
      setDescription(sec.customData?.description || '');
      setCtaText('');
      setCtaUrl('');
      setImageUrl(sec.customData?.imageUrl || '');
      setPillars(
        Array.isArray(sec.customData?.items) && sec.customData.items.length === 4
          ? sec.customData.items
          : DEFAULT_WHY_CHOOSE_PILLARS
      );
    } else if (sec.sectionKey === 'brand_benefits') {
      setBadgeText(sec.customData?.badgeText || 'The Rangoli Hallmark');
      setDescription(
        sec.customData?.description ||
          'Finely finished, woven with patience, every stitch a part of a rich tradition.'
      );
      setCtaText('');
      setCtaUrl('');
      setImageUrl(sec.customData?.imageUrl || '');
      setPillars(
        Array.isArray(sec.customData?.items) && sec.customData.items.length === 4
          ? sec.customData.items
          : DEFAULT_HALLMARK_CARDS
      );
    } else {
      setBadgeText(sec.customData?.badgeText || sec.subtitle || '');
      setDescription(sec.customData?.description || sec.subtitle || '');
      setCtaText(sec.customData?.ctaText || 'Shop Now');
      setCtaUrl(sec.customData?.ctaUrl || '/shop');
      setImageUrl(sec.customData?.imageUrl || '');
      setPillars([]);
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    setIsSaving(true);
    const customData: Record<string, any> = {
      ...(editingSection.customData || {}),
      badgeText,
      description,
      ctaText,
      ctaUrl,
      imageUrl,
    };

    if (pillars.length > 0) {
      customData.items = pillars;
    }

    const res = await fetchAdminApi(`/homepage/admin/sections/${editingSection.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        subtitle: description || subtitle || null,
        customData,
      }),
    });

    if (res.success) {
      setSaveMsg(`"${title}" content saved successfully!`);
      setEditingSection(null);
      loadSections();
      setTimeout(() => setSaveMsg(''), 3000);
    }
    setIsSaving(false);
  };

  const handleToggleVisibility = async (id: string, current: boolean) => {
    const res = await fetchAdminApi(`/homepage/admin/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isVisible: !current }),
    });
    if (res.success) {
      setSections(sections.map((s) => (s.id === id ? { ...s, isVisible: !current } : s)));
      setSaveMsg('Section visibility updated');
      setTimeout(() => setSaveMsg(''), 2500);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentSection = sections[index];
    const targetSection = sections[targetIndex];

    await Promise.all([
      fetchAdminApi(`/homepage/admin/sections/${currentSection.id}`, {
        method: 'PUT',
        body: JSON.stringify({ displayOrder: targetSection.displayOrder }),
      }),
      fetchAdminApi(`/homepage/admin/sections/${targetSection.id}`, {
        method: 'PUT',
        body: JSON.stringify({ displayOrder: currentSection.displayOrder }),
      }),
    ]);

    loadSections();
  };

  const getSectionBadge = (sectionKey: string) => {
    switch (sectionKey) {
      case 'hero_banner':
        return { label: 'Hero Carousel', className: 'bg-blue-100 text-blue-800' };
      case 'shop_by_category':
        return { label: 'Category Grid', className: 'bg-purple-100 text-purple-800' };
      case 'festive_edit':
        return { label: 'Promotional Banner', className: 'bg-amber-100 text-amber-800' };
      case 'why_choose_us':
        return { label: 'Why Choose Us', className: 'bg-emerald-100 text-emerald-800' };
      case 'brand_benefits':
        return { label: 'The Rangoli Hallmark', className: 'bg-teal-100 text-teal-800' };
      case 'rangoli_prime_circle':
        return { label: 'Prime Circle Newsletter', className: 'bg-yellow-100 text-yellow-800' };
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">
            Homepage CMS &amp; Content Management
          </h1>
          <p className="text-xs text-[#746D62] mt-0.5">
            Configure headline texts, Why Choose Us pillars, The Rangoli Prime Circle, promotional banners, and visibility.
          </p>
        </div>

        <Link
          href="/admin/dashboard/banners"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#FAF6F0] border border-[#003D2D] text-[#003D2D] hover:bg-[#003D2D] hover:text-[#FFF8ED] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Sparkles size={14} />
          <span>Manage Hero Banners</span>
          <ExternalLink size={12} />
        </Link>
      </div>

      {saveMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
          {saveMsg}
        </div>
      )}

      {/* Content Editor Modal / Card */}
      {editingSection && (
        <form
          onSubmit={handleSaveSection}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-[#C9A34A]/50 shadow-md space-y-4 text-xs"
        >
          <div className="flex items-center justify-between border-b border-[#E8DFD0] pb-3">
            <div>
              <h3 className="font-serif text-base font-semibold text-[#191714]">
                Edit Content: {editingSection.title}
              </h3>
              <p className="text-[11px] text-[#746D62] font-mono">
                Section Key: {editingSection.sectionKey}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditingSection(null)}
              className="p-1 text-[#746D62] hover:text-[#191714] rounded-lg"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#191714] font-medium mb-1">
                Section Headline Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-[#E8DFD0] rounded-lg p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
            <div>
              <label className="block text-[#191714] font-medium mb-1">Badge Tag / Eyebrow</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. THE RANGOLI PRIME CIRCLE"
                className="w-full border border-[#E8DFD0] rounded-lg p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#191714] font-medium mb-1">
              Subtitle / Description Text
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Section description or subtitle..."
              className="w-full border border-[#E8DFD0] rounded-lg p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
            />
          </div>

          {/* 4 Pillars Editor for Why Choose Us & Hallmark */}
          {pillars.length > 0 && (
            <div className="space-y-3 pt-2">
              <label className="block text-[#191714] font-semibold">
                {editingSection.sectionKey === 'why_choose_us'
                  ? 'Why Choose Us — 4 Feature Pillars'
                  : 'The Rangoli Hallmark — 4 Cards'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pillars.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E8DFD0] space-y-2"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#003D2D]">
                      Card {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...pillars];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setPillars(updated);
                      }}
                      placeholder="Card Title"
                      className="w-full border border-[#E8DFD0] bg-white rounded-md p-2 text-[#191714] font-medium"
                    />
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => {
                        const updated = [...pillars];
                        updated[idx] = { ...updated[idx], subtitle: e.target.value };
                        setPillars(updated);
                      }}
                      placeholder="Card Description"
                      className="w-full border border-[#E8DFD0] bg-white rounded-md p-2 text-[#746D62]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Fields for Sections with Buttons */}
          {['festive_edit', 'new_arrivals', 'rangoli_prime_circle'].includes(
            editingSection.sectionKey
          ) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#191714] font-medium mb-1">
                  Button Call to Action (CTA)
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Join Prime / Explore the Edit"
                  className="w-full border border-[#E8DFD0] rounded-lg p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                />
              </div>
              {editingSection.sectionKey !== 'rangoli_prime_circle' && (
                <div>
                  <label className="block text-[#191714] font-medium mb-1">Button Link URL</label>
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="/shop"
                    className="w-full border border-[#E8DFD0] rounded-lg p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Background Image Uploader for Festive Edit, Why Choose Us, & The Rangoli Prime Circle */}
          {['festive_edit', 'why_choose_us', 'rangoli_prime_circle'].includes(
            editingSection.sectionKey
          ) && (
            <div className="pt-2">
              <ImageDropzone
                label={`${editingSection.title} — Background Image (Drag & Drop)`}
                helperText="Upload or drag & drop a background image for this section card (JPG, PNG, WEBP). Leave empty to use the default luxury emerald background."
                value={imageUrl}
                onChange={setImageUrl}
                folder={`cms/${editingSection.sectionKey}`}
                aspectRatio="aspect-[16/9]"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-3 border-t border-[#E8DFD0]">
            <button
              type="button"
              onClick={() => setEditingSection(null)}
              className="px-4 py-2 border border-[#E8DFD0] rounded-lg font-semibold uppercase tracking-wider text-[#746D62] hover:bg-[#FAF6F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-[#003D2D] hover:bg-[#0B5940] text-[#FFF8ED] rounded-lg font-semibold uppercase tracking-wider shadow-md disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Section Content'}
            </button>
          </div>
        </form>
      )}

      {/* Sections Table & Reorder Interface */}
      <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#746D62]">Loading homepage sections...</div>
        ) : (
          <div className="divide-y divide-[#E8DFD0]/60">
            {sections.map((sec, idx) => {
              const badge = getSectionBadge(sec.sectionKey);
              return (
                <div
                  key={sec.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF6F0]/40 transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="w-7 h-7 rounded-full bg-[#003D2D]/10 text-[#003D2D] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="font-serif font-semibold text-sm text-[#191714]">
                          {sec.title}
                        </h3>
                        {badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        )}
                      </div>
                      {sec.subtitle && (
                        <p className="text-[#746D62] text-xs mt-0.5 line-clamp-1">{sec.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 self-end sm:self-auto">
                    {/* Shortcut for Category Management */}
                    {sec.sectionKey === 'shop_by_category' && (
                      <Link
                        href="/admin/dashboard/categories"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#FAF6F0] text-[#003D2D] hover:bg-[#003D2D] hover:text-white rounded-lg text-xs font-semibold transition-colors border border-[#003D2D]/30"
                      >
                        <FolderTree size={13} />
                        <span>Categories</span>
                      </Link>
                    )}

                    {/* Edit Content Button */}
                    {sec.sectionKey === 'hero_banner' ? (
                      <Link
                        href="/admin/dashboard/banners"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#FAF6F0] text-[#003D2D] hover:bg-[#003D2D] hover:text-white rounded-lg text-xs font-semibold transition-colors border border-[#003D2D]/30"
                      >
                        <Sparkles size={13} />
                        <span>Edit Banners</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleOpenEdit(sec)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#FAF6F0] text-[#003D2D] hover:bg-[#003D2D] hover:text-white rounded-lg text-xs font-semibold transition-colors border border-[#003D2D]/30"
                      >
                        <Edit3 size={13} />
                        <span>Edit Content</span>
                      </button>
                    )}

                    {/* Order controls */}
                    <div className="flex items-center space-x-0.5 bg-[#FAF6F0] rounded-lg p-0.5 border border-[#E8DFD0]">
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMoveOrder(idx, 'up')}
                        className="p-1 text-[#746D62] hover:text-[#003D2D] disabled:opacity-20 rounded"
                        title="Move Up"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        disabled={idx === sections.length - 1}
                        onClick={() => handleMoveOrder(idx, 'down')}
                        className="p-1 text-[#746D62] hover:text-[#003D2D] disabled:opacity-20 rounded"
                        title="Move Down"
                      >
                        <ArrowDown size={15} />
                      </button>
                    </div>

                    {/* Visibility Toggle */}
                    <button
                      onClick={() => handleToggleVisibility(sec.id, sec.isVisible)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        sec.isVisible
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                      }`}
                    >
                      {sec.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{sec.isVisible ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
