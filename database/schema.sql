-- ==========================================
-- Database Schema for WAD03 User & Product Management
-- Satu tabel gabungan: users + products
-- ==========================================

-- Hapus tabel lama jika ada
DROP TABLE IF EXISTS users_products CASCADE;

-- Buat tabel utama
CREATE TABLE users_products (
    username VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('buyer', 'seller')),
    product_id SERIAL,
    product_name VARCHAR(100),
    price NUMERIC(12,2),
    stock INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian cepat
CREATE INDEX idx_users_products_email ON users_products(email);
CREATE INDEX idx_users_products_role ON users_products(role);
CREATE INDEX idx_users_products_product_name ON users_products(product_name);

-- Trigger untuk auto update kolom updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_products_updated_at
BEFORE UPDATE ON users_products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Data Buyer (tidak memiliki produk)
-- ==========================================
INSERT INTO users_products (username, name, email, role)
VALUES
    ('dendi', 'Dendi Rivaldi', 'rivaldydendy459@gmail.com', 'buyer'),
    ('rizqy', 'Feryan Rizqy', 'feryanr3@google.com', 'buyer');

-- ==========================================
--  Data Seller + Produk mereka
-- ==========================================
INSERT INTO users_products (username, name, email, role, product_name, price, stock)
VALUES
    ('hasana', 'Nur Hasana', 'hasanasafitri@gmail.com', 'seller', 'Laptop ASUS VivoBook', 9500000.00, 10),
    ('hasana', 'Nur Hasana', 'hasanasafitri@gmail.com', 'seller', 'Keyboard Mechanical', 450000.00, 20),
    ('hasana', 'Nur Hasana', 'hasanasafitri@gmail.com', 'seller', 'Wireless Mouse', 250000.00, 15);


SELECT * FROM users_products;
