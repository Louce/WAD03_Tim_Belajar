// services/ProductService.js
const ProductRepository = require('../repositories/ProductRepository');

class ProductService {
  async createProduct(data) {
    return await ProductRepository.create(data);
  }

  async getAllProducts() {
    return await ProductRepository.findAll();
  }

  async getProductById(id) {
    return await ProductRepository.findById(id);
  }

  async updateProduct(id, data) {
    return await ProductRepository.update(id, data);
  }

  async deleteProduct(id) {
    return await ProductRepository.delete(id);
  }
}

module.exports = new ProductService();
