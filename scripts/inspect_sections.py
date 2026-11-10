import docx
import re

doc = docx.Document(r'C:\Users\ASUS\Downloads\2026.11.10 - GIỚI THIỆU HỌC BỔNG CHÍNH SÁCH TẠI DUE (1) - Copy.docx')

def is_section_heading(text):
    t = text.strip()
    if not t:
        return False
    # Exclude Category headers like 'HỌC BỔNG BẬC ĐẠI HỌC', 'HỌC BỔNG BẬC SAU ĐẠI HỌC', 'HỌC BỔNG ĐƠN VỊ NGOÀI TRƯỜNG', 'CHÍNH SÁCH MIỄN GIẢM TRỢ CẤP XÃ HỘI', 'V. HỌC BỔNG CHƯƠNG TRÌNH CỬ NHÂN LIÊN KẾT QUỐC TẾ', 'HỌC BỔNG DU HỌC'
    if t.startswith('HỌC BỔNG BẬC') or t.startswith('CHÍNH SÁCH MIỄN GIẢM TRỢ CẤP') or t.startswith('V. HỌC BỔNG') or t == 'HỌC BỔNG DU HỌC' or t == 'HỌC BỔNG ĐƠN VỊ NGOÀI TRƯỜNG':
        return False
    # Check numbered: 1. , 2. , 3. , 1.1. , 1.2.
    if re.match(r'^((\d+(\.\d+)*)|[IVXLCDM]+)[\.\)]\s+[A-ZÀ-Ỹ]', t):
        # Exclude sub-items like '1.1.' if inside bullet
        return True
    # Check known section titles even without number
    for kw in ['ĐỐI TƯỢNG VÀ MỨC CẤP', 'ĐỐI TƯỢNG – MỨC CẤP', 'NGUYÊN TẮC XÉT, CẤP', 'NGUYÊN TẮC XÉT, CẤP – ĐIỀU KIỆN DUY TRÌ', 'GHI CHÚ']:
        if kw in t.upper() and len(t) < 70:
            return True
    return False

programs = []
current_prog = None

for i, p in enumerate(doc.paragraphs):
    t = p.text.strip()
    if re.match(r'^SỐ\s+\d+', t):
        if current_prog:
            programs.append(current_prog)
        current_prog = {'so': t, 'p_start': i, 'paragraphs': []}
    elif current_prog:
        current_prog['paragraphs'].append((i, t))

if current_prog:
    programs.append(current_prog)

print(f'Total programs detected: {len(programs)}')
for idx, prog in enumerate(programs):
    so_name = prog['so']
    title = ''
    for p_idx, pt in prog['paragraphs']:
        if pt and not title and not pt.startswith('HỌC BỔNG BẬC') and not pt.startswith('CHÍNH SÁCH MIỄN GIẢM TRỢ CẤP') and not pt.startswith('V. HỌC BỔNG') and pt != 'HỌC BỔNG DU HỌC':
            title = pt
            break
    headings = []
    for p_idx, pt in prog['paragraphs']:
        if is_section_heading(pt):
            headings.append((p_idx, pt))
    print(f'\nProgram {idx+1}: {so_name} - {title}')
    print(f'  Sections ({len(headings)}):')
    for p_idx, h in headings:
        print(f'    P{p_idx}: {h}')
