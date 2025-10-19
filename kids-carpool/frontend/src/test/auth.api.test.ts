import { describe, it, expect, beforeAll } from 'vitest';
import { authAPI } from '../services/api';

/**
 * API Integration Tests
 * These tests make real API calls to the backend
 * Make sure the backend is running on http://localhost:8000
 */

describe('Auth API Integration Tests', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  const testUser = {
    email: testEmail,
    password: testPassword,
    full_name: 'Test User',
    phone: '555-1234',
  };
  
  let authToken: string;

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const response = await authAPI.register(testUser);
      
      expect(response).toBeDefined();
      expect(response.email).toBe(testEmail);
      expect(response.full_name).toBe('Test User');
      expect(response.id).toBeDefined();
    }, 10000); // 10 second timeout

    it('should fail to register with duplicate email', async () => {
      try {
        await authAPI.register(testUser);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response?.status).toBe(400);
        expect(error.response?.data?.detail).toContain('already registered');
      }
    }, 10000);
  });

  describe('User Login', () => {
    it('should login with correct credentials', async () => {
      const response = await authAPI.login(testEmail, testPassword);
      
      expect(response).toBeDefined();
      expect(response.access_token).toBeDefined();
      expect(response.token_type).toBe('bearer');
      
      // Store token for later tests
      authToken = response.access_token;
      localStorage.setItem('token', authToken);
    }, 10000);

    it('should fail to login with incorrect password', async () => {
      try {
        await authAPI.login(testEmail, 'wrongpassword');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response?.status).toBe(401);
      }
    }, 10000);

    it('should fail to login with non-existent email', async () => {
      try {
        await authAPI.login('nonexistent@example.com', testPassword);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response?.status).toBe(401);
      }
    }, 10000);
  });

  describe('Get Current User', () => {
    it('should get current user profile with valid token', async () => {
      const response = await authAPI.getMe();
      
      expect(response).toBeDefined();
      expect(response.email).toBe(testEmail);
      expect(response.full_name).toBe('Test User');
      expect(response.phone).toBe('555-1234');
      expect(response.role).toBe('parent');
    }, 10000);

    it('should fail to get user without token', async () => {
      // Remove token
      localStorage.removeItem('token');
      
      try {
        await authAPI.getMe();
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response?.status).toBe(401);
      }
      
      // Restore token
      localStorage.setItem('token', authToken);
    }, 10000);
  });

  describe('Complete Auth Flow', () => {
    it('should complete full registration and login flow', async () => {
      const uniqueEmail = `flow-test-${Date.now()}@example.com`;
      const userData = {
        email: uniqueEmail,
        password: 'flowtest123',
        full_name: 'Flow Test User',
        phone: '555-5678',
      };

      // Step 1: Register
      const registerResponse = await authAPI.register(userData);
      expect(registerResponse.email).toBe(uniqueEmail);

      // Step 2: Login
      const loginResponse = await authAPI.login(uniqueEmail, 'flowtest123');
      expect(loginResponse.access_token).toBeDefined();
      
      // Step 3: Store token and get user
      localStorage.setItem('token', loginResponse.access_token);
      const userResponse = await authAPI.getMe();
      
      expect(userResponse.email).toBe(uniqueEmail);
      expect(userResponse.full_name).toBe('Flow Test User');
      expect(userResponse.phone).toBe('555-5678');
      
      // Cleanup
      localStorage.removeItem('token');
    }, 15000);
  });
});
