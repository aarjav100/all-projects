import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Hotel from '@/models/Hotel';

// Bookings API route

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Build filter object
    const filter: any = {};
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (status) {
      filter.status = status;
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Execute query with hotel details
    const bookings = await Booking.find(filter)
      .populate('hotelId', 'name location image')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    // Get total count for pagination
    const total = await Booking.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching bookings:', error);
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
    const requiredFields = [
      'userId', 'hotelId', 'roomType', 'checkIn', 'checkOut', 
      'guests', 'pricing', 'guestInfo'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Validate hotel exists
    const hotel = await Hotel.findById(body.hotelId);
    if (!hotel) {
      return NextResponse.json(
        { success: false, message: 'Hotel not found' },
        { status: 404 }
      );
    }
    
    // Calculate total guests
    const totalGuests = body.guests.adults + (body.guests.children || 0) + (body.guests.infants || 0);
    
    // Create new booking
    const booking = new Booking({
      ...body,
      totalGuests,
      status: 'pending',
      payment: {
        ...body.payment,
        status: 'pending'
      }
    });
    
    await booking.save();
    
    // Populate hotel and user details
    await booking.populate('hotelId', 'name location image');
    await booking.populate('userId', 'firstName lastName email');
    
    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update booking status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, status } = body;
    
    if (!bookingId || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing booking ID or status' },
        { status: 400 }
      );
    }
    
    const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
    
    if (bookingIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    bookings[bookingIndex].status = status;
    
    return NextResponse.json({
      success: true,
      data: bookings[bookingIndex],
      message: 'Booking updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}