export interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  amenities: string[];
  rooms: Room[];
}

export interface Room {
  id: string;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: number;
  hotelName: string;
  location: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingDate: string;
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface SearchFilters {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  amenities?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
}