-- Cơ sở dữ liệu RIÊNG của Product Service
CREATE DATABASE IF NOT EXISTS product_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE product_db;

CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)   NOT NULL,
  description TEXT,
  price       DECIMAL(10, 2) NOT NULL DEFAULT 0,
  quantity    INT            NOT NULL DEFAULT 0,
  created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dữ liệu mẫu
INSERT INTO products (name, description, price, quantity) VALUES
  ('Laptop Dell XPS 13', 'Laptop mỏng nhẹ, màn hình 13 inch', 1299.99, 10),
  ('iPhone 15', 'Điện thoại Apple 128GB', 799.00, 25),
  ('Chuột Logitech MX Master 3', 'Chuột không dây cao cấp', 99.50, 50);
