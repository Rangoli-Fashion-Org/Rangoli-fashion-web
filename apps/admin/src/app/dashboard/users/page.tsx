'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Shield, UserX, UserCheck } from 'lucide-react';
import { fetchAdminApi } from '../../../lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MANAGER'>('ADMIN');
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setIsLoading(true);
    const res = await fetchAdminApi<any[]>('/admin/users');
    if (res.success && res.data) {
      setUsers(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetchAdminApi('/admin/users', {
      method: 'POST',
      body: JSON.stringify({ email, fullName, password, role }),
    });

    if (res.success) {
      setIsAdding(false);
      setEmail('');
      setFullName('');
      setPassword('');
      loadUsers();
    } else {
      setError(res.message || 'Failed to create admin user');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await fetchAdminApi(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: !currentStatus }),
    });
    loadUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#191714]">Admin Users &amp; Roles</h1>
          <p className="text-xs text-[#746D62] mt-0.5">Control staff access, roles, and administrative permissions</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>{isAdding ? 'Cancel' : 'New Admin'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddUser} className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-md space-y-4 text-xs">
          <h3 className="font-serif text-base font-semibold text-[#191714]">Create New Admin Account</h3>
          {error && <p className="text-red-600 font-medium">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Anjali Verma"
                className="w-full border rounded p-2.5"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Official Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anjali@rangolifashions.com"
                className="w-full border rounded p-2.5"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Temporary Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full border rounded p-2.5"
              />
            </div>
            <div>
              <label className="block text-[#746D62] mb-1 font-medium">Role Assignment</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full border rounded p-2.5"
              >
                <option value="ADMIN">ADMIN (Products, Orders, CMS)</option>
                <option value="MANAGER">MANAGER (Orders &amp; Inventory)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="px-6 py-2 bg-[#003D2D] text-white rounded font-semibold uppercase tracking-wider">
              Create Admin
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF6F0] text-[#003D2D] font-semibold border-b border-[#E8DFD0]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFD0]/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#FFF8ED]">
                <td className="p-3 font-semibold text-[#191714]">{u.fullName}</td>
                <td className="p-3 text-[#746D62]">{u.email}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF6F0] text-[#003D2D] border border-[#C9A34A]">
                    {u.role}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    u.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {u.role !== 'SUPER_ADMIN' && (
                    <button
                      onClick={() => handleToggleStatus(u.id, u.isActive)}
                      className="text-xs text-[#003D2D] hover:underline font-semibold"
                    >
                      {u.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
