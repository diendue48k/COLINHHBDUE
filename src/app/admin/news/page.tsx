'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Newspaper,
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  Upload,
  Pin,
  ArrowUp,
  ArrowDown,
  Search,
  ArrowLeft,
  Save,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';
import { NewsArticle } from '@/types';
import { initialData } from '@/data/initialData';
import { NewsModal } from '@/components/NewsModal';
import { WordPressEditor, compressImageFile } from '@/components/WordPressEditor';

const NEWS_CATEGORIES = [
  'Lễ trao học bổng',
  'Tin hoạt động học bổng',
  'Gương sáng sinh viên DUE',
  'Hợp tác doanh nghiệp & Tài trợ',
  'Học bổng & Giao lưu quốc tế',
  'Tin tức chung',
];

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsArticle[]>(initialData.news || []);
  const [editingItem, setEditingItem] = useState<NewsArticle | null>(null);
  const [fullPreviewItem, setFullPreviewItem] = useState<NewsArticle | null>(null);
  const [message, setMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
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
    setEditingItem({
      id: `news-${Date.now()}`,
      slug: `tin-tuc-${Date.now()}`,
      title: '',
      excerpt: '',
      content: '',
      category: NEWS_CATEGORIES[0],
      thumbnailUrl: '',
      externalUrl: '',
      publishedAt: new Date().toISOString().split('T')[0],
      author: 'Phòng Công tác Sinh viên DUE',
      isPinned: false,
      isActive: true,
      viewsCount: 0,
      order: newsList.length + 1,
    });
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingItem({ ...article });
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
        setMessage(updated.isActive ? 'Đã hiển thị bài viết ngoài Trang chủ!' : 'Đã ẩn bài viết!');
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
        setMessage('Đã cập nhật vị trí bài viết trên dải Hoạt động trao học bổng!');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;
    setUploadingImage(true);
    try {
      const dataUrl = await compressImageFile(file);
      setEditingItem({
        ...editingItem,
        thumbnailUrl: dataUrl,
      });
      setMessage(`Đã đặt ảnh đại diện (Featured Image) thành công!`);
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      console.error(err);
      window.alert('Đã xảy ra lỗi khi xử lý ảnh');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.title.trim()) {
      window.alert('Vui lòng nhập tiêu đề bài viết!');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_news', payload: editingItem }),
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.news)) setNewsList(json.news);
        setMessage('Đã lưu và xuất bản bài viết thành công!');
        setEditingItem(null);
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
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
        setMessage('Đã xóa bài viết!');
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // =====================================================================
  // VIEW 1: WORDPRESS-STYLE 2-COLUMN FULL PAGE POST EDITOR
  // =====================================================================
  if (editingItem) {
    return (
      <div className="space-y-5 pb-14">
        {/* Top Sticky Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách</span>
            </button>
            <h2 className="text-sm sm:text-base font-black text-slate-800 uppercase tracking-tight">
              {newsList.some((n) => n.id === editingItem.id)
                ? 'Chỉnh sửa bài viết Tin tức / Sự kiện'
                : 'Viết bài Tin tức / Sự kiện mới'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFullPreviewItem(editingItem)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Xem thử bài viết (Full trang)</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#165fa8] hover:bg-[#0d3f73] text-white text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Đang đăng...' : 'Đăng / Cập nhật bài viết'}</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>{message}</span>
          </div>
        )}

        {/* WordPress 2-Column Layout: Left 2/3 Content, Right 1/3 Meta Sidebar */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT COLUMN (2/3): Title, Excerpt & WordPress Visual/HTML Editor */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title Input like WordPress */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tiêu đề bài viết / Tên sự kiện trao học bổng *
                </label>
                <input
                  required
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Nhập tiêu đề bài viết tại đây..."
                  className="w-full p-3.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-xl text-base sm:text-lg font-extrabold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Đoạn mở đầu / Tóm tắt ngắn (Sapo – Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={editingItem.excerpt}
                  onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                  placeholder="Viết 1-2 câu giới thiệu ngắn gọn hiển thị ở đầu bài viết..."
                  className="w-full p-3 bg-slate-50 focus:bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* WordPress Rich Text & HTML Editor */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider px-1">
                Nội dung bài viết (Soạn trực quan như Word hoặc chuyển qua tab Mã HTML)
              </label>
              <WordPressEditor
                value={editingItem.content}
                onChange={(html) => setEditingItem({ ...editingItem, content: html })}
                onFirstImageInserted={(dataUrl) => {
                  if (!editingItem.thumbnailUrl) {
                    setEditingItem((prev) => (prev ? { ...prev, thumbnailUrl: dataUrl } : prev));
                  }
                }}
              />
            </div>
          </div>

          {/* RIGHT SIDEBAR (1/3): WordPress Meta Boxes */}
          <div className="space-y-5">
            {/* Box 1: Đăng bài (Publish Box) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-black text-slate-800 uppercase tracking-tight">
                1. Thiết lập Đăng bài
              </div>
              <div className="p-4 space-y-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày đăng / Ngày sự kiện</label>
                  <input
                    type="date"
                    value={editingItem.publishedAt}
                    onChange={(e) => setEditingItem({ ...editingItem, publishedAt: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tác giả / Đơn vị đăng</label>
                  <input
                    type="text"
                    value={editingItem.author || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                    placeholder="Phòng Công tác Sinh viên DUE"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-1 space-y-2.5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editingItem.isActive !== false}
                      onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Hiển thị công khai trên Cổng</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editingItem.isPinned || false}
                      onChange={(e) => setEditingItem({ ...editingItem, isPinned: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Ghim làm Tin nổi bật đầu tiên</span>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setFullPreviewItem(editingItem)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-center cursor-pointer"
                  >
                    Xem thử
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#165fa8] hover:bg-[#0d3f73] text-white font-bold text-center shadow-xs cursor-pointer"
                  >
                    {saving ? 'Đang lưu...' : 'Đăng bài'}
                  </button>
                </div>
              </div>
            </div>

            {/* Box 2: Chuyên mục (Category Box) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-black text-slate-800 uppercase tracking-tight">
                2. Chuyên mục Tin tức
              </div>
              <div className="p-4 space-y-2">
                {NEWS_CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer font-semibold text-slate-700"
                  >
                    <input
                      type="radio"
                      name="newsCategory"
                      checked={editingItem.category === cat}
                      onChange={() => setEditingItem({ ...editingItem, category: cat })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Box 3: Ảnh đại diện bài viết (Featured Image Box like WordPress) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-black text-slate-800 uppercase tracking-tight">
                3. Ảnh đại diện (Featured Image)
              </div>
              <div className="p-4 space-y-3">
                {editingItem.thumbnailUrl ? (
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                      <img
                        src={editingItem.thumbnailUrl}
                        alt="Featured"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, thumbnailUrl: '' })}
                      className="text-red-600 hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      ✕ Xóa ảnh đại diện
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 space-y-1">
                    <ImageIcon className="w-7 h-7 mx-auto text-slate-300" />
                    <p className="font-semibold text-slate-500">Chưa có ảnh đại diện</p>
                    <p className="text-[11px]">Ảnh này sẽ hiển thị trên thẻ ngoài Trang chủ</p>
                  </div>
                )}

                <label className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#165fa8] border border-blue-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? 'Đang tải ảnh...' : 'Tải ảnh đại diện từ máy tính'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Hoặc dán link ảnh có sẵn:
                  </label>
                  <input
                    type="text"
                    value={editingItem.thumbnailUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, thumbnailUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Box 4: Link ngoài (Optional External Link) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>4. Link bài gốc (Tùy chọn)</span>
              </div>
              <div className="p-4 space-y-1.5">
                <input
                  type="text"
                  value={editingItem.externalUrl || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, externalUrl: e.target.value })}
                  placeholder="https://due.udn.vn/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
                <p className="text-[11px] text-slate-400">
                  Để trống nếu muốn người học đọc bài viết trực tiếp trên Cổng học bổng.
                </p>
              </div>
            </div>
          </div>
        </form>

        <NewsModal
          article={fullPreviewItem}
          onClose={() => setFullPreviewItem(null)}
        />
      </div>
    );
  }

  // =====================================================================
  // VIEW 2: POSTS LISTING TABLE
  // =====================================================================
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
            <span>Quản lý Tin tức – Hoạt động trao học bổng ({newsList.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Trình soạn thảo trực quan chuẩn WordPress: viết bài, chèn ảnh dễ dàng như Word hoặc dán mã HTML
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Viết bài tin tức mới</span>
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
              {article.thumbnailUrl ? (
                <img
                  src={article.thumbnailUrl}
                  alt={article.title}
                  className="w-28 h-18 rounded-xl object-cover border border-slate-200 shrink-0 hidden sm:block"
                />
              ) : (
                <div className="w-28 h-18 rounded-xl bg-gradient-to-br from-[#0d3f73] to-[#165fa8] text-white/80 flex items-center justify-center shrink-0 hidden sm:flex text-[10px] font-bold">
                  Chưa có ảnh
                </div>
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

                <h3
                  onClick={() => handleEdit(article)}
                  className="text-sm font-bold text-slate-900 hover:text-blue-700 cursor-pointer leading-snug"
                >
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {article.excerpt ||
                    (article.content || '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '')
                      .replace(/<[^>]+>/g, '')
                      .slice(0, 180)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setFullPreviewItem(article)}
                className="px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                title="Xem bài viết Full màn hình giống ngoài Trang chủ"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem bài</span>
              </button>
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
                className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                title="Chỉnh sửa bài viết"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Sửa</span>
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
            Chưa có bài viết tin tức / sự kiện nào. Nhấn &ldquo;Viết bài tin tức mới&rdquo; để bắt đầu.
          </div>
        )}
      </div>

      <NewsModal
        article={fullPreviewItem}
        onClose={() => setFullPreviewItem(null)}
      />
    </div>
  );
}
