/**
 * User Service
 * Contains business logic for user management
 * Acts as a bridge between Controller and Repository
 */

const UserRepository = require('../repositories/UserRepository');

async function listUsers() {
  return await UserRepository.findAll();
}

async function getUser(username) {
  return await UserRepository.findByUsername(username);
}

async function createUser({ username, name, email, role }) {
  // Business rule: check if username already exists
  const existing = await UserRepository.findByUsername(username);
  if (existing) {
    return { error: 'username already exists' };
  }
  
  // Business logic: role coercion (default to buyer)
  const userData = {
    username,
    name,
    email: email || '',
    role: role === 'seller' ? 'seller' : 'buyer'
  };
  
  const user = await UserRepository.create(userData);
  return { user };
}

async function updateUser(username, patch) {
  const user = await UserRepository.findByUsername(username);
  if (!user) return { error: 'not found' };
  
  // Business logic: prepare updates with role coercion
  const updates = {};
  if (patch.name !== undefined) updates.name = patch.name;
  if (patch.email !== undefined) updates.email = patch.email;
  if (patch.role !== undefined) {
    updates.role = patch.role === 'seller' ? 'seller' : 'buyer';
  }
  
  const updatedUser = await UserRepository.update(username, updates);
  return { user: updatedUser };
}

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser
};
