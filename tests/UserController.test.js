/**
 * Unit Tests for Users Controller Layer
 * Tests HTTP request/response handling with mocked service
 */

// Mock the service BEFORE importing controller
jest.mock('../services/UserService');

const UserController = require('../controllers/UserController');
const UserService = require('../services/UserService');

describe('Users Controller Layer', () => {
  let mockReq, mockRes;

  // Setup mock request and response before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  describe('createUser() - Validation & HTTP Mapping', () => {
    it('should create user successfully with 201 status', async () => {
      // Arrange
      mockReq.body = { username: 'newuser', name: 'New User', email: 'new@test.com', role: 'seller' };
      const mockUser = { ...mockReq.body, created_at: new Date(), updated_at: new Date() };
      UserService.createUser.mockResolvedValue({ user: mockUser });

      // Act
      await UserController.createUser(mockReq, mockRes);

      // Assert
      expect(UserService.createUser).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should validate username is required (400)', async () => {
      // Arrange
      mockReq.body = { name: 'New User' }; // Missing username

      // Act
      await UserController.createUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'username and name are required' 
      });
      expect(UserService.createUser).not.toHaveBeenCalled();
    });

    it('should validate name is required (400)', async () => {
      // Arrange
      mockReq.body = { username: 'newuser' }; // Missing name

      // Act
      await UserController.createUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'username and name are required' 
      });
      expect(UserService.createUser).not.toHaveBeenCalled();
    });

    it('should validate both username and name are required (400)', async () => {
      // Arrange
      mockReq.body = { email: 'test@test.com' }; // Missing both

      // Act
      await UserController.createUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(UserService.createUser).not.toHaveBeenCalled();
    });

    it('should return 409 on duplicate username', async () => {
      // Arrange
      mockReq.body = { username: 'existing', name: 'User' };
      UserService.createUser.mockResolvedValue({ error: 'username already exists' });

      // Act
      await UserController.createUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'username already exists' 
      });
    });

    it('should return 500 on service error', async () => {
      // Arrange
      mockReq.body = { username: 'user', name: 'User' };
      UserService.createUser.mockRejectedValue(new Error('Database error'));

      // Spy on console.error to verify error logging
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      await UserController.createUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Internal server error' 
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Cleanup
      consoleErrorSpy.mockRestore();
    });

    it('should handle missing request body gracefully', async () => {
      // Arrange
      mockReq.body = undefined;

      // Act
      await UserController.createUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'username and name are required' 
      });
    });
  });

  describe('listUsers() - HTTP Mapping', () => {
    it('should return all users with 200 status', async () => {
      // Arrange
      const mockUsers = [
        { username: 'user1', name: 'User One' },
        { username: 'user2', name: 'User Two' }
      ];
      UserService.listUsers.mockResolvedValue(mockUsers);

      // Act
      await UserController.listUsers(mockReq, mockRes);

      // Assert
      expect(UserService.listUsers).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
      expect(mockRes.status).not.toHaveBeenCalled(); // Default 200
    });

    it('should return empty array when no users exist', async () => {
      // Arrange
      UserService.listUsers.mockResolvedValue([]);

      // Act
      await UserController.listUsers(mockReq, mockRes);

      // Assert
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    it('should return 500 on service error', async () => {
      // Arrange
      UserService.listUsers.mockRejectedValue(new Error('Database error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      await UserController.listUsers(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Internal server error' 
      });

      // Cleanup
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getUser() - HTTP Mapping', () => {
    it('should return user with 200 status when found', async () => {
      // Arrange
      mockReq.params = { username: 'testuser' };
      const mockUser = { username: 'testuser', name: 'Test User', role: 'buyer' };
      UserService.getUser.mockResolvedValue(mockUser);

      // Act
      await UserController.getUser(mockReq, mockRes);

      // Assert
      expect(UserService.getUser).toHaveBeenCalledWith('testuser');
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 when user not found', async () => {
      // Arrange
      mockReq.params = { username: 'nonexistent' };
      UserService.getUser.mockResolvedValue(undefined);

      // Act
      await UserController.getUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'User not found' 
      });
    });

    it('should return 404 when user is null', async () => {
      // Arrange
      mockReq.params = { username: 'nulluser' };
      UserService.getUser.mockResolvedValue(null);

      // Act
      await UserController.getUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should return 500 on service error', async () => {
      // Arrange
      mockReq.params = { username: 'testuser' };
      UserService.getUser.mockRejectedValue(new Error('Database error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      await UserController.getUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Internal server error' 
      });

      // Cleanup
      consoleErrorSpy.mockRestore();
    });
  });

  describe('patchUser() - Validation & HTTP Mapping', () => {
    it('should update user successfully with 200 status', async () => {
      // Arrange
      mockReq.params = { username: 'testuser' };
      mockReq.body = { name: 'Updated Name' };
      const mockUpdated = { username: 'testuser', name: 'Updated Name', role: 'buyer' };
      UserService.updateUser.mockResolvedValue({ user: mockUpdated });

      // Act
      await UserController.patchUser(mockReq, mockRes);

      // Assert
      expect(UserService.updateUser).toHaveBeenCalledWith('testuser', { name: 'Updated Name' });
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdated);
    });

    it('should validate empty update body (400)', async () => {
      // Arrange
      mockReq.params = { username: 'testuser' };
      mockReq.body = {}; // Empty updates

      // Act
      await UserController.patchUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'No update fields provided' 
      });
      expect(UserService.updateUser).not.toHaveBeenCalled();
    });

    it('should return 404 when user not found', async () => {
      // Arrange
      mockReq.params = { username: 'nonexistent' };
      mockReq.body = { name: 'New Name' };
      UserService.updateUser.mockResolvedValue({ error: 'not found' });

      // Act
      await UserController.patchUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'User not found' 
      });
    });

    it('should allow partial updates', async () => {
      // Arrange
      mockReq.params = { username: 'testuser' };
      mockReq.body = { email: 'new@test.com' }; // Only email
      const mockUpdated = { username: 'testuser', name: 'Old Name', email: 'new@test.com' };
      UserService.updateUser.mockResolvedValue({ user: mockUpdated });

      // Act
      await UserController.patchUser(mockReq, mockRes);

      // Assert
      expect(UserService.updateUser).toHaveBeenCalledWith('testuser', { email: 'new@test.com' });
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdated);
    });

    it('should return 500 on service error', async () => {
      // Arrange
      mockReq.params = { username: 'testuser' };
      mockReq.body = { name: 'New Name' };
      UserService.updateUser.mockRejectedValue(new Error('Database error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      await UserController.patchUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Internal server error' 
      });

      // Cleanup
      consoleErrorSpy.mockRestore();
    });

    it('should handle undefined request body', async () => {
      // Arrange
      mockReq.params = { username: 'testuser' };
      mockReq.body = undefined;

      // Act
      await UserController.patchUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'No update fields provided' 
      });
    });
  });
});
