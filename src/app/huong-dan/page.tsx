'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FileText, CheckCircle2, AlertCircle, HelpCircle, ArrowLeft, Download } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 mb-6 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang chủ Cổng học bổng</span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B2545] uppercase tracking-tight">
              Hướng dẫn Xét cấp & Nộp hồ sơ Học bổng DUE
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Quy trình chuẩn hóa dành cho sinh viên, học viên và người học quốc tế tại Trường Đại học Kinh tế – ĐHĐN
            </p>
          </div>

          {/* Section 1: Quy trình */}
          <section id="quy-trinh" className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              Quy trình xét cấp học bổng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                <span className="font-bold text-blue-800 block mb-1">Bước 1: Thông báo</span>
                <p className="text-slate-600">Nhà trường công bố tiêu chuẩn, số suất và thời hạn nhận hồ sơ trên Cổng thông tin.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200">
                <span className="font-bold text-orange-800 block mb-1">Bước 2: Nộp hồ sơ</span>
                <p className="text-slate-600">Sinh viên chuẩn bị hồ sơ minh chứng và nộp trực tuyến hoặc tại Phòng CTSV/Khoa.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="font-bold text-amber-800 block mb-1">Bước 3: Hội đồng xét</span>
                <p className="text-slate-600">Hội đồng học bổng họp xét duyệt công khai, minh bạch theo thứ tự ưu tiên.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="font-bold text-emerald-800 block mb-1">Bước 4: Trao học bổng</span>
                <p className="text-slate-600">Ban hành Quyết định khen thưởng và chuyển khoản trực tiếp vào tài khoản ngân hàng của SV.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Hồ sơ */}
          <section id="ho-so" className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-orange-700 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              Hồ sơ & Giấy tờ minh chứng cần thiết
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc list-inside">
              <li>Đơn đăng ký xét cấp học bổng theo mẫu tương ứng từng chương trình.</li>
              <li>Bảng điểm kết quả học tập và rèn luyện (có đóng dấu xác nhận của Phòng Đào tạo hoặc trích xuất từ Cổng sinh viên).</li>
              <li>Giấy chứng nhận hộ nghèo/cận nghèo, gia đình chính sách hoặc hoàn cảnh đặc biệt (nếu xét diện chính sách/vượt khó).</li>
              <li>Bản sao các văn bằng, chứng chỉ ngoại ngữ quốc tế, giải thưởng NCKH, thành tích hoạt động Đoàn - Hội.</li>
            </ul>
          </section>

          {/* Section 3: FAQ */}
          <section id="faq" className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-black flex items-center justify-center">
                3
              </span>
              Câu hỏi thường gặp (FAQ)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-800">Một sinh viên có thể nhận cùng lúc nhiều loại học bổng không?</h4>
                <p className="text-slate-600 mt-1">
                  Theo quy định của DUE, học bổng Khuyến khích học tập (KKHT) và học bổng tài trợ của Doanh nghiệp ngoài trường có thể được nhận đồng thời nếu đơn vị tài trợ không có quy định ràng buộc khác.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-800">Học bổng DUE-Elite duy trì thế nào qua các năm?</h4>
                <p className="text-slate-600 mt-1">
                  Sinh viên nhận học bổng DUE-Elite cần duy trì điểm trung bình học tập tích lũy từ 3.2/4.0 trở lên và điểm rèn luyện loại Tốt trở lên ở mỗi năm học.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
