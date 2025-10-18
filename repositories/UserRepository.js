/**
 * User Repository
 * Handles data access layer for users
 * Manages all database operations for the users table
 */

const db = require('../config/database');

// Repository functions - manipulasi data via PostgreSQL

async function findAll() {
  const result = await db.query('SELECT username, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC');
  return result.rows;
}

async function findByUsername(username) {
  const result = await db.query(
    'SELECT username, name, email, role, created_at, updated_at FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0]; // returns undefined if not found
}

async function create(userData) {
  const { username, name, email, role } = userData;
  const result = await db.query(
    'INSERT INTO users (username, name, email, role) VALUES ($1, $2, $3, $4) RETURNING username, name, email, role, created_at, updated_at',
    [username, name, email || '', role || 'buyer']
  );
  return result.rows[0];
}

async function update(username, updates) {
  // Build dynamic UPDATE query based on provided fields
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (updates.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }
  if (updates.email !== undefined) {
    fields.push(`email = $${paramIndex++}`);
    values.push(updates.email);
  }
  if (updates.role !== undefined) {
    fields.push(`role = $${paramIndex++}`);
    values.push(updates.role);
  }

  // If no fields to update, just return the user
  if (fields.length === 0) {
    return await findByUsername(username);
  }

  // Add username as last parameter
  values.push(username);

  const query = `
    UPDATE users 
    SET ${fields.join(', ')} 
    WHERE username = $${paramIndex}
    RETURNING username, name, email, role, created_at, updated_at
  `;

  const result = await db.query(query, values);
  return result.rows[0] || null; // returns null if not found
}

module.exports = {
  findAll,
  findByUsername,
  create,
  update
};
