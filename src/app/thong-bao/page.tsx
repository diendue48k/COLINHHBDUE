'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  AnnouncementModal,
  triggerAnnouncementDownload,
  ANNOUNCEMENT_CATEGORY_FILTERS,
  matchesAnnouncementCategory,
} from '@/components/AnnouncementModal';
import { Announcement } from '@/types';
import { initialData } from '@/data/initialData';
import { Calendar, FileText, Download, ArrowLeft, Search, ChevronRight, X } from 'lucide-react';

function AnnouncementsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const idParam = searchParams.get('id');

  const [announcements, setAnnouncements] = useState<Announcement[]>(initialData.announcements);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    if (categoryParam) {
      const exists = ANNOUNCEMENT_CATEGORY_FILTERS.some((c) => c.id === categoryParam);
      if (exists) {
        setSelectedCategory(categoryParam);
      }
    }
  }, [categoryParam]);

  useEffect(() => {
    fetch('/api/data?type=announcements', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAnnouncements(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (idParam && announcements.length > 0) {
      const found = announcements.find((a) => a.id === idParam || a.slug === idParam);
      if (found) {
        setSelectedAnnouncement(found);
      }
    }
  }, [idParam, announcements]);

  const filtered = useMemo(() => {
    return announcements.filter((a) => {
      if (a.isActive === false) return false;

      // Category match
      if (!matchesAnnouncementCategory(a, selectedCategory)) {
        return false;
      }

      // Search query match
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = a.title?.toLowerCase().includes(q);
        const matchCat = a.category?.toLowerCase().includes(q);
        const matchExcerpt = a.excerpt?.toLowerCase().includes(q);
        const matchContent = a.content?.toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchExcerpt && !matchContent) return false;
      }

      return true;
    });
  }, [announcements, selectedCategory, search]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 mb-6 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang chủ</span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1760AB] uppercase tracking-tight">
                THÔNG BÁO HỌC BỔNG & CHÍNH SÁCH SINH VIÊN
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Các quyết định, thông báo xét cấp, danh sách nhận học bổng mới nhất của Trường Đại học Kinh tế – ĐHĐN
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm thông báo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#1760AB] w-full sm:w-64"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* BỘ LỌC PHÂN LOẠI 6 DANH MỤC HỌC BỔNG */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 flex-wrap">
              {ANNOUNCEMENT_CATEGORY_FILTERS.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1760AB] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-2.5 text-[11px] text-slate-400 font-medium">
              Tìm thấy <strong className="text-slate-700">{filtered.length}</strong> thông báo phù hợp
            </div>
          </div>

          {/* Danh sách thông báo */}
          <div className="space-y-4 pt-2">
            {filtered.map((item, idx) => {
              const badgeColors = [
                'bg-blue-50 text-[#1760AB] border-blue-200',
                'bg-orange-50 text-[#F26524] border-orange-200',
                'bg-emerald-50 text-[#119046] border-emerald-200',
              ];
              const badgeClass = badgeColors[idx % 3];

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#1760AB] hover:shadow-md transition-all bg-white space-y-3 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${badgeClass}`}>
                        {item.category}
                      </span>
                      {item.badgeText && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500 text-white uppercase">
                          {item.badgeText}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.publishedAt}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => setSelectedAnnouncement(item)}
                    className="text-base font-bold text-slate-900 group-hover:text-[#1760AB] leading-snug cursor-pointer transition-colors"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {item.excerpt || item.content}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {item.attachmentName ? (
                      <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold truncate">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.attachmentName}</span>
                      </div>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedAnnouncement(item)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 hover:bg-[#1760AB] text-[#1760AB] hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <span>Xem chi tiết</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {item.attachmentName && (
                        <button
                          type="button"
                          onClick={() => triggerAnnouncementDownload(item)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải văn bản</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs italic space-y-2">
                <p>Không tìm thấy thông báo nào phù hợp với bộ lọc hiện tại.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearch('');
                  }}
                  className="px-3 py-1 text-xs font-bold text-[#1760AB] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Popup chi tiết thông báo */}
      <AnnouncementModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />
    </div>
  );
}

export default function AnnouncementsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Đang tải danh sách thông báo...</div>}>
      <AnnouncementsContent />
    </Suspense>
  );
}
