// tests/ProductService.test.js
const ProductService = require('../services/ProductService');
const ProductRepository = require('../repositories/ProductRepository');

// Mock repository methods
jest.mock('../repositories/ProductRepository');

describe('ProductService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const productData = {
        product_name: 'Laptop',
        price: 15000000,
        stock: 10,
        seller_username: 'seller01',
      };

      const mockProduct = { product_id: 1, ...productData };
      ProductRepository.create.mockResolvedValue(mockProduct);

      const result = await ProductService.createProduct(productData);

      expect(ProductRepository.create).toHaveBeenCalledWith(productData);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { product_id: 1, product_name: 'Laptop' },
        { product_id: 2, product_name: 'Phone' },
      ];

      ProductRepository.findAll.mockResolvedValue(mockProducts);

      const result = await ProductService.getAllProducts();

      expect(ProductRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('getProductById', () => {
    it('should return a single product if found', async () => {
      const mockProduct = { product_id: 1, product_name: 'Laptop' };
      ProductRepository.findById.mockResolvedValue(mockProduct);

      const result = await ProductService.getProductById(1);

      expect(ProductRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should return null if product not found', async () => {
      ProductRepository.findById.mockResolvedValue(null);

      const result = await ProductService.getProductById(99);

      expect(result).toBeNull();
    });
  });

  describe('updateProduct', () => {
    it('should update existing product', async () => {
      const mockUpdated = { product_id: 1, product_name: 'Updated Laptop' };
      ProductRepository.update.mockResolvedValue(mockUpdated);

      const result = await ProductService.updateProduct(1, { product_name: 'Updated Laptop' });

      expect(ProductRepository.update).toHaveBeenCalledWith(1, { product_name: 'Updated Laptop' });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by ID', async () => {
      ProductRepository.delete.mockResolvedValue(true);

      const result = await ProductService.deleteProduct(1);

      expect(ProductRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
  });
});
