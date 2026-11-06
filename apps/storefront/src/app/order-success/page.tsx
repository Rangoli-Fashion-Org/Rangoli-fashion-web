'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Package, Truck } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { formatINR } from '@rangoli/validation';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderNumber) {
      fetchApi<any>(`/orders/track/${orderNumber}`).then((res) => {
        if (res.success && res.data) {
          setOrder(res.data);
        }
      });
    }
  }, [orderNumber]);

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E8DFD0] shadow-lg">
          <div className="w-16 h-16 bg-[#003D2D]/10 rounded-full flex items-center justify-center mx-auto mb-5 text-[#003D2D]">
            <CheckCircle2 size={36} />
          </div>

          <h1 className="font-serif text-3xl font-semibold text-[#191714]">
            Order Confirmed!
          </h1>
          <p className="text-sm text-[#746D62] mt-2">
            Thank you for shopping with Rangoli Fashions. We have received your order and are preparing your ethnic garments with care.
          </p>

          <div className="my-6 p-4 rounded-xl bg-[#FFF8ED] border border-[#E8DFD0] text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#746D62]">Order Number:</span>
              <span className="font-bold text-[#003D2D]">{orderNumber || 'Processing...'}</span>
            </div>
            {order && (
              <>
                <div className="flex justify-between">
                  <span className="text-[#746D62]">Status:</span>
                  <span className="font-semibold text-[#191714]">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#746D62]">Total Amount:</span>
                  <span className="font-bold text-[#191714]">{formatINR(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#746D62]">Payment Status:</span>
                  <span className="font-semibold text-green-700">{order.paymentStatus}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href={`/track-order?orderNumber=${orderNumber}`}
              className="px-6 py-3 bg-[#FAF6F0] border border-[#003D2D] text-[#003D2D] hover:bg-[#003D2D] hover:text-[#FFF8ED] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center space-x-1.5"
            >
              <Truck size={15} />
              <span>Track Order</span>
            </Link>

            <Link
              href="/shop"
              className="px-6 py-3 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center space-x-1.5"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] p-12 text-center">Loading confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

