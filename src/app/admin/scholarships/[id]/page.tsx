'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Eye,
  CheckCircle2,
  Code,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { Scholarship, Category } from '@/types';
import { initialData } from '@/data/initialData';
import { ScholarshipModal } from '@/components/ScholarshipModal';

const defaultScholarshipHtml = (title: string) => `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title || 'HỌC BỔNG DUE'} - DUE</title>
<link rel="stylesheet" href="/fonts/fonts.css">
<style>
:root {
    --blue: #07549b;
    --dark-blue: #063968;
    --light-blue: #eaf4ff;
    --orange: #f58220;
    --green: #269b63;
    --text: #243447;
    --muted: #637487;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
    scroll-padding-top: 85px;
}

body {
    font-family: "SVN-Gilroy", "SVN-Griloy", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    background: #f4f8fc;
    color: var(--text);
    line-height: 1.75;
}

.container {
    width: min(1150px, 92%);
    margin: auto;
}

/* ================= BANNER ================= */
.banner {
    position: relative;
    overflow: hidden;
    padding: 65px 20px 72px;
    background: linear-gradient(120deg, #063968, #0876b9 65%, #269b63);
    color: white;
}

.banner-content {
    position: relative;
    z-index: 1;
    max-width: 950px;
    margin: auto;
    text-align: center;
}

.banner h1 {
    font-size: clamp(26px, 4.2vw, 42px);
    line-height: 1.35;
    font-weight: 800;
    text-transform: uppercase;
}

/* ================= THANH ĐIỀU HƯỚNG ================= */
.tab-navigation {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(255,255,255,.98);
    border-bottom: 1px solid #e1eaf2;
    box-shadow: 0 5px 18px rgba(0,45,90,.08);
    backdrop-filter: blur(12px);
}

.tab-list {
    width: min(1150px, 95%);
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 15px;
}

.tab-link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 17px 22px;
    color: #536579;
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 800;
    transition: .25s;
    text-align: center;
}

.tab-link:hover, .tab-link.active {
    color: var(--blue);
}

.tab-link.active::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 15px;
    right: 15px;
    height: 4px;
    border-radius: 5px 5px 0 0;
    background: var(--orange);
}

.tab-number {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    display: inline-grid;
    place-items: center;
    border-radius: 50%;
    background: #edf3f8;
    color: var(--blue);
    font-size: 12.5px;
}

.tab-link.active .tab-number {
    background: var(--blue);
    color: white;
}

/* ================= GIỚI THIỆU ================= */
.introduction {
    padding: 38px 0 35px;
}

.intro-card {
    padding: 27px 30px;
    background: white;
    border-left: 5px solid var(--orange);
    border-radius: 13px;
    box-shadow: 0 8px 25px rgba(0,50,100,.06);
    font-size: 15.5px;
    text-align: justify;
    line-height: 1.75;
}

/* ================= CÁC ĐỀ MỤC ================= */
section {
    padding: 55px 0;
    scroll-margin-top: 85px;
}

.section-heading {
    margin-bottom: 28px;
}

.section-heading h2 {
    font-size: 25px;
    color: var(--dark-blue);
    line-height: 1.5;
    text-transform: uppercase;
    font-weight: 800;
}

.section-heading .line {
    width: 65px;
    height: 4px;
    background: var(--orange);
    margin-top: 12px;
    border-radius: 5px;
}

.table-wrapper {
    overflow-x: auto;
    border-radius: 13px;
    background: white;
    box-shadow: 0 8px 25px rgba(0,50,100,.06);
    margin-bottom: 25px;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

th {
    background: var(--blue);
    color: white;
    font-weight: 700;
    padding: 14px 18px;
    border: 1px solid #064077;
    text-align: left;
}

td {
    padding: 13px 18px;
    border: 1px solid #dbe6f0;
}

tr:nth-child(even) td {
    background: #fbfdff;
}
</style>
</head>
<body>

<header class="banner">
    <div class="banner-content">
        <h1>${title || 'TIÊU ĐỀ CHƯƠNG TRÌNH HỌC BỔNG'}</h1>
    </div>
</header>

<nav class="tab-navigation">
    <div class="tab-list">
        <a href="#de-muc-1" class="tab-link active">
            <span class="tab-number">01</span>
            <span>1. ĐỐI TƯỢNG VÀ MỨC CẤP</span>
        </a>
        <a href="#de-muc-2" class="tab-link">
            <span class="tab-number">02</span>
            <span>2. NGUYÊN TẮC XÉT, CẤP – ĐIỀU KIỆN DUY TRÌ</span>
        </a>
    </div>
</nav>

<main>
    <div class="introduction">
        <div class="container">
            <div class="intro-card">
                Chương trình học bổng nhằm động viên, tạo điều kiện thuận lợi và hỗ trợ tài chính cho sinh viên, học viên nỗ lực phấn đấu đạt thành tích xuất sắc trong học tập và rèn luyện tại Trường Đại học Kinh tế – Đại học Đà Nẵng.
            </div>
        </div>
    </div>

    <section id="de-muc-1">
        <div class="container">
            <div class="section-heading">
                <h2>1. ĐỐI TƯỢNG VÀ MỨC CẤP HỌC BỔNG</h2>
                <div class="line"></div>
            </div>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Đối tượng áp dụng</th>
                            <th>Tiêu chuẩn xét cấp</th>
                            <th>Mức cấp học bổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sinh viên / Học viên chính quy</td>
                            <td>Đạt kết quả học tập và rèn luyện theo quy định</td>
                            <td>Hỗ trợ 50% - 100% học phí</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <section id="de-muc-2">
        <div class="container">
            <div class="section-heading">
                <h2>2. NGUYÊN TẮC XÉT, CẤP – ĐIỀU KIỆN DUY TRÌ</h2>
                <div class="line"></div>
            </div>
            <p>Sinh viên phải tuân thủ nghiêm túc các quy định của Nhà trường trong suốt thời gian thụ hưởng chính sách học bổng.</p>
        </div>
    </section>
</main>

<script>
const tabs = document.querySelectorAll(".tab-link");
tabs.forEach(tab => {
    tab.addEventListener("click", function(e) {
        const href = this.getAttribute("href");
        if (href && href.startsWith("#")) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
        tabs.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
    });
});
</script>

</body>
</html>`;

export default function ScholarshipEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [categories, setCategories] = useState<Category[]>(initialData.categories);
  const [previewHtml, setPreviewHtml] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [formData, setFormData] = useState<Scholarship>({
    id: isNew ? `sc-${Date.now()}` : id,
    slug: isNew ? `chuong-trinh-moi-${Date.now()}` : '',
    categoryId: 'cat-1',
    title: '',
    cardTitle: '',
    shortTitle: '',
    icon: 'GraduationCap',
    order: 1,
    isActive: true,
    viewsCount: 0,
    targetAudience: '',
    educationLevel: 'dai-hoc',
    policyType: 'hoc-bong',
    featuredImage: '/images/due-students-banner-clean.jpg',
    intro: '',
    htmlContent: '',
    introHtml: '',
    sections: [],
    documents: [],
    contact: {
      department: 'Phòng Công tác Sinh viên, Trường Đại học Kinh tế – Đại học Đà Nẵng',
      phone: '0236 3956 397',
      email: 'phongcongtacsinhvien@due.edu.vn',
      address: 'Phòng H214, Tòa nhà Đa năng, 71 Ngũ Hành Sơn, Phường Ngũ Hành Sơn, TP. Đà Nẵng',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState('');

  // Load existing data if editing
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/data', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.categories) setCategories(json.categories);
          if (!isNew && json.scholarships) {
            const found = json.scholarships.find((s: Scholarship) => s.id === id || s.slug === id);
            if (found) {
              const fullHtml = found.htmlContent || found.introHtml || '';
              setFormData({
                ...found,
                htmlContent: fullHtml,
                introHtml: fullHtml,
              });
            }
          } else if (isNew) {
            const initialHtml = defaultScholarshipHtml('');
            setFormData((prev) => ({
              ...prev,
              htmlContent: initialHtml,
              introHtml: initialHtml,
            }));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [id, isNew]);

  const currentHtml = formData.htmlContent || formData.introHtml || '';

  const handleHtmlChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      htmlContent: val,
      introHtml: val,
    }));
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(currentHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fullHtml = currentHtml || defaultScholarshipHtml(formData.title);
      const payload: Scholarship = {
        ...formData,
        htmlContent: fullHtml,
        introHtml: fullHtml,
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_scholarship',
          payload,
        }),
      });
      if (res.ok) {
        setMessage('Đã lưu thành công chương trình học bổng!');
        setTimeout(() => {
          router.push('/admin/scholarships');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-slate-100/90 backdrop-blur-md py-3 z-10 border-b border-slate-200">
        <Link
          href="/admin/scholarships"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white px-3.5 py-2 rounded-xl border border-slate-300 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Danh sách chương trình</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {/* Live Preview Button */}
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Xem trước Popup đầy đủ</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang lưu...' : 'Lưu chương trình'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Thông tin chung chương trình */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            1. Thông tin chung chương trình
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Tên đầy đủ chương trình học bổng *
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="vd: CHƯƠNG TRÌNH PHÁT TRIỂN NHÀ NGHIÊN CỨU TRẺ (HỌC VIÊN CAO HỌC)"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-800"
              />
            </div>

            {/* Card Title (short title for cards on homepage) */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Tên hiển thị trên thẻ ngoài Trang chủ (nếu muốn rút gọn)
              </label>
              <input
                type="text"
                value={formData.cardTitle || ''}
                onChange={(e) => setFormData({ ...formData, cardTitle: e.target.value })}
                placeholder="vd: Chương trình phát triển Nhà nghiên cứu trẻ (Học viên cao học)"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nhóm học bổng *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Icon */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Biểu tượng (Icon)
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
              >
                <option value="GraduationCap">GraduationCap (Mũ cử nhân)</option>
                <option value="Globe">Globe (Quả địa cầu)</option>
                <option value="Users">Users (Nhóm người học)</option>
                <option value="User">User (Cá nhân)</option>
                <option value="Award">Award (Huy chương)</option>
                <option value="Trophy">Trophy (Cúp)</option>
                <option value="Heart">Heart (Trái tim)</option>
                <option value="Handshake">Handshake (Bắt tay hợp tác)</option>
                <option value="Landmark">Landmark (Ngân hàng / Đơn vị)</option>
                <option value="FileText">FileText (Văn bản)</option>
                <option value="ShieldCheck">ShieldCheck (Khiên bảo vệ)</option>
                <option value="Plane">Plane (Máy bay du học)</option>
                <option value="BookOpen">BookOpen (Sách học thuật)</option>
                <option value="Sparkles">Sparkles (Ngôi sao nổi bật)</option>
              </select>
            </div>

            {/* Education Level */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Bậc đào tạo áp dụng
              </label>
              <select
                value={formData.educationLevel || 'dai-hoc'}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as Scholarship['educationLevel'] })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
              >
                <option value="dai-hoc">Bậc Đại học</option>
                <option value="sau-dai-hoc">Bậc Sau đại học</option>
                <option value="lien-ket-quoc-te">Cử nhân Liên kết quốc tế</option>
                <option value="du-hoc">Học bổng Du học</option>
                <option value="tat-ca">Tất cả bậc đào tạo</option>
              </select>
            </div>

            {/* Policy Type */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Loại hình chính sách
              </label>
              <select
                value={formData.policyType || 'hoc-bong'}
                onChange={(e) => setFormData({ ...formData, policyType: e.target.value as Scholarship['policyType'] })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
              >
                <option value="hoc-bong">Học bổng</option>
                <option value="khen-thuong">Khen thưởng thành tích</option>
                <option value="mien-giam">Miễn giảm học phí</option>
                <option value="tro-cap">Hỗ trợ chi phí / Trợ cấp</option>
                <option value="chinh-sach-nha-nuoc">Chính sách Nhà nước</option>
                <option value="du-hoc">Học bổng Trao đổi / Du học</option>
              </select>
            </div>

            {/* Slug & Display Order */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Đường dẫn định danh (Slug)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="vd: hoc-bong-tinh-hoa"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.order || 1}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 1 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-bold"
                />
              </div>

              <div className="flex items-end pb-2">
                <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Đang hiển thị</span>
                </label>
              </div>
            </div>

            {/* Target Audience */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Đối tượng thụ hưởng
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="vd: Học viên cao học chính quy tại DUE có công bố khoa học hoặc tham gia đề tài NCKH"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700"
              />
            </div>

            {/* Short Intro */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Mô tả tóm tắt chương trình
              </label>
              <textarea
                rows={2}
                value={formData.intro || ''}
                onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                placeholder="Đoạn văn ngắn giới thiệu mục tiêu, ý nghĩa..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Card 2: SOẠN THẢO MÃ HTML CHI TIẾT POPUP (1 FILE HOÀN CHỈNH DUY NHẤT) */}
        <div className="bg-white p-6 rounded-2xl border-2 border-blue-500 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                2. Soạn thảo toàn bộ nội dung Popup bằng HTML (1 File chung duy nhất)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Toàn bộ nội dung hiển thị trong Popup học bổng (Banner, menu điều hướng, các đề mục, bảng biểu, quy định) được quản lý trong một mã HTML hoàn chỉnh duy nhất.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyHtml}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Sao chép toàn bộ mã HTML"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-600">Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sao chép mã</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPreviewHtml(!previewHtml)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  previewHtml
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{previewHtml ? 'Quay lại soạn HTML' : 'Xem trước trực tiếp'}</span>
              </button>
            </div>
          </div>

          {/* Editor Area (Textarea or Interactive Iframe Live Preview) */}
          {previewHtml ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-100">
                <span className="text-blue-800">
                  ✨ Đang xem trước trực tiếp Popup (Hiển thị đầy đủ Banner, Điều hướng đề mục, Font SVN-Gilroy, Bảng biểu):
                </span>
                <span className="text-slate-400 font-normal">
                  (Tương tác click các tab đề mục để cuộn mượt tới nội dung)
                </span>
              </div>

              <div className="w-full h-[650px] rounded-xl border border-slate-300 overflow-hidden shadow-inner bg-slate-100">
                <iframe
                  srcDoc={currentHtml}
                  title="Xem trước Popup học bổng"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                <span>
                  Mã nguồn HTML hoàn chỉnh của Popup:
                </span>
                <span className="text-slate-400 font-normal">
                  Hỗ trợ đầy đủ CSS, font SVN-Gilroy, script tab điều hướng, bảng biểu...
                </span>
              </div>

              <textarea
                rows={22}
                value={currentHtml}
                onChange={(e) => handleHtmlChange(e.target.value)}
                placeholder="Dán hoặc soạn mã HTML hoàn chỉnh của popup ở đây..."
                className="w-full p-4 font-mono text-xs bg-slate-950 text-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed shadow-inner min-h-[480px]"
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </form>

      {/* Full Modal Popup Preview (giống giao diện người dùng ngoài trang chủ) */}
      <ScholarshipModal
        scholarship={showPreview ? { ...formData, htmlContent: currentHtml, introHtml: currentHtml } : null}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
}
