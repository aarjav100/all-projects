import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Hotel from '@/models/Hotel';

// API route for hotels

// Fallback hotel data
const fallbackHotels = [
  {
    id: 1,
    name: 'Grand Plaza Hotel',
    location: 'New York, NY',
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 299,
    rating: 4.8,
    reviews: 1247,
    amenities: ['wifi', 'parking', 'pool', 'restaurant'],
    description: 'Luxury hotel in the heart of Manhattan with stunning city views.'
  },
  {
    id: 2,
    name: 'Ocean View Resort',
    location: 'Miami, FL',
    image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 425,
    rating: 4.9,
    reviews: 892,
    amenities: ['wifi', 'pool', 'beach', 'spa'],
    description: 'Beachfront resort with world-class amenities and pristine beaches.'
  },
  {
    id: 3,
    name: 'Mountain Lodge',
    location: 'Aspen, CO',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 195,
    rating: 4.7,
    reviews: 654,
    amenities: ['wifi', 'parking', 'restaurant', 'fireplace'],
    description: 'Cozy mountain retreat perfect for ski enthusiasts and nature lovers.'
  },
  {
    id: 4,
    name: 'Urban Boutique Hotel',
    location: 'San Francisco, CA',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 275,
    rating: 4.6,
    reviews: 523,
    amenities: ['wifi', 'restaurant', 'gym', 'rooftop'],
    description: 'Modern boutique hotel with contemporary design and city skyline views.'
  },
  {
    id: 5,
    name: 'Historic Inn',
    location: 'Charleston, SC',
    image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 185,
    rating: 4.5,
    reviews: 789,
    amenities: ['wifi', 'parking', 'restaurant', 'garden'],
    description: 'Charming historic property with Southern hospitality and antique furnishings.'
  },
  {
    id: 6,
    name: 'Desert Oasis Resort',
    location: 'Phoenix, AZ',
    image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 320,
    rating: 4.8,
    reviews: 445,
    amenities: ['wifi', 'pool', 'spa', 'golf'],
    description: 'Luxury desert resort with championship golf course and world-class spa.'
  }
];

// Function to use fallback data with filtering
function useFallbackData(searchParams: URLSearchParams) {
  const location = searchParams.get('location');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const rating = searchParams.get('rating');
  const amenities = searchParams.get('amenities');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sortBy') || 'popular';
  
  let filteredHotels = [...fallbackHotels];
  
  // Apply filters to fallback data
  if (search) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.name.toLowerCase().includes(search.toLowerCase()) ||
      hotel.location.toLowerCase().includes(search.toLowerCase()) ||
      hotel.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (location) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  if (minPrice) {
    filteredHotels = filteredHotels.filter(hotel => hotel.price >= parseInt(minPrice));
  }
  
  if (maxPrice) {
    filteredHotels = filteredHotels.filter(hotel => hotel.price <= parseInt(maxPrice));
  }
  
  if (rating && rating !== 'any') {
    filteredHotels = filteredHotels.filter(hotel => hotel.rating >= parseFloat(rating));
  }
  
  if (amenities) {
    const requestedAmenities = amenities.split(',');
    filteredHotels = filteredHotels.filter(hotel => 
      requestedAmenities.every(amenity => hotel.amenities.includes(amenity))
    );
  }
  
  // Sort fallback data
  switch (sortBy) {
    case 'price-low':
      filteredHotels.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredHotels.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredHotels.sort((a, b) => b.rating - a.rating);
      break;
    case 'popular':
    default:
      filteredHotels.sort((a, b) => b.reviews - a.reviews);
      break;
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedHotels = filteredHotels.slice(startIndex, endIndex);
  
  return NextResponse.json({
    success: true,
    data: paginatedHotels,
    pagination: {
      total: filteredHotels.length,
      page,
      limit,
      totalPages: Math.ceil(filteredHotels.length / limit),
      hasNext: endIndex < filteredHotels.length,
      hasPrev: page > 1
    }
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const amenities = searchParams.get('amenities');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const sortBy = searchParams.get('sortBy') || 'popular';
    
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.log('⚠️ No MONGODB_URI found, using fallback data');
      return useFallbackData(searchParams);
    }
    
    // Try to connect to MongoDB
    try {
      await dbConnect();
      
      // Build filter object
      const filter: any = { isActive: true };
      
      // Search filter
      if (search) {
        // Use regex search instead of text search for better compatibility
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Location filter
      if (location) {
        filter.location = { $regex: location, $options: 'i' };
      }
      
      // Price range filter
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseInt(minPrice);
        if (maxPrice) filter.price.$lte = parseInt(maxPrice);
      }
      
      // Rating filter
      if (rating && rating !== 'any') {
        filter.rating = { $gte: parseFloat(rating) };
      }
      
      // Amenities filter
      if (amenities) {
        const requestedAmenities = amenities.split(',');
        filter.amenities = { $all: requestedAmenities };
      }
      
      // Build sort object
      let sort: any = {};
      switch (sortBy) {
        case 'price-low':
          sort.price = 1;
          break;
        case 'price-high':
          sort.price = -1;
          break;
        case 'rating':
          sort.rating = -1;
          break;
        case 'popular':
        default:
          sort.reviews = -1;
          break;
      }
      
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;
      
      // Execute query
      const hotels = await Hotel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v');
      
      // Get total count for pagination
      const total = await Hotel.countDocuments(filter);
      
      return NextResponse.json({
        success: true,
        data: hotels,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      console.log('⚠️ Using fallback hotels data (database connection failed)');
      return useFallbackData(searchParams);
    }
    
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'location', 'description', 'image', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Create new hotel
    const hotel = new Hotel(body);
    await hotel.save();
    
    return NextResponse.json({
      success: true,
      data: hotel,
      message: 'Hotel created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating hotel:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}