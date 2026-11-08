'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Globe,
  Headphones,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryCardGrid } from '@/components/CategoryCardGrid';
import { ScholarshipModal } from '@/components/ScholarshipModal';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import { SearchFilterModal } from '@/components/SearchFilterModal';
import { NotificationsModal } from '@/components/NotificationsModal';
import { FAQSection } from '@/components/FAQSection';
import { Category, Scholarship, Announcement } from '@/types';
import { initialData } from '@/data/initialData';

function PortalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>(initialData.categories);
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialData.scholarships);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialData.announcements);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Form states
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    topic: 'hoc-bong-dh',
    content: '',
  });

  // Fetch updated data from API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/data', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.categories) setCategories(data.categories);
          if (data.scholarships) setScholarships(data.scholarships);
          if (data.announcements) setAnnouncements(data.announcements);
        }
      } catch (e) {
        console.error('Failed to load portal data, using initial data:', e);
      }
    }
    loadData();
  }, []);

  // Handle deep-link via query parameter: ?scholarship=slug-or-id
  useEffect(() => {
    const slug = searchParams.get('scholarship');
    if (slug && scholarships.length > 0) {
      const found = scholarships.find((s) => s.slug === slug || s.id === slug);
      if (found) {
        setSelectedScholarship(found);
      }
    }
  }, [searchParams, scholarships]);

  // Open scholarship modal & increment views
  const handleSelectScholarship = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    const url = new URL(window.location.href);
    url.searchParams.set('scholarship', scholarship.slug || scholarship.id);
    window.history.pushState({}, '', url.toString());

    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'increment_views',
        payload: { id: scholarship.id },
      }),
    }).catch((err) => console.error(err));
  };

  const handleCloseModal = () => {
    setSelectedScholarship(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('scholarship');
    window.history.pushState({}, '', url.toString());
  };

  const activeCategories = [...categories]
    .filter((c) => c.isActive !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F9FF] via-[#EBF4FE] to-[#F2F8FE] flex flex-col font-sans selection:bg-[#1760AB] selection:text-white">
      {/* 
        HEADER: Official Brand Identity & Centered 4-Item Menu (No icons, 100% Solid Crisp White Text)
        Gradient: linear-gradient(90deg, #0171D7 0%, #0E87A7 35%, #1B9C78 70%, #2BB73F 100%)
      */}
      <Header
        categories={activeCategories}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 
        ============================================================
        HERO BANNER: NẰM NGAY DƯỚI THANH MENU
        Nhận diện thương hiệu DUE, khẩu hiệu, 4 chỉ số & CTA nhanh
        ============================================================
      */}
      <HeroBanner />

      {/* 
        ============================================================
        PHẦN 1 – CƠ HỘI DÀNH CHO BẠN
        Lưới 3 Cột × 2 Hàng (Cân đối, Chiều cao đồng đều, Không có sub nhỏ)
        ============================================================
      */}
      <div className="w-full flex-1">
        <main id="co-hoi" className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 scroll-mt-36">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1760AB] uppercase tracking-tight">
              CƠ HỘI DÀNH CHO BẠN
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Khám phá các chương trình học bổng, chính sách hỗ trợ và cơ hội phát triển dành cho người học tại Trường Đại học Kinh tế – Đại học Đà Nẵng.
            </p>
          </div>

          {/* 3 CỘT × 2 HÀNG BỐ CỤC HIỆN ĐẠI (Category Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {activeCategories.map((category) => (
              <CategoryCardGrid
                key={category.id}
                category={category}
                scholarships={scholarships}
                onSelectScholarship={handleSelectScholarship}
              />
            ))}
          </div>
        </main>
      </div>

      {/* 
        ============================================================
        CONTAINER CHO CÁC PHẦN 2, 3, 4
        ============================================================
      */}
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* 
          ----------------------------------------------------------
          PHẦN 2 – THÔNG BÁO (HIỂN THỊ ĐỦ 6 THÔNG BÁO THEO YÊU CẦU)
          ----------------------------------------------------------
        */}
        <section id="muc-thong-bao" className="pt-2 scroll-mt-36">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#F26524] text-white flex items-center justify-center shadow-xs shrink-0">
                <span className="text-lg font-black">!</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-[#1760AB] uppercase tracking-tight">
                    THÔNG BÁO
                  </h2>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F26524] uppercase border border-orange-200">
                    Cập nhật mới
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Cập nhật nhanh chóng các thông tin, chính sách và cơ hội học bổng mới nhất dành cho người học.
                </p>
              </div>
            </div>

            <Link
              href="/thong-bao"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1760AB] hover:text-blue-900 bg-white hover:bg-blue-50 px-4 py-2 rounded-full border border-blue-200 transition-colors shrink-0 shadow-xs"
            >
              <span>Xem tất cả thông báo</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid 6 Notification Cards (3 Cột x 2 Hàng) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {announcements.slice(0, 6).map((ann, idx) => {
              const badgeColors = [
                'bg-blue-50 text-[#1760AB] border-blue-200',
                'bg-orange-50 text-[#F26524] border-orange-200',
                'bg-emerald-50 text-[#119046] border-emerald-200',
              ];
              const badgeClass = badgeColors[idx % 3];

              return (
                <div
                  key={ann.id}
                  onClick={() => setSelectedAnnouncement(ann)}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-[#1760AB] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border ${badgeClass}`}>
                        {ann.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{ann.publishedAt}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1760AB] leading-snug line-clamp-2 transition-colors">
                      {ann.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {ann.excerpt || ann.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1760AB] group-hover:text-blue-700">
                    <span className="flex items-center gap-1">
                      <span>Xem chi tiết thông báo</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">Nhấn để mở</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 
          ----------------------------------------------------------
          PHẦN 3 – LIÊN HỆ (2 Cột Chuyên Nghiệp)
          ----------------------------------------------------------
        */}
        <section id="muc-lien-he" className="pt-2 border-t border-slate-200 scroll-mt-36">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-[#119046] text-white flex items-center justify-center shadow-xs shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1760AB] uppercase tracking-tight">
                LIÊN HỆ
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp các thắc mắc liên quan đến học bổng và chính sách hỗ trợ người học.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Cột trái – Thông tin liên hệ */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] font-black text-[#1760AB] tracking-wider uppercase">
                  ĐƠN VỊ PHỤ TRÁCH: PHÒNG CÔNG TÁC SINH VIÊN – TRƯỜNG ĐẠI HỌC KINH TẾ (DUE)
                </span>
              </div>

              {/* Địa chỉ */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
                <div className="w-9 h-9 rounded-xl bg-[#1760AB] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="font-extrabold text-[#1760AB] block uppercase text-[11px]">Địa chỉ văn phòng:</span>
                  <p className="text-slate-800 font-bold">
                    Phòng H214, Tòa nhà Hành chính, Trường Đại học Kinh tế – Đại học Đà Nẵng
                  </p>
                  <p className="text-slate-500 font-medium">71 Ngũ Hành Sơn, Phường Mỹ An, Quận Ngũ Hành Sơn, TP. Đà Nẵng</p>
                </div>
              </div>

              {/* Điện thoại */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100">
                <div className="w-9 h-9 rounded-xl bg-[#F26524] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="font-extrabold text-[#F26524] block uppercase text-[11px]">Điện thoại đường dây nóng (Hotline):</span>
                  <a
                    href="tel:02363956397"
                    className="text-base font-black text-slate-900 hover:text-[#F26524] transition-colors inline-block"
                  >
                    0236 3956 397
                  </a>
                  <span className="text-slate-500 text-[11px] block">(Hỗ trợ giải đáp các chế độ chính sách và học bổng sinh viên)</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="w-9 h-9 rounded-xl bg-[#009FE3] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="font-extrabold text-[#009FE3] block uppercase text-[11px]">Hộp thư điện tử (Email):</span>
                  <a
                    href="mailto:phongcongtacsinhvien@due.edu.vn"
                    className="text-sm font-bold text-slate-900 hover:text-[#009FE3] transition-colors inline-block"
                  >
                    phongcongtacsinhvien@due.edu.vn
                  </a>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="w-9 h-9 rounded-xl bg-[#119046] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="font-extrabold text-[#119046] block uppercase text-[11px]">Trang thông tin điện tử (Website):</span>
                  <a
                    href="https://due.udn.vn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-slate-900 hover:text-[#119046] transition-colors inline-block"
                  >
                    www.due.edu.vn &nbsp;|&nbsp; hocbong.id.vn
                  </a>
                </div>
              </div>

              {/* Thời gian làm việc */}
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>Thời gian làm việc:</strong> Thứ Hai – Thứ Sáu (Sáng: 07:30 – 11:30 | Chiều: 13:30 – 17:00)
                </span>
              </div>
            </div>

            {/* Cột phải – Form liên hệ */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <span className="text-[11px] font-black text-[#F26524] tracking-wider uppercase">
                  GỬI YÊU CẦU TƯ VẤN & HỖ TRỢ TRỰC TUYẾN
                </span>
              </div>

              {contactSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900">Đã gửi yêu cầu thành công!</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Phòng Công tác Sinh viên Trường Đại học Kinh tế – ĐHĐN đã tiếp nhận thông tin và sẽ phản hồi qua email của bạn trong thời gian sớm nhất.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactForm({
                        fullName: '',
                        email: '',
                        phone: '',
                        topic: 'hoc-bong-dh',
                        content: '',
                      });
                    }}
                    className="mt-2 text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-3.5 text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
                    <input
                      required
                      type="text"
                      value={contactForm.fullName}
                      onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:border-[#1760AB] font-medium text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email *</label>
                      <input
                        required
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="email@due.edu.vn"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:border-[#1760AB] font-medium text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                      <input
                        required
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="0905 xxx xxx"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:border-[#1760AB] font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nhóm vấn đề cần liên hệ *</label>
                    <select
                      value={contactForm.topic}
                      onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:border-[#1760AB] text-slate-700 font-medium"
                    >
                      <option value="hoc-bong-dh">1. Học bổng Khuyến khích học tập & Tài năng Đại học</option>
                      <option value="hoc-bong-sdh">2. Học bổng Sau Đại học (Cao học / NCS)</option>
                      <option value="doanh-nghiep">3. Học bổng Doanh nghiệp & Đơn vị ngoài trường</option>
                      <option value="mien-giam">4. Miễn giảm học phí & Trợ cấp xã hội</option>
                      <option value="quoc-te">5. Học bổng Cử nhân Liên kết & Du học</option>
                      <option value="khac">6. Vấn đề khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nội dung cần hỗ trợ *</label>
                    <textarea
                      required
                      rows={3}
                      value={contactForm.content}
                      onChange={(e) => setContactForm({ ...contactForm, content: e.target.value })}
                      placeholder="Mô tả cụ thể câu hỏi hoặc nội dung bạn cần Nhà trường hỗ trợ..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:border-[#1760AB] text-slate-800 font-medium leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-2xl bg-[#1760AB] hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi liên hệ</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 
          ----------------------------------------------------------
          PHẦN 4 – F&A (CÂU HỎI THƯỜNG GẶP)
          ----------------------------------------------------------
        */}
        <div className="scroll-mt-36" id="muc-faq">
          <FAQSection />
        </div>
      </div>

      {/* 
        ============================================================
        FOOTER: Ở ĐÁY CÙNG TRANG (4 CỘT CHUẨN ĐẠI HỌC CAO CẤP)
        ============================================================
      */}
      <Footer />

      {/* Popup chi tiết học bổng */}
      <ScholarshipModal
        scholarship={selectedScholarship}
        onClose={handleCloseModal}
      />

      {/* Popup chi tiết thông báo */}
      <AnnouncementModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />

      {/* Modal tìm kiếm đa năng */}
      <SearchFilterModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        scholarships={scholarships}
        categories={activeCategories}
        initialQuery={searchQuery}
        onSelectScholarship={handleSelectScholarship}
      />

      {/* Modal thông báo */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        announcements={announcements}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Đang tải Cổng thông tin học bổng DUE...</div>}>
      <PortalContent />
    </Suspense>
  );
}
