'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { fetchAdminApi } from '@/lib/admin-api';
import { ImageDropzone } from '@/components/admin/ImageDropzone';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [desktopImageUrl, setDesktopImageUrl] = useState('');
  const [mobileImageUrl, setMobileImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('Shop the Collection');
  const [ctaUrl, setCtaUrl] = useState('/shop');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const loadBanners = async () => {
    setIsLoading(true);
    const res = await fetchAdminApi<any[]>('/banners/admin/list');
    if (res.success && res.data) {
      setBanners(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setDesktopImageUrl('');
    setMobileImageUrl('');
    setCtaText('Shop the Collection');
    setCtaUrl('/shop');
    setDisplayOrder(banners.length + 1);
    setIsActive(true);
    setIsEditing(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingId(b.id);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setDesktopImageUrl(b.desktopImageUrl);
    setMobileImageUrl(b.mobileImageUrl || '');
    setCtaText(b.ctaText);
    setCtaUrl(b.ctaUrl);
    setDisplayOrder(b.displayOrder);
    setIsActive(b.isActive);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desktopImageUrl) {
      alert('Please provide a banner title and upload a desktop image.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title,
      subtitle: subtitle || null,
      desktopImageUrl,
      mobileImageUrl: mobileImageUrl || null,
      ctaText: ctaText || 'Shop the Collection',
      ctaUrl: ctaUrl || '/shop',
      displayOrder: Number(displayOrder) || 1,
      isActive,
    };

    if (editingId) {
      await fetchAdminApi(`/banners/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setStatusMsg('Banner updated successfully!');
    } else {
      await fetchAdminApi('/banners', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setStatusMsg('Banner created successfully!');
    }

    setIsSubmitting(false);
    setIsEditing(false);
    loadBanners();
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleToggleActive = async (banner: any) => {
    const updated = !banner.isActive;
    await fetchAdminApi(`/banners/${banner.id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: updated }),
    });
    setBanners(banners.map((b) => (b.id === banner.id ? { ...b, isActive: updated } : b)));
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      await fetchAdminApi(`/banners/${id}`, { method: 'DELETE' });
      loadBanners();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">Hero Banner &amp; Editorial Sliders</h1>
          <p className="text-xs text-[#746D62] mt-0.5">
            Manage the large fashion hero carousel displayed at the top of the storefront homepage.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-xl text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Hero Banner</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
          {statusMsg}
        </div>
      )}

      {/* Slide-in or Expandable Editor Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#C9A34A]/50 shadow-md space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-[#E8DFD0] pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-[#003D2D] w-4 h-4" />
              <h3 className="font-serif text-base font-semibold text-[#191714]">
                {editingId ? 'Edit Hero Banner' : 'Create New Hero Banner'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 text-[#746D62] hover:text-[#191714] rounded-lg"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[#191714] font-medium mb-1">Headline Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Style for Every Occasion"
                className="w-full border border-[#E8DFD0] rounded-lg p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
            <div>
              <label className="block text-[#191714] font-medium mb-1">Display Order</label>
              <input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full border border-[#E8DFD0] rounded-lg p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#191714] font-medium mb-1">Subtitle / Editorial Copy</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Discover elegant and comfortable styles for everyday and special moments."
              className="w-full border border-[#E8DFD0] rounded-lg p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#191714] font-medium mb-1">Call-to-Action (CTA) Button Text</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Shop the Collection"
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

          {/* Drag & Drop Uploaders for Desktop & Mobile Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <ImageDropzone
                label="Desktop Fashion Banner Image *"
                helperText="Drag & drop high-res image (1920x1080 recommended, max 10MB)"
                value={desktopImageUrl}
                onChange={setDesktopImageUrl}
                folder="banners"
                aspectRatio="aspect-[16/9]"
              />
            </div>
            <div>
              <ImageDropzone
                label="Mobile Fashion Banner Image (Optional)"
                helperText="Drag & drop mobile-optimized banner (1080x1350 or square)"
                value={mobileImageUrl}
                onChange={setMobileImageUrl}
                folder="banners/mobile"
                aspectRatio="aspect-[4/5]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 cursor-pointer font-medium text-[#191714]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-[#003D2D]"
              />
              <span>Banner is Active (Visible on Storefront Homepage)</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-[#E8DFD0]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 border border-[#E8DFD0] rounded-lg font-semibold uppercase tracking-wider text-[#746D62] hover:bg-[#FAF6F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#003D2D] hover:bg-[#0B5940] text-[#FFF8ED] rounded-lg font-semibold uppercase tracking-wider shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingId ? 'Update Banner' : 'Publish Banner'}
            </button>
          </div>
        </form>
      )}

      {/* Banner Cards List */}
      <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#746D62]">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-[#191714]">No Hero Banners configured</p>
            <p className="text-xs text-[#746D62]">Click "Add Hero Banner" above to create your first fashion hero slide.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8DFD0]/60">
            {banners.map((b) => (
              <div key={b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF6F0]/40 transition-colors">
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="relative w-28 sm:w-36 aspect-[16/9] rounded-lg overflow-hidden border border-[#E8DFD0] bg-[#FAF6F0] flex-shrink-0 shadow-2xs">
                    <Image
                      src={b.desktopImageUrl}
                      alt={b.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 120px, 150px"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-[#003D2D]/10 text-[#003D2D] text-[10px] font-bold flex items-center justify-center">
                        {b.displayOrder}
                      </span>
                      <h3 className="font-serif font-semibold text-sm text-[#191714]">{b.title}</h3>
                      <button
                        onClick={() => handleToggleActive(b)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                          b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {b.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
                        <span>{b.isActive ? 'LIVE' : 'DRAFT'}</span>
                      </button>
                    </div>

                    {b.subtitle && (
                      <p className="text-xs text-[#746D62] line-clamp-1 max-w-lg">{b.subtitle}</p>
                    )}

                    <div className="inline-flex items-center space-x-1 text-[11px] text-[#003D2D] font-medium pt-0.5">
                      <span>CTA: {b.ctaText}</span>
                      <span>({b.ctaUrl})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-2 bg-white border border-[#E8DFD0] hover:border-[#003D2D] text-[#746D62] hover:text-[#003D2D] rounded-lg shadow-2xs transition-colors"
                    title="Edit Banner"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg shadow-2xs transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 size={14} />
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
