'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  DollarSign,
  Globe2,
  FileText,
} from 'lucide-react';

interface FAQ {
  id: string;
  category: 'all' | 'chung' | 'dai-hoc' | 'sau-dai-hoc' | 'quoc-te' | 'mien-giam' | 'ho-so';
  categoryLabel: string;
  question: string;
  answerHtml: string;
}

const FAQ_LIST: FAQ[] = [
  {
    id: 'faq-1',
    category: 'dai-hoc',
    categoryLabel: 'Học bổng ĐH',
    question: 'Điều kiện xét cấp Học bổng Khuyến khích học tập (KKHT) tại DUE là gì?',
    answerHtml: `
      <p class="mb-2">Học bổng Khuyến khích học tập được xét và cấp theo từng học kỳ dựa trên 02 tiêu chí chính:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li><strong>Kết quả học tập (GPA):</strong> Điểm trung bình chung học kỳ từ 2.5/4.0 trở lên, không có học phần nào bị điểm F và hoàn thành tối thiểu 14 tín chỉ trong kỳ chính.</li>
        <li><strong>Kết quả rèn luyện:</strong> Đạt loại Khá trở lên (từ 65 điểm rèn luyện).</li>
      </ul>
      <p class="text-slate-600">Mức học bổng gồm 3 hạng: Xuất sắc (120% học phí trần), Giỏi (100% học phí trần) và Khá (80% học phí trần), được xét từ cao xuống thấp theo ngân sách của từng Khoa/Chương trình đào tạo.</p>
    `,
  },
  {
    id: 'faq-2',
    category: 'chung',
    categoryLabel: 'Thông tin chung',
    question: 'Sinh viên có thể nhận đồng thời nhiều loại học bổng trong cùng một học kỳ không?',
    answerHtml: `
      <p class="mb-2">Theo quy định hiện hành của Trường Đại học Kinh tế – ĐHĐN:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li>Sinh viên <strong>được phép nhận đồng thời</strong> Học bổng Khuyến khích học tập của Nhà trường và Học bổng từ các Doanh nghiệp, Đơn vị tài trợ ngoài trường (trừ trường hợp nhà tài trợ có quy định riêng loại trừ).</li>
        <li>Đối với các học bổng do Quỹ học bổng DUE hoặc Doanh nghiệp cùng đối tác cấp, Hội đồng xét cấp sẽ ưu tiên phân bổ cơ hội cho nhiều sinh viên có hoàn cảnh và thành tích khác nhau.</li>
      </ul>
    `,
  },
  {
    id: 'faq-3',
    category: 'ho-so',
    categoryLabel: 'Hồ sơ & quy trình',
    question: 'Quy trình và thời gian nhận tiền học bổng sau khi có quyết định chính thức?',
    answerHtml: `
      <p class="mb-2">Quy trình chi trả học bổng tại DUE được thực hiện hoàn toàn tự động và minh bạch:</p>
      <ol class="list-decimal pl-5 space-y-1 mb-2">
        <li>Sau khi Hội đồng ban hành Quyết định chính thức và hết thời gian khiếu nại (05 ngày làm việc), danh sách được chuyển sang Phòng Kế hoạch - Tài chính.</li>
        <li>Nhà trường chuyển khoản trực tiếp học bổng vào <strong>Tài khoản Ngân hàng (BIDV/Vietinbank)</strong> liên kết mã sinh viên.</li>
        <li>Thời gian nhận: Thường từ 7 – 15 ngày làm việc kể từ ngày ra quyết định chi trả.</li>
      </ol>
    `,
  },
  {
    id: 'faq-4',
    category: 'dai-hoc',
    categoryLabel: 'Học bổng ĐH',
    question: 'Học bổng Tinh hoa (DUE – Elite) dành cho đối tượng nào và giá trị bao nhiêu?',
    answerHtml: `
      <p class="mb-2"><strong>Học bổng Tinh hoa DUE – Elite</strong> là chương trình học bổng danh giá bậc nhất dành cho:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li>Tân sinh viên trúng tuyển thẳng hoặc đạt giải Học sinh giỏi Quốc gia, thủ khoa đầu vào các khối ngành.</li>
        <li>Sinh viên xuất sắc duy trì GPA tích lũy từ 3.6/4.0 trở lên, có bài báo khoa học hoặc giải thưởng NCKH cấp Bộ/ĐHĐN.</li>
      </ul>
      <p>Mức trao thưởng: <strong>100% học phí toàn khóa</strong> cùng trợ cấp sinh hoạt phí và ưu tiên tham gia các chương trình trao đổi quốc tế.</p>
    `,
  },
  {
    id: 'faq-5',
    category: 'sau-dai-hoc',
    categoryLabel: 'Học bổng SĐH',
    question: 'Chương trình học bổng Nhà nghiên cứu trẻ và Nhà khoa học sau đại học có yêu cầu gì?',
    answerHtml: `
      <p class="mb-2">Dành cho học viên cao học và nghiên cứu sinh định hướng nghiên cứu tại DUE:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li>Học viên cao học: Có công bố bài báo khoa học thuộc danh mục Scopus/WoS hoặc tạp chí khoa học tính điểm của HĐGSNN; duy trì GPA &ge; 3.2.</li>
        <li>Nghiên cứu sinh: Được hỗ trợ từ 50% đến 100% học phí kèm gói tài trợ nghiên cứu từ 30 – 100 triệu VNĐ khi có bài báo Q1/Q2 quốc tế.</li>
      </ul>
    `,
  },
  {
    id: 'faq-6',
    category: 'mien-giam',
    categoryLabel: 'Miễn giảm học phí & Trợ cấp',
    question: 'Hồ sơ xin miễn giảm học phí và trợ cấp xã hội theo Nghị định 81/2021/NĐ-CP gồm những gì?',
    answerHtml: `
      <p class="mb-2">Sinh viên chuẩn bị hồ sơ nộp về Phòng CTSV vào đầu mỗi học kỳ, gồm:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li>Đơn đề nghị miễn, giảm học phí (theo mẫu quy định của Bộ GD&ĐT).</li>
        <li>Bản sao có chứng thực Giấy chứng nhận hộ nghèo / cận nghèo năm hiện hành (đối với diện hộ nghèo).</li>
        <li>Giấy xác nhận con thương binh, bệnh binh, liệt sĩ hoặc quyết định trợ cấp xã hội (nếu thuộc diện bảo trợ).</li>
        <li>Căn cước công dân và Giấy khai sinh bản sao chứng thực.</li>
      </ul>
    `,
  },
  {
    id: 'faq-7',
    category: 'quoc-te',
    categoryLabel: 'Quốc tế & Du học',
    question: 'Sinh viên DUE có cơ hội nhận học bổng trao đổi quốc tế hoặc chuyển tiếp như thế nào?',
    answerHtml: `
      <p class="mb-2">DUE hợp tác với hơn 50 trường đại học hàng đầu tại Anh, Mỹ, Úc, Pháp, Hàn Quốc, Nhật Bản:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li><strong>Học bổng Erasmus+ (Châu Âu):</strong> Tài trợ 100% vé máy bay và sinh hoạt phí 850 EUR/tháng cho 1 học kỳ trao đổi.</li>
        <li><strong>Học bổng Chuyển tiếp quốc tế (Top-up):</strong> Miễn giảm từ 20% – 50% học phí tại Đại học Hull, Northampton (UK), George Mason (USA).</li>
        <li>Điều kiện cơ bản: GPA từ 3.0/4.0 trở lên và chứng chỉ tiếng Anh IELTS &ge; 6.0.</li>
      </ul>
    `,
  },
  {
    id: 'faq-8',
    category: 'ho-so',
    categoryLabel: 'Hồ sơ & quy trình',
    question: 'Tôi có thể theo dõi và nộp hồ sơ học bổng trực tuyến ở đâu?',
    answerHtml: `
      <p class="mb-2">Sinh viên có thể nộp hồ sơ hoàn toàn trực tuyến:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li>Truy cập Cổng thông tin học bổng DUE, bấm vào chương trình học bổng bạn quan tâm để tải mẫu đơn đăng ký.</li>
        <li>Nộp trực tuyến qua <strong>Hệ thống quản lý sinh viên DUE Portal (sinhvien.due.udn.vn)</strong> hoặc nộp bản cứng tại Phòng Công tác Sinh viên (Phòng H214).</li>
        <li>Mọi thắc mắc sinh viên có thể gửi câu hỏi qua form hỗ trợ hoặc liên hệ Hotline: <strong>0236 3956 397</strong>.</li>
      </ul>
    `,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tất cả câu hỏi' },
  { id: 'chung', label: 'Thông tin chung' },
  { id: 'dai-hoc', label: 'Học bổng ĐH' },
  { id: 'sau-dai-hoc', label: 'Học bổng SĐH' },
  { id: 'quoc-te', label: 'Quốc tế & Du học' },
  { id: 'mien-giam', label: 'Miễn giảm học phí' },
  { id: 'ho-so', label: 'Hồ sơ & Quy trình' },
];

export const FAQSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(FAQ_LIST);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true, // Open first question by default
  });

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch('/api/data?type=faqs', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFaqs(data as FAQ[]);
          }
        }
      } catch (e) {
        console.error('Failed to load FAQs:', e);
      }
    }
    loadFaqs();
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
    <section id="muc-faq" className="w-full pt-4 border-t border-slate-200">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] text-xs font-black uppercase tracking-wide">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>CÂU HỎI THƯỜNG GẶP</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1760AB] uppercase tracking-tight">
          CÂU HỎI THƯỜNG GẶP
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Giải đáp nhanh các thắc mắc phổ biến về học bổng, chính sách hỗ trợ và quy trình đăng ký.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm nhanh câu hỏi, từ khóa (GPA, hồ sơ, thời gian nhận tiền...)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#0B4899] transition-all shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0B4899] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3.5 max-w-4xl mx-auto">
        {filteredFAQs.map((faq) => {
          const isOpen = !!openIds[faq.id];
          return (
            <div
              key={faq.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-[#0B4899]/60 shadow-md ring-1 ring-[#0B4899]/10'
                  : 'border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(faq.id)}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#0B4899] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    Q
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {faq.categoryLabel}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isOpen ? 'bg-[#0B4899] text-white rotate-180' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                  <div
                    className="due-popup-html-content space-y-2"
                    dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Không tìm thấy câu hỏi phù hợp</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Không có câu hỏi nào khớp với từ khóa tìm kiếm. Bạn có thể gửi câu hỏi trực tiếp cho Phòng Công tác Sinh viên để được hỗ trợ.
            </p>
          </div>
        )}
      </div>

      {/* Call to Action Banner */}
      <div className="mt-10 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0A376B] via-[#0B4899] to-[#0E87A7] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Hỗ trợ trực tuyến 24/7</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black">Bạn vẫn còn thắc mắc chưa được giải đáp?</h3>
          <p className="text-xs text-white/85 max-w-lg">
            Đừng ngần ngại liên hệ hoặc gửi form thắc mắc cho Phòng Công tác Sinh viên DUE để được giải đáp cụ thể và nhanh chóng.
          </p>
        </div>

        <button
          type="button"
          onClick={scrollToContact}
          className="shrink-0 px-5 py-3 rounded-2xl bg-white text-[#0B4899] hover:bg-orange-50 hover:text-[#FA541C] font-black text-xs shadow-md transition-all flex items-center gap-2 group cursor-pointer"
        >
          <span>Gửi câu hỏi ngay</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
