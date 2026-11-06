'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { fetchAdminApi } from '../../../lib/api';
import { formatINR } from '@rangoli/validation';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const loadProducts = async () => {
    setIsLoading(true);
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetchAdminApi<any[]>(`/products/admin/list${query}`);
    if (res.success && res.data) {
      setProducts(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this product?')) {
      await fetchAdminApi(`/products/${id}`, { method: 'DELETE' });
      loadProducts();
    }
  };

  const handleBulkStatus = async (isActive: boolean) => {
    if (selectedIds.length === 0) return;
    await fetchAdminApi('/products/admin/bulk-status', {
      method: 'PATCH',
      body: JSON.stringify({ ids: selectedIds, isActive }),
    });
    setSelectedIds([]);
    loadProducts();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">Products Management</h1>
          <p className="text-xs text-[#746D62] mt-0.5">Create, edit, manage variants and live catalogue status</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search and Bulk Actions */}
      <div className="bg-white p-4 rounded-xl border border-[#E8DFD0] shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-3 text-[#746D62]" />
          <input
            type="text"
            placeholder="Search products by title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF6F0] border border-[#E8DFD0] rounded-md py-2 pl-9 pr-3 text-xs text-[#191714] focus:outline-none focus:border-[#003D2D]"
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[#746D62]">{selectedIds.length} selected:</span>
            <button
              onClick={() => handleBulkStatus(true)}
              className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded font-medium hover:bg-green-100"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkStatus(false)}
              className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded font-medium hover:bg-red-100"
            >
              Deactivate
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#746D62]">Loading catalogue...</div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
                <tr>
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === products.length && products.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(products.map((p) => p.id));
                        else setSelectedIds([]);
                      }}
                    />
                  </th>
                  <th className="p-3">Product</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD0]/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FFF8ED]">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds([...selectedIds, p.id]);
                          else setSelectedIds(selectedIds.filter((id) => id !== p.id));
                        }}
                      />
                    </td>
                    <td className="p-3 flex items-center space-x-3">
                      <div className="relative w-10 h-12 rounded overflow-hidden bg-[#FAF6F0] shrink-0 border border-[#E8DFD0]">
                        <Image
                          src={p.images?.[0]?.url || '/brand/rf-monogram.jpg'}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-serif font-semibold text-[#191714] line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-[#746D62]">{p.variants?.length || 0} variants</p>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[#746D62]">{p.sku}</td>
                    <td className="p-3 font-semibold text-[#191714]">
                      {formatINR(p.salePrice || p.regularPrice)}
                    </td>
                    <td className="p-3">
                      <span className={`font-semibold ${p.stockQuantity <= 5 ? 'text-red-600' : 'text-[#191714]'}`}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td className="p-3 text-[#746D62]">{p.category?.name || '—'}</td>
                    <td className="p-3">
                      {p.isActive ? (
                        <span className="inline-flex items-center space-x-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-green-200">
                          <CheckCircle2 size={12} />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                          <XCircle size={12} />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link
                        href={`/dashboard/products/${p.id}`}
                        className="inline-block p-1 text-[#003D2D] hover:bg-[#FAF6F0] rounded"
                        title="Edit Product"
                      >
                        <Edit2 size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#746D62]">
            <p className="font-serif text-base font-semibold text-[#191714]">No Products Found</p>
            <p className="mt-1">Add your first fashion item using the &quot;Add New Product&quot; button.</p>
          </div>
        )}
      </div>
    </div>
  );
}
