'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { fetchAdminApi } from '../../../lib/api';

export default function HomepageCmsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');

  const loadSections = async () => {
    setIsLoading(true);
    const res = await fetchAdminApi<any[]>('/homepage/admin/sections');
    if (res.success && res.data) {
      setSections(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleToggleVisibility = async (id: string, current: boolean) => {
    const res = await fetchAdminApi(`/homepage/admin/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isVisible: !current }),
    });
    if (res.success) {
      setSections(sections.map((s) => (s.id === id ? { ...s, isVisible: !current } : s)));
      setSaveMsg('Section visibility updated');
      setTimeout(() => setSaveMsg(''), 2500);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentSection = sections[index];
    const targetSection = sections[targetIndex];

    await Promise.all([
      fetchAdminApi(`/homepage/admin/sections/${currentSection.id}`, {
        method: 'PUT',
        body: JSON.stringify({ displayOrder: targetSection.displayOrder }),
      }),
      fetchAdminApi(`/homepage/admin/sections/${targetSection.id}`, {
        method: 'PUT',
        body: JSON.stringify({ displayOrder: currentSection.displayOrder }),
      }),
    ]);

    loadSections();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#191714]">Homepage CMS Architecture</h1>
        <p className="text-xs text-[#746D62] mt-0.5">Toggle visibility, rearrange section order and manage storefront arrangement</p>
      </div>

      {saveMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-xs text-green-700 font-medium">
          {saveMsg}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#746D62]">Loading layout...</div>
        ) : (
          <div className="divide-y divide-[#E8DFD0]/60">
            {sections.map((sec, idx) => (
              <div key={sec.id} className="p-4 flex items-center justify-between text-xs hover:bg-[#FAF6F0] transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-[#FAF6F0] border border-[#E8DFD0] flex items-center justify-center font-bold text-[#003D2D]">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-serif font-semibold text-sm text-[#191714]">{sec.title}</h3>
                    <p className="text-[#746D62] font-mono text-[10px]">Key: {sec.sectionKey}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Order controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveOrder(idx, 'up')}
                      className="p-1.5 text-[#746D62] hover:text-[#003D2D] disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMoveOrder(idx, 'down')}
                      className="p-1.5 text-[#746D62] hover:text-[#003D2D] disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>

                  {/* Visibility Toggle */}
                  <button
                    onClick={() => handleToggleVisibility(sec.id, sec.isVisible)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-semibold transition-colors ${
                      sec.isVisible
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {sec.isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{sec.isVisible ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
