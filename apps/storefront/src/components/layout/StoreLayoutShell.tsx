'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { AdminAuthProvider } from '../../context/AdminAuthContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';

export const StoreLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');

  if (isAdminRoute) {
    return (
      <AdminAuthProvider>
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#191714]">
          {children}
        </div>
      </AdminAuthProvider>
    );
  }

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
};
