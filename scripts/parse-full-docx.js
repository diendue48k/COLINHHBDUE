const fs = require('fs');
const path = require('path');

const xmlPath = path.join(process.cwd(), 'temp_docx', 'word', 'document.xml');
let xml = fs.readFileSync(xmlPath, 'utf-8');

// Helper to extract text from a node
function extractText(xmlFragment) {
  const tRegex = /<w:t[\s>](.*?)<\/w:t>/gs;
  let text = '';
  let m;
  while ((m = tRegex.exec(xmlFragment)) !== null) {
    text += m[1].replace(/<[^>]+>/g, '');
  }
  return text.replace(/xml:space="preserve">/g, '').trim();
}

// Convert w:tbl to clean HTML table
function convertTableToHtml(tblXml) {
  const trRegex = /<w:tr[\s>](.*?)<\/w:tr>/gs;
  let rowsHtml = '';
  let trMatch;
  let rowIndex = 0;

  while ((trMatch = trRegex.exec(tblXml)) !== null) {
    const trContent = trMatch[1];
    const tcRegex = /<w:tc[\s>](.*?)<\/w:tc>/gs;
    let cellsHtml = '';
    let tcMatch;

    while ((tcMatch = tcRegex.exec(trContent)) !== null) {
      const tcText = extractText(tcMatch[1]);
      if (rowIndex === 0) {
        cellsHtml += `<th style="border: 1px solid #BFDBFE; padding: 8px 12px; background: #E1F0FD; color: #0B3B60; font-weight: 700; text-align: left;">${tcText}</th>`;
      } else {
        cellsHtml += `<td style="border: 1px solid #E2E8F0; padding: 8px 12px; vertical-align: top;">${tcText}</td>`;
      }
    }
    if (cellsHtml) {
      rowsHtml += `<tr>${cellsHtml}</tr>`;
      rowIndex++;
    }
  }

  if (!rowsHtml) return '';
  return `<table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12.5px; border: 1px solid #E2E8F0;"><tbody>${rowsHtml}</tbody></table>`;
}

// Parse document into items separated by "SỐ X."
// Let's inspect all SỐ markers
const docText = fs.readFileSync('extracted_document.txt', 'utf-8');

console.log('Script initialized for parsing docx content...');
