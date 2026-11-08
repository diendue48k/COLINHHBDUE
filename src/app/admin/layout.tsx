'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Layers,
  Bell,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { User } from '@/types';
import { getStoredUser, setStoredUser, ADMIN_USERS } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);
  }, []);

  const navItems = [
    {
      title: 'Tổng quan & Thống kê',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Chương trình Học bổng',
      href: '/admin/scholarships',
      icon: GraduationCap,
    },
    {
      title: 'Nhóm Học bổng (6 nhóm)',
      href: '/admin/categories',
      icon: Layers,
    },
    {
      title: 'Quản lý Thông báo',
      href: '/admin/announcements',
      icon: Bell,
    },
    {
      title: 'Câu hỏi thường gặp',
      href: '/admin/faqs',
      icon: HelpCircle,
    },
    {
      title: 'Tài khoản Quản trị',
      href: '/admin/users',
      icon: Users,
    },
  ];

  const roleInfo = {
    label: 'Quản trị viên (Admin)',
    color: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#002B49] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileSidebar(!mobileSidebar)}
            className="p-1 rounded-lg bg-blue-800 text-white"
          >
            {mobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm tracking-tight">DUE SCHOLARSHIP ADMIN</span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="text-xs text-blue-200 flex items-center gap-1 hover:underline"
        >
          <span>Xem Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileSidebar ? 'block' : 'hidden'
        } md:flex flex-col w-full md:w-64 bg-[#0B2545] text-slate-200 shadow-xl shrink-0 z-30 md:min-h-screen`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-blue-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
              DUE
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-tight uppercase">
                QUẢN TRỊ HỆ THỐNG
              </h2>
              <p className="text-[10px] text-blue-300 font-medium">
                Cổng học bổng ĐH Kinh tế ĐHĐN
              </p>
            </div>
          </div>
        </div>

        {/* Current user card in sidebar */}
        <div className="px-4 py-3.5 mx-3 my-3 rounded-xl bg-blue-950/60 border border-blue-900/70 text-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-white truncate text-xs">
                {currentUser?.name || 'Tài khoản Quản trị'}
              </div>
              <div className="text-[10px] text-blue-300 truncate">
                {currentUser?.email || 'admin@due.edu.vn'}
              </div>
            </div>
          </div>
          <div
            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleInfo.color}`}
          >
            {roleInfo.label}
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5 flex-1 text-xs font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebar(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-blue-900/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                  <span>{item.title}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-blue-900/60 space-y-3">
          {/* Link back to public portal */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <span>Về Cổng thông tin người học</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main admin content container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top header row */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Bảng điều khiển quản trị DUE
            </span>
            <h1 className="text-base font-black text-slate-800 uppercase tracking-tight">
              CỔNG THÔNG TIN HỌC BỔNG DUE
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold border ${roleInfo.color}`}
            >
              {roleInfo.label}
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl border border-blue-200 transition-colors"
            >
              <span>Xem trang người dùng</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Admin Page content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
