// In-memory user store (smol Db).
// Shape: { username, name, email, role }
// role: 'buyer' | 'seller' (no validation beyond simple checks)

const users = [
  { username: 'dendi', name: 'Dendi Rivaldi', email: 'rivaldydendy459@gmail.com', role: 'buyer' },
  { username: 'hasana', name: 'Nur Hasana', email: 'hasanasafitri@gmail.com', role: 'seller' },
  { username: 'rizqy', name: 'Feryan Rizqy', email: 'feryanr3@google.com', role: 'buyer' }
];

module.exports = {
  users
};
