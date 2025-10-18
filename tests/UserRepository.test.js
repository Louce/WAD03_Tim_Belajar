/**
 * Unit Tests for User Repository Layer
 * Tests data access layer with mocked database
 */

// Mock the database module BEFORE importing repository
jest.mock('../config/database');

const UserRepository = require('../repositories/UserRepository');
const db = require('../config/database');

describe('Users Repository Layer', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll()', () => {
    it('should return all users from database', async () => {
      // Arrange
      const mockUsers = [
        { username: 'user1', name: 'User One', email: 'one@test.com', role: 'buyer' },
        { username: 'user2', name: 'User Two', email: 'two@test.com', role: 'seller' }
      ];
      db.query.mockResolvedValue({ rows: mockUsers });

      // Act
      const result = await UserRepository.findAll();

      // Assert
      expect(result).toEqual(mockUsers);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT username, name, email, role, created_at, updated_at')
      );
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      // Arrange
      db.query.mockResolvedValue({ rows: [] });

      // Act
      const result = await UserRepository.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw error when database fails', async () => {
      // Arrange
      db.query.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(UserRepository.findAll()).rejects.toThrow('Database connection failed');
    });
  });

  describe('findByUsername()', () => {
    it('should return user when found', async () => {
      // Arrange
      const mockUser = { 
        username: 'testuser', 
        name: 'Test User', 
        email: 'test@test.com', 
        role: 'buyer' 
      };
      db.query.mockResolvedValue({ rows: [mockUser] });

      // Act
      const result = await UserRepository.findByUsername('testuser');

      // Assert
      expect(result).toEqual(mockUser);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE username = $1'),
        ['testuser']
      );
    });

    it('should return undefined when user not found', async () => {
      // Arrange
      db.query.mockResolvedValue({ rows: [] });

      // Act
      const result = await UserRepository.findByUsername('nonexistent');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should be case-sensitive for username', async () => {
      // Arrange
      db.query.mockResolvedValue({ rows: [] });

      // Act
      await UserRepository.findByUsername('TestUser');

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        expect.any(String),
        ['TestUser'] // Exact case passed
      );
    });
  });

  describe('create()', () => {
    it('should create user with all fields', async () => {
      // Arrange
      const userData = {
        username: 'newuser',
        name: 'New User',
        email: 'new@test.com',
        role: 'seller'
      };
      const mockCreated = { ...userData, created_at: new Date(), updated_at: new Date() };
      db.query.mockResolvedValue({ rows: [mockCreated] });

      // Act
      const result = await UserRepository.create(userData);

      // Assert
      expect(result).toEqual(mockCreated);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        ['newuser', 'New User', 'new@test.com', 'seller']
      );
    });

    it('should create user with default empty email', async () => {
      // Arrange
      const userData = {
        username: 'newuser',
        name: 'New User',
        role: 'buyer'
      };
      const mockCreated = { ...userData, email: '', created_at: new Date(), updated_at: new Date() };
      db.query.mockResolvedValue({ rows: [mockCreated] });

      // Act
      const result = await UserRepository.create(userData);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        expect.any(String),
        ['newuser', 'New User', '', 'buyer']
      );
    });

    it('should create user with default buyer role', async () => {
      // Arrange
      const userData = {
        username: 'newuser',
        name: 'New User',
        email: 'new@test.com'
      };
      db.query.mockResolvedValue({ 
        rows: [{ ...userData, role: 'buyer', created_at: new Date(), updated_at: new Date() }] 
      });

      // Act
      await UserRepository.create(userData);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(['buyer'])
      );
    });

    it('should throw error on duplicate username', async () => {
      // Arrange
      db.query.mockRejectedValue({ code: '23505', detail: 'Key (username)=(test) already exists' });

      // Act & Assert
      await expect(UserRepository.create({ username: 'test', name: 'Test' }))
        .rejects.toMatchObject({ code: '23505' });
    });
  });

  describe('update()', () => {
    it('should update single field', async () => {
      // Arrange
      const mockUpdated = { 
        username: 'testuser', 
        name: 'Updated Name', 
        email: 'test@test.com', 
        role: 'buyer' 
      };
      db.query.mockResolvedValue({ rows: [mockUpdated] });

      // Act
      const result = await UserRepository.update('testuser', { name: 'Updated Name' });

      // Assert
      expect(result).toEqual(mockUpdated);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        ['Updated Name', 'testuser']
      );
    });

    it('should update multiple fields', async () => {
      // Arrange
      const updates = { name: 'New Name', email: 'new@test.com', role: 'seller' };
      const mockUpdated = { username: 'testuser', ...updates };
      db.query.mockResolvedValue({ rows: [mockUpdated] });

      // Act
      const result = await UserRepository.update('testuser', updates);

      // Assert
      expect(result).toEqual(mockUpdated);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('name = $1'),
        expect.arrayContaining(['New Name', 'new@test.com', 'seller', 'testuser'])
      );
    });

    it('should return existing user when no updates provided', async () => {
      // Arrange
      const mockUser = { username: 'testuser', name: 'Test', email: '', role: 'buyer' };
      db.query.mockResolvedValue({ rows: [mockUser] });

      // Act
      const result = await UserRepository.update('testuser', {});

      // Assert
      expect(result).toEqual(mockUser);
      // Should call findByUsername instead of UPDATE
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['testuser']
      );
    });

    it('should return null when user not found', async () => {
      // Arrange
      db.query.mockResolvedValue({ rows: [] });

      // Act
      const result = await UserRepository.update('nonexistent', { name: 'New' });

      // Assert
      expect(result).toBeNull();
    });

    it('should ignore undefined values in updates', async () => {
      // Arrange
      const mockUpdated = { username: 'testuser', name: 'New Name', email: '', role: 'buyer' };
      db.query.mockResolvedValue({ rows: [mockUpdated] });

      // Act
      await UserRepository.update('testuser', { name: 'New Name', email: undefined });

      // Assert
      // Should only update name, not email
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('name = $1'),
        ['New Name', 'testuser']
      );
    });
  });
});
