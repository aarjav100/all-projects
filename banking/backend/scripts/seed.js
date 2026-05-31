const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Beneficiary = require('../models/Beneficiary');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/banking');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Beneficiary.deleteMany({});
    console.log('Cleared existing data');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const testUser = new User({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      phone: '+1-555-0123',
      dateOfBirth: new Date('1990-01-15'),
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      },
      balance: 10000,
      accountType: 'checking',
      status: 'active',
      isVerified: true
    });

    await testUser.save();
    console.log('Created test user:', testUser.email);

    // Create sample transactions
    const transactions = [
      {
        userId: testUser._id,
        type: 'deposit',
        amount: 5000,
        description: 'Initial deposit',
        category: 'salary',
        senderAccount: 'CASH',
        senderName: 'Cash Deposit',
        balanceAfter: 15000,
        status: 'completed'
      },
      {
        userId: testUser._id,
        type: 'withdrawal',
        amount: 500,
        description: 'ATM withdrawal',
        category: 'other',
        senderAccount: testUser.accountNumber,
        senderName: testUser.fullName,
        balanceAfter: 14500,
        status: 'completed'
      },
      {
        userId: testUser._id,
        type: 'transfer',
        amount: 1000,
        description: 'Transfer to savings',
        category: 'transfer',
        recipientAccount: 'SAVINGS-001',
        recipientName: 'John Doe Savings',
        senderAccount: testUser.accountNumber,
        senderName: testUser.fullName,
        balanceAfter: 13500,
        status: 'completed'
      }
    ];

    for (const transactionData of transactions) {
      const transaction = new Transaction(transactionData);
      await transaction.save();
    }
    console.log('Created sample transactions');

    // Create sample beneficiaries
    const beneficiaries = [
      {
        userId: testUser._id,
        name: 'Jane Smith',
        accountNumber: 'ACC123456789',
        bankName: 'Chase Bank',
        email: 'jane@example.com',
        phone: '+1-555-0456',
        nickname: 'Jane',
        status: 'active',
        isVerified: true,
        verificationDate: new Date()
      },
      {
        userId: testUser._id,
        name: 'Bob Johnson',
        accountNumber: 'ACC987654321',
        bankName: 'Bank of America',
        email: 'bob@example.com',
        phone: '+1-555-0789',
        nickname: 'Bob',
        status: 'active',
        isVerified: true,
        verificationDate: new Date()
      }
    ];

    for (const beneficiaryData of beneficiaries) {
      const beneficiary = new Beneficiary(beneficiaryData);
      await beneficiary.save();
    }
    console.log('Created sample beneficiaries');

    console.log('✅ Database seeded successfully!');
    console.log('\nTest Account Details:');
    console.log('Email: john@example.com');
    console.log('Password: password123');
    console.log('Account Number:', testUser.accountNumber);
    console.log('Balance: $', testUser.balance.toLocaleString());

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

seedDatabase(); 