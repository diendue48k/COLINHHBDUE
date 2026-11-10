'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Share2,
  Printer,
  Check,
} from 'lucide-react';
import { Scholarship } from '@/types';

interface ScholarshipModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
}

export const ScholarshipModal: React.FC<ScholarshipModalProps> = ({
  scholarship,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.print();
    } else {
      window.print();
    }
  };

  const htmlSource = scholarship.introHtml || scholarship.htmlContent || '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/65 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[1100px] h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Floating Top-Right Close Button with high contrast */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-40 w-9 h-9 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center transition-all backdrop-blur-xs shadow-lg cursor-pointer"
          title="Đóng (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container hosting the full HTML in an iframe */}
        <div className="flex-1 w-full h-full overflow-hidden bg-[#f4f8fc]">
          {htmlSource ? (
            <iframe
              ref={iframeRef}
              srcDoc={htmlSource}
              title={scholarship.title}
              className="w-full h-full border-0"
            />
          ) : (
            <div className="p-8 text-center text-slate-500 font-medium">
              Đang tải nội dung học bổng...
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
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

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-1.5 rounded-xl bg-[#0F52BA] hover:bg-[#0B4899] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <span>Đóng</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
