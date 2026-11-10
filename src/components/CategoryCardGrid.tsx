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

// 3 Core Brand Colors of DUE matching diagram:
// Col 1 & 3: DUE Blue (#1760AB)
// Col 2 & 4: DUE Orange (#F26524)
// Col 5 & 6: DUE Green (#119046)
const getCategoryStyle = (categoryId: string) => {
  switch (categoryId) {
    case 'cat-1': // Bậc Sau đại học -> Blue
    case 'cat-3': // Đơn vị ngoài trường -> Blue
      return {
        gradientHeader: 'from-[#1760AB] to-[#2066AE]',
        borderHover: 'hover:border-[#1760AB]/60',
        cardHoverBorder: 'hover:border-[#1760AB] hover:bg-blue-50/40',
        iconBg: 'bg-blue-50',
        iconColor: 'text-[#1760AB]',
        activeDot: 'bg-[#1760AB]',
      };
    case 'cat-2': // Bậc Đại học -> Orange
    case 'cat-4': // Miễn giảm & Trợ cấp -> Orange
      return {
        gradientHeader: 'from-[#F26524] to-[#FA7035]',
        borderHover: 'hover:border-[#F26524]/60',
        cardHoverBorder: 'hover:border-[#F26524] hover:bg-orange-50/40',
        iconBg: 'bg-orange-50',
        iconColor: 'text-[#F26524]',
        activeDot: 'bg-[#F26524]',
      };
    case 'cat-5': // Cử nhân Liên kết quốc tế -> Green
    case 'cat-6': // Du học -> Green
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

  // Clean title for perfect visual balance matching diagram
  const formatTitle = (title: string) => {
    if (title === 'HỌC BỔNG BẬC SAU ĐẠI HỌC') {
      return (
        <>
          <span className="block">HỌC BỔNG</span>
          <span className="block">BẬC SAU ĐẠI HỌC</span>
        </>
      );
    }
    if (title === 'HỌC BỔNG BẬC ĐẠI HỌC') {
      return (
        <>
          <span className="block">HỌC BỔNG</span>
          <span className="block">BẬC ĐẠI HỌC</span>
        </>
      );
    }
    if (title === 'HỌC BỔNG ĐƠN VỊ NGOÀI TRƯỜNG') {
      return (
        <>
          <span className="block">HỌC BỔNG</span>
          <span className="block">ĐƠN VỊ NGOÀI TRƯỜNG</span>
        </>
      );
    }
    if (title === 'CHÍNH SÁCH MIỄN GIẢM TRỢ CẤP XÃ HỘI') {
      return (
        <>
          <span className="block">CHÍNH SÁCH MIỄN</span>
          <span className="block">GIẢM TRỢ CẤP XÃ HỘI</span>
        </>
      );
    }
    if (title.includes('CỬ NHÂN LIÊN KẾT QUỐC TẾ')) {
      return (
        <>
          <span className="block">HỌC BỔNG CHƯƠNG TRÌNH</span>
          <span className="block">CỬ NHÂN LIÊN KẾT QUỐC TẾ</span>
        </>
      );
    }
    if (title === 'HỌC BỔNG DU HỌC') {
      return (
        <>
          <span className="block">HỌC BỔNG</span>
          <span className="block">DU HỌC</span>
        </>
      );
    }
    return title;
  };

  return (
    <div
      id={`category-${category.id}`}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl ${styles.borderHover} transition-all duration-300 flex flex-col justify-between overflow-hidden group h-full`}
    >
      {/* 
        Top Header: Rút gọn độ cao chuẩn đẹp (h-14 sm:h-16)
        - Căn giữa dọc và ngang tuyệt đối
        - Màu sắc khớp 100% sơ đồ 6 cột
      */}
      <div
        className={`h-14 sm:h-16 px-3 bg-gradient-to-r ${styles.gradientHeader} text-white flex items-center justify-center text-center shrink-0`}
      >
        <h3 className="text-[11.5px] sm:text-xs md:text-[13px] font-black uppercase tracking-wide leading-tight max-w-[280px]">
          {formatTitle(category.title)}
        </h3>
      </div>

      {/* Program Items List: Rút gọn padding, line-spacing và độ cao nút */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col gap-1.5 bg-slate-50/40">
        {items.map((scholarship) => {
          const displayTitle = scholarship.cardTitle || scholarship.title;

          return (
            <button
              key={scholarship.id}
              type="button"
              onClick={() => onSelectScholarship(scholarship)}
              className={`w-full group/item text-left py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl border border-slate-200/80 bg-white hover:bg-white ${styles.cardHoverBorder} shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 flex items-center justify-between gap-2 cursor-pointer`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Number Badge 1..21 matching diagram */}
                <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-black text-[10px] flex items-center justify-center shrink-0 border border-slate-200 group-hover/item:border-blue-400 group-hover/item:bg-blue-50 group-hover/item:text-blue-700 transition-colors">
                  {scholarship.order}
                </span>

                <div className="min-w-0 flex-1">
                  <span className="text-[11.5px] sm:text-[12px] font-bold text-slate-800 group-hover/item:text-[#1760AB] block leading-snug">
                    {displayTitle}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-slate-700 group-hover/item:translate-x-0.5 transition-all shrink-0" />
            </button>
          );
        })}

        {items.length === 0 && (
          <div className="py-6 text-center text-xs text-slate-400 italic">
            Chưa có chương trình nào được cập nhật
          </div>
        )}
      </div>
    </div>
  );
};
