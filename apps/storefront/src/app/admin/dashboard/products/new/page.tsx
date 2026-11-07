'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Trash2, Plus, Check } from 'lucide-react';
import { fetchAdminApi, uploadMedia } from '@/lib/admin-api';

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [regularPrice, setRegularPrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [material, setMaterial] = useState('100% Pure Premium Cotton');
  const [careInstructions, setCareInstructions] = useState('Dry clean recommended for first wash. Gentle hand wash in cold water.');
  const [categoryId, setCategoryId] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Images
  const [images, setImages] = useState<Array<{ url: string; publicId: string; isPrimary: boolean }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Variants (Size, Color, Stock, SKU)
  const [variants, setVariants] = useState<Array<{
    sku: string;
    size: string;
    color: string;
    stockQuantity: number;
    priceOverride?: number;
  }>>([
    { sku: '', size: 'S', color: 'Emerald Green', stockQuantity: 10 },
    { sku: '', size: 'M', color: 'Emerald Green', stockQuantity: 15 },
    { sku: '', size: 'L', color: 'Emerald Green', stockQuantity: 15 },
    { sku: '', size: 'XL', color: 'Emerald Green', stockQuantity: 10 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminApi<any[]>('/categories/admin/list').then((res) => {
      if (res.success && res.data) setCategories(res.data);
    });
    fetchAdminApi<any[]>('/collections/admin/list').then((res) => {
      if (res.success && res.data) setCollections(res.data);
    });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      const uploaded = await uploadMedia(files[i]);
      if (uploaded) {
        setImages((prev) => [
          ...prev,
          {
            url: uploaded.url,
            publicId: uploaded.publicId,
            isPrimary: prev.length === 0,
          },
        ]);
      }
    }
    setIsUploading(false);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { sku: '', size: 'XXL', color: variants[0]?.color || 'Emerald Green', stockQuantity: 10 },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !sku.trim() || !description.trim() || !regularPrice) {
      setError('Please fill in required fields: Name, SKU, Description, and Regular Price');
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one product image');
      return;
    }

    setIsSubmitting(true);

    // Auto-generate variant SKUs if left blank
    const processedVariants = variants.map((v, i) => ({
      ...v,
      sku: v.sku.trim() || `${sku.trim()}-${v.size}-${v.color.slice(0, 3).toUpperCase()}-${i + 1}`,
      stockQuantity: Number(v.stockQuantity) || 0,
    }));

    const res = await fetchAdminApi('/products', {
      method: 'POST',
      body: JSON.stringify({
        name,
        sku,
        description,
        shortDescription,
        regularPrice: Number(regularPrice),
        salePrice: salePrice ? Number(salePrice) : null,
        material,
        careInstructions,
        categoryId: categoryId || null,
        collectionId: collectionId || null,
        isNewArrival,
        isFeatured,
        isActive,
        images: images.map((img, idx) => ({
          url: img.url,
          publicId: img.publicId,
          displayOrder: idx,
          isPrimary: idx === 0,
        })),
        variants: processedVariants,
      }),
    });

    if (res.success) {
      router.push('/admin/dashboard/products');
    } else {
      setError(res.message || 'Failed to create product');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-3">
        <Link href="/admin/dashboard/products" className="p-2 bg-white rounded-lg border border-[#E8DFD0] text-[#746D62] hover:text-[#003D2D]">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">Add New Product</h1>
          <p className="text-xs text-[#746D62]">All product details and variants persist directly in PostgreSQL</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Basic Details */}
        <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4">
          <h2 className="font-serif text-base font-semibold text-[#191714]">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Embroidered Anarkali Kurti Set"
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Master SKU *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="e.g. RF-KURTI-001"
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 font-mono text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Regular Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="1999"
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Sale Price (₹) (Optional)</label>
              <input
                type="number"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="1499"
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Short Description</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. Elegant co-ord and kurti set for a refined look."
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
            />
          </div>

          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Full Description *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the garment, styling tips, silhouette and neckline details..."
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
            />
          </div>
        </div>

        {/* Categories and Organization */}
        <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4">
          <h2 className="font-serif text-base font-semibold text-[#191714]">Classification &amp; Visibility</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Collection</label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              >
                <option value="">Select Collection</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Fabric Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Care Instructions</label>
              <input
                type="text"
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-3">
            <label className="flex items-center space-x-2 cursor-pointer font-medium text-[#191714]">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="rounded text-[#003D2D]"
              />
              <span>Mark as New Arrival</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer font-medium text-[#191714]">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-[#003D2D]"
              />
              <span>Feature on Homepage</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer font-medium text-[#191714]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-[#003D2D]"
              />
              <span>Active (Visible on Storefront)</span>
            </label>
          </div>
        </div>

        {/* Media & Images */}
        <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4">
          <h2 className="font-serif text-base font-semibold text-[#191714]">Product Images</h2>
          <div className="flex flex-wrap gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-32 rounded-lg overflow-hidden border-2 border-[#003D2D] bg-[#FAF6F0] group">
                <Image src={img.url} alt="Uploaded" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-0 inset-x-0 bg-[#003D2D] text-white text-[9px] text-center font-bold py-0.5">
                    Cover
                  </span>
                )}
              </div>
            ))}

            <label className="w-24 h-32 border-2 border-dashed border-[#C9A34A] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#FFF8ED] transition-colors text-center p-2">
              <Upload size={18} className="text-[#003D2D] mb-1" />
              <span className="text-[10px] text-[#746D62]">{isUploading ? 'Uploading...' : 'Add Image'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Variants & Inventory */}
        <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-base font-semibold text-[#191714]">Size &amp; Color Variants</h2>
            <button
              type="button"
              onClick={handleAddVariant}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#FAF6F0] border border-[#003D2D] text-[#003D2D] rounded-md font-semibold hover:bg-[#003D2D] hover:text-white transition-colors"
            >
              <Plus size={13} />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-3 bg-[#FAF6F0] rounded-lg items-center">
                <div>
                  <label className="block text-[10px] text-[#746D62] mb-0.5">Size</label>
                  <input
                    type="text"
                    required
                    value={v.size}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].size = e.target.value.toUpperCase();
                      setVariants(updated);
                    }}
                    placeholder="S, M, L..."
                    className="w-full bg-white border border-[#E8DFD0] rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#746D62] mb-0.5">Color</label>
                  <input
                    type="text"
                    required
                    value={v.color}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].color = e.target.value;
                      setVariants(updated);
                    }}
                    placeholder="Color"
                    className="w-full bg-white border border-[#E8DFD0] rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#746D62] mb-0.5">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={v.stockQuantity}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].stockQuantity = Number(e.target.value);
                      setVariants(updated);
                    }}
                    className="w-full bg-white border border-[#E8DFD0] rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#746D62] mb-0.5">Variant SKU (Optional)</label>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].sku = e.target.value.toUpperCase();
                      setVariants(updated);
                    }}
                    placeholder="Auto-generated"
                    className="w-full bg-white border border-[#E8DFD0] rounded p-2 font-mono text-[10px]"
                  />
                </div>
                <div className="flex justify-end pt-3 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    title="Remove Variant"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Link
            href="/admin/dashboard/products"
            className="px-6 py-3 border border-[#E8DFD0] rounded-lg font-semibold uppercase tracking-wider text-[#746D62] hover:bg-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#003D2D] hover:bg-[#0B5940] text-[#FFF8ED] rounded-lg font-semibold uppercase tracking-wider shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Saving to Database...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

