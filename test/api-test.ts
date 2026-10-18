// Kiểm thử tự động (tùy chọn): cần chạy sẵn Auth Service (3000) và Product Service (3001)
// Chạy: npm test
const AUTH = process.env.AUTH_SERVICE_URL || 'http://localhost:3000';
const PRODUCT = `http://localhost:${process.env.PORT || 3001}`;

let passed = 0;
let failed = 0;
function check(name: string, ok: boolean, extra: any = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`, ok ? '' : extra);
  ok ? passed++ : failed++;
}

async function call(method: string, url: string, token?: string, body?: any) {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json().catch(() => null) as any };
}

async function main() {
  // Đăng nhập ở Auth Service (TH2): admin / 123456 (base64 = MTIzNDU2)
  const login = await call('POST', `${AUTH}/login`, undefined, { userName: 'admin', password: 'MTIzNDU2' });
  check('Đăng nhập Auth Service lấy token', login.status === 201 || login.status === 200, login);
  const token = login.data.token;

  check('GET /products không token -> 401', (await call('GET', `${PRODUCT}/products`)).status === 401);
  check('GET /products token sai -> 401', (await call('GET', `${PRODUCT}/products`, 'abc')).status === 401);

  const list = await call('GET', `${PRODUCT}/products`, token);
  check('GET /products -> 200 (mảng)', list.status === 200 && Array.isArray(list.data), list);

  const created = await call('POST', `${PRODUCT}/products`, token, { name: 'Bàn phím cơ', description: 'Blue switch', price: 59.9, quantity: 20 });
  check('POST /products -> 201', created.status === 201 && created.data.id > 0, created);
  const id = created.data.id;

  const one = await call('GET', `${PRODUCT}/products/${id}`, token);
  check('GET /products/:id -> 200', one.status === 200 && one.data.name === 'Bàn phím cơ', one);

  const upd = await call('PUT', `${PRODUCT}/products/${id}`, token, { price: 49.5, quantity: 15 });
  check('PUT /products/:id -> 200 (đã cập nhật)', upd.status === 200 && upd.data.price === 49.5 && upd.data.quantity === 15, upd);

  check('POST thiếu name -> 400', (await call('POST', `${PRODUCT}/products`, token, { price: 1 })).status === 400);
  check('GET /products/999999 -> 404', (await call('GET', `${PRODUCT}/products/999999`, token)).status === 404);

  const del = await call('DELETE', `${PRODUCT}/products/${id}`, token);
  check('DELETE /products/:id -> 200', del.status === 200, del);
  check('GET sau khi xóa -> 404', (await call('GET', `${PRODUCT}/products/${id}`, token)).status === 404);

  // Đăng xuất ở Auth Service rồi dùng lại token cũ -> phải bị từ chối
  await call('POST', `${AUTH}/logout`, token);
  check('Token sau khi logout -> 401', (await call('GET', `${PRODUCT}/products`, token)).status === 401);

  console.log(`\nKết quả: ${passed} đạt, ${failed} lỗi`);
  process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
