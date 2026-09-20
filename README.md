# Solar Price (Customer)

หน้าค้นหาราคาขายสำหรับลูกค้า — ไม่มีต้นทุน ไม่มี % กำไร
ไฟล์ `index.html` สร้างจากหน้า internal (solar-price-finder) ด้วยปุ่ม "สร้างหน้าค้นหาสำหรับลูกค้า"

## อัปเดตราคา
1. เปิดหน้า internal → ตั้ง % กำไร / ปัดราคา / VAT
2. กด "สร้างหน้าค้นหาสำหรับลูกค้า (index.html)"
3. เอาไฟล์ที่ได้มาแทน `index.html` ใน repo นี้ → commit → Vercel deploy อัตโนมัติ

## รหัสผ่าน (ไม่บังคับ)
ตั้ง Environment Variable `APP_PASSWORD` ใน Vercel แล้ว Redeploy = ต้องกรอกรหัสก่อนเปิด
ไม่ตั้ง = ลิงก์เปิดได้เลย
