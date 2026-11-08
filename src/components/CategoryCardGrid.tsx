'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Category, Scholarship } from '@/types';
import { DynamicIcon } from './DynamicIcon';

interface CategoryCardGridProps {
  category: Category;
  scholarships: Scholarship[];
  onSelectScholarship: (scholarship: Scholarship) => void;
}

// 3 Core Brand Colors of DUE: Blue (#1760AB), Orange (#F26524), Green (#119046)
const getCategoryStyle = (categoryId: string) => {
  switch (categoryId) {
    case 'cat-1': // Sau đại học -> DUE Blue
    case 'cat-6': // Du học -> DUE Blue
      return {
        gradientHeader: 'from-[#1760AB] to-[#2066AE]',
        borderHover: 'hover:border-[#1760AB]/60',
        cardHoverBorder: 'hover:border-[#1760AB] hover:bg-blue-50/40',
        iconBg: 'bg-blue-50',
        iconColor: 'text-[#1760AB]',
        activeDot: 'bg-[#1760AB]',
      };
    case 'cat-2': // Đại học -> DUE Orange
    case 'cat-4': // Miễn giảm & Trợ cấp -> DUE Orange
      return {
        gradientHeader: 'from-[#F26524] to-[#FA7035]',
        borderHover: 'hover:border-[#F26524]/60',
        cardHoverBorder: 'hover:border-[#F26524] hover:bg-orange-50/40',
        iconBg: 'bg-orange-50',
        iconColor: 'text-[#F26524]',
        activeDot: 'bg-[#F26524]',
      };
    case 'cat-3': // Đơn vị ngoài trường -> DUE Green
    case 'cat-5': // Cử nhân Liên kết quốc tế -> DUE Green
    default:
      return {
        gradientHeader: 'from-[#119046] to-[#1BA855]',
        borderHover: 'hover:border-[#119046]/60',
        cardHoverBorder: 'hover:border-[#119046] hover:bg-emerald-50/40',
        iconBg: 'bg-emerald-50',
        iconColor: 'text-[#119046]',
        activeDot: 'bg-[#119046]',
      };
  }
};

export const CategoryCardGrid: React.FC<CategoryCardGridProps> = ({
  category,
  scholarships,
  onSelectScholarship,
}) => {
  const styles = getCategoryStyle(category.id);

  // Filter scholarships belonging to this category, sorted by order
  const items = scholarships
    .filter((s) => s.categoryId === category.id && s.isActive !== false)
    .sort((a, b) => a.order - b.order);

  // Clean title for perfect visual balance
  const formatTitle = (title: string) => {
    if (title.includes('CỬ NHÂN LIÊN KẾT QUỐC TẾ')) {
      return (
        <>
          <span className="block">HỌC BỔNG CỬ NHÂN</span>
          <span className="block">LIÊN KẾT QUỐC TẾ</span>
        </>
      );
    }
    if (title.includes('MIỄN GIẢM TRỢ CẤP')) {
      return (
        <>
          <span className="block">CHÍNH SÁCH MIỄN GIẢM</span>
          <span className="block">TRỢ CẤP XÃ HỘI</span>
        </>
      );
    }
    return title;
  };

  return (
    <div
      id={`category-${category.id}`}
      className={`bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl ${styles.borderHover} transition-all duration-300 flex flex-col justify-between overflow-hidden group h-full`}
    >
      {/* 
        Top Header: CHIỀU CAO CỐ ĐỊNH HOÀN TOÀN (h-20 sm:h-22)
        - ĐÃ BỎ SUB NHỎ (slogan) theo yêu cầu người dùng
        - Căn giữa dọc và ngang tuyệt đối
        - Đường phân cách dưới của mọi card trong hàng tạo thành 1 ĐƯỜNG THẲNG THƯỚC ĐO
      */}
      <div
        className={`h-20 sm:h-22 px-4 bg-gradient-to-r ${styles.gradientHeader} text-white flex items-center justify-center text-center shrink-0`}
      >
        <h3 className="text-xs sm:text-[13px] md:text-sm font-black uppercase tracking-wide leading-tight max-w-[280px]">
          {formatTitle(category.title)}
        </h3>
      </div>

      {/* Program Items List: ĐÃ BỎ TOÀN BỘ CÁC SUB NHỎ (targetAudience) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col gap-2.5 bg-slate-50/40">
        {items.map((scholarship) => {
          const displayTitle = scholarship.cardTitle || scholarship.title;

          return (
            <button
              key={scholarship.id}
              type="button"
              onClick={() => onSelectScholarship(scholarship)}
              className={`w-full group/item text-left p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:bg-white ${styles.cardHoverBorder} shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer min-h-[50px]`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-8 h-8 rounded-xl ${styles.iconBg} ${styles.iconColor} flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform shadow-2xs`}
                >
                  <DynamicIcon name={scholarship.icon || 'GraduationCap'} className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover/item:text-[#1760AB] block leading-snug">
                    {displayTitle}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover/item:text-slate-700 group-hover/item:translate-x-0.5 transition-all shrink-0" />
            </button>
          );
        })}

        {items.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-400 italic">
            Chưa có chương trình nào được cập nhật
          </div>
        )}
      </div>
    </div>
  );
};
