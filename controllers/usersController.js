// Controller layer: translates HTTP specifics (req/res) into service calls.
// Smol Logic ; validation & transformation.

const usersService = require('../services/usersService');

function createUser(req, res) {
  const { username, name, email, role } = req.body || {};
  const result = usersService.createUser({ username, name, email, role });
  if (result.error) {
    return res.status(result.error === 'username already exists' ? 409 : 400).json({ message: result.error });
  }
  res.status(201).json(result.user);
}

function listUsers(req, res) {
  res.json(usersService.listUsers());
}

function getUser(req, res) {
  const user = usersService.getUser(req.params.username);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

function patchUser(req, res) {
  const result = usersService.updateUser(req.params.username, req.body || {});
  if (result.error) return res.status(404).json({ message: 'User not found' });
  res.json(result.user);
}

module.exports = {
  createUser,
  listUsers,
  getUser,
  patchUser
};
