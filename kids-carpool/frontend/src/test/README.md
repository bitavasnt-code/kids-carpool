# Testing Guide

This directory contains tests for the Kids Carpool application.

## Test Types

### 1. Integration Tests (`auth.integration.test.tsx`)
Tests the React components with mocked API calls.

**What it tests:**
- User registration form validation
- Login form functionality
- Password validation
- Error handling
- Navigation after successful auth
- Session persistence

**Run with:**
```bash
npm test auth.integration.test
```

### 2. API Tests (`auth.api.test.ts`)
Tests actual API calls to the backend.

**What it tests:**
- User registration endpoint
- Login endpoint
- Get current user endpoint
- Complete auth flow
- Error responses

**Prerequisites:**
- Backend must be running on `http://localhost:8000`

**Run with:**
```bash
npm run test:api
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests once (CI mode)
```bash
npm run test:run
```

### Run with UI
```bash
npm run test:ui
```

### Run specific test file
```bash
npm test auth.integration
```

### Run API tests only
```bash
npm run test:api
```

## Test Structure

### Integration Tests
```typescript
describe('Authentication Integration Tests', () => {
  describe('User Registration', () => {
    it('should successfully register a new user', async () => {
      // Test implementation
    });
  });
});
```

### API Tests
```typescript
describe('Auth API Integration Tests', () => {
  it('should register a new user successfully', async () => {
    const response = await authAPI.register(testUser);
    expect(response.email).toBe(testEmail);
  });
});
```

## Test Coverage

### Covered Scenarios

#### Registration
- ✅ Successful registration
- ✅ Password mismatch validation
- ✅ Password length validation
- ✅ Duplicate email error
- ✅ Auto-login after registration

#### Login
- ✅ Successful login
- ✅ Invalid credentials error
- ✅ Token storage
- ✅ Navigation to dashboard

#### Session Management
- ✅ Token persistence
- ✅ Auto-fetch user on mount
- ✅ Logout functionality

## Writing New Tests

### Component Test Example
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should do something', async () => {
  const user = userEvent.setup();
  
  render(<YourComponent />);
  
  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
```

### API Test Example
```typescript
it('should call API endpoint', async () => {
  const response = await someAPI.method(data);
  
  expect(response).toBeDefined();
  expect(response.field).toBe(expectedValue);
}, 10000); // 10 second timeout for API calls
```

## Debugging Tests

### View test output
```bash
npm test -- --reporter=verbose
```

### Run tests in watch mode
```bash
npm test
```

### Debug in VS Code
Add this to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal"
}
```

## Common Issues

### "Backend not running" error
Make sure the backend is running:
```bash
cd ../backend
python3 main.py
```

### "Module not found" error
Install dependencies:
```bash
npm install
```

### Tests timing out
Increase timeout in test:
```typescript
it('test name', async () => {
  // test code
}, 15000); // 15 seconds
```

## Best Practices

1. **Use descriptive test names**
   ```typescript
   it('should show error when email is invalid')
   ```

2. **Test user behavior, not implementation**
   ```typescript
   // Good
   await user.click(screen.getByRole('button', { name: /submit/i }));
   
   // Avoid
   fireEvent.click(document.querySelector('.submit-btn'));
   ```

3. **Wait for async operations**
   ```typescript
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument();
   });
   ```

4. **Clean up after tests**
   ```typescript
   afterEach(() => {
     cleanup();
     localStorage.clear();
   });
   ```

5. **Mock external dependencies**
   ```typescript
   vi.mock('../services/api', () => ({
     authAPI: {
       login: vi.fn(),
     },
   }));
   ```

## CI/CD Integration

Add to your CI pipeline:
```yaml
- name: Run tests
  run: |
    npm install
    npm run test:run
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [User Event](https://testing-library.com/docs/user-event/intro)
