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

  // Prevent anchor links inside iframe from navigating the iframe window
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const attachPrevent = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        // Intercept clicks on any tab or anchor
        const links = doc.querySelectorAll<HTMLAnchorElement>('a');
        links.forEach((a) => {
          a.onclick = (e) => {
            const href = a.getAttribute('href');
            if (href && href.startsWith('#')) {
              e.preventDefault();
              e.stopPropagation();
              const target = doc.querySelector(href);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
              doc.querySelectorAll('.tab-link').forEach((t) => t.classList.remove('active'));
              a.classList.add('active');
              return false;
            }
          };
        });

        // Also add document-level capture listener
        doc.addEventListener(
          'click',
          (e) => {
            const a = (e.target as HTMLElement).closest('a');
            if (a) {
              const href = a.getAttribute('href');
              if (href && href.startsWith('#')) {
                e.preventDefault();
                e.stopPropagation();
                const target = doc.querySelector(href);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                doc.querySelectorAll('.tab-link').forEach((t) => t.classList.remove('active'));
                a.classList.add('active');
              }
            }
          },
          true
        );
      } catch (_) {}
    };

    iframe.addEventListener('load', attachPrevent);
    attachPrevent();
    const timer = setTimeout(attachPrevent, 200);
    return () => {
      iframe.removeEventListener('load', attachPrevent);
      clearTimeout(timer);
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
      className="fixed inset-0 z-50 bg-white animate-fade-in flex flex-col w-screen h-screen overflow-hidden"
    >
      {/* Floating Top-Right Close Button with high contrast */}
      <button
        type="button"
        onClick={onClose}
        className="fixed right-4 top-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all backdrop-blur-xs shadow-lg cursor-pointer"
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
      <div className="px-6 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 shadow-md z-40">
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
  );
};
