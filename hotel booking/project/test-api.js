async function testRegistrationAPI() {
  console.log('Testing Registration API...');
  
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    password: 'password123',
    phone: '+1234567890'
  };
  
  try {
    // Test registration
    console.log('Sending registration request...');
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      
      // Test login with the same credentials
      console.log('\nTesting login...');
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login response status:', loginResponse.status);
      console.log('Login response data:', JSON.stringify(loginData, null, 2));
      
      if (loginResponse.ok) {
        console.log('✅ Login successful!');
      } else {
        console.log('❌ Login failed!');
      }
    } else {
      console.log('❌ Registration failed!');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testRegistrationAPI(); 