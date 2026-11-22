'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NewsModal } from '@/components/NewsModal';
import { NewsArticle } from '@/types';
import { initialData } from '@/data/initialData';
import { Calendar, ArrowLeft, Search, ChevronRight, Newspaper } from 'lucide-react';

function NewsPageContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');

  const [newsList, setNewsList] = useState<NewsArticle[]>(initialData.news || []);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    fetch('/api/data?type=news', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNewsList(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (idParam && newsList.length > 0) {
      const found = newsList.find((n) => n.id === idParam || n.slug === idParam);
      if (found) {
        setSelectedArticle(found);
      }
    }
  }, [idParam, newsList]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    newsList.forEach((n) => {
      if (n.isActive !== false && n.category) set.add(n.category);
    });
    return Array.from(set);
  }, [newsList]);

  const filtered = useMemo(() => {
    return newsList
      .filter((n) => {
        if (n.isActive === false) return false;
        if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            n.title.toLowerCase().includes(q) ||
            (n.excerpt || '').toLowerCase().includes(q) ||
            (n.content || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if ((a.order || 0) !== (b.order || 0)) {
          return (a.order || 999) - (b.order || 999);
        }
        return (b.publishedAt || '').localeCompare(a.publishedAt || '');
      });
  }, [newsList, selectedCategory, search]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 mb-6 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang chủ</span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0B2545] uppercase tracking-tight flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-[#1760AB]" />
                <span>Tin tức & Sự kiện Học bổng DUE</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Cập nhật các hoạt động trao học bổng, hợp tác doanh nghiệp và gương sáng sinh viên Trường Đại học Kinh tế – ĐHĐN
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết tin tức..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category filter pills */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#1760AB] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1760AB] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* News Cards Grid */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 italic border border-dashed border-slate-200 rounded-2xl">
              Hiện chưa có bài viết tin tức nào được đăng tải.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#1760AB] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {article.thumbnailUrl && (
                      <div className="h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={article.thumbnailUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1760AB] border border-blue-200 uppercase">
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{article.publishedAt}</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1760AB] leading-snug line-clamp-2 transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {article.excerpt ||
                          (article.content || '')
                            .replace(/<style[\s\S]*?<\/style>/gi, '')
                            .replace(/<[^>]+>/g, '')
                            .slice(0, 180)}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1760AB]">
                    <span className="flex items-center gap-1">
                      <span>Đọc bài viết</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <NewsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Đang tải Tin tức...</div>}>
      <NewsPageContent />
    </Suspense>
  );
}
