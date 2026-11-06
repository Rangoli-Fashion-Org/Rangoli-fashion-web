'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchApi, getSessionId } from '../lib/api';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: any[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  wishlistItems: [],
  toggleWishlist: async () => {},
  isInWishlist: () => false,
  refreshWishlist: async () => {},
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const refreshWishlist = async () => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    const res = await fetchApi<{ id: string; items: any[] }>(`/wishlist?sessionId=${sessionId}`);
    if (res.success && res.data?.items) {
      setWishlistItems(res.data.items);
      setWishlistIds(res.data.items.map((i) => i.productId));
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, []);

  const toggleWishlist = async (productId: string) => {
    const sessionId = getSessionId();
    const res = await fetchApi<{ added: boolean }>('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId, sessionId }),
    });

    if (res.success) {
      await refreshWishlist();
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
