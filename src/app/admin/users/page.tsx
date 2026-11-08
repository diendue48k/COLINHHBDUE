'use client';

import React, { useState } from 'react';
import { Users, PlusCircle, Shield, CheckCircle2, UserCheck, ShieldAlert, Eye } from 'lucide-react';
import { User } from '@/types';
import { ADMIN_USERS } from '@/lib/auth';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(ADMIN_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    role: 'admin',
    createdAt: new Date().toISOString().split('T')[0],
  });
  const [message, setMessage] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = {
      ...newUser,
      id: `usr-${Date.now()}`,
      role: 'admin',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, created]);
    setMessage('Đã thêm tài khoản Quản trị viên mới thành công!');
    setIsModalOpen(false);
    setTimeout(() => setMessage(''), 2500);
  };

  const getRoleBadge = (role: string) => {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>Quản trị viên (Admin)</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
            Tài khoản Quản trị hệ thống ({users.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hệ thống phân quyền cố định duy nhất vai trò Quản trị viên (Admin) toàn quyền
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm quản trị viên</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-bold">
            <tr>
              <th className="py-3 px-4">Họ và tên</th>
              <th className="py-3 px-4">Email đăng nhập</th>
              <th className="py-3 px-4">Vai trò</th>
              <th className="py-3 px-4">Ngày tạo</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-600">{u.email}</td>
                <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
                <td className="py-3.5 px-4 text-slate-400">{u.createdAt}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                    Hoạt động
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 uppercase">
                Thêm tài khoản Quản trị viên mới
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  required
                  type="text"
                  placeholder="TS. Nguyễn Văn A"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email DUE *</label>
                <input
                  required
                  type="email"
                  placeholder="canbo@due.edu.vn"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phân quyền</label>
                <input
                  disabled
                  type="text"
                  value="Quản trị viên (Admin) - Toàn quyền quản trị"
                  className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-red-700 cursor-not-allowed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
