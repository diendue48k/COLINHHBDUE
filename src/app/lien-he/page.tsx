'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Phone, Mail, MapPin, Clock, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    studentIdOrEmail: '',
    programOfInterest: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_inquiry',
          payload: {
            fullName: formData.fullName.trim(),
            email: formData.studentIdOrEmail.trim(),
            topic: formData.programOfInterest.trim() || 'Chung',
            content: formData.message.trim(),
          },
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({
          fullName: '',
          studentIdOrEmail: '',
          programOfInterest: '',
          message: '',
        });
      } else {
        setErrorMsg('Không thể gửi câu hỏi lúc này. Vui lòng thử lại hoặc liên hệ qua email.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Đã xảy ra lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 mb-6 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang chủ</span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B2545] uppercase tracking-tight">
              Thông tin liên hệ & Hỗ trợ sinh viên DUE
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Bộ phận thường trực giải đáp mọi thắc mắc về học bổng, miễn giảm học phí và các chính sách hỗ trợ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Contact details */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-800">Địa chỉ liên hệ trực tiếp</h2>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-blue-900 font-bold">Phòng Công tác Sinh viên (Bộ phận Học bổng)</strong>
                    <span>Phòng H214, Tòa nhà Đa năng, Trường Đại học Kinh tế – Đại học Đà Nẵng</span>
                    <br />
                    <span className="text-slate-500">71 Ngũ Hành Sơn, Phường Ngũ Hành Sơn, TP. Đà Nẵng</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-orange-50/70 border border-orange-100">
                  <Phone className="w-5 h-5 text-orange-600 shrink-0" />
                  <div>
                    <strong className="block text-orange-950 font-bold">Đường dây nóng hỗ trợ:</strong>
                    <a href="tel:02363956397" className="text-blue-700 font-bold hover:underline">
                      0236 3956 397
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block text-emerald-950 font-bold">Email tiếp nhận thắc mắc:</strong>
                    <a href="mailto:phongcongtacsinhvien@due.edu.vn" className="text-blue-700 font-bold hover:underline">
                      phongcongtacsinhvien@due.edu.vn
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <Clock className="w-5 h-5 text-slate-600 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Giờ làm việc:</strong>
                    <span>Thứ Hai - Thứ Sáu: 07:30 - 11:30 | 13:30 - 17:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-slate-800">Gửi câu hỏi / Thắc mắc trực tuyến</h2>

              {submitted ? (
                <div className="p-6 rounded-xl bg-green-50 border border-green-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                  <h3 className="text-sm font-bold text-green-800">Đã gửi thắc mắc thành công!</h3>
                  <p className="text-xs text-green-700">
                    Ban Quản lý Cổng học bổng DUE sẽ liên hệ phản hồi qua email của bạn trong thời gian sớm nhất.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-blue-600 underline"
                  >
                    Gửi câu hỏi khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  {errorMsg && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 font-semibold">
                      {errorMsg}
                    </div>
                  )}
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Họ và tên *</label>
                    <input
                      required
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Mã sinh viên / Email *</label>
                    <input
                      required
                      type="text"
                      value={formData.studentIdOrEmail}
                      onChange={(e) => setFormData({ ...formData, studentIdOrEmail: e.target.value })}
                      placeholder="2111215... hoặc email@due.edu.vn"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Chương trình học bổng quan tâm</label>
                    <input
                      type="text"
                      value={formData.programOfInterest}
                      onChange={(e) => setFormData({ ...formData, programOfInterest: e.target.value })}
                      placeholder="vd: Học bổng Tinh hoa, Người học quốc tế..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Nội dung câu hỏi *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Mô tả chi tiết câu hỏi hoặc vấn đề bạn cần được hỗ trợ..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Đang gửi thắc mắc...' : 'Gửi thắc mắc đến DUE'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
