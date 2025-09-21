const express = require('express');
const router = express.Router();

const team = [
  {
    id: "dendi-rivaldi",
    name: "Dendi Rivaldi",
    nim: "24130500011",
    email: "RivaldyDendy459@gmail.com",
    github: "Lounce",
    bio: "Saya mahasiswa Data Science Universitas Cakrawala, sedang belajar Git & kolaborasi.",
    motto: "Belajar bukan untuk sekadar tahu, tapi untuk bermanfaat bagi banyak orang."
  },
  {
    id: "nur-hasana",
    name: "Nur Hasana",
    nim: "2412040009",
    email: "hasanasafitri@gmail.com",
    github: "NHasana",
    bio: "Saya mahasiswa Sistem Teknologi Informasi Universitas Cakrawala, sedang belajar Git & kolaborasi.",
    motto: "Belajar bukan untuk sekadar tahu, tapi untuk bermanfaat bagi banyak orang."
  },
  {
    id: "rizqy-feryan",
    name: "Feryan Rizqy",
    nim: "24110300065",
    email: "feryanr3@google.com",
    github: "RizqyFeryan",
    bio: "Halo! 👋 Saya Feryan Rizqy, seorang mahasiswa Cakrawala yang sambil bekerja di Jepang, suka belajar bahasa Jepang, desain, dan juga IT.",
    skills: ["Desain & Seni", "Belajar Pemrograman & IT", "Bahasa Jepang & Budaya Jepang"]
  }
];

// GET semua anggota
router.get('/', (req, res) => {
  res.json(team);
});

// GET anggota berdasarkan id
router.get('/:id', (req, res) => {
  const member = team.find(m => m.id === req.params.id);
  if (!member) {
    return res.status(404).json({ message: 'Data tidak ditemukan' });
  }
  res.json(member);
});

module.exports = router;
