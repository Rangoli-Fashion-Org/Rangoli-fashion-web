'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  Truck,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { ProductCard } from '../../components/product/ProductCard';
import { fetchApi } from '../../lib/api';
import { formatINR } from '@rangoli/validation';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout, refreshUser } = useAuth();
  const { wishlistItems } = useWishlist();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  // Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhoneNumber, setAddrPhoneNumber] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrApartment, setAddrApartment] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('Rajasthan');
  const [addrPostalCode, setAddrPostalCode] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/account/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setProfileName(user.fullName || '');
      setProfilePhone(user.phoneNumber || '');

      // Fetch Orders
      fetchApi<any[]>('/orders/my-orders').then((res) => {
        if (res.success && res.data) {
          setOrders(Array.isArray(res.data) ? res.data : []);
        }
      });

      // Fetch Addresses
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    setIsAddressLoading(true);
    const res = await fetchApi<any[]>('/users/addresses');
    if (res.success && res.data) {
      setAddresses(Array.isArray(res.data) ? res.data : []);
    }
    setIsAddressLoading(false);
  };

  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setAddrFullName(user?.fullName || '');
    setAddrPhoneNumber(user?.phoneNumber || '');
    setAddrStreet('');
    setAddrApartment('');
    setAddrCity('');
    setAddrState('Rajasthan');
    setAddrPostalCode('');
    setAddrIsDefault(addresses.length === 0);
    setAddressError('');
    setAddressSuccess('');
    setIsAddingAddress(true);
  };

  const openEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddrFullName(addr.fullName);
    setAddrPhoneNumber(addr.phoneNumber);
    setAddrStreet(addr.street);
    setAddrApartment(addr.apartment || '');
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPostalCode(addr.postalCode);
    setAddrIsDefault(addr.isDefaultShipping);
    setAddressError('');
    setAddressSuccess('');
    setIsAddingAddress(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');
    setAddressSuccess('');

    // Validations
    if (!addrFullName.trim()) {
      setAddressError('Recipient full name is required');
      return;
    }

    const cleanPhone = addrPhoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setAddressError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!addrStreet.trim()) {
      setAddressError('Street address / House details are required');
      return;
    }

    if (!addrCity.trim()) {
      setAddressError('City is required');
      return;
    }

    const cleanPin = addrPostalCode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setAddressError('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    setIsSavingAddress(true);

    const payload = {
      fullName: addrFullName.trim(),
      phoneNumber: cleanPhone,
      street: addrStreet.trim(),
      apartment: addrApartment.trim() || undefined,
      city: addrCity.trim(),
      state: addrState,
      postalCode: cleanPin,
      country: 'India',
      isDefaultShipping: addrIsDefault || addresses.length === 0,
      isDefaultBilling: addrIsDefault || addresses.length === 0,
    };

    let res;
    if (editingAddressId) {
      res = await fetchApi<any>(`/users/addresses/${editingAddressId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetchApi<any>('/users/addresses', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    setIsSavingAddress(false);

    if (res.success) {
      setAddressSuccess(
        editingAddressId
          ? 'Address updated successfully!'
          : 'New delivery address saved successfully!'
      );
      setIsAddingAddress(false);
      setEditingAddressId(null);
      await fetchAddresses();
      setTimeout(() => setAddressSuccess(''), 4000);
    } else {
      setAddressError(
        res.message || 'Unable to save address. Please verify your details.'
      );
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to remove this delivery address?')) return;
    const res = await fetchApi(`/users/addresses/${id}`, { method: 'DELETE' });
    if (res.success) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      setAddressSuccess('Address removed.');
      setTimeout(() => setAddressSuccess(''), 3000);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    const res = await fetchApi(`/users/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isDefaultShipping: true, isDefaultBilling: true }),
    });
    if (res.success) {
      await fetchAddresses();
      setAddressSuccess('Default shipping address updated.');
      setTimeout(() => setAddressSuccess(''), 3000);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileName.trim()) {
      setProfileError('Full name cannot be empty');
      return;
    }

    setIsSavingProfile(true);

    const res = await fetchApi('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({
        fullName: profileName.trim(),
        phoneNumber: profilePhone.trim() || undefined,
      }),
    });

    setIsSavingProfile(false);

    if (res.success) {
      setProfileSuccess('Profile details saved successfully!');
      await refreshUser();
      setTimeout(() => setProfileSuccess(''), 4000);
    } else {
      setProfileError(res.message || 'Unable to update profile');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="bg-[#FAF6F0] min-h-screen py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#003D2D] border-t-transparent rounded-full animate-spin" />
        <p className="font-serif text-sm text-[#746D62] tracking-wide">
          Loading your Rangoli patron portal...
        </p>
      </div>
    );
  }

  const userInitials =
    user.fullName
      ?.split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'RF';

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE0] py-8 sm:py-12 md:py-14">
      {/* Ambient Radial Silk Glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(201, 163, 74, 0.08) 0%, transparent 45%),
            radial-gradient(circle at 90% 70%, rgba(0, 61, 45, 0.06) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Royal Patron Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#003D2D] via-[#002B20] to-[#001F17] text-[#FFF8ED] p-6 sm:p-8 md:p-10 shadow-xl border border-[#C9A34A]/30">
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 80% 20%, rgba(229, 193, 88, 0.3) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Monogram Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#E5C158] to-[#9E7728] p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full rounded-full bg-[#003D2D] flex items-center justify-center text-[#E5C158] font-serif text-xl sm:text-2xl font-bold tracking-wider">
                  {userInitials}
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#C9A34A]/25 border border-[#C9A34A]/50 text-[#E5C158] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles size={11} className="text-[#E5C158]" />
                  <span>Rangoli Royal Patron</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-[#FFF8ED] tracking-tight">
                  {user.fullName}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#E8DFD0]/80">
                  <span className="flex items-center space-x-1">
                    <Mail size={12} className="text-[#C9A34A]" />
                    <span>{user.email}</span>
                  </span>
                  {user.phoneNumber && (
                    <span className="flex items-center space-x-1">
                      <Phone size={12} className="text-[#C9A34A]" />
                      <span>+91 {user.phoneNumber}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
              <button
                onClick={handleLogout}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-red-300/40 bg-red-950/20 text-red-200 hover:bg-red-900/40 text-xs font-semibold tracking-wide transition-all shadow-sm"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-[#E8DFD0]/70 uppercase tracking-widest block font-medium">Orders Placed</span>
              <span className="font-serif text-lg sm:text-xl font-bold text-[#E5C158]">{orders.length}</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-[#E8DFD0]/70 uppercase tracking-widest block font-medium">Saved Addresses</span>
              <span className="font-serif text-lg sm:text-xl font-bold text-[#E5C158]">{addresses.length}</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-[#E8DFD0]/70 uppercase tracking-widest block font-medium">Wishlist Items</span>
              <span className="font-serif text-lg sm:text-xl font-bold text-[#E5C158]">{wishlistItems.length}</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-[#E8DFD0]/70 uppercase tracking-widest block font-medium">Member Status</span>
              <span className="font-serif text-sm sm:text-base font-bold text-[#E5C158]">Active Patron</span>
            </div>
          </div>
        </div>

        {/* Global Notifications */}
        {addressSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-medium flex items-center space-x-2 animate-fadeIn shadow-xs">
            <CheckCircle size={16} className="text-emerald-600 shrink-0" />
            <span>{addressSuccess}</span>
          </div>
        )}

        {/* Main Grid: Sidebar Navigation + Tab Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8DFD0] p-3 shadow-md space-y-1.5 text-xs font-medium">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[#003D2D] to-[#0A5640] text-white font-semibold shadow-sm'
                    : 'text-[#191714] hover:bg-[#FAF6F0]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Package size={16} className={activeTab === 'orders' ? 'text-[#E5C158]' : 'text-[#746D62]'} />
                  <span>My Orders</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'orders' ? 'bg-white/20 text-[#FFF8ED]' : 'bg-[#FAF6F0] text-[#746D62]'
                }`}>
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'addresses'
                    ? 'bg-gradient-to-r from-[#003D2D] to-[#0A5640] text-white font-semibold shadow-sm'
                    : 'text-[#191714] hover:bg-[#FAF6F0]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className={activeTab === 'addresses' ? 'text-[#E5C158]' : 'text-[#746D62]'} />
                  <span>Delivery Addresses</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'addresses' ? 'bg-white/20 text-[#FFF8ED]' : 'bg-[#FAF6F0] text-[#746D62]'
                }`}>
                  {addresses.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'wishlist'
                    ? 'bg-gradient-to-r from-[#003D2D] to-[#0A5640] text-white font-semibold shadow-sm'
                    : 'text-[#191714] hover:bg-[#FAF6F0]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Heart size={16} className={activeTab === 'wishlist' ? 'text-[#E5C158]' : 'text-[#746D62]'} />
                  <span>My Wishlist</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'wishlist' ? 'bg-white/20 text-[#FFF8ED]' : 'bg-[#FAF6F0] text-[#746D62]'
                }`}>
                  {wishlistItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-[#003D2D] to-[#0A5640] text-white font-semibold shadow-sm'
                    : 'text-[#191714] hover:bg-[#FAF6F0]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <User size={16} className={activeTab === 'profile' ? 'text-[#E5C158]' : 'text-[#746D62]'} />
                  <span>Account Details</span>
                </div>
                <ChevronRight size={14} className={activeTab === 'profile' ? 'text-[#E5C158]' : 'text-[#A49B8D]'} />
              </button>
            </div>
          </div>

          {/* Tab Contents Area */}
          <div className="lg:col-span-9 space-y-6">

            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#191714]">
                      Order History
                    </h2>
                    <p className="text-xs text-[#746D62]">
                      Review current shipments, invoices, and past heirloom purchases.
                    </p>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white/95 rounded-3xl border border-[#E8DFD0] p-10 sm:p-14 text-center shadow-md space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#FAF3E5] border border-[#C9A34A]/40 mx-auto flex items-center justify-center text-[#C9A34A]">
                      <Package size={28} />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#191714]">
                      No Orders Placed Yet
                    </h3>
                    <p className="text-xs text-[#746D62] max-w-sm mx-auto">
                      Explore our handpicked festive collections, Banarasi silks, and designer suits to begin your journey.
                    </p>
                    <Link
                      href="/shop"
                      className="inline-flex items-center space-x-2 mt-4 px-6 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0A5640] rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
                    >
                      <span>Explore Collections</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white/95 rounded-2xl border border-[#E8DFD0] p-5 sm:p-6 shadow-sm space-y-4 hover:border-[#C9A34A]/60 transition-colors"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-[#F0E6D8] gap-2.5 text-xs">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-[#003D2D]">
                              #{ord.orderNumber}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF3E5] text-[#7A520C] border border-[#C9A34A]/40">
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#746D62] mt-0.5">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/track-order?orderNumber=${ord.orderNumber}`}
                            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#003D2D] text-white hover:bg-[#0A5640] text-xs font-semibold tracking-wide transition-colors"
                          >
                            <Truck size={12} />
                            <span>Track Shipment</span>
                          </Link>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="divide-y divide-[#F5EBDD] text-xs">
                        {ord.items?.map((item: any) => (
                          <div key={item.id} className="py-3 flex justify-between items-center gap-3">
                            <div>
                              <p className="font-serif font-medium text-sm text-[#191714]">
                                {item.productName}
                              </p>
                              <p className="text-[11px] text-[#746D62] mt-0.5">
                                {item.variantDescription || item.sku} × {item.quantity}
                              </p>
                            </div>
                            <span className="font-semibold text-[#191714]">
                              {formatINR(item.totalPrice)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary Footer */}
                      <div className="pt-3 border-t border-[#F0E6D8] flex justify-between items-center text-xs">
                        <span className="text-[#746D62]">
                          Payment: <strong className="text-[#191714] font-medium">{ord.paymentMethod}</strong>
                        </span>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-[#746D62]">Total:</span>
                          <span className="font-bold text-base text-[#003D2D]">
                            {formatINR(ord.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#191714]">
                      Saved Delivery Addresses
                    </h2>
                    <p className="text-xs text-[#746D62]">
                      Manage addresses for fast, one-click checkout across India.
                    </p>
                  </div>

                  {!isAddingAddress && (
                    <button
                      onClick={openAddAddressModal}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#003D2D] hover:bg-[#0A5640] text-[#FFF8ED] rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm transition-colors self-start sm:self-auto"
                    >
                      <Plus size={14} />
                      <span>Add New Address</span>
                    </button>
                  )}
                </div>

                {/* Add / Edit Address Form */}
                {isAddingAddress && (
                  <div className="bg-white/95 rounded-2xl border-2 border-[#C9A34A]/50 p-6 sm:p-8 shadow-lg space-y-5 animate-fadeIn">
                    <div className="flex justify-between items-center pb-3 border-b border-[#F0E6D8]">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A520C]">
                          ✦ {editingAddressId ? 'Update Address' : 'New Delivery Destination'} ✦
                        </span>
                        <h3 className="font-serif text-lg font-semibold text-[#191714]">
                          {editingAddressId ? 'Edit Address' : 'Add Delivery Address'}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="text-xs text-[#746D62] hover:text-[#191714] underline font-medium"
                      >
                        Cancel
                      </button>
                    </div>

                    {addressError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center space-x-2">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{addressError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#191714] font-medium mb-1.5">
                            Recipient Full Name <span className="text-[#C9A34A]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={addrFullName}
                            onChange={(e) => setAddrFullName(e.target.value)}
                            placeholder="Recipient Full Name"
                            className="w-full px-3.5 py-2.5 border border-[#E8DFD0] rounded-xl text-[#191714] focus:outline-none focus:border-[#003D2D] focus:ring-1 focus:ring-[#003D2D] bg-[#FCFAF6]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#191714] font-medium mb-1.5">
                            Mobile Number (10 digits) <span className="text-[#C9A34A]">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-[#746D62]">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              value={addrPhoneNumber}
                              onChange={(e) => setAddrPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                              placeholder="9876543210"
                              className="w-full pl-12 pr-3.5 py-2.5 border border-[#E8DFD0] rounded-xl text-[#191714] focus:outline-none focus:border-[#003D2D] focus:ring-1 focus:ring-[#003D2D] bg-[#FCFAF6]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#191714] font-medium mb-1.5">
                            House No. / Flat / Building / Apartment <span className="text-[#746D62] text-[10px] font-normal">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={addrApartment}
                            onChange={(e) => setAddrApartment(e.target.value)}
                            placeholder="e.g. Apt 402, Heritage Heights"
                            className="w-full px-3.5 py-2.5 border border-[#E8DFD0] rounded-xl text-[#191714] focus:outline-none focus:border-[#003D2D] focus:ring-1 focus:ring-[#003D2D] bg-[#FCFAF6]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#191714] font-medium mb-1.5">
                            Street Address / Road / Area <span className="text-[#C9A34A]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={addrStreet}
                            onChange={(e) => setAddrStreet(e.target.value)}
                            placeholder="e.g. 14 MG Road, Civil Lines"
                            className="w-full px-3.5 py-2.5 border border-[#E8DFD0] rounded-xl text-[#191714] focus:outline-none focus:border-[#003D2D] focus:ring-1 focus:ring-[#003D2D] bg-[#FCFAF6]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[#191714] font-medium mb-1.5">
                            City / District <span className="text-[#C9A34A]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={addrCity}
                            onChange={(e) => setAddrCity(e.target.value)}
                            placeholder="e.g. Jaipur"
                            className="w-full px-3.5 py-2.5 border border-[#E8DFD0] rounded-xl text-[#191714] focus:outline-none focus:border-[#003D2D] focus:ring-1 focus:ring-[#003D2D] bg-[#FCFAF6]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#191714] font-medium mb-1.5">
                            State <span className="text-[#C9A34A]">*</span>
                          </label>
                          <select
                            value={addrState}
                            onChange={(e) => setAddrState(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-[#E8DFD0] rounded-xl text-[#191714] focus:outline-none focus:border-[#003D2D] focus:ring-1 focus:ring-[#003D2D] bg-[#FCFAF6]"
                          >
                            {INDIAN_STATES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[#191714] font-medium mb-1.5">
                            PIN Code <span className="text-[#C9A34A]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={addrPostalCode}
                            onChange={(e) => setAddrPostalCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="302001"
                            className="w-full px-3.5 py-2.5 border border-[#E8DFD0] rounded-xl text-[#191714] focus:outline-none focus:border-[#003D2D] focus:ring-1 focus:ring-[#003D2D] bg-[#FCFAF6]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="checkbox"
                          id="isDefaultShipping"
                          checked={addrIsDefault}
                          onChange={(e) => setAddrIsDefault(e.target.checked)}
                          className="w-4 h-4 text-[#003D2D] border-[#E8DFD0] rounded focus:ring-[#003D2D]"
                        />
                        <label htmlFor="isDefaultShipping" className="text-[#191714] cursor-pointer">
                          Set as my default delivery address
                        </label>
                      </div>

                      <div className="flex items-center space-x-3 pt-3">
                        <button
                          type="submit"
                          disabled={isSavingAddress}
                          className="px-6 py-2.5 bg-[#003D2D] hover:bg-[#0A5640] text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-sm"
                        >
                          {isSavingAddress ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Saving Address...</span>
                            </>
                          ) : (
                            <span>{editingAddressId ? 'Update Address' : 'Save Address'}</span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(false)}
                          className="px-4 py-2.5 border border-[#E8DFD0] text-[#746D62] hover:text-[#191714] rounded-xl text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Address Cards Grid */}
                {isAddressLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-44 bg-white/60 animate-pulse rounded-2xl border border-[#E8DFD0]" />
                    ))}
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="bg-white/95 rounded-3xl border border-[#E8DFD0] p-10 text-center shadow-md space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#FAF3E5] border border-[#C9A34A]/40 mx-auto flex items-center justify-center text-[#C9A34A]">
                      <MapPin size={28} />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#191714]">
                      No Addresses Saved
                    </h3>
                    <p className="text-xs text-[#746D62] max-w-sm mx-auto">
                      Add your home or festive gifting addresses for seamless delivery and faster checkout.
                    </p>
                    <button
                      onClick={openAddAddressModal}
                      className="mt-3 px-6 py-2.5 bg-[#003D2D] text-[#FFF8ED] rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm"
                    >
                      Add First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`bg-white/95 rounded-2xl border p-5 shadow-sm space-y-3 relative transition-all ${
                          addr.isDefaultShipping
                            ? 'border-[#C9A34A] ring-2 ring-[#C9A34A]/20 bg-[#FFFDF9]'
                            : 'border-[#E8DFD0] hover:border-[#C9A34A]/50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="font-serif font-bold text-base text-[#191714]">
                                {addr.fullName}
                              </span>
                              {addr.isDefaultShipping && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#FAF3E5] text-[#7A520C] border border-[#C9A34A]/40">
                                  Default
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#746D62] flex items-center space-x-1">
                              <Phone size={12} className="text-[#C9A34A]" />
                              <span>+91 {addr.phoneNumber}</span>
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-1 text-[#746D62]">
                            <button
                              onClick={() => openEditAddress(addr)}
                              className="p-1.5 hover:text-[#003D2D] hover:bg-[#FAF6F0] rounded-lg transition-colors"
                              title="Edit address"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete address"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-[#746D62] leading-relaxed pt-1 border-t border-[#F0E6D8]">
                          {addr.apartment && <p>{addr.apartment}</p>}
                          <p>{addr.street}</p>
                          <p className="font-medium text-[#191714]">
                            {addr.city}, {addr.state} – {addr.postalCode}
                          </p>
                          <p className="text-[11px] text-[#A49B8D] mt-0.5">{addr.country || 'India'}</p>
                        </div>

                        {!addr.isDefaultShipping && (
                          <div className="pt-2">
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[11px] font-semibold text-[#003D2D] hover:underline flex items-center space-x-1"
                            >
                              <Check size={12} />
                              <span>Make Default Address</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#191714]">
                      My Wishlist
                    </h2>
                    <p className="text-xs text-[#746D62]">
                      Your curated treasure trove of favored sarees, lehengas, and couture edits.
                    </p>
                  </div>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="bg-white/95 rounded-3xl border border-[#E8DFD0] p-10 sm:p-14 text-center shadow-md space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#FAF3E5] border border-[#C9A34A]/40 mx-auto flex items-center justify-center text-[#C9A34A]">
                      <Heart size={28} />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#191714]">
                      Your Wishlist is Empty
                    </h3>
                    <p className="text-xs text-[#746D62] max-w-sm mx-auto">
                      Click the heart icon on any product in our collections to save your favorite silhouettes for later.
                    </p>
                    <Link
                      href="/shop"
                      className="inline-flex items-center space-x-2 mt-4 px-6 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0A5640] rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
                    >
                      <span>Discover Collections</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
                    {wishlistItems.map((item) => (
                      <ProductCard
                        key={item.id}
                        id={item.product.id}
                        name={item.product.name}
                        slug={item.product.slug}
                        regularPrice={item.product.regularPrice}
                        salePrice={item.product.salePrice}
                        discountPercentage={item.product.discountPercentage}
                        images={item.product.images}
                        averageRating={item.product.averageRating}
                        reviewCount={item.product.reviewCount}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PROFILE & PERSONAL DETAILS */}
            {activeTab === 'profile' && (
              <div className="bg-white/95 rounded-3xl border border-[#E8DFD0] p-6 sm:p-8 md:p-10 shadow-md space-y-6">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#FAF3E5] border border-[#C9A34A]/40 text-[#7A520C] text-[9px] font-bold uppercase tracking-widest mb-1.5">
                    <span>✦</span>
                    <span>Patron Credentials</span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#191714]">
                    Personal Information
                  </h2>
                  <p className="text-xs text-[#746D62]">
                    Update your account details and mobile number for real-time delivery notifications.
                  </p>
                </div>

                {profileSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-medium flex items-center space-x-2 animate-fadeIn">
                    <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                {profileError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center space-x-2 animate-fadeIn">
                    <AlertCircle size={15} className="text-red-600 shrink-0" />
                    <span>{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg text-xs">
                  <div>
                    <label className="block text-[#191714] font-medium mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#746D62]">
                        <User size={15} />
                      </div>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 border border-[#E8DFD0] rounded-xl text-[#191714] focus:outline-none focus:border-[#003D2D] focus:ring-1 focus:ring-[#003D2D] bg-[#FCFAF6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#191714] font-medium mb-1.5">
                      Email Address <span className="text-[#746D62] text-[10px] font-normal">(Registered email ID)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#746D62]">
                        <Mail size={15} />
                      </div>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full pl-10 pr-3.5 py-2.5 border border-[#E8DFD0] rounded-xl text-[#746D62] bg-[#FAF6F0] cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#191714] font-medium mb-1.5">
                      Mobile Number (10 digits)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#746D62]">
                        <Phone size={15} />
                        <span className="ml-1.5 text-xs font-semibold text-[#191714] border-r border-[#E8DFD0] pr-2">+91</span>
                      </div>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210"
                        className="w-full pl-20 pr-3.5 py-2.5 border border-[#E8DFD0] rounded-xl text-[#191714] focus:outline-none focus:border-[#003D2D] focus:ring-1 focus:ring-[#003D2D] bg-[#FCFAF6]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-6 py-2.5 bg-[#003D2D] hover:bg-[#0A5640] text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-sm"
                    >
                      {isSavingProfile ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Account Security Info Card */}
                <div className="pt-6 border-t border-[#F0E6D8] max-w-lg">
                  <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-[#E8DFD0] flex items-start space-x-3 text-xs">
                    <ShieldCheck size={20} className="text-[#C9A34A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#191714]">Data Privacy & Security</h4>
                      <p className="text-[11px] text-[#746D62] mt-0.5 leading-relaxed">
                        Your payment details and shipping records are stored securely with strict end-to-end encryption.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
