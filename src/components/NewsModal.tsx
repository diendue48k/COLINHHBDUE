'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Calendar,
  Share2,
  Printer,
  Check,
  User,
  ExternalLink,
} from 'lucide-react';
import { NewsArticle } from '@/types';

interface NewsModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export function buildNewsHtmlDocument(article: NewsArticle): string {
  const raw = (article.content || '').trim();
  const isFullHtml =
    /<!DOCTYPE\s+html/i.test(raw) ||
    /<html[\s>]/i.test(raw) ||
    /<head[\s>]/i.test(raw) ||
    /<body[\s>]/i.test(raw) ||
    /<style[\s>]/i.test(raw);

  if (isFullHtml) {
    let html = raw;
    if (!html.includes('/fonts/fonts.css')) {
      if (/<head[\s>]/i.test(html)) {
        html = html.replace(/<head([^>]*)>/i, '<head$1>\n<link rel="stylesheet" href="/fonts/fonts.css">');
      } else {
        html = `<link rel="stylesheet" href="/fonts/fonts.css">\n${html}`;
      }
    }
    return html;
  }

  // Determine whether raw is HTML fragment or plain text
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(raw);
  const bodyContent = hasHtmlTags
    ? raw
    : raw
        .split(/\n\s*\n/)
        .map((para) => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
        .join('\n');

  const thumbSection = article.thumbnailUrl
    ? `<div class="anh-chinh"><img src="${article.thumbnailUrl}" alt="${(article.title || '').replace(/"/g, '&quot;')}" /></div>`
    : '';

  const excerptSection = article.excerpt
    ? `<div class="sapo">${article.excerpt}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${article.title || 'Tin tức & Sự kiện Học bổng DUE'}</title>
<link rel="stylesheet" href="/fonts/fonts.css">
<style>
:root {
  --cam: #f26522;
  --la: #0f9145;
  --duong: #165fa8;
  --duong-dam: #0d3f73;
  --chu: #1f2d3d;
  --chu-phu: #5b6b7c;
  --vien: #e6ebf1;
  --nen: #f5f7fa;
  --trang: #ffffff;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: "SVN-Gilroy", "SVN-Griloy", "Segoe UI", Arial, sans-serif;
  background: var(--nen);
  color: var(--chu);
  font-size: 15.5px;
  line-height: 1.7;
}
a { color: var(--duong); }
img { max-width: 100%; height: auto; border-radius: 10px; }
.container { width: min(920px, 92%); margin: auto; }
.thanh-tren { background: var(--trang); border-bottom: 1px solid var(--vien); }
.thanh-tren .container { padding: 8px 0; display: flex; align-items: center; justify-content: space-between; }
.ve-trang-chu { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; }
.ve-trang-chu .logo { height: 48px; width: auto; display: block; }
.banner {
  position: relative;
  color: var(--trang);
  background: linear-gradient(120deg, var(--duong-dam), var(--duong));
  padding: 28px 0 32px;
}
.banner::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: 0; height: 4px;
  background: linear-gradient(90deg, var(--cam) 0 33.3%, var(--la) 33.3% 66.6%, var(--duong) 66.6%);
}
.meta-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  color: rgba(255,255,255,0.88);
}
.chuyen-muc {
  background: var(--cam);
  color: #fff;
  font-weight: 800;
  padding: 3px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.4px;
}
.banner h1 {
  font-size: clamp(21px, 3vw, 30px);
  line-height: 1.35;
  font-weight: 800;
}
main { padding: 26px 0 38px; }
.bai-viet {
  background: var(--trang);
  border: 1px solid var(--vien);
  border-radius: 14px;
  padding: 26px 30px;
  box-shadow: 0 4px 18px rgba(13,63,115,0.06);
}
.sapo {
  font-weight: 700;
  color: var(--duong-dam);
  background: #eef4fb;
  border-left: 4px solid var(--duong);
  padding: 12px 16px;
  border-radius: 0 10px 10px 0;
  margin-bottom: 20px;
}
.anh-chinh {
  margin-bottom: 22px;
  text-align: center;
}
.anh-chinh img {
  max-height: 460px;
  width: auto;
  margin: auto;
  object-fit: cover;
  box-shadow: 0 4px 16px rgba(13,63,115,0.1);
}
.noi-dung-bai-viet > * + * { margin-top: 14px; }
.noi-dung-bai-viet h2, .noi-dung-bai-viet h3 {
  color: var(--duong-dam);
  font-weight: 800;
  margin-top: 20px;
  margin-bottom: 8px;
}
.noi-dung-bai-viet ul, .noi-dung-bai-viet ol {
  padding-left: 22px;
}
.noi-dung-bai-viet li + li { margin-top: 6px; }
.noi-dung-bai-viet table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}
.noi-dung-bai-viet th {
  background: #eef4fb;
  color: var(--duong-dam);
  font-weight: 700;
  padding: 10px 12px;
  border: 1px solid var(--vien);
  text-align: left;
}
.noi-dung-bai-viet td {
  padding: 10px 12px;
  border: 1px solid var(--vien);
}
.chan-trang {
  position: relative;
  padding: 16px 15px;
  background: var(--duong-dam);
  color: var(--trang);
  text-align: center;
  font-size: 13.5px;
}
.chan-trang::before {
  content: "";
  position: absolute;
  left: 0; right: 0; top: 0; height: 4px;
  background: linear-gradient(90deg, var(--cam) 0 33.3%, var(--la) 33.3% 66.6%, var(--duong) 66.6%);
}
@media (max-width: 600px) {
  .bai-viet { padding: 18px 16px; }
}
</style>
</head>
<body>
  <nav class="thanh-tren">
    <div class="container">
      <a href="index.html" class="ve-trang-chu">
        <img src="/images/logo-cong-thong-tin.png" alt="CỔNG THÔNG TIN HỌC BỔNG – TRƯỜNG ĐẠI HỌC KINH TẾ – ĐHĐN" class="logo" />
      </a>
    </div>
  </nav>
  <header class="banner">
    <div class="container">
      <div class="meta-bar">
        <span class="chuyen-muc">${article.category || 'Hoạt động trao học bổng'}</span>
        <span>📅 Ngày đăng: ${article.publishedAt || ''}</span>
        ${article.author ? `<span>• ✍️ ${article.author}</span>` : ''}
      </div>
      <h1>${article.title || ''}</h1>
    </div>
  </header>
  <main class="container">
    <article class="bai-viet">
      ${excerptSection}
      ${thumbSection}
      <div class="noi-dung-bai-viet">
        ${bodyContent}
      </div>
    </article>
  </main>
  <footer class="chan-trang">
    <strong>TRƯỜNG ĐẠI HỌC KINH TẾ – ĐẠI HỌC ĐÀ NẴNG</strong>
  </footer>
</body>
</html>`;
}

export const NewsModal: React.FC<NewsModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Intercept "ve-trang-chu" link inside iframe to close modal cleanly
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const attachHandler = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;
        doc.addEventListener(
          'click',
          (e) => {
            const a = (e.target as HTMLElement).closest('a');
            if (a) {
              const href = a.getAttribute('href');
              if (href === 'index.html' || href === '/' || a.classList.contains('ve-trang-chu')) {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }
            }
          },
          true
        );
      } catch (_) {}
    };

    iframe.addEventListener('load', attachHandler);
    attachHandler();
    const timer = setTimeout(attachHandler, 200);
    return () => {
      iframe.removeEventListener('load', attachHandler);
      clearTimeout(timer);
    };
  }, [article, onClose]);

  if (!article) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/tin-tuc?id=${article.id}`;
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

  const htmlSource = buildNewsHtmlDocument(article);

  return (
    <div className="fixed inset-0 z-50 bg-white animate-fade-in flex flex-col w-screen h-screen overflow-hidden">
      {/* Floating Top-Right Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="fixed right-4 top-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all backdrop-blur-xs shadow-lg cursor-pointer"
        title="Đóng (Esc)"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Full HTML Content in iframe so any custom CSS/HTML works 100% identically to Admin preview */}
      <div className="flex-1 w-full h-full overflow-hidden bg-[#f5f7fa]">
        <iframe
          ref={iframeRef}
          srcDoc={htmlSource}
          title={article.title}
          className="w-full h-full border-0"
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="px-6 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 shadow-md z-40">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600 font-bold">Đã sao chép!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Chia sẻ bài viết</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>In bài viết</span>
          </button>

          {article.externalUrl && (
            <a
              href={article.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
            >
              <span>Xem bài gốc</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-5 py-1.5 rounded-xl bg-[#165fa8] hover:bg-[#0d3f73] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <span>Đóng</span>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
