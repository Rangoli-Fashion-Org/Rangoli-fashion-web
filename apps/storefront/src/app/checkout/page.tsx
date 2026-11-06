'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { fetchApi, getSessionId } from '../../lib/api';
import { formatINR, isValidEmail, isValidIndianPhone, isValidPostalCode } from '@rangoli/validation';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();

  // Form States
  const [customerName, setCustomerName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Rajasthan');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill from user if logged in
  useEffect(() => {
    if (user) {
      setCustomerName(user.fullName || '');
      setUserEmail(user.email || '');
      setCustomerPhone(user.phoneNumber || '');

      fetchApi<any[]>('/users/addresses').then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setSavedAddresses(res.data);
          const defaultAddr = res.data.find((a: any) => a.isDefaultShipping) || res.data[0];
          setSelectedAddressId(defaultAddr.id);
          applySavedAddress(defaultAddr);
        }
      });
    }
  }, [user]);

  // Load Razorpay Checkout SDK Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const applySavedAddress = (addr: any) => {
    setCustomerName(addr.fullName);
    setCustomerPhone(addr.phoneNumber);
    setStreet(addr.street);
    setApartment(addr.apartment || '');
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!cart || cart.items.length === 0) {
      setErrorMessage('Your cart is empty');
      return;
    }

    if (!customerName.trim() || !userEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Please fill in your name, email, and phone number');
      return;
    }

    if (!isValidEmail(userEmail)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!isValidIndianPhone(customerPhone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!street.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setErrorMessage('Please complete all delivery address fields');
      return;
    }

    if (!isValidPostalCode(postalCode)) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    setIsSubmitting(true);

    try {
      const sessionId = getSessionId();
      // 1. Create Order in Backend with stock verification & reservation
      const orderRes = await fetchApi<any>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerName,
          userEmail,
          customerPhone,
          shippingAddress: {
            fullName: customerName,
            phoneNumber: customerPhone,
            street,
            apartment,
            city,
            state,
            postalCode,
            country: 'India',
          },
          paymentMethod,
          sessionId,
        }),
      });

      if (!orderRes.success || !orderRes.data) {
        setErrorMessage(orderRes.message || 'Failed to initialize order');
        setIsSubmitting(false);
        return;
      }

      const order = orderRes.data;

      // 2. If COD, redirect immediately
      if (paymentMethod === 'COD') {
        await refreshCart();
        router.push(`/order-success?orderNumber=${order.orderNumber}`);
        return;
      }

      // 3. If Razorpay, initialize Razorpay Gateway
      const razorpayOrderRes = await fetchApi<any>('/payments/razorpay/create-order', {
        method: 'POST',
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!razorpayOrderRes.success || !razorpayOrderRes.data) {
        setErrorMessage(razorpayOrderRes.message || 'Payment gateway initialization failed');
        setIsSubmitting(false);
        return;
      }

      const razorpayData = razorpayOrderRes.data;

      const rzpOptions = {
        key: razorpayData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayData.amount,
        currency: razorpayData.currency || 'INR',
        name: 'Rangoli Fashions',
        description: `Order #${order.orderNumber}`,
        image: '/brand/rf-monogram.jpg',
        order_id: razorpayData.order_id,
        handler: async (response: any) => {
          // 4. Verify Payment Signature on Backend (Single source of truth)
          const verifyRes = await fetchApi<any>('/payments/razorpay/verify', {
            method: 'POST',
            body: JSON.stringify({
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          if (verifyRes.success) {
            await refreshCart();
            router.push(`/order-success?orderNumber=${order.orderNumber}`);
          } else {
            setErrorMessage(verifyRes.message || 'Payment verification failed');
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: customerName,
          email: userEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#003D2D',
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      };

      if (typeof (window as any).Razorpay !== 'undefined') {
        const rzp = new (window as any).Razorpay(rzpOptions);
        rzp.open();
      } else {
        // Fallback if Razorpay SDK failed to load
        setErrorMessage('Payment SDK is loading, please try again in a moment');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during checkout');
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-[#FAF6F0] min-h-screen py-16 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#191714]">Your Cart is Empty</h1>
        <p className="text-xs text-[#746D62] mt-2">Add items to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="mt-6 inline-block px-6 py-2.5 bg-[#003D2D] text-white rounded-full text-xs font-semibold uppercase tracking-wider">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/shop" className="inline-flex items-center space-x-1.5 text-xs text-[#746D62] hover:text-[#003D2D]">
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#003D2D]">
            <ShieldCheck size={16} />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Details */}
            <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-semibold text-[#191714]">
                1. Customer Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#746D62] mb-1 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                  />
                </div>
                <div>
                  <label className="block text-[#746D62] mb-1 font-medium">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#746D62] mb-1 font-medium">Email Address (for order updates) *</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-semibold text-[#191714]">
                2. Delivery Address
              </h2>

              {savedAddresses.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[#191714] mb-2">Saved Addresses</label>
                  <div className="space-y-2">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`block p-3 border rounded-md cursor-pointer text-xs ${
                          selectedAddressId === addr.id ? 'border-[#003D2D] bg-[#FFF8ED]' : 'border-[#E8DFD0]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="savedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => {
                            setSelectedAddressId(addr.id);
                            applySavedAddress(addr);
                          }}
                          className="mr-2 text-[#003D2D]"
                        />
                        <span className="font-semibold">{addr.fullName}</span> - {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#746D62] mb-1 font-medium">Street Address / House No. *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="House number, building name, street"
                    className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                  />
                </div>
                <div>
                  <label className="block text-[#746D62] mb-1 font-medium">Apartment, Suite, Landmark (Optional)</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apartment or landmark"
                    className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#746D62] mb-1 font-medium">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#746D62] mb-1 font-medium">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#746D62] mb-1 font-medium">PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="6-digit PIN"
                      className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-semibold text-[#191714]">
                3. Payment Method
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'RAZORPAY' ? 'border-[#003D2D] bg-[#FFF8ED]' : 'border-[#E8DFD0] bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="mt-1 text-[#003D2D]"
                  />
                  <div className="ml-3">
                    <span className="font-semibold text-sm text-[#191714]">
                      Online Payment (Razorpay)
                    </span>
                    <p className="text-xs text-[#746D62] mt-0.5">
                      Pay securely via UPI (Google Pay, PhonePe, Paytm), Cards, Netbanking or Wallets.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'COD' ? 'border-[#003D2D] bg-[#FFF8ED]' : 'border-[#E8DFD0] bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 text-[#003D2D]"
                  />
                  <div className="ml-3">
                    <span className="font-semibold text-sm text-[#191714]">
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-xs text-[#746D62] mt-0.5">
                      Pay in cash upon doorstep delivery.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-md space-y-5 sticky top-24">
              <h2 className="font-serif text-lg font-semibold text-[#191714] pb-3 border-b border-[#E8DFD0]">
                Order Summary ({cart.items.length} items)
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex space-x-3 text-xs">
                    <div className="relative w-14 h-18 rounded overflow-hidden bg-[#FAF6F0] shrink-0 border border-[#E8DFD0]">
                      <Image
                        src={item.product.images?.[0]?.url || '/brand/rf-monogram.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-serif font-medium text-[#191714] line-clamp-1">{item.product.name}</p>
                        {item.variant && (
                          <p className="text-[#746D62]">Size: {item.variant.size} | Qty: {item.quantity}</p>
                        )}
                      </div>
                      <span className="font-semibold text-[#191714]">{formatINR(item.lineTotal)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-2 text-xs text-[#746D62] pt-4 border-t border-[#E8DFD0]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#191714] font-medium">{formatINR(cart.subtotal)}</span>
                </div>
                {cart.discountAmount > 0 && (
                  <div className="flex justify-between text-[#8B1E1E]">
                    <span>Coupon Discount</span>
                    <span>-{formatINR(cart.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-[#191714] font-medium">
                    {cart.shippingFee === 0 ? 'FREE' : formatINR(cart.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#191714] pt-3 border-t border-[#E8DFD0]">
                  <span>Total Amount</span>
                  <span>{formatINR(cart.total)}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-medium">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-md font-semibold text-xs tracking-widest uppercase shadow-md transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting
                  ? 'Processing Order...'
                  : paymentMethod === 'RAZORPAY'
                  ? `Pay ${formatINR(cart.total)} with Razorpay`
                  : `Place COD Order (${formatINR(cart.total)})`}
              </button>

              <div className="text-[11px] text-[#746D62] text-center space-y-1 pt-2">
                <p>🔒 100% Secure &amp; Verified Payments</p>
                <p>7-Day Easy Returns &amp; Exchanges</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

