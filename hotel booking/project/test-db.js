const mongoose = require('mongoose');

async function testConnection() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotelbooker';
  
  console.log('Testing MongoDB connection...');
  console.log('URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: 'data', timestamp: new Date() });
    console.log('✅ Database write test successful!');
    
    // Clean up
    await testCollection.deleteOne({ test: 'data' });
    console.log('✅ Database cleanup successful!');
    
    await mongoose.disconnect();
    console.log('✅ Connection closed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. MongoDB is installed and running');
    console.log('2. .env.local file exists with MONGODB_URI');
    console.log('3. The connection string is correct');
  }
}

testConnection(); 