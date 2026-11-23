'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  FileText,
  CheckCircle2,
  Eye,
  EyeOff,
  Upload,
  Pin,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { Announcement } from '@/types';
import { initialData } from '@/data/initialData';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import { WordPressEditor } from '@/components/WordPressEditor';

const CATEGORY_MAP: Record<string, string> = {
  'Học bổng bậc Đại học': 'cat-2',
  'Học bổng bậc Sau Đại học': 'cat-1',
  'Học bổng Chương trình liên kết quốc tế': 'cat-5',
  'Học bổng du học': 'cat-6',
  'Học bổng tài trợ': 'cat-3',
  'Chính sách xã hội': 'cat-4',
};

const ANNOUNCEMENT_CATEGORIES = Object.keys(CATEGORY_MAP);

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialData.announcements);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [previewItem, setPreviewItem] = useState<Announcement | null>(null);
  const [message, setMessage] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch('/api/data?type=announcements', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) setAnnouncements(json);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    setEditingItem({
      id: `ann-${Date.now()}`,
      slug: `thong-bao-${Date.now()}`,
      title: '',
      excerpt: '',
      content: '',
      category: ANNOUNCEMENT_CATEGORIES[0],
      categoryId: 'cat-2',
      publishedAt: new Date().toISOString().split('T')[0],
      expiresAt: '',
      isPinned: true,
      isActive: true,
      badgeText: 'MỚI',
      attachmentName: '',
      attachmentUrl: '',
    });
  };

  const handleEdit = (ann: Announcement) => {
    setEditingItem({
      ...ann,
      attachmentUrl: ann.attachmentUrl === '#' ? '' : ann.attachmentUrl || '',
    });
  };

  const handleToggleActive = async (ann: Announcement) => {
    const updated: Announcement = {
      ...ann,
      isActive: ann.isActive === false ? true : false,
    };
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_announcement', payload: updated }),
      });
      if (res.ok) {
        setMessage(updated.isActive ? 'Đã hiển thị thông báo!' : 'Đã ẩn thông báo!');
        await loadData();
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;
    setUploadingFile(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const json = await res.json();
      if (res.ok && (json.ok || json.success)) {
        setEditingItem({
          ...editingItem,
          attachmentName: json.attachmentName || json.fileName || file.name,
          attachmentUrl: json.attachmentUrl || json.url,
        });
        setMessage(`Đã đính kèm tệp "${file.name}" thành công!`);
        setTimeout(() => setMessage(''), 2500);
      } else {
        window.alert(json.error || 'Tải tệp lên thất bại');
      }
    } catch (err) {
      console.error(err);
      window.alert('Đã xảy ra lỗi khi tải tệp lên');
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.title.trim()) {
      window.alert('Vui lòng nhập tiêu đề thông báo!');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_announcement', payload: editingItem }),
      });
      if (res.ok) {
        setMessage('Đã lưu và đăng thông báo thành công!');
        setEditingItem(null);
        await loadData();
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa thông báo "${title}"?`)) return;
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_announcement', payload: { id } }),
      });
      if (res.ok) {
        setMessage('Đã xóa thông báo!');
        await loadData();
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // =====================================================================
  // VIEW 1: WORDPRESS-STYLE 2-COLUMN FULL PAGE ANNOUNCEMENT EDITOR
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
              {announcements.some((a) => a.id === editingItem.id)
                ? 'Chỉnh sửa Thông báo học bổng'
                : 'Viết Thông báo học bổng mới'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewItem(editingItem)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Xem thử Thông báo</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#165fa8] hover:bg-[#0d3f73] text-white text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Đang đăng...' : 'Đăng / Cập nhật Thông báo'}</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>{message}</span>
          </div>
        )}

        {/* WordPress 2-Column Layout */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT COLUMN (2/3): Title, Excerpt & WordPress Visual/HTML Editor */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tiêu đề Thông báo *
                </label>
                <input
                  required
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="vd: Thông báo tiếp nhận hồ sơ xét cấp Học bổng Khuyến khích học tập Học kỳ I..."
                  className="w-full p-3.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-xl text-base sm:text-lg font-extrabold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tóm tắt ngắn (Hiển thị ở đầu thông báo – Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={editingItem.excerpt}
                  onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                  placeholder="Viết 1-2 câu tóm tắt thời gian, đối tượng nộp hồ sơ..."
                  className="w-full p-3 bg-slate-50 focus:bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* WordPress Editor */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider px-1">
                Nội dung chi tiết Thông báo (Soạn trực quan như Word hoặc chuyển qua tab Mã HTML)
              </label>
              <WordPressEditor
                value={editingItem.content}
                onChange={(html) => setEditingItem({ ...editingItem, content: html })}
              />
            </div>
          </div>

          {/* RIGHT SIDEBAR (1/3): WordPress Meta Boxes */}
          <div className="space-y-5">
            {/* Box 1: Thiết lập Đăng thông báo */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-black text-slate-800 uppercase tracking-tight">
                1. Thiết lập Công bố
              </div>
              <div className="p-4 space-y-3.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ngày đăng *</label>
                    <input
                      type="date"
                      value={editingItem.publishedAt}
                      onChange={(e) => setEditingItem({ ...editingItem, publishedAt: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hạn nộp hồ sơ</label>
                    <input
                      type="date"
                      value={editingItem.expiresAt || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, expiresAt: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nhãn nổi bật (Badge)</label>
                  <input
                    type="text"
                    value={editingItem.badgeText || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, badgeText: e.target.value })}
                    placeholder="MỚI, KHẨN, ĐANG NHẬN HỒ SƠ..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-orange-600"
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
                    <span>Hiển thị công khai ngoài Trang chủ</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editingItem.isPinned || false}
                      onChange={(e) => setEditingItem({ ...editingItem, isPinned: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Ghim lên đầu mục Thông báo mới</span>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewItem(editingItem)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-center cursor-pointer"
                  >
                    Xem thử
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#165fa8] hover:bg-[#0d3f73] text-white font-bold text-center shadow-xs cursor-pointer"
                  >
                    {saving ? 'Đang lưu...' : 'Đăng thông báo'}
                  </button>
                </div>
              </div>
            </div>

            {/* Box 2: Nhóm học bổng áp dụng */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-black text-slate-800 uppercase tracking-tight">
                2. Thuộc Nhóm Học bổng
              </div>
              <div className="p-4 space-y-2">
                {ANNOUNCEMENT_CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer font-semibold text-slate-700"
                  >
                    <input
                      type="radio"
                      name="annCategory"
                      checked={editingItem.category === cat}
                      onChange={() =>
                        setEditingItem({
                          ...editingItem,
                          category: cat,
                          categoryId: CATEGORY_MAP[cat] || 'cat-2',
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Box 3: Văn bản / Biểu mẫu đính kèm */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>3. Tệp văn bản / Biểu mẫu đính kèm</span>
              </div>
              <div className="p-4 space-y-3">
                <label className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#165fa8] border border-blue-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadingFile ? 'Đang tải tệp...' : 'Chọn tệp từ máy tính (PDF, Word, Excel)'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    className="hidden"
                  />
                </label>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Tên tệp hiển thị:</label>
                  <input
                    type="text"
                    value={editingItem.attachmentName || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, attachmentName: e.target.value })}
                    placeholder="vd: Thong_bao_hoc_bong_HK1.pdf"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Đường dẫn tệp (URL):</label>
                  <input
                    type="text"
                    value={editingItem.attachmentUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, attachmentUrl: e.target.value })}
                    placeholder="Tự động điền khi tải tệp lên hoặc dán link Google Drive"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <AnnouncementModal
          announcement={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      </div>
    );
  }

  // =====================================================================
  // VIEW 2: ANNOUNCEMENTS LIST
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
            <Bell className="w-6 h-6 text-[#1760AB]" />
            <span>Quản lý Thông báo Xét cấp Học bổng ({announcements.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Trình soạn thảo trực quan chuẩn WordPress: viết thông báo, chèn bảng, đính kèm file PDF/Word dễ dàng
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Viết thông báo mới</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors ${
              ann.isActive === false ? 'opacity-60 bg-slate-50/50' : ''
            }`}
          >
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  {ann.category}
                </span>
                {ann.isPinned && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center gap-1">
                    <Pin className="w-2.5 h-2.5" />
                    <span>GHIM</span>
                  </span>
                )}
                {ann.badgeText && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-500 text-white">
                    {ann.badgeText}
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ann.isActive === false
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {ann.isActive === false ? 'Đang ẩn' : 'Đang hiển thị'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Ngày đăng: {ann.publishedAt}</span>
                </span>
                {ann.expiresAt && (
                  <span className="text-xs text-orange-600 font-medium">
                    (Hạn nộp: {ann.expiresAt})
                  </span>
                )}
              </div>

              <h3
                onClick={() => handleEdit(ann)}
                className="text-sm font-bold text-slate-900 hover:text-blue-700 cursor-pointer leading-snug"
              >
                {ann.title}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2">
                {ann.excerpt || (ann.content || '').replace(/<[^>]+>/g, '').slice(0, 180)}
              </p>

              {ann.attachmentName && (
                <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold pt-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{ann.attachmentName}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setPreviewItem(ann)}
                className="px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                title="Xem thử thông báo"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem thử</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleActive(ann)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  ann.isActive === false
                    ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                    : 'text-emerald-600 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title={ann.isActive === false ? 'Bật hiển thị thông báo' : 'Ẩn thông báo'}
              >
                {ann.isActive === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => handleEdit(ann)}
                className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                title="Chỉnh sửa thông báo"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Sửa</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(ann.id, ann.title)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                title="Xóa thông báo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="p-10 text-center text-xs text-slate-400 italic">
            Chưa có thông báo nào. Nhấn &ldquo;Viết thông báo mới&rdquo; để bắt đầu.
          </div>
        )}
      </div>

      <AnnouncementModal
        announcement={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
}
