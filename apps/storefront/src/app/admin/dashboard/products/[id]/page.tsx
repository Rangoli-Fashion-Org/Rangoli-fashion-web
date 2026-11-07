'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Plus, Trash2 } from 'lucide-react';
import { fetchAdminApi } from '@/lib/admin-api';
import { SmartProductAutoFill, ParsedProductData } from '@/components/admin/SmartProductAutoFill';
import { ProductImageDropzone, ProductImageItem } from '@/components/admin/ProductImageDropzone';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [regularPrice, setRegularPrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [material, setMaterial] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Images with Drag & Drop
  const [images, setImages] = useState<ProductImageItem[]>([]);

  // Variants
  const [variants, setVariants] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminApi<any[]>('/categories/admin/list').then((res) => {
      if (res.success && res.data) setCategories(res.data);
    });
    fetchAdminApi<any[]>('/collections/admin/list').then((res) => {
      if (res.success && res.data) setCollections(res.data);
    });

    fetchAdminApi<any>(`/products/admin/${params.id}`).then((res) => {
      if (res.success && res.data) {
        const p = res.data;
        setName(p.name);
        setSku(p.sku);
        setDescription(p.description);
        setShortDescription(p.shortDescription || '');
        setRegularPrice(p.regularPrice);
        setSalePrice(p.salePrice || '');
        setMaterial(p.material || '');
        setCareInstructions(p.careInstructions || '');
        setCategoryId(p.categoryId || '');
        setCollectionId(p.collectionId || '');
        setIsNewArrival(p.isNewArrival);
        setIsFeatured(p.isFeatured);
        setIsActive(p.isActive);
        setImages(
          (p.images || []).map((img: any, idx: number) => ({
            url: img.url,
            publicId: img.publicId || `img-${idx}`,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
          }))
        );
        setVariants(p.variants || []);
      }
      setIsLoading(false);
    });
  }, [params.id]);

  const handleAutoFill = (parsed: ParsedProductData, matchedCategoryId?: string, matchedCollectionId?: string) => {
    if (parsed.name) setName(parsed.name);
    if (parsed.sku) setSku(parsed.sku);
    if (parsed.regularPrice !== '') setRegularPrice(parsed.regularPrice);
    if (parsed.salePrice !== '') setSalePrice(parsed.salePrice);
    if (parsed.material) setMaterial(parsed.material);
    if (parsed.careInstructions) setCareInstructions(parsed.careInstructions);
    if (parsed.shortDescription) setShortDescription(parsed.shortDescription);
    if (parsed.description) setDescription(parsed.description);
    if (matchedCategoryId) setCategoryId(matchedCategoryId);
    if (matchedCollectionId) setCollectionId(matchedCollectionId);
    setIsNewArrival(parsed.isNewArrival);
    setIsFeatured(parsed.isFeatured);
    setIsActive(parsed.isActive);

    if (parsed.variants && parsed.variants.length > 0) {
      setVariants(parsed.variants);
    }
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { sku: '', size: 'M', color: variants[0]?.color || 'Emerald Green', stockQuantity: 10 },
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

    const processedVariants = variants.map((v, i) => ({
      ...v,
      sku: v.sku.trim() || `${sku.trim()}-${v.size}-${v.color.slice(0, 3).toUpperCase()}-${i + 1}`,
      stockQuantity: Number(v.stockQuantity) || 0,
    }));

    const res = await fetchAdminApi(`/products/${params.id}`, {
      method: 'PUT',
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
      setError(res.message || 'Failed to update product');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-xs">Loading product...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Page Header matching user screenshot */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E8DFD0]">
        <div className="flex items-center space-x-3">
          <Link href="/admin/dashboard/products" className="p-1.5 bg-white rounded-lg border border-[#E8DFD0] text-[#746D62] hover:text-[#003D2D]">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="font-sans font-bold text-base sm:text-lg text-[#191714] tracking-tight uppercase">
            EDIT PRODUCT: {name || 'UNTITLED PRODUCT'}
          </h1>
        </div>
        <Link
          href="/admin/dashboard/products"
          className="p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"
          title="Close"
        >
          <X size={20} />
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* 1. Smart Copy-Paste Auto-Fill Box */}
      <SmartProductAutoFill
        categories={categories}
        collections={collections}
        onAutoFill={handleAutoFill}
      />

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
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Sale Price (₹)</label>
              <input
                type="number"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : '')}
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
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
            />
          </div>
        </div>

        {/* Classification */}
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

        {/* Product Images with Drag & Drop */}
        <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4">
          <div>
            <h2 className="font-serif text-base font-semibold text-[#191714]">Product Images</h2>
            <p className="text-[11px] text-[#746D62] mt-0.5">
              Drag &amp; drop images directly into the area below, set cover photo, or reorder.
            </p>
          </div>

          <ProductImageDropzone
            images={images}
            onImagesChange={setImages}
            maxFiles={12}
          />
        </div>

        {/* Variants */}
        <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-serif text-base font-semibold text-[#191714]">Variants &amp; Inventory</h2>
              <p className="text-[11px] text-[#746D62] mt-0.5">
                Auto-generated from your sizes, colors, and stock per size
              </p>
            </div>
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
                  <label className="block text-[10px] text-[#746D62] mb-0.5">Variant SKU</label>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].sku = e.target.value.toUpperCase();
                      setVariants(updated);
                    }}
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
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
