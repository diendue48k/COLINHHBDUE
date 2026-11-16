'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Newspaper,
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  CheckCircle2,
  Code,
  Eye,
  EyeOff,
  Upload,
  Pin,
  ArrowUp,
  ArrowDown,
  Search,
} from 'lucide-react';
import { NewsArticle } from '@/types';
import { initialData } from '@/data/initialData';

const NEWS_CATEGORIES = [
  'Tin hoạt động học bổng',
  'Lễ trao học bổng',
  'Gương sáng sinh viên DUE',
  'Hợp tác doanh nghiệp & Tài trợ',
  'Học bổng & Giao lưu quốc tế',
  'Tin tức chung',
];

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsArticle[]>(initialData.news || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsArticle | null>(null);
  const [message, setMessage] = useState('');
  const [previewHtml, setPreviewHtml] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadData = async () => {
    try {
      const res = await fetch('/api/data?type=news', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) setNewsList(json);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sortedNews = useMemo(() => {
    return [...newsList].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if ((a.order || 0) !== (b.order || 0)) {
        return (a.order || 999) - (b.order || 999);
      }
      return (b.publishedAt || '').localeCompare(a.publishedAt || '');
    });
  }, [newsList]);

  const filteredNews = useMemo(() => {
    return sortedNews.filter((n) => {
      if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          (n.excerpt || '').toLowerCase().includes(q) ||
          (n.content || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sortedNews, selectedCategory, searchQuery]);

  const handleCreate = () => {
    const newItem: NewsArticle = {
      id: `news-${Date.now()}`,
      slug: `tin-tuc-${Date.now()}`,
      title: '',
      excerpt: '',
      content: '',
      category: NEWS_CATEGORIES[0],
      thumbnailUrl: '/images/due-students-banner-clean.jpg',
      publishedAt: new Date().toISOString().split('T')[0],
      author: 'Phòng Công tác Sinh viên DUE',
      isPinned: false,
      isActive: true,
      viewsCount: 0,
      order: newsList.length + 1,
    };
    setEditingItem(newItem);
    setPreviewHtml(false);
    setIsModalOpen(true);
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingItem({ ...article });
    setPreviewHtml(false);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (article: NewsArticle) => {
    const updated: NewsArticle = {
      ...article,
      isActive: article.isActive === false ? true : false,
    };
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_news', payload: updated }),
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.news)) setNewsList(json.news);
        setMessage(updated.isActive ? 'Đã hiển thị bài viết tin tức!' : 'Đã ẩn bài viết tin tức!');
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveNews = async (article: NewsArticle, direction: -1 | 1) => {
    const currentIdx = sortedNews.findIndex((n) => n.id === article.id);
    const targetIdx = currentIdx + direction;
    if (currentIdx < 0 || targetIdx < 0 || targetIdx >= sortedNews.length) return;

    const reordered = [...sortedNews];
    const [moved] = reordered.splice(currentIdx, 1);
    reordered.splice(targetIdx, 0, moved);

    const updates = reordered.map((n, idx) => ({ id: n.id, order: idx + 1 }));
    setNewsList((prev) =>
      prev.map((n) => {
        const u = updates.find((x) => x.id === n.id);
        return u ? { ...n, order: u.order } : n;
      })
    );

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder_news', payload: { items: updates } }),
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) setNewsList(json.data);
        setMessage('Đã cập nhật thứ tự bài viết tin tức!');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;
    setUploadingImage(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setEditingItem({
          ...editingItem,
          thumbnailUrl: json.attachmentUrl,
        });
        setMessage(`Đã tải ảnh đại diện "${json.attachmentName || file.name}" lên thành công!`);
        setTimeout(() => setMessage(''), 2500);
      } else {
        window.alert(json.error || 'Tải ảnh lên thất bại');
      }
    } catch (err) {
      console.error(err);
      window.alert('Đã xảy ra lỗi khi tải ảnh lên');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_news', payload: editingItem }),
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.news)) setNewsList(json.news);
        setMessage('Đã lưu bài viết tin tức thành công!');
        setIsModalOpen(false);
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_news', payload: { id } }),
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.news)) setNewsList(json.news);
        setMessage('Đã xóa bài viết tin tức!');
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-[#1760AB]" />
            <span>Quản lý Tin tức & Sự kiện Học bổng ({newsList.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Đăng tải tin tức hoạt động, lễ trao học bổng, gương sáng sinh viên và sự kiện hợp tác tài trợ
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng bài tin tức mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết tin tức..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium shrink-0">Chuyên mục:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-blue-500 text-xs w-full sm:w-auto"
          >
            <option value="all">Tất cả chuyên mục ({newsList.length})</option>
            {NEWS_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* News List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {filteredNews.map((article, idx) => (
          <div
            key={article.id}
            className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors ${
              article.isActive === false ? 'opacity-60 bg-slate-50/50' : ''
            }`}
          >
            <div className="flex items-start gap-4 min-w-0 flex-1">
              {article.thumbnailUrl && (
                <img
                  src={article.thumbnailUrl}
                  alt={article.title}
                  className="w-24 h-16 rounded-xl object-cover border border-slate-200 shrink-0 hidden sm:block"
                />
              )}

              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    {article.category}
                  </span>
                  {article.isPinned && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5" />
                      <span>TIN NỔI BẬT</span>
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      article.isActive === false
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {article.isActive === false ? 'Đang ẩn' : 'Đang hiển thị'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Ngày đăng: {article.publishedAt}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {article.excerpt || article.content.replace(/<[^>]+>/g, '')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => handleMoveNews(article, -1)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Chuyển lên"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={idx === filteredNews.length - 1}
                onClick={() => handleMoveNews(article, 1)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Chuyển xuống"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleToggleActive(article)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  article.isActive === false
                    ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                    : 'text-emerald-600 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title={article.isActive === false ? 'Bật hiển thị bài viết' : 'Ẩn bài viết'}
              >
                {article.isActive === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => handleEdit(article)}
                className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                title="Sửa bài viết"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(article.id, article.title)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                title="Xóa bài viết"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredNews.length === 0 && (
          <div className="p-10 text-center text-xs text-slate-400 italic">
            Chưa có bài viết tin tức nào. Nhấn &ldquo;Đăng bài tin tức mới&rdquo; để bắt đầu.
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-[#1760AB]" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  {editingItem.title ? 'Chỉnh sửa bài viết tin tức' : 'Đăng bài tin tức mới'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 min-h-0">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tiêu đề bài viết tin tức *</label>
                  <input
                    required
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="Nhập tiêu đề bài viết tin tức..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Chuyên mục tin tức</label>
                    <select
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      {NEWS_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ngày đăng *</label>
                    <input
                      type="date"
                      value={editingItem.publishedAt}
                      onChange={(e) => setEditingItem({ ...editingItem, publishedAt: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1 pb-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editingItem.isPinned || false}
                      onChange={(e) => setEditingItem({ ...editingItem, isPinned: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Ghim làm Tin nổi bật</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editingItem.isActive !== false}
                      onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Hiển thị công khai ngoài Cổng thông tin</span>
                  </label>
                </div>

                {/* Thumbnail Image */}
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-800 block">Ảnh đại diện bài viết (Thumbnail)</span>
                      <span className="text-[10px] text-slate-500">
                        Tải ảnh từ máy tính (PNG, JPG) hoặc dán đường dẫn URL hình ảnh
                      </span>
                    </div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-xs shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Đang tải lên...' : 'Tải ảnh lên'}</span>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={editingItem.thumbnailUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, thumbnailUrl: e.target.value })}
                    placeholder="/images/... hoặc https://..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tóm tắt ngắn (Sapo)</label>
                  <textarea
                    rows={2}
                    value={editingItem.excerpt}
                    onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                    placeholder="Đoạn mở đầu tóm tắt nội dung chính của bài viết..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-700 text-xs flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-blue-600" />
                      <span>Nội dung chi tiết bài viết (Hỗ trợ văn bản & HTML) *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setPreviewHtml(!previewHtml)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{previewHtml ? 'Quay lại soạn thảo' : 'Xem trước trực tiếp'}</span>
                    </button>
                  </div>

                  {previewHtml ? (
                    <div
                      className="p-4 rounded-xl border border-blue-200 bg-slate-50 min-h-[160px] text-xs text-slate-800 space-y-2 max-h-[260px] overflow-y-auto"
                      dangerouslySetInnerHTML={{
                        __html:
                          editingItem.content ||
                          '<p class="text-slate-400 italic">Chưa có nội dung để xem trước...</p>',
                      }}
                    />
                  ) : (
                    <textarea
                      required
                      rows={7}
                      value={editingItem.content}
                      onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                      placeholder="Nhập nội dung bài viết tin tức. Có thể nhập văn bản thuần hoặc mã HTML..."
                      className="w-full p-3 font-mono text-xs bg-slate-950 text-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed shadow-inner min-h-[160px]"
                    />
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3.5 border-t border-slate-200 flex items-center justify-end gap-2.5 bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Lưu bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
