import { next } from '@vercel/functions';

export const config = { matcher: '/:path*' };

const COOKIE = 'sp_auth';

async function token(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('solar-price-finder:' + pw));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function loginPage(error) {
  const html = `<!DOCTYPE html><html lang="th"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>เข้าสู่ระบบ</title>
<style>
:root{--bg:#f5f7fb;--card:#fff;--tx:#1a2233;--bd:#d9dfeb;--ac:#1f3864}
@media(prefers-color-scheme:dark){:root{--bg:#12161f;--card:#1b2130;--tx:#e6eaf3;--bd:#2c3446;--ac:#7fa4ee}}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);color:var(--tx);font:16px "Sarabun",Arial,sans-serif;padding:16px}
form{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:24px;width:100%;max-width:320px;display:flex;flex-direction:column;gap:12px}
h1{font-size:18px;margin:0;color:var(--ac)}input,button{font:inherit;padding:10px;border-radius:8px;border:1px solid var(--bd)}
input{background:var(--bg);color:var(--tx)}button{background:var(--ac);color:var(--bg);border:0;cursor:pointer}
.e{color:#d9480f;font-size:14px;margin:0}
</style></head><body>
<form method="POST"><h1>☀️ ค้นหาราคาสินค้า Solar</h1>
<input type="password" name="password" placeholder="รหัสผ่าน" autofocus required autocomplete="current-password">
${error ? '<p class="e">รหัสผ่านไม่ถูกต้อง</p>' : ''}
<button type="submit">เข้าสู่ระบบ</button></form></body></html>`;
  return new Response(html, { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

export default async function middleware(request) {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return next(); // ไม่ตั้งรหัส = เปิดสาธารณะ
  const good = await token(expected);

  const cookies = request.headers.get('cookie') || '';
  const m = cookies.match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([a-f0-9]+)'));
  if (m && m[1] === good) return next();

  if (request.method === 'POST') {
    try {
      const form = await request.formData();
      if (form.get('password') === expected) {
        const url = new URL(request.url);
        return new Response(null, {
          status: 303,
          headers: {
            Location: url.pathname + url.search,
            'Set-Cookie': `${COOKIE}=${good}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`,
            'Cache-Control': 'no-store',
          },
        });
      }
    } catch (e) {}
    return loginPage(true);
  }
  return loginPage(false);
}
