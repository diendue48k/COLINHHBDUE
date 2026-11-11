import docx
import json
import re
import os
import html
from docx.oxml.text.paragraph import CT_P
from docx.oxml.table import CT_Tbl
from docx.text.paragraph import Paragraph
from docx.table import Table

DOCX_PATH = r"C:\Users\ASUS\Downloads\2026.11.10 - GIỚI THIỆU HỌC BỔNG CHÍNH SÁCH TẠI DUE (1) - Copy.docx"
OUTPUT_DIR = r"d:\CÔ LINH HBDUE\public\scholarships-html"
DB_PATH = r"d:\CÔ LINH HBDUE\data\db.json"

os.makedirs(OUTPUT_DIR, exist_ok=True)

doc = docx.Document(DOCX_PATH)

# Sequential element collector
elements = []
for child in doc._body._element:
    if isinstance(child, CT_P):
        p = Paragraph(child, doc)
        elements.append(('p', p))
    elif isinstance(child, CT_Tbl):
        tbl = Table(child, doc)
        elements.append(('tbl', tbl))

# Group elements into 21 programs
programs = []
current_prog = None

for elem_type, elem in elements:
    if elem_type == 'p':
        txt = elem.text.strip()
        m = re.match(r'^SỐ\s+(\d+)\.?(.*)$', txt)
        if m:
            if current_prog:
                programs.append(current_prog)
            current_prog = {
                'num': int(m.group(1)),
                'header_txt': txt,
                'title_suffix': m.group(2).strip(),
                'elements': []
            }
            continue
    if current_prog:
        current_prog['elements'].append((elem_type, elem))

if current_prog:
    programs.append(current_prog)

def strip_bullet(t):
    return re.sub(r'^[-+•]\s*', '', t)

def clean_object_text(t):
    return re.sub(r"^-?\s*Đối tượng( thụ hưởng)?:\s*", "", t)

def is_section_heading(text):
    t = text.strip()
    if not t:
        return False
    if t.startswith('HỌC BỔNG BẬC') or t.startswith('CHÍNH SÁCH MIỄN GIẢM TRỢ CẤP') or t.startswith('V. HỌC BỔNG') or t == 'HỌC BỔNG DU HỌC' or t == 'HỌC BỔNG ĐƠN VỊ NGOÀI TRƯỜNG':
        return False
    if re.match(r'^((\d+(\.\d+)*)|[IVXLCDM]+)[\.\)]\s+[A-ZÀ-Ỹ]', t):
        return True
    for kw in ['ĐỐI TƯỢNG VÀ MỨC CẤP', 'ĐỐI TƯỢNG – MỨC CẤP', 'NGUYÊN TẮC XÉT, CẤP', 'NGUYÊN TẮC XÉT, CẤP – ĐIỀU KIỆN DUY TRÌ', 'GHI CHÚ']:
        if kw in t.upper() and len(t) < 70:
            return True
    return False

def clean_tab_title(heading_text, idx):
    t = heading_text.strip()
    m = re.match(r'^((\d+(\.\d+)*)|[IVXLCDM]+)[\.\)]\s*(.*)$', t)
    if m:
        rest = m.group(4).strip()
        return f"{idx + 1}. {rest.upper()}"
    else:
        return f"{idx + 1}. {t.upper()}"

def format_banner_title(title):
    t = title.strip()
    # Check known prefixes
    for prefix in [
        "CHƯƠNG TRÌNH PHÁT TRIỂN",
        "CHƯƠNG TRÌNH HỖ TRỢ",
        "HỌC BỔNG KHUYẾN KHÍCH HỌC TẬP",
        "HỌC BỔNG CHƯƠNG TRÌNH",
        "CHÍNH SÁCH HỖ TRỢ",
        "CHÍNH SÁCH MIỄN/GIẢM",
        "CHÍNH SÁCH MIỄN GIẢM",
        "HỌC BỔNG THEO",
        "HỌC BỔNG"
    ]:
        if t.upper().startswith(prefix) and len(t) > len(prefix):
            p1 = t[:len(prefix)].strip()
            p2 = t[len(prefix):].strip()
            return f"{html.escape(p1)}<br>\n            <span>{html.escape(p2)}</span>"
    
    words = t.split()
    if len(words) > 3:
        mid = len(words) // 2
        p1 = " ".join(words[:mid])
        p2 = " ".join(words[mid:])
        return f"{html.escape(p1)}<br>\n            <span>{html.escape(p2)}</span>"
    return f"<span>{html.escape(t)}</span>"

def render_table(tbl):
    rows_html = []
    is_header = True
    for r_idx, row in enumerate(tbl.rows):
        cells_html = []
        for cell in row.cells:
            cell_txt = cell.text.strip()
            # replace newlines with br or li
            lines = [l.strip() for l in cell_txt.split('\n') if l.strip()]
            if not lines:
                inner = ""
            elif len(lines) > 1 and any(l.startswith('-') or l.startswith('+') or l.startswith('•') for l in lines):
                lis = "".join(f"<li>{html.escape(strip_bullet(l))}</li>" for l in lines)
                inner = f"<ul>{lis}</ul>"
            elif len(lines) > 1:
                inner = "<br>".join(html.escape(l) for l in lines)
            else:
                l = lines[0]
                # Check level badges
                if "100%" in l:
                    inner = f'<span class="level level-100">{html.escape(l)}</span>'
                elif "75%" in l:
                    inner = f'<span class="level level-75">{html.escape(l)}</span>'
                elif "50%" in l:
                    inner = f'<span class="level level-50">{html.escape(l)}</span>'
                elif "25%" in l:
                    inner = f'<span class="level level-25">{html.escape(l)}</span>'
                else:
                    inner = html.escape(l)
            
            tag = "th" if is_header else "td"
            cells_html.append(f"<{tag}>{inner}</{tag}>")
        
        row_str = "<tr>" + "".join(cells_html) + "</tr>"
        if is_header:
            rows_html.append(f"<thead>{row_str}</thead><tbody>")
            is_header = False
        else:
            rows_html.append(row_str)
            
    if not is_header:
        rows_html.append("</tbody>")
    return f'<div class="table-wrapper"><table>{"".join(rows_html)}</table></div>'

# Load existing db.json to get fallback intros
existing_db = json.load(open(DB_PATH, encoding='utf-8'))
scholarships = existing_db.get('scholarships', [])

# Map index 0-20 to scholarship
for prog_idx, prog in enumerate(programs):
    elems = prog['elements']
    
    # 1. Determine Title
    title = prog['title_suffix']
    title_idx = -1
    if not title:
        for i, (etype, elem) in enumerate(elems):
            if etype == 'p':
                ptxt = elem.text.strip()
                if ptxt and not is_section_heading(ptxt) and not ptxt.startswith('HỌC BỔNG BẬC') and not ptxt.startswith('CHÍNH SÁCH MIỄN GIẢM TRỢ CẤP') and not ptxt.startswith('V. HỌC BỔNG') and ptxt != 'HỌC BỔNG DU HỌC' and ptxt != 'HỌC BỔNG ĐƠN VỊ NGOÀI TRƯỜNG':
                    title = ptxt
                    title_idx = i
                    break
    
    # 2. Find all section headings
    section_indices = []
    for i, (etype, elem) in enumerate(elems):
        if i <= title_idx:
            continue
        if etype == 'p':
            ptxt = elem.text.strip()
            if is_section_heading(ptxt):
                section_indices.append((i, ptxt))
                
    if not section_indices:
        section_indices = [(title_idx + 1, "1. ĐỐI TƯỢNG VÀ MỨC CẤP")]

    # 3. Intro elements
    first_sec_idx = section_indices[0][0]
    intro_paragraphs = []
    for i in range(title_idx + 1, first_sec_idx):
        etype, elem = elems[i]
        if etype == 'p':
            ptxt = elem.text.strip()
            if ptxt and not ptxt.startswith('HỌC BỔNG BẬC') and not ptxt.startswith('CHÍNH SÁCH MIỄN GIẢM') and not ptxt.startswith('V. HỌC BỔNG'):
                intro_paragraphs.append(ptxt)
                
    sch_db = scholarships[prog_idx] if prog_idx < len(scholarships) else {}
    if intro_paragraphs:
        intro_text = " ".join(intro_paragraphs)
    else:
        intro_text = sch_db.get('intro') or sch_db.get('description') or f"Chính sách học bổng và hỗ trợ người học tại Trường Đại học Kinh tế – Đại học Đà Nẵng đối với chương trình {title}."

    # 4. Parse sections
    sections = []
    for s_idx, (s_start, s_heading) in enumerate(section_indices):
        s_end = section_indices[s_idx + 1][0] if s_idx + 1 < len(section_indices) else len(elems)
        sec_elems = []
        for j in range(s_start + 1, s_end):
            etype, elem = elems[j]
            if etype == 'p':
                ptxt = elem.text.strip()
                if ptxt.startswith('HỌC BỔNG BẬC') or ptxt.startswith('CHÍNH SÁCH MIỄN GIẢM TRỢ CẤP') or ptxt.startswith('V. HỌC BỔNG') or ptxt == 'HỌC BỔNG DU HỌC' or ptxt == 'HỌC BỔNG ĐƠN VỊ NGOÀI TRƯỜNG':
                    continue
            sec_elems.append((etype, elem))
            
        tab_title = clean_tab_title(s_heading, s_idx)
        slug_id = f"de-muc-{s_idx + 1}"
        sections.append({
            'index': s_idx + 1,
            'heading': tab_title,
            'tab_title': tab_title,
            'id': slug_id,
            'elements': sec_elems
        })

    # Render Sections HTML
    rendered_sections = []
    for s in sections:
        s_idx = s['index']
        s_id = s['id']
        s_title = s['heading']
        
        # Decide section visual theme:
        # Section 1: criteria-section (light blue bg, dark blue heading)
        # Section 2: maintenance-section (gradient bg, white text, maintenance-cards)
        # Section 3+: notes-section (clean white/gray bg, green accents)
        is_maintenance = (s_idx == 2 and ("NGUYÊN TẮC" in s_title.upper() or "DUY TRÌ" in s_title.upper()))
        is_notes = ("GHI CHÚ" in s_title.upper() or s_idx >= 3)
        
        if is_maintenance:
            sec_class = "maintenance-section"
        elif is_notes:
            sec_class = "notes-section"
        else:
            sec_class = "criteria-section"
            
        sec_inner = []
        sec_inner.append(f'<div class="container">')
        sec_inner.append(f'<div class="section-heading"><h2>{html.escape(s_title)}</h2><div class="line"></div></div>')
        
        if is_maintenance:
            sec_inner.append('<div class="maintenance-content">')
            current_card_title = "Nguyên tắc chung"
            current_card_bullets = []
            current_card_ps = []
            
            for etype, elem in s['elements']:
                if etype == 'tbl':
                    sec_inner.append(render_table(elem))
                else:
                    ptxt = elem.text.strip()
                    if not ptxt: continue
                    # check if card header
                    if any(ptxt.startswith(k) for k in ['- Năm thứ', 'Năm thứ', 'Đối với', 'Quy trình', 'Điều kiện duy trì', 'Nguyên tắc', 'Nộp hồ sơ', 'Thời điểm xét']):
                        if current_card_bullets or current_card_ps:
                            sec_inner.append('<div class="maintenance-card">')
                            sec_inner.append(f'<h3>{html.escape(current_card_title)}</h3>')
                            for p in current_card_ps:
                                sec_inner.append(f'<p>{html.escape(p)}</p>')
                            if current_card_bullets:
                                sec_inner.append('<ul>')
                                for b in current_card_bullets:
                                    sec_inner.append(f'<li>{html.escape(b)}</li>')
                                sec_inner.append('</ul>')
                            sec_inner.append('</div>')
                            current_card_bullets = []
                            current_card_ps = []
                        current_card_title = ptxt.lstrip('-+• ')
                    elif ptxt.startswith('-') or ptxt.startswith('+') or ptxt.startswith('•') or ptxt.startswith('Bước'):
                        current_card_bullets.append(re.sub(r'^[-+•]\s*', '', ptxt))
                    else:
                        current_card_ps.append(ptxt)
                        
            if current_card_bullets or current_card_ps or current_card_title:
                sec_inner.append('<div class="maintenance-card">')
                sec_inner.append(f'<h3>{html.escape(current_card_title)}</h3>')
                for p in current_card_ps:
                    sec_inner.append(f'<p>{html.escape(p)}</p>')
                if current_card_bullets:
                    sec_inner.append('<ul>')
                    for b in current_card_bullets:
                        sec_inner.append(f'<li>{html.escape(b)}</li>')
                    sec_inner.append('</ul>')
                sec_inner.append('</div>')
            sec_inner.append('</div>')
            
        elif is_notes:
            sec_inner.append('<div class="notes-card">')
            for etype, elem in s['elements']:
                if etype == 'tbl':
                    sec_inner.append(render_table(elem))
                else:
                    ptxt = elem.text.strip()
                    if not ptxt: continue
                    # convert url to clickable link
                    url_match = re.search(r'(https?://[^\s]+)', ptxt)
                    if url_match:
                        u = url_match.group(1)
                        linked_p = ptxt.replace(u, f'<a href="{u}" target="_blank" rel="noopener noreferrer">{u}</a>')
                        sec_inner.append(f'<p style="margin-bottom: 12px;">{linked_p}</p>')
                    elif ptxt.startswith('-') or ptxt.startswith('+') or ptxt.startswith('•'):
                        clean_b = re.sub(r'^[-+•]\s*', '', ptxt)
                        sec_inner.append(f'<p style="margin-bottom: 8px; padding-left: 15px;">• {html.escape(clean_b)}</p>')
                    else:
                        sec_inner.append(f'<p style="margin-bottom: 12px; font-weight: { "700" if any(r.bold for r in elem.runs) else "normal" };">{html.escape(ptxt)}</p>')
            sec_inner.append('</div>')
            
        else:
            # Criteria / Details section
            support_bullets = []
            for etype, elem in s['elements']:
                if etype == 'tbl':
                    sec_inner.append(render_table(elem))
                else:
                    ptxt = elem.text.strip()
                    if not ptxt: continue
                    if 'Đối tượng:' in ptxt or 'Đối tượng thụ hưởng:' in ptxt or ptxt.startswith('- Đối tượng'):
                        obj_clean = clean_object_text(ptxt)
                        sec_inner.append(f'<div class="object-box"><strong>Đối tượng thụ hưởng:</strong> {html.escape(obj_clean)}</div>')
                    elif 'Yêu cầu:' in ptxt or 'Tiêu chuẩn:' in ptxt or 'Điều kiện:' in ptxt or 'Thời gian hưởng' in ptxt:
                        sec_inner.append(f'<div class="requirement"><h3>Yêu cầu & Điều kiện xét cấp</h3><p>{html.escape(ptxt)}</p></div>')
                    elif 'chính sách hỗ trợ khác' in ptxt.lower():
                        continue
                    elif ptxt.startswith('+') or ptxt.startswith('- Được') or ptxt.startswith('• Được') or 'Được hỗ trợ' in ptxt or 'Được xem xét' in ptxt or 'Được ưu tiên' in ptxt:
                        support_bullets.append(re.sub(r'^[-+•]\s*', '', ptxt))
                    else:
                        sec_inner.append(f'<p style="margin-bottom: 12px; font-size: 14.5px; text-align: justify;">{html.escape(ptxt)}</p>')
                        
            if support_bullets:
                icons = ["📘", "🎓", "🌟", "💡", "🏛️"]
                sec_inner.append('<div class="support"><div class="support-heading">Chính sách hỗ trợ & Quyền lợi khác</div><div class="support-list">')
                for b_idx, b in enumerate(support_bullets):
                    ico = icons[b_idx % len(icons)]
                    sec_inner.append(f'<div class="support-item"><div class="support-icon">{ico}</div><p>{html.escape(b)}</p></div>')
                sec_inner.append('</div></div>')
                
        sec_inner.append('</div>')
        rendered_sections.append(f'<section class="{sec_class}" id="{s_id}">{"".join(sec_inner)}</section>')

    # Render Tabs
    tab_links = []
    for s in sections:
        active_cls = " active" if s['index'] == 1 else ""
        num_str = str(s['index']).zfill(2)
        tab_links.append(f'''
        <a href="#{s['id']}" class="tab-link{active_cls}">
            <span class="tab-number">{num_str}</span>
            {html.escape(s['tab_title'])}
        </a>''')
        
    banner_h1 = format_banner_title(title)
    
    # Complete Document HTML
    full_html = f'''<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{html.escape(title)} - DUE</title>
<link rel="stylesheet" href="/fonts/fonts.css">
<style>
:root {{
    --blue: #07549b;
    --dark-blue: #063968;
    --light-blue: #eaf4ff;
    --orange: #f58220;
    --green: #269b63;
    --text: #243447;
    --muted: #637487;
}}

* {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}}

html {{
    scroll-behavior: smooth;
    scroll-padding-top: 85px;
}}

body {{
    font-family: "SVN-Gilroy", "SVN-Griloy", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    background: #f4f8fc;
    color: var(--text);
    line-height: 1.75;
}}

.container {{
    width: min(1150px, 92%);
    margin: auto;
}}

/* ================= BANNER ================= */
.banner {{
    position: relative;
    overflow: hidden;
    padding: 65px 20px 72px;
    background: linear-gradient(
        120deg,
        #063968,
        #0876b9 65%,
        #269b63
    );
    color: white;
}}

.banner::before,
.banner::after {{
    content: "";
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,.07);
    pointer-events: none;
}}

.banner::before {{
    width: 380px;
    height: 380px;
    top: -200px;
    right: 5%;
}}

.banner::after {{
    width: 300px;
    height: 300px;
    bottom: -200px;
    left: 5%;
}}

.banner-content {{
    position: relative;
    z-index: 1;
    max-width: 950px;
    margin: auto;
    text-align: center;
}}

.banner h1 {{
    font-size: clamp(26px, 4.2vw, 42px);
    line-height: 1.35;
    font-weight: 800;
    text-transform: uppercase;
}}

.banner h1 span {{
    color: #ffb45e;
}}

/* ================= THANH ĐIỀU HƯỚNG ================= */
.tab-navigation {{
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(255,255,255,.98);
    border-bottom: 1px solid #e1eaf2;
    box-shadow: 0 5px 18px rgba(0,45,90,.08);
    backdrop-filter: blur(12px);
}}

.tab-list {{
    width: min(1150px, 95%);
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 15px;
}}

.tab-link {{
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
}}

.tab-link:hover {{
    color: var(--blue);
    background: #f3f8fd;
}}

.tab-link.active {{
    color: var(--blue);
}}

.tab-link.active::after {{
    content: "";
    position: absolute;
    bottom: 0;
    left: 15px;
    right: 15px;
    height: 4px;
    border-radius: 5px 5px 0 0;
    background: var(--orange);
}}

.tab-number {{
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    display: inline-grid;
    place-items: center;
    border-radius: 50%;
    background: #edf3f8;
    color: var(--blue);
    font-size: 12.5px;
}}

.tab-link.active .tab-number {{
    background: var(--blue);
    color: white;
}}

/* ================= GIỚI THIỆU ================= */
.introduction {{
    padding: 38px 0 35px;
}}

.intro-card {{
    padding: 27px 30px;
    background: white;
    border-left: 5px solid var(--orange);
    border-radius: 13px;
    box-shadow: 0 8px 25px rgba(0,50,100,.06);
    font-size: 15.5px;
    text-align: justify;
    line-height: 1.75;
}}

/* ================= CÁC ĐỀ MỤC ================= */
section {{
    padding: 55px 0;
    scroll-margin-top: 85px;
}}

.section-heading {{
    margin-bottom: 28px;
}}

.section-heading h2 {{
    font-size: 25px;
    color: var(--dark-blue);
    line-height: 1.5;
    text-transform: uppercase;
    font-weight: 800;
}}

.section-heading .line {{
    width: 65px;
    height: 4px;
    background: var(--orange);
    margin-top: 12px;
    border-radius: 5px;
}}

/* ================= ĐỀ MỤC 1 ================= */
.criteria-section {{
    background: #eaf3fb;
}}

.object-box {{
    padding: 20px 23px;
    background: white;
    border-left: 5px solid var(--green);
    border-radius: 10px;
    margin-bottom: 22px;
    font-size: 15px;
}}

.object-box strong {{
    color: var(--blue);
}}

/* ================= BẢNG HỌC BỔNG ================= */
.table-wrapper {{
    overflow-x: auto;
    border-radius: 13px;
    background: #ffffff !important;
    box-shadow: 0 8px 25px rgba(0,50,100,.06);
    margin-bottom: 25px;
}}

table {{
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;
    color: #243447 !important;
    background: #ffffff !important;
}}

thead th {{
    background: #063968 !important;
    color: #ffffff !important;
    padding: 16px 15px;
    text-align: left;
    font-size: 14.5px;
    font-weight: 700;
}}

tbody td {{
    padding: 18px 15px;
    vertical-align: top;
    border-bottom: 1px solid #e6edf4;
    font-size: 14px;
    color: #243447 !important;
    background: #ffffff !important;
}}

tbody td, tbody td p, tbody td span, tbody td li, tbody td ul {{
    color: #243447 !important;
}}

tbody tr:last-child td {{
    border-bottom: none;
}}

tbody tr:hover td {{
    background: #f7fbff !important;
}}

tbody ul {{
    padding-left: 20px;
}}

tbody li {{
    margin-bottom: 8px;
    text-align: justify;
    color: #243447 !important;
}}

.level {{
    display: inline-block;
    padding: 6px 11px;
    border-radius: 7px;
    font-weight: 800;
    white-space: nowrap;
}}

.level-100 {{
    background: #fff0df !important;
    color: #d86a0b !important;
}}

.level-75 {{
    background: #e4f7ed !important;
    color: #16824b !important;
}}

.level-50 {{
    background: #e6f1ff !important;
    color: #07549b !important;
}}

.level-25 {{
    background: #f0eaff !important;
    color: #7650ae !important;
}}

/* ================= YÊU CẦU ================= */
.requirement {{
    margin-top: 25px;
    margin-bottom: 25px;
    padding: 22px 25px;
    background: #fff7e9;
    border-left: 5px solid var(--orange);
    border-radius: 11px;
}}

.requirement h3 {{
    color: #b95e09;
    font-size: 16px;
    margin-bottom: 8px;
    font-weight: 800;
}}

.requirement p {{
    font-size: 14px;
    text-align: justify;
    line-height: 1.7;
}}

/* ================= CHÍNH SÁCH HỖ TRỢ ================= */
.support {{
    margin-top: 30px;
    margin-bottom: 25px;
}}

.support-heading {{
    color: var(--blue);
    font-size: 19px;
    margin-bottom: 16px;
    border-bottom: 2px solid #e2eaf1;
    padding-bottom: 10px;
    font-weight: 800;
}}

.support-list {{
    display: grid;
    gap: 13px;
}}

.support-item {{
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 16px 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,50,100,.04);
}}

.support-icon {{
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: var(--light-blue);
    font-size: 19px;
}}

.support-item:nth-child(2) .support-icon {{
    background: #e4f7ed;
}}

.support-item:nth-child(3) .support-icon {{
    background: #fff0df;
}}

.support-item:nth-child(4) .support-icon {{
    background: #f0eaff;
}}

.support-item:nth-child(5) .support-icon {{
    background: #e6f1ff;
}}

.support-item p {{
    font-size: 14px;
    text-align: justify;
    line-height: 1.65;
}}

/* ================= ĐỀ MỤC 2 ================= */
.maintenance-section {{
    background: linear-gradient(120deg, #063968, #0876b9);
    color: white;
}}

.maintenance-section .section-heading h2 {{
    color: white;
}}

.maintenance-section .section-heading .line {{
    background: #ffb45e;
}}

.maintenance-content {{
    display: grid;
    gap: 20px;
}}

.maintenance-card {{
    padding: 25px;
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 13px;
}}

.maintenance-card h3 {{
    font-size: 18px;
    color: #ffb45e;
    margin-bottom: 10px;
    font-weight: 800;
}}

.maintenance-card p {{
    font-size: 14.5px;
    color: #edf6ff;
    text-align: justify;
    line-height: 1.7;
}}

.maintenance-card ul {{
    padding-left: 22px;
    margin-top: 10px;
}}

.maintenance-card li {{
    font-size: 14.5px;
    color: #edf6ff;
    margin-bottom: 10px;
    text-align: justify;
}}

/* ================= ĐỀ MỤC 3 ================= */
.notes-section {{
    background: #f4f8fc;
    color: var(--text);
}}

.notes-section .section-heading h2 {{
    color: var(--dark-blue);
}}

.notes-card {{
    padding: 25px;
    background: white;
    border-left: 5px solid #269b63;
    border-radius: 13px;
    box-shadow: 0 8px 25px rgba(0,50,100,.06);
}}

.notes-card h3 {{
    font-size: 18px;
    color: var(--blue);
    margin-bottom: 10px;
    font-weight: 800;
}}

.notes-card p, .notes-card li {{
    font-size: 14px;
    line-height: 1.7;
    text-align: justify;
}}

.notes-card a {{
    color: var(--blue);
    font-weight: 700;
}}

.notes-card a:hover {{
    text-decoration: underline;
    color: var(--orange);
}}

/* ================= ĐIỆN THOẠI ================= */
@media(max-width: 700px) {{
    .banner {{
        padding: 50px 16px;
    }}

    .banner h1 {{
        font-size: 25px;
    }}

    .tab-list {{
        justify-content: flex-start;
        gap: 0;
        overflow-x: auto;
    }}

    .tab-link {{
        padding: 12px 14px;
        font-size: 12px;
        min-width: max-content;
    }}

    section {{
        padding: 38px 0;
    }}

    .section-heading h2 {{
        font-size: 21px;
    }}

    .intro-card {{
        padding: 20px;
        font-size: 14px;
    }}

    .maintenance-card, .notes-card {{
        padding: 20px;
    }}

    .object-box {{
        font-size: 13.5px;
    }}
}}
</style>
</head>

<body>

<!-- ================= HEADER ================= -->
<header class="banner">
    <div class="banner-content">
        <h1>
            {banner_h1}
        </h1>
    </div>
</header>

<!-- ================= THANH TAB ================= -->
<nav class="tab-navigation">
    <div class="tab-list">
        {"".join(tab_links)}
    </div>
</nav>

<!-- ================= GIỚI THIỆU ================= -->
<div class="introduction">
    <div class="container">
        <div class="intro-card">
            {html.escape(intro_text)}
        </div>
    </div>
</div>

<!-- ================= CÁC ĐỀ MỤC ================= -->
{"".join(rendered_sections)}

<!-- ================= KẾT THÚC ================= -->
<script>
const tabs = document.querySelectorAll(".tab-link");
const sections = document.querySelectorAll("section[id]");

document.addEventListener("click", function(e) {{
    const tab = e.target.closest(".tab-link");
    if (!tab) return;
    e.preventDefault();
    tabs.forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
    const targetId = tab.getAttribute("href").replace("#", "");
    const target = document.getElementById(targetId);
    if (target) {{
        target.scrollIntoView({{ behavior: "smooth", block: "start" }});
    }}
}});

const observer = new IntersectionObserver(entries => {{
    entries.forEach(entry => {{
        if (entry.isIntersecting) {{
            tabs.forEach(tab => {{
                tab.classList.toggle(
                    "active",
                    tab.getAttribute("href") === "#" + entry.target.id
                );
            }});
        }}
    }});
}}, {{
    rootMargin: "-90px 0px -55% 0px",
    threshold: 0
}});

sections.forEach(section => observer.observe(section));
</script>

</body>
</html>'''

    # Save to public/scholarships-html/scholarship-{num:02d}.html
    num_str = f"{prog['num']:02d}"
    out_file = os.path.join(OUTPUT_DIR, f"scholarship-{num_str}.html")
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_html)
        
    # Also save with slug if available
    if prog_idx < len(scholarships):
        slug = scholarships[prog_idx].get('slug')
        if slug:
            slug_file = os.path.join(OUTPUT_DIR, f"{slug}.html")
            with open(slug_file, 'w', encoding='utf-8') as f:
                f.write(full_html)
        scholarships[prog_idx]['introHtml'] = full_html
        scholarships[prog_idx]['htmlContent'] = full_html

    print(f"[{prog['num']}/21] Generated HTML ({len(sections)} sections/tabs) for: {title} -> scholarship-{num_str}.html")

# Update db.json
existing_db['scholarships'] = scholarships
with open(DB_PATH, 'w', encoding='utf-8') as f:
    json.dump(existing_db, f, ensure_ascii=False, indent=2)

# Also update src/data/initialData.ts
INITIAL_DATA_PATH = r"d:\CÔ LINH HBDUE\src\data\initialData.ts"
with open(INITIAL_DATA_PATH, 'w', encoding='utf-8') as f:
    f.write('import { DatabaseState } from "@/types";\n\n')
    f.write('export const initialData: DatabaseState = ')
    json.dump(existing_db, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print("Successfully generated all 21 scholarship HTMLs with dynamic sections matching document!")
