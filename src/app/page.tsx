'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScholarshipModal } from '@/components/ScholarshipModal';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import { NewsModal } from '@/components/NewsModal';
import { Category, Scholarship, Announcement, NewsArticle, FAQItem } from '@/types';
import { initialData } from '@/data/initialData';

function getCategoryColorClass(category: Category, index: number): string {
  if (category.themeColor === 'orange' || category.themeColor === 'amber') return 'cam';
  if (category.themeColor === 'emerald' || category.themeColor === 'forestGreen') return 'la';
  if (category.themeColor === 'deepBlue' || category.themeColor === 'skyBlue') return '';
  return index % 2 === 0 ? 'cam' : 'la';
}

function renderCategoryIcon(iconName?: string) {
  switch (iconName) {
    case 'BookOpen':
    case 'sach':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case 'Globe':
    case 'diaCau':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      );
    case 'Plane':
    case 'mayBay':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      );
    case 'Handshake':
    case 'Star':
    case 'batTay':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m11 17 2 2a1 1 0 1 0 3-3" />
          <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
          <path d="m21 3 1 11h-2" />
          <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
          <path d="M3 4h8" />
        </svg>
      );
    case 'ShieldCheck':
    case 'khien':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'GraduationCap':
    case 'muCuNhan':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z" />
          <path d="M22 10v6" />
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </svg>
      );
  }
}

function renderSplitTitle(rawTitle: string) {
  const parts = (rawTitle || '').split('|');
  return parts.map((p, idx) => (
    <React.Fragment key={idx}>
      {idx > 0 && ' '}
      <span className="lien">{p.trim()}</span>
    </React.Fragment>
  ));
}

function PortalContent() {
  const searchParams = useSearchParams();

  const [isInsideIframe, setIsInsideIframe] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      setIsInsideIframe(true);
    }
  }, []);

  const [categories, setCategories] = useState<Category[]>(initialData.categories);
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialData.scholarships);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialData.announcements);
  const [newsList, setNewsList] = useState<NewsArticle[]>(initialData.news || []);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialData.faqs || []);
  const [settings, setSettings] = useState(initialData.settings);

  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const daiAnhRef = useRef<HTMLDivElement>(null);

  // Fetch live data from API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/data', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.categories)) setCategories(data.categories);
          if (Array.isArray(data.scholarships)) setScholarships(data.scholarships);
          if (Array.isArray(data.announcements)) setAnnouncements(data.announcements);
          if (Array.isArray(data.news)) setNewsList(data.news);
          if (Array.isArray(data.faqs)) setFaqs(data.faqs);
          if (data.settings) setSettings(data.settings);
        }
      } catch (e) {
        console.error('Failed to load portal data:', e);
      }
    }
    loadData();
  }, []);

  // Deep-link support (?scholarship=slug-or-id)
  useEffect(() => {
    const slug = searchParams.get('scholarship');
    if (slug && scholarships.length > 0) {
      const found = scholarships.find((s) => s.slug === slug || s.id === slug);
      if (found) {
        setSelectedScholarship(found);
      }
    }
    const q = searchParams.get('search');
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams, scholarships]);

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
    }).catch(() => {});
  };

  const handleCloseModal = () => {
    setSelectedScholarship(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('scholarship');
    window.history.pushState({}, '', url.toString());
  };

  const activeCategories = useMemo(() => {
    return [...categories]
      .filter((c) => c.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [categories]);

  const activeAnnouncements = useMemo(() => {
    return [...announcements]
      .filter((a) => a.isActive !== false)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (b.publishedAt || '').localeCompare(a.publishedAt || '');
      })
      .slice(0, 4);
  }, [announcements]);

  const activeFaqs = useMemo(() => {
    return [...faqs]
      .filter((f) => f.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, 6);
  }, [faqs]);

  const activeNews = useMemo(() => {
    return [...newsList]
      .filter((n) => n.isActive !== false)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if ((a.order || 0) !== (b.order || 0)) {
          return (a.order || 999) - (b.order || 999);
        }
        return (b.publishedAt || '').localeCompare(a.publishedAt || '');
      });
  }, [newsList]);

  // Auto-shrink font size so all category headers and scholarship titles fit on 1 line uniformly
  useEffect(() => {
    function vuaMotDong(selector: string, lon: number, nho: number) {
      const ds = Array.from(document.querySelectorAll<HTMLElement>(selector));
      if (!ds.length) return;
      if (window.getComputedStyle(ds[0]).whiteSpace !== 'nowrap') {
        ds.forEach((e) => {
          e.style.fontSize = '';
        });
        return;
      }
      let nhoNhat = lon;
      ds.forEach((e) => {
        let c = lon;
        e.style.fontSize = c + 'px';
        while (e.scrollWidth > e.clientWidth && c > nho) {
          c -= 0.25;
          e.style.fontSize = c + 'px';
        }
        nhoNhat = Math.min(nhoNhat, c);
      });
      ds.forEach((e) => {
        e.style.fontSize = nhoNhat + 'px';
      });
    }

    function vuaTieuDeNhom() {
      vuaMotDong('.khoi-nhom header h3', 16, 11);
      vuaMotDong('.khoi-nhom .ten-hb', 14, 12);
    }

    vuaTieuDeNhom();
    window.addEventListener('resize', vuaTieuDeNhom);
    return () => window.removeEventListener('resize', vuaTieuDeNhom);
  }, [activeCategories, scholarships]);

  // Auto-slide horizontal events strip (SU_KIEN)
  const slideEvents = (dir: -1 | 1) => {
    const el = daiAnhRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.anh-su-kien');
    const step = (card ? card.offsetWidth : 260) + 14;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
    if (dir > 0 && atEnd) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: dir * step, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!activeNews.length) return;
    const timer = setInterval(() => {
      slideEvents(1);
    }, 3500);
    return () => clearInterval(timer);
  }, [activeNews.length]);

  if (isInsideIframe) return null;

  const hotlineText = settings?.hotline || '0236 3956 397';
  const emailText = settings?.email || 'phongcongtacsinhvien@due.edu.vn';

  return (
    <div className="due-portal-v2 min-h-screen flex flex-col">
      {/* ============ ĐẦU TRANG ============ */}
      <Header
        categories={activeCategories}
        scholarships={scholarships}
        onSelectScholarship={handleSelectScholarship}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {/* ============ BANNER ============ */}
        <section className="banner-due">
          <div className="container-due">
            <div>
              <h1>
                Cơ hội nhận học bổng tại{' '}
                <span className="due" aria-label="DUE">
                  <b className="d">D</b>
                  <b className="u">U</b>
                  <b className="e">E</b>
                </span>
              </h1>
            </div>
          </div>
        </section>

        {/* ============ 6 NHÓM HỌC BỔNG (3 cụm x 2 cột) ============ */}
        <section className="nhom-hb muc-trang-chu" id="nhom-hoc-bong">
          <div className="container-due">
            <div className="tieu-de-due">
              <div className="nho">Cơ hội dành cho bạn</div>
            </div>

            <div className="luoi-nhom" id="luoi-nhom">
              {activeCategories.map((cat, idx) => {
                const colorClass = getCategoryColorClass(cat, idx);
                const catScholarships = scholarships
                  .filter((s) => s.categoryId === cat.id && s.isActive !== false)
                  .sort((a, b) => (a.order || 0) - (b.order || 0));

                return (
                  <div key={cat.id} className={`khoi-nhom ${colorClass}`}>
                    <header>
                      <span className="so">{renderCategoryIcon(cat.icon)}</span>
                      <h3>{renderSplitTitle(cat.title)}</h3>
                    </header>
                    <ul>
                      {catScholarships.map((item) => {
                        const displayTitle = item.cardTitle || item.title;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              title={displayTitle}
                              onClick={() => handleSelectScholarship(item)}
                            >
                              <span className="ten-hb">{displayTitle}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ THÔNG BÁO + HỎI ĐÁP ============ */}
        <section className="muc-trang-chu">
          <div className="container-due hai-cot-due">
            {/* Hộp Thông báo mới */}
            <div className="hop-due" id="thong-bao">
              <h2>
                <span>📢 Thông báo mới</span>
                <Link href="/thong-bao">Xem tất cả ›</Link>
              </h2>

              <div id="ds-thong-bao">
                {activeAnnouncements.length > 0 ? (
                  activeAnnouncements.map((ann) => {
                    const parts = (ann.publishedAt || '2026-01-01').split('-');
                    const y = parts[0] || '2026';
                    const m = parts[1] || '01';
                    const d = parts[2] || '01';
                    const isNew = Boolean(ann.badgeText || ann.isPinned);

                    return (
                      <div
                        key={ann.id}
                        className="tin-due"
                        onClick={() => setSelectedAnnouncement(ann)}
                      >
                        <div className="ngay">
                          <b>{d}</b>
                          Th {Number(m)}/{y.slice(2)}
                        </div>
                        <div>
                          <h3>
                            {isNew && <em className="moi">{ann.badgeText || 'MỚI'}</em>}
                            <span>{ann.title}</span>
                          </h3>
                          <span className="nhom-tin">{ann.category}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: 'var(--chu-phu)', fontSize: '14px', padding: '8px 0' }}>
                    Chưa có thông báo.
                  </p>
                )}
              </div>
            </div>

            {/* Hộp Câu hỏi thường gặp */}
            <div className="hop-due" id="hoi-dap">
              <h2>
                <span>❓ Câu hỏi thường gặp</span>
                <Link href="/huong-dan">Xem tất cả ›</Link>
              </h2>

              <div>
                {activeFaqs.map((faq) => (
                  <details key={faq.id}>
                    <summary>{faq.question}</summary>
                    <div
                      className="faq-ans"
                      dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                    />
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ SỰ KIỆN TRAO HỌC BỔNG (TIN TỨC) ============ */}
        {activeNews.length > 0 && (
          <section className="su-kien-due muc-trang-chu" id="su-kien">
            <div className="container-due">
              <div className="tieu-de-due">
                <div className="nho">Hoạt động trao học bổng</div>
              </div>

              <div className="khung-su-kien">
                <button
                  className="nut-truot trai"
                  type="button"
                  aria-label="Xem ảnh trước"
                  onClick={() => slideEvents(-1)}
                >
                  ‹
                </button>

                <div className="dai-anh" ref={daiAnhRef}>
                  {activeNews.map((article) => (
                    <button
                      key={article.id}
                      type="button"
                      className="anh-su-kien"
                      onClick={() => setSelectedNewsArticle(article)}
                    >
                      <div className="anh">
                        {article.thumbnailUrl ? (
                          <img
                            src={article.thumbnailUrl}
                            alt={article.title}
                            loading="lazy"
                          />
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                            <circle cx="12" cy="13" r="3" />
                          </svg>
                        )}
                      </div>
                      <div className="chu">
                        <h3>{article.title}</h3>
                        <span>{article.publishedAt}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  className="nut-truot phai"
                  type="button"
                  aria-label="Xem ảnh tiếp"
                  onClick={() => slideEvents(1)}
                >
                  ›
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ============ LIÊN HỆ ============ */}
        <section className="lien-he-due muc-trang-chu" id="lien-he">
          <div className="container-due">
            <div className="tieu-de-due">
              <div className="nho">Đơn vị thường trực tiếp nhận</div>
              <h2>PHÒNG CÔNG TÁC SINH VIÊN</h2>
            </div>

            <div className="luoi-lien-he">
              <a
                className="o-lien-he"
                href="https://maps.google.com/?q=71+Ngũ+Hành+Sơn,+Đà+Nẵng"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="bt">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <b>Địa chỉ</b>
                <span>
                  <span className="lien">Phòng H214, Tòa nhà Đa năng</span> –{' '}
                  <span className="lien">71 Ngũ Hành Sơn, TP. Đà Nẵng</span>
                </span>
              </a>

              <a className="o-lien-he" href={`tel:${hotlineText.replace(/\s/g, '')}`}>
                <span className="bt">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <b>Hotline</b>
                <span>{hotlineText}</span>
              </a>

              <a className="o-lien-he" href={`mailto:${emailText}`}>
                <span className="bt">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <b>Email</b>
                <span>{emailText}</span>
              </a>

              <a
                className="o-lien-he"
                href="https://www.facebook.com/CTSV.DUE"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="bt">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
                  </svg>
                </span>
                <b>Fanpage</b>
                <span>
                  <span className="lien">DUE –</span>{' '}
                  <span className="lien">Phòng Công tác Sinh viên</span>
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ============ CHÂN TRANG ============ */}
      <Footer />

      {/* Full-screen Scholarship Detail View */}
      <ScholarshipModal
        scholarship={selectedScholarship}
        onClose={handleCloseModal}
      />

      {/* Announcement Detail Modal */}
      <AnnouncementModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />

      {/* Event / News Detail Modal */}
      <NewsModal
        article={selectedNewsArticle}
        onClose={() => setSelectedNewsArticle(null)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-bold">
          Đang tải Cổng thông tin học bổng DUE...
        </div>
      }
    >
      <PortalContent />
    </Suspense>
  );
}
