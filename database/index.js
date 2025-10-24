const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       // ubah sesuai PostgreSQL 
  host: 'localhost',
  database: 'wad03_db',   // ganti sesuai nama database 
  password: 'admin123',      // isi password PostgreSQL
  port: 5432,
});

const query = (text, params) => pool.query(text, params);

module.exports = { query };
