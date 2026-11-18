'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Category, Scholarship } from '@/types';
import { initialData } from '@/data/initialData';

interface HeaderProps {
  categories?: Category[];
  scholarships?: Scholarship[];
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  onSelectScholarship?: (s: Scholarship) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

function boDau(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export const Header: React.FC<HeaderProps> = ({
  categories = initialData.categories,
  scholarships = initialData.scholarships,
  onSelectScholarship,
  searchQuery = '',
  setSearchQuery,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string>('nhom-hoc-bong');
  const [localQuery, setLocalQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const effectiveQuery = setSearchQuery ? searchQuery : localQuery;

  useEffect(() => {
    if (pathname === '/thong-bao') {
      setActiveMenu('thong-bao');
    } else if (pathname === '/tin-tuc') {
      setActiveMenu('su-kien');
    } else if (pathname === '/huong-dan') {
      setActiveMenu('hoi-dap');
    } else if (pathname === '/lien-he') {
      setActiveMenu('lien-he');
    }
  }, [pathname]);

  // Update active menu on scroll when on homepage
  useEffect(() => {
    if (pathname !== '/') return;
    const sectionIds = ['nhom-hoc-bong', 'thong-bao', 'hoi-dap', 'su-kien', 'lien-he'];
    const handleScroll = () => {
      let cur = sectionIds[0];
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 170) {
          cur = id;
        }
      });
      setActiveMenu(cur);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const catNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => {
      map[c.id] = (c.title || '').replace(/\|/g, ' ');
    });
    return map;
  }, [categories]);

  const searchResults = useMemo(() => {
    const q = boDau(effectiveQuery.trim());
    if (!q) return [];
    const words = q.split(/\s+/);
    const seenSlugs = new Set<string>();
    return scholarships
      .filter((s) => s.isActive !== false)
      .filter((s) => {
        const text = boDau(
          `${s.title} ${s.cardTitle || ''} ${s.shortTitle || ''} ${catNameMap[s.categoryId] || ''}`
        );
        return words.every((w) => text.includes(w));
      })
      .filter((s) => {
        // Deduplicate items that share the same title across Đại học & Sau đại học in search dropdown
        const key = s.title.toLowerCase();
        if (seenSlugs.has(key)) return false;
        seenSlugs.add(key);
        return true;
      });
  }, [effectiveQuery, scholarships, catNameMap]);

  const handleInputChange = (val: string) => {
    if (setSearchQuery) {
      setSearchQuery(val);
    } else {
      setLocalQuery(val);
    }
    setSelectedIndex(-1);
    setDropdownOpen(val.trim().length > 0);
  };

  const handleSelectResult = (item: Scholarship) => {
    setDropdownOpen(false);
    if (onSelectScholarship) {
      onSelectScholarship(item);
    } else {
      router.push(`/?scholarship=${encodeURIComponent(item.slug || item.id)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!searchResults.length) return;
      const next =
        (selectedIndex + (e.key === 'ArrowDown' ? 1 : -1) + searchResults.length) %
        searchResults.length;
      setSelectedIndex(next);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        const chosen = searchResults[Math.max(selectedIndex, 0)];
        handleSelectResult(chosen);
      }
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveMenu(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <header className="dau-trang due-portal-v2">
      <div className="container-due hang1">
        <Link className="thuong-hieu" href="/">
          <img
            src="/images/logo-due-new.png"
            alt="Logo Trường Đại học Kinh tế – Đại học Đà Nẵng"
          />
          <span>
            <small>TRƯỜNG ĐẠI HỌC KINH TẾ – ĐẠI HỌC ĐÀ NẴNG</small>
            <b>CỔNG THÔNG TIN HỌC BỔNG</b>
          </span>
        </Link>

        <div className="o-tim" role="search" ref={searchBoxRef}>
          <input
            type="search"
            value={effectiveQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (effectiveQuery.trim()) setDropdownOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Tìm học bổng, chính sách hỗ trợ…"
            autoComplete="off"
            aria-label="Tìm học bổng"
          />
          <svg
            className="icon-tim"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>

          {dropdownOpen && effectiveQuery.trim().length > 0 && (
            <div className="ket-qua-tim" role="listbox">
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={idx === selectedIndex}
                    className={idx === selectedIndex ? 'chon' : ''}
                    onClick={() => handleSelectResult(item)}
                  >
                    {item.cardTitle || item.title}
                    <span>
                      {catNameMap[item.categoryId] || 'Học bổng DUE'}
                      {item.shortTitle ? ` · ${item.shortTitle}` : ''}
                    </span>
                  </button>
                ))
              ) : (
                <div className="rong">Không tìm thấy chương trình phù hợp.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="menu-due" aria-label="Menu chính">
        <ul>
          <li>
            <button
              type="button"
              onClick={() => scrollToSection('nhom-hoc-bong')}
              className={activeMenu === 'nhom-hoc-bong' ? 'dang-xem' : ''}
            >
              Cơ hội dành cho bạn
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => scrollToSection('thong-bao')}
              className={activeMenu === 'thong-bao' ? 'dang-xem' : ''}
            >
              Thông báo
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => scrollToSection('hoi-dap')}
              className={activeMenu === 'hoi-dap' ? 'dang-xem' : ''}
            >
              Câu hỏi thường gặp
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => scrollToSection('su-kien')}
              className={activeMenu === 'su-kien' ? 'dang-xem' : ''}
            >
              Hoạt động trao học bổng
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => scrollToSection('lien-he')}
              className={activeMenu === 'lien-he' ? 'dang-xem' : ''}
            >
              Liên hệ
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
