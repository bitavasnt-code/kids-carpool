#!/usr/bin/env node

/**
 * Manual API Test Script
 * Tests user registration and login against the live backend
 * 
 * Usage: node test-auth.js
 * 
 * Make sure the backend is running on http://localhost:8000
 */

const http = require('http');

const API_URL = 'http://localhost:8000';
const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'testpassword123';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const isFormData = path.includes('/auth/login');
    
    let postData = '';
    const headers = {};
    
    if (data) {
      if (isFormData) {
        postData = new URLSearchParams(data).toString();
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        postData = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
      }
      headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: headers
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: parsed });
          } else {
            reject({ status: res.statusCode, data: parsed });
          }
        } catch (e) {
          reject({ status: res.statusCode, error: 'Failed to parse response', raw: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject({ error: error.message });
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Test functions
async function testRegister() {
  console.log('\n📝 Testing User Registration...');
  console.log(`Email: ${testEmail}`);
  
  try {
    const response = await makeRequest('POST', '/api/auth/register', {
      email: testEmail,
      password: testPassword,
      full_name: 'Test User',
      phone: '555-1234'
    });
    
    console.log('✅ Registration successful!');
    console.log(`   User ID: ${response.data.id}`);
    console.log(`   Name: ${response.data.full_name}`);
    console.log(`   Email: ${response.data.email}`);
    return true;
  } catch (error) {
    console.log('❌ Registration failed!');
    console.log(`   Status: ${error.status}`);
    console.log(`   Error: ${JSON.stringify(error.data || error.error)}`);
    return false;
  }
}

async function testLogin() {
  console.log('\n🔐 Testing User Login...');
  console.log(`Email: ${testEmail}`);
  
  try {
    const response = await makeRequest('POST', '/api/auth/login', {
      username: testEmail,
      password: testPassword
    });
    
    console.log('✅ Login successful!');
    console.log(`   Token: ${response.data.access_token.substring(0, 20)}...`);
    console.log(`   Type: ${response.data.token_type}`);
    return response.data.access_token;
  } catch (error) {
    console.log('❌ Login failed!');
    console.log(`   Status: ${error.status}`);
    console.log(`   Error: ${JSON.stringify(error.data || error.error)}`);
    return null;
  }
}

async function testGetUser(token) {
  console.log('\n👤 Testing Get Current User...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode === 200) {
            console.log('✅ Get user successful!');
            console.log(`   ID: ${parsed.id}`);
            console.log(`   Name: ${parsed.full_name}`);
            console.log(`   Email: ${parsed.email}`);
            console.log(`   Phone: ${parsed.phone}`);
            console.log(`   Role: ${parsed.role}`);
            console.log(`   Verification: ${parsed.verification_status}`);
            resolve(true);
          } else {
            console.log('❌ Get user failed!');
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Error: ${JSON.stringify(parsed)}`);
            resolve(false);
          }
        } catch (e) {
          console.log('❌ Failed to parse response');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Request failed!');
      console.log(`   Error: ${error.message}`);
      resolve(false);
    });
    
    req.end();
  });
}

async function testInvalidLogin() {
  console.log('\n🚫 Testing Invalid Login...');
  
  try {
    await makeRequest('POST', '/api/auth/login', {
      username: testEmail,
      password: 'wrongpassword'
    });
    
    console.log('❌ Should have failed but succeeded!');
    return false;
  } catch (error) {
    if (error.status === 401) {
      console.log('✅ Correctly rejected invalid credentials!');
      console.log(`   Status: ${error.status}`);
      return true;
    } else {
      console.log('❌ Unexpected error!');
      console.log(`   Status: ${error.status}`);
      return false;
    }
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Authentication Tests');
  console.log('================================');
  console.log(`Backend: ${API_URL}`);
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Register
  if (await testRegister()) {
    passed++;
  } else {
    failed++;
    console.log('\n⚠️  Stopping tests - registration failed');
    return;
  }
  
  // Test 2: Login
  const token = await testLogin();
  if (token) {
    passed++;
  } else {
    failed++;
    console.log('\n⚠️  Stopping tests - login failed');
    return;
  }
  
  // Test 3: Get User
  if (await testGetUser(token)) {
    passed++;
  } else {
    failed++;
  }
  
  // Test 4: Invalid Login
  if (await testInvalidLogin()) {
    passed++;
  } else {
    failed++;
  }
  
  // Summary
  console.log('\n================================');
  console.log('📊 Test Summary');
  console.log('================================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed');
  }
}

// Check if backend is running
http.get(`${API_URL}/docs`, (res) => {
  if (res.statusCode === 200) {
    runTests().catch(error => {
      console.error('\n❌ Test execution failed:', error);
    });
  } else {
    console.error('❌ Backend is not responding correctly');
    console.error(`   Status: ${res.statusCode}`);
  }
}).on('error', (error) => {
  console.error('❌ Cannot connect to backend!');
  console.error(`   Error: ${error.message}`);
  console.error('\n💡 Make sure the backend is running:');
  console.error('   cd backend && python3 main.py');
});
