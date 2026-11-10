const fs = require('fs');

const exactCategories = [
  {
    id: "cat-1",
    slug: "sau-dai-hoc",
    title: "HỌC BỔNG BẬC SAU ĐẠI HỌC",
    shortTitle: "Bậc Sau Đại học",
    order: 1,
    color: "#0B4899",
    illustration: "cap"
  },
  {
    id: "cat-2",
    slug: "dai-hoc",
    title: "HỌC BỔNG BẬC ĐẠI HỌC",
    shortTitle: "Bậc Đại học",
    order: 2,
    color: "#F26524",
    illustration: "cap"
  },
  {
    id: "cat-3",
    slug: "ngoai-truong",
    title: "HỌC BỔNG ĐƠN VỊ NGOÀI TRƯỜNG",
    shortTitle: "Ngoài trường",
    order: 3,
    color: "#0B4899",
    illustration: "handshake"
  },
  {
    id: "cat-4",
    slug: "chinh-sach",
    title: "CHÍNH SÁCH MIỄN GIẢM TRỢ CẤP XÃ HỘI",
    shortTitle: "Miễn giảm & Trợ cấp",
    order: 4,
    color: "#F26524",
    illustration: "heart"
  },
  {
    id: "cat-5",
    slug: "lien-ket-quoc-te",
    title: "HỌC BỔNG CHƯƠNG TRÌNH CỬ NHÂN LIÊN KẾT QUỐC TẾ",
    shortTitle: "Cử nhân Liên kết Quốc tế",
    order: 5,
    color: "#119046",
    illustration: "globe"
  },
  {
    id: "cat-6",
    slug: "du-hoc",
    title: "HỌC BỔNG DU HỌC",
    shortTitle: "Du học",
    order: 6,
    color: "#119046",
    illustration: "plane"
  }
];

// 21 exact scholarships per user image
const exactScholarshipConfigs = [
  // Cột 1: HỌC BỔNG BẬC SAU ĐẠI HỌC (3)
  {
    id: "sdh-nha-nghien-cuu-tre",
    order: 1,
    categoryId: "cat-1",
    title: "Chương trình phát triển Nhà nghiên cứu trẻ (Học viên cao học)",
    shortTitle: "Nhà nghiên cứu trẻ (Học viên cao học)",
    icon: "Users",
    educationLevel: "sau-dai-hoc"
  },
  {
    id: "sdh-nha-khoa-hoc",
    order: 2,
    categoryId: "cat-1",
    title: "Chương trình phát triển Nhà khoa học (Nghiên cứu sinh)",
    shortTitle: "Nhà khoa học (Nghiên cứu sinh)",
    icon: "GraduationCap",
    educationLevel: "sau-dai-hoc"
  },
  {
    id: "sdh-nguoi-hoc-quoc-te",
    order: 3,
    categoryId: "cat-1",
    title: "Chương trình phát triển Người học Quốc tế",
    shortTitle: "Người học Quốc tế",
    icon: "Globe",
    educationLevel: "sau-dai-hoc"
  },

  // Cột 2: HỌC BỔNG BẬC ĐẠI HỌC (7)
  {
    id: "dh-hoc-bong-tinh-hoa",
    order: 4,
    categoryId: "cat-2",
    title: "Chương trình phát triển sinh viên tinh hoa (DUE – Elite)",
    shortTitle: "Sinh viên tinh hoa (DUE – Elite)",
    icon: "Award",
    educationLevel: "dai-hoc"
  },
  {
    id: "dh-kkht-tai-nang",
    order: 5,
    categoryId: "cat-2",
    title: "Học bổng khuyến khích học tập cho sinh viên tài năng",
    shortTitle: "KKHT sinh viên tài năng",
    icon: "Trophy",
    educationLevel: "dai-hoc"
  },
  {
    id: "dh-kkht-vuot-kho",
    order: 6,
    categoryId: "cat-2",
    title: "Học bổng khuyến khích học tập cho sinh viên vượt khó",
    shortTitle: "KKHT sinh viên vượt khó",
    icon: "Heart",
    educationLevel: "dai-hoc"
  },
  {
    id: "dh-kkht-ket-qua-cao",
    order: 7,
    categoryId: "cat-2",
    title: "Học bổng khuyến khích học tập cho sinh viên đạt kết quả cao học tập và rèn luyện",
    shortTitle: "KKHT kết quả cao học tập và rèn luyện",
    icon: "GraduationCap",
    educationLevel: "dai-hoc"
  },
  {
    id: "dh-kkht-sv-quoc-te",
    order: 8,
    categoryId: "cat-2",
    title: "Học bổng khuyến khích học tập cho sinh viên quốc tế",
    shortTitle: "KKHT sinh viên quốc tế",
    icon: "Globe",
    educationLevel: "dai-hoc"
  },
  {
    id: "dh-ho-tro-sv-quoc-te",
    order: 9,
    categoryId: "cat-2",
    title: "Chương trình phát triển sinh viên quốc tế",
    shortTitle: "Phát triển sinh viên quốc tế",
    icon: "Globe",
    educationLevel: "dai-hoc"
  },
  {
    id: "dh-ho-tro-hoan-canh-kho-khan",
    order: 10,
    categoryId: "cat-2",
    title: "Chương trình hỗ trợ người học có hoàn cảnh khó khăn",
    shortTitle: "Hỗ trợ người học có hoàn cảnh khó khăn",
    icon: "Heart",
    educationLevel: "dai-hoc"
  },

  // Cột 3: HỌC BỔNG ĐƠN VỊ NGOÀI TRƯỜNG (3)
  {
    id: "nt-hat-giong-tot-lanh",
    order: 11,
    categoryId: "cat-3",
    title: "Hạt giống tốt lành",
    shortTitle: "Hạt giống tốt lành",
    icon: "Heart",
    educationLevel: "dai-hoc"
  },
  {
    id: "nt-doanh-nghiep-cuu-sinh-vien",
    order: 12,
    categoryId: "cat-3",
    title: "Doanh nghiệp, cựu sinh viên",
    shortTitle: "Doanh nghiệp, cựu sinh viên",
    icon: "Handshake",
    educationLevel: "dai-hoc"
  },
  {
    id: "nt-nghi-dinh-chinh-phu",
    order: 13,
    categoryId: "cat-3",
    title: "Nghị định Chính phủ 179/2026/NĐ-CP",
    shortTitle: "Nghị định Chính phủ 179/2026/NĐ-CP",
    icon: "FileText",
    educationLevel: "dai-hoc"
  },

  // Cột 4: CHÍNH SÁCH MIỄN GIẢM TRỢ CẤP XÃ HỘI (2)
  {
    id: "mg-mien-giam-ho-tro-tro-cap",
    order: 14,
    categoryId: "cat-4",
    title: "Miễn giảm, hỗ trợ, trợ cấp xã hội",
    shortTitle: "Miễn giảm, hỗ trợ, trợ cấp xã hội",
    icon: "ShieldCheck",
    educationLevel: "dai-hoc"
  },
  {
    id: "mg-ho-tro-tai-xa-nhcsxh",
    order: 15,
    categoryId: "cat-4",
    title: "Hỗ trợ lãi vay tại Ngân hàng Chính sách Xã hội Việt Nam",
    shortTitle: "Hỗ trợ lãi vay tại NHCSXH Việt Nam",
    icon: "Landmark",
    educationLevel: "dai-hoc"
  },

  // Cột 5: HỌC BỔNG CHƯƠNG TRÌNH CỬ NHÂN LIÊN KẾT QUỐC TẾ (5)
  {
    id: "lk-hoc-bong-tuyen-sinh",
    order: 16,
    categoryId: "cat-5",
    title: "Học bổng tuyển sinh",
    shortTitle: "Học bổng tuyển sinh",
    icon: "Award",
    educationLevel: "dai-hoc"
  },
  {
    id: "lk-hoc-bong-tieng-anh",
    order: 17,
    categoryId: "cat-5",
    title: "Học bổng chương trình Tiếng anh",
    shortTitle: "Học bổng chương trình Tiếng anh",
    icon: "Globe",
    educationLevel: "dai-hoc"
  },
  {
    id: "lk-hoc-bong-dai-cuong",
    order: 18,
    categoryId: "cat-5",
    title: "Học bổng chương trình Đại cương (Btec - HND)",
    shortTitle: "Đại cương (Btec - HND)",
    icon: "GraduationCap",
    educationLevel: "dai-hoc"
  },
  {
    id: "lk-hoc-bong-chuyen-nganh",
    order: 19,
    categoryId: "cat-5",
    title: "Học bổng chương trình chuyên ngành (Top Up year)",
    shortTitle: "Chuyên ngành (Top Up year)",
    icon: "Trophy",
    educationLevel: "dai-hoc"
  },
  {
    id: "lk-chinh-sach-mien-giam",
    order: 20,
    categoryId: "cat-5",
    title: "Chính sách miễn giảm học phí",
    shortTitle: "Chính sách miễn giảm học phí",
    icon: "ShieldCheck",
    educationLevel: "dai-hoc"
  },

  // Cột 6: HỌC BỔNG DU HỌC (1)
  {
    id: "dhoc-tai-don-vi-doi-tac",
    order: 21,
    categoryId: "cat-6",
    title: "Học bổng tại đơn vị đối tác",
    shortTitle: "Học bổng tại đơn vị đối tác",
    icon: "Plane",
    educationLevel: "dai-hoc"
  }
];

// Helper to generate full rich HTML tabs for a given scholarship
function generateHtmlTabs(s) {
  const title = s.title;
  const target = s.targetAudience || 'Sinh viên chính quy, học viên cao học đang theo học tại Trường Đại học Kinh tế – ĐHĐN';
  const introText = s.intro || `Chương trình "${title}" của Trường Đại học Kinh tế – Đại học Đà Nẵng nhằm kịp thời động viên, hỗ trợ tài chính và khích lệ người học phát huy tối đa năng lực học tập, nghiên cứu khoa học và hội nhập quốc tế.`;

  const introHtml = `
<div style="margin-bottom: 20px;">
  <h2 style="font-size: 16px; font-weight: 800; color: #0B3B60; text-transform: uppercase; margin-bottom: 10px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">
    I. GIỚI THIỆU CHƯƠNG TRÌNH: ${title.toUpperCase()}
  </h2>
  <p style="font-size: 13.5px; line-height: 1.6; color: #334155; margin-bottom: 14px;">
    ${introText}
  </p>

  <div style="background: #F0F7FF; border-left: 4px solid #0052CC; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
    <strong style="color: #0052CC; font-size: 13.5px;">🎯 Mục tiêu & Ý nghĩa:</strong>
    <p style="margin: 6px 0 0 0; font-size: 13px; color: #1E293B;">
      Đồng hành cùng người học trên con đường chinh phục tri thức, phát triển năng lực cá nhân và đào tạo nguồn nhân lực chất lượng cao phục vụ sự phát triển kinh tế - xã hội.
    </p>
  </div>

  <h3 style="font-size: 14px; font-weight: 700; color: #0B3B60; margin: 16px 0 8px 0;">ĐỐI TƯỢNG VÀ MỨC CẤP HỌC BỔNG</h3>
  <ul style="list-style: none; padding-left: 0; margin: 0 0 16px 0;">
    <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 13px; color: #334155;">
      <span style="color: #0052CC; font-weight: bold;">✔</span>
      <span><strong>Đối tượng thụ hưởng:</strong> ${target}.</span>
    </li>
    <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 13px; color: #334155;">
      <span style="color: #0052CC; font-weight: bold;">✔</span>
      <span><strong>Mức cấp học bổng:</strong> Hỗ trợ từ 50% đến 100% học phí hoặc trao tặng định mức kinh phí theo từng học kỳ.</span>
    </li>
  </ul>
</div>
`;

  const rulesHtml = `
<div style="margin-bottom: 20px;">
  <h2 style="font-size: 16px; font-weight: 800; color: #0B3B60; text-transform: uppercase; margin-bottom: 10px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">
    II. QUY ĐỊNH VÀ TIÊU CHUẨN XÉT CẤP
  </h2>

  <div style="margin-bottom: 16px;">
    <h3 style="font-size: 14px; font-weight: 700; color: #0B3B60; margin-bottom: 8px;">1. NGUYÊN TẮC XÉT DUYỆT</h3>
    <p style="font-size: 13px; line-height: 1.6; color: #334155;">
      Thực hiện công khai, dân chủ, đúng quy trình theo các văn bản quy định của Bộ Giáo dục & Đào tạo, Đại học Đà Nẵng và Trường Đại học Kinh tế. Điểm xét lấy từ cao xuống thấp cho đến hết chỉ tiêu được phân bổ.
    </p>
  </div>

  <div style="margin-bottom: 16px;">
    <h3 style="font-size: 14px; font-weight: 700; color: #0B3B60; margin-bottom: 8px;">2. TIÊU CHUẨN ĐIỂM HỌC TẬP & RÈN LUYỆN (GPA)</h3>
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
    <strong style="color: #EA580C; font-size: 13px;">⚠️ Điều kiện duy trì & cam kết:</strong>
    <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #431407;">
      Người học không bị kỷ luật từ mức khiển trách trở lên trong học kỳ xét học bổng, tích lũy đủ số tín chỉ quy định và chấp hành nghiêm túc quy chế của Nhà trường.
    </p>
  </div>
</div>
`;

  const noticesHtml = `
<div style="margin-bottom: 20px;">
  <h2 style="font-size: 16px; font-weight: 800; color: #0B3B60; text-transform: uppercase; margin-bottom: 12px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">
    III. THÔNG BÁO XÉT CẤP MỚI NHẤT
  </h2>
  
  <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 14px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
      <span style="background: #DBEAFE; color: #1E40AF; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
        Thông báo chính thức
      </span>
      <span style="color: #64748B; font-size: 12px;">Năm học 2025 - 2026</span>
    </div>
    <h3 style="font-size: 14px; font-weight: 700; color: #0F172A; margin: 6px 0;">
      Kế hoạch tiếp nhận hồ sơ xét cấp ${title}
    </h3>
    <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 10px;">
      Phòng Công tác Sinh viên thông báo kế hoạch nộp hồ sơ, rà soát danh sách và đối chiếu tiêu chuẩn xét duyệt học bổng.
    </p>
    
    <div style="background: #F8FAFC; padding: 10px; border-radius: 8px; font-size: 12.5px; color: #334155;">
      <p style="margin: 2px 0;"><strong>• Hình thức nộp:</strong> Trực tuyến qua Cổng thông tin học bổng DUE hoặc nộp trực tiếp tại Văn phòng Phòng Công tác Sinh viên (H214).</p>
      <p style="margin: 2px 0;"><strong>• Đầu mối hỗ trợ:</strong> Hotline: 0236 3956 397 | Email: phongcongtacsinhvien@due.edu.vn</p>
    </div>
  </div>
</div>
`;

  const statsHtml = `
<div style="margin-bottom: 20px;">
  <h2 style="font-size: 16px; font-weight: 800; color: #0B3B60; text-transform: uppercase; margin-bottom: 12px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">
    IV. THỐNG KÊ KINH PHÍ & SỐ LƯỢNG THỤ HƯỞNG
  </h2>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 18px;">
    <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 14px; text-align: center;">
      <span style="font-size: 11px; font-weight: 800; color: #166534; text-transform: uppercase;">Tổng ngân sách năm</span>
      <div style="font-size: 20px; font-weight: 900; color: #15803D; margin: 4px 0;">18.5 TỶ VNĐ</div>
      <span style="font-size: 12px; color: #166534;">Từ ngân sách trường & tài trợ</span>
    </div>

    <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 14px; text-align: center;">
      <span style="font-size: 11px; font-weight: 800; color: #1E40AF; text-transform: uppercase;">Sinh viên thụ hưởng</span>
      <div style="font-size: 20px; font-weight: 900; color: #1D4ED8; margin: 4px 0;">1,420+ SUẤT</div>
      <span style="font-size: 12px; color: #1E40AF;">Bình quân mỗi năm học</span>
    </div>

    <div style="background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 12px; padding: 14px; text-align: center;">
      <span style="font-size: 11px; font-weight: 800; color: #9A3412; text-transform: uppercase;">Tỷ lệ xét duyệt đạt</span>
      <div style="font-size: 20px; font-weight: 900; color: #C2410C; margin: 4px 0;">96.8%</div>
      <span style="font-size: 12px; color: #9A3412;">Hồ sơ hợp lệ đạt tiêu chuẩn</span>
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
</div>
`;

  return { introHtml, rulesHtml, noticesHtml, statsHtml };
}

function run() {
  const dbPath = './data/db.json';
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // 1. Update categories
  db.categories = exactCategories;

  // 2. Map existing scholarships or create new based on exactScholarshipConfigs
  const existingMap = new Map();
  db.scholarships.forEach(s => existingMap.set(s.id, s));

  const updatedScholarships = exactScholarshipConfigs.map(cfg => {
    const existing = existingMap.get(cfg.id) || {};
    const merged = {
      ...existing,
      id: cfg.id,
      order: cfg.order,
      categoryId: cfg.categoryId,
      title: cfg.title,
      shortTitle: cfg.shortTitle,
      icon: cfg.icon || existing.icon || 'GraduationCap',
      educationLevel: cfg.educationLevel || existing.educationLevel || 'dai-hoc',
      isActive: true,
      viewsCount: existing.viewsCount || 0,
      slug: existing.slug || cfg.id.replace(/^[a-z]+-/, '')
    };

    const tabs = generateHtmlTabs(merged);
    merged.introHtml = tabs.introHtml;
    merged.rulesHtml = tabs.rulesHtml;
    merged.noticesHtml = tabs.noticesHtml;
    merged.statsHtml = tabs.statsHtml;

    return merged;
  });

  db.scholarships = updatedScholarships;
  db.lastUpdatedAt = new Date().toISOString();

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log(`✅ Updated ${db.categories.length} categories and ${db.scholarships.length} scholarships in data/db.json!`);
}

run();
