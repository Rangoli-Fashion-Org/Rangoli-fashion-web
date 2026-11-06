'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Save } from 'lucide-react';
import { fetchAdminApi } from '../../../lib/api';

export default function AdminShippingPage() {
  const [threshold, setThreshold] = useState('1999');
  const [shippingFee, setShippingFee] = useState('99');
  const [estimatedDays, setEstimatedDays] = useState('3-5 business days');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchAdminApi<Record<string, string>>('/settings/admin/all').then((res) => {
      if (res.success && res.data) {
        if (res.data.free_shipping_threshold) setThreshold(res.data.free_shipping_threshold);
        if (res.data.standard_shipping_fee) setShippingFee(res.data.standard_shipping_fee);
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');

    await Promise.all([
      fetchAdminApi('/settings/admin/key/free_shipping_threshold', {
        method: 'PUT',
        body: JSON.stringify({ value: threshold, group: 'SHIPPING' }),
      }),
      fetchAdminApi('/settings/admin/key/standard_shipping_fee', {
        method: 'PUT',
        body: JSON.stringify({ value: shippingFee, group: 'SHIPPING' }),
      }),
    ]);

    setStatusMsg('Shipping thresholds updated successfully');
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#191714]">Shipping Configuration</h1>
        <p className="text-xs text-[#746D62] mt-0.5">Control free delivery thresholds and standard flat shipping fees</p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-medium">
          {statusMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Free Shipping Minimum Cart Value (₹)</label>
            <input
              type="number"
              required
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 font-bold text-sm text-[#003D2D]"
            />
            <p className="text-[10px] text-[#746D62] mt-1">Orders at or above this value get automatic free shipping.</p>
          </div>

          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Standard Shipping Fee (₹)</label>
            <input
              type="number"
              required
              value={shippingFee}
              onChange={(e) => setShippingFee(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 font-bold text-sm text-[#191714]"
            />
            <p className="text-[10px] text-[#746D62] mt-1">Applied to carts below the free shipping threshold.</p>
          </div>
        </div>

        <div>
          <label className="block text-[#746D62] mb-1 font-medium">Standard Delivery Timeline</label>
          <input
            type="text"
            value={estimatedDays}
            onChange={(e) => setEstimatedDays(e.target.value)}
            className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-8 py-3 bg-[#003D2D] hover:bg-[#0B5940] text-[#FFF8ED] rounded-lg font-semibold uppercase tracking-wider shadow-sm disabled:opacity-50"
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : 'Save Shipping Rules'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
