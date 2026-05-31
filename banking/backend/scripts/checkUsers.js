const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbank');
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find({}).select('email fullName accountNumber balance');
    
    console.log('📊 Total users in database:', users.length);
    console.log('');
    
    if (users.length === 0) {
      console.log('⚠️  No users found! You need to create a test user.');
      console.log('   Run: npm run create-user');
    } else {
      console.log('👥 Users:');
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.fullName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Account: ${user.accountNumber}`);
        console.log(`   Balance: $${user.balance.toLocaleString()}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Done');
    process.exit(0);
  }
};

checkUsers();

