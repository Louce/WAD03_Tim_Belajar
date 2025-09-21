const express = require('express');
const router = express.Router();

// Data dummy sebagai "database"
const users = [
  { name: "Dendi", nim: "24130500011" },
  { name: "Hasana", nim: "24120400009" },
  { name: "Rizqy", nim: "24110300065" }
];

// Versi query string: /greeting?name=Dendi
router.get('/', (req, res) => {
  const name = req.query.name;
  if (name) {
    const foundUser = users.find(
      u => u.name.toLowerCase() === name.toLowerCase()
    );
    if (foundUser) {
      res.send(`Hello ${foundUser.name}, NIM kamu adalah ${foundUser.nim}`);
    } else {
      res.status(404).send('User not found');
    }
  } else {
    res.send('Hello Guest');
  }
});

// Versi URL parameter: /greeting/Dendi
router.get('/:name', (req, res) => {
  const name = req.params.name;
  const foundUser = users.find(
    u => u.name.toLowerCase() === name.toLowerCase()
  );
  if (foundUser) {
    res.send(`Hello ${foundUser.name}, NIM kamu adalah ${foundUser.nim}`);
  } else {
    res.status(404).send('User not found');
  }
});

module.exports = router;
