'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

interface FAQ {
  id: string;
  category: 'all' | 'dai-hoc' | 'ngoai-truong' | 'mien-giam' | 'du-hoc' | 'sau-dai-hoc' | 'lien-ket';
  categoryLabel: string;
  question: string;
  answerHtml: string;
}

// Dữ liệu mẫu đã được xóa hoàn toàn theo yêu cầu người dùng
const FAQ_LIST: FAQ[] = [];

// 6 danh mục học bổng chuẩn
const CATEGORIES = [
  { id: 'all', label: 'Tất cả câu hỏi' },
  { id: 'dai-hoc', label: 'Học bổng Bậc Đại học' },
  { id: 'ngoai-truong', label: 'Học bổng Đơn vị ngoài trường' },
  { id: 'mien-giam', label: 'Chính sách Miễn giảm' },
  { id: 'du-hoc', label: 'Học bổng Du học' },
  { id: 'sau-dai-hoc', label: 'Học bổng Bậc Sau đại học' },
  { id: 'lien-ket', label: 'Học bổng Chương trình Cử nhân Liên kết quốc tế' },
];

export const FAQSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(FAQ_LIST);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/data?type=faqs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data);
        } else {
          setFaqs([]);
        }
      })
      .catch(() => setFaqs([]));
  }, []);

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCategory = activeTab === 'all' || faq.category === activeTab;
      const matchSearch =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answerHtml.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [faqs, activeTab, searchQuery]);

  const scrollToContact = () => {
    const el = document.getElementById('muc-lien-he');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="muc-faq" className="w-full pt-2 border-t border-slate-200">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-4 space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-[#1760AB] uppercase tracking-tight">
          CÂU HỎI THƯỜNG GẶP
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Giải đáp nhanh các thắc mắc phổ biến về học bổng, chính sách hỗ trợ và quy trình đăng ký.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs mb-4 space-y-2.5">
        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm nhanh câu hỏi, từ khóa (GPA, hồ sơ, thời gian nhận tiền...)..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#1760AB] transition-all shadow-inner"
          />
        </div>

        {/* 6 Category Pills + Tất cả câu hỏi */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1760AB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion FAQ List hoặc Thông báo chưa có dữ liệu */}
      <div className="space-y-2 max-w-4xl mx-auto">
        {filteredFAQs.map((faq) => {
          const isOpen = !!openIds[faq.id];
          return (
            <div
              key={faq.id}
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-[#1760AB]/60 shadow-sm ring-1 ring-[#1760AB]/10'
                  : 'border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(faq.id)}
                className="w-full text-left p-3 sm:p-3.5 flex items-start justify-between gap-3 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1760AB] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 inline-block mb-1">
                    {faq.categoryLabel}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </h3>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                    isOpen ? 'bg-[#1760AB] text-white rotate-180' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                  <div
                    className="due-popup-html-content space-y-1.5"
                    dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Thông báo chuẩn khi chưa có dữ liệu */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200/90 p-8 space-y-2.5 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1760AB] flex items-center justify-center mx-auto border border-blue-100">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              Hiện nay chưa có câu hỏi nào trong mục này
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Hệ thống đang tiếp tục cập nhật các nội dung giải đáp chính thức. Mọi thắc mắc hoặc cần hỗ trợ thêm, người học vui lòng liên hệ trực tiếp Phòng Công tác Sinh viên (CTSV).
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToContact}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-[#1760AB] hover:bg-[#1760AB] hover:text-white font-bold text-xs border border-blue-200/80 transition-all cursor-pointer"
              >
                <span>Xem thông tin liên hệ CTSV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action Banner */}
      <div className="mt-6 max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#041E38] via-[#0B4899] to-[#0E87A7] text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
            <MessageCircle className="w-3 h-3" />
            <span>Hỗ trợ người học</span>
          </div>
          <h3 className="text-base sm:text-lg font-black">Bạn vẫn còn thắc mắc cần được giải đáp?</h3>
          <p className="text-[11px] text-white/85 max-w-lg">
            Đừng ngần ngại liên hệ trực tiếp với Phòng Công tác Sinh viên (CTSV) để được tư vấn và hỗ trợ nhanh chóng nhất.
          </p>
        </div>

        <button
          type="button"
          onClick={scrollToContact}
          className="shrink-0 px-4 py-2 rounded-xl bg-white text-[#1760AB] hover:bg-[#F26524] hover:text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 group cursor-pointer"
        >
          <span>Xem thông tin liên hệ</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
