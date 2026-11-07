'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Upload, Eye } from 'lucide-react';
import { fetchAdminApi, uploadMedia } from '@/lib/admin-api';

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
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

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
    setDisplayOrder(banners.length);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMobile = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const res = await uploadMedia(file, 'banners');
    if (res) {
      if (isMobile) setMobileImageUrl(res.url);
      else setDesktopImageUrl(res.url);
    }
    setIsUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desktopImageUrl) return;

    if (editingId) {
      await fetchAdminApi(`/banners/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          subtitle,
          desktopImageUrl,
          mobileImageUrl: mobileImageUrl || null,
          ctaText,
          ctaUrl,
          displayOrder: Number(displayOrder),
          isActive,
        }),
      });
    } else {
      await fetchAdminApi('/banners', {
        method: 'POST',
        body: JSON.stringify({
          title,
          subtitle,
          desktopImageUrl,
          mobileImageUrl: mobileImageUrl || null,
          ctaText,
          ctaUrl,
          displayOrder: Number(displayOrder),
          isActive,
        }),
      });
    }

    setIsEditing(false);
    loadBanners();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this banner?')) {
      await fetchAdminApi(`/banners/${id}`, { method: 'DELETE' });
      loadBanners();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">Hero Banner Carousel</h1>
          <p className="text-xs text-[#746D62] mt-0.5">Manage large editorial fashion banners and promotional sliders</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>Add Banner</span>
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-md space-y-4 text-xs">
          <h3 className="font-serif text-base font-semibold text-[#191714]">
            {editingId ? 'Edit Banner' : 'Create Hero Banner'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Headline Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Style for Every Occasion"
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Subtitle / Editorial Copy</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Discover elegant and comfortable styles for everyday and special moments."
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">CTA Button Text</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Shop the Collection"
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">CTA Destination URL</label>
              <input
                type="text"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="/shop"
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Desktop Fashion Image *</label>
              <div className="flex items-center space-x-3">
                {desktopImageUrl && (
                  <div className="relative w-24 h-16 rounded border overflow-hidden">
                    <Image src={desktopImageUrl} alt="Desktop" fill className="object-cover" />
                  </div>
                )}
                <label className="px-3 py-2 border border-[#C9A34A] rounded-md cursor-pointer hover:bg-[#FFF8ED] text-[#003D2D] font-semibold">
                  {isUploading ? 'Uploading...' : 'Upload Desktop'}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Mobile Fashion Image (Optional)</label>
              <div className="flex items-center space-x-3">
                {mobileImageUrl && (
                  <div className="relative w-16 h-16 rounded border overflow-hidden">
                    <Image src={mobileImageUrl} alt="Mobile" fill className="object-cover" />
                  </div>
                )}
                <label className="px-3 py-2 border border-[#C9A34A] rounded-md cursor-pointer hover:bg-[#FFF8ED] text-[#003D2D] font-semibold">
                  {isUploading ? 'Uploading...' : 'Upload Mobile'}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                </label>
              </div>
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
              <span>Banner Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-[#E8DFD0] rounded-md text-[#746D62]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#003D2D] text-white rounded-md font-semibold"
            >
              Save Banner
            </button>
          </div>
        </form>
      )}

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/9] w-full bg-[#FAF6F0]">
              <Image src={b.desktopImageUrl} alt={b.title} fill className="object-cover" />
              <div className="absolute top-2 right-2 flex space-x-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-xs ${
                  b.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                }`}>
                  {b.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-2 text-xs">
              <h3 className="font-serif text-base font-semibold text-[#191714]">{b.title}</h3>
              {b.subtitle && <p className="text-[#746D62] line-clamp-1">{b.subtitle}</p>}
              <div className="flex justify-between items-center pt-2 border-t border-[#E8DFD0]/60">
                <span className="text-[#003D2D] font-semibold">{b.ctaText} &rarr; {b.ctaUrl}</span>
                <div className="space-x-1">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1 text-[#003D2D] hover:bg-[#FAF6F0] rounded"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

