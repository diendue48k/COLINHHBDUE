import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const svnGilroy = localFont({
  src: [
    {
      path: '../../public/fonts/SVN-Gilroy-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SVN-Gilroy-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SVN-Gilroy-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SVN-Gilroy-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/SVN-Gilroy-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SVN-Gilroy-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SVN-Gilroy-SemiBoldItalic.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../public/fonts/SVN-Gilroy-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SVN-Gilroy-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/SVN-Gilroy-XBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SVN-Gilroy-Heavy.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SVN-Gilroy-Black.otf',
      weight: '950',
      style: 'normal',
    },
  ],
  variable: '--font-svn-gilroy',
  display: 'swap',
});

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
    icon: '/images/logo-due-shield.png',
    shortcut: '/images/logo-due-shield.png',
    apple: '/images/logo-due-shield.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={svnGilroy.variable}>
      <body className={`${svnGilroy.className} antialiased min-h-screen text-slate-800 bg-[#F8FAFC]`}>
        {children}
      </body>
    </html>
  );
}
