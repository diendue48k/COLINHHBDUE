'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  PlusCircle,
  Search,
  Edit,
  Copy,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Scholarship, Category } from '@/types';
import { initialData } from '@/data/initialData';
import { DynamicIcon } from '@/components/DynamicIcon';
import { ScholarshipModal } from '@/components/ScholarshipModal';

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialData.scholarships);
  const [categories, setCategories] = useState<Category[]>(initialData.categories);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [previewItem, setPreviewItem] = useState<Scholarship | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        if (json.scholarships) setScholarships(json.scholarships);
        if (json.categories) setCategories(json.categories);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate_scholarship', payload: { id } }),
      });
      if (res.ok) {
        setActionMessage('Đã sao chép chương trình thành công!');
        await loadData();
        setTimeout(() => setActionMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chương trình "${title}"?`)) return;
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_scholarship', payload: { id } }),
      });
      if (res.ok) {
        setActionMessage(`Đã xóa chương trình "${title}"!`);
        await loadData();
        setTimeout(() => setActionMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (scholarship: Scholarship) => {
    const updated = { ...scholarship, isActive: !scholarship.isActive };
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_scholarship', payload: updated }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = scholarships.filter((s) => {
    if (selectedCat !== 'all' && s.categoryId !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        (s.targetAudience || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast message */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold animate-fade-in">
          {actionMessage}
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
            Quản lý Chương trình Học bổng ({scholarships.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý danh sách, nội dung popup giới thiệu, tài liệu đính kèm và điều kiện xét cấp
          </p>
        </div>

        <Link
          href="/admin/scholarships/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm chương trình mới</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên học bổng, đối tượng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500 shrink-0">Nhóm:</label>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 w-full sm:w-60"
          >
            <option value="all">Tất cả các nhóm (6 nhóm)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortTitle || c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Tên chương trình</th>
                <th className="py-3 px-4">Nhóm học bổng</th>
                <th className="py-3 px-4">Đối tượng thụ hưởng</th>
                <th className="py-3 px-4 text-center">Lượt xem</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => {
                const category = categories.find((c) => c.id === item.categoryId);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <DynamicIcon name={item.icon} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 line-clamp-1">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Slug: {item.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {category?.shortTitle || category?.title || 'Chung'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="line-clamp-1 text-slate-500">
                        {item.targetAudience || '—'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                      {(item.viewsCount || 0).toLocaleString('vi-VN')}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                          item.isActive !== false
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Bấm để bật/tắt hiển thị"
                      >
                        {item.isActive !== false ? 'Hiển thị' : 'Ẩn'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview popup */}
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          title="Xem trước Popup chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <Link
                          href={`/admin/scholarships/${item.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50"
                          title="Chỉnh sửa nội dung"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                          title="Nhân bản (Sao chép)"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                          title="Xóa chương trình"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Preview Modal */}
      <ScholarshipModal
        scholarship={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
}
