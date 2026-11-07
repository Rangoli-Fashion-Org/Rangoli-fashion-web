'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye } from 'lucide-react';
import { fetchAdminApi } from '@/lib/admin-api';
import { formatINR } from '@rangoli/validation';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);

    const res = await fetchAdminApi<any[]>(`/orders/admin/list?${params.toString()}`);
    if (res.success && res.data) {
      setOrders(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#191714]">Order Management</h1>
        <p className="text-xs text-[#746D62] mt-0.5">Track fulfillment, payments, shipments and returns</p>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8DFD0] shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-3 text-[#746D62]" />
          <input
            type="text"
            placeholder="Search order #, customer name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF6F0] border border-[#E8DFD0] rounded-md py-2 pl-9 pr-3 text-xs text-[#191714] focus:outline-none focus:border-[#003D2D]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-[#746D62]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF6F0] border border-[#E8DFD0] rounded-md px-3 py-2 text-xs text-[#191714] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#746D62]">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
                <tr>
                  <th className="p-3">Order Number</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Order Status</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD0]/60">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FFF8ED]">
                    <td className="p-3 font-bold text-[#003D2D]">{ord.orderNumber}</td>
                    <td className="p-3">
                      <p className="font-semibold text-[#191714]">{ord.customerName}</p>
                      <p className="text-[10px] text-[#746D62]">{ord.userEmail}</p>
                    </td>
                    <td className="p-3 text-[#746D62]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-[#746D62]">{ord.items?.length || 0} styles</td>
                    <td className="p-3 font-semibold text-[#191714]">{formatINR(ord.totalAmount)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        ord.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {ord.paymentStatus} ({ord.paymentMethod})
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/dashboard/orders/${ord.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-[#FAF6F0] border border-[#003D2D] text-[#003D2D] hover:bg-[#003D2D] hover:text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        <Eye size={13} />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#746D62]">
            <p className="font-serif text-base font-semibold text-[#191714]">No Orders Found</p>
            <p className="mt-1">Orders placed on the customer storefront will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

