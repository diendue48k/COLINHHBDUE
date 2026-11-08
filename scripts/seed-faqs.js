const fs = require('fs');

const faqs = [
  {
    id: 'faq-1',
    category: 'dai-hoc',
    categoryLabel: 'Học bổng ĐH',
    question: 'Điều kiện xét cấp Học bổng Khuyến khích học tập (KKHT) tại DUE là gì?',
    answerHtml: '<p class="mb-2">Học bổng Khuyến khích học tập được xét và cấp theo từng học kỳ dựa trên 02 tiêu chí chính:</p><ul class="list-disc pl-5 space-y-1 mb-2"><li><strong>Kết quả học tập (GPA):</strong> Điểm trung bình chung học kỳ từ 2.5/4.0 trở lên, không có học phần nào bị điểm F và hoàn thành tối thiểu 14 tín chỉ trong kỳ chính.</li><li><strong>Kết quả rèn luyện:</strong> Đạt loại Khá trở lên (từ 65 điểm rèn luyện).</li></ul><p class="text-slate-600">Mức học bổng gồm 3 hạng: Xuất sắc (120% học phí trần), Giỏi (100% học phí trần) và Khá (80% học phí trần), được xét từ cao xuống thấp theo ngân sách của từng Khoa/Chương trình đào tạo.</p>',
    order: 1,
    isActive: true
  },
  {
    id: 'faq-2',
    category: 'chung',
    categoryLabel: 'Thông tin chung',
    question: 'Sinh viên có thể nhận đồng thời nhiều loại học bổng trong cùng một học kỳ không?',
    answerHtml: '<p class="mb-2">Theo quy định hiện hành của Trường Đại học Kinh tế – ĐHĐN:</p><ul class="list-disc pl-5 space-y-1 mb-2"><li>Sinh viên <strong>được phép nhận đồng thời</strong> Học bổng Khuyến khích học tập của Nhà trường và Học bổng từ các Doanh nghiệp, Đơn vị tài trợ ngoài trường (trừ trường hợp nhà tài trợ có quy định riêng loại trừ).</li><li>Đối với các học bổng do Quỹ học bổng DUE hoặc Doanh nghiệp cùng đối tác cấp, Hội đồng xét cấp sẽ ưu tiên phân bổ cơ hội cho nhiều sinh viên có hoàn cảnh và thành tích khác nhau.</li></ul>',
    order: 2,
    isActive: true
  },
  {
    id: 'faq-3',
    category: 'ho-so',
    categoryLabel: 'Hồ sơ & quy trình',
    question: 'Quy trình và thời gian nhận tiền học bổng sau khi có quyết định chính thức?',
    answerHtml: '<p class="mb-2">Quy trình chi trả học bổng tại DUE được thực hiện hoàn toàn tự động và minh bạch:</p><ol class="list-decimal pl-5 space-y-1 mb-2"><li>Sau khi Hội đồng ban hành Quyết định chính thức và hết thời gian khiếu nại (05 ngày làm việc), danh sách được chuyển sang Phòng Kế hoạch - Tài chính.</li><li>Nhà trường chuyển khoản trực tiếp học bổng vào <strong>Tài khoản Ngân hàng (BIDV/Vietinbank)</strong> liên kết mã sinh viên.</li><li>Thời gian nhận: Thường từ 7 – 15 ngày làm việc kể từ ngày ra quyết định chi trả.</li></ol>',
    order: 3,
    isActive: true
  },
  {
    id: 'faq-4',
    category: 'dai-hoc',
    categoryLabel: 'Học bổng ĐH',
    question: 'Học bổng Tinh hoa (DUE – Elite) dành cho đối tượng nào và giá trị bao nhiêu?',
    answerHtml: '<p class="mb-2"><strong>Học bổng Tinh hoa DUE – Elite</strong> là chương trình học bổng danh giá bậc nhất dành cho:</p><ul class="list-disc pl-5 space-y-1 mb-2"><li>Tân sinh viên trúng tuyển thẳng hoặc đạt giải Học sinh giỏi Quốc gia, thủ khoa đầu vào các khối ngành.</li><li>Sinh viên xuất sắc duy trì GPA tích lũy từ 3.6/4.0 trở lên, có bài báo khoa học hoặc giải thưởng NCKH cấp Bộ/ĐHĐN.</li></ul><p>Mức trao thưởng: <strong>100% học phí toàn khóa</strong> cùng trợ cấp sinh hoạt phí và ưu tiên tham gia các chương trình trao đổi quốc tế.</p>',
    order: 4,
    isActive: true
  },
  {
    id: 'faq-5',
    category: 'sau-dai-hoc',
    categoryLabel: 'Học bổng SĐH',
    question: 'Chương trình học bổng Nhà nghiên cứu trẻ và Nhà khoa học sau đại học có yêu cầu gì?',
    answerHtml: '<p class="mb-2">Dành cho học viên cao học và nghiên cứu sinh định hướng nghiên cứu tại DUE:</p><ul class="list-disc pl-5 space-y-1 mb-2"><li>Học viên cao học: Có công bố bài báo khoa học thuộc danh mục Scopus/WoS hoặc tạp chí khoa học tính điểm của HĐGSNN; duy trì GPA &ge; 3.2.</li><li>Nghiên cứu sinh: Được hỗ trợ từ 50% đến 100% học phí kèm gói tài trợ nghiên cứu từ 30 – 100 triệu VNĐ khi có bài báo Q1/Q2 quốc tế.</li></ul>',
    order: 5,
    isActive: true
  },
  {
    id: 'faq-6',
    category: 'mien-giam',
    categoryLabel: 'Miễn giảm học phí & Trợ cấp',
    question: 'Hồ sơ xin miễn giảm học phí và trợ cấp xã hội theo Nghị định 81/2021/NĐ-CP gồm những gì?',
    answerHtml: '<p class="mb-2">Sinh viên chuẩn bị hồ sơ nộp về Phòng CTSV vào đầu mỗi học kỳ, gồm:</p><ul class="list-disc pl-5 space-y-1 mb-2"><li>Đơn đề nghị miễn, giảm học phí (theo mẫu quy định của Bộ GD&ĐT).</li><li>Bản sao có chứng thực Giấy chứng nhận hộ nghèo / cận nghèo năm hiện hành (đối với diện hộ nghèo).</li><li>Giấy xác nhận con thương binh, bệnh binh, liệt sĩ hoặc quyết định trợ cấp xã hội (nếu thuộc diện bảo trợ).</li><li>Căn cước công dân và Giấy khai sinh bản sao chứng thực.</li></ul>',
    order: 6,
    isActive: true
  },
  {
    id: 'faq-7',
    category: 'quoc-te',
    categoryLabel: 'Quốc tế & Du học',
    question: 'Sinh viên DUE có cơ hội nhận học bổng trao đổi quốc tế hoặc chuyển tiếp như thế nào?',
    answerHtml: '<p class="mb-2">DUE hợp tác với hơn 50 trường đại học hàng đầu tại Anh, Mỹ, Úc, Pháp, Hàn Quốc, Nhật Bản:</p><ul class="list-disc pl-5 space-y-1 mb-2"><li><strong>Học bổng Erasmus+ (Châu Âu):</strong> Tài trợ 100% vé máy bay và sinh hoạt phí 850 EUR/tháng cho 1 học kỳ trao đổi.</li><li><strong>Học bổng Chuyển tiếp quốc tế (Top-up):</strong> Miễn giảm từ 20% – 50% học phí tại Đại học Hull, Northampton (UK), George Mason (USA).</li><li>Điều kiện cơ bản: GPA từ 3.0/4.0 trở lên và chứng chỉ tiếng Anh IELTS &ge; 6.0.</li></ul>',
    order: 7,
    isActive: true
  },
  {
    id: 'faq-8',
    category: 'ho-so',
    categoryLabel: 'Hồ sơ & quy trình',
    question: 'Tôi có thể theo dõi và nộp hồ sơ học bổng trực tuyến ở đâu?',
    answerHtml: '<p class="mb-2">Sinh viên có thể nộp hồ sơ hoàn toàn trực tuyến:</p><ul class="list-disc pl-5 space-y-1 mb-2"><li>Truy cập Cổng thông tin học bổng DUE, bấm vào chương trình học bổng bạn quan tâm để tải mẫu đơn đăng ký.</li><li>Nộp trực tuyến qua <strong>Hệ thống quản lý sinh viên DUE Portal (sinhvien.due.udn.vn)</strong> hoặc nộp bản cứng tại Phòng Công tác Sinh viên (Phòng H214).</li><li>Mọi thắc mắc sinh viên có thể gửi câu hỏi qua form hỗ trợ hoặc liên hệ Hotline: <strong>0236 3956 397</strong>.</li></ul>',
    order: 8,
    isActive: true
  }
];

const dbPath = './data/db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
db.faqs = faqs;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Seeded ' + db.faqs.length + ' faqs into db.json successfully');
