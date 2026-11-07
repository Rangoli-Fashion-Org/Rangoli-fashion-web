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
  // Initialize user immediately from persistent storage to prevent redirect loops on refresh
  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedToken = localStorage.getItem('rf_admin_token');
        const savedUser = localStorage.getItem('rf_admin_user');
        if (savedToken && savedUser) {
          return JSON.parse(savedUser);
        }
      } catch {
        // Ignore parse error
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedToken = localStorage.getItem('rf_admin_token');
        const savedUser = localStorage.getItem('rf_admin_user');
        if (savedToken && savedUser) {
          return false; // Instant session restore: prevents asking for login on every refresh
        }
      } catch {}
    }
    return true;
  });

  const refreshUser = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('rf_admin_token') : null;
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetchAdminApi<AdminUser>('/auth/me');
      if (res.success && res.data && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(res.data.role)) {
        setUser(res.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('rf_admin_user', JSON.stringify(res.data));
        }
      }
      // Never wipe out admin credentials on background refresh - keep permanent session
    } catch {
      // Keep existing session intact
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (username: string, password: string) => {
    const cleanUsername = username.trim();
    const cleanPassword = password; // Do not trim password to preserve exact credentials

    // Try /admin/login endpoint, fallback to /auth/admin/login
    let res = await fetchAdminApi<{ user: AdminUser; tokens?: { accessToken: string } }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username: cleanUsername, email: cleanUsername, password: cleanPassword }),
    });

    if (!res.success && (res.message?.includes('404') || res.message?.includes('Not Found'))) {
      res = await fetchAdminApi<{ user: AdminUser; tokens?: { accessToken: string } }>('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username: cleanUsername, email: cleanUsername, password: cleanPassword }),
      });
    }

    if (res.success && res.data?.user) {
      const adminUser = res.data.user;
      const accessToken = res.data.tokens?.accessToken;

      if (accessToken && typeof window !== 'undefined') {
        localStorage.setItem('rf_admin_token', accessToken);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('rf_admin_user', JSON.stringify(adminUser));
      }

      setUser(adminUser);
      setIsLoading(false);
      return { success: true };
    }

    return {
      success: false,
      message: res.message || 'Invalid admin credentials',
    };
  };

  const logout = async () => {
    await fetchAdminApi('/auth/logout', { method: 'POST' }).catch(() => {});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rf_admin_token');
      localStorage.removeItem('rf_admin_user');
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
