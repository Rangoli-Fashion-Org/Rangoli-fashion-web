'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAdminApi } from '../lib/admin-api';

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
  // Synchronous initialization from localStorage prevents flash of login screen
  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rf_admin_user');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('rf_admin_user') && !localStorage.getItem('rf_admin_token');
    }
    return true;
  });

  // Restore session immediately on client mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('rf_admin_user');
      const savedToken = localStorage.getItem('rf_admin_token');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } else if (savedToken) {
        // We have a token: restore default admin identity
        const fallbackAdmin: AdminUser = {
          id: 'admin-persisted-session',
          fullName: 'Rangoli Admin',
          role: 'SUPER_ADMIN',
          username: 'rangoliadmin',
        };
        setUser(fallbackAdmin);
        localStorage.setItem('rf_admin_user', JSON.stringify(fallbackAdmin));
      }
    } catch (e) {
      console.warn('Failed to parse cached admin session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('rf_admin_token') : null;
    if (!token) return;

    try {
      const res = await fetchAdminApi<AdminUser>('/auth/me');
      if (res.success && res.data && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(res.data.role)) {
        setUser(res.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('rf_admin_user', JSON.stringify(res.data));
        }
      }
    } catch {
      // Keep existing persistent session on network drop or offline
    }
  };

  const login = async (username: string, password: string) => {
    const cleanUsername = username.trim();
    const cleanPassword = password; // Preserve exact password

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

      if (typeof window !== 'undefined') {
        if (accessToken) {
          localStorage.setItem('rf_admin_token', accessToken);
        }
        localStorage.setItem('rf_admin_user', JSON.stringify(adminUser));
        document.cookie = 'rf_admin_active=true; path=/; max-age=3153600000';
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
      document.cookie = 'rf_admin_active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
