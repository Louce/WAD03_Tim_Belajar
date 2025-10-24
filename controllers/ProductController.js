// controllers/ProductController.js
const ProductService = require("../services/ProductService");

// GET /products → ambil semua produk
const getAllProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /products/:id → ambil produk berdasarkan ID
const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await ProductService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /products → tambah produk baru
const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // panggil ProductService
    await ProductService.createProduct(req.body);

    // sesuai ekspektasi test
    res.status(201).json(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /products/:id → update produk
const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await ProductService.updateProduct(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /products/:id → hapus produk
const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await ProductService.deleteProduct(id);

    if (!success) {
      return res.status(404).json({ message: "Product not found" });
    }

    // sesuai isi test: “Product deleted”
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
