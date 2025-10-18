/**
 * User Model
 * Represents a user entity in the system
 */

class User {
  constructor(username, name, email, role, created_at, updated_at) {
    this.username = username;
    this.name = name;
    this.email = email || '';
    this.role = role || 'buyer';
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Static method to create User from database row
  static fromDbRow(row) {
    return new User(
      row.username,
      row.name,
      row.email,
      row.role,
      row.created_at,
      row.updated_at
    );
  }

  // Convert to plain object
  toJSON() {
    return {
      username: this.username,
      name: this.name,
      email: this.email,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;
