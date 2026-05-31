const mongoose = require('mongoose');

// Import the User model
const User = require('./models/User');

async function testUserSave() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotelbooker';
  
  console.log('Testing User model save...');
  console.log('URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
  
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a user
    const testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'hashedpassword123',
      phone: '+1234567890'
    });
    
    console.log('Creating test user...');
    const savedUser = await testUser.save();
    console.log('✅ User saved successfully!');
    console.log('User ID:', savedUser._id);
    console.log('User email:', savedUser.email);
    
    // Test finding the user
    const foundUser = await User.findOne({ email: 'test@example.com' });
    console.log('✅ User found in database!');
    console.log('Found user:', foundUser.email);
    
    // Clean up - delete the test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test user deleted successfully!');
    
    await mongoose.disconnect();
    console.log('✅ Connection closed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    
    if (error.name === 'ValidationError') {
      console.log('💡 Validation error - check the User model schema');
    } else if (error.name === 'MongoServerError') {
      console.log('💡 MongoDB server error - check connection and permissions');
    } else if (error.name === 'MongooseError') {
      console.log('💡 Mongoose error - check model definition');
    }
  }
}

testUserSave(); 