'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Image as ImageIcon,
  Table,
  Quote,
  Code,
  Eye,
  Heading2,
  Heading3,
  Undo2,
  Redo2,
  Eraser,
  Palette,
  Globe,
  Upload,
  X,
  Check,
  Sparkles,
} from 'lucide-react';

interface WordPressEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onFirstImageInserted?: (dataUrl: string) => void;
  minHeight?: number;
}

export function compressImageFile(file: File, maxWidth = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(ev.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      img.onerror = reject;
      img.src = ev.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const WordPressEditor: React.FC<WordPressEditorProps> = ({
  value,
  onChange,
  placeholder = 'Bắt đầu viết nội dung bài viết tại đây (Có thể dán trực tiếp văn bản và hình ảnh từ Word)...',
  onFirstImageInserted,
  minHeight = 380,
}) => {
  const [mode, setMode] = useState<'visual' | 'html'>('visual');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [imgCaption, setImgCaption] = useState('');
  const [imgPreviewError, setImgPreviewError] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Check if value is a full standalone <!DOCTYPE html> document
  const isFullStandaloneHtml =
    /<!DOCTYPE\s+html/i.test(value || '') || /<html[\s>]/i.test(value || '');

  useEffect(() => {
    if (isFullStandaloneHtml && mode === 'visual') {
      setMode('html');
    }
  }, [isFullStandaloneHtml]);

  // Sync external value into contentEditable div when switching to visual mode or loading new item
  useEffect(() => {
    if (mode === 'visual' && editorRef.current) {
      if (!isInternalChange.current) {
        const currentDom = editorRef.current.innerHTML;
        if (currentDom !== (value || '')) {
          editorRef.current.innerHTML = value || '';
        }
      }
      isInternalChange.current = false;
    }
  }, [value, mode]);

  const emitChange = () => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    onChange(editorRef.current.innerHTML);
  };

  const exec = (command: string, arg?: string) => {
    if (mode !== 'visual' || !editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, arg);
    emitChange();
  };

  const handleInsertLink = () => {
    const url = window.prompt('Nhập đường dẫn liên kết (URL):', 'https://');
    if (url && url !== 'https://') {
      exec('createLink', url);
    }
  };

  const handleInsertTable = () => {
    const rows = Number(window.prompt('Số dòng của bảng:', '3')) || 3;
    const cols = Number(window.prompt('Số cột của bảng:', '3')) || 3;
    let tableHtml =
      '<table style="width:100%; border-collapse:collapse; margin:14px 0; font-size:14.5px;"><thead><tr>';
    for (let c = 1; c <= cols; c++) {
      tableHtml += `<th style="background:#eef4fb; color:#0d3f73; font-weight:700; padding:10px 12px; border:1px solid #d8e2ee; text-align:left;">Tiêu đề cột ${c}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 1; r < rows; r++) {
      tableHtml += '<tr>';
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td style="padding:10px 12px; border:1px solid #d8e2ee;">Nội dung</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br/></p>';
    exec('insertHTML', tableHtml);
  };

  const handleInsertCallout = () => {
    const boxHtml = `<blockquote style="background:#eef4fb; border-left:4px solid #165fa8; padding:12px 16px; border-radius:0 10px 10px 0; margin:14px 0; color:#0d3f73; font-weight:600;">Nhập nội dung lưu ý hoặc trích dẫn quan trọng tại đây...</blockquote><p><br/></p>`;
    exec('insertHTML', boxHtml);
  };

  const handleFilesSelected = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploadingImg(true);
    try {
      let insertedHtml = '';
      let firstUrl = '';
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (!f.type.startsWith('image/')) continue;
        const caption = window.prompt(
          `Chú thích dưới ảnh "${f.name}" (Có thể bỏ trống):`,
          ''
        );
        const dataUrl = await compressImageFile(f);
        if (!firstUrl) firstUrl = dataUrl;
        insertedHtml += `<figure style="margin:16px 0; text-align:center;"><img src="${dataUrl}" alt="${(caption || f.name).replace(/"/g, '&quot;')}" style="max-width:100%; height:auto; border-radius:10px; box-shadow:0 4px 14px rgba(13,63,115,0.1); display:inline-block;" />${
          caption
            ? `<figcaption style="font-size:13.5px; color:#5b6b7c; font-style:italic; margin-top:6px;">${caption}</figcaption>`
            : ''
        }</figure><p><br/></p>`;
      }

      if (firstUrl && onFirstImageInserted) {
        onFirstImageInserted(firstUrl);
      }

      if (mode === 'visual' && editorRef.current) {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, insertedHtml);
        emitChange();
      } else {
        onChange((value || '') + '\n' + insertedHtml);
      }
    } catch (e) {
      console.error(e);
      window.alert('Không thể chèn ảnh, vui lòng thử lại.');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleInsertFromUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = imgUrl.trim();
    if (!cleanUrl) {
      window.alert('Vui lòng nhập đường dẫn URL của hình ảnh.');
      return;
    }

    const captionText = imgCaption.trim();
    const escapedCaption = captionText.replace(/"/g, '&quot;');
    const figureHtml = `<figure style="margin:16px 0; text-align:center;"><img src="${cleanUrl}" alt="${escapedCaption || 'Hình ảnh bài viết'}" style="max-width:100%; height:auto; border-radius:10px; box-shadow:0 4px 14px rgba(13,63,115,0.1); display:inline-block;" />${captionText ? `<figcaption style="font-size:13.5px; color:#5b6b7c; font-style:italic; margin-top:6px;">${captionText}</figcaption>` : ''}</figure><p><br/></p>`;

    if (onFirstImageInserted) {
      onFirstImageInserted(cleanUrl);
    }

    if (mode === 'visual' && editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, figureHtml);
      emitChange();
    } else {
      onChange((value || '') + '\n' + figureHtml);
    }

    setImgUrl('');
    setImgCaption('');
    setImgPreviewError(false);
    setShowUrlDialog(false);
  };

  // Support pasting images directly from clipboard / Word / Screenshot
  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) imageFiles.push(file);
      }
    }
    if (imageFiles.length > 0) {
      e.preventDefault();
      await handleFilesSelected(imageFiles);
    }
  };

  return (
    <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-xs">
      {/* Top WordPress Bar: Add Media + Visual / Code Tabs */}
      <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Button 1: Chèn từ URL (Khuyên dùng - Cực nhẹ CSDL) */}
          <button
            type="button"
            onClick={() => {
              setImgPreviewError(false);
              setShowUrlDialog(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f9145] hover:bg-[#0c7437] text-white text-xs font-bold shadow-2xs cursor-pointer transition-colors"
            title="Chèn ảnh từ đường link URL (Khuyên dùng - Không tốn dung lượng CSDL)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Chèn link ảnh (URL - Nhẹ nhất)</span>
          </button>

          {/* Button 2: Tải ảnh từ máy tính (Upload) */}
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold shadow-2xs cursor-pointer transition-colors" title="Tải tệp ảnh trực tiếp từ máy tính">
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>{uploadingImg ? 'Đang xử lý ảnh...' : 'Tải từ máy tính'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) handleFilesSelected(e.target.files);
                e.target.value = '';
              }}
              disabled={uploadingImg}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleInsertTable}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold cursor-pointer transition-colors"
            title="Chèn bảng biểu"
          >
            <Table className="w-3.5 h-3.5 text-blue-600" />
            <span>Chèn bảng</span>
          </button>

          <button
            type="button"
            onClick={handleInsertCallout}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold cursor-pointer transition-colors"
            title="Chèn hộp ghi chú nổi bật"
          >
            <Quote className="w-3.5 h-3.5 text-orange-500" />
            <span>Hộp lưu ý</span>
          </button>
        </div>

        {/* Mode Switch Tabs like WordPress: Trực quan (Visual) | Mã HTML (Text) */}
        <div className="inline-flex rounded-lg bg-slate-200 p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              if (isFullStandaloneHtml) {
                if (
                  !window.confirm(
                    'Nội dung hiện tại là một trang HTML độc lập (có thẻ <!DOCTYPE html>). Chuyển sang Trực quan có thể lược bỏ phần <head>. Bạn có muốn chuyển không?'
                  )
                ) {
                  return;
                }
              }
              setMode('visual');
            }}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
              mode === 'visual'
                ? 'bg-white text-[#165fa8] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Trực quan (Như Word)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('html')}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
              mode === 'html'
                ? 'bg-white text-[#165fa8] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Mã HTML</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar (Only in Visual Mode) */}
      {mode === 'visual' && (
        <div className="bg-slate-50 border-b border-slate-200 px-2.5 py-1.5 flex flex-wrap items-center gap-1 text-slate-700">
          <button
            type="button"
            onClick={() => exec('formatBlock', 'H2')}
            className="p-1.5 rounded hover:bg-slate-200 font-bold text-xs inline-flex items-center gap-0.5 cursor-pointer"
            title="Tiêu đề lớn (H2)"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('formatBlock', 'H3')}
            className="p-1.5 rounded hover:bg-slate-200 font-bold text-xs inline-flex items-center gap-0.5 cursor-pointer"
            title="Tiêu đề mục (H3)"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('formatBlock', 'P')}
            className="px-2 py-1 rounded hover:bg-slate-200 font-bold text-xs cursor-pointer"
            title="Đoạn văn thường"
          >
            Đoạn văn
          </button>

          <div className="w-[1px] h-5 bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => exec('bold')}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="In đậm (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('italic')}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="In nghiêng (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('underline')}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="Gạch chân (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>

          {/* Brand Color Pickers */}
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-slate-200 ml-1">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <button
              type="button"
              onClick={() => exec('foreColor', '#0d3f73')}
              className="w-4 h-4 rounded-full bg-[#0d3f73] border border-white shadow-2xs cursor-pointer"
              title="Màu Xanh dương DUE"
            />
            <button
              type="button"
              onClick={() => exec('foreColor', '#f26522')}
              className="w-4 h-4 rounded-full bg-[#f26522] border border-white shadow-2xs cursor-pointer"
              title="Màu Cam DUE"
            />
            <button
              type="button"
              onClick={() => exec('foreColor', '#0f9145')}
              className="w-4 h-4 rounded-full bg-[#0f9145] border border-white shadow-2xs cursor-pointer"
              title="Màu Xanh lá DUE"
            />
            <button
              type="button"
              onClick={() => exec('foreColor', '#1f2d3d')}
              className="w-4 h-4 rounded-full bg-[#1f2d3d] border border-white shadow-2xs cursor-pointer"
              title="Màu Đen mặc định"
            />
          </div>

          <div className="w-[1px] h-5 bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => exec('insertUnorderedList')}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="Danh sách chấm đầu dòng"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('insertOrderedList')}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="Danh sách đánh số 1, 2, 3"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => exec('justifyLeft')}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="Căn trái"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('justifyCenter')}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="Căn giữa"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('justifyRight')}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="Căn phải"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('justifyFull')}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="Căn đều 2 bên"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={handleInsertLink}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="Gắn link liên kết"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('removeFormat')}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="Xóa định dạng thừa"
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('undo')}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="Hoàn tác (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('redo')}
            className="p-1.5 rounded hover:bg-slate-200 cursor-pointer"
            title="Làm lại (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Body */}
      {mode === 'visual' ? (
        <div className="relative">
          {!value && (
            <div className="absolute top-4 left-5 right-5 text-slate-400 text-sm pointer-events-none select-none">
              {placeholder}
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={emitChange}
            onBlur={emitChange}
            onPaste={handlePaste}
            style={{ minHeight: `${minHeight}px` }}
            className="p-5 focus:outline-none text-[15px] text-slate-800 leading-relaxed due-popup-html-content max-h-[560px] overflow-y-auto"
          />
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <span>
              💡 <strong>Mẹo tối ưu:</strong> Bấm nút xanh lá <strong>&ldquo;Chèn link ảnh (URL - Nhẹ nhất)&rdquo;</strong> để bài viết siêu nhẹ (chỉ ~100 bytes), trang tải cực nhanh và không bao giờ lo đầy dung lượng CSDL.
            </span>
            <span>Chế độ: Soạn thảo trực quan</span>
          </div>
        </div>
      ) : (
        <div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight: `${minHeight}px` }}
            placeholder="Dán mã HTML hoặc trang <!DOCTYPE html> hoàn chỉnh tại đây..."
            className="w-full p-4 font-mono text-xs bg-slate-950 text-emerald-400 focus:outline-none leading-relaxed"
            spellCheck={false}
          />
          <div className="px-4 py-2 bg-slate-900 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Chế độ: Mã nguồn HTML (Hỗ trợ cả đoạn HTML lẻ và trang &lt;!DOCTYPE html&gt; hoàn chỉnh)</span>
          </div>
        </div>
      )}

      {/* Modal / Dialog Chèn link ảnh URL */}
      {showUrlDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0d3f73] to-[#165fa8] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-300" />
                <h3 className="font-bold text-sm">Chèn hình ảnh từ đường dẫn URL (Web)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUrlDialog(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleInsertFromUrl} className="p-5 space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Giải pháp tối ưu dung lượng cơ sở dữ liệu
                </p>
                <p className="text-[11.5px] leading-relaxed text-emerald-900/90">
                  Dán link ảnh trực tiếp từ web (như trang DUE <code>due.udn.vn</code>, Google Drive, Cloudinary, Imgur, v.v.) chỉ tốn <strong>~50 - 100 bytes</strong> văn bản thay vì lưu hàng trăm KB base64 vào CSDL, giúp hệ thống luôn nhẹ và chạy mượt mà!
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đường dẫn ảnh (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  autoFocus
                  value={imgUrl}
                  onChange={(e) => {
                    setImgUrl(e.target.value);
                    setImgPreviewError(false);
                  }}
                  placeholder="VD: https://due.udn.vn/Portals/0/...jpg hoặc https://..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chú thích hiển thị dưới ảnh (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={imgCaption}
                  onChange={(e) => setImgCaption(e.target.value)}
                  placeholder="VD: Lễ trao học bổng Hạt giống tốt lành tiếp sức sinh viên DUE"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Live Preview if url provided */}
              {imgUrl.trim() && (
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500">Xem trước hiển thị:</div>
                  <div className="max-h-48 overflow-hidden rounded-lg bg-white border border-slate-200 flex items-center justify-center p-2">
                    <img
                      src={imgUrl.trim()}
                      alt="Xem trước"
                      onError={() => setImgPreviewError(true)}
                      className="max-h-44 max-w-full object-contain rounded"
                    />
                  </div>
                  {imgPreviewError ? (
                    <p className="text-[11px] text-amber-600 font-medium">
                      ⚠️ Không thể tải trước ảnh từ link này. Nếu đây là link ảnh công khai hợp lệ, bạn vẫn có thể bấm chèn.
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Đường link ảnh xem trước thành công!
                    </p>
                  )}
                  {imgCaption.trim() && (
                    <p className="text-center text-[11px] text-slate-500 italic mt-1">
                      {imgCaption.trim()}
                    </p>
                  )}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUrlDialog(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!imgUrl.trim()}
                  className="px-4 py-2 rounded-xl bg-[#165fa8] hover:bg-[#0d3f73] disabled:opacity-50 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
                >
                  Chèn vào bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
