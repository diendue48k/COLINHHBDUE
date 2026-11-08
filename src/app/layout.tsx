import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CỔNG THÔNG TIN HỌC BỔNG – TRƯỜNG ĐẠI HỌC KINH TẾ, ĐẠI HỌC ĐÀ NẴNG (DUE)',
  description: 'Hệ thống tập trung giới thiệu, tra cứu, quản lý và công bố các chương trình học bổng, chính sách miễn giảm học phí, hỗ trợ sinh viên, học viên cao học, nghiên cứu sinh và người học quốc tế.',
  keywords: [
    'Học bổng DUE',
    'Trường Đại học Kinh tế Đà Nẵng',
    'Học bổng sau đại học',
    'Học bổng đại học',
    'Học bổng quốc tế',
    'DUE Elite',
    'Miễn giảm học phí',
  ],
  authors: [{ name: 'Trường Đại học Kinh tế – Đại học Đà Nẵng' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen text-slate-800 bg-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
