const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbank');
    console.log('✅ Connected to MongoDB\n');

    const email = 'test@smartbank.com';
    const password = 'Test123!';

    console.log('🔍 Testing login credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('');

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found!');
      console.log('   Run: npm run create-user');
      return;
    }

    console.log('✅ User found:', user.fullName);
    console.log('   Account:', user.accountNumber);
    console.log('   Status:', user.status);
    console.log('');

    // Test password
    const isPasswordValid = await user.comparePassword(password);
    
    if (isPasswordValid) {
      console.log('✅ Password is correct!');
      console.log('   Login should work.');
    } else {
      console.log('❌ Password is incorrect!');
      console.log('   Stored password hash:', user.password.substring(0, 20) + '...');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Done');
    process.exit(0);
  }
};

testLogin();

