const express = require('express');
const router = express.Router();

//Data Dummy
const users = [
    { user: "feryan", name: "Feryan Rizqy", nim: "24110300065"},
    { user: "dendy", name: "Dendy Rivaldi", nim: "24110300076"},
    { user: "fauzan", name: "Fauzan Aditya", nim: "24110300078"},
];

// Endpoint: GET /aboutus/:user
router.get('/;user', (req, res) => {
    const { user } =req.params;
    const foundUser =users.find(u => u.user === user);
    
    if (foundUser) {
        res.json(foundUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

module.exports = router;

