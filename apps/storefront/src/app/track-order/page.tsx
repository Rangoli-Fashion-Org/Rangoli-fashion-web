'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Clock, CheckCircle2, Truck } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { formatINR } from '@rangoli/validation';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialNumber = searchParams.get('orderNumber') || '';

  const [orderNumber, setOrderNumber] = useState(initialNumber);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrder = async (numberToFetch: string) => {
    if (!numberToFetch.trim()) return;
    setIsLoading(true);
    setError('');

    const res = await fetchApi<any>(`/orders/track/${encodeURIComponent(numberToFetch.trim())}`);
    if (res.success && res.data) {
      setOrder(res.data);
    } else {
      setOrder(null);
      setError('No order found with this reference number. Please check and try again.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (initialNumber) {
      fetchOrder(initialNumber);
    }
  }, [initialNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber);
  };

  const steps = [
    { key: 'CONFIRMED', label: 'Order Confirmed', icon: <CheckCircle2 size={18} /> },
    { key: 'PROCESSING', label: 'Processing & Packaging', icon: <Package size={18} /> },
    { key: 'SHIPPED', label: 'Shipped / In Transit', icon: <Truck size={18} /> },
    { key: 'DELIVERED', label: 'Delivered', icon: <CheckCircle2 size={18} /> },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'CONFIRMED':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-[#191714]">Track Your Order</h1>
          <p className="text-xs sm:text-sm text-[#746D62] mt-1.5">
            Enter your Rangoli Fashions order number to check live shipping status.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-10">
          <input
            type="text"
            required
            placeholder="e.g. RF-123456-7890"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="flex-1 bg-white border border-[#E8DFD0] rounded-full py-2.5 px-4 text-xs sm:text-sm text-[#191714] focus:outline-none focus:border-[#003D2D]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center text-xs text-red-600 font-medium mb-8">
            {error}
          </div>
        )}

        {/* Order Details & Timeline */}
        {order && (
          <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-md p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-[#E8DFD0] gap-2">
              <div>
                <span className="text-xs text-[#746D62]">Order Reference:</span>
                <h3 className="font-serif text-lg font-bold text-[#003D2D]">{order.orderNumber}</h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-[#746D62]">Placed On:</span>
                <p className="text-xs font-semibold text-[#191714]">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Tracking Steps Progress */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#191714] mb-6">Order Status</h4>
              <div className="relative flex justify-between items-center">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E8DFD0] -translate-y-1/2 z-0" />
                {steps.map((st, idx) => {
                  const currentActive = getStepIndex(order.status);
                  const isDone = idx <= currentActive;
                  return (
                    <div key={st.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          isDone ? 'bg-[#003D2D] text-white shadow-md' : 'bg-white border-2 border-[#E8DFD0] text-[#746D62]'
                        }`}
                      >
                        {st.icon}
                      </div>
                      <span className="text-[11px] font-medium text-[#191714] mt-2 text-center max-w-[80px]">
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking Courier Info if Shipped */}
            {order.trackingNumber && (
              <div className="p-3.5 bg-[#FFF8ED] rounded-lg border border-[#E8DFD0] text-xs text-[#746D62]">
                <p>
                  <strong>Courier:</strong> {order.trackingCourier || 'Standard Express'}
                </p>
                <p>
                  <strong>Tracking Number:</strong> {order.trackingNumber}
                </p>
              </div>
            )}

            {/* Order Items Snapshot */}
            <div className="pt-4 border-t border-[#E8DFD0]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#191714] mb-3">Items in this Order</h4>
              <div className="divide-y divide-[#E8DFD0]/60 text-xs">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-[#191714]">{item.productName}</p>
                      <p className="text-[#746D62]">{item.variantDescription || item.sku} × {item.quantity}</p>
                    </div>
                    <span className="font-bold text-[#191714]">{formatINR(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DFD0] flex justify-between text-sm font-bold text-[#191714]">
              <span>Total Paid</span>
              <span>{formatINR(order.totalAmount)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] p-12 text-center">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

