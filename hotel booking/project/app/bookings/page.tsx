'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, AlertCircle, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import SignInModal from '@/components/auth/SignInModal';
import SignUpModal from '@/components/auth/SignUpModal';
import { useToast } from '@/hooks/use-toast';

export default function BookingsPage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const { toast } = useToast();

  const bookings = [
    {
      id: 'BK001',
      hotelName: 'Grand Plaza Hotel',
      location: 'New York, NY',
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkIn: '2025-02-15',
      checkOut: '2025-02-18',
      guests: 2,
      roomType: 'Deluxe King Room',
      totalAmount: 897,
      status: 'confirmed',
      bookingDate: '2025-01-10'
    },
    {
      id: 'BK002',
      hotelName: 'Ocean View Resort',
      location: 'Miami, FL',
      image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkIn: '2025-03-20',
      checkOut: '2025-03-25',
      guests: 4,
      roomType: 'Ocean Suite',
      totalAmount: 2125,
      status: 'pending',
      bookingDate: '2025-01-08'
    },
    {
      id: 'BK003',
      hotelName: 'Mountain Lodge',
      location: 'Aspen, CO',
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkIn: '2024-12-20',
      checkOut: '2024-12-23',
      guests: 2,
      roomType: 'Mountain View Room',
      totalAmount: 585,
      status: 'completed',
      bookingDate: '2024-11-15'
    },
    {
      id: 'BK004',
      hotelName: 'City Center Hotel',
      location: 'Los Angeles, CA',
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkIn: '2024-11-10',
      checkOut: '2024-11-12',
      guests: 1,
      roomType: 'Standard Room',
      totalAmount: 320,
      status: 'cancelled',
      bookingDate: '2024-10-25'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  const filterBookings = (status: string) => {
    if (status === 'all') return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle authentication
  const handleSignIn = () => {
    setShowSignInModal(true);
  };

  const handleSignUp = () => {
    setShowSignUpModal(true);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HB</span>
              </div>
              <span className="text-xl font-bold text-gray-900">HotelBooker</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors">
                Home
              </Link>
              <Link href="/hotels" className="text-gray-700 hover:text-amber-600 transition-colors">
                Hotels
              </Link>
              <Link href="/bookings" className="text-amber-600 font-medium">
                My Bookings
              </Link>
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Welcome!</span>
                  </div>
                  <Button variant="outline" onClick={handleSignOut} size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" onClick={handleSignIn}>Sign In</Button>
                  <Button 
                    className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                    onClick={handleSignUp}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your hotel reservations and travel history</p>
        </div>

        {!isSignedIn ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to view your bookings</h3>
            <p className="text-gray-600 mb-6">Please sign in to access your booking history and manage your reservations.</p>
            <div className="space-x-4">
              <Button variant="outline" onClick={handleSignIn}>Sign In</Button>
              <Button 
                className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </div>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-6">
                {filterBookings(tab).length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-600 mb-6">You don't have any {tab === 'all' ? '' : tab} bookings yet.</p>
                    <Link href="/hotels">
                      <Button className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800">Browse Hotels</Button>
                    </Link>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {filterBookings(tab).map((booking) => (
                      <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="md:flex">
                          <div className="md:w-1/4">
                            <img
                              src={booking.image}
                              alt={booking.hotelName}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                          <CardContent className="md:w-3/4 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                  {booking.hotelName}
                                </h3>
                                <div className="flex items-center text-gray-600 mb-2">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  <span className="text-sm">{booking.location}</span>
                                </div>
                                <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">Check-in</p>
                                  <p className="text-sm text-gray-600">{formatDate(booking.checkIn)}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">Check-out</p>
                                  <p className="text-sm text-gray-600">{formatDate(booking.checkOut)}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">Guests</p>
                                  <p className="text-sm text-gray-600">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                              <div>
                                <p className="text-sm text-gray-600">{booking.roomType}</p>
                                <p className="text-lg font-semibold text-gray-900">${booking.totalAmount}</p>
                              </div>
                              <div className="space-x-2">
                                {booking.status === 'confirmed' && (
                                  <>
                                    <Button variant="outline">Modify</Button>
                                    <Button variant="outline" className="text-red-600 hover:text-red-700">
                                      Cancel
                                    </Button>
                                  </>
                                )}
                                <Button className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800">View Details</Button>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Authentication Modals */}
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)}
        onSwitchToSignUp={() => {
          setShowSignInModal(false);
          setShowSignUpModal(true);
        }}
      />
      
      <SignUpModal 
        isOpen={showSignUpModal} 
        onClose={() => setShowSignUpModal(false)}
        onSwitchToSignIn={() => {
          setShowSignUpModal(false);
          setShowSignInModal(true);
        }}
      />
    </div>
  );
}