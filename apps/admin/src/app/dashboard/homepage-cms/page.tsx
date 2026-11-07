'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ArrowUp, ArrowDown, Edit3, X, Check, ExternalLink, Sparkles } from 'lucide-react';
import { fetchAdminApi } from '@/lib/api';
import { ImageDropzone } from '@/components/ImageDropzone';

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
  const [isSaving, setIsSaving] = useState(false);

  const loadSections = async () => {
    setIsLoading(true);
    const res = await fetchAdminApi<any[]>('/homepage/admin/sections');
    if (res.success && res.data) {
      setSections(res.data);
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
    setBadgeText(sec.customData?.badgeText || 'Special Occasions');
    setDescription(sec.customData?.description || '');
    setCtaText(sec.customData?.ctaText || 'Shop Now');
    setCtaUrl(sec.customData?.ctaUrl || '/shop');
    setImageUrl(sec.customData?.imageUrl || '');
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    setIsSaving(true);
    const customData = {
      ...(editingSection.customData || {}),
      badgeText,
      description,
      ctaText,
      ctaUrl,
      imageUrl,
    };

    const res = await fetchAdminApi(`/homepage/admin/sections/${editingSection.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        subtitle: subtitle || null,
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">Homepage CMS &amp; Content Management</h1>
          <p className="text-xs text-[#746D62] mt-0.5">
            Configure headline texts, promotional banners, section visibility and storefront layout order.
          </p>
        </div>

        <Link
          href="/dashboard/banners"
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
        <form onSubmit={handleSaveSection} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#C9A34A]/50 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#E8DFD0] pb-3">
            <div>
              <h3 className="font-serif text-base font-semibold text-[#191714]">
                Edit Content: {editingSection.title}
              </h3>
              <p className="text-[11px] text-[#746D62] font-mono">Section Key: {editingSection.sectionKey}</p>
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
              <label className="block text-[#191714] font-medium mb-1">Section Headline Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-[#E8DFD0] rounded-lg p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
            <div>
              <label className="block text-[#191714] font-medium mb-1">Badge Tag / Subtitle</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. Special Occasions"
                className="w-full border border-[#E8DFD0] rounded-lg p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#191714] font-medium mb-1">Promotional Description Text</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Elegant looks crafted with intricate embroidery and rich fabrics for your special moments."
              className="w-full border border-[#E8DFD0] rounded-lg p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#191714] font-medium mb-1">Button Call to Action (CTA)</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Shop Now"
                className="w-full border border-[#E8DFD0] rounded-lg p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
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
          </div>

          {/* Drag & Drop Visual for the section */}
          <div className="pt-2">
            <ImageDropzone
              label="Section Fashion Image (Drag & Drop)"
              helperText="Drag & drop promotional section image here (JPG, PNG, WEBP)"
              value={imageUrl}
              onChange={setImageUrl}
              folder="cms/festive"
              aspectRatio="aspect-[16/10]"
            />
          </div>

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
          <div className="p-12 text-center text-xs text-[#746D62]">Loading layout...</div>
        ) : (
          <div className="divide-y divide-[#E8DFD0]/60">
            {sections.map((sec, idx) => (
              <div key={sec.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF6F0]/40 transition-colors">
                <div className="flex items-center space-x-3.5">
                  <span className="w-7 h-7 rounded-full bg-[#003D2D]/10 text-[#003D2D] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-serif font-semibold text-sm text-[#191714]">{sec.title}</h3>
                      {sec.sectionKey === 'hero_banner' && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                          Hero Carousel
                        </span>
                      )}
                      {sec.sectionKey === 'festive_edit' && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                          Promotional Banner
                        </span>
                      )}
                    </div>
                    <p className="text-[#746D62] font-mono text-[11px] mt-0.5">Key: {sec.sectionKey}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 self-end sm:self-auto">
                  {/* Edit Content Button */}
                  {sec.sectionKey === 'hero_banner' ? (
                    <Link
                      href="/dashboard/banners"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
