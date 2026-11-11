'use client';

import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  CheckCircle2,
  UserCheck,
  ShieldAlert,
  Edit,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { User } from '@/types';
import { ADMIN_USERS, getStoredUser, setStoredUser } from '@/lib/auth';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(ADMIN_USERS);
  const [activeUserId, setActiveUserId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/data?type=users', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          setUsers(json);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUsers();
    const stored = getStoredUser();
    if (stored) setActiveUserId(stored.id);
  }, []);

  const handleOpenCreate = () => {
    setEditingUser({
      id: `usr-${Date.now()}`,
      username: '',
      password: '',
      name: '',
      email: '',
      role: 'admin',
      avatar: '/images/logo-due-shield.png',
      createdAt: new Date().toISOString().split('T')[0],
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser({
      ...u,
      username: u.username || u.email.split('@')[0],
      password: u.password || '',
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_user',
          payload: editingUser,
        }),
      });
      if (res.ok) {
        setMessage('Đã lưu thông tin tài khoản và mật khẩu Quản trị viên thành công!');
        setIsModalOpen(false);
        await loadUsers();
        if (editingUser.id === activeUserId) {
          setStoredUser(editingUser);
          window.dispatchEvent(new Event('due-admin-user-changed'));
        }
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (u: User) => {
    if (users.length <= 1) {
      window.alert('Hệ thống cần tối thiểu 01 tài khoản Quản trị viên hoạt động!');
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${u.name}" (${u.email})?`)) {
      return;
    }
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_user',
          payload: { id: u.id },
        }),
      });
      if (res.ok) {
        setMessage(`Đã xóa tài khoản "${u.name}"!`);
        await loadUsers();
        setTimeout(() => setMessage(''), 2500);
      } else {
        const err = await res.json();
        window.alert(err.error || 'Không thể xóa tài khoản này');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadge = () => {
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
            Quản lý tài khoản đăng nhập, mật khẩu và phân quyền Quản trị viên (Admin)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm quản trị viên</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-bold">
            <tr>
              <th className="py-3 px-4">Họ và tên</th>
              <th className="py-3 px-4">Tên đăng nhập</th>
              <th className="py-3 px-4">Email DUE</th>
              <th className="py-3 px-4">Vai trò</th>
              <th className="py-3 px-4 text-center">Trạng thái phiên</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {users.map((u) => {
              const isCurrent = u.id === activeUserId;
              const uname = u.username || u.email.split('@')[0];
              return (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{uname}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{u.email}</td>
                  <td className="py-3.5 px-4">{getRoleBadge()}</td>
                  <td className="py-3.5 px-4 text-center">
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <UserCheck className="w-3 h-3" />
                        <span>Đang đăng nhập</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        Hoạt động
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Đổi mật khẩu / Chỉnh sửa thông tin"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u)}
                        disabled={users.length <= 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && editingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 uppercase">
                {users.some((u) => u.id === editingUser.id)
                  ? 'Cập nhật tài khoản & Mật khẩu'
                  : 'Thêm tài khoản Quản trị viên mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên / Đơn vị *</label>
                <input
                  required
                  type="text"
                  placeholder="Phòng Công tác Sinh viên DUE"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên đăng nhập *</label>
                  <input
                    required
                    type="text"
                    placeholder="admin"
                    value={editingUser.username || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email DUE *</label>
                  <input
                    required
                    type="email"
                    placeholder="canbo@due.edu.vn"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {users.some((u) => u.id === editingUser.id)
                      ? 'Mật khẩu mới (Để trống nếu giữ nguyên)'
                      : 'Mật khẩu đăng nhập *'}
                  </span>
                </label>
                <div className="relative">
                  <input
                    required={!users.some((u) => u.id === editingUser.id)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu đăng nhập..."
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    className="w-full p-2.5 pr-9 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Lưu tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
