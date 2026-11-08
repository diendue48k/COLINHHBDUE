const fs = require('fs');
const path = require('path');

// Let's create the rich HTML templates and real data for DUE scholarships based on the docx
const dbPath = path.join(process.cwd(), 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// The exact HTML for "KKHT KẾT QUẢ CAO HỌC TẬP VÀ RÈN LUYỆN" matching media_1794028856755_0443fc5f.png!
const kkhtHtml = `
<div style="font-family: inherit; color: #1e293b;">
  <!-- Section 1 -->
  <div style="margin-bottom: 24px;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
      <div style="width: 24px; height: 24px; background: #0B4899; color: #fff; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800;">01</div>
      <h3 style="margin: 0; font-size: 15px; font-weight: 900; color: #0B3B60; text-transform: uppercase; letter-spacing: 0.5px;">ĐỐI TƯỢNG VÀ MỨC CẤP</h3>
    </div>

    <!-- Đối tượng áp dụng box -->
    <div style="border: 1px solid #BFDBFE; border-radius: 10px; padding: 12px 16px; background: #F8FBFE; margin-bottom: 16px;">
      <div style="font-size: 11px; font-weight: 800; color: #0B4899; text-transform: uppercase; margin-bottom: 4px;">ĐỐI TƯỢNG ÁP DỤNG</div>
      <div style="font-size: 13px; color: #334155;">Sinh viên đại học hệ chính quy văn bằng thứ nhất có quốc tịch Việt Nam và đang học theo kế hoạch học tập chuẩn toàn khóa.</div>
    </div>

    <!-- Mức cấp học bổng table -->
    <div style="margin-bottom: 16px;">
      <div style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; color: #059669; margin-bottom: 8px;">
        <span style="display: inline-block; width: 3px; height: 14px; background: #059669; border-radius: 2px;"></span>
        <span>Mức cấp học bổng</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12.5px; border: 1px solid #CBD5E1; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: #0B4899; color: #ffffff;">
            <th style="padding: 10px 14px; text-align: left; font-weight: 700; width: 45%;">Xếp loại học bổng</th>
            <th style="padding: 10px 14px; text-align: left; font-weight: 700;">Giá trị học bổng tương đương</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #E2E8F0; background: #ffffff;">
            <td style="padding: 10px 14px; font-weight: 600; color: #1e293b;">Xuất sắc</td>
            <td style="padding: 10px 14px; font-weight: 700; color: #0B4899;">110% học phí</td>
          </tr>
          <tr style="border-bottom: 1px solid #E2E8F0; background: #F8FAFC;">
            <td style="padding: 10px 14px; font-weight: 600; color: #1e293b;">Giỏi</td>
            <td style="padding: 10px 14px; font-weight: 700; color: #0B4899;">105% học phí</td>
          </tr>
          <tr style="background: #ffffff;">
            <td style="padding: 10px 14px; font-weight: 600; color: #1e293b;">Khá</td>
            <td style="padding: 10px 14px; font-weight: 700; color: #0B4899;">100% học phí</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Lưu ý box -->
    <div style="border: 1px solid #FDBA74; background: #FFF7ED; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #9A3412;">
      <strong>Lưu ý:</strong> Giá trị học bổng được xác định dựa trên học phí thực tế mà sinh viên đã nộp cho các tín chỉ học lần đầu trong học kỳ xét học bổng.
    </div>
  </div>

  <!-- Section 2 -->
  <div style="margin-bottom: 24px;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
      <div style="width: 24px; height: 24px; background: #0B4899; color: #fff; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800;">02</div>
      <h3 style="margin: 0; font-size: 15px; font-weight: 900; color: #0B3B60; text-transform: uppercase; letter-spacing: 0.5px;">NGUYÊN TẮC XÉT CẤP VÀ ĐIỀU KIỆN DUY TRÌ</h3>
    </div>

    <!-- 01. Nguyên tắc xét cấp -->
    <div style="border: 1px solid #CBD5E1; border-radius: 10px; padding: 12px 16px; background: #ffffff; margin-bottom: 10px;">
      <div style="font-size: 12px; font-weight: 800; color: #0B3B60; margin-bottom: 4px;">01. Nguyên tắc xét cấp</div>
      <div style="font-size: 12.5px; color: #475569; line-height: 1.5;">Nhà trường căn cứ kết quả học tập, rèn luyện của sinh viên theo từng Khóa tuyển sinh, Ngành học để xét cấp học bổng vào cuối mỗi học kỳ.</div>
    </div>

    <!-- 02. Điều kiện xét học bổng -->
    <div style="border: 1px solid #CBD5E1; border-radius: 10px; padding: 12px 16px; background: #ffffff; margin-bottom: 10px;">
      <div style="font-size: 12px; font-weight: 800; color: #0B3B60; margin-bottom: 8px;">02. Điều kiện xét học bổng</div>
      <ul style="list-style: none; padding-left: 0; margin: 0;">
        <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 12.5px; color: #334155;">
          <span style="width: 6px; height: 6px; border-radius: 2px; background: #059669; margin-top: 6px; flex-shrink: 0;"></span>
          <span>Có kết quả học tập, rèn luyện từ loại Khá trở lên.</span>
        </li>
        <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 12.5px; color: #334155;">
          <span style="width: 6px; height: 6px; border-radius: 2px; background: #059669; margin-top: 6px; flex-shrink: 0;"></span>
          <span>Tích lũy tối thiểu 15 tín chỉ trong kỳ (hoặc từ 10 tín chỉ trong kỳ thực tập/khóa luận).</span>
        </li>
        <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 12.5px; color: #334155;">
          <span style="width: 6px; height: 6px; border-radius: 2px; background: #059669; margin-top: 6px; flex-shrink: 0;"></span>
          <span>Không có học phần F, không bị kỷ luật từ mức khiển trách trở lên và thỏa các điều kiện trong quy định xét học bổng KKHT.</span>
        </li>
        <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 12.5px; color: #334155;">
          <span style="width: 6px; height: 6px; border-radius: 2px; background: #059669; margin-top: 6px; flex-shrink: 0;"></span>
          <span>Tích cực tham gia hỗ trợ Nhà trường khi được điều động.</span>
        </li>
      </ul>
    </div>

    <!-- 03. Thứ tự ưu tiên xét cấp -->
    <div style="border: 1px solid #CBD5E1; border-radius: 10px; padding: 12px 16px; background: #ffffff; margin-bottom: 10px;">
      <div style="font-size: 12px; font-weight: 800; color: #0B3B60; margin-bottom: 4px;">03. Thứ tự ưu tiên xét cấp</div>
      <div style="font-size: 12.5px; color: #475569; margin-bottom: 12px;">Sinh viên được chọn theo thứ tự xếp loại học bổng từ Xuất sắc, Giỏi đến Khá cho đến khi hết ngân sách phân bổ. Nếu đồng xếp hạng xếp loại học bổng, sử dụng các tiêu chí ưu tiên lần lượt:</div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 12px;">
        <div style="border: 1px solid #BFDBFE; border-radius: 8px; padding: 8px 12px; background: #F8FBFE; display: flex; align-items: center; gap: 8px;">
          <span style="background: #0B4899; color: #fff; border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: 700;">01</span>
          <span style="font-size: 12px; font-weight: 600; color: #1e293b;">Điểm trung bình học kỳ (hệ 4)</span>
        </div>
        <div style="border: 1px solid #BFDBFE; border-radius: 8px; padding: 8px 12px; background: #F8FBFE; display: flex; align-items: center; gap: 8px;">
          <span style="background: #0B4899; color: #fff; border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: 700;">02</span>
          <span style="font-size: 12px; font-weight: 600; color: #1e293b;">Điểm trung bình học kỳ (hệ 10)</span>
        </div>
        <div style="border: 1px solid #BFDBFE; border-radius: 8px; padding: 8px 12px; background: #F8FBFE; display: flex; align-items: center; gap: 8px;">
          <span style="background: #0B4899; color: #fff; border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: 700;">03</span>
          <span style="font-size: 12px; font-weight: 600; color: #1e293b;">Điểm rèn luyện</span>
        </div>
        <div style="border: 1px solid #BFDBFE; border-radius: 8px; padding: 8px 12px; background: #F8FBFE; display: flex; align-items: center; gap: 8px;">
          <span style="background: #0B4899; color: #fff; border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: 700;">04</span>
          <span style="font-size: 12px; font-weight: 600; color: #1e293b;">Số tín chỉ học kỳ</span>
        </div>
        <div style="border: 1px solid #BFDBFE; border-radius: 8px; padding: 8px 12px; background: #F8FBFE; display: flex; align-items: center; gap: 8px; grid-column: span 2;">
          <span style="background: #0B4899; color: #fff; border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: 700;">05</span>
          <span style="font-size: 12px; font-weight: 600; color: #1e293b;">Điểm trung bình chung tích lũy</span>
        </div>
      </div>

      <!-- Lưu ý cách tính điểm -->
      <div style="border: 1px solid #FED7AA; background: #FFFBEB; border-radius: 8px; padding: 10px 14px; font-size: 11.5px; color: #9A3412; line-height: 1.5;">
        <strong>Lưu ý về cách tính điểm:</strong><br/>
        Điểm trung bình học kỳ và điểm rèn luyện được xác định căn cứ theo các quy định có liên quan của Trường (không bao gồm học phần Giáo dục thể chất, Giáo dục Quốc phòng An ninh, các học phần học cải thiện, học lại, các học phần được miễn học).<br/>
        Điểm của các học phần trong học kỳ hè được tính gộp vào Điểm trung bình học kỳ 2 của cùng năm học (trừ sinh viên năm cuối).
      </div>
    </div>

    <!-- 04. Giới hạn số lượng học bổng -->
    <div style="border: 1px solid #CBD5E1; border-radius: 10px; padding: 12px 16px; background: #ffffff;">
      <div style="font-size: 12px; font-weight: 800; color: #0B3B60; margin-bottom: 4px;">04. Giới hạn số lượng học bổng</div>
      <div style="font-size: 12.5px; color: #475569;">Mỗi sinh viên chỉ được nhận tối đa <strong style="color: #0B4899;">01 loại học bổng KKHT</strong> trong một học kỳ.</div>
    </div>
  </div>

  <!-- Section 3: THỐNG KÊ KẾT QUẢ CẤP HỌC BỔNG -->
  <div style="margin-bottom: 24px;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
      <div style="width: 24px; height: 24px; background: #0B4899; color: #fff; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800;">03</div>
      <h3 style="margin: 0; font-size: 15px; font-weight: 900; color: #0B3B60; text-transform: uppercase; letter-spacing: 0.5px;">THỐNG KÊ KẾT QUẢ CẤP HỌC BỔNG</h3>
    </div>

    <p style="font-size: 12.5px; color: #64748B; margin-bottom: 12px;">Kết quả xét cấp học bổng khuyến khích học tập qua các năm học và học kỳ:</p>

    <!-- 4 Stats Boxes Grid -->
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
      <div style="border: 1px solid #BFDBFE; border-radius: 10px; padding: 14px; background: #F8FBFE;">
        <div style="font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">NĂM HỌC 2022-2023</div>
        <div style="font-size: 18px; font-weight: 900; color: #0B4899; margin-bottom: 4px;">9.708.419.500 đ</div>
        <div style="font-size: 11.5px; font-weight: 600; color: #059669;">1.488 sinh viên được nhận</div>
      </div>

      <div style="border: 1px solid #BFDBFE; border-radius: 10px; padding: 14px; background: #F8FBFE;">
        <div style="font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">NĂM HỌC 2023-2024</div>
        <div style="font-size: 18px; font-weight: 900; color: #0B4899; margin-bottom: 4px;">11.849.125.000 đ</div>
        <div style="font-size: 11.5px; font-weight: 600; color: #059669;">1.717 sinh viên được nhận</div>
      </div>

      <div style="border: 1px solid #BFDBFE; border-radius: 10px; padding: 14px; background: #F8FBFE;">
        <div style="font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">NĂM HỌC 2024-2025</div>
        <div style="font-size: 18px; font-weight: 900; color: #0B4899; margin-bottom: 4px;">15.789.312.500 đ</div>
        <div style="font-size: 11.5px; font-weight: 600; color: #059669;">1.386 sinh viên được nhận</div>
      </div>

      <div style="border: 1px solid #BFDBFE; border-radius: 10px; padding: 14px; background: #F8FBFE;">
        <div style="font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">HỌC KỲ I NĂM HỌC 2025-2026</div>
        <div style="font-size: 18px; font-weight: 900; color: #0B4899; margin-bottom: 4px;">8.168.650.913 đ</div>
        <div style="font-size: 11.5px; font-weight: 600; color: #059669;">898 sinh viên được nhận</div>
      </div>
    </div>

    <!-- Green Callout for exchange students -->
    <div style="border: 1px solid #A7F3D0; background: #ECFDF5; border-radius: 10px; padding: 12px 16px; font-size: 12px; color: #065F46; line-height: 1.5;">
      <strong style="text-transform: uppercase; display: block; margin-bottom: 4px;">LƯU Ý ĐỐI VỚI SINH VIÊN THAM GIA CHƯƠNG TRÌNH TRAO ĐỔI:</strong>
      Sinh viên học chương trình trao đổi tại các đơn vị đối tác của Trường thì phải nộp kết quả học tập và rèn luyện của học kỳ đó (hoặc minh chứng tương đương do đơn vị đối tác cấp về Trường thông qua Phòng Hợp tác và Phát triển sinh viên) để thực hiện xét quy đổi và công nhận kết quả.<br/>
      Nếu sinh viên có nhu cầu đăng ký đề cử, cấp học bổng (trong đợt bổ sung) thì nộp bảng điểm học tập, bảng điểm rèn luyện (đã được Trường quy đổi và công nhận) cho Khoa và Phòng Công tác sinh viên.
    </div>
  </div>
</div>
`;

// Update db for "dh-kkht-ket-qua-cao"
const item = db.scholarships.find(s => s.id === 'dh-kkht-ket-qua-cao');
if (item) {
  item.title = 'HỌC BỔNG KHUYẾN KHÍCH HỌC TẬP CHO SINH VIÊN ĐẠT KẾT QUẢ CAO TRONG HỌC TẬP VÀ RÈN LUYỆN';
  item.htmlContent = kkhtHtml;
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Updated db.json with exact KKHT layout matching screenshot!');
