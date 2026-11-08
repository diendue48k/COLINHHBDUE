const fs = require('fs');

const dbPath = './data/db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.scholarships = db.scholarships.map((s) => {
  const title = s.title;

  const introHtml = `
<div style="margin-bottom: 20px;">
  <h2 style="font-size: 16px; font-weight: 800; color: #0B3B60; text-transform: uppercase; margin-bottom: 10px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">
    I. GIỚI THIỆU CHƯƠNG TRÌNH: ${title.toUpperCase()}
  </h2>
  <p style="font-size: 13.5px; line-height: 1.6; color: #334155; margin-bottom: 14px;">
    ${s.intro || `Chương trình học bổng "${title}" của Trường Đại học Kinh tế – Đại học Đà Nẵng nhằm kịp thời động viên, tôn vinh và hỗ trợ tài chính cho người học có thành tích xuất sắc, vượt khó vươn lên và hội nhập quốc tế.`}
  </p>

  <div style="background: #F0F7FF; border-left: 4px solid #0052CC; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
    <strong style="color: #0052CC; font-size: 13.5px;">🎯 Mục tiêu & Ý nghĩa:</strong>
    <p style="margin: 6px 0 0 0; font-size: 13px; color: #1E293B;">
      Tạo môi trường học tập và nghiên cứu công bằng, khích lệ tinh thần tự học, nghiên cứu khoa học và phát huy tối đa tiềm năng của sinh viên, học viên DUE.
    </p>
  </div>

  <h3 style="font-size: 14px; font-weight: 700; color: #0B3B60; margin: 16px 0 8px 0;">ĐỐI TƯỢNG VÀ MỨC CẤP HỌC BỔNG</h3>
  <ul style="list-style: none; padding-left: 0; margin: 0 0 16px 0;">
    <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 13px; color: #334155;">
      <span style="color: #0052CC; font-weight: bold;">✔</span>
      <span><strong>Đối tượng thụ hưởng:</strong> ${s.targetAudience || 'Sinh viên, học viên theo học tại Trường Đại học Kinh tế - ĐHĐN'}.</span>
    </li>
    <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 13px; color: #334155;">
      <span style="color: #0052CC; font-weight: bold;">✔</span>
      <span><strong>Mức cấp học bổng:</strong> Hỗ trợ từ 50% đến 100% học phí và khen thưởng theo từng học kỳ.</span>
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
      Thực hiện công khai, dân chủ, đúng quy trình theo các văn bản quy định của Bộ Giáo dục & Đào tạo, Đại học Đà Nẵng và Trường Đại học Kinh tế. Điểm xét lấy từ cao xuống thấp cho đến hết chỉ tiêu.
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
          <td style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">GPA &ge; 3.60</td>
          <td style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">ĐRL &ge; 90 (Xuất sắc)</td>
        </tr>
        <tr style="background: #F8FAFC;">
          <td style="padding: 10px; border: 1px solid #CBD5E1; font-weight: bold; color: #0284C7;">Loại Giỏi</td>
          <td style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">3.20 &le; GPA &lt; 3.60</td>
          <td style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">ĐRL &ge; 80 (Tốt)</td>
        </tr>
        <tr style="background: #ffffff;">
          <td style="padding: 10px; border: 1px solid #CBD5E1; font-weight: bold; color: #16A34A;">Loại Khá</td>
          <td style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">2.50 &le; GPA &lt; 3.20</td>
          <td style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">ĐRL &ge; 70 (Khá)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="background: #FFF7ED; border-left: 4px solid #EA580C; padding: 12px; border-radius: 6px; margin-top: 14px;">
    <strong style="color: #EA580C; font-size: 13px;">⚠ Điều kiện duy trì & Nghĩa vụ:</strong>
    <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #431407;">
      Người học không vi phạm kỷ luật từ mức khiển trách trở lên trong học kỳ xét học bổng, tích lũy đủ số tín chỉ tối thiểu theo khung chương trình đào tạo của Trường.
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
      <span style="background: #DBEAFE; color: #1E40AF; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Thông báo số 845/TB-ĐHKT</span>
      <span style="color: #64748B; font-size: 12px;">Ngày ban hành: 15/09/2025</span>
    </div>
    <h3 style="font-size: 14px; font-weight: 700; color: #0F172A; margin: 6px 0;">
      Kế hoạch tiếp nhận hồ sơ xét cấp ${title} – Học kỳ I Năm học 2025 - 2026
    </h3>
    <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 10px;">
      Nhà trường thông báo đến toàn thể sinh viên, học viên thuộc diện thụ hưởng theo dõi quy định, nộp hồ sơ minh chứng và đối chiếu danh sách trực tuyến.
    </p>
    
    <div style="background: #F8FAFC; padding: 10px; border-radius: 8px; font-size: 12.5px; color: #334155;">
      <p style="margin: 2px 0;"><strong>• Thời gian nhận hồ sơ:</strong> Từ 20/09/2025 đến 17h00 ngày 25/10/2025.</p>
      <p style="margin: 2px 0;"><strong>• Hình thức nộp:</strong> Trực tuyến qua Cổng thông tin học bổng DUE hoặc trực tiếp tại Phòng H214.</p>
      <p style="margin: 2px 0;"><strong>• Công bố kết quả dự kiến:</strong> Ngày 10/11/2025 trên Cổng thông tin học bổng DUE.</p>
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

  return {
    ...s,
    introHtml: s.introHtml || introHtml,
    rulesHtml: s.rulesHtml || rulesHtml,
    noticesHtml: s.noticesHtml || noticesHtml,
    statsHtml: s.statsHtml || statsHtml,
  };
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated all 22 scholarships with rich HTML in all 4 tabs!');
