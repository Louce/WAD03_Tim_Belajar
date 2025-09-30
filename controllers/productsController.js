const products = require("../data/productsStore");

// GET /products/ → semua produk
const getAllProducts = (req, res) => {
  res.json(products);
};

// GET /products/:product_name → produk berdasarkan nama
const getProductByName = (req, res) => {
  const { product_name } = req.params;
  const product = products.find(p => p.product_name === product_name);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
};

// POST /products/ → tambah produk (Seller)
const createProduct = (req, res) => {
  const { product_name, product_category, price, owner } = req.body;

  if (!product_name || !product_category || !price || !owner) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const exists = products.find(p => p.product_name === product_name);
  if (exists) {
    return res.status(409).json({ message: "Product name already exists" });
  }

  const newProduct = { product_name, product_category, price, owner };
  products.push(newProduct);

  res.status(201).json(newProduct);
};

// PUT /products/:product_name → update produk (Seller)
const updateProduct = (req, res) => {
  const { product_name } = req.params;
  const { product_category, price } = req.body;

  const product = products.find(p => p.product_name === product_name);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product_category) product.product_category = product_category;
  if (price) product.price = price;

  res.json(product);
};

// DELETE /products/:product_name → hapus produk (Seller)
const deleteProduct = (req, res) => {
  const { product_name } = req.params;
  const index = products.findIndex(p => p.product_name === product_name);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deleted = products.splice(index, 1);
  res.json({ message: "Product deleted", deleted });
};

module.exports = {
  getAllProducts,
  getProductByName,
  createProduct,
  updateProduct,
  deleteProduct,
};
