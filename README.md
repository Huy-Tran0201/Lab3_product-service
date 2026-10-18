# Bài thực hành số 3 – Dịch vụ quản lý sản phẩm (Product Service)

Công nghệ: NestJS, TypeScript, TypeORM + MySQL. Cổng riêng **3001**, CSDL riêng **product_db**.
Xác thực: chuyển tiếp token tới Auth Service (Bài TH2, cổng 3000) qua `GET /auth`.

## Chạy project
1. Tạo CSDL: mở `database/schema.sql` trong MySQL Workbench và chạy (biểu tượng tia sét).
2. `npm install`
3. `copy .env.example .env` (macOS/Linux: `cp .env.example .env`), sửa `DB_PASSWORD` cho đúng mật khẩu MySQL.
4. Chạy Auth Service (Bài TH2) trước: `npm run start` trong thư mục lab2 → http://localhost:3000
5. Chạy Product Service: `npm run start` → http://localhost:3001
6. (Tùy chọn) `npm test` để chạy kiểm thử tự động.

## API (cần header `Authorization: Bearer <token>` lấy từ POST http://localhost:3000/login)
| Method | URL | Mô tả |
|---|---|---|
| GET | /products | Lấy danh sách sản phẩm |
| GET | /products/:id | Lấy chi tiết một sản phẩm |
| POST | /products | Thêm sản phẩm `{name, description, price, quantity}` |
| PUT | /products/:id | Cập nhật sản phẩm |
| DELETE | /products/:id | Xóa sản phẩm |

## Cấu trúc
```
database/schema.sql              tạo product_db + bảng products + dữ liệu mẫu
src/main.ts                      khởi động ứng dụng (cổng 3001)
src/app.module.ts                kết nối MySQL, gắn middleware cho /products
src/auth/auth.middleware.ts      xác thực qua Auth Service (TH2)
src/products/product.entity.ts   bảng products
src/products/products.controller.ts   Router + Controller (5 endpoint)
src/products/products.service.ts      nghiệp vụ + truy vấn dữ liệu
src/products/products.module.ts
test/api-test.ts                 kiểm thử tự động
```
