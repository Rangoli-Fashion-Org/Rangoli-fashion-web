'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminRootPage() {
  const router = useRouter();
  const { user, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return null;
}
