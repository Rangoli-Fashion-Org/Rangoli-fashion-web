'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '@rangoli/validation';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    itemCount,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = await applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message || 'Invalid coupon');
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8DFD0] flex items-center justify-between bg-[#FAF6F0]">
            <div className="flex items-center space-x-2">
              <ShoppingBag size={20} className="text-[#003D2D]" />
              <h2 className="font-serif text-lg font-semibold text-[#191714]">
                Your Cart ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1 rounded-full text-[#746D62] hover:text-[#191714] hover:bg-white transition-colors"
              aria-label="Close cart drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Tracker */}
          {cart && cart.subtotal > 0 && (
            <div className="bg-[#FFF8ED] px-4 py-2.5 border-b border-[#E8DFD0] text-xs">
              {cart.freeShippingRemaining > 0 ? (
                <p className="text-[#746D62]">
                  Add <span className="font-bold text-[#003D2D]">{formatINR(cart.freeShippingRemaining)}</span> more to unlock <span className="font-semibold text-[#003D2D]">FREE SHIPPING</span>!
                </p>
              ) : (
                <p className="font-semibold text-[#003D2D] flex items-center">
                  🎉 Congratulations! You have unlocked FREE SHIPPING.
                </p>
              )}
              <div className="mt-1.5 w-full bg-[#E8DFD0] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#C9A34A] h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (cart.subtotal / (cart.freeShippingThreshold || 1999)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {!cart || cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#746D62]">
                <ShoppingBag size={48} className="text-[#C9A34A]/60 mb-3" />
                <p className="font-serif text-lg font-medium text-[#191714]">Your cart is empty</p>
                <p className="text-xs text-[#746D62] mt-1 max-w-xs">
                  Discover our exclusive kurtis, festive wear, and coordinate sets.
                </p>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="mt-6 px-6 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-full text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-3.5 pb-4 border-b border-[#F5EBDD] last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 rounded-md overflow-hidden bg-[#FAF6F0] shrink-0 border border-[#E8DFD0]">
                    <Image
                      src={item.product.images?.[0]?.url || '/brand/rf-monogram.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={closeDrawer}
                          className="font-serif text-sm font-medium text-[#191714] hover:text-[#003D2D] line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#746D62] hover:text-red-500 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {item.variant && (
                        <p className="text-xs text-[#746D62] mt-0.5">
                          Size: {item.variant.size} | Color: {item.variant.color}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#E8DFD0] rounded-md overflow-hidden bg-[#FAF6F0]">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-0.5 text-xs text-[#191714] hover:bg-[#E8DFD0] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-medium text-[#191714]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#191714] hover:bg-[#E8DFD0] transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-semibold text-sm text-[#191714]">
                        {formatINR(item.lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {cart && cart.items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E8DFD0] bg-[#FAF6F0] space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-3 text-[#746D62]" />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-white border border-[#E8DFD0] rounded-md py-2 pl-8 pr-3 text-xs uppercase tracking-wider text-[#191714] focus:outline-none focus:border-[#C9A34A]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003D2D] text-[#FFF8ED] rounded-md text-xs font-medium hover:bg-[#0B5940] transition-colors"
                >
                  Apply
                </button>
              </form>

              {cart.couponCode && (
                <div className="flex items-center justify-between text-xs text-[#003D2D] bg-[#E8DFD0]/40 p-2 rounded">
                  <span>Applied Coupon: <strong>{cart.couponCode}</strong> (-{formatINR(cart.discountAmount)})</span>
                  <button onClick={removeCoupon} className="text-red-500 hover:underline">
                    Remove
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-500">{couponError}</p>}

              {/* Summary Calculations */}
              <div className="space-y-1.5 text-xs text-[#746D62] pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#191714] font-medium">{formatINR(cart.subtotal)}</span>
                </div>
                {cart.discountAmount > 0 && (
                  <div className="flex justify-between text-[#8B1E1E]">
                    <span>Discount</span>
                    <span>-{formatINR(cart.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#191714] font-medium">
                    {cart.shippingFee === 0 ? 'FREE' : formatINR(cart.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#191714] pt-2 border-t border-[#E8DFD0]">
                  <span>Total</span>
                  <span>{formatINR(cart.total)}</span>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full py-3.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-md font-semibold text-xs tracking-wider uppercase shadow-md flex items-center justify-center space-x-2 transition-all duration-300"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
