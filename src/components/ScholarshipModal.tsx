'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Share2,
  Printer,
  FileDown,
  Check,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { Scholarship } from '@/types';
import { DynamicIcon } from './DynamicIcon';

interface ScholarshipModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
}

export const ScholarshipModal: React.FC<ScholarshipModalProps> = ({
  scholarship,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (scholarship) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [scholarship]);

  if (!scholarship) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?scholarship=${scholarship.slug || scholarship.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderSectionIcon = (iconName: string, index: number) => {
    if (index === 0) {
      return (
        <div className="w-11 h-11 rounded-full border-2 border-blue-400 bg-blue-50/70 flex items-center justify-center shrink-0 text-blue-600 shadow-xs">
          <GraduationCap className="w-5 h-5" />
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="w-11 h-11 rounded-full border-2 border-blue-400 bg-blue-50/70 flex items-center justify-center shrink-0 text-blue-600 shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-11 h-11 rounded-full border-2 border-blue-400 bg-blue-50/70 flex items-center justify-center shrink-0 text-blue-600 shadow-xs">
        <DynamicIcon name={iconName || 'FileText'} className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[920px] max-h-[88vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Top Header Row with Centered Title & Close X Button */}
        <div className="pt-6 px-6 sm:px-8 pb-3 bg-white sticky top-0 z-20 border-b border-slate-100">
          <div className="relative flex flex-col items-center text-center pr-8 pl-8">
            {/* Title Centered */}
            <h2 className="text-base sm:text-[19px] font-black text-[#0B3B60] tracking-tight uppercase leading-snug">
              {scholarship.modalTitle || scholarship.title}
            </h2>

            {/* Decorative Orange & Green Dual-Color bar */}
            <div className="w-16 h-1 bg-gradient-to-r from-[#FA541C] to-[#10B981] rounded-full mx-auto my-2" />

            {/* Close button X top right */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-0 top-0 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Interior: Hiển thị trực tiếp toàn bộ mã HTML theo yêu cầu người dùng (bỏ các tab) */}
        <div className="overflow-y-auto px-6 sm:px-8 py-5 space-y-5 flex-1 text-slate-700">
          {scholarship.introHtml && scholarship.introHtml.trim() ? (
            <div
              className="due-popup-html-content"
              dangerouslySetInnerHTML={{ __html: scholarship.introHtml }}
            />
          ) : scholarship.htmlContent && scholarship.htmlContent.trim() ? (
            <div
              className="due-popup-html-content"
              dangerouslySetInnerHTML={{ __html: scholarship.htmlContent }}
            />
          ) : (
            <div className="space-y-5">
              {scholarship.intro && (
                <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 font-normal">
                  {scholarship.intro}
                </p>
              )}
              {scholarship.sections &&
                scholarship.sections.map((section, idx) => (
                  <div key={section.id || idx} className="space-y-3">
                    <div className="flex items-center gap-2.5 bg-[#E1F0FD] py-1.5 px-3.5 rounded-full border border-blue-200/50">
                      <span className="w-5 h-5 rounded-full bg-[#FA541C] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs">
                        {section.number || idx + 1}
                      </span>
                      <h3 className="text-xs sm:text-[13px] font-black text-[#0B3B60] uppercase tracking-wide">
                        {section.title}
                      </h3>
                    </div>

                    <div className="flex items-start gap-4 pl-1">
                      {renderSectionIcon(section.icon, idx)}
                      <div className="flex-1 space-y-2 text-xs sm:text-[13px] text-slate-700 leading-relaxed pt-0.5">
                        {section.bullets &&
                          section.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FA541C] shrink-0 mt-2 shadow-xs" />
                              <span className="flex-1">{bullet}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {scholarship.documents && scholarship.documents.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase mb-2.5">
                Văn bản & Tài liệu đính kèm:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {scholarship.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    download
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 font-bold text-[10px] flex items-center justify-center uppercase shrink-0">
                        {doc.fileType || 'PDF'}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">{doc.title}</span>
                    </div>
                    <FileDown className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 sm:px-8 py-3 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          {/* Left tools: Share & Print */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Sao chép liên kết chia sẻ trực tiếp"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600 font-bold">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Chia sẻ link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>In trang</span>
            </button>
          </div>

          {/* Right: Blue Close Button "Đóng ✕" */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0F52BA] hover:bg-[#0B4899] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Đóng</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
