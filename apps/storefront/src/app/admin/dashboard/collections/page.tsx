'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { fetchAdminApi } from '@/lib/admin-api';
import { ImageDropzone } from '@/components/admin/ImageDropzone';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  const loadCollections = async () => {
    setIsLoading(true);
    const res = await fetchAdminApi<any[]>('/collections/admin/list');
    if (res.success && res.data) {
      setCollections(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder(collections.length);
    setIsEditing(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingId(c.id);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
    setImageUrl(c.imageUrl || '');
    setDisplayOrder(c.displayOrder);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      await fetchAdminApi(`/collections/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify({ name, slug, description, imageUrl, displayOrder: Number(displayOrder) }),
      });
    } else {
      await fetchAdminApi('/collections', {
        method: 'POST',
        body: JSON.stringify({ name, slug, description, imageUrl, displayOrder: Number(displayOrder) }),
      });
    }

    setIsEditing(false);
    loadCollections();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this collection?')) {
      await fetchAdminApi(`/collections/${id}`, { method: 'DELETE' });
      loadCollections();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">Collections Management</h1>
          <p className="text-xs text-[#746D62] mt-0.5">Control the &quot;Shop by Collection&quot; cards on the storefront homepage</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>Add Collection</span>
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-md space-y-4 text-xs">
          <h3 className="font-serif text-base font-semibold text-[#191714]">
            {editingId ? 'Edit Collection' : 'Create Collection'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Collection Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Kurti Set"
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">URL Slug (Optional)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. premium-kurti-set"
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
            <ImageDropzone
              label="Collection Card Image"
              helperText="Drag & drop collection fashion cover image here (JPG, PNG, WEBP)"
              value={imageUrl}
              onChange={setImageUrl}
              folder="collections"
              aspectRatio="aspect-[3/4]"
            />
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
              Save Collection
            </button>
          </div>
        </form>
      )}

      {/* Collections Table */}
      <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#746D62]">Loading collections...</div>
        ) : collections.length > 0 ? (
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Products</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD0]/60">
              {collections.map((c) => (
                <tr key={c.id} className="hover:bg-[#FFF8ED]">
                  <td className="p-3 font-semibold text-[#746D62]">{c.displayOrder}</td>
                  <td className="p-3">
                    <div className="relative w-10 h-12 rounded bg-[#FAF6F0] border overflow-hidden">
                      <Image src={c.imageUrl || '/brand/rf-monogram.jpg'} alt={c.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-[#191714]">{c.name}</td>
                  <td className="p-3 font-mono text-[#746D62]">/{c.slug}</td>
                  <td className="p-3 text-[#746D62]">{c._count?.products || 0} styles</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-1 text-[#003D2D] hover:bg-[#FAF6F0] rounded"
                      title="Edit Collection"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete Collection"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-xs text-[#746D62]">
            <p className="font-serif text-base font-semibold text-[#191714]">No Collections Yet</p>
            <p className="mt-1">Create collections to display on the storefront &quot;Shop by Collection&quot; section.</p>
          </div>
        )}
      </div>
    </div>
  );
}

