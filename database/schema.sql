-- =====================================================
-- Complete WAD03 Database: Users + Products + Transactions + View
-- =====================================================

-- Drop existing tables if exist (for clean setup)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =======================
-- Create users table
-- =======================
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL DEFAULT '',
    role VARCHAR(20) NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger for users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE
    ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data users
INSERT INTO users (username, name, email, role) VALUES
    ('dendi', 'Dendi Rivaldi', 'rivaldydendy459@gmail.com', 'buyer'),
    ('hasana', 'Nur Hasana', 'hasanasafitri@gmail.com', 'seller'),
    ('rizqy', 'Feryan Rizqy', 'feryanr3@google.com', 'buyer');

-- =======================
-- Create products table
-- =======================
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    seller_username VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_username) REFERENCES users(username)
);

-- Indexes for products
CREATE INDEX idx_products_seller ON products(seller_username);
CREATE INDEX idx_products_name ON products(name);

-- Trigger for products
CREATE TRIGGER update_products_updated_at BEFORE UPDATE
    ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data products
INSERT INTO products (name, description, price, stock, seller_username) VALUES
    ('Laptop Ultrabook', 'Laptop tipis dan ringan, cocok untuk bekerja', 18000000, 10, 'hasana'),
    ('Headphone Bluetooth', 'Headphone wireless berkualitas tinggi', 750000, 25, 'hasana'),
    ('Smartphone Android', 'Smartphone dengan RAM 8GB dan storage 128GB', 4000000, 15, 'hasana');

-- =======================
-- Create transactions table
-- =======================
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    buyer_username VARCHAR(50) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price NUMERIC(12,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_username) REFERENCES users(username),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Indexes for transactions
CREATE INDEX idx_transactions_buyer ON transactions(buyer_username);
CREATE INDEX idx_transactions_product ON transactions(product_id);

-- Seed data transactions
INSERT INTO transactions (buyer_username, product_id, quantity, total_price) VALUES
    ('dendi', 1, 1, 18000000),   -- Dendi beli Laptop Ultrabook
    ('rizqy', 2, 2, 1500000),    -- Rizqy beli 2 Headphone Bluetooth
    ('dendi', 3, 1, 4000000);    -- Dendi beli Smartphone Android

-- =======================
-- Create view for buyer-product-seller
-- =======================
CREATE OR REPLACE VIEW buyer_product_seller AS
SELECT 
    b.name AS buyer_name,
    p.name AS product_name,
    s.name AS seller_name
FROM transactions t
JOIN users b ON t.buyer_username = b.username
JOIN products p ON t.product_id = p.product_id
JOIN users s ON p.seller_username = s.username
ORDER BY t.transaction_id;

-- =======================
-- Verify data
-- =======================
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM transactions;
SELECT * FROM buyer_product_seller;
