const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotelbooker';

// Hotel Schema
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
  reviews: { type: Number, required: true, min: 0, default: 0 },
  amenities: [{ type: String }],
  roomTypes: [{
    id: String,
    name: String,
    price: Number,
    capacity: Number,
    description: String,
    available: { type: Boolean, default: true }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

const Hotel = mongoose.model('Hotel', hotelSchema);
const User = mongoose.model('User', userSchema);

// Sample hotel data
const hotels = [
  {
    name: 'Grand Plaza Hotel',
    location: 'New York, NY',
    description: 'Luxury hotel in the heart of Manhattan with stunning city views. Experience world-class service and amenities in this iconic New York landmark.',
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 299,
    rating: 4.8,
    reviews: 1247,
    amenities: ['wifi', 'parking', 'pool', 'restaurant', 'gym', 'spa'],
    roomTypes: [
      {
        id: 'standard',
        name: 'Standard Room',
        price: 299,
        capacity: 2,
        description: 'Comfortable room with essential amenities',
        available: true
      },
      {
        id: 'deluxe',
        name: 'Deluxe Room',
        price: 349,
        capacity: 2,
        description: 'Spacious room with premium amenities',
        available: true
      },
      {
        id: 'suite',
        name: 'Executive Suite',
        price: 599,
        capacity: 4,
        description: 'Luxury suite with separate living area',
        available: true
      }
    ]
  },
  {
    name: 'Ocean View Resort',
    location: 'Miami, FL',
    description: 'Beachfront resort with world-class amenities and pristine beaches. Perfect for a tropical getaway with stunning ocean views.',
    image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 425,
    rating: 4.9,
    reviews: 892,
    amenities: ['wifi', 'pool', 'beach', 'spa', 'restaurant', 'bar'],
    roomTypes: [
      {
        id: 'standard',
        name: 'Ocean View Room',
        price: 425,
        capacity: 2,
        description: 'Room with beautiful ocean views',
        available: true
      },
      {
        id: 'deluxe',
        name: 'Ocean Suite',
        price: 625,
        capacity: 4,
        description: 'Spacious suite with oceanfront balcony',
        available: true
      },
      {
        id: 'suite',
        name: 'Presidential Suite',
        price: 999,
        capacity: 6,
        description: 'Ultimate luxury with private beach access',
        available: true
      }
    ]
  },
  {
    name: 'Mountain Lodge',
    location: 'Aspen, CO',
    description: 'Cozy mountain retreat perfect for ski enthusiasts and nature lovers. Experience rustic charm with modern comforts.',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 195,
    rating: 4.7,
    reviews: 654,
    amenities: ['wifi', 'parking', 'restaurant', 'fireplace'],
    roomTypes: [
      {
        id: 'standard',
        name: 'Mountain View Room',
        price: 195,
        capacity: 2,
        description: 'Cozy room with mountain views',
        available: true
      },
      {
        id: 'deluxe',
        name: 'Cabin Suite',
        price: 295,
        capacity: 4,
        description: 'Rustic cabin-style suite',
        available: true
      }
    ]
  },
  {
    name: 'Urban Boutique Hotel',
    location: 'San Francisco, CA',
    description: 'Modern boutique hotel with contemporary design and city skyline views. Perfect for business and leisure travelers.',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 275,
    rating: 4.6,
    reviews: 523,
    amenities: ['wifi', 'restaurant', 'gym', 'rooftop'],
    roomTypes: [
      {
        id: 'standard',
        name: 'City View Room',
        price: 275,
        capacity: 2,
        description: 'Modern room with city views',
        available: true
      },
      {
        id: 'deluxe',
        name: 'Rooftop Suite',
        price: 475,
        capacity: 2,
        description: 'Luxury suite with rooftop access',
        available: true
      }
    ]
  },
  {
    name: 'Historic Inn',
    location: 'Charleston, SC',
    description: 'Charming historic property with Southern hospitality and antique furnishings. Experience the charm of the Old South.',
    image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 185,
    rating: 4.5,
    reviews: 789,
    amenities: ['wifi', 'parking', 'restaurant', 'garden'],
    roomTypes: [
      {
        id: 'standard',
        name: 'Historic Room',
        price: 185,
        capacity: 2,
        description: 'Charming room with period furnishings',
        available: true
      },
      {
        id: 'deluxe',
        name: 'Garden Suite',
        price: 285,
        capacity: 2,
        description: 'Suite with private garden access',
        available: true
      }
    ]
  },
  {
    name: 'Desert Oasis Resort',
    location: 'Phoenix, AZ',
    description: 'Luxury desert resort with championship golf course and world-class spa. Perfect for relaxation and recreation.',
    image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 320,
    rating: 4.8,
    reviews: 445,
    amenities: ['wifi', 'pool', 'spa', 'golf'],
    roomTypes: [
      {
        id: 'standard',
        name: 'Desert View Room',
        price: 320,
        capacity: 2,
        description: 'Room with stunning desert views',
        available: true
      },
      {
        id: 'deluxe',
        name: 'Golf Villa',
        price: 520,
        capacity: 4,
        description: 'Villa with golf course access',
        available: true
      }
    ]
  }
];

// Sample user data
const users = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: '+1234567890',
    isVerified: true
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    phone: '+1234567891',
    isVerified: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Hotel.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    // Insert hotels
    const createdHotels = await Hotel.insertMany(hotels);
    console.log(`Inserted ${createdHotels.length} hotels`);

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Inserted ${createdUsers.length} users`);

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: john.doe@example.com, Password: password123');
    console.log('Email: jane.smith@example.com, Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase(); 