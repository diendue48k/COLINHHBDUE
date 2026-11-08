'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Layers,
  Eye,
  TrendingUp,
  PlusCircle,
  Bell,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { DatabaseState, Scholarship } from '@/types';
import { initialData } from '@/data/initialData';

export default function AdminDashboardPage() {
  const [data, setData] = useState<DatabaseState>(initialData);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetData = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn đặt lại cơ sở dữ liệu về mặc định ban đầu?')) {
      return;
    }
    setResetting(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_database' }),
      });
      if (res.ok) {
        setMessage('Đã khôi phục dữ liệu gốc thành công!');
        await loadData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  // Sort scholarships by views count descending
  const topScholarships = [...(data.scholarships || [])]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 5);

  const totalPrograms = data.scholarships?.length || 0;
  const activePrograms = data.scholarships?.filter((s) => s.isActive !== false).length || 0;
  const totalCategories = data.categories?.length || 0;
  const totalViews = data.scholarships?.reduce((sum, s) => sum + (s.viewsCount || 0), 0) || 0;
  const totalAnnouncements = data.announcements?.length || 0;

  return (
    <div className="space-y-6">
      {/* Alert toast if any */}
      {message && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
            Báo cáo & Thống kê Hoạt động
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng quan hệ thống Cổng thông tin học bổng Trường Đại học Kinh tế – ĐHĐN
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/scholarships/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm chương trình mới</span>
          </Link>

          <button
            type="button"
            onClick={handleResetData}
            disabled={resetting}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
            title="Khôi phục 6 nhóm và dữ liệu mẫu chuẩn"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>Đặt lại dữ liệu gốc</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng số chương trình */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Tổng số chương trình
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 block">
              {totalPrograms}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              Đang hoạt động: {activePrograms}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Nhóm học bổng */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Nhóm học bổng
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 block">
              {totalCategories}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              Bố trí 6 cột chuẩn giao diện
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Tổng lượt xem / tra cứu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Lượt xem & tra cứu
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 block">
              {totalViews.toLocaleString('vi-VN')}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% so với tháng trước
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Thông báo hoạt động */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Thông báo xét cấp
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 block">
              {totalAnnouncements}
            </span>
            <span className="text-[11px] text-blue-600 font-semibold">
              Đang tiếp nhận hồ sơ
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Top Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Traffic Chart by Time */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                Thống kê lượt truy cập theo thời gian (7 ngày gần nhất)
              </h3>
              <p className="text-xs text-slate-400">
                Lượt học viên, sinh viên tra cứu và mở popup chi tiết
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>Học kỳ I 2025-2026</span>
            </div>
          </div>

          {/* Bar Chart Simulation */}
          <div className="pt-4 pb-2">
            <div className="h-48 flex items-end gap-3 sm:gap-6 justify-between px-2 border-b border-slate-200">
              {data.stats?.dailyViews?.map((item, idx) => {
                const max = 3000;
                const heightPct = Math.round((item.views / max) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.views}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[40px] bg-gradient-to-t from-blue-700 to-sky-400 rounded-t-lg group-hover:brightness-110 transition-all shadow-sm"
                    />
                    <span className="text-[10px] font-medium text-slate-400 truncate max-w-full">
                      {item.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Top Most Viewed Programs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
              Top quan tâm nhiều nhất
            </h3>
            <Link
              href="/admin/scholarships"
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-3">
            {topScholarships.map((s, idx) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {s.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {s.targetAudience?.slice(0, 30)}...
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-slate-600 shrink-0 ml-2">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{(s.viewsCount || 0).toLocaleString('vi-VN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
