# CỔNG THÔNG TIN HỌC BỔNG – TRƯỜNG ĐẠI HỌC KINH TẾ, ĐẠI HỌC ĐÀ NẴNG (DUE)

Hệ thống tra cứu, quản lý và công bố thông tin học bổng dành cho người học tại Trường Đại học Kinh tế – Đại học Đà Nẵng.

## 🚀 Công nghệ sử dụng
- **Framework:** Next.js 14 (App Router)
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Cơ sở dữ liệu:** Firebase Cloud Firestore (`hbclinh`) kết hợp bộ đệm dự phòng
- **Triển khai:** Vercel

## 📦 Cấu trúc dự án
- `src/app`: Các trang công khai (Trang chủ, Chi tiết học bổng, Thông báo, Hướng dẫn, Liên hệ) và Bảng điều khiển Quản trị (`/admin`)
- `src/components`: Các thành phần giao diện (Header, Banner DUE, Cột 6 nhóm học bổng, Modal chi tiết, FAQ, Tin tức, Footer)
- `src/lib`: Cấu hình Firebase (`firebase.ts`), xử lý dữ liệu (`db.ts`), xác thực quản trị (`auth.ts`)
- `data`: Bản lưu trữ dự phòng (`db.json`)
- `scripts`: Các công cụ đồng bộ dữ liệu Firebase

## 🛠️ Cài đặt & Khởi chạy

```bash
# Cài đặt thư viện
npm install

# Chạy môi trường phát triển
npm run dev

# Biên dịch sản xuất
npm run build
npm run start
```
