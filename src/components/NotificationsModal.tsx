'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Bell, X, Calendar, Download, FileText, ArrowRight } from 'lucide-react';
import { Announcement } from '@/types';
import { triggerAnnouncementDownload } from './AnnouncementModal';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  announcements,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeAnnouncements = announcements.filter((a) => a.isActive !== false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight">
                Thông báo Học bổng mới nhất
              </h2>
              <p className="text-xs text-slate-500">
                Cập nhật thông tin xét duyệt, nhận hồ sơ và công bố kết quả
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3.5 flex-1 bg-slate-50">
          {activeAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                    {ann.category}
                  </span>
                  {ann.badgeText && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                      {ann.badgeText}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ann.publishedAt}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 hover:text-blue-700 leading-snug">
                {ann.title}
              </h3>

              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {ann.excerpt}
              </p>

              {ann.attachmentName && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{ann.attachmentName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerAnnouncementDownload(ann)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-blue-700 bg-slate-100 px-2.5 py-1 rounded-md cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Tải về</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/thong-bao"
            onClick={onClose}
            className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả thông báo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
