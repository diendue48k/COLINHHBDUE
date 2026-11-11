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
  Download,
  Code,
  Eye,
  EyeOff,
  Upload,
  Pin,
} from 'lucide-react';
import { Announcement } from '@/types';
import { initialData } from '@/data/initialData';

const CATEGORY_MAP: Record<string, string> = {
  'Học bổng Bậc Đại học': 'cat-1',
  'Học bổng Bậc Sau đại học': 'cat-2',
  'Học bổng Đơn vị ngoài trường': 'cat-3',
  'Chính sách miễn giảm': 'cat-4',
  'Cử nhân Liên kết quốc tế': 'cat-5',
  'Học bổng Du học': 'cat-6',
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialData.announcements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [message, setMessage] = useState('');
  const [previewHtml, setPreviewHtml] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

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
    const newItem: Announcement = {
      id: `ann-${Date.now()}`,
      slug: `thong-bao-${Date.now()}`,
      title: '',
      excerpt: '',
      content: '',
      category: 'Học bổng Bậc Đại học',
      categoryId: 'cat-1',
      publishedAt: new Date().toISOString().split('T')[0],
      expiresAt: '',
      isPinned: false,
      isActive: true,
      badgeText: 'MỚI',
      attachmentName: '',
      attachmentUrl: '',
    };
    setEditingItem(newItem);
    setPreviewHtml(false);
    setIsModalOpen(true);
  };

  const handleEdit = (ann: Announcement) => {
    setEditingItem({
      ...ann,
      attachmentUrl: ann.attachmentUrl === '#' ? '' : ann.attachmentUrl || '',
    });
    setPreviewHtml(false);
    setIsModalOpen(true);
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
      if (res.ok && json.ok) {
        setEditingItem({
          ...editingItem,
          attachmentName: json.attachmentName || file.name,
          attachmentUrl: json.attachmentUrl,
        });
        setMessage(`Đã tải tệp "${json.attachmentName || file.name}" lên thành công!`);
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
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_announcement', payload: editingItem }),
      });
      if (res.ok) {
        setMessage('Đã lưu thông báo thành công!');
        setIsModalOpen(false);
        await loadData();
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
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
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
            Quản lý Thông báo Xét cấp Học bổng ({announcements.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Đăng tải kế hoạch tiếp nhận hồ sơ, công bố quyết định khen thưởng và tài liệu mẫu
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng thông báo mới</span>
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
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500 text-white">
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
                    (Hạn chót: {ann.expiresAt})
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {ann.title}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2">
                {ann.excerpt || ann.content}
              </p>

              {ann.attachmentName && (
                <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold pt-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{ann.attachmentName}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
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
                className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                title="Sửa thông báo"
              >
                <Edit className="w-4 h-4" />
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
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[88vh] overflow-hidden">
            {/* Modal Header: Sticky Top */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1760AB]" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  {editingItem.id ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center text-sm font-bold transition-colors"
                title="Đóng"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 min-h-0">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tiêu đề thông báo *</label>
                  <input
                    required
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nhóm / Danh mục</label>
                    <select
                      value={editingItem.category}
                      onChange={(e) => {
                        const catTitle = e.target.value;
                        setEditingItem({
                          ...editingItem,
                          category: catTitle,
                          categoryId: CATEGORY_MAP[catTitle] || editingItem.categoryId || 'cat-1',
                        });
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Học bổng Bậc Đại học">Học bổng Bậc Đại học</option>
                      <option value="Học bổng Bậc Sau đại học">Học bổng Bậc Sau đại học</option>
                      <option value="Học bổng Đơn vị ngoài trường">Học bổng Đơn vị ngoài trường</option>
                      <option value="Chính sách miễn giảm">Chính sách miễn giảm</option>
                      <option value="Cử nhân Liên kết quốc tế">Cử nhân Liên kết quốc tế</option>
                      <option value="Học bổng Du học">Học bổng Du học</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nhãn huy hiệu (Badge)</label>
                    <input
                      type="text"
                      value={editingItem.badgeText || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, badgeText: e.target.value })}
                      placeholder="MỚI, HOT, CHÚ Ý..."
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
                    <span>Ghim thông báo lên đầu</span>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ngày công bố *</label>
                    <input
                      type="date"
                      value={editingItem.publishedAt}
                      onChange={(e) => setEditingItem({ ...editingItem, publishedAt: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hạn chót nộp hồ sơ</label>
                    <input
                      type="date"
                      value={editingItem.expiresAt || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, expiresAt: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tóm tắt ngắn</label>
                  <input
                    type="text"
                    value={editingItem.excerpt}
                    onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-700 text-xs flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-blue-600" />
                      <span>Nội dung chi tiết (Hỗ trợ HTML & Định dạng văn bản) *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setPreviewHtml(!previewHtml)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{previewHtml ? 'Quay lại soạn HTML' : 'Xem trước trực tiếp'}</span>
                    </button>
                  </div>

                  {previewHtml ? (
                    <div
                      className="p-4 rounded-xl border border-blue-200 bg-slate-50 min-h-[140px] text-xs text-slate-800 space-y-2 max-h-[250px] overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: editingItem.content || '<p class="text-slate-400 italic">Chưa có nội dung để xem trước...</p>' }}
                    />
                  ) : (
                    <textarea
                      rows={6}
                      value={editingItem.content}
                      onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                      placeholder="Nhập nội dung thông báo. Có thể nhập văn bản thuần hoặc mã HTML (<p>, <strong>, <ul>, <li>, <a href=...>...)..."
                      className="w-full p-3 font-mono text-xs bg-slate-950 text-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed shadow-inner min-h-[140px]"
                    />
                  )}
                  <p className="text-[10px] text-slate-400">
                    Hỗ trợ đầy đủ các thẻ HTML: &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a href="..."&gt;, &lt;table&gt;, v.v.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-800 block">Tài liệu / Biểu mẫu đính kèm</span>
                      <span className="text-[10px] text-slate-500">
                        Tải tệp từ máy tính (PDF, DOCX, XLSX, ZIP tối đa 20MB) hoặc nhập đường dẫn file
                      </span>
                    </div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-xs shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingFile ? 'Đang tải lên...' : 'Chọn tệp từ máy tính'}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tên file hiển thị</label>
                      <input
                        type="text"
                        value={editingItem.attachmentName || ''}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, attachmentName: e.target.value })
                        }
                        placeholder="Thong_bao_DUE_2025.pdf"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Đường dẫn file (URL)</label>
                      <input
                        type="text"
                        value={editingItem.attachmentUrl || ''}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, attachmentUrl: e.target.value })
                        }
                        placeholder="/files/... (Để trống sẽ tự xuất bản thông báo .doc)"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer: Sticky Bottom */}
              <div className="px-5 py-3.5 border-t border-slate-200 flex items-center justify-end gap-2.5 bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-colors"
                >
                  Lưu thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
