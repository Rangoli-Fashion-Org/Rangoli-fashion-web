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

export interface OptimisticProductInfo {
  name: string;
  slug: string;
  regularPrice: number;
  salePrice?: number | null;
  imageUrl?: string;
}

interface CartContextType {
  cart: CartData | null;
  itemCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (
    productId: string,
    variantId?: string | null,
    quantity?: number,
    productInfo?: OptimisticProductInfo,
  ) => Promise<{ success: boolean; message?: string }>;
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

  const addToCart = async (
    productId: string,
    variantId?: string | null,
    quantity = 1,
    productInfo?: OptimisticProductInfo,
  ) => {
    const previousCart = cart;

    // 0ms Optimistic UI Update: update state and open drawer immediately
    if (productInfo) {
      const price = Number(productInfo.salePrice || productInfo.regularPrice || 0);
      const lineTotal = price * quantity;

      setCart((prev) => {
        const threshold = prev?.freeShippingThreshold || 1999;
        const currentItems = prev?.items ? [...prev.items] : [];
        const existingIndex = currentItems.findIndex(
          (item) => item.productId === productId && (variantId ? item.variantId === variantId : true),
        );

        let newItems: CartItemData[];
        if (existingIndex > -1) {
          const item = currentItems[existingIndex];
          const updatedQty = item.quantity + quantity;
          currentItems[existingIndex] = {
            ...item,
            quantity: updatedQty,
            lineTotal: item.unitPrice * updatedQty,
          };
          newItems = currentItems;
        } else {
          const tempItem: CartItemData = {
            id: `temp-${Date.now()}`,
            productId,
            variantId: variantId || null,
            quantity,
            unitPrice: price,
            lineTotal,
            product: {
              id: productId,
              name: productInfo.name,
              slug: productInfo.slug,
              sku: '',
              regularPrice: productInfo.regularPrice,
              salePrice: productInfo.salePrice || null,
              images: productInfo.imageUrl ? [{ url: productInfo.imageUrl }] : [],
            },
            variant: null,
          };
          newItems = [tempItem, ...currentItems];
        }

        const newSubtotal = newItems.reduce((acc, it) => acc + it.lineTotal, 0);
        const newCount = newItems.reduce((acc, it) => acc + it.quantity, 0);
        const freeShippingRemaining = Math.max(0, threshold - newSubtotal);
        const shippingFee = newSubtotal >= threshold || newSubtotal === 0 ? 0 : 99;

        return {
          id: prev?.id || 'temp-cart',
          items: newItems,
          itemCount: newCount,
          subtotal: newSubtotal,
          discountAmount: prev?.discountAmount || 0,
          shippingFee,
          freeShippingThreshold: threshold,
          freeShippingRemaining,
          total: Math.max(0, newSubtotal + shippingFee - (prev?.discountAmount || 0)),
          couponCode: prev?.couponCode || null,
        };
      });

      setIsDrawerOpen(true);
    }

    const sessionId = getSessionId();
    try {
      const res = await fetchApi<CartData>('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId, variantId, quantity, sessionId }),
      });

      if (res.success && res.data) {
        setCart(res.data);
        setIsDrawerOpen(true);
        return { success: true };
      } else {
        if (productInfo) setCart(previousCart);
        return { success: false, message: res.message || 'Could not add to cart' };
      }
    } catch (err: any) {
      if (productInfo) setCart(previousCart);
      return { success: false, message: err?.message || 'Network error' };
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (itemId.startsWith('temp-')) return;
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
    if (itemId.startsWith('temp-')) {
      setCart((prev) => {
        if (!prev) return null;
        const newItems = prev.items.filter((it) => it.id !== itemId);
        const newSubtotal = newItems.reduce((acc, it) => acc + it.lineTotal, 0);
        const newCount = newItems.reduce((acc, it) => acc + it.quantity, 0);
        return {
          ...prev,
          items: newItems,
          itemCount: newCount,
          subtotal: newSubtotal,
          freeShippingRemaining: Math.max(0, prev.freeShippingThreshold - newSubtotal),
          total: newSubtotal,
        };
      });
      return;
    }

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

