# -*- coding: utf-8 -*-
import docx
import os
import json
import re
from docx.text.paragraph import Paragraph
from docx.table import Table

DOCX_PATH = r"C:\Users\ASUS\Downloads\2026.11.10 - GIỚI THIỆU HỌC BỔNG CHÍNH SÁCH TẠI DUE (1) - Copy.docx"
OUTPUT_DIR = r"d:\CÔ LINH HBDUE\public\scholarships-html"
os.makedirs(OUTPUT_DIR, exist_ok=True)

HTML_STYLE = """<style>
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
    font-family: "Segoe UI", Arial, sans-serif;
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
    padding: 72px 20px 78px;
    background: linear-gradient(
        120deg,
        #063968,
        #0876b9 65%,
        #269b63
    );
    color: white;
}

.banner::before,
.banner::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,.07);
    pointer-events: none;
}

.banner::before {
    width: 380px;
    height: 380px;
    top: -200px;
    right: 5%;
}

.banner::after {
    width: 300px;
    height: 300px;
    bottom: -200px;
    left: 5%;
}

.banner-content {
    position: relative;
    z-index: 1;
    max-width: 950px;
    margin: auto;
    text-align: center;
}

.banner h1 {
    font-size: clamp(28px, 4.5vw, 44px);
    line-height: 1.35;
    font-weight: 800;
    text-transform: uppercase;
}

.banner h1 span {
    color: #ffb45e;
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
    padding: 17px 25px;
    color: #536579;
    text-decoration: none;
    font-size: 14px;
    font-weight: 800;
    transition: .25s;
    text-align: center;
}

.tab-link:hover {
    color: var(--blue);
    background: #f3f8fd;
}

.tab-link.active {
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
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    display: inline-grid;
    place-items: center;
    border-radius: 50%;
    background: #edf3f8;
    color: var(--blue);
    font-size: 13px;
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
    font-size: 16px;
    text-align: justify;
}

/* ================= CÁC ĐỀ MỤC ================= */
section {
    padding: 55px 0;
    scroll-margin-top: 85px;
}

.section-heading {
    margin-bottom: 30px;
}

.section-heading h2 {
    font-size: 26px;
    color: var(--dark-blue);
    line-height: 1.5;
    text-transform: uppercase;
}

.section-heading .line {
    width: 65px;
    height: 4px;
    background: var(--orange);
    margin-top: 13px;
    border-radius: 5px;
}

/* ================= ĐỀ MỤC 1 ================= */
.criteria-section {
    background: #eaf3fb;
}

.object-box {
    padding: 20px 23px;
    background: white;
    border-left: 5px solid var(--green);
    border-radius: 10px;
    margin-bottom: 25px;
    font-size: 15px;
}

.object-box strong {
    color: var(--blue);
}

/* ================= BẢNG HỌC BỔNG ================= */
.table-wrapper {
    overflow-x: auto;
    border-radius: 13px;
    background: white;
    box-shadow: 0 8px 25px rgba(0,50,100,.06);
    margin-bottom: 24px;
}

table {
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;
}

thead th {
    background: var(--dark-blue);
    color: white;
    padding: 16px 15px;
    text-align: left;
    font-size: 14.5px;
    font-weight: 700;
}

tbody td {
    padding: 16px 15px;
    vertical-align: top;
    border-bottom: 1px solid #e6edf4;
    font-size: 14px;
}

tbody tr:last-child td {
    border-bottom: none;
}

tbody tr:hover {
    background: #f7fbff;
}

tbody ul {
    padding-left: 20px;
}

tbody li {
    margin-bottom: 8px;
    text-align: justify;
}

.level {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 7px;
    font-weight: 800;
    white-space: nowrap;
    font-size: 13px;
}

.level-100 {
    background: #fff0df;
    color: #d86a0b;
}

.level-75 {
    background: #e4f7ed;
    color: #16824b;
}

.level-50 {
    background: #e6f1ff;
    color: #07549b;
}

.level-25 {
    background: #f0eaff;
    color: #7650ae;
}

/* ================= YÊU CẦU ================= */
.requirement {
    margin-top: 25px;
    padding: 23px 25px;
    background: #fff7e9;
    border-left: 5px solid var(--orange);
    border-radius: 11px;
}

.requirement h3 {
    color: #b95e09;
    font-size: 16px;
    margin-bottom: 8px;
    font-weight: 800;
}

.requirement p {
    font-size: 14px;
    text-align: justify;
    line-height: 1.7;
}

/* ================= CHÍNH SÁCH HỖ TRỢ ================= */
.support {
    margin-top: 35px;
}

.support-heading {
    color: var(--blue);
    font-size: 19px;
    margin-bottom: 18px;
    border-bottom: 2px solid #e2eaf1;
    padding-bottom: 10px;
    font-weight: 800;
}

.support-list {
    display: grid;
    gap: 14px;
}

.support-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 16px 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,50,100,.04);
}

.support-icon {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: var(--light-blue);
    font-size: 19px;
}

.support-item:nth-child(2) .support-icon {
    background: #e4f7ed;
}

.support-item:nth-child(3) .support-icon {
    background: #fff0df;
}

.support-item:nth-child(4) .support-icon {
    background: #f0eaff;
}

.support-item:nth-child(5) .support-icon {
    background: #e6f1ff;
}

.support-item p {
    font-size: 14px;
    text-align: justify;
    line-height: 1.65;
}

/* ================= ĐỀ MỤC 2 ================= */
.maintenance-section {
    background: linear-gradient(120deg, #063968, #0876b9);
    color: white;
}

.maintenance-section .section-heading h2 {
    color: white;
}

.maintenance-section .section-heading .line {
    background: #ffb45e;
}

.maintenance-content {
    display: grid;
    gap: 20px;
}

.maintenance-card {
    padding: 25px;
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 13px;
}

.maintenance-card h3 {
    font-size: 18px;
    color: #ffb45e;
    margin-bottom: 10px;
    font-weight: 800;
}

.maintenance-card p {
    font-size: 14.5px;
    color: #edf6ff;
    text-align: justify;
    line-height: 1.7;
}

.maintenance-card ul {
    padding-left: 22px;
    margin-top: 10px;
}

.maintenance-card li {
    font-size: 14.5px;
    color: #edf6ff;
    margin-bottom: 10px;
    text-align: justify;
}

/* ================= ĐIỆN THOẠI ================= */
@media(max-width: 700px) {
    .banner {
        padding: 50px 16px;
    }

    .banner h1 {
        font-size: 26px;
    }

    .tab-list {
        justify-content: flex-start;
        gap: 0;
        overflow-x: auto;
    }

    .tab-link {
        padding: 12px 14px;
        font-size: 12px;
        min-width: max-content;
    }

    section {
        padding: 38px 0;
    }

    .section-heading h2 {
        font-size: 21px;
    }

    .intro-card {
        padding: 20px;
        font-size: 14px;
    }

    .maintenance-card {
        padding: 20px;
    }

    .object-box {
        font-size: 13.5px;
    }
}
</style>"""

HTML_SCRIPT = """<script>
const tabs = document.querySelectorAll(".tab-link");
const sections = [
    document.getElementById("doi-tuong"),
    document.getElementById("nguyen-tac")
].filter(Boolean);

tabs.forEach(tab => {
    tab.addEventListener("click", function() {
        tabs.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
    });
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            tabs.forEach(tab => {
                tab.classList.toggle(
                    "active",
                    tab.getAttribute("href") === "#" + entry.target.id
                );
            });
        }
    });
}, {
    rootMargin: "-90px 0px -55% 0px",
    threshold: 0
});

sections.forEach(section => observer.observe(section));
</script>"""

print("Starting extraction of 21 programs from DOCX...")
doc = docx.Document(DOCX_PATH)
body_elements = list(doc.element.body)

prog_indices = [1, 40, 93, 126, 146, 177, 203, 224, 246, 263, 282, 318, 355, 396, 431, 444, 465, 481, 501, 530, 549, len(body_elements)]

# Load scholarships metadata from db.json
with open("data/db.json", "r", encoding="utf-8") as f:
    db_data = json.load(f)

scholarships_meta = db_data["scholarships"]

def format_banner_title(title_text):
    # Splits title nicely into 2 lines with span on main highlight
    title_clean = title_text.strip()
    title_clean = re.sub(r"^SỐ\s*\d+\.\s*", "", title_clean, flags=re.IGNORECASE)
    
    # Check common prefix patterns
    if "CHƯƠNG TRÌNH PHÁT TRIỂN" in title_clean:
        main_part = title_clean.replace("CHƯƠNG TRÌNH PHÁT TRIỂN", "").strip()
        return f"CHƯƠNG TRÌNH PHÁT TRIỂN<br><span>{main_part}</span>"
    elif "HỌC BỔNG KHUYẾN KHÍCH HỌC TẬP CHO" in title_clean:
        main_part = title_clean.replace("HỌC BỔNG KHUYẾN KHÍCH HỌC TẬP CHO", "").strip()
        return f"HỌC BỔNG KHUYẾN KHÍCH HỌC TẬP<br><span>CHO {main_part}</span>"
    elif "HỌC BỔNG KHUYẾN KHÍCH HỌC TẬP" in title_clean:
        main_part = title_clean.replace("HỌC BỔNG KHUYẾN KHÍCH HỌC TẬP", "").strip()
        return f"HỌC BỔNG KHUYẾN KHÍCH HỌC TẬP<br><span>{main_part}</span>"
    elif "HỌC BỔNG CHƯƠNG TRÌNH" in title_clean:
        main_part = title_clean.replace("HỌC BỔNG CHƯƠNG TRÌNH", "").strip()
        return f"HỌC BỔNG CHƯƠNG TRÌNH<br><span>{main_part}</span>"
    elif "CHÍNH SÁCH HỖ TRỢ" in title_clean:
        main_part = title_clean.replace("CHÍNH SÁCH HỖ TRỢ", "").strip()
        return f"CHÍNH SÁCH HỖ TRỢ<br><span>{main_part}</span>"
    elif "CHÍNH SÁCH MIỄN/GIẢM" in title_clean or "CHÍNH SÁCH MIỄN GIẢM" in title_clean:
        return f"CHÍNH SÁCH<br><span>MIỄN GIẢM HỌC PHÍ & TRỢ CẤP XÃ HỘI</span>"
    elif "HỌC BỔNG" in title_clean:
        parts = title_clean.split("HỌC BỔNG", 1)
        return f"HỌC BỔNG<br><span>{parts[1].strip()}</span>"
    else:
        return f"<span>{title_clean}</span>"

def render_table_html(tbl):
    if len(tbl.rows) == 0:
        return ""
    
    html = ['<div class="table-wrapper">', '<table>']
    
    # Headers
    html.append('<thead><tr>')
    header_cells = tbl.rows[0].cells
    for c in header_cells:
        txt = c.text.strip().replace("\n", " ")
        html.append(f'<th>{txt}</th>')
    html.append('</tr></thead>')
    
    # Body
    html.append('<tbody>')
    for r_idx in range(1, len(tbl.rows)):
        row = tbl.rows[r_idx]
        html.append('<tr>')
        for c_idx, c in enumerate(row.cells):
            cell_txt = c.text.strip()
            
            # Formatting badges if cell is scholarship rate
            if any(badge in cell_txt for badge in ["100%"]):
                content = f'<span class="level level-100">{cell_txt}</span>'
            elif any(badge in cell_txt for badge in ["75%"]):
                content = f'<span class="level level-75">{cell_txt}</span>'
            elif any(badge in cell_txt for badge in ["50%"]):
                content = f'<span class="level level-50">{cell_txt}</span>'
            elif any(badge in cell_txt for badge in ["25%", "20%", "10%"]):
                content = f'<span class="level level-25">{cell_txt}</span>'
            elif "\n" in cell_txt or cell_txt.startswith("-") or cell_txt.startswith("+"):
                lines = [l.strip().lstrip("-+•").strip() for l in cell_txt.split("\n") if l.strip()]
                if len(lines) > 1:
                    content = "<ul>" + "".join([f"<li>{l}</li>" for l in lines]) + "</ul>"
                else:
                    content = cell_txt
            else:
                content = cell_txt
            
            if c_idx == 0 and cell_txt.isdigit():
                html.append(f'<td><strong>{cell_txt}</strong></td>')
            else:
                html.append(f'<td>{content}</td>')
        html.append('</tr>')
    html.append('</tbody></table></div>')
    return "\n".join(html)

generated_html_map = {}

for p_num in range(len(prog_indices) - 1):
    start_idx = prog_indices[p_num]
    end_idx = prog_indices[p_num + 1]
    
    meta = scholarships_meta[p_num] if p_num < len(scholarships_meta) else None
    
    # Collect elements in this range
    prog_elements = []
    for k in range(start_idx, end_idx):
        child = body_elements[k]
        if child.tag.endswith('p'):
            p = Paragraph(child, doc)
            t = p.text.strip()
            if t:
                prog_elements.append(('p', t, p.style.name))
        elif child.tag.endswith('tbl'):
            tbl = Table(child, doc)
            prog_elements.append(('tbl', tbl))
            
    # Extract title
    raw_title = ""
    for item in prog_elements:
        if item[0] == 'p' and not item[1].startswith('SỐ '):
            raw_title = item[1]
            break
            
    if not raw_title and meta:
        raw_title = meta.get("title", "")
        
    clean_title = re.sub(r"^SỐ\s*\d+\.\s*", "", raw_title).strip()
    
    # Extract Intro (either 1x1 table or first intro paragraph before '1. ĐỐI TƯỢNG')
    intro_text = ""
    for item in prog_elements:
        if item[0] == 'tbl':
            tbl = item[1]
            if len(tbl.rows) == 1 and len(tbl.columns) == 1:
                intro_text = tbl.rows[0].cells[0].text.strip()
                break
                
    if not intro_text and meta:
        intro_text = meta.get("intro", "")
        
    # Split elements into Section 1 (ĐỐI TƯỢNG VÀ MỨC CẤP) and Section 2 (NGUYÊN TẮC / DUY TRÌ)
    sec1_items = []
    sec2_items = []
    current_sec = 1
    
    for item in prog_elements:
        if item[0] == 'p':
            t = item[1]
            if t.startswith('SỐ ') or t == raw_title:
                continue
            if any(h in t.upper() for h in ['NGUYÊN TẮC XÉT', 'ĐIỀU KIỆN DUY TRÌ', 'HỒ SƠ VÀ THỦ TỤC']):
                current_sec = 2
                continue
            if any(h in t.upper() for h in ['1. ĐỐI TƯỢNG', 'TIÊU CHUẨN XÉT CẤP', 'ĐỐI TƯỢNG VÀ MỨC']):
                current_sec = 1
                continue
                
        if current_sec == 1:
            # Skip intro table from section 1 body if it was used for intro
            if item[0] == 'tbl' and len(item[1].rows) == 1 and len(item[1].columns) == 1 and intro_text:
                continue
            sec1_items.append(item)
        else:
            sec2_items.append(item)
            
    # Build Section 1 Content
    sec1_html = []
    sec1_html.append('<div class="section-heading">')
    sec1_html.append('<h2>1. ĐỐI TƯỢNG VÀ MỨC CẤP</h2>')
    sec1_html.append('<div class="line"></div>')
    sec1_html.append('</div>')
    
    # Process Sec1 paragraphs & tables
    support_items = []
    requirement_texts = []
    object_box_text = ""
    
    is_support_block = False
    
    for item in sec1_items:
        if item[0] == 'p':
            txt = item[1]
            if "CÁC CHÍNH SÁCH HỖ TRỢ KHÁC" in txt.upper() or "CHÍNH SÁCH HỖ TRỢ KHÁC" in txt.upper():
                is_support_block = True
                continue
            if is_support_block:
                clean_p = txt.lstrip("-+•").strip()
                if clean_p:
                    support_items.append(clean_p)
                continue
                
            if txt.startswith("Đối tượng:") or txt.startswith("- Đối tượng:"):
                object_box_text = txt
            elif "Yêu cầu" in txt and len(txt) < 30:
                continue
            elif txt.startswith("Học viên được miễn") or txt.startswith("Sinh viên được") or "chứng chỉ tiếng Anh" in txt:
                requirement_texts.append(txt)
            else:
                sec1_html.append(f'<p style="margin-bottom: 12px; font-size: 14.5px; text-align: justify;">{txt}</p>')
                
        elif item[0] == 'tbl':
            tbl = item[1]
            # Check if this table is a requirement box (e.g. 1 column with header 'Yêu cầu')
            if len(tbl.columns) == 1 and 'YÊU CẦU' in tbl.rows[0].cells[0].text.upper():
                req_content = tbl.rows[len(tbl.rows)-1].cells[0].text.strip()
                requirement_texts.append(req_content)
            else:
                sec1_html.append(render_table_html(tbl))
                
    # Insert object-box at beginning of sec1 if found
    if object_box_text:
        obj_html = f'<div class="object-box"><strong>{object_box_text}</strong></div>'
        sec1_html.insert(3, obj_html)
    elif meta and meta.get("targetAudience"):
        obj_html = f'<div class="object-box"><strong>Đối tượng thụ hưởng:</strong> {meta.get("targetAudience")}</div>'
        sec1_html.insert(3, obj_html)
        
    # Append requirements if found
    if requirement_texts:
        req_joined = " ".join(requirement_texts)
        sec1_html.append(f'<div class="requirement"><h3>Yêu cầu & Điều kiện</h3><p>{req_joined}</p></div>')
        
    # Append support items if found
    if support_items:
        sec1_html.append('<div class="support">')
        sec1_html.append('<h3 class="support-heading">- Các chính sách hỗ trợ khác:</h3>')
        sec1_html.append('<div class="support-list">')
        icons = ["📚", "🌐", "🔬", "🏛️", "👨‍🏫", "💡"]
        for s_idx, s_txt in enumerate(support_items):
            ic = icons[s_idx % len(icons)]
            sec1_html.append(f'<div class="support-item"><div class="support-icon">{ic}</div><p><strong>+</strong> {s_txt}</p></div>')
        sec1_html.append('</div></div>')
        
    # Build Section 2 Content (NGUYÊN TẮC XÉT, CẤP – ĐIỀU KIỆN DUY TRÌ)
    sec2_html = []
    sec2_html.append('<div class="section-heading">')
    sec2_html.append('<h2>2. NGUYÊN TẮC XÉT, CẤP – ĐIỀU KIỆN DUY TRÌ</h2>')
    sec2_html.append('<div class="line"></div>')
    sec2_html.append('</div>')
    sec2_html.append('<div class="maintenance-content">')
    
    # Process Sec2 elements into maintenance-cards
    card_title = "Nguyên tắc chung"
    card_points = []
    
    for item in sec2_items:
        if item[0] == 'p':
            txt = item[1]
            if txt.endswith(":") or (len(txt) < 50 and not txt.startswith("-")):
                if card_points:
                    sec2_html.append(f'<div class="maintenance-card"><h3>{card_title}</h3><ul>' + "".join([f"<li>{pt}</li>" for pt in card_points]) + '</ul></div>')
                    card_points = []
                card_title = txt.rstrip(":")
            else:
                card_points.append(txt.lstrip("-+•").strip())
        elif item[0] == 'tbl':
            tbl = item[1]
            sec2_html.append(render_table_html(tbl))
            
    if card_points:
        sec2_html.append(f'<div class="maintenance-card"><h3>{card_title}</h3><ul>' + "".join([f"<li>{pt}</li>" for pt in card_points]) + '</ul></div>')
    elif not sec2_items:
        sec2_html.append('<div class="maintenance-card"><h3>Nguyên tắc xét cấp</h3><p>Thực hiện công khai, dân chủ, đúng quy trình theo các văn bản quy định của Bộ Giáo dục & Đào tạo, Đại học Đà Nẵng và Trường Đại học Kinh tế.</p></div>')
        
    sec2_html.append('</div>')
    
    # Build Full HTML Page
    banner_html = format_banner_title(clean_title)
    
    full_html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{clean_title} - DUE</title>
{HTML_STYLE}
</head>

<body>

<!-- ================= BANNER ================= -->
<header class="banner">
    <div class="banner-content">
        <h1>{banner_html}</h1>
    </div>
</header>

<!-- ================= THANH TAB ================= -->
<nav class="tab-navigation">
    <div class="tab-list">
        <a href="#doi-tuong" class="tab-link active">
            <span class="tab-number">01</span>
            1. ĐỐI TƯỢNG VÀ MỨC CẤP
        </a>
        <a href="#nguyen-tac" class="tab-link">
            <span class="tab-number">02</span>
            2. NGUYÊN TẮC XÉT, CẤP – ĐIỀU KIỆN DUY TRÌ
        </a>
    </div>
</nav>

<!-- ================= GIỚI THIỆU ================= -->
<div class="introduction">
    <div class="container">
        <div class="intro-card">
            {intro_text}
        </div>
    </div>
</div>

<!-- ================= ĐỀ MỤC 1 ================= -->
<section class="criteria-section" id="doi-tuong">
<div class="container">
    {"".join(sec1_html)}
</div>
</section>

<!-- ================= ĐỀ MỤC 2 ================= -->
<section class="maintenance-section" id="nguyen-tac">
<div class="container">
    {"".join(sec2_html)}
</div>
</section>

<!-- ================= KẾT THÚC ================= -->
{HTML_SCRIPT}

</body>
</html>"""

    # Save to file
    file_id = f"scholarship-{p_num+1:02d}.html"
    file_path = os.path.join(OUTPUT_DIR, file_id)
    with open(file_path, "w", encoding="utf-8") as out_f:
        out_f.write(full_html)
        
    # Also save with slug if available
    if meta and meta.get("slug"):
        slug_path = os.path.join(OUTPUT_DIR, f"{meta.get('slug')}.html")
        with open(slug_path, "w", encoding="utf-8") as out_s:
            out_s.write(full_html)
            
    generated_html_map[p_num] = full_html
    print(f"[{p_num+1}/21] Generated HTML for: {clean_title} -> {file_id}")

# Update db.json with generated HTML for each scholarship
print("Updating data/db.json with full HTML content...")
for idx, s in enumerate(db_data["scholarships"]):
    if idx in generated_html_map:
        s["introHtml"] = generated_html_map[idx]
        s["htmlContent"] = generated_html_map[idx]

with open("data/db.json", "w", encoding="utf-8") as f:
    json.dump(db_data, f, ensure_ascii=False, indent=2)

print("Successfully updated all 21 scholarships with full HTML templates!")
