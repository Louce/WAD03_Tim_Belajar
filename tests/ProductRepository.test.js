// tests/ProductRepository.test.js
const ProductRepository = require('../repositories/ProductRepository');
const { query } = require('../database');

// Mock database query function
jest.mock('../database', () => ({
  query: jest.fn(),
}));

describe('ProductRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 🔹 CREATE
  describe('create()', () => {
    it('should insert a product and return it', async () => {
      const mockData = {
        product_name: 'Laptop',
        price: 15000000,
        stock: 10,
        seller_username: 'seller01',
      };

      const mockResult = { rows: [{ product_id: 1, ...mockData }] };
      query.mockResolvedValue(mockResult);

      const result = await ProductRepository.create(mockData);

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO products'),
        [mockData.product_name, mockData.price, mockData.stock, mockData.seller_username]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  // 🔹 FIND ALL
  describe('findAll()', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { product_id: 1, product_name: 'Laptop' },
        { product_id: 2, product_name: 'Phone' },
      ];
      query.mockResolvedValue({ rows: mockProducts });

      const result = await ProductRepository.findAll();

      expect(query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM products'));
      expect(result).toEqual(mockProducts);
    });
  });

  // 🔹 FIND BY ID
  describe('findById()', () => {
    it('should return a product when found', async () => {
      const mockProduct = { product_id: 1, product_name: 'Laptop' };
      query.mockResolvedValue({ rows: [mockProduct] });

      const result = await ProductRepository.findById(1);

      expect(query).toHaveBeenCalledWith(expect.stringContaining('WHERE product_id = $1'), [1]);
      expect(result).toEqual(mockProduct);
    });

    it('should return null when not found', async () => {
      query.mockResolvedValue({ rows: [] });

      const result = await ProductRepository.findById(99);

      expect(result).toBeNull();
    });
  });

  // 🔹 UPDATE
  describe('update()', () => {
    it('should update and return updated product', async () => {
      const mockExisting = { product_id: 1, product_name: 'Laptop', price: 15000000 };
      const mockUpdated = { ...mockExisting, product_name: 'Laptop Baru' };

      // Mock findById
      ProductRepository.findById = jest.fn().mockResolvedValue(mockExisting);
      query.mockResolvedValue({ rows: [mockUpdated] });

      const result = await ProductRepository.update(1, { product_name: 'Laptop Baru' });

      expect(ProductRepository.findById).toHaveBeenCalledWith(1);
      expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE products'), expect.any(Array));
      expect(result).toEqual(mockUpdated);
    });

    it('should return null if product not found', async () => {
      ProductRepository.findById = jest.fn().mockResolvedValue(null);

      const result = await ProductRepository.update(99, { product_name: 'X' });
      expect(result).toBeNull();
    });
  });

  // 🔹 DELETE
  describe('delete()', () => {
    it('should delete a product and return true', async () => {
      query.mockResolvedValue({ rowCount: 1 });

      const result = await ProductRepository.delete(1);

      expect(query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM products'), [1]);
      expect(result).toBe(true);
    });

    it('should return false if no product deleted', async () => {
      query.mockResolvedValue({ rowCount: 0 });

      const result = await ProductRepository.delete(99);
      expect(result).toBe(false);
    });
  });
});
