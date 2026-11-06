'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { ProductCard } from '../../components/product/ProductCard';
import { fetchApi } from '../../lib/api';
import { formatINR } from '@rangoli/validation';

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout, refreshUser } = useAuth();
  const { wishlistItems } = useWishlist();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // New Address Form
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Rajasthan');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/account/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchApi<any[]>('/orders/my-orders').then((res) => {
        if (res.success && res.data) setOrders(res.data);
      });
      fetchApi<any[]>('/users/addresses').then((res) => {
        if (res.success && res.data) setAddresses(res.data);
      });
    }
  }, [user]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchApi<any>('/users/addresses', {
      method: 'POST',
      body: JSON.stringify({
        fullName,
        phoneNumber,
        street,
        apartment,
        city,
        state,
        postalCode,
        country: 'India',
        isDefaultShipping: addresses.length === 0,
      }),
    });

    if (res.success) {
      setIsAddingAddress(false);
      setFullName('');
      setPhoneNumber('');
      setStreet('');
      setApartment('');
      setCity('');
      setPostalCode('');
      const updated = await fetchApi<any[]>('/users/addresses');
      if (updated.success) setAddresses(updated.data);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    await fetchApi(`/users/addresses/${id}`, { method: 'DELETE' });
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="bg-[#FAF6F0] min-h-screen py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-[#003D2D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-[#E8DFD0] mb-8 gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#191714]">
              Hello, {user.fullName}
            </h1>
            <p className="text-xs text-[#746D62] mt-1">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-full text-xs font-semibold transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-[#E8DFD0] p-3 shadow-xs space-y-1 text-xs font-medium">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'orders' ? 'bg-[#003D2D] text-white font-semibold' : 'text-[#191714] hover:bg-[#FAF6F0]'
                }`}
              >
                <Package size={16} />
                <span>My Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'addresses' ? 'bg-[#003D2D] text-white font-semibold' : 'text-[#191714] hover:bg-[#FAF6F0]'
                }`}
              >
                <MapPin size={16} />
                <span>Saved Addresses ({addresses.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'wishlist' ? 'bg-[#003D2D] text-white font-semibold' : 'text-[#191714] hover:bg-[#FAF6F0]'
                }`}
              >
                <Heart size={16} />
                <span>Wishlist ({wishlistItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'profile' ? 'bg-[#003D2D] text-white font-semibold' : 'text-[#191714] hover:bg-[#FAF6F0]'
                }`}
              >
                <User size={16} />
                <span>Account Profile</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-9">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold text-[#191714]">Order History</h2>
                {orders.length === 0 ? (
                  <div className="bg-white p-10 rounded-xl border border-[#E8DFD0] text-center">
                    <Package size={40} className="mx-auto text-[#C9A34A] mb-3" />
                    <p className="font-serif text-base font-semibold text-[#191714]">No orders placed yet</p>
                    <p className="text-xs text-[#746D62] mt-1">When you place an order, it will appear here with live tracking.</p>
                    <Link href="/shop" className="mt-5 inline-block px-6 py-2.5 bg-[#003D2D] text-white rounded-full text-xs font-semibold uppercase tracking-wider">
                      Explore Catalogue
                    </Link>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div key={ord.id} className="bg-white p-5 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-[#E8DFD0] gap-2 text-xs">
                        <div>
                          <span className="text-[#746D62]">Order Number: </span>
                          <span className="font-bold text-[#003D2D]">{ord.orderNumber}</span>
                          <span className="text-[#746D62] ml-2">
                            ({new Date(ord.createdAt).toLocaleDateString()})
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-2.5 py-1 bg-[#FFF8ED] border border-[#C9A34A] text-[#003D2D] rounded-full font-semibold">
                            {ord.status}
                          </span>
                          <Link
                            href={`/track-order?orderNumber=${ord.orderNumber}`}
                            className="text-[#003D2D] hover:underline font-semibold"
                          >
                            Track
                          </Link>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-[#F5EBDD] text-xs">
                        {ord.items?.map((item: any) => (
                          <div key={item.id} className="py-2.5 flex justify-between items-center">
                            <div>
                              <p className="font-serif font-medium text-[#191714]">{item.productName}</p>
                              <p className="text-[#746D62]">{item.variantDescription || item.sku} × {item.quantity}</p>
                            </div>
                            <span className="font-semibold text-[#191714]">{formatINR(item.totalPrice)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-[#E8DFD0] flex justify-between text-xs font-bold text-[#191714]">
                        <span>Total Paid ({ord.paymentMethod})</span>
                        <span className="text-sm">{formatINR(ord.totalAmount)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-serif text-xl font-semibold text-[#191714]">Saved Addresses</h2>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="flex items-center space-x-1 px-4 py-2 bg-[#003D2D] text-[#FFF8ED] rounded-full text-xs font-semibold uppercase tracking-wider"
                  >
                    <Plus size={14} />
                    <span>{isAddingAddress ? 'Cancel' : 'Add New'}</span>
                  </button>
                </div>

                {isAddingAddress && (
                  <form onSubmit={handleAddAddress} className="bg-white p-5 rounded-xl border border-[#E8DFD0] shadow-xs space-y-3 text-xs">
                    <h3 className="font-serif font-semibold text-sm text-[#191714]">New Delivery Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#746D62] mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full border rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[#746D62] mb-1">Mobile Number</label>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full border rounded p-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#746D62] mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full border rounded p-2"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[#746D62] mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full border rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[#746D62] mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full border rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[#746D62] mb-1">PIN Code</label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full border rounded p-2"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#003D2D] text-white rounded text-xs font-semibold uppercase tracking-wider"
                    >
                      Save Address
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="bg-white p-5 rounded-xl border border-[#E8DFD0] shadow-xs relative text-xs space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-[#191714]">{addr.fullName}</span>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-[#746D62] hover:text-red-500 p-1"
                          aria-label="Delete address"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="text-[#746D62]">{addr.street}</p>
                      {addr.apartment && <p className="text-[#746D62]">{addr.apartment}</p>}
                      <p className="text-[#746D62]">{addr.city}, {addr.state} - {addr.postalCode}</p>
                      <p className="text-[#191714] font-medium pt-1">Phone: {addr.phoneNumber}</p>
                      {addr.isDefaultShipping && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-[#FFF8ED] text-[#003D2D] border border-[#C9A34A] rounded text-[10px] font-semibold">
                          Default Shipping
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold text-[#191714]">My Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="bg-white p-10 rounded-xl border border-[#E8DFD0] text-center">
                    <Heart size={40} className="mx-auto text-[#C9A34A] mb-3" />
                    <p className="font-serif text-base font-semibold text-[#191714]">Your wishlist is empty</p>
                    <p className="text-xs text-[#746D62] mt-1">Tap the heart icon on any product to save it for later.</p>
                    <Link href="/shop" className="mt-5 inline-block px-6 py-2.5 bg-[#003D2D] text-white rounded-full text-xs font-semibold uppercase tracking-wider">
                      Explore Catalogue
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4 text-xs">
                <h2 className="font-serif text-xl font-semibold text-[#191714]">Profile Information</h2>
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-[#746D62] mb-1 font-medium">Full Name</label>
                    <input
                      type="text"
                      disabled
                      value={user.fullName}
                      className="w-full bg-[#FAF6F0] border border-[#E8DFD0] rounded p-2 text-[#191714]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#746D62] mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-[#FAF6F0] border border-[#E8DFD0] rounded p-2 text-[#191714]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#746D62] mb-1 font-medium">Phone Number</label>
                    <input
                      type="text"
                      disabled
                      value={user.phoneNumber || 'Not provided'}
                      className="w-full bg-[#FAF6F0] border border-[#E8DFD0] rounded p-2 text-[#191714]"
                    />
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

