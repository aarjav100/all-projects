import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';
import Listing from '../models/Listing';
import Booking from '../models/Booking';
import Review from '../models/Review';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
];

const seed = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/airbnb-clone';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Listing.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=FF385C&color=fff',
        role: 'host',
        isVerified: true,
        bio: 'Superhost with 5+ years of experience. I love travel and meeting new people!',
      },
      {
        name: 'Michael Chen',
        email: 'michael@example.com',
        password: 'password123',
        avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=00A699&color=fff',
        role: 'host',
        isVerified: true,
        bio: 'Property enthusiast from San Francisco.',
      },
      {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        password: 'password123',
        avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=FC642D&color=fff',
        role: 'guest',
        isVerified: true,
      },
      {
        name: 'James Rodriguez',
        email: 'james@example.com',
        password: 'password123',
        avatar: 'https://ui-avatars.com/api/?name=James+Rodriguez&background=484848&color=fff',
        role: 'guest',
        isVerified: true,
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=914669&color=fff',
        role: 'admin',
        isVerified: true,
      },
    ]);
    console.log('👥 Created 5 users');

    // Create listings
    const listings = await Listing.create([
      {
        host: users[0]._id,
        title: 'Stunning Beachfront Villa',
        description: 'Wake up to the sound of waves in this luxurious beachfront villa. Features a private pool, outdoor dining area, and direct beach access. Perfect for families or groups of friends.',
        type: 'villa',
        privacyType: 'entire',
        category: 'beachfront',
        location: { address: '123 Ocean Drive', city: 'Malibu', state: 'California', country: 'United States', coordinates: { lat: 34.0259, lng: -118.7798 } },
        images: [SAMPLE_IMAGES[0], SAMPLE_IMAGES[1], SAMPLE_IMAGES[2], SAMPLE_IMAGES[3], SAMPLE_IMAGES[4]],
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Free parking', 'Air conditioning', 'Washer', 'Beach access', 'BBQ grill', 'Outdoor shower'],
        bedrooms: 4, beds: 5, bathrooms: 3, maxGuests: 8,
        pricePerNight: 450, cleaningFee: 150, serviceFee: 60,
        rules: ['No smoking', 'No parties', 'Check-in after 3 PM'],
        cancellationPolicy: 'moderate',
        isSuperhost: true, averageRating: 4.9, reviewCount: 42,
        sleepingArrangements: [
          { bedroom: 'Master Bedroom', beds: [{ type: 'King', count: 1 }] },
          { bedroom: 'Guest Room 1', beds: [{ type: 'Queen', count: 1 }] },
          { bedroom: 'Guest Room 2', beds: [{ type: 'Twin', count: 2 }] },
        ],
      },
      {
        host: users[0]._id,
        title: 'Cozy Mountain Cabin Retreat',
        description: 'Escape to this charming cabin nestled in the mountains. Features a wood-burning fireplace, hot tub, and stunning mountain views. Perfect for a romantic getaway or family vacation.',
        type: 'cabin',
        privacyType: 'entire',
        category: 'cabins',
        location: { address: '456 Pine Trail', city: 'Aspen', state: 'Colorado', country: 'United States', coordinates: { lat: 39.1911, lng: -106.8175 } },
        images: [SAMPLE_IMAGES[5], SAMPLE_IMAGES[6], SAMPLE_IMAGES[7], SAMPLE_IMAGES[8], SAMPLE_IMAGES[9]],
        amenities: ['WiFi', 'Fireplace', 'Hot tub', 'Kitchen', 'Free parking', 'Mountain view', 'Hiking trails', 'Board games'],
        bedrooms: 3, beds: 4, bathrooms: 2, maxGuests: 6,
        pricePerNight: 280, cleaningFee: 100, serviceFee: 40,
        rules: ['No smoking indoors', 'Quiet hours after 10 PM'],
        cancellationPolicy: 'flexible',
        isSuperhost: true, averageRating: 4.8, reviewCount: 36,
      },
      {
        host: users[1]._id,
        title: 'Modern Downtown Loft',
        description: 'Stylish loft in the heart of downtown with floor-to-ceiling windows, exposed brick, and designer furnishings. Walking distance to top restaurants, galleries, and nightlife.',
        type: 'apartment',
        privacyType: 'entire',
        category: 'trending',
        location: { address: '789 Market Street', city: 'San Francisco', state: 'California', country: 'United States', coordinates: { lat: 37.7749, lng: -122.4194 } },
        images: [SAMPLE_IMAGES[1], SAMPLE_IMAGES[3], SAMPLE_IMAGES[5], SAMPLE_IMAGES[7]],
        amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Washer', 'Dryer', 'Gym', 'Elevator', 'City view'],
        bedrooms: 2, beds: 2, bathrooms: 2, maxGuests: 4,
        pricePerNight: 200, cleaningFee: 80, serviceFee: 30,
        rules: ['No smoking', 'No pets'],
        cancellationPolicy: 'moderate',
        averageRating: 4.7, reviewCount: 28,
      },
      {
        host: users[1]._id,
        title: 'Tropical Paradise Treehouse',
        description: 'Unique treehouse experience surrounded by tropical foliage. Features an outdoor shower, canopy deck, and incredible sunset views. A truly one-of-a-kind stay.',
        type: 'treehouse',
        privacyType: 'entire',
        category: 'amazing_views',
        location: { address: '321 Jungle Road', city: 'Ubud', state: 'Bali', country: 'Indonesia', coordinates: { lat: -8.5069, lng: 115.2624 } },
        images: [SAMPLE_IMAGES[2], SAMPLE_IMAGES[4], SAMPLE_IMAGES[6], SAMPLE_IMAGES[8]],
        amenities: ['WiFi', 'Pool', 'Breakfast included', 'Nature views', 'Outdoor shower', 'Mosquito net', 'Fan'],
        bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2,
        pricePerNight: 150, cleaningFee: 30, serviceFee: 20,
        rules: ['No smoking', 'Respect wildlife'],
        cancellationPolicy: 'flexible',
        averageRating: 4.95, reviewCount: 65,
      },
      {
        host: users[0]._id,
        title: 'Charming Countryside Cottage',
        description: 'A beautiful stone cottage set in rolling countryside. Features a private garden, cozy interiors with exposed beams, and a fully equipped farmhouse kitchen.',
        type: 'cottage',
        privacyType: 'entire',
        category: 'farms',
        location: { address: '12 Meadow Lane', city: 'Cotswolds', state: 'Gloucestershire', country: 'United Kingdom', coordinates: { lat: 51.8305, lng: -1.7478 } },
        images: [SAMPLE_IMAGES[0], SAMPLE_IMAGES[2], SAMPLE_IMAGES[4], SAMPLE_IMAGES[9]],
        amenities: ['WiFi', 'Fireplace', 'Garden', 'Kitchen', 'Free parking', 'Countryside view', 'Pets allowed'],
        bedrooms: 2, beds: 3, bathrooms: 1, maxGuests: 5,
        pricePerNight: 175, cleaningFee: 60, serviceFee: 25,
        rules: ['Dogs welcome', 'Close gates behind you'],
        cancellationPolicy: 'moderate',
        averageRating: 4.85, reviewCount: 19,
      },
      {
        host: users[1]._id,
        title: 'Luxury Penthouse with Skyline Views',
        description: 'Breathtaking penthouse apartment with panoramic city views. Features a rooftop terrace, designer kitchen, home theater, and concierge service.',
        type: 'apartment',
        privacyType: 'entire',
        category: 'amazing_views',
        location: { address: '100 Park Avenue', city: 'New York', state: 'New York', country: 'United States', coordinates: { lat: 40.7505, lng: -73.9764 } },
        images: [SAMPLE_IMAGES[1], SAMPLE_IMAGES[3], SAMPLE_IMAGES[5], SAMPLE_IMAGES[7], SAMPLE_IMAGES[9]],
        amenities: ['WiFi', 'Air conditioning', 'Kitchen', 'Gym', 'Doorman', 'Rooftop terrace', 'City view', 'Home theater', 'Concierge'],
        bedrooms: 3, beds: 3, bathrooms: 3, maxGuests: 6,
        pricePerNight: 750, cleaningFee: 200, serviceFee: 100,
        rules: ['No parties', 'No smoking', 'Building quiet hours 10PM-8AM'],
        cancellationPolicy: 'strict',
        isSuperhost: true, averageRating: 4.92, reviewCount: 51,
      },
      {
        host: users[0]._id,
        title: 'Rustic Tiny Home in the Woods',
        description: 'Minimalist tiny home nestled among ancient redwood trees. Solar-powered, eco-friendly, and perfect for digital detox. Features a loft bedroom and outdoor fire pit.',
        type: 'other',
        privacyType: 'entire',
        category: 'tiny_homes',
        location: { address: '55 Redwood Trail', city: 'Big Sur', state: 'California', country: 'United States', coordinates: { lat: 36.2704, lng: -121.8081 } },
        images: [SAMPLE_IMAGES[8], SAMPLE_IMAGES[6], SAMPLE_IMAGES[4]],
        amenities: ['Solar power', 'Outdoor shower', 'Fire pit', 'Hiking trails', 'Stargazing', 'Composting toilet'],
        bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2,
        pricePerNight: 120, cleaningFee: 40, serviceFee: 15,
        rules: ['Pack out trash', 'No loud music', 'Respect nature'],
        cancellationPolicy: 'flexible',
        averageRating: 4.88, reviewCount: 33,
      },
      {
        host: users[1]._id,
        title: 'Historic Castle Tower Room',
        description: 'Stay in an actual medieval castle tower! This restored room features original stone walls, period furnishings, and views of the surrounding vineyards and rolling hills.',
        type: 'castle',
        privacyType: 'private',
        category: 'castles',
        location: { address: 'Château de la Loire', city: 'Loire Valley', state: 'Centre-Val de Loire', country: 'France', coordinates: { lat: 47.3499, lng: 0.9852 } },
        images: [SAMPLE_IMAGES[3], SAMPLE_IMAGES[5], SAMPLE_IMAGES[7], SAMPLE_IMAGES[9]],
        amenities: ['WiFi', 'Breakfast included', 'Garden', 'Wine tasting', 'Historic tour', 'Library', 'Vineyard view'],
        bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2,
        pricePerNight: 320, cleaningFee: 50, serviceFee: 45,
        rules: ['No smoking', 'Respect historical artifacts', 'Dinner reservations required'],
        cancellationPolicy: 'moderate',
        averageRating: 4.93, reviewCount: 27,
      },
      {
        host: users[0]._id,
        title: 'Oceanview Surf Shack',
        description: 'Laid-back surf shack steps from the beach. Comes with surfboards, beach cruiser bikes, and a hammock-filled patio. Perfect for surfers and beach lovers.',
        type: 'house',
        privacyType: 'entire',
        category: 'beachfront',
        location: { address: '88 Surf Lane', city: 'Byron Bay', state: 'New South Wales', country: 'Australia', coordinates: { lat: -28.6474, lng: 153.6120 } },
        images: [SAMPLE_IMAGES[0], SAMPLE_IMAGES[2], SAMPLE_IMAGES[6], SAMPLE_IMAGES[8]],
        amenities: ['WiFi', 'Surfboards', 'Beach access', 'Bikes', 'Outdoor shower', 'BBQ', 'Hammock', 'Parking'],
        bedrooms: 2, beds: 3, bathrooms: 1, maxGuests: 5,
        pricePerNight: 195, cleaningFee: 70, serviceFee: 28,
        rules: ['Rinse surfboards after use', 'No sand inside'],
        cancellationPolicy: 'flexible',
        averageRating: 4.82, reviewCount: 44,
      },
      {
        host: users[1]._id,
        title: 'Santorini Cave House with Pool',
        description: 'Iconic whitewashed cave house overlooking the caldera. Features a private infinity plunge pool, terrace with sunset views, and traditional Cycladic architecture.',
        type: 'house',
        privacyType: 'entire',
        category: 'amazing_views',
        location: { address: 'Oia Cliffside', city: 'Santorini', state: 'South Aegean', country: 'Greece', coordinates: { lat: 36.4618, lng: 25.3753 } },
        images: [SAMPLE_IMAGES[1], SAMPLE_IMAGES[3], SAMPLE_IMAGES[5], SAMPLE_IMAGES[7], SAMPLE_IMAGES[9]],
        amenities: ['WiFi', 'Pool', 'Air conditioning', 'Kitchen', 'Caldera view', 'Sunset terrace', 'Breakfast included'],
        bedrooms: 2, beds: 2, bathrooms: 2, maxGuests: 4,
        pricePerNight: 380, cleaningFee: 100, serviceFee: 50,
        rules: ['No parties', 'Pool hours 8AM-10PM'],
        cancellationPolicy: 'strict',
        isSuperhost: true, averageRating: 4.96, reviewCount: 88,
      },
    ]);
    console.log('🏠 Created 10 listings');

    // Create bookings
    const bookings = await Booking.create([
      {
        guest: users[2]._id, listing: listings[0]._id, host: users[0]._id,
        checkIn: new Date('2026-04-15'), checkOut: new Date('2026-04-20'),
        guests: { adults: 2, children: 0, infants: 0, pets: 0 },
        totalPrice: 2760,
        priceBreakdown: { nightlyRate: 450, nights: 5, subtotal: 2250, cleaningFee: 150, serviceFee: 270, taxes: 90, total: 2760 },
        status: 'confirmed', paymentStatus: 'paid',
      },
      {
        guest: users[3]._id, listing: listings[2]._id, host: users[1]._id,
        checkIn: new Date('2026-05-01'), checkOut: new Date('2026-05-04'),
        guests: { adults: 2, children: 0, infants: 0, pets: 0 },
        totalPrice: 710,
        priceBreakdown: { nightlyRate: 200, nights: 3, subtotal: 600, cleaningFee: 80, serviceFee: 72, taxes: 48, total: 710 },
        status: 'confirmed', paymentStatus: 'paid',
      },
      {
        guest: users[2]._id, listing: listings[3]._id, host: users[1]._id,
        checkIn: new Date('2026-03-10'), checkOut: new Date('2026-03-17'),
        guests: { adults: 2, children: 0, infants: 0, pets: 0 },
        totalPrice: 1275,
        priceBreakdown: { nightlyRate: 150, nights: 7, subtotal: 1050, cleaningFee: 30, serviceFee: 126, taxes: 69, total: 1275 },
        status: 'completed', paymentStatus: 'paid', isReviewed: true,
      },
    ]);
    console.log('📅 Created 3 bookings');

    // Create reviews
    await Review.create([
      {
        booking: bookings[2]._id, reviewer: users[2]._id,
        listing: listings[3]._id, host: users[1]._id,
        ratings: { cleanliness: 5, accuracy: 5, communication: 5, location: 5, checkin: 5, value: 5 },
        overallRating: 5,
        comment: 'Absolutely magical experience! The treehouse was even more beautiful than the photos. Waking up to the sounds of nature and watching the sunset from the canopy deck was unforgettable.',
        hostReply: 'Thank you so much, Emma! We\'re thrilled you enjoyed your stay. Come back anytime! 🌿',
        hostRepliedAt: new Date(),
      },
    ]);
    console.log('⭐ Created 1 review');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Test accounts:');
    console.log('   Host:  sarah@example.com / password123');
    console.log('   Host:  michael@example.com / password123');
    console.log('   Guest: emma@example.com / password123');
    console.log('   Guest: james@example.com / password123');
    console.log('   Admin: admin@example.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
