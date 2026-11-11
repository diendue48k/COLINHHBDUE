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
  CheckCircle2,
  Calendar,
  Download,
  MessageSquare,
  Trash2,
  Check,
} from 'lucide-react';
import { ContactInquiry, DatabaseState } from '@/types';
import { initialData } from '@/data/initialData';

export default function AdminDashboardPage() {
  const [data, setData] = useState<DatabaseState>(initialData);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportReport = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      portal: 'Cổng thông tin Học bổng – Trường Đại học Kinh tế, Đại học Đà Nẵng',
      summary: {
        totalCategories: data.categories?.length || 0,
        totalScholarships: data.scholarships?.length || 0,
        activeScholarships: data.scholarships?.filter((s) => s.isActive !== false).length || 0,
        totalAnnouncements: data.announcements?.length || 0,
        totalFaqs: data.faqs?.length || 0,
        totalInquiries: data.inquiries?.length || 0,
        totalViews: data.scholarships?.reduce((sum, s) => sum + (s.viewsCount || 0), 0) || 0,
      },
      database: data,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DUE_Scholarship_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMessage('Đã xuất tệp sao lưu & báo cáo dữ liệu thành công!');
    setTimeout(() => setMessage(''), 2500);
  };

  const handleToggleInquiryStatus = async (inquiry: ContactInquiry) => {
    const updated: ContactInquiry = {
      ...inquiry,
      status: inquiry.status === 'resolved' ? 'new' : 'resolved',
    };
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_inquiry',
          payload: updated,
        }),
      });
      if (res.ok) {
        setMessage(
          updated.status === 'resolved'
            ? 'Đã đánh dấu xử lý câu hỏi!'
            : 'Đã chuyển về trạng thái chờ phản hồi!'
        );
        await loadData();
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi liên hệ này?')) return;
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_inquiry',
          payload: { id },
        }),
      });
      if (res.ok) {
        setMessage('Đã xóa câu hỏi liên hệ!');
        await loadData();
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
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
  const inquiries = data.inquiries || [];

  return (
    <div className="space-y-6">
      {/* Alert toast if any */}
      {message && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
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
          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Sao lưu & Xuất báo cáo (JSON)</span>
          </button>

          <Link
            href="/admin/scholarships/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm chương trình mới</span>
          </Link>
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
              <TrendingUp className="w-3 h-3" /> Ghi nhận theo thời gian thực
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
            <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Thời gian thực</span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="pt-4 pb-2">
            {totalViews > 0 ? (
              <div className="h-48 flex items-end gap-3 sm:gap-6 justify-between px-2 border-b border-slate-200">
                {data.stats?.dailyViews?.map((item, idx) => {
                  const max = Math.max(...(data.stats?.dailyViews?.map((d) => d.views) || [1]), 10);
                  const heightPct = Math.max(Math.round((item.views / max) * 100), 6);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-blue-700">
                        {item.views}
                      </span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[40px] bg-gradient-to-t from-blue-700 to-sky-400 rounded-t-lg group-hover:brightness-110 transition-all shadow-sm"
                      />
                      <span className="text-[10px] font-medium text-slate-400 truncate max-w-full">
                        {item.date ? item.date.slice(5) : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl text-center p-6 bg-slate-50/50">
                <Eye className="w-8 h-8 text-blue-400 mb-2 stroke-[1.5]" />
                <p className="text-xs font-bold text-slate-700">Hệ thống đang hoạt động và sẵn sàng ghi nhận</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                  Số lượt truy cập và biểu đồ sẽ tự động tích lũy khi người học mở xem các chương trình học bổng.
                </p>
              </div>
            )}
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

      {/* Student Contact Inquiries Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
              Câu hỏi & Thắc mắc từ Người học ({inquiries.length})
            </h3>
          </div>
          <Link
            href="/lien-he"
            target="_blank"
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            Xem trang Liên hệ
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
            Hiện chưa có câu hỏi trực tuyến mới từ biểu mẫu Liên hệ.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">{inq.fullName}</span>
                    <span className="text-slate-500">({inq.email})</span>
                    {inq.topic && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px]">
                        {inq.topic}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inq.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inq.status === 'resolved' ? 'Đã phản hồi' : 'Chờ xử lý'}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{inq.content}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleInquiryStatus(inq)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                      inq.status === 'resolved'
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{inq.status === 'resolved' ? 'Mở lại' : 'Đã xử lý'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteInquiry(inq.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
