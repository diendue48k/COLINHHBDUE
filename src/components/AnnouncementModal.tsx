'use client';

import React, { useEffect } from 'react';
import {
  X,
  Calendar,
  FileText,
  Download,
  Share2,
  Printer,
  Bell,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { Announcement } from '@/types';

interface AnnouncementModalProps {
  announcement: Announcement | null;
  onClose: () => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  announcement,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (announcement) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [announcement]);

  if (!announcement) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[800px] max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50/80 via-white to-orange-50/40 border-b border-slate-100 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-[#0B4899] text-white text-[11px] font-black uppercase tracking-wider">
              {announcement.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Ngày đăng: {announcement.publishedAt}</span>
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-[#0B3B60] leading-snug pr-8">
            {announcement.title}
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
          {/* Excerpt Lead Box */}
          {announcement.excerpt && (
            <div className="p-4 rounded-2xl bg-blue-50/50 border-l-4 border-[#0B4899] font-medium text-slate-800">
              {announcement.excerpt}
            </div>
          )}

          {/* Full Announcement Text (HTML / Plain text) */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider text-[#0B4899]">
              Nội dung thông báo chi tiết:
            </h4>
            {announcement.content && announcement.content.includes('<') ? (
              <div
                className="due-popup-html-content space-y-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: announcement.content }}
              />
            ) : (
              <div className="whitespace-pre-line space-y-3 leading-relaxed">
                {announcement.content}
              </div>
            )}
          </div>

          {/* Attached Files Section if any */}
          {announcement.attachmentName && (
            <div className="pt-4 border-t border-slate-100">
              <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 text-xs">
                <FileText className="w-4 h-4 text-[#0B4899]" />
                <span>Văn bản đính kèm:</span>
              </h5>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                    PDF
                  </div>
                  <span className="font-bold text-slate-800 text-xs truncate">
                    {announcement.attachmentName}
                  </span>
                </div>
                <a
                  href={announcement.attachmentUrl || '#'}
                  download
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0B4899] hover:bg-blue-800 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải văn bản</span>
                </a>
              </div>
            </div>
          )}

          {/* Contact Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-[#0B4899] block">BỘ PHẬN PHỤ TRÁCH:</span>
            <p className="text-slate-800 font-semibold">
              Phòng Công tác Sinh viên – H214 Tòa nhà hành chính DUE
            </p>
            <p className="text-slate-600">Hotline: 0236 3956 397 | Email: phongcongtacsinhvien@due.edu.vn</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In thông báo</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0B4899] hover:bg-blue-800 text-white font-bold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
