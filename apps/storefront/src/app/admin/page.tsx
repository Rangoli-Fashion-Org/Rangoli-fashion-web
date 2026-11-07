'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminRootPage() {
  const router = useRouter();
  const { user, isLoading } = useAdminAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const hasLocal = localStorage.getItem('rf_admin_user') || localStorage.getItem('rf_admin_token');
      if (user || hasLocal) {
        router.replace('/admin/dashboard');
        return;
      }

      if (!isLoading && !user && !hasLocal) {
        router.replace('/admin/login');
      }
    }
  }, [isMounted, user, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#002D21] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#C9A34A] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
