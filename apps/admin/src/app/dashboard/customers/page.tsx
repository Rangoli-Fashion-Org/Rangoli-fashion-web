'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, ShoppingBag } from 'lucide-react';
import { fetchAdminApi } from '../../../lib/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminApi<any[]>('/admin/customers').then((res) => {
      if (res.success && res.data) {
        setCustomers(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#191714]">Customers Directory</h1>
        <p className="text-xs text-[#746D62] mt-0.5">Registered customer accounts, orders placed, and contact profiles</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#746D62]">Loading customers...</div>
        ) : customers.length > 0 ? (
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
              <tr>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Mobile Number</th>
                <th className="p-3">Orders Placed</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD0]/60">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-[#FFF8ED]">
                  <td className="p-3 font-semibold text-[#191714] flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[#003D2D] text-white flex items-center justify-center font-bold text-xs uppercase">
                      {c.fullName.charAt(0)}
                    </div>
                    <span>{c.fullName}</span>
                  </td>
                  <td className="p-3 text-[#746D62]">{c.email}</td>
                  <td className="p-3 text-[#746D62]">{c.phoneNumber || '—'}</td>
                  <td className="p-3 font-medium text-[#191714]">
                    {c._count?.orders || 0} orders
                  </td>
                  <td className="p-3 text-[#746D62]">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-xs text-[#746D62]">
            <p className="font-serif text-base font-semibold text-[#191714]">No Registered Customers</p>
            <p className="mt-1">When customers create accounts or check out, their records will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
