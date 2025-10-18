// routes/products.js
const express = require("express");
const router = express.Router();
let products = require("../repositories/productsStore");

// GET /products → ambil semua produk
router.get("/", (req, res) => {
  res.json(products);
});

// GET /products/:name → ambil produk by name
router.get("/:name", (req, res) => {
  const product = products.find(p => p.product_name.toLowerCase() === req.params.name.toLowerCase());
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// POST /products → tambah produk baru
router.post("/", (req, res) => {
  const newProduct = req.body;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PATCH /products/:name → update sebagian data produk
router.patch("/:name", (req, res) => {
  const index = products.findIndex(p => p.product_name.toLowerCase() === req.params.name.toLowerCase());
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// DELETE /products/:name → hapus produk
router.delete("/:name", (req, res) => {
  const index = products.findIndex(p => p.product_name.toLowerCase() === req.params.name.toLowerCase());
  if (index !== -1) {
    const deleted = products.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

module.exports = router;
