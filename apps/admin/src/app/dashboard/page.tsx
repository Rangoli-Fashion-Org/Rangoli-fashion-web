'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingCart,
  Clock,
  CheckCircle,
  Users,
  Shirt,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { fetchAdminApi } from '../../lib/api';
import { formatINR } from '@rangoli/validation';

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminApi<any>('/admin/dashboard/stats').then((res) => {
      if (res.success && res.data) {
        setStats(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#003D2D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Net Sales',
      value: formatINR(stats?.totalSales || 0),
      icon: <TrendingUp className="text-[#003D2D]" size={22} />,
      bg: 'bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart className="text-blue-600" size={22} />,
      bg: 'bg-blue-50 border-blue-200',
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: <Clock className="text-amber-600" size={22} />,
      bg: 'bg-amber-50 border-amber-200',
    },
    {
      label: 'Delivered Orders',
      value: stats?.completedOrders || 0,
      icon: <CheckCircle className="text-emerald-700" size={22} />,
      bg: 'bg-green-50 border-green-200',
    },
    {
      label: 'Registered Customers',
      value: stats?.totalCustomers || 0,
      icon: <Users className="text-purple-600" size={22} />,
      bg: 'bg-purple-50 border-purple-200',
    },
    {
      label: 'Total Catalogue Styles',
      value: stats?.totalProducts || 0,
      icon: <Shirt className="text-[#003D2D]" size={22} />,
      bg: 'bg-[#FFF8ED] border-[#C9A34A]/50',
    },
    {
      label: 'Low Stock Alerts (<= 5)',
      value: stats?.lowStockCount || 0,
      icon: <AlertTriangle className="text-red-600" size={22} />,
      bg: 'bg-red-50 border-red-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#191714]">
          Store Overview
        </h1>
        <p className="text-xs text-[#746D62] mt-1">
          Live statistics and performance metrics aggregated from PostgreSQL.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border ${card.bg} shadow-2xs flex items-center justify-between`}
          >
            <div>
              <p className="text-xs font-medium text-[#746D62]">{card.label}</p>
              <p className="font-serif text-2xl font-bold text-[#191714] mt-1">{card.value}</p>
            </div>
            <div className="p-3 bg-white/80 rounded-lg shadow-2xs">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD0]">
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#191714]">Recent Customer Orders</h2>
            <p className="text-xs text-[#746D62]">Latest purchases placed on the storefront</p>
          </div>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#003D2D] hover:underline"
          >
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD0]/60">
                {stats.recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-[#FFF8ED]">
                    <td className="p-3 font-bold text-[#003D2D]">{ord.orderNumber}</td>
                    <td className="p-3 text-[#191714]">{ord.customerName}</td>
                    <td className="p-3 text-[#746D62]">{ord.items?.length || 0} styles</td>
                    <td className="p-3 font-semibold text-[#191714]">{formatINR(ord.totalAmount)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        ord.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-[#746D62]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/dashboard/orders/${ord.id}`}
                        className="text-[#003D2D] font-semibold hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[#746D62]">
            <p className="font-serif text-base font-semibold text-[#191714]">No Orders Recorded Yet</p>
            <p className="mt-1">Orders placed on the storefront will automatically appear in this audit log.</p>
          </div>
        )}
      </div>
    </div>
  );
}

