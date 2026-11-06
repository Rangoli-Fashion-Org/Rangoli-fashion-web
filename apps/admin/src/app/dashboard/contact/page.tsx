'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { fetchAdminApi } from '../../../lib/api';

export default function AdminContactPage() {
  const [storeName, setStoreName] = useState('Rangoli Fashions');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchAdminApi<any>('/settings/contact-info').then((res) => {
      if (res.success && res.data) {
        const c = res.data;
        setStoreName(c.storeName || 'Rangoli Fashions');
        setEmail(c.email || '');
        setPhone(c.phone || '');
        setWhatsapp(c.whatsapp || '');
        setAddress(c.address || '');
        setCity(c.city || '');
        setState(c.state || '');
        setPostalCode(c.postalCode || '');
        setBusinessHours(c.businessHours || '');
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');

    const res = await fetchAdminApi('/settings/admin/contact-info', {
      method: 'PUT',
      body: JSON.stringify({
        storeName,
        email,
        phone,
        whatsapp,
        address,
        city,
        state,
        postalCode,
        businessHours,
      }),
    });

    if (res.success) {
      setStatusMsg('Contact and address information updated');
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#191714]">Contact &amp; Store Location</h1>
        <p className="text-xs text-[#746D62] mt-0.5">Edit store address, phone numbers, and operational hours</p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-medium">
          {statusMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Store / Brand Name</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Support Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">WhatsApp Number</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#746D62] mb-1 font-medium">Street Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">City</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">State</label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Postal PIN Code</label>
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#746D62] mb-1 font-medium">Business / Atelier Hours</label>
          <input
            type="text"
            value={businessHours}
            onChange={(e) => setBusinessHours(e.target.value)}
            className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-8 py-3 bg-[#003D2D] hover:bg-[#0B5940] text-[#FFF8ED] rounded-lg font-semibold uppercase tracking-wider shadow-sm disabled:opacity-50"
          >
            <Save size={15} />
            <span>{isSaving ? 'Updating...' : 'Save Contact Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
