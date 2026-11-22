import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.txt',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.zip',
  '.rar',
]);

const IMAGE_MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy tệp tải lên' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Kích thước tệp vượt quá giới hạn cho phép (20MB)' },
        { status: 400 }
      );
    }

    const originalName = path.basename(file.name);
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Định dạng tệp (${ext}) không được hỗ trợ` },
        { status: 400 }
      );
    }

    const baseName = path
      .basename(originalName, ext)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    const safeFileName = `${baseName || 'tai_lieu_due'}_${Date.now()}${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let fileUrl = `/files/${safeFileName}`;

    try {
      const uploadDir = path.join(process.cwd(), 'public', 'files');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, safeFileName);
      fs.writeFileSync(filePath, buffer);
    } catch (_) {
      // On serverless read-only filesystem (e.g. Vercel), convert images/files to base64 data URI
      const mime = IMAGE_MIME_MAP[ext] || file.type || 'application/octet-stream';
      fileUrl = `data:${mime};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      ok: true,
      success: true,
      fileName: originalName,
      attachmentName: originalName,
      url: fileUrl,
      attachmentUrl: fileUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Tải tệp lên thất bại' }, { status: 500 });
  }
}
