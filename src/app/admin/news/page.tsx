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
  Sparkles,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { NewsArticle } from '@/types';
import { initialData } from '@/data/initialData';
import { NewsModal, buildNewsHtmlDocument } from '@/components/NewsModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsArticle | null>(null);
  const [fullPreviewItem, setFullPreviewItem] = useState<NewsArticle | null>(null);
  const [message, setMessage] = useState('');
  const [previewHtml, setPreviewHtml] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBodyImg, setUploadingBodyImg] = useState(false);
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
      thumbnailUrl: '',
      externalUrl: '',
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
        setMessage('Đã cập nhật thứ tự hiển thị trên dải Hoạt động trao học bổng!');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Compress image in browser (max 1200px width, JPEG 0.82) so it works everywhere (including Vercel & Firestore)
  const compressImageToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new window.Image();
        img.onload = () => {
          const maxWidth = 1200;
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(ev.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = reject;
        img.src = ev.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;
    setUploadingImage(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setEditingItem({
        ...editingItem,
        thumbnailUrl: dataUrl,
      });
      setMessage(`Đã tải ảnh bìa "${file.name}" lên thành công!`);
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      console.error(err);
      window.alert('Đã xảy ra lỗi khi xử lý ảnh');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleInsertBodyImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingItem) return;
    setUploadingBodyImg(true);
    try {
      let appendedHtml = '';
      let firstImgUrl = '';
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const caption = window.prompt(
          `Nhập chú thích dưới ảnh "${f.name}" (Có thể để trống):`,
          ''
        );
        const dataUrl = await compressImageToDataUrl(f);
        if (!firstImgUrl) firstImgUrl = dataUrl;
        appendedHtml += `\n<figure style="margin: 18px 0; text-align: center;">\n  <img src="${dataUrl}" alt="${(caption || editingItem.title || 'Hình ảnh hoạt động').replace(/"/g, '&quot;')}" style="max-width: 100%; border-radius: 10px; box-shadow: 0 4px 16px rgba(13,63,115,0.1);" />${
          caption ? `\n  <figcaption style="font-size: 13.5px; color: #5b6b7c; font-style: italic; margin-top: 8px;">${caption}</figcaption>` : ''
        }\n</figure>\n`;
      }
      setEditingItem({
        ...editingItem,
        content: (editingItem.content || '') + appendedHtml,
        thumbnailUrl: editingItem.thumbnailUrl || firstImgUrl,
      });
      setMessage(`Đã chèn ${files.length} ảnh vào nội dung bài viết!`);
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      console.error(err);
      window.alert('Đã xảy ra lỗi khi chèn ảnh vào bài');
    } finally {
      setUploadingBodyImg(false);
      e.target.value = '';
    }
  };

  const handleInsertTemplate = () => {
    if (!editingItem) return;
    const sample = buildNewsHtmlDocument({
      ...editingItem,
      title: editingItem.title || 'LỄ TRAO HỌC BỔNG KHUYẾN KHÍCH HỌC TẬP & TÀI TRỢ DOANH NGHIỆP DUE',
      excerpt:
        editingItem.excerpt ||
        'Trường Đại học Kinh tế – Đại học Đà Nẵng trang trọng tổ chức Lễ trao học bổng nhằm vinh danh và tiếp sức cho các sinh viên có thành tích học tập, rèn luyện xuất sắc.',
      content:
        editingItem.content ||
        `<p>Buổi lễ có sự tham dự của Đại diện Ban Giám hiệu Nhà trường, Lãnh đạo Phòng Công tác Sinh viên, đại diện các đơn vị doanh nghiệp đối tác tài trợ cùng đông đảo các bạn sinh viên được nhận học bổng.</p>
<h3>1. Vinh danh những nỗ lực học tập và rèn luyện</h3>
<p>Phát biểu tại buổi lễ, đại diện Nhà trường gửi lời chúc mừng nồng nhiệt đến các sinh viên xuất sắc và khẳng định các chương trình học bổng tại DUE luôn đồng hành, tạo động lực giúp người học phát triển toàn diện.</p>
<h3>2. Cam kết đồng hành cùng người học</h3>
<ul>
  <li>Tiếp tục mở rộng mạng lưới học bổng doanh nghiệp và cựu sinh viên.</li>
  <li>Tăng cường các suất học bổng trao đổi quốc tế và hỗ trợ sinh viên vượt khó.</li>
</ul>`,
    });
    setEditingItem({
      ...editingItem,
      content: sample,
    });
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
        setMessage('Đã lưu và xuất bản bài viết tin tức thành công!');
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
            <span>Quản lý Tin tức – Hoạt động trao học bổng ({newsList.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bài viết đăng tại đây sẽ hiển thị trực tiếp trên dải <strong>&ldquo;Hoạt động trao học bổng&rdquo;</strong> ngoài Trang chủ và trang <strong>/tin-tuc</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng bài tin tức / sự kiện mới</span>
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

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {article.excerpt || (article.content || '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, '').slice(0, 180)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setFullPreviewItem(article)}
                className="px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                title="Xem trước bài viết Full màn hình giống ngoài Trang chủ"
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
            Chưa có bài viết tin tức / sự kiện nào. Nhấn &ldquo;Đăng bài tin tức / sự kiện mới&rdquo; để bắt đầu.
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
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-[#1760AB]" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  {editingItem.title ? 'Chỉnh sửa bài viết Tin tức / Sự kiện' : 'Đăng bài Tin tức / Sự kiện mới'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFullPreviewItem(editingItem)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem trước Full trang</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Tiêu đề bài viết / Tên sự kiện trao học bổng *
                    </label>
                    <input
                      required
                      type="text"
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="vd: Lễ trao Học bổng Khuyến khích học tập & Doanh nghiệp tài trợ Học kỳ I..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Chuyên mục</label>
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ngày đăng / Ngày diễn ra *</label>
                    <input
                      type="date"
                      value={editingItem.publishedAt}
                      onChange={(e) => setEditingItem({ ...editingItem, publishedAt: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Link bài viết ngoài (Tùy chọn – Để trống nếu mở bài viết trực tiếp trên Cổng)</span>
                    </label>
                    <input
                      type="text"
                      value={editingItem.externalUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, externalUrl: e.target.value })}
                      placeholder="https://due.udn.vn/... (Nếu chỉ muốn bấm vào thẻ mở sang link web trường thì dán vào đây)"
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
                    <span>Ghim lên đầu dải sự kiện</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editingItem.isActive !== false}
                      onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Hiển thị công khai ngoài Trang chủ</span>
                  </label>
                </div>

                {/* Thumbnail Image */}
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        Ảnh bìa hiển thị trên thẻ ngoài Trang chủ (Thumbnail)
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Tải ảnh ngang (PNG, JPG, WEBP) từ máy tính hoặc nhập đường dẫn ảnh
                      </span>
                    </div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-xs shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Đang tải lên...' : 'Chọn ảnh bìa từ máy'}</span>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    {editingItem.thumbnailUrl && (
                      <img
                        src={editingItem.thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-20 h-13 rounded-lg object-cover border border-slate-300 shrink-0"
                      />
                    )}
                    <input
                      type="text"
                      value={editingItem.thumbnailUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, thumbnailUrl: e.target.value })}
                      placeholder="/files/... hoặc https://..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tóm tắt ngắn (Sapo mở đầu bài viết)
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.excerpt}
                    onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                    placeholder="Đoạn mở đầu tóm tắt nội dung chính của bài viết hoặc sự kiện..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                {/* Content / HTML Editor with Real Iframe Preview */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        Nội dung bài viết (Viết chữ thường, đoạn HTML, hoặc dán nguyên trang HTML hoàn chỉnh)
                      </span>
                    </label>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <label className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer">
                        <ImageIcon className="w-3 h-3" />
                        <span>{uploadingBodyImg ? 'Đang chèn...' : 'Chèn 1 hoặc nhiều ảnh vào bài'}</span>
                        <input
                          type="file"
                          multiple
                          accept=".png,.jpg,.jpeg,.webp"
                          onChange={handleInsertBodyImage}
                          disabled={uploadingBodyImg}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={handleInsertTemplate}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 cursor-pointer"
                        title="Tạo khung HTML trang tin tức chuẩn DUE"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Chèn mẫu HTML chuẩn DUE</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPreviewHtml(!previewHtml)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${
                          previewHtml
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'text-blue-600 hover:text-blue-800 bg-blue-50 border-blue-200'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>{previewHtml ? 'Quay lại soạn thảo' : 'Xem trước trực tiếp'}</span>
                      </button>
                    </div>
                  </div>

                  {previewHtml ? (
                    <div className="w-full h-[460px] rounded-xl border-2 border-blue-400 overflow-hidden shadow-inner bg-slate-100">
                      <iframe
                        srcDoc={buildNewsHtmlDocument(editingItem)}
                        title="Xem trước bài viết tin tức"
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  ) : (
                    <textarea
                      rows={12}
                      value={editingItem.content}
                      onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                      placeholder="Bạn có thể:&#10;1. Viết văn bản bình thường (hệ thống tự động đóng khung trang tin tức DUE đẹp mắt).&#10;2. Hoặc dán các thẻ HTML (<p>, <h3>, <ul>, <img>, <table>...).&#10;3. Hoặc dán nguyên 1 file <!DOCTYPE html><html>...</html> hoàn chỉnh (giống như 21 file học bổng)."
                      className="w-full p-3.5 font-mono text-xs bg-slate-950 text-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed shadow-inner min-h-[260px]"
                      spellCheck={false}
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
                  Lưu & Xuất bản bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-Screen Preview Modal identical to Homepage */}
      <NewsModal
        article={fullPreviewItem}
        onClose={() => setFullPreviewItem(null)}
      />
    </div>
  );
}
