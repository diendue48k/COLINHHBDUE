'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Announcement } from '@/types';
import { initialData } from '@/data/initialData';
import { Calendar, Bell, FileText, Download, ArrowLeft, Search } from 'lucide-react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialData.announcements);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/data?type=announcements')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAnnouncements(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 mb-6 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang chủ</span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0B2545] uppercase tracking-tight">
                Thông báo Học bổng & Chính sách Sinh viên
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Các quyết định, thông báo xét cấp, danh sách nhận học bổng mới nhất của Trường Đại học Kinh tế – ĐHĐN
              </p>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm thông báo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all bg-white space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      {item.category}
                    </span>
                    {item.badgeText && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500 text-white">
                        {item.badgeText}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.publishedAt}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.content || item.excerpt}
                </p>

                {item.attachmentName && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold">
                      <FileText className="w-4 h-4" />
                      <span>{item.attachmentName}</span>
                    </div>
                    <a
                      href={item.attachmentUrl || '#'}
                      download
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải văn bản</span>
                    </a>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs italic">
                Không tìm thấy thông báo nào phù hợp
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
