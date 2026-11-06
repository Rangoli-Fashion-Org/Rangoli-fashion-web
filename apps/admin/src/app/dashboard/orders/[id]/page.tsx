'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Truck, CheckCircle2, ShieldCheck, User, MapPin } from 'lucide-react';
import { fetchAdminApi } from '../../../../lib/api';
import { formatINR } from '@rangoli/validation';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Status updates
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingCourier, setTrackingCourier] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadOrder = async () => {
    setIsLoading(true);
    const res = await fetchAdminApi<any>(`/orders/${params.id}`);
    if (res.success && res.data) {
      setOrder(res.data);
      setStatus(res.data.status);
      setTrackingNumber(res.data.trackingNumber || '');
      setTrackingCourier(res.data.trackingCourier || '');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMsg('');

    const res = await fetchAdminApi(`/orders/admin/${params.id}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        trackingNumber: trackingNumber || undefined,
        trackingCourier: trackingCourier || undefined,
      }),
    });

    if (res.success) {
      setSuccessMsg('Order status and shipping details updated successfully');
      loadOrder();
    }
    setIsUpdating(false);
  };

  if (isLoading || !order) {
    return <div className="p-12 text-center text-xs">Loading order details...</div>;
  }

  const shippingAddr = order.shippingAddressJson || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-3">
        <Link href="/dashboard/orders" className="p-2 bg-white rounded-lg border border-[#E8DFD0] text-[#746D62] hover:text-[#003D2D]">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-[#746D62]">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-medium">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items & Customer Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4">
            <h2 className="font-serif text-base font-semibold text-[#191714]">Order Items</h2>
            <div className="divide-y divide-[#E8DFD0]/60 text-xs">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-16 rounded overflow-hidden bg-[#FAF6F0] border shrink-0">
                      <Image
                        src={item.imageUrl || '/brand/rf-monogram.jpg'}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-serif font-semibold text-sm text-[#191714]">{item.productName}</p>
                      <p className="text-[#746D62]">{item.variantDescription || 'Standard'}</p>
                      <p className="text-[10px] text-[#746D62] font-mono">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#191714]">{formatINR(item.totalPrice)}</p>
                    <p className="text-[#746D62] text-[11px]">Qty: {item.quantity} × {formatINR(item.unitPrice)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-[#E8DFD0] space-y-1.5 text-xs text-[#746D62]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount</span>
                  <span>-{formatINR(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{order.shippingFee === 0 ? 'FREE' : formatINR(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#191714] pt-2 border-t border-[#E8DFD0]">
                <span>Total Amount</span>
                <span>{formatINR(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4 text-xs">
            <h2 className="font-serif text-base font-semibold text-[#191714]">Shipping &amp; Customer Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="font-semibold text-[#191714] flex items-center space-x-1">
                  <User size={14} />
                  <span>Customer Contact</span>
                </span>
                <p className="text-[#746D62] font-medium">{order.customerName}</p>
                <p className="text-[#746D62]">{order.userEmail}</p>
                <p className="text-[#746D62]">{order.customerPhone}</p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-[#191714] flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>Delivery Address</span>
                </span>
                <p className="text-[#746D62]">{shippingAddr.street}</p>
                {shippingAddr.apartment && <p className="text-[#746D62]">{shippingAddr.apartment}</p>}
                <p className="text-[#746D62]">
                  {shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postalCode}
                </p>
                <p className="text-[#746D62]">{shippingAddr.country || 'India'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Fulfillment Actions */}
        <div className="space-y-6">
          <form onSubmit={handleUpdateStatus} className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4 text-xs">
            <h2 className="font-serif text-base font-semibold text-[#191714]">Fulfillment Status</h2>

            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Order Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 font-semibold text-[#003D2D]"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Shipping Courier Name</label>
              <input
                type="text"
                placeholder="e.g. Blue Dart, Delhivery, DTDC"
                value={trackingCourier}
                onChange={(e) => setTrackingCourier(e.target.value)}
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
              />
            </div>

            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Tracking Reference Number</label>
              <input
                type="text"
                placeholder="e.g. AWB-9876543210"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full border border-[#E8DFD0] rounded-md p-2.5 font-mono text-[#191714]"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-3 bg-[#003D2D] hover:bg-[#0B5940] text-[#FFF8ED] rounded-lg font-semibold uppercase tracking-wider shadow-sm disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Update Fulfillment'}
            </button>
          </form>

          {/* Payment Status Card */}
          <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-3 text-xs">
            <h2 className="font-serif text-base font-semibold text-[#191714]">Payment Information</h2>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#746D62]">Method:</span>
                <span className="font-bold text-[#191714]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#746D62]">Status:</span>
                <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-700' : 'text-amber-700'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#746D62]">Razorpay ID:</span>
                  <span>{order.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
