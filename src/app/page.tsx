'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
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

const ANNOUNCEMENT_CATEGORY_FILTERS = [
  { id: 'all', label: 'Tất cả thông báo', match: '' },
  { id: 'dai-hoc', label: 'Học bổng Bậc Đại học', match: 'Đại học' },
  { id: 'ngoai-truong', label: 'Học bổng Đơn vị ngoài trường', match: 'ngoài trường' },
  { id: 'mien-giam', label: 'Chính sách Miễn giảm', match: 'miễn giảm' },
  { id: 'du-hoc', label: 'Học bổng Du học', match: 'Du học' },
  { id: 'sau-dai-hoc', label: 'Học bổng Bậc Sau đại học', match: 'Sau đại học' },
  { id: 'lien-ket', label: 'Học bổng Chương trình Cử nhân Liên kết quốc tế', match: 'Liên kết' },
];

function PortalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>(initialData.categories);
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialData.scholarships);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialData.announcements);
  const [selectedAnnouncementCategory, setSelectedAnnouncementCategory] = useState<string>('all');
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filteredAnnouncements = useMemo(() => {
    if (selectedAnnouncementCategory === 'all') return announcements;
    const catObj = ANNOUNCEMENT_CATEGORY_FILTERS.find((c) => c.id === selectedAnnouncementCategory);
    if (!catObj) return announcements;
    return announcements.filter((a) =>
      a.category.toLowerCase().includes(catObj.match.toLowerCase())
    );
  }, [announcements, selectedAnnouncementCategory]);

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
        <main id="co-hoi" className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-6 scroll-mt-28">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-4 space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-[#1760AB] uppercase tracking-tight">
              CƠ HỘI DÀNH CHO BẠN
            </h1>
            <p className="text-xs text-slate-500 font-medium leading-normal">
              Khám phá các chương trình học bổng, chính sách hỗ trợ và cơ hội phát triển dành cho người học
              <br />
              tại Trường Đại học Kinh tế – Đại học Đà Nẵng.
            </p>
          </div>

          {/* 3 CỘT × 2 HÀNG BỐ CỤC HIỆN ĐẠI (Category Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 items-stretch">
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
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* 
          ----------------------------------------------------------
          PHẦN 2 – THÔNG BÁO (HIỂN THỊ ĐỦ 6 THÔNG BÁO THEO YÊU CẦU)
          ----------------------------------------------------------
        */}
        <section id="muc-thong-bao" className="pt-1 scroll-mt-28">
          {/* Section Header Căn giữa */}
          <div className="text-center max-w-2xl mx-auto mb-4 space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#1760AB] uppercase tracking-tight">
              THÔNG BÁO
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Cập nhật nhanh chóng các thông tin, chính sách và cơ hội học bổng mới nhất dành cho người học.
            </p>
          </div>

          {/* BỘ LỌC 6 DANH MỤC HỌC BỔNG TRỰC TIẾP TRÊN TRANG CHỦ */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mb-4">
            {ANNOUNCEMENT_CATEGORY_FILTERS.map((cat) => {
              const isActive = selectedAnnouncementCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedAnnouncementCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1760AB] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Grid Notification Cards (3 Cột x 2 Hàng) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnnouncements.slice(0, 6).map((ann, idx) => {
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
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-[#1760AB] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${badgeClass}`}>
                        {ann.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{ann.publishedAt}</span>
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#1760AB] leading-snug line-clamp-2 transition-colors">
                      {ann.title}
                    </h3>

                    <p className="text-[11.5px] text-slate-500 line-clamp-2 leading-relaxed">
                      {ann.excerpt || ann.content}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1760AB] group-hover:text-blue-700">
                    <span className="flex items-center gap-1">
                      <span>Xem chi tiết thông báo</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[10.5px] text-slate-400 font-normal">Nhấn để mở</span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAnnouncements.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs italic bg-white rounded-2xl border border-slate-200">
              Không có thông báo nào thuộc danh mục này.
            </div>
          )}

          {/* Nút Xem tất cả thông báo căn giữa */}
          <div className="mt-6 text-center">
            <Link
              href={
                selectedAnnouncementCategory !== 'all'
                  ? `/thong-bao?category=${selectedAnnouncementCategory}`
                  : '/thong-bao'
              }
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-[13px] font-bold text-[#1760AB] hover:text-white bg-white hover:bg-[#1760AB] border border-blue-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
            >
              <span>Xem tất cả thông báo</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* 
          ----------------------------------------------------------
          PHẦN 3 – LIÊN HỆ
          ----------------------------------------------------------
        */}
        <section id="muc-lien-he" className="pt-2 border-t border-slate-200 scroll-mt-28">
          {/* Section Header Căn giữa */}
          <div className="text-center max-w-2xl mx-auto mb-4 space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#1760AB] uppercase tracking-tight">
              THÔNG TIN LIÊN HỆ
            </h2>
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wide">
              PHÒNG CÔNG TÁC SINH VIÊN - TRƯỜNG ĐẠI HỌC KINH TẾ, ĐẠI HỌC ĐÀ NẴNG
            </p>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200/80">
                <Clock className="w-3 h-3 text-blue-600" />
                Thời gian làm việc: Thứ Hai – Thứ Sáu (07:30 – 11:30 | 13:30 – 17:00)
              </span>
            </div>
          </div>

          {/* 4 Khối thông tin liên hệ dàn đều full-width, tuyệt đối cân đối với toàn trang */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Địa chỉ */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#1760AB]/60 transition-all flex flex-col justify-start">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1760AB] border border-blue-100 flex items-center justify-center shadow-2xs">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Địa chỉ văn phòng</span>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-0.5 leading-snug">
                    Phòng H214, Tòa nhà Đa năng
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    71 Ngũ Hành Sơn, Phường Ngũ Hành Sơn, TP. Đà Nẵng
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Hotline */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#F26524]/60 transition-all flex flex-col justify-start">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F26524] border border-orange-100 flex items-center justify-center shadow-2xs">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Đường dây nóng (Hotline)</span>
                  <a
                    href="tel:02363956397"
                    className="text-base sm:text-lg font-black text-[#F26524] hover:underline block mt-0.5 tracking-tight"
                  >
                    0236 3956 397
                  </a>
                </div>
              </div>
            </div>

            {/* Card 3: Email */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#009FE3]/60 transition-all flex flex-col justify-start">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#009FE3] border border-sky-100 flex items-center justify-center shadow-2xs">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Hộp thư điện tử</span>
                  <a
                    href="mailto:phongcongtacsinhvien@due.edu.vn"
                    className="text-xs sm:text-[12.5px] font-bold text-slate-900 hover:text-sky-600 block mt-0.5 break-all"
                  >
                    phongcongtacsinhvien@due.edu.vn
                  </a>
                </div>
              </div>
            </div>

            {/* Card 4: Kênh trực tuyến */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#119046]/60 transition-all flex flex-col justify-start">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#119046] border border-emerald-100 flex items-center justify-center shadow-2xs">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Cổng thông tin & Mạng xã hội</span>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <a
                      href="https://due.udn.vn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-[13px] font-bold text-slate-900 hover:text-[#119046] transition-colors"
                    >
                      due.udn.vn
                    </a>
                    <span className="text-slate-300">•</span>
                    <a
                      href="https://www.facebook.com/CTSV.DUE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-[13px] font-bold text-[#119046] hover:underline"
                    >
                      Fanpage DUE - Phòng Công tác Sinh viên
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 
          ----------------------------------------------------------
          PHẦN 4 – F&A (CÂU HỎI THƯỜNG GẶP)
          ----------------------------------------------------------
        */}
        <div className="scroll-mt-28" id="muc-faq">
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
