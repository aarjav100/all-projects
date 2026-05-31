import { NextRequest, NextResponse } from 'next/server';

// Mock availability data - In a real app, this would check your database
const roomAvailability = {
  1: { // Grand Plaza Hotel
    'r1': { available: true, dates: [] },
    'r2': { available: true, dates: ['2025-02-15', '2025-02-16', '2025-02-17'] },
    'r3': { available: true, dates: [] }
  },
  2: { // Ocean View Resort
    'r4': { available: true, dates: [] },
    'r5': { available: true, dates: ['2025-03-20', '2025-03-21', '2025-03-22', '2025-03-23', '2025-03-24'] },
    'r6': { available: false, dates: [] }
  },
  3: { // Mountain Lodge
    'r7': { available: true, dates: ['2024-12-20', '2024-12-21', '2024-12-22'] },
    'r8': { available: true, dates: [] }
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const hotelId = searchParams.get('hotelId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const roomType = searchParams.get('roomType');
    
    if (!hotelId || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    const hotelAvailability = roomAvailability[parseInt(hotelId) as keyof typeof roomAvailability];
    
    if (!hotelAvailability) {
      return NextResponse.json(
        { success: false, message: 'Hotel not found' },
        { status: 404 }
      );
    }
    
    // Check availability for requested dates
    const requestedDates = getDateRange(checkIn, checkOut);
    const availableRooms = [];
    
    for (const [roomId, roomData] of Object.entries(hotelAvailability)) {
      const isAvailable = roomData.available && 
        !requestedDates.some(date => roomData.dates.includes(date));
      
      if (isAvailable) {
        availableRooms.push({
          roomId,
          available: true
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        hotelId: parseInt(hotelId),
        checkIn,
        checkOut,
        availableRooms,
        totalAvailable: availableRooms.length
      }
    });
    
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getDateRange(startDate: string, endDate: string): string[] {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate < end) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}