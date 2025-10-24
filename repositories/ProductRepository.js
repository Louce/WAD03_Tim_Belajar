// repositories/ProductRepository.js
const { query } = require('../database');

class ProductRepository {
  // 🔹 CREATE
  async create(data) {
    const text = `
      INSERT INTO products (product_name, price, stock, seller_username)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [
      data.product_name,
      data.price,
      data.stock,
      data.seller_username,
    ];
    const res = await query(text, values);
    return res.rows[0];
  }

  // 🔹 READ ALL
  async findAll() {
    const res = await query('SELECT * FROM products ORDER BY product_id ASC');
    return res.rows;
  }

  // 🔹 READ BY ID
  async findById(id) {
    const res = await query('SELECT * FROM products WHERE product_id = $1', [id]);
    return res.rows[0] || null;
  }

  // 🔹 UPDATE
  async update(id, data) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const text = `
      UPDATE products
      SET product_name = $1,
          price = $2,
          stock = $3,
          seller_username = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $5
      RETURNING *;
    `;

    const values = [
      data.product_name || existing.product_name,
      data.price || existing.price,
      data.stock ?? existing.stock,
      data.seller_username || existing.seller_username,
      id,
    ];

    const res = await query(text, values);
    return res.rows[0];
  }

  // 🔹 DELETE
  async delete(id) {
    const res = await query('DELETE FROM products WHERE product_id = $1 RETURNING *', [id]);
    return res.rowCount > 0;
  }
}

module.exports = new ProductRepository();
