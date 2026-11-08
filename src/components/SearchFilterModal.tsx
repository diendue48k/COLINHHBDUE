'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Filter, ChevronRight, SlidersHorizontal, BookOpen } from 'lucide-react';
import { Scholarship, Category } from '@/types';
import { DynamicIcon } from './DynamicIcon';

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarships: Scholarship[];
  categories: Category[];
  initialQuery?: string;
  onSelectScholarship: (scholarship: Scholarship) => void;
}

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  isOpen,
  onClose,
  scholarships,
  categories,
  initialQuery = '',
  onSelectScholarship,
}) => {
  const [keyword, setKeyword] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedPolicyType, setSelectedPolicyType] = useState<string>('all');

  // Filtered list
  const filteredScholarships = useMemo(() => {
    return scholarships.filter((item) => {
      // Keyword match
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesTarget = (item.targetAudience || '').toLowerCase().includes(q);
        const matchesIntro = (item.intro || '').toLowerCase().includes(q);
        const matchesSections = item.sections.some((s) =>
          s.bullets.some((b) => b.toLowerCase().includes(q))
        );
        if (!matchesTitle && !matchesTarget && !matchesIntro && !matchesSections) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }

      // Education Level filter
      if (selectedLevel !== 'all' && item.educationLevel !== selectedLevel && item.educationLevel !== 'tat-ca') {
        return false;
      }

      // Policy Type filter
      if (selectedPolicyType !== 'all' && item.policyType !== selectedPolicyType) {
        return false;
      }

      return true;
    });
  }, [scholarships, keyword, selectedCategory, selectedLevel, selectedPolicyType]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight">
                Tìm kiếm & Tra cứu học bổng DUE
              </h2>
              <p className="text-xs text-slate-500">
                Tìm thấy <span className="font-bold text-blue-600">{filteredScholarships.length}</span> chương trình phù hợp
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Controls */}
        <div className="p-4 bg-white border-b border-slate-200 space-y-3">
          {/* Main search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Nhập tên học bổng, đối tượng, từ khóa tìm kiếm (vd: Elite, quốc tế, giảm học phí...)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              autoFocus
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter dropdowns row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Category Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Nhóm học bổng
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs text-slate-700"
              >
                <option value="all">Tất cả nhóm (6 nhóm)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.shortTitle || c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Bậc đào tạo
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs text-slate-700"
              >
                <option value="all">Tất cả bậc đào tạo</option>
                <option value="dai-hoc">Đại học chính quy</option>
                <option value="sau-dai-hoc">Sau Đại học (Thạc sĩ, NCS)</option>
                <option value="lien-ket-quoc-te">Cử nhân Liên kết Quốc tế</option>
                <option value="du-hoc">Trao đổi & Du học</option>
              </select>
            </div>

            {/* Policy Type Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Loại chính sách
              </label>
              <select
                value={selectedPolicyType}
                onChange={(e) => setSelectedPolicyType(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs text-slate-700"
              >
                <option value="all">Tất cả loại chính sách</option>
                <option value="hoc-bong">Học bổng</option>
                <option value="khen-thuong">Khen thưởng & KKHT</option>
                <option value="mien-giam">Miễn giảm học phí</option>
                <option value="tro-cap">Trợ cấp & Vay vốn</option>
                <option value="du-hoc">Học bổng đối tác nước ngoài</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1 bg-slate-50">
          {filteredScholarships.map((s) => {
            const cat = categories.find((c) => c.id === s.categoryId);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  onSelectScholarship(s);
                  onClose();
                }}
                className="w-full bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-400 text-left transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors mt-0.5">
                    <DynamicIcon name={s.icon} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {cat?.shortTitle || 'Học bổng DUE'}
                      </span>
                      {s.targetAudience && (
                        <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
                          • {s.targetAudience}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {s.intro}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-blue-600 text-xs font-bold shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <span>Chi tiết</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}

          {filteredScholarships.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">
                Không tìm thấy chương trình học bổng phù hợp
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ 6 nhóm học bổng.
              </p>
              <button
                type="button"
                onClick={() => {
                  setKeyword('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSelectedPolicyType('all');
                }}
                className="mt-3 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
