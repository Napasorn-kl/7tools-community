# เครื่องมือ 7 ชิ้น — ระบบเก็บข้อมูลชุมชน

ระบบแบบสอบถามสำหรับเก็บข้อมูลชุมชน อ้างอิงแนวคิด **เครื่องมือ 7 ชิ้น** (7 Community Research Tools)
ทำงานเป็น **Progressive Web App** — ใช้ได้ทั้งบน Desktop และ Mobile
ข้อมูลเก็บใน Browser localStorage + ซิงค์ขึ้น **Google Sheets** (ฟรี)

---

## ✨ เครื่องมือทั้ง 7 ชิ้น

| # | เครื่องมือ | ภาษาอังกฤษ | วัตถุประสงค์ |
|---|-----------|-----------|------------|
| 1 | 🗺️ แผนที่เดินดิน | Geo-Social Mapping | เก็บสถานที่ ทรัพยากร พิกัด GPS |
| 2 | 👨‍👩‍👧 ผังเครือญาติ | Genogram | ความสัมพันธ์ทางครอบครัว |
| 3 | 🏛️ โครงสร้างองค์กร | Community Organization | กลุ่มและองค์กรในชุมชน |
| 4 | 💡 ผังความคิด | Mind Map | ประเด็น ความรู้ ภูมิปัญญา |
| 5 | 📅 ปฏิทินชุมชน | Community Calendar | กิจกรรม ประเพณี รายปี |
| 6 | 📜 ประวัติศาสตร์ | Community History | เหตุการณ์สำคัญตามเส้นเวลา |
| 7 | 👤 ประวัติชีวิตบุคคล | Life History | ประวัติและบทบาทของบุคคล |

---

## 🚀 วิธีเริ่มใช้งาน (Quick Start)

### ต้องการเพียง Python 3 หรือ Node.js

**วิธีที่ 1 — Python (แนะนำ, ง่ายสุด)**
```bash
python3 -m http.server 8080
```
เปิดเบราว์เซอร์ไปที่: **http://localhost:8080**

**วิธีที่ 2 — Node.js**
```bash
npx serve . --listen 3000
```
เปิดเบราว์เซอร์ไปที่: **http://localhost:3000**

> ✅ ไม่ต้อง `npm install` ไม่ต้อง build ไม่ต้อง config — เปิดได้ทันที

---

## ☁️ ตั้งค่า Google Sheets (ทำครั้งเดียว)

ข้อมูลจะซิงค์ขึ้น Google Sheets อัตโนมัติผ่าน Apps Script Web App
(ถ้าไม่ตั้งค่า ข้อมูลยังเก็บใน browser localStorage ได้ปกติ)

### ขั้นตอน

**1. สร้าง Google Sheet ใหม่**
```
https://sheets.new
```

**2. เปิด Apps Script**
- เมนู **Extensions → Apps Script**

**3. วาง Code**
- ลบ code เดิมออกทั้งหมด
- วาง code จากไฟล์ `.claude/appscript.gs`
- กด **Save** (Ctrl+S)

**4. Deploy เป็น Web App**
1. กด **Deploy** → **New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. กด **Deploy** → อนุญาต permission
6. **Copy Web App URL** (จะได้ URL รูปแบบ `https://script.google.com/macros/s/.../exec`)

**5. เชื่อมต่อกับแอป**
1. เปิดแอป → กดไอคอน ⚙️ (Settings)
2. วาง URL ที่ได้
3. กด **"ทดสอบการเชื่อมต่อ"** → ✅ เชื่อมต่อสำเร็จ
4. กด **"บันทึก"**

**ผลลัพธ์ใน Google Sheets:**
- แต่ละเครื่องมือจะมี Sheet tab แยกต่างหาก
- Sheet `_สรุป` แสดงจำนวนรายการทั้งหมด

---

## 📁 โครงสร้างไฟล์

```
AI_Survey/
├── index.html              ← แอปหลัก (ทุกอย่างอยู่ในไฟล์เดียว)
├── .gitignore
├── README.md               ← ไฟล์นี้
└── .claude/
    ├── launch.json         ← config สำหรับ dev server (Claude IDE)
    ├── appscript.gs        ← Google Apps Script backend code
    └── settings.local.json ← Claude permissions (ไม่ถูก commit)
```

---

## 🏗️ Architecture

```
Browser (index.html)
    │
    ├── localStorage ──── offline-first storage (เสมอ)
    │
    └── Google Apps Script ── cloud backup (เมื่อมีเน็ต)
              │
              └── Google Sheets ── ฐานข้อมูล (ฟรี)
```

**Sync Strategy:**
- **บันทึก:** เซฟ localStorage ทันที → ส่งขึ้น Sheets (fire-and-forget)
- **ซิงค์:** ดึงจาก Sheets → merge กับ localStorage
- **ออฟไลน์:** ใช้งานได้ปกติ, ซิงค์เมื่อมีเน็ต

---

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี | เหตุผล |
|------|----------|-------|
| Frontend | HTML + Vanilla JS | ไม่ต้อง build, ทำงานทุกที่ |
| Styling | Tailwind CSS (CDN) | ไม่ต้อง npm install |
| Font | Sarabun (Google Fonts) | รองรับภาษาไทย |
| Storage | localStorage | offline-first, ไม่ต้อง server |
| Database | Google Sheets + Apps Script | ฟรี, ทุกคนเปิดได้ |
| Server | Python http.server / npx serve | ไม่ต้อง config |

---

## 📱 Device Support

| Platform | รองรับ |
|----------|-------|
| Desktop (Chrome/Firefox/Safari/Edge) | ✅ |
| Mobile (iOS Safari) | ✅ |
| Mobile (Android Chrome) | ✅ |
| Tablet | ✅ |

**Mobile features:**
- Bottom Navigation Bar
- Touch-friendly chips (≥48px)
- GPS auto-detect
- ป้องกัน auto-zoom บน iOS (font-size 16px)
- Safe area สำหรับ iPhone notch

---

## 🔧 Troubleshooting

**❓ ข้อมูลไม่ซิงค์ขึ้น Sheets**
- ตรวจสอบ URL ว่าเริ่มต้นด้วย `https://script.google.com/macros/s/`
- ตรวจสอบว่า Deploy ด้วย Access: **Anyone** (ไม่ใช่ "Only myself")
- ลอง **Re-deploy** → New deployment (ไม่ใช่ edit existing)

**❓ GPS ไม่ทำงาน**
- ตรวจสอบว่าเบราว์เซอร์ได้รับ permission "Location"
- ใช้งานผ่าน `http://localhost` หรือ `https://` เท่านั้น (ไม่ใช่ `file://`)

**❓ ข้อมูลหายหลังเคลียร์ browser**
- ข้อมูลใน localStorage จะหายเมื่อ clear browser data
- แนะนำเชื่อมต่อ Google Sheets เพื่อสำรองข้อมูลเสมอ

**❓ Export CSV แล้วภาษาไทยเป็น ?????**
- ไฟล์มี BOM (UTF-8 with BOM) แล้ว
- เปิดด้วย Excel: เลือก **Data → From Text/CSV** → Encoding: UTF-8

---

## 👥 การใช้งานหลายคนพร้อมกัน

1. ทุกคนใช้ **Google Sheet เดียวกัน** (URL เดียวกัน)
2. บันทึกข้อมูลได้จากหลายเครื่องพร้อมกัน
3. กด **🔄 ซิงค์** เพื่อดึงข้อมูลของคนอื่นมา

---

## 📄 License

MIT — ใช้งาน ดัดแปลง แจกจ่ายได้อย่างอิสระ
