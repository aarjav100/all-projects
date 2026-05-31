const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbank');
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@smartbank.com' });
    
    if (existingUser) {
      console.log('⚠️  Test user already exists!');
      console.log('\n📧 Email: test@smartbank.com');
      console.log('🔑 Password: Test123!');
      console.log('💰 Balance: $', existingUser.balance.toLocaleString());
      console.log('🔢 Account Number:', existingUser.accountNumber);
    } else {
      // Create new test user
      const testUser = new User({
        fullName: 'Test User',
        email: 'test@smartbank.com',
        password: 'Test123!',
        phone: '+1-555-0100',
        dateOfBirth: new Date('1995-01-01'),
        balance: 5000.00,
        accountType: 'checking',
        status: 'active',
        isVerified: true
      });

      await testUser.save();
      
      console.log('✅ Test user created successfully!');
      console.log('\n📧 Email: test@smartbank.com');
      console.log('🔑 Password: Test123!');
      console.log('💰 Balance: $', testUser.balance.toLocaleString());
      console.log('🔢 Account Number:', testUser.accountNumber);
    }

    console.log('\n🌐 Now you can login at: http://localhost:5173');

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
};

createTestUser();

