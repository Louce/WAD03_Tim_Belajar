// Service layer: encapsulates business logic for users.
// This is a simple in-memory abstraction following a "burger layers" idea:
// Route -> Service -> Data Store.

const { users } = require('../data/usersStore');

function listUsers() {
  return users;
}

function getUser(username) {
  return users.find(u => u.username === username);
}

function createUser({ username, name, email, role }) {
  if (!username || !name) {
    return { error: 'username and name are required' };
  }
  if (getUser(username)) {
    return { error: 'username already exists' };
  }
  const user = { username, name, email: email || '', role: role === 'seller' ? 'seller' : 'buyer' };
  users.push(user);
  return { user };
}

function updateUser(username, patch) {
  const user = getUser(username);
  if (!user) return { error: 'not found' };
  if (patch.name !== undefined) user.name = patch.name;
  if (patch.email !== undefined) user.email = patch.email;
  if (patch.role !== undefined) {
    user.role = patch.role === 'seller' ? 'seller' : 'buyer';
  }
  return { user };
}

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser
};
