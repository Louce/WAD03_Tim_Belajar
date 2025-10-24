// tests/ProductController.test.js
const ProductController = require('../controllers/ProductController');
const ProductService = require('../services/ProductService');

// Mock seluruh fungsi ProductService
jest.mock('../services/ProductService');

describe('ProductController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // CREATE
  test('should create a new product successfully', async () => {
    req.body = { name: 'Laptop', price: 10000 };
    ProductService.createProduct.mockResolvedValue(req.body);

    await ProductController.createProduct(req, res);

    expect(ProductService.createProduct).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  // GET ALL
  test('should get all products', async () => {
    const products = [{ id: 1, name: 'Laptop' }];
    ProductService.getAllProducts.mockResolvedValue(products);

    await ProductController.getAllProducts(req, res);

    expect(ProductService.getAllProducts).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(products);
  });

  // GET BY ID
  test('should return product if found', async () => {
    req.params = { id: 1 };
    const product = { id: 1, name: 'Laptop' };
    ProductService.getProductById.mockResolvedValue(product);

    await ProductController.getProductById(req, res);

    expect(ProductService.getProductById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(product);
  });

  test('should return 404 if product not found', async () => {
    req.params = { id: 99 };
    ProductService.getProductById.mockResolvedValue(null);

    await ProductController.getProductById(req, res);

    expect(ProductService.getProductById).toHaveBeenCalledWith(99);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
  });

  // UPDATE
  test('should update a product successfully', async () => {
    req.params = { id: 1 };
    req.body = { name: 'Updated Laptop' };
    const updated = { id: 1, name: 'Updated Laptop' };
    ProductService.updateProduct.mockResolvedValue(updated);

    await ProductController.updateProduct(req, res);

    expect(ProductService.updateProduct).toHaveBeenCalledWith(1, req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  // DELETE
  test('should delete a product successfully', async () => {
    req.params = { id: 1 };
    ProductService.deleteProduct.mockResolvedValue(true);

    await ProductController.deleteProduct(req, res);

    expect(ProductService.deleteProduct).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted' });
  });
});
