// ══════════════════════════════════════════════════════════
//  เครื่องมือ 7 ชิ้น — Google Apps Script Web App
//  วิธีใช้: Extensions > Apps Script > วาง code > Deploy
//  ตั้งค่า: Execute as "Me" | Who has access "Anyone"
// ══════════════════════════════════════════════════════════

// ── ชื่อ sheet สรุป (สร้างอัตโนมัติ) ──
const SUMMARY_SHEET = '_สรุป';

function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

// ── รับข้อมูลจาก app (POST) ──────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { tool, record } = payload;
    if (!tool || !record) return out({ error: 'missing tool or record' });

    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName(tool);

    // สร้าง sheet tab ใหม่ถ้ายังไม่มี
    if (!sheet) {
      sheet = ss.insertSheet(tool);
    }

    const keys = Object.keys(record);

    if (sheet.getLastRow() === 0) {
      // เพิ่ม header row
      sheet.appendRow(keys);
      const hdr = sheet.getRange(1, 1, 1, keys.length);
      hdr.setFontWeight('bold')
         .setBackground('#1e40af')
         .setFontColor('#ffffff')
         .setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, keys.length, 160);
    } else {
      // เพิ่ม column ใหม่ถ้ามี key ที่ยังไม่มีใน header
      const lastCol = sheet.getLastColumn();
      const existing = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      keys.forEach(k => {
        if (!existing.includes(k)) {
          const col = sheet.getLastColumn() + 1;
          sheet.getRange(1, col).setValue(k).setFontWeight('bold').setBackground('#1e40af').setFontColor('#ffffff');
          sheet.setColumnWidth(col, 160);
          existing.push(k);
        }
      });
    }

    // เพิ่ม data row
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(h => (record[h] !== undefined && record[h] !== null) ? record[h] : '');
    sheet.appendRow(row);

    // สีแถรสลับ
    const lastRow = sheet.getLastRow();
    if (lastRow % 2 === 0) {
      sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).setBackground('#f8fafc');
    }

    updateSummary(ss);
    return out({ success: true, tool, rowCount: lastRow - 1 });

  } catch (err) {
    return out({ error: err.toString() });
  }
}

// ── ส่งข้อมูลกลับ app (GET) ──────────────────────────────
function doGet(e) {
  try {
    const tool  = e.parameter.tool;
    const allP  = e.parameter.all;
    const ss    = getSpreadsheet();

    // ดึงข้อมูลเครื่องมือเดียว
    if (tool) {
      const sheet = ss.getSheetByName(tool);
      if (!sheet || sheet.getLastRow() < 2) return out({ data: [], tool });
      const values  = sheet.getDataRange().getValues();
      const headers = values[0];
      const rows    = values.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
      });
      return out({ data: rows, tool, count: rows.length });
    }

    // ดึงข้อมูลทุกเครื่องมือ
    if (allP) {
      const result = {};
      ss.getSheets().forEach(s => {
        const name = s.getName();
        if (name.startsWith('_')) return;
        if (s.getLastRow() < 2) { result[name] = []; return; }
        const values  = s.getDataRange().getValues();
        const headers = values[0];
        result[name]  = values.slice(1).map(row => {
          const obj = {};
          headers.forEach((h, i) => { obj[h] = row[i]; });
          return obj;
        });
      });
      return out({ all: result });
    }

    // สรุปจำนวนรายการ
    const sheets = ss.getSheets()
      .filter(s => !s.getName().startsWith('_'))
      .map(s => ({ name: s.getName(), count: Math.max(0, s.getLastRow() - 1) }));
    return out({ sheets, ok: true });

  } catch (err) {
    return out({ error: err.toString() });
  }
}

// ── helpers ──────────────────────────────────────────────
function out(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function updateSummary(ss) {
  try {
    let sum = ss.getSheetByName(SUMMARY_SHEET);
    if (!sum) sum = ss.insertSheet(SUMMARY_SHEET, 0);
    sum.clearContents();
    const header = ['เครื่องมือ', 'จำนวนรายการ', 'อัปเดตล่าสุด'];
    sum.appendRow(header);
    sum.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#0f172a').setFontColor('#fff');
    ss.getSheets().forEach(s => {
      if (s.getName().startsWith('_')) return;
      sum.appendRow([s.getName(), Math.max(0, s.getLastRow() - 1), new Date().toLocaleString('th-TH')]);
    });
    sum.setColumnWidths(1, 3, 200);
  } catch(e) {}
}
