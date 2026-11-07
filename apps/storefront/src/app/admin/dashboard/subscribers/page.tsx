'use client';

import React, { useState, useEffect } from 'react';
import { Download, Search, Mail } from 'lucide-react';
import { fetchAdminApi } from '@/lib/admin-api';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadSubscribers = async () => {
    setIsLoading(true);
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetchAdminApi<any[]>(`/newsletter/admin/subscribers${query}`);
    if (res.success && res.data) {
      setSubscribers(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadSubscribers();
  }, [search]);

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,SubscribedAt,Status', ...subscribers.map((s) => `${s.email},${s.subscribedAt},${s.isActive ? 'Active' : 'Unsubscribed'}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rangoli_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">Newsletter Subscribers</h1>
          <p className="text-xs text-[#746D62] mt-0.5">Real subscribers collected through the &quot;Stay in the Fashion Loop&quot; section</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors disabled:opacity-50"
        >
          <Download size={15} />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#E8DFD0] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-3 text-[#746D62]" />
          <input
            type="text"
            placeholder="Search email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF6F0] border border-[#E8DFD0] rounded-md py-2 pl-9 pr-3 text-xs text-[#191714] focus:outline-none focus:border-[#003D2D]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#746D62]">Loading subscribers...</div>
        ) : subscribers.length > 0 ? (
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
              <tr>
                <th className="p-3">Subscriber Email</th>
                <th className="p-3">Subscribed Date</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD0]/60">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-[#FFF8ED]">
                  <td className="p-3 font-medium text-[#191714] flex items-center space-x-2">
                    <Mail size={14} className="text-[#C9A34A]" />
                    <span>{s.email}</span>
                  </td>
                  <td className="p-3 text-[#746D62]">{new Date(s.subscribedAt).toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      s.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {s.isActive ? 'Subscribed' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-xs text-[#746D62]">
            <p className="font-serif text-base font-semibold text-[#191714]">No Subscribers Yet</p>
            <p className="mt-1">When visitors enter their email on the storefront, their subscriptions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

