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

// DUE Brand Color mapping matching exactly the user layout:
// Row 1: Col 1 Blue, Col 2 Orange, Col 3 Green
// Row 2: Col 4 Orange, Col 5 Green, Col 6 Blue
const getCategoryStyle = (categoryId: string) => {
  switch (categoryId) {
    case 'cat-1': // Bậc Sau đại học -> DUE Blue
    case 'cat-6': // Du học -> DUE Blue
      return {
        gradientHeader: 'from-[#1760AB] to-[#2066AE]',
        borderHover: 'hover:border-[#1760AB]/70',
        cardHoverBorder: 'hover:border-[#1760AB] hover:shadow-xs',
        iconBg: 'bg-blue-50',
        iconColor: 'text-[#1760AB]',
      };
    case 'cat-2': // Bậc Đại học -> DUE Orange
    case 'cat-4': // Miễn giảm & Trợ cấp -> DUE Orange
      return {
        gradientHeader: 'from-[#F26524] to-[#FA7035]',
        borderHover: 'hover:border-[#F26524]/70',
        cardHoverBorder: 'hover:border-[#F26524] hover:shadow-xs',
        iconBg: 'bg-orange-50',
        iconColor: 'text-[#F26524]',
      };
    case 'cat-3': // Đơn vị ngoài trường -> DUE Green
    case 'cat-5': // Cử nhân Liên kết quốc tế -> DUE Green
    default:
      return {
        gradientHeader: 'from-[#119046] to-[#1BA855]',
        borderHover: 'hover:border-[#119046]/70',
        cardHoverBorder: 'hover:border-[#119046] hover:shadow-xs',
        iconBg: 'bg-emerald-50',
        iconColor: 'text-[#119046]',
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

  // Clean title formatting matching layout
  const formatTitle = (title: string) => {
    if (title.includes('SAU ĐẠI HỌC')) {
      return (
        <>
          <span className="block">HỌC BỔNG</span>
          <span className="block">BẬC SAU ĐẠI HỌC</span>
        </>
      );
    }
    if (title.includes('BẬC ĐẠI HỌC') || title === 'HỌC BỔNG ĐẠI HỌC') {
      return (
        <>
          <span className="block">HỌC BỔNG</span>
          <span className="block">BẬC ĐẠI HỌC</span>
        </>
      );
    }
    if (title.includes('ĐƠN VỊ NGOÀI TRƯỜNG')) {
      return (
        <>
          <span className="block">HỌC BỔNG</span>
          <span className="block">ĐƠN VỊ NGOÀI TRƯỜNG</span>
        </>
      );
    }
    if (title.includes('MIỄN GIẢM TRỢ CẤP') || title.includes('CHÍNH SÁCH MIỄN GIẢM')) {
      return (
        <>
          <span className="block">CHÍNH SÁCH MIỄN GIẢM,</span>
          <span className="block">TRỢ CẤP XÃ HỘI</span>
        </>
      );
    }
    if (title.includes('CỬ NHÂN LIÊN KẾT') || title.includes('LIÊN KẾT QUỐC TẾ')) {
      return (
        <>
          <span className="block">HỌC BỔNG CỬ NHÂN</span>
          <span className="block">LIÊN KẾT QUỐC TẾ</span>
        </>
      );
    }
    if (title.includes('DU HỌC')) {
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
      className={`rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg ${styles.borderHover} transition-all duration-200 flex flex-col justify-start overflow-hidden group bg-white h-full`}
    >
      {/* 
        Top Header: Độ cao thoáng đãng, cỡ chữ to bằng tiêu đề "CƠ HỘI DÀNH CHO BẠN" (text-xl sm:text-2xl font-black) theo yêu cầu người dùng
      */}
      <div
        className={`py-5 px-4 min-h-[82px] bg-gradient-to-r ${styles.gradientHeader} text-white flex items-center justify-center text-center shrink-0 shadow-xs`}
      >
        <h3 className="text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-wide leading-tight max-w-[340px]">
          {formatTitle(category.title)}
        </h3>
      </div>

      {/* Program Items List: Rút gọn độ cao nút, line spacing vừa vặn, có icon chuẩn đẹp, không đánh số */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 bg-white flex-1">
        {items.map((scholarship) => {
          const displayTitle = scholarship.cardTitle || scholarship.title;

          return (
            <button
              key={scholarship.id}
              type="button"
              onClick={() => onSelectScholarship(scholarship)}
              className={`w-full group/item text-left py-2 px-3 sm:py-2.5 sm:px-3.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/50 ${styles.cardHoverBorder} shadow-2xs hover:shadow-xs active:translate-y-0 transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* Scholarship Icon */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${styles.iconBg} ${styles.iconColor} flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform`}
                >
                  <DynamicIcon
                    name={scholarship.icon || 'GraduationCap'}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit"
                  />
                </div>

                {/* Scholarship Title */}
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-[12.5px] font-bold text-slate-800 group-hover/item:text-[#1760AB] block leading-snug">
                    {displayTitle}
                  </span>
                </div>
              </div>

              {/* Chevron Arrow */}
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-slate-600 group-hover/item:translate-x-0.5 transition-all shrink-0" />
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
