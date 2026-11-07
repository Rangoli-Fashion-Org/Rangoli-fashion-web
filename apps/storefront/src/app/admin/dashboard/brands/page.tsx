'use client';

import React, { useState } from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([
    { id: '1', name: 'Rangoli Atelier', slug: 'rangoli-atelier', description: 'Exclusive handcrafted festive couture' },
    { id: '2', name: 'Rangoli Everyday', slug: 'rangoli-everyday', description: 'Pure cotton daily wear kurtis' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">Sub-Brands &amp; Signature Lines</h1>
          <p className="text-xs text-[#746D62] mt-0.5">Manage fashion labels and artisan collections</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
            <tr>
              <th className="p-3">Brand Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFD0]/60">
            {brands.map((b) => (
              <tr key={b.id} className="hover:bg-[#FFF8ED]">
                <td className="p-3 font-semibold text-[#191714] flex items-center space-x-2">
                  <Award size={16} className="text-[#C9A34A]" />
                  <span>{b.name}</span>
                </td>
                <td className="p-3 font-mono text-[#746D62]">/{b.slug}</td>
                <td className="p-3 text-[#746D62]">{b.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

