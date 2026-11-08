'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  FileText,
  Paperclip,
  CheckCircle2,
  Code,
  ListTree,
  Table,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Scholarship, Category, ScholarshipSection, ScholarshipDocument } from '@/types';
import { initialData } from '@/data/initialData';
import { ScholarshipModal } from '@/components/ScholarshipModal';

export default function ScholarshipEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [categories, setCategories] = useState<Category[]>(initialData.categories);
  const [activeHtmlTab, setActiveHtmlTab] = useState<'intro' | 'rules' | 'notices' | 'stats'>('intro');
  const [previewHtml, setPreviewHtml] = useState<boolean>(false);

  const [formData, setFormData] = useState<Scholarship>({
    id: isNew ? `sc-${Date.now()}` : id,
    slug: isNew ? `chuong-trinh-moi-${Date.now()}` : '',
    categoryId: 'cat-1',
    title: '',
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
    rulesHtml: '',
    noticesHtml: '',
    statsHtml: '',
    sections: [
      {
        id: 'sec-1',
        order: 1,
        number: 1,
        title: 'ĐỐI TƯỢNG VÀ MỨC CẤP',
        icon: 'GraduationCap',
        bullets: ['Sinh viên, học viên thuộc đối tượng theo thông báo', 'Mức cấp hỗ trợ học phí theo quy định'],
      },
      {
        id: 'sec-2',
        order: 2,
        number: 2,
        title: 'NGUYÊN TẮC XÉT, CẤP – ĐIỀU KIỆN DUY TRÌ',
        icon: 'ShieldCheck',
        bullets: ['Xét duyệt dựa trên kết quả học tập và rèn luyện', 'Người thụ hưởng thực hiện các cam kết của chương trình'],
      },
    ],
    documents: [],
    contact: {
      department: 'Phòng Công tác Sinh viên, Trường ĐH Kinh tế – ĐHĐN',
      phone: '0236 3 654 321',
      email: 'scholarship@due.edu.vn',
      address: '71 Ngũ Hành Sơn, TP. Đà Nẵng',
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
              setFormData({
                ...found,
                introHtml: found.introHtml || defaultTemplates.intro,
                rulesHtml: found.rulesHtml || defaultTemplates.rules,
                noticesHtml: found.noticesHtml || defaultTemplates.notices,
                statsHtml: found.statsHtml || defaultTemplates.stats,
              });
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [id, isNew]);

  // Handlers for sections
  const handleAddSection = () => {
    const nextNum = formData.sections.length + 1;
    const newSection: ScholarshipSection = {
      id: `sec-${Date.now()}`,
      order: nextNum,
      number: nextNum,
      title: 'TIÊU ĐỀ MỤC MỚI',
      icon: 'Award',
      bullets: ['Nội dung quy định chi tiết 1', 'Nội dung quy định chi tiết 2'],
    };
    setFormData({
      ...formData,
      sections: [...formData.sections, newSection],
    });
  };

  const handleUpdateSectionTitle = (index: number, title: string) => {
    const nextSections = [...formData.sections];
    nextSections[index].title = title;
    setFormData({ ...formData, sections: nextSections });
  };

  const handleAddBullet = (secIndex: number) => {
    const nextSections = [...formData.sections];
    nextSections[secIndex].bullets.push('Tiêu chuẩn bổ sung...');
    setFormData({ ...formData, sections: nextSections });
  };

  const handleUpdateBullet = (secIndex: number, bulletIndex: number, text: string) => {
    const nextSections = [...formData.sections];
    nextSections[secIndex].bullets[bulletIndex] = text;
    setFormData({ ...formData, sections: nextSections });
  };

  const handleRemoveBullet = (secIndex: number, bulletIndex: number) => {
    const nextSections = [...formData.sections];
    nextSections[secIndex].bullets.splice(bulletIndex, 1);
    setFormData({ ...formData, sections: nextSections });
  };

  const handleRemoveSection = (secIndex: number) => {
    const nextSections = formData.sections.filter((_, i) => i !== secIndex);
    nextSections.forEach((s, idx) => {
      s.number = idx + 1;
      s.order = idx + 1;
    });
    setFormData({ ...formData, sections: nextSections });
  };

  // Handlers for documents
  const handleAddDocument = () => {
    const newDoc: ScholarshipDocument = {
      id: `doc-${Date.now()}`,
      title: 'Quyết định quy định học bổng mới',
      fileName: 'Van_ban_huong_dan_DUE.pdf',
      fileSize: '1.5 MB',
      fileType: 'pdf',
      url: '#',
    };
    setFormData({
      ...formData,
      documents: [...formData.documents, newDoc],
    });
  };

  const handleRemoveDocument = (docId: string) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((d) => d.id !== docId),
    });
  };

  // Default sample templates for 4 HTML tabs
  const defaultTemplates = {
    intro: `<div style="margin-bottom: 20px;">
  <h2 style="font-size: 16px; font-weight: 800; color: #0B3B60; text-transform: uppercase; margin-bottom: 10px;">I. GIỚI THIỆU CHUNG VỀ CHƯƠNG TRÌNH</h2>
  <p style="font-size: 13.5px; line-height: 1.6; color: #334155; margin-bottom: 14px;">Chương trình học bổng nhằm động viên, khích lệ và tạo điều kiện tối đa cho người học có thành tích xuất sắc, tinh thần vượt khó và khát vọng vươn lên trong học tập và nghiên cứu khoa học tại Trường Đại học Kinh tế – Đại học Đà Nẵng.</p>

  <div style="background: #F0F7FF; border-left: 4px solid #0052CC; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
    <strong style="color: #0052CC; font-size: 13.5px;">🎯 Mục tiêu chương trình:</strong>
    <p style="margin: 6px 0 0 0; font-size: 13px; color: #1E293B;">Đồng hành cùng sinh viên trên con đường chinh phục tri thức, phát triển năng lực cá nhân và đào tạo nguồn nhân lực chất lượng cao cho đất nước.</p>
  </div>

  <h3 style="font-size: 14px; font-weight: 700; color: #0B3B60; margin: 16px 0 8px 0;">ĐỐI TƯỢNG VÀ MỨC CẤP HỌC BỔNG</h3>
  <ul style="list-style: none; padding-left: 0; margin: 0 0 16px 0;">
    <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 13px; color: #334155;">
      <span style="color: #0052CC; font-weight: bold;">✔</span>
      <span><strong>Đối tượng:</strong> Sinh viên chính quy, học viên cao học, nghiên cứu sinh đang theo học tại trường.</span>
    </li>
    <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 13px; color: #334155;">
      <span style="color: #0052CC; font-weight: bold;">✔</span>
      <span><strong>Mức cấp:</strong> Hỗ trợ từ 50% đến 100% học phí và khen thưởng theo thành tích học tập và rèn luyện.</span>
    </li>
  </ul>
</div>`,
    rules: `<div style="margin-bottom: 20px;">
  <h2 style="font-size: 16px; font-weight: 800; color: #0B3B60; text-transform: uppercase; margin-bottom: 10px;">II. QUY ĐỊNH VÀ TIÊU CHUẨN XÉT CẤP</h2>
  
  <div style="margin-bottom: 16px;">
    <h3 style="font-size: 14px; font-weight: 700; color: #0B3B60; margin-bottom: 8px;">1. NGUYÊN TẮC XÉT CẤP</h3>
    <p style="font-size: 13px; line-height: 1.6; color: #334155;">Xét duyệt công khai, minh bạch, công bằng theo thứ tự ưu tiên điểm từ cao xuống thấp cho đến khi hết chỉ tiêu được giao.</p>
  </div>

  <div style="margin-bottom: 16px;">
    <h3 style="font-size: 14px; font-weight: 700; color: #0B3B60; margin-bottom: 8px;">2. TIÊU CHUẨN ĐIỂM HỌC TẬP VÀ RÈN LUYỆN (GPA)</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12.5px;">
      <thead>
        <tr style="background: #0B4899; color: #ffffff;">
          <th style="padding: 10px; border: 1px solid #CBD5E1; text-align: left;">Mức Học Bổng</th>
          <th style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">Điểm GPA (Thang 4)</th>
          <th style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">Điểm Rèn Luyện (ĐRL)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background: #ffffff;">
          <td style="padding: 10px; border: 1px solid #CBD5E1; font-weight: bold; color: #0B4899;">Loại Xuất Sắc</td>
          <td style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">GPA ≥ 3.60</td>
          <td style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">ĐRL ≥ 90 (Xuất sắc)</td>
        </tr>
        <tr style="background: #F8FAFC;">
          <td style="padding: 10px; border: 1px solid #CBD5E1; font-weight: bold; color: #0284C7;">Loại Giỏi</td>
          <td style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">3.20 ≤ GPA &lt; 3.60</td>
          <td style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">ĐRL ≥ 80 (Tốt)</td>
        </tr>
        <tr style="background: #ffffff;">
          <td style="padding: 10px; border: 1px solid #CBD5E1; font-weight: bold; color: #16A34A;">Loại Khá</td>
          <td style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">2.50 ≤ GPA &lt; 3.20</td>
          <td style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">ĐRL ≥ 70 (Khá)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="background: #FFF7ED; border-left: 4px solid #EA580C; padding: 12px; border-radius: 6px; margin-top: 14px;">
    <strong style="color: #EA580C; font-size: 13px;">⚠ Điều kiện duy trì:</strong>
    <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #431407;">Người học không bị kỷ luật từ mức khiển trách trở lên trong học kỳ xét học bổng và tích lũy đủ số tín chỉ quy định.</p>
  </div>
</div>`,
    notices: `<div style="margin-bottom: 20px;">
  <h2 style="font-size: 16px; font-weight: 800; color: #0B3B60; text-transform: uppercase; margin-bottom: 12px;">III. THÔNG BÁO XÉT CẤP MỚI NHẤT</h2>
  
  <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 14px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
      <span style="background: #DBEAFE; color: #1E40AF; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Thông báo số 845/TB-ĐHKT</span>
      <span style="color: #64748B; font-size: 12px;">Ngày ban hành: 15/09/2025</span>
    </div>
    <h3 style="font-size: 14px; font-weight: 700; color: #0F172A; margin: 6px 0;">Kế hoạch tiếp nhận hồ sơ xét cấp học bổng Học kỳ I Năm học 2025 - 2026</h3>
    <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 10px;">Phòng Công tác Sinh viên thông báo đến toàn thể sinh viên, học viên kế hoạch nộp hồ sơ, rà soát danh sách và đối chiếu điểm rèn luyện.</p>
    
    <div style="background: #F8FAFC; padding: 10px; border-radius: 8px; font-size: 12.5px; color: #334155;">
      <p style="margin: 2px 0;"><strong>• Thời gian nhận hồ sơ:</strong> Từ 20/09/2025 đến 17h00 ngày 25/10/2025.</p>
      <p style="margin: 2px 0;"><strong>• Hình thức nộp:</strong> Nộp hồ sơ trực tuyến qua Cổng thông tin học bổng DUE hoặc nộp trực tiếp tại phòng H214.</p>
      <p style="margin: 2px 0;"><strong>• Công bố kết quả dự kiến:</strong> Ngày 10/11/2025 trên website trường.</p>
    </div>
  </div>
</div>`,
    stats: `<div style="margin-bottom: 20px;">
  <h2 style="font-size: 16px; font-weight: 800; color: #0B3B60; text-transform: uppercase; margin-bottom: 12px;">IV. THỐNG KÊ KINH PHÍ VÀ SINH VIÊN THỤ HƯỞNG</h2>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 18px;">
    <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 14px; text-align: center;">
      <span style="font-size: 11px; font-weight: 800; color: #166534; text-transform: uppercase;">Tổng ngân sách hàng năm</span>
      <div style="font-size: 20px; font-weight: 900; color: #15803D; margin: 4px 0;">18.5 TỶ VNĐ</div>
      <span style="font-size: 12px; color: #166534;">Từ nguồn ngân sách & tài trợ</span>
    </div>

    <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 14px; text-align: center;">
      <span style="font-size: 11px; font-weight: 800; color: #1E40AF; text-transform: uppercase;">Số lượng sinh viên nhận</span>
      <div style="font-size: 20px; font-weight: 900; color: #1D4ED8; margin: 4px 0;">1,420+ SUẤT</div>
      <span style="font-size: 12px; color: #1E40AF;">Bình quân mỗi năm học</span>
    </div>

    <div style="background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 12px; padding: 14px; text-align: center;">
      <span style="font-size: 11px; font-weight: 800; color: #9A3412; text-transform: uppercase;">Tỷ lệ xét duyệt thành công</span>
      <div style="font-size: 20px; font-weight: 900; color: #C2410C; margin: 4px 0;">96.8%</div>
      <span style="font-size: 12px; color: #9A3412;">Hồ sơ đúng quy định</span>
    </div>
  </div>

  <h3 style="font-size: 13.5px; font-weight: 700; color: #0B3B60; margin-bottom: 8px;">BẢNG TỔNG HỢP THEO NĂM HỌC GẦN NHẤT</h3>
  <table style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
    <thead>
      <tr style="background: #F1F5F9; color: #0F172A;">
        <th style="padding: 8px 12px; border: 1px solid #E2E8F0; text-align: left;">Năm học</th>
        <th style="padding: 8px 12px; border: 1px solid #E2E8F0; text-align: center;">Số lượng suất cấp</th>
        <th style="padding: 8px 12px; border: 1px solid #E2E8F0; text-align: right;">Tổng kinh phí giải ngân</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px 12px; border: 1px solid #E2E8F0; font-weight: bold;">2024 - 2025</td>
        <td style="padding: 8px 12px; border: 1px solid #E2E8F0; text-align: center;">1,386 sinh viên</td>
        <td style="padding: 8px 12px; border: 1px solid #E2E8F0; text-align: right; font-weight: bold; color: #0B4899;">15,789,312,500 đ</td>
      </tr>
      <tr style="background: #F8FAFC;">
        <td style="padding: 8px 12px; border: 1px solid #E2E8F0; font-weight: bold;">2023 - 2024</td>
        <td style="padding: 8px 12px; border: 1px solid #E2E8F0; text-align: center;">1,290 sinh viên</td>
        <td style="padding: 8px 12px; border: 1px solid #E2E8F0; text-align: right; font-weight: bold; color: #0B4899;">14,120,500,000 đ</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; border: 1px solid #E2E8F0; font-weight: bold;">2022 - 2023</td>
        <td style="padding: 8px 12px; border: 1px solid #E2E8F0; text-align: center;">1,180 sinh viên</td>
        <td style="padding: 8px 12px; border: 1px solid #E2E8F0; text-align: right; font-weight: bold; color: #0B4899;">12,950,000,000 đ</td>
      </tr>
    </tbody>
  </table>
</div>`,
  };

  const getActiveHtml = () => {
    switch (activeHtmlTab) {
      case 'intro':
        return formData.introHtml !== undefined && formData.introHtml !== '' ? formData.introHtml : defaultTemplates.intro;
      case 'rules':
        return formData.rulesHtml !== undefined && formData.rulesHtml !== '' ? formData.rulesHtml : defaultTemplates.rules;
      case 'notices':
        return formData.noticesHtml !== undefined && formData.noticesHtml !== '' ? formData.noticesHtml : defaultTemplates.notices;
      case 'stats':
        return formData.statsHtml !== undefined && formData.statsHtml !== '' ? formData.statsHtml : defaultTemplates.stats;
    }
  };

  const setActiveHtml = (val: string) => {
    switch (activeHtmlTab) {
      case 'intro':
        setFormData({ ...formData, introHtml: val });
        break;
      case 'rules':
        setFormData({ ...formData, rulesHtml: val });
        break;
      case 'notices':
        setFormData({ ...formData, noticesHtml: val });
        break;
      case 'stats':
        setFormData({ ...formData, statsHtml: val });
        break;
    }
  };

  const insertSnippet = (snippet: string) => {
    const cur = getActiveHtml();
    setActiveHtml(cur + '\n' + snippet);
  };

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Scholarship = {
        ...formData,
        introHtml: formData.introHtml || defaultTemplates.intro,
        rulesHtml: formData.rulesHtml || defaultTemplates.rules,
        noticesHtml: formData.noticesHtml || defaultTemplates.notices,
        statsHtml: formData.statsHtml || defaultTemplates.stats,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-slate-100 py-2.5 z-10 border-b border-slate-200">
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Xem trước Popup</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
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
        {/* Card 1: Thông tin cơ bản */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            1. Thông tin chung chương trình
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Tên chương trình học bổng *
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="vd: CHƯƠNG TRÌNH PHÁT TRIỂN NGƯỜI HỌC QUỐC TẾ"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-800"
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
              </select>
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
                placeholder="vd: Học viên cao học, nghiên cứu sinh có quốc tịch nước ngoài"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700"
              />
            </div>

            {/* Banner Image URL */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Đường dẫn ảnh banner Popup
              </label>
              <input
                type="text"
                value={formData.featuredImage || ''}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="/images/due-students-banner-clean.jpg"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Nội dung giới thiệu */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            2. Nội dung giới thiệu chung
          </h3>

          <textarea
            rows={3}
            value={formData.intro}
            onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
            placeholder="Viết đoạn văn giới thiệu mục tiêu, ý nghĩa và thông điệp của chương trình..."
            className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 leading-relaxed text-slate-700"
          />
        </div>

        {/* Card 3: SOẠN THẢO NỘI DUNG POPUP BẰNG HTML (4 MỤC: GIỚI THIỆU - QUY ĐỊNH - THÔNG BÁO - THỐNG KÊ) */}
        <div className="bg-white p-6 rounded-2xl border-2 border-blue-500 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                3. Soạn thảo nội dung Popup bằng HTML (Đủ 4 Mục)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chỉnh sửa mã HTML trực tiếp cho từng đề mục trong Popup: Giới thiệu, Quy định, Thông báo, Thống kê
              </p>
            </div>

            {/* Live Preview Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewHtml(!previewHtml)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  previewHtml
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{previewHtml ? 'Quay lại soạn HTML' : 'Xem trước trực tiếp'}</span>
              </button>
            </div>
          </div>

          {/* 4 Dedicated HTML Tabs: GIỚI THIỆU - QUY ĐỊNH - THÔNG BÁO - THỐNG KÊ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-black">
            <button
              type="button"
              onClick={() => setActiveHtmlTab('intro')}
              className={`py-2 px-3 rounded-xl transition-all uppercase tracking-wide flex items-center justify-center gap-1.5 ${
                activeHtmlTab === 'intro'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>1. Giới thiệu</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveHtmlTab('rules')}
              className={`py-2 px-3 rounded-xl transition-all uppercase tracking-wide flex items-center justify-center gap-1.5 ${
                activeHtmlTab === 'rules'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>2. Quy định</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveHtmlTab('notices')}
              className={`py-2 px-3 rounded-xl transition-all uppercase tracking-wide flex items-center justify-center gap-1.5 ${
                activeHtmlTab === 'notices'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>3. Thông báo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveHtmlTab('stats')}
              className={`py-2 px-3 rounded-xl transition-all uppercase tracking-wide flex items-center justify-center gap-1.5 ${
                activeHtmlTab === 'stats'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>4. Thống kê</span>
            </button>
          </div>

          {/* Editor Area (Textarea or Live Preview) */}
          {previewHtml ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>Xem trước hiển thị của mục trong Popup:</span>
                <span className="text-blue-600 font-bold uppercase">
                  {activeHtmlTab === 'intro'
                    ? '1. Giới thiệu'
                    : activeHtmlTab === 'rules'
                    ? '2. Quy định'
                    : activeHtmlTab === 'notices'
                    ? '3. Thông báo'
                    : '4. Thống kê'}
                </span>
              </div>
              <div
                className="p-5 rounded-2xl border-2 border-dashed border-blue-300 bg-white min-h-[360px] due-popup-html-content shadow-inner"
                dangerouslySetInnerHTML={{ __html: getActiveHtml() }}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                <span>
                  Mã HTML của mục{' '}
                  <span className="text-blue-700 uppercase">
                    {activeHtmlTab === 'intro'
                      ? 'Giới thiệu'
                      : activeHtmlTab === 'rules'
                      ? 'Quy định'
                      : activeHtmlTab === 'notices'
                      ? 'Thông báo'
                      : 'Thống kê'}
                  </span>
                  :
                </span>
                <span className="text-slate-400 font-normal">Hỗ trợ đầy đủ thẻ HTML (h1-h4, p, ul, table, style inline...)</span>
              </div>

              <textarea
                rows={18}
                value={getActiveHtml()}
                onChange={(e) => setActiveHtml(e.target.value)}
                placeholder="Nhập mã HTML trực tiếp ở đây..."
                className="w-full p-4 font-mono text-xs bg-slate-950 text-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed shadow-inner min-h-[380px]"
              />
            </div>
          )}
        </div>

        {/* Card 4: Quản lý tài liệu đính kèm */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              4. Tài liệu đính kèm & Văn bản quy định
            </h3>

            <button
              type="button"
              onClick={handleAddDocument}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm file đính kèm</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {formData.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs gap-3"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 font-bold flex items-center justify-center uppercase text-[10px]">
                    {doc.fileType}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={doc.title}
                      onChange={(e) => {
                        const next = formData.documents.map((d) =>
                          d.id === doc.id ? { ...d, title: e.target.value } : d
                        );
                        setFormData({ ...formData, documents: next });
                      }}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div className="w-28">
                    <input
                      type="text"
                      value={doc.fileSize}
                      onChange={(e) => {
                        const next = formData.documents.map((d) =>
                          d.id === doc.id ? { ...d, fileSize: e.target.value } : d
                        );
                        setFormData({ ...formData, documents: next });
                      }}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs text-slate-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveDocument(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* Live Preview Modal */}
      <ScholarshipModal
        scholarship={showPreview ? formData : null}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
}
