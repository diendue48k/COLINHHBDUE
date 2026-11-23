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
  User as UserIcon,
  AtSign,
} from 'lucide-react';
import { User } from '@/types';
import { ADMIN_USERS, getStoredUser, setStoredUser } from '@/lib/auth';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(ADMIN_USERS);
  const [activeUserId, setActiveUserId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
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
    setShowPassword(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser({
      ...u,
      username: u.username || u.email || '',
      password: u.password || '',
    });
    setShowPassword(true);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const loginVal = (editingUser.username || editingUser.email || '').trim();
    const payload: User = {
      ...editingUser,
      name: editingUser.name.trim(),
      username: loginVal,
      email: loginVal,
      password: (editingUser.password || '').trim(),
    };
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_user',
          payload,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMessage(`Đã lưu tài khoản của "${payload.name}" thành công!`);
        setIsModalOpen(false);
        if (Array.isArray(json.users)) {
          setUsers(json.users);
        } else {
          await loadUsers();
        }
        if (payload.id === activeUserId) {
          setStoredUser(payload);
          window.dispatchEvent(new Event('due-admin-user-changed'));
        }
        setTimeout(() => setMessage(''), 2500);
      } else {
        window.alert(json.error || 'Không thể lưu tài khoản');
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
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản của "${u.name}" (${u.username || u.email})?`)) {
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
      const json = await res.json();
      if (res.ok && json.success) {
        setMessage(`Đã xóa tài khoản của "${u.name}"!`);
        if (Array.isArray(json.users)) {
          setUsers(json.users);
        } else {
          await loadUsers();
        }
        setTimeout(() => setMessage(''), 2500);
      } else {
        window.alert(json.error || 'Không thể xóa tài khoản này');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleRowPassword = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
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
            Tạo tài khoản cho người dùng mới với Họ tên, Tên đăng nhập (hoặc Email) tự đặt và Mật khẩu do bạn cài đặt
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tạo tài khoản mới</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-bold">
            <tr>
              <th className="py-3.5 px-4">Họ và tên người dùng</th>
              <th className="py-3.5 px-4">Tên đăng nhập / Email</th>
              <th className="py-3.5 px-4">Mật khẩu đã cài</th>
              <th className="py-3.5 px-4">Phân quyền</th>
              <th className="py-3.5 px-4 text-center">Trạng thái</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {users.map((u) => {
              const isCurrent = u.id === activeUserId;
              const loginId = u.username || u.email;
              const defaultMatch = ADMIN_USERS.find((du) => du.id === u.id || du.email === u.email);
              const actualPass = u.password || defaultMatch?.password || 'Admin@DUE2026';
              const isPassShown = Boolean(visiblePasswords[u.id]);

              return (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs shrink-0">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="text-slate-900 font-bold">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          Ngày tạo: {u.createdAt}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {loginId}
                    </span>
                    {u.email && u.email !== loginId && (
                      <span className="block text-[11px] text-slate-400 mt-1">{u.email}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      <span className="font-mono font-bold text-slate-700">
                        {isPassShown ? actualPass : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleRowPassword(u.id)}
                        className="text-slate-400 hover:text-blue-600 cursor-pointer"
                        title={isPassShown ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
                      >
                        {isPassShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Quản trị viên</span>
                    </span>
                  </td>

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
                        className="px-2.5 py-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Sửa Họ tên, Tên đăng nhập hoặc Mật khẩu"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Sửa / Đổi MK</span>
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
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-black text-slate-800 uppercase">
                {users.some((u) => u.id === editingUser.id)
                  ? 'Chỉnh sửa Tài khoản & Mật khẩu'
                  : 'Tạo Tài khoản Quản trị mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-4 text-xs">
              {/* 1. Họ và tên người dùng */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Họ và tên người dùng *</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="vd: Nguyễn Thị Linh - Phòng CTSV"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* 2. Tên đăng nhập hoặc Email tự đặt */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-blue-600" />
                  <span>2. Tên đăng nhập (Có thể đặt bằng Email hoặc Tên tự chọn) *</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="vd: colinh hoặc linhnt@due.edu.vn"
                  value={editingUser.username || ''}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      username: e.target.value,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-blue-800 focus:bg-white focus:outline-none focus:border-blue-600"
                />
                <span className="text-[10.5px] text-slate-400 mt-1 block">
                  Người dùng sẽ nhập đúng chuỗi này vào ô &ldquo;Tài khoản hoặc Email&rdquo; khi đăng nhập.
                </span>
              </div>

              {/* 3. Mật khẩu do bạn cài */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>3. Mật khẩu đăng nhập (Do bạn cài đặt) *</span>
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu bạn muốn cài..."
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    className="w-full p-2.5 pr-9 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
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
