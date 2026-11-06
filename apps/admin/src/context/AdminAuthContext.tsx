'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAdminApi } from '../lib/api';

export interface AdminUser {
  id: string;
  username?: string;
  email?: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER';
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetchAdminApi<AdminUser>('/auth/me');
      if (res.success && res.data && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(res.data.role)) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetchAdminApi<{ user: AdminUser; tokens?: { accessToken: string } }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, email: username, password }),
    });

    if (res.success && res.data?.user) {
      if (res.data.tokens?.accessToken && typeof window !== 'undefined') {
        localStorage.setItem('rf_admin_token', res.data.tokens.accessToken);
      }
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: res.message || 'Invalid admin credentials' };
  };

  const logout = async () => {
    await fetchAdminApi('/auth/logout', { method: 'POST' }).catch(() => {});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rf_admin_token');
    }
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

