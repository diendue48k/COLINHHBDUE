'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Category, ColorTheme } from '@/types';
import { initialData } from '@/data/initialData';
import { DynamicIcon } from '@/components/DynamicIcon';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialData.categories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/data?type=categories', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) setCategories(json);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [categories]);

  const handleMoveCategory = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sortedCategories.length) return;

    const list = sortedCategories.map((c, idx) => ({ ...c, order: idx + 1 }));
    const tempOrder = list[index].order;
    list[index].order = list[targetIndex].order;
    list[targetIndex].order = tempOrder;

    // Optimistic update
    setCategories([...list].sort((a, b) => a.order - b.order));

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder_categories',
          payload: { items: list.map((c) => ({ id: c.id, order: c.order })) },
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setCategories(json.data);
        }
        setMessage('Đã cập nhật vị trí nhóm học bổng!');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOrderChangeDirect = async (cat: Category, newOrderVal: number) => {
    if (!newOrderVal || newOrderVal < 1) return;
    const list = sortedCategories.filter((c) => c.id !== cat.id);
    const clampedIndex = Math.min(Math.max(newOrderVal - 1, 0), list.length);
    list.splice(clampedIndex, 0, { ...cat, order: newOrderVal });
    const normalized = list.map((c, idx) => ({ ...c, order: idx + 1 }));

    setCategories(normalized);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder_categories',
          payload: { items: normalized.map((c) => ({ id: c.id, order: c.order })) },
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setCategories(json.data);
        }
        setMessage(`Đã chuyển "${cat.shortTitle || cat.title}" sang vị trí Cột ${clampedIndex + 1}!`);
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      slug: `nhom-${Date.now()}`,
      title: 'NHÓM HỌC BỔNG MỚI',
      shortTitle: 'Nhóm mới',
      themeColor: 'deepBlue',
      icon: 'GraduationCap',
      order: categories.length + 1,
      isActive: true,
      illustration: 'none',
    };
    setEditingCategory(newCat);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_category', payload: editingCategory }),
      });
      if (res.ok) {
        setMessage('Đã lưu nhóm học bổng thành công!');
        setIsModalOpen(false);
        await loadData();
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhóm "${title}"?`)) return;
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_category', payload: { id } }),
      });
      if (res.ok) {
        setMessage('Đã xóa nhóm học bổng!');
        await loadData();
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    const updated = { ...cat, isActive: !cat.isActive };
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_category', payload: updated }),
      });
      await loadData();
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
            Quản lý Nhóm Học bổng ({sortedCategories.length} nhóm)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sử dụng nút mũi tên Lên/Xuống hoặc chọn vị trí cột để sắp xếp thứ tự hiển thị ngoài Trang chủ
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm nhóm mới</span>
        </button>
      </div>

      {/* Grid of Categories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCategories.map((cat, idx) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Vị trí Cột {idx + 1}
                  </span>
                  <select
                    value={idx + 1}
                    onChange={(e) => handleOrderChangeDirect(cat, Number(e.target.value))}
                    className="text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-1.5 py-0.5 border border-slate-200 cursor-pointer focus:outline-none"
                    title="Đổi nhanh vị trí cột"
                  >
                    {sortedCategories.map((_, posIdx) => (
                      <option key={posIdx + 1} value={posIdx + 1}>
                        Đổi sang Cột {posIdx + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    cat.isActive !== false
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.isActive !== false ? 'Hiển thị' : 'Đang ẩn'}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <DynamicIcon name={cat.icon || 'GraduationCap'} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tên ngắn: {cat.shortTitle} • Màu: {cat.themeColor}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveCategory(idx, -1)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Di chuyển lên / sang trái"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === sortedCategories.length - 1}
                  onClick={() => handleMoveCategory(idx, 1)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Di chuyển xuống / sang phải"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleActive(cat)}
                  className="ml-1 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  {cat.isActive !== false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{cat.isActive !== false ? 'Ẩn' : 'Hiện'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleEdit(cat)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                  title="Chỉnh sửa nhóm"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.title)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Xóa nhóm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Category Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[88vh] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                {editingCategory.id ? 'Chỉnh sửa nhóm học bổng' : 'Thêm nhóm học bổng mới'}
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
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên đầy đủ của nhóm *</label>
                  <input
                    required
                    type="text"
                    value={editingCategory.title}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, title: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên ngắn hiển thị trên menu</label>
                  <input
                    type="text"
                    value={editingCategory.shortTitle}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, shortTitle: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Màu sắc chủ đạo *</label>
                    <select
                      value={editingCategory.themeColor}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          themeColor: e.target.value as ColorTheme,
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="deepBlue">Xanh dương đậm (Nhóm 1)</option>
                      <option value="orange">Cam rực rỡ (Nhóm 2)</option>
                      <option value="skyBlue">Xanh da trời (Nhóm 3)</option>
                      <option value="amber">Cam ấm / Vàng (Nhóm 4)</option>
                      <option value="emerald">Xanh ngọc lục bảo (Nhóm 5)</option>
                      <option value="forestGreen">Xanh lá cây đậm (Nhóm 6)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Icon đại diện *</label>
                    <select
                      value={editingCategory.icon}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, icon: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="GraduationCap">GraduationCap (Mũ cử nhân)</option>
                      <option value="Globe">Globe (Địa cầu)</option>
                      <option value="Star">Star (Ngôi sao)</option>
                      <option value="ShieldCheck">ShieldCheck (Bảo hiểm/Miễn giảm)</option>
                      <option value="Plane">Plane (Máy bay du học)</option>
                      <option value="Award">Award (Khen thưởng)</option>
                      <option value="Users">Users (Cộng đồng)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hình minh họa đáy cột</label>
                    <select
                      value={editingCategory.illustration}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          illustration: e.target.value as Category['illustration'],
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="cap">Mũ cử nhân & sách</option>
                      <option value="none">Không có hình (Trống)</option>
                      <option value="handshake">Bắt tay hợp tác</option>
                      <option value="heart">Tay nâng trái tim</option>
                      <option value="globe">Quả địa cầu</option>
                      <option value="plane">Máy bay bay quanh địa cầu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Thứ tự cột (1 - 6)</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={editingCategory.order}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          order: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

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
                  Lưu nhóm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
