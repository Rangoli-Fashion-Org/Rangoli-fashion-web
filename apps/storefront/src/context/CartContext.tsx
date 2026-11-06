'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchApi, getSessionId } from '../lib/api';

export interface CartItemData {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    regularPrice: number;
    salePrice?: number | null;
    images?: Array<{ url: string; altText?: string }>;
  };
  variant?: {
    id: string;
    sku: string;
    size: string;
    color: string;
    stockQuantity: number;
  } | null;
}

export interface CartData {
  id: string;
  items: CartItemData[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  total: number;
  couponCode?: string | null;
}

interface CartContextType {
  cart: CartData | null;
  itemCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (productId: string, variantId?: string | null, quantity?: number) => Promise<{ success: boolean; message?: string }>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message?: string }>;
  removeCoupon: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  itemCount: 0,
  isDrawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  addToCart: async () => ({ success: false }),
  updateQuantity: async () => {},
  removeItem: async () => {},
  applyCoupon: async () => ({ success: false }),
  removeCoupon: async () => {},
  refreshCart: async () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const refreshCart = async () => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    const res = await fetchApi<CartData>(`/cart?sessionId=${sessionId}`);
    if (res.success && res.data) {
      setCart(res.data);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: string, variantId?: string | null, quantity = 1) => {
    const sessionId = getSessionId();
    const res = await fetchApi<CartData>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, variantId, quantity, sessionId }),
    });

    if (res.success && res.data) {
      setCart(res.data);
      setIsDrawerOpen(true);
      return { success: true };
    }
    return { success: false, message: res.message || 'Could not add to cart' };
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const sessionId = getSessionId();
    const res = await fetchApi<CartData>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity, sessionId }),
    });

    if (res.success && res.data) {
      setCart(res.data);
    }
  };

  const removeItem = async (itemId: string) => {
    const sessionId = getSessionId();
    const res = await fetchApi<CartData>(`/cart/items/${itemId}?sessionId=${sessionId}`, {
      method: 'DELETE',
    });

    if (res.success && res.data) {
      setCart(res.data);
    }
  };

  const applyCoupon = async (code: string) => {
    const sessionId = getSessionId();
    const res = await fetchApi<CartData>('/cart/coupon', {
      method: 'POST',
      body: JSON.stringify({ code, sessionId }),
    });

    if (res.success && res.data) {
      setCart(res.data);
      return { success: true };
    }
    return { success: false, message: res.message || 'Invalid coupon' };
  };

  const removeCoupon = async () => {
    const sessionId = getSessionId();
    const res = await fetchApi<CartData>(`/cart/coupon?sessionId=${sessionId}`, {
      method: 'DELETE',
    });

    if (res.success && res.data) {
      setCart(res.data);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: cart?.itemCount || 0,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
