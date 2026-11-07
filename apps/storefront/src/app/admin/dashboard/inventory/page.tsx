'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Minus, History } from 'lucide-react';
import { fetchAdminApi } from '@/lib/admin-api';

export default function AdminInventoryPage() {
  const [summary, setSummary] = useState<any>(null);
  const [movements, setMovements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stocks' | 'movements'>('stocks');

  // Adjustment Modal
  const [adjustingItem, setAdjustingItem] = useState<{
    productId: string;
    variantId?: string;
    productName: string;
    currentStock: number;
  } | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState<number>(0);
  const [reason, setReason] = useState('Stock count verification');

  const loadData = async () => {
    setIsLoading(true);
    const [sumRes, movRes] = await Promise.all([
      fetchAdminApi('/inventory/summary'),
      fetchAdminApi('/inventory/movements'),
    ]);

    if (sumRes.success) setSummary(sumRes.data);
    if (movRes.success) setMovements(movRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem || adjustmentQty === 0) return;

    await fetchAdminApi('/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify({
        productId: adjustingItem.productId,
        variantId: adjustingItem.variantId || undefined,
        adjustment: Number(adjustmentQty),
        type: adjustmentQty > 0 ? 'RESTOCK' : 'ADJUSTMENT',
        reason,
      }),
    });

    setAdjustingItem(null);
    setAdjustmentQty(0);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">Inventory &amp; Stock Control</h1>
          <p className="text-xs text-[#746D62] mt-0.5">Manage live variant quantities and view complete stock movements</p>
        </div>

        <div className="flex space-x-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('stocks')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'stocks' ? 'bg-[#003D2D] text-white' : 'bg-white border text-[#746D62]'
            }`}
          >
            Stock Quantities
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'movements' ? 'bg-[#003D2D] text-white' : 'bg-white border text-[#746D62]'
            }`}
          >
            Movement Audit Trail
          </button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#E8DFD0] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#746D62]">Total Catalogued Styles</span>
              <p className="font-serif text-2xl font-bold text-[#191714]">{summary.totalProducts}</p>
            </div>
          </div>
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            summary.lowStockCount > 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-[#E8DFD0]'
          }`}>
            <div>
              <span className="text-xs font-medium">Low Stock Alerts (&le; 5 units)</span>
              <p className="font-serif text-2xl font-bold">{summary.lowStockCount}</p>
            </div>
            {summary.lowStockCount > 0 && <AlertTriangle size={24} className="text-red-500" />}
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setAdjustingItem(null)} />
          <form onSubmit={handleAdjust} className="relative bg-white rounded-xl p-6 max-w-md w-full shadow-2xl z-10 space-y-4 text-xs">
            <h3 className="font-serif text-base font-semibold text-[#191714]">
              Adjust Stock: {adjustingItem.productName}
            </h3>
            <p className="text-[#746D62]">
              Current stock: <strong>{adjustingItem.currentStock} units</strong>
            </p>

            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Adjustment (+ to add, - to subtract)</label>
              <input
                type="number"
                required
                value={adjustmentQty}
                onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                placeholder="+10 or -5"
                className="w-full border border-[#E8DFD0] rounded p-2.5 text-sm font-bold text-[#003D2D]"
              />
            </div>

            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Reason for Adjustment</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-[#E8DFD0] rounded p-2.5 text-[#191714]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="px-4 py-2 border rounded text-[#746D62]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#003D2D] text-white rounded font-semibold"
              >
                Confirm Adjustment
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'stocks' && (
        <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Total Stock</th>
                <th className="p-3">Variant Stock Breakdown</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD0]/60">
              {summary?.products?.map((p: any) => (
                <tr key={p.id} className="hover:bg-[#FFF8ED]">
                  <td className="p-3 font-semibold text-[#191714]">{p.name}</td>
                  <td className="p-3 font-mono text-[#746D62]">{p.sku}</td>
                  <td className="p-3">
                    <span className={`font-bold ${p.stockQuantity <= 5 ? 'text-red-600' : 'text-[#003D2D]'}`}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1.5">
                      {p.variants?.map((v: any) => (
                        <button
                          key={v.id}
                          onClick={() => setAdjustingItem({
                            productId: p.id,
                            variantId: v.id,
                            productName: `${p.name} (${v.size} - ${v.color})`,
                            currentStock: v.stockQuantity,
                          })}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border hover:border-[#003D2D] ${
                            v.stockQuantity <= 2 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          {v.size}: {v.stockQuantity}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setAdjustingItem({
                        productId: p.id,
                        productName: p.name,
                        currentStock: p.stockQuantity,
                      })}
                      className="px-2.5 py-1 bg-[#FAF6F0] border border-[#003D2D] text-[#003D2D] rounded font-semibold hover:bg-[#003D2D] hover:text-white transition-colors"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'movements' && (
        <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Product</th>
                <th className="p-3">Type</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">New Stock</th>
                <th className="p-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD0]/60">
              {movements.map((m: any) => (
                <tr key={m.id} className="hover:bg-[#FFF8ED]">
                  <td className="p-3 text-[#746D62]">{new Date(m.createdAt).toLocaleString()}</td>
                  <td className="p-3 font-medium text-[#191714]">
                    {m.product?.name} {m.variant && `(${m.variant.size})`}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF6F0] text-[#003D2D]">
                      {m.type}
                    </span>
                  </td>
                  <td className="p-3 font-bold">
                    <span className={m.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-[#191714]">{m.newStock}</td>
                  <td className="p-3 text-[#746D62]">{m.reason || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

