'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Calendar,
  FileText,
  Download,
  Share2,
  Printer,
  Check,
} from 'lucide-react';
import { Announcement } from '@/types';

interface AnnouncementModalProps {
  announcement: Announcement | null;
  onClose: () => void;
}

export const ANNOUNCEMENT_CATEGORY_FILTERS = [
  { id: 'all', label: 'Tất cả thông báo', match: '', categoryId: '' },
  { id: 'dai-hoc', label: 'Học bổng Bậc Đại học', match: 'Đại học', categoryId: 'cat-1' },
  { id: 'ngoai-truong', label: 'Học bổng Đơn vị ngoài trường', match: 'ngoài trường', categoryId: 'cat-3' },
  { id: 'mien-giam', label: 'Chính sách Miễn giảm', match: 'miễn giảm', categoryId: 'cat-4' },
  { id: 'du-hoc', label: 'Học bổng Du học', match: 'Du học', categoryId: 'cat-6' },
  { id: 'sau-dai-hoc', label: 'Học bổng Bậc Sau đại học', match: 'Sau đại học', categoryId: 'cat-2' },
  { id: 'lien-ket', label: 'Học bổng Chương trình Cử nhân Liên kết quốc tế', match: 'Liên kết', categoryId: 'cat-5' },
];

export function matchesAnnouncementCategory(ann: Announcement, filterId: string): boolean {
  if (filterId === 'all') return true;
  const catObj = ANNOUNCEMENT_CATEGORY_FILTERS.find((c) => c.id === filterId);
  if (!catObj) return true;
  if (ann.categoryId && catObj.categoryId && ann.categoryId === catObj.categoryId) {
    return true;
  }
  const catLower = (ann.category || '').toLowerCase();
  if (filterId === 'dai-hoc') {
    return catLower.includes('đại học') && !catLower.includes('sau đại học');
  }
  if (filterId === 'sau-dai-hoc') {
    return catLower.includes('sau đại học');
  }
  if (filterId === 'mien-giam') {
    return catLower.includes('miễn giảm') || catLower.includes('chính sách');
  }
  return catLower.includes(catObj.match.toLowerCase());
}

export function triggerAnnouncementDownload(announcement: Announcement) {
  if (announcement.attachmentUrl && announcement.attachmentUrl !== '#') {
    const link = document.createElement('a');
    link.href = announcement.attachmentUrl;
    link.download = announcement.attachmentName || 'Thong_bao_DUE.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Generate a complete printable/downloadable official document when no external file URL is attached
  const docHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>${announcement.title}</title>
<style>
  body { font-family: "Times New Roman", Times, serif; line-height: 1.6; color: #111; max-width: 800px; margin: 40px auto; padding: 20px; }
  .header { display: flex; justify-content: space-between; text-align: center; margin-bottom: 30px; font-size: 13pt; }
  .title { text-align: center; font-weight: bold; font-size: 15pt; text-transform: uppercase; margin: 24px 0 8px; color: #0B3B60; }
  .meta { text-align: center; font-style: italic; font-size: 12pt; color: #444; margin-bottom: 24px; }
  .excerpt { font-weight: bold; margin-bottom: 16px; font-size: 13pt; }
  .content { font-size: 13pt; text-align: justify; }
  .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 16px; font-size: 12pt; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div>ĐẠI HỌC ĐÀ NẴNG</div>
      <strong>TRƯỜNG ĐẠI HỌC KINH TẾ</strong>
      <div>───────────</div>
    </div>
    <div>
      <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
      <div><strong>Độc lập – Tự do – Hạnh phúc</strong></div>
      <div>───────────────</div>
    </div>
  </div>
  <div class="title">${announcement.title}</div>
  <div class="meta">Danh mục: ${announcement.category} | Ngày công bố: ${announcement.publishedAt}${announcement.expiresAt ? ` | Hạn chót: ${announcement.expiresAt}` : ''}</div>
  ${announcement.excerpt ? `<div class="excerpt">${announcement.excerpt}</div>` : ''}
  <div class="content">${announcement.content}</div>
  <div class="footer">
    <strong>ĐƠN VỊ THƯỜNG TRỰC TIẾP NHẬN:</strong><br/>
    Phòng Công tác Sinh viên – Phòng H214, Tòa nhà Đa năng, Trường Đại học Kinh tế – Đại học Đà Nẵng<br/>
    Địa chỉ: 71 Ngũ Hành Sơn, Phường Ngũ Hành Sơn, TP. Đà Nẵng<br/>
    Hotline: 0236 3956 397 | Email: phongcongtacsinhvien@due.edu.vn
  </div>
</body>
</html>`;

  const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const baseName = (announcement.attachmentName || announcement.slug || 'Thong_bao_DUE')
    .replace(/\.(pdf|docx?|xlsx?)$/i, '');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${baseName}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  announcement,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

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

  const handleCopyLink = () => {
    const url = `${window.location.origin}/thong-bao?id=${announcement.id}`;
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
      <div className="relative w-full max-w-[800px] max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50/80 via-white to-orange-50/40 border-b border-slate-100 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#0B4899] text-white text-[11px] font-black uppercase tracking-wider">
              {announcement.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Ngày đăng: {announcement.publishedAt}</span>
            </span>
            {announcement.expiresAt && (
              <span className="text-xs text-orange-600 font-semibold">
                • Hạn chót: {announcement.expiresAt}
              </span>
            )}
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
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                    DOC
                  </div>
                  <span className="font-bold text-slate-800 text-xs truncate">
                    {announcement.attachmentName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerAnnouncementDownload(announcement)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0B4899] hover:bg-blue-800 text-white font-bold text-xs shrink-0 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải văn bản</span>
                </button>
              </div>
            </div>
          )}

          {/* Contact Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-[#0B4899] block">BỘ PHẬN PHỤ TRÁCH:</span>
            <p className="text-slate-800 font-semibold">
              Phòng Công tác Sinh viên – Phòng H214, Tòa nhà Đa năng, Trường Đại học Kinh tế – Đại học Đà Nẵng
            </p>
            <p className="text-slate-600">
              Địa chỉ: 71 Ngũ Hành Sơn, Phường Ngũ Hành Sơn, TP. Đà Nẵng | Hotline: 0236 3956 397 | Email: phongcongtacsinhvien@due.edu.vn
            </p>
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
              <span>In thông báo</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0B4899] hover:bg-blue-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
