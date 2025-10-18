-- Database schema for WAD03 Users Management
-- PostgreSQL Database

-- Drop existing table if exists (for clean setup)
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL DEFAULT '',
    role VARCHAR(20) NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create index on role for filtering
CREATE INDEX idx_users_role ON users(role);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE
    ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert seed data (initial users)
INSERT INTO users (username, name, email, role) VALUES
    ('dendi', 'Dendi Rivaldi', 'rivaldydendy459@gmail.com', 'buyer'),
    ('hasana', 'Nur Hasana', 'hasanasafitri@gmail.com', 'seller'),
    ('rizqy', 'Feryan Rizqy', 'feryanr3@google.com', 'buyer');

-- Verify data
SELECT * FROM users;
