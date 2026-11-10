'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 120;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 16;
      window.scrollTo({
        top: offsetPosition > 0 ? offsetPosition : 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className="w-full relative mt-8 bg-[#041E38] text-white border-t border-blue-900/40">
      {/* 
        ĐƯỜNG VIỀN TRANG TRÍ MÀU SẮC LOGO DUE (CAM - XANH LÁ - XANH DƯƠNG)
      */}
      <div
        className="w-full h-1"
        style={{
          background: 'linear-gradient(90deg, #F26524 0%, #119046 50%, #1760AB 100%)',
        }}
      />

      {/* KHU VỰC NỘI DUNG CHÍNH (3 CỘT HIỆN ĐẠI, THOÁNG ĐÃNG) */}
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* CỘT 1: NHẬN DIỆN THƯƠNG HIỆU & GIỚI THIỆU (col-span-5) */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1 shadow-md shrink-0">
                <img
                  src="/images/logo-due.png?v=20261110"
                  alt="Trường Đại học Kinh tế – Đại học Đà Nẵng"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider block">
                  ĐẠI HỌC ĐÀ NẴNG
                </span>
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                  TRƯỜNG ĐẠI HỌC KINH TẾ
                </h3>
              </div>
            </div>

            <div className="pt-1">
              <h4 className="text-xs font-extrabold text-[#F26524] uppercase tracking-wide">
                CỔNG THÔNG TIN HỌC BỔNG & HỖ TRỢ SINH VIÊN
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-1 font-normal">
                Hệ thống thông tin chính thức kết nối người học với các chương trình học bổng khuyến khích, học bổng tài năng, học bổng doanh nghiệp và các chính sách an sinh xã hội tại Trường Đại học Kinh tế – Đại học Đà Nẵng.
              </p>
            </div>

            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Kết nối tri thức – Đồng hành cùng sinh viên</span>
            </div>
          </div>

          {/* CỘT 2: THÔNG TIN LIÊN HỆ ĐƠN VỊ THƯỜNG TRỰC (col-span-4) */}
          <div className="lg:col-span-4 space-y-2.5">
            <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-blue-900/60 pb-1.5">
              ĐƠN VỊ THƯỜNG TRỰC TIẾP NHẬN
            </h4>

            <div className="space-y-2 text-[11px] text-slate-300">
              <p className="font-bold text-white text-xs">
                PHÒNG CÔNG TÁC SINH VIÊN (CTSV)
              </p>

              {/* Địa chỉ */}
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Phòng H214, Tòa nhà Đa năng, Trường Đại học Kinh tế – Đại học Đà Nẵng<br />
                  <span className="text-slate-400">71 Ngũ Hành Sơn, Phường Ngũ Hành Sơn, TP. Đà Nẵng</span>
                </span>
              </div>

              {/* Hotline */}
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>
                  Hotline hỗ trợ: <a href="tel:02363956397" className="text-white font-bold hover:text-orange-400 transition-colors">0236 3956 397</a>
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>
                  Email: <a href="mailto:phongcongtacsinhvien@due.edu.vn" className="text-white font-medium hover:text-sky-300 transition-colors">phongcongtacsinhvien@due.edu.vn</a>
                </span>
              </div>

              {/* Website */}
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  Website chính thức: <a href="https://due.udn.vn" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-emerald-300 transition-colors">due.udn.vn</a>
                </span>
              </div>
            </div>
          </div>

          {/* CỘT 3: LIÊN KẾT NHANH (col-span-3) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-blue-900/60 pb-1.5">
              DANH MỤC NHANH
            </h4>

            <ul className="space-y-1.5 text-[11px] font-medium text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('co-hoi')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Cơ hội dành cho bạn</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('muc-thong-bao')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-orange-400" />
                  <span>Thông báo mới nhất</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('muc-lien-he')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span>Thông tin liên hệ</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('muc-faq')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-sky-400" />
                  <span>Câu hỏi thường gặp F&A</span>
                </button>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:text-amber-300 pt-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Quản trị hệ thống (Admin)</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* DÒNG BẢN QUYỀN ĐÁY CÙNG */}
      <div className="w-full bg-[#021324] py-3 px-4 sm:px-6 lg:px-8 border-t border-blue-950/80 text-[11px] text-slate-400">
        <div className="w-full max-w-[1760px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span>
            © 2025 – 2026 <strong>TRƯỜNG ĐẠI HỌC KINH TẾ – ĐẠI HỌC ĐÀ NẴNG</strong>. Thiết kế và phát triển bởi Dịu Linh và Diện Suy
          </span>
          <span className="text-slate-500">
            Cổng thông tin Học bổng & Chế độ chính sách người học DUE
          </span>
        </div>
      </div>
    </footer>
  );
};
