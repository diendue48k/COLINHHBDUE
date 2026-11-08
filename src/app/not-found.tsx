import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-5">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl font-black">
          404
        </div>

        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          Không tìm thấy trang yêu cầu
        </h1>

        <p className="text-xs sm:text-sm text-slate-500">
          Chương trình học bổng hoặc trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ khác trên Cổng thông tin học bổng DUE.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
