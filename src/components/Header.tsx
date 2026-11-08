'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, User, Menu, X } from 'lucide-react';
import { Category } from '@/types';

interface HeaderProps {
  categories?: Category[];
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  searchQuery = '',
  setSearchQuery,
}) => {
  const [activeMenu, setActiveMenu] = useState<string>('co-hoi');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenSearch) onOpenSearch();
  };

  // Cuộn trang mượt mà với bù trừ chính xác chiều cao của Sticky Header
  const scrollToSection = (id: string) => {
    setActiveMenu(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 125;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 16;

      window.scrollTo({
        top: offsetPosition > 0 ? offsetPosition : 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="w-full bg-white sticky top-0 z-40 border-b border-slate-100 shadow-xs">
      {/* 
        ROW 1: KHU VỰC NHẬN DIỆN THƯƠNG HIỆU & TÌM KIẾM / ADMIN
        - Bên trái: Logo Cổng thông tin học bổng DUE chính thức (1536x279)
        - Bên phải: Thanh tìm kiếm "Tìm kiếm học bổng, chính sách hỗ trợ..." & nút Admin
      */}
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo DUE */}
        <Link href="/" className="flex items-center shrink-0 group">
          <img
            src="/images/logo-cong-thong-tin.png"
            alt="CỔNG THÔNG TIN HỌC BỔNG - TRƯỜNG ĐẠI HỌC KINH TẾ - ĐHĐN"
            className="h-12 sm:h-14 md:h-15 w-auto object-contain transition-transform group-hover:scale-[1.01]"
          />
        </Link>

        {/* Right: Search Box & Admin Entry */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm học bổng, chính sách hỗ trợ..."
              className="w-48 sm:w-72 md:w-80 pl-4 pr-9 py-2 rounded-full border border-slate-200 bg-slate-50/80 hover:bg-white focus:bg-white focus:border-[#1760AB] text-xs font-medium text-slate-800 placeholder-slate-400 shadow-inner focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#1760AB] transition-colors"
              title="Tìm kiếm"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="w-[1px] h-6 bg-slate-200 hidden sm:block" />

          {/* Admin Dashboard */}
          <Link
            href="/admin"
            className="w-9 h-9 rounded-full bg-[#1760AB] hover:bg-[#0A376B] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 shrink-0"
            title="Khu vực Quản trị DUE (Admin)"
          >
            <User className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Menu điều hướng"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 
        ROW 2: THANH MENU ĐIỀU HƯỚNG CĂN GIỮA, 100% CHỮ TRẮNG TINH (KHÔNG MỜ)
        4 mục chính:
        1. CƠ HỘI DÀNH CHO BẠN
        2. THÔNG BÁO
        3. LIÊN HỆ
        4. CÂU HỎI THƯỜNG GẶP
      */}
      <div
        className="w-full shadow-md text-white"
        style={{
          background: 'linear-gradient(90deg, #0171D7 0%, #0E87A7 35%, #1B9C78 70%, #2BB73F 100%)',
        }}
      >
        <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-12 sm:h-13">
          <nav className="hidden md:flex items-center justify-center gap-10 lg:gap-14 h-full">
            {/* 1. CƠ HỘI DÀNH CHO BẠN */}
            <button
              type="button"
              onClick={() => scrollToSection('co-hoi')}
              className={`h-full flex items-center px-2 text-sm sm:text-[14px] font-black uppercase tracking-wider text-white transition-all cursor-pointer relative ${
                activeMenu === 'co-hoi'
                  ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-white after:rounded-t-full'
                  : 'hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-white/80'
              }`}
            >
              CƠ HỘI DÀNH CHO BẠN
            </button>

            {/* 2. THÔNG BÁO */}
            <button
              type="button"
              onClick={() => scrollToSection('muc-thong-bao')}
              className={`h-full flex items-center px-2 text-sm sm:text-[14px] font-black uppercase tracking-wider text-white transition-all cursor-pointer relative ${
                activeMenu === 'muc-thong-bao'
                  ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-white after:rounded-t-full'
                  : 'hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-white/80'
              }`}
            >
              THÔNG BÁO
            </button>

            {/* 3. LIÊN HỆ */}
            <button
              type="button"
              onClick={() => scrollToSection('muc-lien-he')}
              className={`h-full flex items-center px-2 text-sm sm:text-[14px] font-black uppercase tracking-wider text-white transition-all cursor-pointer relative ${
                activeMenu === 'muc-lien-he'
                  ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-white after:rounded-t-full'
                  : 'hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-white/80'
              }`}
            >
              LIÊN HỆ
            </button>

            {/* 4. CÂU HỎI THƯỜNG GẶP (ĐÃ ĐỔI THEO YÊU CẦU NGƯỜI DÙNG) */}
            <button
              type="button"
              onClick={() => scrollToSection('muc-faq')}
              className={`h-full flex items-center px-2 text-sm sm:text-[14px] font-black uppercase tracking-wider text-white transition-all cursor-pointer relative ${
                activeMenu === 'muc-faq'
                  ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-white after:rounded-t-full'
                  : 'hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-white/80'
              }`}
            >
              CÂU HỎI THƯỜNG GẶP
            </button>
          </nav>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-3 bg-[#041E38]/98 backdrop-blur-md border-t border-white/20 flex flex-col gap-1.5 animate-fade-in text-white text-xs font-black text-center">
            <button
              type="button"
              onClick={() => scrollToSection('co-hoi')}
              className="py-2.5 px-4 rounded-xl hover:bg-white/10 uppercase text-white"
            >
              CƠ HỘI DÀNH CHO BẠN
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('muc-thong-bao')}
              className="py-2.5 px-4 rounded-xl hover:bg-white/10 uppercase text-white"
            >
              THÔNG BÁO
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('muc-lien-he')}
              className="py-2.5 px-4 rounded-xl hover:bg-white/10 uppercase text-white"
            >
              LIÊN HỆ
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('muc-faq')}
              className="py-2.5 px-4 rounded-xl hover:bg-white/10 uppercase text-white"
            >
              CÂU HỎI THƯỜNG GẶP
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
