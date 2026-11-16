'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Calendar,
  Share2,
  Printer,
  Check,
  User,
} from 'lucide-react';
import { NewsArticle } from '@/types';

interface NewsModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (article) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [article]);

  if (!article) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/tin-tuc?id=${article.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[820px] max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/40 border-b border-slate-100 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#1760AB] text-white text-[11px] font-black uppercase tracking-wider">
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Ngày đăng: {article.publishedAt}</span>
            </span>
            {article.author && (
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.author}</span>
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-black text-[#0B3B60] leading-snug pr-8">
            {article.title}
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-[13.5px] text-slate-700 leading-relaxed">
          {article.thumbnailUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-[340px]">
              <img
                src={article.thumbnailUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {article.excerpt && (
            <div className="p-4 rounded-2xl bg-blue-50/50 border-l-4 border-[#1760AB] font-semibold text-slate-800">
              {article.excerpt}
            </div>
          )}

          <div className="space-y-4">
            {article.content && article.content.includes('<') ? (
              <div
                className="due-popup-html-content space-y-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <div className="whitespace-pre-line space-y-3 leading-relaxed">
                {article.content}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Chia sẻ</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In bài viết</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1760AB] hover:bg-blue-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
