'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { fetchAdminApi } from '../../../lib/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [announcementText, setAnnouncementText] = useState('');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('1999');
  const [standardShippingFee, setStandardShippingFee] = useState('99');
  const [returnDays, setReturnDays] = useState('7');
  const [returnPolicyText, setReturnPolicyText] = useState('');
  const [termsText, setTermsText] = useState('');
  const [privacyText, setPrivacyText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    fetchAdminApi<Record<string, string>>('/settings/admin/all').then((res) => {
      if (res.success && res.data) {
        setSettings(res.data);
        setAnnouncementText(res.data.announcement_bar_text || '');
        setFreeShippingThreshold(res.data.free_shipping_threshold || '1999');
        setStandardShippingFee(res.data.standard_shipping_fee || '99');
        setReturnDays(res.data.return_policy_days || '7');
        setReturnPolicyText(res.data.return_policy_text || '');
        setTermsText(res.data.terms_and_conditions || '');
        setPrivacyText(res.data.privacy_policy || '');
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMsg('');

    await Promise.all([
      fetchAdminApi('/settings/admin/key/announcement_bar_text', {
        method: 'PUT',
        body: JSON.stringify({ value: announcementText, group: 'GENERAL' }),
      }),
      fetchAdminApi('/settings/admin/key/free_shipping_threshold', {
        method: 'PUT',
        body: JSON.stringify({ value: freeShippingThreshold, group: 'SHIPPING' }),
      }),
      fetchAdminApi('/settings/admin/key/standard_shipping_fee', {
        method: 'PUT',
        body: JSON.stringify({ value: standardShippingFee, group: 'SHIPPING' }),
      }),
      fetchAdminApi('/settings/admin/key/return_policy_days', {
        method: 'PUT',
        body: JSON.stringify({ value: returnDays, group: 'POLICY' }),
      }),
      fetchAdminApi('/settings/admin/key/return_policy_text', {
        method: 'PUT',
        body: JSON.stringify({ value: returnPolicyText, group: 'POLICY' }),
      }),
      fetchAdminApi('/settings/admin/key/terms_and_conditions', {
        method: 'PUT',
        body: JSON.stringify({ value: termsText, group: 'POLICY' }),
      }),
      fetchAdminApi('/settings/admin/key/privacy_policy', {
        method: 'PUT',
        body: JSON.stringify({ value: privacyText, group: 'POLICY' }),
      }),
    ]);

    setSaveMsg('All store configuration settings successfully persisted in PostgreSQL');
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#191714]">Store Configuration</h1>
        <p className="text-xs text-[#746D62] mt-0.5">Manage global policy text, thresholds, and announcement banner</p>
      </div>

      {saveMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-medium">
          {saveMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8DFD0] shadow-xs space-y-4 text-xs">
        <div>
          <label className="block text-[#746D62] mb-1 font-medium">Announcement Bar Text</label>
          <input
            type="text"
            required
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Free Shipping Threshold (₹)</label>
            <input
              type="number"
              required
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Standard Shipping Fee (₹)</label>
            <input
              type="number"
              required
              value={standardShippingFee}
              onChange={(e) => setStandardShippingFee(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>
          <div>
            <label className="block text-[#746D62] mb-1 font-medium">Return Window (Days)</label>
            <input
              type="number"
              required
              value={returnDays}
              onChange={(e) => setReturnDays(e.target.value)}
              className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#746D62] mb-1 font-medium">Returns Policy Summary</label>
          <textarea
            rows={3}
            value={returnPolicyText}
            onChange={(e) => setReturnPolicyText(e.target.value)}
            className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
          />
        </div>

        <div>
          <label className="block text-[#746D62] mb-1 font-medium">Terms &amp; Conditions</label>
          <textarea
            rows={4}
            value={termsText}
            onChange={(e) => setTermsText(e.target.value)}
            className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714]"
          />
        </div>

        <div>
          <label className="block text-[#746D62] mb-1 font-medium">Privacy Policy</label>
          <textarea
            rows={4}
            value={privacyText}
            onChange={(e) => setPrivacyText(e.target.value)}
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
            <span>{isSaving ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
