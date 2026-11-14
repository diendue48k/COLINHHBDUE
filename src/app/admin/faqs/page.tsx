'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  Eye,
  Code,
  Search,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { FAQItem, FAQCategory } from '@/types';

const CATEGORY_OPTIONS: { value: FAQCategory; label: string }[] = [
  { value: 'dai-hoc', label: 'Học bổng Bậc Đại học' },
  { value: 'ngoai-truong', label: 'Học bổng Đơn vị ngoài trường' },
  { value: 'mien-giam', label: 'Chính sách Miễn giảm' },
  { value: 'du-hoc', label: 'Học bổng Du học' },
  { value: 'sau-dai-hoc', label: 'Học bổng Bậc Sau đại học' },
  { value: 'lien-ket', label: 'Học bổng Chương trình Cử nhân Liên kết quốc tế' },
  { value: 'chung', label: 'Thông tin chung' },
];

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [previewHtml, setPreviewHtml] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/data?type=faqs', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) setFaqs(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      category: 'dai-hoc',
      categoryLabel: 'Học bổng Bậc Đại học',
      question: '',
      answerHtml: '<p>Nhập câu trả lời bằng mã HTML hoặc văn bản thường...</p>',
      order: faqs.length + 1,
      isActive: true,
    };
    setEditingItem(newItem);
    setPreviewHtml(false);
    setIsModalOpen(true);
  };

  const handleEdit = (faq: FAQItem) => {
    setEditingItem({ ...faq });
    setPreviewHtml(false);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (faq: FAQItem) => {
    const updated = { ...faq, isActive: !faq.isActive };
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_faq', payload: updated }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const catObj = CATEGORY_OPTIONS.find((c) => c.value === editingItem.category);
    const payload: FAQItem = {
      ...editingItem,
      categoryLabel: catObj ? catObj.label : editingItem.categoryLabel || 'Thông tin chung',
    };

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_faq', payload }),
      });
      if (res.ok) {
        setMessage('Đã lưu câu hỏi thường gặp thành công!');
        setIsModalOpen(false);
        await loadData();
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_faq', payload: { id } }),
      });
      if (res.ok) {
        setMessage('Đã xóa câu hỏi thường gặp!');
        await loadData();
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sortedFaqs = [...faqs].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleMoveFaq = async (faq: FAQItem, direction: -1 | 1) => {
    const catFaqs = sortedFaqs.filter((f) =>
      filterCategory === 'all' ? true : f.category === faq.category
    );
    const currentIdx = catFaqs.findIndex((f) => f.id === faq.id);
    const targetIdx = currentIdx + direction;
    if (currentIdx < 0 || targetIdx < 0 || targetIdx >= catFaqs.length) return;

    const reordered = [...catFaqs];
    const [moved] = reordered.splice(currentIdx, 1);
    reordered.splice(targetIdx, 0, moved);

    const updates = reordered.map((f, idx) => ({ id: f.id, order: idx + 1 }));
    setFaqs((prev) =>
      prev.map((f) => {
        const u = updates.find((x) => x.id === f.id);
        return u ? { ...f, order: u.order } : f;
      })
    );

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder_faqs',
          payload: { items: updates },
        }),
      });
      if (res.ok) {
        setMessage('Đã cập nhật vị trí câu hỏi thường gặp!');
        await loadData();
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredFaqs = sortedFaqs.filter((f) => {
    const matchCat = filterCategory === 'all' || f.category === filterCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answerHtml.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

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
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-[#1760AB]" />
            <span>Quản lý Câu hỏi thường gặp ({faqs.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Soạn thảo, giải đáp thắc mắc và cập nhật câu hỏi hiển thị tại mục Câu hỏi thường gặp ngoài Trang chủ
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1760AB] hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm câu hỏi mới</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium shrink-0">Nhóm:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-blue-500 text-xs w-full sm:w-auto"
          >
            <option value="all">Tất cả nhóm ({faqs.length})</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        {filteredFaqs.map((faq, index) => (
          <div
            key={faq.id}
            className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-50/80 transition-colors group"
          >
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1760AB] border border-blue-200 uppercase">
                  {faq.categoryLabel || faq.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Thứ tự: {faq.order || index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleActive(faq)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                    faq.isActive !== false
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                  title="Bấm để bật/tắt hiển thị"
                >
                  {faq.isActive !== false ? 'Đang hiển thị' : 'Đang ẩn'}
                </button>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1760AB] transition-colors leading-snug">
                {faq.question}
              </h3>

              <div
                className="text-xs text-slate-500 line-clamp-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0 pt-1">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => handleMoveFaq(faq, -1)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Di chuyển lên"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                disabled={index === filteredFaqs.length - 1}
                onClick={() => handleMoveFaq(faq, 1)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Di chuyển xuống"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleEdit(faq)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Chỉnh sửa</span>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(faq.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        ))}

        {filteredFaqs.length === 0 && !loading && (
          <div className="py-12 text-center text-xs text-slate-400 italic">
            Chưa có câu hỏi nào trong danh mục này
          </div>
        )}
      </div>

      {/* Edit / Create FAQ Modal */}
      {isModalOpen && editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#1760AB]" />
                <span>{editingItem.question ? 'Chỉnh sửa Câu hỏi thường gặp' : 'Thêm Câu hỏi mới'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 min-h-0">
                {/* Question */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tiêu đề câu hỏi thường gặp *
                  </label>
                  <input
                    required
                    type="text"
                    value={editingItem.question}
                    onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                    placeholder="vd: Điều kiện xét cấp Học bổng Khuyến khích học tập tại DUE là gì?"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Category */}
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Nhóm chủ đề *</label>
                    <select
                      value={editingItem.category}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          category: e.target.value as FAQCategory,
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Thứ tự hiển thị</label>
                    <input
                      type="number"
                      value={editingItem.order}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 1 })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="faqActive"
                    checked={editingItem.isActive}
                    onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="faqActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Kích hoạt hiển thị công khai trên website
                  </label>
                </div>

                {/* Answer Content with HTML Editor & Live Preview */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold text-slate-700 text-xs">
                      Nội dung câu trả lời (Soạn thảo bằng mã HTML & CSS trực tiếp) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setPreviewHtml(!previewHtml)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
                    >
                      {previewHtml ? (
                        <>
                          <Code className="w-3.5 h-3.5" />
                          <span>Quay lại sửa mã HTML</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem trước hiển thị</span>
                        </>
                      )}
                    </button>
                  </div>

                  {previewHtml ? (
                    <div
                      className="w-full p-4 min-h-[220px] max-h-[340px] overflow-y-auto bg-white border-2 border-dashed border-blue-300 rounded-2xl due-popup-html-content text-xs leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html:
                          editingItem.answerHtml ||
                          '<p class="text-slate-400 italic">Chưa có nội dung để xem trước...</p>',
                      }}
                    />
                  ) : (
                    <textarea
                      rows={8}
                      value={editingItem.answerHtml}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, answerHtml: e.target.value })
                      }
                      placeholder="<p>Nội dung câu trả lời bằng HTML...</p>"
                      className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 border border-slate-700 rounded-2xl leading-relaxed focus:outline-none focus:border-blue-500 shadow-inner"
                    />
                  )}
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Hỗ trợ đầy đủ các thẻ HTML: &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;table&gt;, style inline...
                  </span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="px-5 py-3.5 border-t border-slate-200 flex items-center justify-end gap-2.5 bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1760AB] hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Lưu câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
