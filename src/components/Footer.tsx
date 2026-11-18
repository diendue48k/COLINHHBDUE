'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="due-portal-v2">
      <footer className="chan-trang-due">
        <div className="container-due">
          <div className="luoi">
            <div>
              <div className="ten">TRƯỜNG ĐẠI HỌC KINH TẾ – ĐẠI HỌC ĐÀ NẴNG</div>
              <p style={{ marginTop: '4px' }}>
                <span className="lien">Cổng thông tin Học bổng</span>{' '}
                <span className="lien">&amp; Chế độ chính sách người học.</span>
              </p>
            </div>
            <div>
              <h4>Danh mục nhanh</h4>
              <ul>
                <li>
                  <a href="/#nhom-hoc-bong">Cơ hội dành cho bạn</a>
                </li>
                <li>
                  <a href="/#thong-bao">Thông báo mới nhất</a>
                </li>
                <li>
                  <a href="/#hoi-dap">Câu hỏi thường gặp</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Liên kết</h4>
              <ul>
                <li>
                  <a href="https://due.udn.vn" target="_blank" rel="noopener noreferrer">
                    Website Trường: due.udn.vn
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/CTSV.DUE" target="_blank" rel="noopener noreferrer">
                    Fanpage Phòng CTSV
                  </a>
                </li>
                <li>
                  <Link href="/admin">Quản trị hệ thống (Admin)</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="ban-quyen">
            <span className="lien">© Trường Đại học Kinh tế – Đại học Đà Nẵng</span> ·{' '}
            <span className="lien">Cổng thông tin Học bổng</span>
          </div>
        </div>
      </footer>

      <button
        className={`ve-dau ${showBackToTop ? 'hien' : ''}`}
        type="button"
        aria-label="Về đầu trang"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  );
};
