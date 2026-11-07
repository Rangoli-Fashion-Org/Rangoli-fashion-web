'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Save, Upload } from 'lucide-react';
import { fetchAdminApi } from '@/lib/api';
import { ImageDropzone } from '@/components/ImageDropzone';

export default function AdminAboutUsPage() {
  const [heading, setHeading] = useState('Crafting Timeless Indian Elegance');
  const [brandStory, setBrandStory] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchAdminApi<any>('/settings/about-content').then((res) => {
      if (res.success && res.data) {
        setHeading(res.data.heading || '');
        setBrandStory(res.data.brandStory || '');
        setMission(res.data.mission || '');
        setVision(res.data.vision || '');
        setImageUrl(res.data.imageUrl || '');
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');

    const res = await fetchAdminApi('/settings/admin/about-content', {
      method: 'PUT',
      body: JSON.stringify({
        heading,
        brandStory,
        mission,
        vision,
        imageUrl: imageUrl || null,
      }),
    });

    if (res.success) {
      setStatusMsg('About Us content saved successfully in PostgreSQL');
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#191714]">About Us Brand Story</h1>
        <p className="text-xs text-[#746D62] mt-0.5">Control the brand heritage, mission, vision and imagery on the storefront</p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-medium">
          {statusMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4 text-xs">
        <div>
          <label className="block text-[#746D62] mb-1 font-medium">Main Heading</label>
          <input
            type="text"
            required
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full border border-[#E8DFD0] rounded-md p-2.5 font-serif text-sm font-semibold text-[#191714]"
          />
        </div>

        <div>
          <label className="block text-[#746D62] mb-1 font-medium">Brand Story / Narrative</label>
          <textarea
            rows={5}
            required
            value={brandStory}
            onChange={(e) => setBrandStory(e.target.value)}
            className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Mission Statement</label>
            <textarea
              rows={3}
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Vision Statement</label>
            <textarea
              rows={3}
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>
        </div>

        <div>
          <ImageDropzone
            label="Story Banner Image"
            helperText="Drag & drop brand editorial story image here (JPG, PNG, WEBP)"
            value={imageUrl}
            onChange={setImageUrl}
            folder="about"
            aspectRatio="aspect-[16/9]"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-8 py-3 bg-[#003D2D] hover:bg-[#0B5940] text-[#FFF8ED] rounded-lg font-semibold uppercase tracking-wider shadow-sm disabled:opacity-50"
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

