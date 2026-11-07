'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, TicketPercent } from 'lucide-react';
import { fetchAdminApi } from '@/lib/admin-api';
import { formatINR } from '@rangoli/validation';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number | ''>('');
  const [minOrderValue, setMinOrderValue] = useState<number | ''>('');
  const [maxDiscount, setMaxDiscount] = useState<number | ''>('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState<number | ''>('');
  const [isActive, setIsActive] = useState(true);

  const loadCoupons = async () => {
    setIsLoading(true);
    const res = await fetchAdminApi<any[]>('/coupons');
    if (res.success && res.data) {
      setCoupons(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setCode('');
    setDescription('');
    setDiscountType('PERCENTAGE');
    setDiscountValue('');
    setMinOrderValue('');
    setMaxDiscount('');
    setExpiryDate('');
    setUsageLimit('');
    setIsActive(true);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    const payload = {
      code: code.toUpperCase().trim(),
      description,
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: minOrderValue ? Number(minOrderValue) : null,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      isActive,
    };

    if (editingId) {
      await fetchAdminApi(`/coupons/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } else {
      await fetchAdminApi('/coupons', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    setIsEditing(false);
    loadCoupons();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this promotional coupon?')) {
      await fetchAdminApi(`/coupons/${id}`, { method: 'DELETE' });
      loadCoupons();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">Coupon &amp; Discount Management</h1>
          <p className="text-xs text-[#746D62] mt-0.5">Configure promotional codes, percentage discounts, and order thresholds</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-md space-y-4 text-xs">
          <h3 className="font-serif text-base font-semibold text-[#191714]">
            {editingId ? 'Edit Coupon' : 'Create New Coupon'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Coupon Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FESTIVE25"
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 font-mono text-[#003D2D] font-bold"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full border border-[#E8DFD0] rounded-md p-2.5"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Flat Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Discount Value *</label>
              <input
                type="number"
                required
                min="1"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                placeholder="25"
                className="w-full border border-[#E8DFD0] rounded-md p-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Min. Order Value (₹)</label>
              <input
                type="number"
                min="0"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value ? Number(e.target.value) : '')}
                placeholder="999"
                className="w-full border border-[#E8DFD0] rounded-md p-2.5"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Max. Discount Cap (₹)</label>
              <input
                type="number"
                min="0"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value ? Number(e.target.value) : '')}
                placeholder="500"
                className="w-full border border-[#E8DFD0] rounded-md p-2.5"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border border-[#E8DFD0] rounded-md p-2.5"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border rounded-md text-[#746D62]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#003D2D] text-white rounded-md font-semibold"
            >
              Save Coupon
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#746D62]">Loading coupons...</div>
        ) : coupons.length > 0 ? (
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Min Order</th>
                <th className="p-3">Expiry</th>
                <th className="p-3">Usage Count</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD0]/60">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#FFF8ED]">
                  <td className="p-3 font-mono font-bold text-[#003D2D]">{c.code}</td>
                  <td className="p-3 font-semibold text-[#191714]">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : formatINR(c.discountValue)}
                  </td>
                  <td className="p-3 text-[#746D62]">{c.minOrderValue ? formatINR(c.minOrderValue) : 'None'}</td>
                  <td className="p-3 text-[#746D62]">
                    {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-3 font-medium text-[#191714]">{c.usageCount} times</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      c.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
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
            <p className="font-serif text-base font-semibold text-[#191714]">No Coupons Configured</p>
            <p className="mt-1">Add discount coupons to offer promotions during festive seasons.</p>
          </div>
        )}
      </div>
    </div>
  );
}

