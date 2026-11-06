'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Plus, Trash2, Save } from 'lucide-react';
import { fetchAdminApi } from '../../../lib/api';

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const loadLinks = async () => {
    const res = await fetchAdminApi<any[]>('/settings/admin/social-links');
    if (res.success && res.data) {
      setLinks(res.data);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) return;

    await fetchAdminApi('/settings/admin/social-links', {
      method: 'POST',
      body: JSON.stringify({
        platform: platform.trim(),
        url: url.trim(),
        displayOrder: links.length + 1,
      }),
    });

    setPlatform('');
    setUrl('');
    setIsAdding(false);
    loadLinks();
  };

  const handleDelete = async (id: string) => {
    await fetchAdminApi(`/settings/admin/social-links/${id}`, { method: 'DELETE' });
    loadLinks();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">Social Links Management</h1>
          <p className="text-xs text-[#746D62] mt-0.5">Control Instagram, Facebook, WhatsApp and YouTube channels</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#003D2D] text-[#FFF8ED] rounded-lg text-xs font-semibold uppercase tracking-wider"
        >
          <Plus size={15} />
          <span>{isAdding ? 'Cancel' : 'Add Channel'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-5 rounded-xl border border-[#E8DFD0] shadow-xs space-y-3 text-xs">
          <h3 className="font-serif font-semibold text-sm">Add Social Media Channel</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Platform Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Instagram, Pinterest"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Profile URL</label>
              <input
                type="url"
                required
                placeholder="https://instagram.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
          <button type="submit" className="px-5 py-2 bg-[#003D2D] text-white rounded font-semibold">
            Save Channel
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
            <tr>
              <th className="p-3">Platform</th>
              <th className="p-3">URL</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFD0]/60">
            {links.map((l) => (
              <tr key={l.id} className="hover:bg-[#FFF8ED]">
                <td className="p-3 font-semibold text-[#191714]">{l.platform}</td>
                <td className="p-3 text-[#746D62] font-mono">{l.url}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
