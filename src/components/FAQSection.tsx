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

const FAQ_LIST: FAQ[] = [
  {
    id: 'faq-1',
    category: 'dai-hoc',
    categoryLabel: 'Học bổng Bậc Đại học',
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
    category: 'ngoai-truong',
    categoryLabel: 'Học bổng Đơn vị ngoài trường',
    question: 'Sinh viên có thể nhận đồng thời Học bổng Doanh nghiệp và Học bổng Khuyến khích học tập của Trường không?',
    answerHtml: `
      <p class="mb-2">Theo quy định hiện hành của Trường Đại học Kinh tế – ĐHĐN:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li>Sinh viên <strong>được phép nhận đồng thời</strong> Học bổng Khuyến khích học tập của Nhà trường và Học bổng từ các Doanh nghiệp, cựu sinh viên, Quỹ Hạt giống tốt lành (trừ trường hợp nhà tài trợ có thỏa thuận loại trừ cụ thể).</li>
        <li>Hội đồng xét cấp học bổng ngoài trường luôn ưu tiên những sinh viên có hoàn cảnh khó khăn vươn lên trong học tập, hoặc sinh viên có thành tích xuất sắc trong phong trào nghiên cứu, khởi nghiệp.</li>
      </ul>
    `,
  },
  {
    id: 'faq-4',
    category: 'dai-hoc',
    categoryLabel: 'Học bổng Bậc Đại học',
    question: 'Học bổng Tinh hoa (DUE – Elite) dành cho đối tượng nào và giá trị bao nhiêu?',
    answerHtml: `
      <p class="mb-2"><strong>Học bổng Tinh hoa DUE – Elite</strong> là chương trình học bổng danh giá bậc nhất dành cho:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li>Tân sinh viên trúng tuyển thẳng hoặc đạt giải Học sinh giỏi Quốc gia, thủ khoa đầu vào các khối ngành tuyển sinh của DUE.</li>
        <li>Sinh viên xuất sắc duy trì GPA tích lũy từ 3.6/4.0 trở lên, có bài báo khoa học hoặc giải thưởng NCKH cấp Bộ/ĐHĐN.</li>
      </ul>
      <p>Mức trao thưởng: <strong>100% học phí toàn khóa</strong> cùng gói trợ cấp sinh hoạt phí và ưu tiên đặc biệt khi tham gia các chương trình trao đổi quốc tế.</p>
    `,
  },
  {
    id: 'faq-5',
    category: 'sau-dai-hoc',
    categoryLabel: 'Học bổng Bậc Sau đại học',
    question: 'Chương trình học bổng Phát triển Nhà nghiên cứu trẻ và Nhà khoa học sau đại học có yêu cầu gì?',
    answerHtml: `
      <p class="mb-2">Chương trình dành riêng cho học viên cao học và nghiên cứu sinh tại DUE nhằm đẩy mạnh công bố khoa học quốc tế:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li><strong>Học viên cao học:</strong> Hỗ trợ học phí và kinh phí khi có bài báo khoa học đăng trên tạp chí thuộc danh mục WoS/Scopus hoặc kỷ yếu hội thảo quốc tế uy tín; duy trì GPA &ge; 3.2.</li>
        <li><strong>Nghiên cứu sinh:</strong> Được hỗ trợ từ 50% đến 100% học phí toàn khóa kèm gói tài trợ nghiên cứu từ 30 – 100 triệu VNĐ khi có bài báo Q1/Q2 quốc tế.</li>
      </ul>
    `,
  },
  {
    id: 'faq-6',
    category: 'mien-giam',
    categoryLabel: 'Chính sách Miễn giảm',
    question: 'Hồ sơ xin miễn giảm học phí, trợ cấp xã hội và hỗ trợ lãi vay NHCSXH gồm những gì?',
    answerHtml: `
      <p class="mb-2">Sinh viên chuẩn bị hồ sơ nộp về Phòng CTSV vào đầu mỗi học kỳ theo thông báo, gồm:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li>Đơn đề nghị miễn, giảm học phí (theo mẫu quy định của Bộ GD&ĐT ban hành kèm Nghị định 81/2021/NĐ-CP).</li>
        <li>Bản sao có chứng thực Giấy chứng nhận hộ nghèo / cận nghèo năm hiện hành (đối với diện hộ nghèo).</li>
        <li>Giấy xác nhận con thương binh, bệnh binh, thân nhân liệt sĩ hoặc quyết định trợ cấp xã hội.</li>
        <li>Giấy xác nhận vay vốn sinh viên tại Ngân hàng Chính sách Xã hội để được hỗ trợ lãi suất theo quy định.</li>
      </ul>
    `,
  },
  {
    id: 'faq-7',
    category: 'du-hoc',
    categoryLabel: 'Học bổng Du học',
    question: 'Sinh viên DUE có cơ hội nhận học bổng trao đổi quốc tế hoặc du học chuyển tiếp như thế nào?',
    answerHtml: `
      <p class="mb-2">DUE hợp tác chiến lược với hơn 50 trường đại học hàng đầu tại Anh, Mỹ, Úc, Pháp, Hàn Quốc, Nhật Bản:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li><strong>Học bổng Erasmus+ (Châu Âu):</strong> Tài trợ 100% vé máy bay và sinh hoạt phí lên đến 850 EUR/tháng cho 1 học kỳ trao đổi tín chỉ.</li>
        <li><strong>Học bổng Chuyển tiếp quốc tế (Top-up):</strong> Miễn giảm từ 20% – 50% học phí tại Đại học Hull, Northampton (Vương quốc Anh), George Mason (Hoa Kỳ).</li>
        <li>Điều kiện cơ bản: GPA từ 3.0/4.0 trở lên và chứng chỉ tiếng Anh quốc tế IELTS &ge; 6.0 hoặc tương đương.</li>
      </ul>
    `,
  },
  {
    id: 'faq-8',
    category: 'lien-ket',
    categoryLabel: 'Học bổng Chương trình Cử nhân Liên kết quốc tế',
    question: 'Chính sách học bổng dành cho sinh viên Chương trình Cử nhân Liên kết quốc tế (BTEC – HND, Top-up)?',
    answerHtml: `
      <p class="mb-2">Viện Đào tạo Quốc tế DUE áp dụng quỹ học bổng riêng biệt dành cho sinh viên hệ liên kết:</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li><strong>Học bổng tuyển sinh:</strong> Dành cho thí sinh có điểm xét tuyển đầu vào cao, đạt chứng chỉ IELTS &ge; 6.5 trở lên khi nhập học.</li>
        <li><strong>Học bổng chương trình tiếng Anh & đại cương:</strong> Khen thưởng sinh viên đạt thành tích xuất sắc ở giai đoạn BTEC – HND.</li>
        <li><strong>Học bổng chuyển tiếp năm cuối (Top Up year):</strong> Giảm trừ trực tiếp học phí năm tốt nghiệp tại trường đại học đối tác nước ngoài.</li>
      </ul>
    `,
  },
  {
    id: 'faq-3',
    category: 'dai-hoc',
    categoryLabel: 'Học bổng Bậc Đại học',
    question: 'Quy trình và thời gian nhận tiền học bổng sau khi có quyết định chính thức?',
    answerHtml: `
      <p class="mb-2">Quy trình chi trả học bổng tại DUE được thực hiện hoàn toàn tự động và minh bạch:</p>
      <ol class="list-decimal pl-5 space-y-1 mb-2">
        <li>Sau khi Hội đồng ban hành Quyết định chính thức và hết thời hạn khiếu nại (05 ngày làm việc), danh sách được chuyển sang Phòng Kế hoạch - Tài chính.</li>
        <li>Nhà trường chuyển khoản trực tiếp học bổng vào <strong>Tài khoản Ngân hàng</strong> liên kết mã sinh viên.</li>
        <li>Thời gian nhận: Thường từ 7 – 15 ngày làm việc kể từ ngày ban hành quyết định chi trả.</li>
      </ol>
    `,
  },
];

// Exact 6 scholarship categories matching portal structure
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
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true, // Open first question by default
  });

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
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#0B4899] transition-all shadow-inner"
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

      {/* Accordion FAQ List: Bỏ hoàn toàn ký hiệu chữ Q theo yêu cầu */}
      <div className="space-y-2 max-w-4xl mx-auto">
        {filteredFAQs.map((faq) => {
          const isOpen = !!openIds[faq.id];
          return (
            <div
              key={faq.id}
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-[#0B4899]/60 shadow-sm ring-1 ring-[#0B4899]/10'
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
                    isOpen ? 'bg-[#0B4899] text-white rotate-180' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">Không tìm thấy câu hỏi phù hợp</h4>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              Không có câu hỏi nào khớp với chuyên mục hoặc từ khóa tìm kiếm. Bạn có thể liên hệ trực tiếp Phòng Công tác Sinh viên để được giải đáp.
            </p>
          </div>
        )}
      </div>

      {/* Call to Action Banner */}
      <div className="mt-6 max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0A376B] via-[#0B4899] to-[#0E87A7] text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
            <MessageCircle className="w-3 h-3" />
            <span>Hỗ trợ trực tuyến</span>
          </div>
          <h3 className="text-base sm:text-lg font-black">Bạn vẫn còn thắc mắc chưa được giải đáp?</h3>
          <p className="text-[11px] text-white/85 max-w-lg">
            Đừng ngần ngại liên hệ với Phòng Công tác Sinh viên DUE để được giải đáp cụ thể và nhanh chóng.
          </p>
        </div>

        <button
          type="button"
          onClick={scrollToContact}
          className="shrink-0 px-4 py-2 rounded-xl bg-white text-[#0B4899] hover:bg-orange-50 hover:text-[#FA541C] font-black text-xs shadow-md transition-all flex items-center gap-1.5 group cursor-pointer"
        >
          <span>Xem thông tin liên hệ</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
