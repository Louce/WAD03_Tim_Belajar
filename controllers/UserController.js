/**
 * User Controller
 * Handles HTTP requests and responses for user management
 * Responsibilities:
 * 1. Validate request inputs
 * 2. Call service with validated data
 * 3. Map service results to HTTP responses
 */

const UserService = require('../services/UserService');

async function createUser(req, res) {
  try {
    const { username, name, email, role } = req.body || {};
    
    // Validation - controller's responsibility
    if (!username || !name) {
      return res.status(400).json({ message: 'username and name are required' });
    }
    
    // Call service
    const result = await UserService.createUser({ username, name, email, role });
    
    // Map service result to HTTP response
    if (result.error) {
      return res.status(result.error === 'username already exists' ? 409 : 400)
             .json({ message: result.error });
    }
    
    res.status(201).json(result.user);
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function listUsers(req, res) {
  try {
    const users = await UserService.listUsers();
    res.json(users);
  } catch (error) {
    console.error('Error in listUsers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getUser(req, res) {
  try {
    const user = await UserService.getUser(req.params.username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function patchUser(req, res) {
  try {
    const updates = req.body || {};
    
    // Optional: validate that at least one field is provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No update fields provided' });
    }
    
    const result = await UserService.updateUser(req.params.username, updates);
    
    if (result.error) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result.user);
  } catch (error) {
    console.error('Error in patchUser:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createUser,
  listUsers,
  getUser,
  patchUser
};
