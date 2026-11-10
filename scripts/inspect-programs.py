import docx
from docx.text.paragraph import Paragraph
from docx.table import Table

doc = docx.Document(r'C:\Users\ASUS\Downloads\2026.11.10 - GIỚI THIỆU HỌC BỔNG CHÍNH SÁCH TẠI DUE (1) - Copy.docx')

prog_indices = [1, 40, 93, 126, 146, 177, 203, 224, 246, 263, 282, 318, 355, 396, 431, 444, 465, 481, 501, 530, 549]

body_elements = []
for child in doc.element.body:
    if child.tag.endswith('p'):
        p = Paragraph(child, doc)
        body_elements.append(('p', p.text.strip(), p))
    elif child.tag.endswith('tbl'):
        tbl = Table(child, doc)
        body_elements.append(('tbl', '', tbl))

for i, start_idx in enumerate(prog_indices):
    end_idx = prog_indices[i+1] if i+1 < len(prog_indices) else len(body_elements)
    title = ''
    for k in range(start_idx, min(start_idx+4, end_idx)):
        if body_elements[k][0] == 'p' and body_elements[k][1]:
            t = body_elements[k][1]
            if not t.startswith('SỐ '):
                title = t
                break
    el_types = [body_elements[k][0] for k in range(start_idx, end_idx)]
    p_cnt = el_types.count('p')
    t_cnt = el_types.count('tbl')
    print(f'Program {i+1}: "{title}" (Range {start_idx}..{end_idx}, P:{p_cnt}, Tables:{t_cnt})')
