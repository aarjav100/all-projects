import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Room from '../models/Room.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Room.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@hotel.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    });
    console.log('👤 Created admin user:', adminUser.email);

    // Create sample hotel rooms
    const rooms = await Room.create([
      {
        roomNumber: '101',
        title: 'Deluxe Single Room',
        description: 'Comfortable single room with city view, perfect for solo travelers',
        pricePerNight: 150,
        roomType: 'single',
        capacity: 1,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Private Bathroom'],
        floor: 1,
        view: 'city',
        status: 'available',
      },
      {
        roomNumber: '201',
        title: 'Premium Double Room',
        description: 'Spacious double room with balcony and mountain view',
        pricePerNight: 250,
        roomType: 'double',
        capacity: 2,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Private Bathroom', 'Balcony', 'Mini Bar'],
        floor: 2,
        view: 'mountain',
        status: 'available',
      },
      {
        roomNumber: '301',
        title: 'Executive Suite',
        description: 'Luxury suite with separate living area and premium amenities',
        pricePerNight: 450,
        roomType: 'suite',
        capacity: 4,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Private Bathroom', 'Living Room', 'Kitchen', 'Jacuzzi', 'Premium View'],
        floor: 3,
        view: 'ocean',
        status: 'available',
      },
      {
        roomNumber: '401',
        title: 'Presidential Suite',
        description: 'Ultimate luxury with panoramic views and exclusive services',
        pricePerNight: 800,
        roomType: 'presidential',
        capacity: 6,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Private Bathroom', 'Living Room', 'Kitchen', 'Jacuzzi', 'Butler Service', 'Premium View', 'Private Terrace'],
        floor: 4,
        view: 'ocean',
        status: 'available',
      },
    ]);
    console.log('🏨 Created', rooms.length, 'rooms');

    // Create sample customer
    const customer = await User.create({
      email: 'customer@hotel.com',
      password: 'customer123',
      firstName: 'John',
      lastName: 'Doe',
      studentId: 'CUST001',
      phone: '+1234567890',
      role: 'student', // Using 'student' role for customers
      program: 'Regular Customer',
      yearLevel: 1,
    });
    console.log('👤 Created sample customer:', customer.email);

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Sample credentials:');
    console.log('Admin: admin@hotel.com / admin123');
    console.log('Customer: customer@hotel.com / customer123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📦 Disconnected from MongoDB');
  }
};

seedData(); 