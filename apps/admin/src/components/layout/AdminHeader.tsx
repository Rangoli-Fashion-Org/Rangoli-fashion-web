'use client';

import React from 'react';
import { Menu, LogOut, User, Bell } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useRouter } from 'next/navigation';

export const AdminHeader: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const router = useRouter();
  const { user, logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E8DFD0] px-4 lg:px-8 py-3 flex items-center justify-between shadow-2xs">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 text-[#191714] hover:bg-[#FAF6F0] rounded"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#003D2D]">
          Rangoli Fashions Management Portal
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#003D2D] text-[#FFF8ED] flex items-center justify-center font-bold text-xs uppercase">
              {user.fullName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="font-semibold text-[#191714] block leading-tight">{user.fullName}</span>
              <span className="text-[10px] text-[#C9A34A] font-bold tracking-wider">{user.role}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="p-1.5 text-[#746D62] hover:text-red-600 rounded hover:bg-red-50 transition-colors"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

