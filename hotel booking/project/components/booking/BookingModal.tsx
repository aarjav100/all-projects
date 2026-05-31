'use client';

import { useState } from 'react';
import { Calendar, Users, CreditCard, MapPin, Star, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Hotel {
  id: number;
  name: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  amenities: string[];
  description: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel | null;
}

interface RoomType {
  id: string;
  name: string;
  price: number;
  capacity: number;
  description: string;
  available: boolean;
}

export default function BookingModal({ isOpen, onClose, hotel }: BookingModalProps) {
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const { toast } = useToast();

  const roomTypes: RoomType[] = [
    {
      id: 'standard',
      name: 'Standard Room',
      price: hotel?.price || 0,
      capacity: 2,
      description: 'Comfortable room with essential amenities',
      available: true
    },
    {
      id: 'deluxe',
      name: 'Deluxe Room',
      price: (hotel?.price || 0) + 50,
      capacity: 2,
      description: 'Spacious room with premium amenities',
      available: true
    },
    {
      id: 'suite',
      name: 'Suite',
      price: (hotel?.price || 0) + 150,
      capacity: 4,
      description: 'Luxury suite with separate living area',
      available: true
    }
  ];

  const selectedRoom = roomTypes.find(room => room.id === bookingData.roomType);

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const roomPrice = selectedRoom?.price || 0;
    const subtotal = nights * roomPrice;
    const tax = subtotal * 0.12; // 12% tax
    const serviceFee = subtotal * 0.05; // 5% service fee
    return {
      subtotal,
      tax,
      serviceFee,
      total: subtotal + tax + serviceFee
    };
  };

  const handleInputChange = (field: string, value: string | number) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return false;
    }

    if (new Date(bookingData.checkIn) >= new Date(bookingData.checkOut)) {
      toast({
        title: "Error",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      });
      return false;
    }

    if (!bookingData.roomType) {
      toast({
        title: "Error",
        description: "Please select a room type",
        variant: "destructive",
      });
      return false;
    }

    if (!bookingData.firstName || !bookingData.lastName || !bookingData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required personal information",
        variant: "destructive",
      });
      return false;
    }

    if (!bookingData.cardNumber || !bookingData.expiryDate || !bookingData.cvv) {
      toast({
        title: "Error",
        description: "Please fill in all payment information",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const bookingData = {
        userId: '64f8b12345678901234567890', // This should come from user context/session
        hotelId: hotel.id,
        roomType: {
          id: bookingData.roomType,
          name: selectedRoom?.name,
          price: selectedRoom?.price,
          capacity: selectedRoom?.capacity
        },
        checkIn: new Date(bookingData.checkIn),
        checkOut: new Date(bookingData.checkOut),
        guests: {
          adults: bookingData.guests,
          children: 0,
          infants: 0
        },
        pricing: {
          roomPrice: selectedRoom?.price || 0,
          nights: calculateNights(),
          subtotal: totals.subtotal,
          tax: totals.tax,
          serviceFee: totals.serviceFee,
          total: totals.total
        },
        guestInfo: {
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone
        },
        payment: {
          method: 'credit_card',
          status: 'completed',
          lastFourDigits: bookingData.cardNumber.slice(-4)
        }
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        setBookingComplete(true);
        toast({
          title: "Booking Confirmed!",
          description: "Your hotel reservation has been successfully booked.",
        });
      } else {
        toast({
          title: "Booking Failed",
          description: data.message || "An error occurred while creating your booking.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "An error occurred while creating your booking. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (bookingComplete) {
      setBookingComplete(false);
      setBookingData({
        checkIn: '',
        checkOut: '',
        guests: 1,
        roomType: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      });
    }
    onClose();
  };

  if (!hotel) return null;

  const totals = calculateTotal();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="booking-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {bookingComplete ? "Booking Confirmed!" : `Book ${hotel.name}`}
          </DialogTitle>
        </DialogHeader>
        
        <div id="booking-description" className="sr-only">
          {bookingComplete 
            ? "Your hotel booking has been successfully confirmed" 
            : `Complete your booking for ${hotel.name} by selecting dates, guests, and room type`
          }
        </div>

        {bookingComplete ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Successful!</h3>
            <p className="text-gray-600 mb-6">
              Your reservation has been confirmed. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Booking Reference: <span className="font-mono font-medium">BK{Date.now().toString().slice(-6)}</span></p>
            </div>
            <Button onClick={handleClose} className="bg-gradient-to-r from-amber-600 to-orange-700">
              Continue
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hotel Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{hotel.name}</h3>
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{hotel.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                      <span className="text-sm text-gray-600 ml-1">({hotel.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Booking Details */}
              <div className="space-y-6">
                {/* Dates and Guests */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Booking Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn">Check-in Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="checkIn"
                          type="date"
                          className="pl-10"
                          value={bookingData.checkIn}
                          onChange={(e) => handleInputChange('checkIn', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="checkOut">Check-out Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="checkOut"
                          type="date"
                          className="pl-10"
                          value={bookingData.checkOut}
                          onChange={(e) => handleInputChange('checkOut', e.target.value)}
                          min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max="6"
                        className="pl-10"
                        value={bookingData.guests}
                        onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Room Selection */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Room Type</h4>
                  <div className="space-y-3">
                    {roomTypes.map((room) => (
                      <div
                        key={room.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          bookingData.roomType === room.id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleInputChange('roomType', room.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{room.name}</h5>
                            <p className="text-sm text-gray-600">{room.description}</p>
                            <p className="text-sm text-gray-600">Up to {room.capacity} guests</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${room.price}</p>
                            <p className="text-sm text-gray-600">per night</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Personal Information</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={bookingData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={bookingData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Payment and Summary */}
              <div className="space-y-6">
                {/* Payment Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Payment Information</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={bookingData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={bookingData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={bookingData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-4">Booking Summary</h4>
                    
                    {selectedRoom && (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Room Type:</span>
                          <span className="font-medium">{selectedRoom.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-in:</span>
                          <span>{bookingData.checkIn || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-out:</span>
                          <span>{bookingData.checkOut || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nights:</span>
                          <span>{calculateNights()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Guests:</span>
                          <span>{bookingData.guests}</span>
                        </div>
                        
                        <div className="border-t pt-3 space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${totals.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Tax (12%):</span>
                            <span>${totals.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Service Fee (5%):</span>
                            <span>${totals.serviceFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>${totals.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : `Confirm Booking - $${totals.total.toFixed(2)}`}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 