import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { authAPI } from '../services/api';

// Mock the API module
vi.mock('../services/api', () => ({
  authAPI: {
    register: vi.fn(),
    login: vi.fn(),
    getMe: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('User Registration', () => {
    it('should successfully register a new user', async () => {
      const user = userEvent.setup();
      
      // Mock successful registration and login
      vi.mocked(authAPI.register).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
      });
      
      vi.mocked(authAPI.login).mockResolvedValue({
        access_token: 'fake-jwt-token',
        token_type: 'bearer',
      });
      
      vi.mocked(authAPI.getMe).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
        phone: '555-1234',
        role: 'parent',
        verification_status: 'pending',
        background_check_completed: false,
        average_rating: 0,
        total_ratings: 0,
        created_at: new Date().toISOString(),
      });

      render(
        <BrowserRouter>
          <AuthProvider>
            <Register />
          </AuthProvider>
        </BrowserRouter>
      );

      // Fill in the registration form
      await user.type(screen.getByPlaceholderText(/jane doe/i), 'Test User');
      await user.type(screen.getByPlaceholderText(/parent@example.com/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/555-1234/i), '555-1234');
      
      const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
      await user.type(passwordInputs[0], 'password123');
      await user.type(passwordInputs[1], 'password123');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(submitButton);

      // Wait for API calls
      await waitFor(() => {
        expect(authAPI.register).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          full_name: 'Test User',
          phone: '555-1234',
        });
      });

      await waitFor(() => {
        expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123');
      });

      await waitFor(() => {
        expect(authAPI.getMe).toHaveBeenCalled();
      });

      // Verify token was stored
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      });

      // Verify navigation to dashboard
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <AuthProvider>
            <Register />
          </AuthProvider>
        </BrowserRouter>
      );

      // Fill in form with mismatched passwords
      await user.type(screen.getByPlaceholderText(/jane doe/i), 'Test User');
      await user.type(screen.getByPlaceholderText(/parent@example.com/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/555-1234/i), '555-1234');
      
      const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
      await user.type(passwordInputs[0], 'password123');
      await user.type(passwordInputs[1], 'different-password');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });

      // API should not be called
      expect(authAPI.register).not.toHaveBeenCalled();
    });

    it('should show error when password is too short', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <AuthProvider>
            <Register />
          </AuthProvider>
        </BrowserRouter>
      );

      // Fill in form with short password
      await user.type(screen.getByPlaceholderText(/jane doe/i), 'Test User');
      await user.type(screen.getByPlaceholderText(/parent@example.com/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/555-1234/i), '555-1234');
      
      const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
      await user.type(passwordInputs[0], '12345');
      await user.type(passwordInputs[1], '12345');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });

      // API should not be called
      expect(authAPI.register).not.toHaveBeenCalled();
    });
  });

  describe('User Login', () => {
    it('should successfully log in an existing user', async () => {
      const user = userEvent.setup();
      
      // Mock successful login
      vi.mocked(authAPI.login).mockResolvedValue({
        access_token: 'fake-jwt-token',
        token_type: 'bearer',
      });
      
      vi.mocked(authAPI.getMe).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
        phone: '555-1234',
        role: 'parent',
        verification_status: 'verified',
        background_check_completed: true,
        average_rating: 4.5,
        total_ratings: 10,
        created_at: new Date().toISOString(),
      });

      render(
        <BrowserRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </BrowserRouter>
      );

      // Fill in the login form
      await user.type(screen.getByPlaceholderText(/parent@example.com/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/••••••••/i), 'password123');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      // Wait for API calls
      await waitFor(() => {
        expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123');
      });

      await waitFor(() => {
        expect(authAPI.getMe).toHaveBeenCalled();
      });

      // Verify token was stored
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      });

      // Verify navigation to dashboard
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should show error with invalid credentials', async () => {
      const user = userEvent.setup();
      
      // Mock failed login
      vi.mocked(authAPI.login).mockRejectedValue({
        response: {
          data: {
            detail: 'Invalid credentials',
          },
        },
      });

      render(
        <BrowserRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </BrowserRouter>
      );

      // Fill in the login form
      await user.type(screen.getByPlaceholderText(/parent@example.com/i), 'wrong@example.com');
      await user.type(screen.getByPlaceholderText(/••••••••/i), 'wrongpassword');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      // Token should not be stored
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('Complete User Journey', () => {
    it('should register, login, and maintain session', async () => {
      const user = userEvent.setup();
      
      // Step 1: Register
      vi.mocked(authAPI.register).mockResolvedValue({
        id: 1,
        email: 'journey@example.com',
        full_name: 'Journey User',
      });
      
      vi.mocked(authAPI.login).mockResolvedValue({
        access_token: 'journey-token',
        token_type: 'bearer',
      });
      
      const mockUser = {
        id: 1,
        email: 'journey@example.com',
        full_name: 'Journey User',
        phone: '555-9999',
        role: 'parent' as const,
        verification_status: 'pending' as const,
        background_check_completed: false,
        average_rating: 0,
        total_ratings: 0,
        created_at: new Date().toISOString(),
      };
      
      vi.mocked(authAPI.getMe).mockResolvedValue(mockUser);

      const { rerender } = render(
        <BrowserRouter>
          <AuthProvider>
            <Register />
          </AuthProvider>
        </BrowserRouter>
      );

      // Register
      await user.type(screen.getByPlaceholderText(/jane doe/i), 'Journey User');
      await user.type(screen.getByPlaceholderText(/parent@example.com/i), 'journey@example.com');
      await user.type(screen.getByPlaceholderText(/555-1234/i), '555-9999');
      
      const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
      await user.type(passwordInputs[0], 'journey123');
      await user.type(passwordInputs[1], 'journey123');

      await user.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('journey-token');
      });

      // Step 2: Simulate page refresh (token persists)
      vi.clearAllMocks();
      vi.mocked(authAPI.getMe).mockResolvedValue(mockUser);

      rerender(
        <BrowserRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </BrowserRouter>
      );

      // AuthContext should fetch user on mount
      await waitFor(() => {
        expect(authAPI.getMe).toHaveBeenCalled();
      });

      // Token should still be in localStorage
      expect(localStorage.getItem('token')).toBe('journey-token');
    });
  });
});
