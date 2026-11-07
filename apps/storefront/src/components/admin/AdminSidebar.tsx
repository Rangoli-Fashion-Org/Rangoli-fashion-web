'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shirt,
  FolderTree,
  Sparkles,
  Boxes,
  ShoppingCart,
  Users,
  TicketPercent,
  Star,
  Image as ImageIcon,
  Sliders,
  FileText,
  Share2,
  MapPin,
  Mail,
  Truck,
  Settings,
  ShieldAlert,
  BarChart3,
  Award,
} from 'lucide-react';

export const AdminSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();

  const menuSections = [
    {
      group: 'Core Commerce',
      items: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
        { label: 'Products', href: '/admin/dashboard/products', icon: <Shirt size={18} /> },
        { label: 'Categories', href: '/admin/dashboard/categories', icon: <FolderTree size={18} /> },
        { label: 'Collections', href: '/admin/dashboard/collections', icon: <Sparkles size={18} /> },
        { label: 'Brands', href: '/admin/dashboard/brands', icon: <Award size={18} /> },
        { label: 'Inventory', href: '/admin/dashboard/inventory', icon: <Boxes size={18} /> },
        { label: 'Orders', href: '/admin/dashboard/orders', icon: <ShoppingCart size={18} /> },
        { label: 'Customers', href: '/admin/dashboard/customers', icon: <Users size={18} /> },
        { label: 'Coupons', href: '/admin/dashboard/coupons', icon: <TicketPercent size={18} /> },
        { label: 'Reviews', href: '/admin/dashboard/reviews', icon: <Star size={18} /> },
      ],
    },
    {
      group: 'Storefront CMS',
      items: [
        { label: 'Hero Banners', href: '/admin/dashboard/banners', icon: <ImageIcon size={18} /> },
        { label: 'Homepage Sections', href: '/admin/dashboard/homepage-cms', icon: <Sliders size={18} /> },
        { label: 'About Us', href: '/admin/dashboard/about-us', icon: <FileText size={18} /> },
        { label: 'Social Links', href: '/admin/dashboard/social-links', icon: <Share2 size={18} /> },
        { label: 'Contact & Address', href: '/admin/dashboard/contact', icon: <MapPin size={18} /> },
        { label: 'Newsletter Subscribers', href: '/admin/dashboard/subscribers', icon: <Mail size={18} /> },
      ],
    },
    {
      group: 'Administration & System',
      items: [
        { label: 'Shipping Settings', href: '/admin/dashboard/shipping', icon: <Truck size={18} /> },
        { label: 'Store Settings', href: '/admin/dashboard/settings', icon: <Settings size={18} /> },
        { label: 'Admin Users', href: '/admin/dashboard/users', icon: <ShieldAlert size={18} /> },
        { label: 'Reports & Analytics', href: '/admin/dashboard/reports', icon: <BarChart3 size={18} /> },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#002D21] text-[#FFF8ED] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-[#0B5940]`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#0B5940] flex items-center space-x-3 bg-[#00251B]">
          <div className="w-8 h-8 rounded bg-white/10 p-0.5 border border-[#C9A34A]/50 shrink-0">
            <Image
              src="/brand/rf-monogram.jpg"
              alt="Rangoli Admin"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-serif text-base font-bold tracking-widest text-white block leading-tight">
              RANGOLI
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#C9A34A] uppercase font-semibold">
              ADMIN CONSOLE
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {menuSections.map((sec) => (
            <div key={sec.group}>
              <h4 className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#C9A34A]/80 mb-2">
                {sec.group}
              </h4>
              <div className="space-y-0.5 text-xs font-medium">
                {sec.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? 'bg-[#003D2D] text-[#DFC37A] font-semibold border-l-2 border-[#C9A34A]'
                          : 'text-[#FFF8ED]/80 hover:bg-[#003D2D]/60 hover:text-white'
                      }`}
                    >
                      <span className={isActive ? 'text-[#C9A34A]' : 'text-[#FFF8ED]/70'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Storefront Link */}
        <div className="p-4 border-t border-[#0B5940] bg-[#00251B] text-xs">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-[#C9A34A] hover:underline"
          >
            <span>Visit Live Storefront</span>
            <span>↗</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
