const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// JSON body parsing only on routes needing body
router.post('/', express.json(), UserController.createUser); // POST /users
router.get('/', UserController.listUsers);                   // GET /users
router.get('/:username', UserController.getUser);            // GET /users/:username
router.patch('/:username', express.json(), UserController.patchUser); // PATCH /users/:username

module.exports = router;
