const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// JSON body parsing only on routes needing body
router.post('/', express.json(), usersController.createUser); // POST /users
router.get('/', usersController.listUsers);                   // GET /users
router.get('/:username', usersController.getUser);            // GET /users/:username
router.patch('/:username', express.json(), usersController.patchUser); // PATCH /users/:username

module.exports = router;
