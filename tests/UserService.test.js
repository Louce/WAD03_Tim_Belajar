/**
 * Unit Tests for Users Service Layer
 * Tests business logic with mocked repository
 */

// Mock the repository BEFORE importing service
jest.mock('../repositories/UserRepository');

const UserService = require('../services/UserService');
const UserRepository = require('../repositories/UserRepository');

describe('Users Service Layer', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listUsers()', () => {
    it('should return all users from repository', async () => {
      // Arrange
      const mockUsers = [
        { username: 'user1', name: 'User One', role: 'buyer' },
        { username: 'user2', name: 'User Two', role: 'seller' }
      ];
      UserRepository.findAll.mockResolvedValue(mockUsers);

      // Act
      const result = await UserService.listUsers();

      // Assert
      expect(result).toEqual(mockUsers);
      expect(UserRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      // Arrange
      UserRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await UserService.listUsers();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getUser()', () => {
    it('should return user when found', async () => {
      // Arrange
      const mockUser = { username: 'testuser', name: 'Test User', role: 'buyer' };
      UserRepository.findByUsername.mockResolvedValue(mockUser);

      // Act
      const result = await UserService.getUser('testuser');

      // Assert
      expect(result).toEqual(mockUser);
      expect(UserRepository.findByUsername).toHaveBeenCalledWith('testuser');
    });

    it('should return undefined when user not found', async () => {
      // Arrange
      UserRepository.findByUsername.mockResolvedValue(undefined);

      // Act
      const result = await UserService.getUser('nonexistent');

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('createUser() - Business Logic', () => {
    it('should create user successfully with all fields', async () => {
      // Arrange
      const userData = {
        username: 'newuser',
        name: 'New User',
        email: 'new@test.com',
        role: 'seller'
      };
      UserRepository.findByUsername.mockResolvedValue(undefined); // User doesn't exist
      UserRepository.create.mockResolvedValue(userData);

      // Act
      const result = await UserService.createUser(userData);

      // Assert
      expect(result).toEqual({ user: userData });
      expect(UserRepository.findByUsername).toHaveBeenCalledWith('newuser');
      expect(UserRepository.create).toHaveBeenCalledWith({
        username: 'newuser',
        name: 'New User',
        email: 'new@test.com',
        role: 'seller'
      });
    });

    it('should reject duplicate username (business rule)', async () => {
      // Arrange
      const existing = { username: 'existing', name: 'Existing User' };
      UserRepository.findByUsername.mockResolvedValue(existing);

      // Act
      const result = await UserService.createUser({ 
        username: 'existing', 
        name: 'Another User' 
      });

      // Assert
      expect(result).toEqual({ error: 'username already exists' });
      expect(UserRepository.create).not.toHaveBeenCalled(); // Should not attempt create
    });

    it('should default email to empty string (business logic)', async () => {
      // Arrange
      UserRepository.findByUsername.mockResolvedValue(undefined);
      UserRepository.create.mockResolvedValue({ username: 'user', name: 'User', email: '' });

      // Act
      await UserService.createUser({ username: 'user', name: 'User' });

      // Assert
      expect(UserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: '' })
      );
    });

    it('should coerce invalid role to buyer (business logic)', async () => {
      // Arrange
      UserRepository.findByUsername.mockResolvedValue(undefined);
      UserRepository.create.mockResolvedValue({ 
        username: 'user', 
        name: 'User', 
        role: 'buyer' 
      });

      // Act
      await UserService.createUser({ 
        username: 'user', 
        name: 'User', 
        role: 'admin' // Invalid role
      });

      // Assert
      expect(UserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'buyer' })
      );
    });

    it('should accept seller role (business logic)', async () => {
      // Arrange
      UserRepository.findByUsername.mockResolvedValue(undefined);
      UserRepository.create.mockResolvedValue({ 
        username: 'user', 
        name: 'User', 
        role: 'seller' 
      });

      // Act
      await UserService.createUser({ 
        username: 'user', 
        name: 'User', 
        role: 'seller'
      });

      // Assert
      expect(UserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'seller' })
      );
    });

    it('should default to buyer when no role provided (business logic)', async () => {
      // Arrange
      UserRepository.findByUsername.mockResolvedValue(undefined);
      UserRepository.create.mockResolvedValue({ 
        username: 'user', 
        name: 'User', 
        role: 'buyer' 
      });

      // Act
      await UserService.createUser({ username: 'user', name: 'User' });

      // Assert
      expect(UserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'buyer' })
      );
    });

    it('should handle repository errors', async () => {
      // Arrange
      UserRepository.findByUsername.mockResolvedValue(undefined);
      UserRepository.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(
        UserService.createUser({ username: 'user', name: 'User' })
      ).rejects.toThrow('Database error');
    });
  });

  describe('updateUser() - Business Logic', () => {
    it('should update user successfully', async () => {
      // Arrange
      const existingUser = { username: 'testuser', name: 'Old Name', role: 'buyer' };
      const updatedUser = { username: 'testuser', name: 'New Name', role: 'buyer' };
      UserRepository.findByUsername.mockResolvedValue(existingUser);
      UserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await UserService.updateUser('testuser', { name: 'New Name' });

      // Assert
      expect(result).toEqual({ user: updatedUser });
      expect(UserRepository.update).toHaveBeenCalledWith('testuser', { name: 'New Name' });
    });

    it('should return error when user not found (business rule)', async () => {
      // Arrange
      UserRepository.findByUsername.mockResolvedValue(undefined);

      // Act
      const result = await UserService.updateUser('nonexistent', { name: 'New' });

      // Assert
      expect(result).toEqual({ error: 'not found' });
      expect(UserRepository.update).not.toHaveBeenCalled();
    });

    it('should coerce invalid role to buyer on update (business logic)', async () => {
      // Arrange
      const existingUser = { username: 'testuser', name: 'User', role: 'buyer' };
      UserRepository.findByUsername.mockResolvedValue(existingUser);
      UserRepository.update.mockResolvedValue({ ...existingUser, role: 'buyer' });

      // Act
      await UserService.updateUser('testuser', { role: 'admin' });

      // Assert
      expect(UserRepository.update).toHaveBeenCalledWith(
        'testuser',
        expect.objectContaining({ role: 'buyer' })
      );
    });

    it('should accept seller role on update (business logic)', async () => {
      // Arrange
      const existingUser = { username: 'testuser', name: 'User', role: 'buyer' };
      UserRepository.findByUsername.mockResolvedValue(existingUser);
      UserRepository.update.mockResolvedValue({ ...existingUser, role: 'seller' });

      // Act
      await UserService.updateUser('testuser', { role: 'seller' });

      // Assert
      expect(UserRepository.update).toHaveBeenCalledWith(
        'testuser',
        expect.objectContaining({ role: 'seller' })
      );
    });

    it('should only update provided fields', async () => {
      // Arrange
      const existingUser = { username: 'testuser', name: 'User', email: 'old@test.com' };
      UserRepository.findByUsername.mockResolvedValue(existingUser);
      UserRepository.update.mockResolvedValue({ ...existingUser, name: 'New Name' });

      // Act
      await UserService.updateUser('testuser', { name: 'New Name' });

      // Assert
      expect(UserRepository.update).toHaveBeenCalledWith(
        'testuser',
        { name: 'New Name' } // Only name, not email or role
      );
    });

    it('should handle multiple field updates', async () => {
      // Arrange
      const existingUser = { username: 'testuser', name: 'Old', email: 'old@test.com', role: 'buyer' };
      UserRepository.findByUsername.mockResolvedValue(existingUser);
      UserRepository.update.mockResolvedValue({ 
        ...existingUser, 
        name: 'New', 
        email: 'new@test.com', 
        role: 'seller' 
      });

      // Act
      await UserService.updateUser('testuser', { 
        name: 'New', 
        email: 'new@test.com', 
        role: 'seller' 
      });

      // Assert
      expect(UserRepository.update).toHaveBeenCalledWith(
        'testuser',
        { name: 'New', email: 'new@test.com', role: 'seller' }
      );
    });
  });
});
