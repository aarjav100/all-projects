'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Users, Star, Wifi, Car, Coffee, Waves, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import SignInModal from '@/components/auth/SignInModal';
import SignUpModal from '@/components/auth/SignUpModal';
import BookingModal from '@/components/booking/BookingModal';
import { useToast } from '@/hooks/use-toast';

// Mock hotel data for suggestions
const allHotels = [
  { id: 1, name: 'Grand Plaza Hotel', location: 'New York, NY', type: 'hotel' },
  { id: 2, name: 'Ocean View Resort', location: 'Miami, FL', type: 'resort' },
  { id: 3, name: 'Mountain Lodge', location: 'Aspen, CO', type: 'lodge' },
  { id: 4, name: 'Urban Boutique Hotel', location: 'San Francisco, CA', type: 'hotel' },
  { id: 5, name: 'Historic Inn', location: 'Charleston, SC', type: 'inn' },
  { id: 6, name: 'Desert Oasis Resort', location: 'Phoenix, AZ', type: 'resort' },
  { id: 7, name: 'Seaside Hotel', location: 'Los Angeles, CA', type: 'hotel' },
  { id: 8, name: 'Downtown Suites', location: 'Chicago, IL', type: 'hotel' },
  { id: 9, name: 'Riverside Lodge', location: 'Denver, CO', type: 'lodge' },
  { id: 10, name: 'Garden Inn', location: 'Seattle, WA', type: 'inn' },
];

// Popular destinations
const popularDestinations = [
  'New York, NY',
  'Miami, FL',
  'Los Angeles, CA',
  'Chicago, IL',
  'San Francisco, CA',
  'Las Vegas, NV',
  'Orlando, FL',
  'Seattle, WA',
  'Denver, CO',
  'Austin, TX'
];

export default function Home() {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{id: number, name: string, location: string, type: string}>>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<string[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const featuredHotels = [
    {
      id: 1,
      name: 'Grand Plaza Hotel',
      location: 'New York, NY',
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 299,
      rating: 4.8,
      reviews: 1247,
      amenities: ['wifi', 'parking', 'pool', 'restaurant']
    },
    {
      id: 2,
      name: 'Ocean View Resort',
      location: 'Miami, FL',
      image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 425,
      rating: 4.9,
      reviews: 892,
      amenities: ['wifi', 'pool', 'beach', 'spa']
    },
    {
      id: 3,
      name: 'Mountain Lodge',
      location: 'Aspen, CO',
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 195,
      rating: 4.7,
      reviews: 654,
      amenities: ['wifi', 'parking', 'restaurant', 'fireplace']
    }
  ];

  // Handle search input changes
  const handleDestinationChange = (value: string) => {
    setSearchData({...searchData, destination: value});
    
    if (value.trim().length > 0) {
      // Filter hotels by name or location
      const hotelMatches = allHotels.filter(hotel => 
        hotel.name.toLowerCase().includes(value.toLowerCase()) ||
        hotel.location.toLowerCase().includes(value.toLowerCase())
      );
      
      // Filter popular destinations
      const destinationMatches = popularDestinations.filter(dest => 
        dest.toLowerCase().includes(value.toLowerCase())
      );
      
      setSuggestions(hotelMatches);
      setFilteredDestinations(destinationMatches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setFilteredDestinations([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: {name: string, location: string} | string) => {
    if (typeof suggestion === 'string') {
      setSearchData({...searchData, destination: suggestion});
    } else {
      setSearchData({...searchData, destination: `${suggestion.name}, ${suggestion.location}`});
    }
    setShowSuggestions(false);
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchData.destination.trim()) {
      // Navigate to hotels page with search parameters
      const params = new URLSearchParams({
        search: searchData.destination,
        checkIn: searchData.checkIn,
        checkOut: searchData.checkOut,
        guests: searchData.guests.toString()
      });
      window.location.href = `/hotels?${params.toString()}`;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleSuccessfulSignIn = () => {
    setIsSignedIn(true);
    setShowSignInModal(false);
  };

  // Handle booking
  const handleBookNow = (hotel: any) => {
    if (!isSignedIn) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to book a hotel.",
        variant: "destructive",
      });
      setShowSignInModal(true);
      return;
    }
    
    setSelectedHotel(hotel);
    setShowBookingModal(true);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      case 'restaurant': return <Coffee className="w-4 h-4" />;
      case 'pool': return <Waves className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HB</span>
              </div>
              <span className="text-xl font-bold text-gray-900">HotelBooker</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/hotels" className="text-gray-700 hover:text-amber-600 transition-colors">
                Hotels
              </Link>
              <Link href="/bookings" className="text-gray-700 hover:text-amber-600 transition-colors">
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

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent"> Stay</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover amazing hotels worldwide. Compare prices, read reviews, and book with confidence.
          </p>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2 relative" ref={searchRef}>
                  <label className="text-sm font-medium text-gray-700">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Where are you going?"
                      className="pl-10"
                      value={searchData.destination}
                      onChange={(e) => handleDestinationChange(e.target.value)}
                      onFocus={() => {
                        if (searchData.destination.trim().length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                    />
                    {searchData.destination && (
                      <button
                        onClick={() => {
                          setSearchData({...searchData, destination: ''});
                          setShowSuggestions(false);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Search Suggestions */}
                  {showSuggestions && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                      {/* Hotel Suggestions */}
                      {suggestions.length > 0 && (
                        <div className="p-2">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-1">Hotels</div>
                          {suggestions.slice(0, 5).map((hotel) => (
                            <button
                              key={hotel.id}
                              onClick={() => handleSuggestionSelect(hotel)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center space-x-3"
                            >
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-gray-900">{hotel.name}</div>
                                <div className="text-sm text-gray-500">{hotel.location}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Popular Destinations */}
                      {filteredDestinations.length > 0 && (
                        <div className="p-2 border-t border-gray-100">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-1">Popular Destinations</div>
                          {filteredDestinations.slice(0, 5).map((destination, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionSelect(destination)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center space-x-3"
                            >
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="font-medium text-gray-900">{destination}</div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* No results */}
                      {suggestions.length === 0 && filteredDestinations.length === 0 && searchData.destination.trim().length > 0 && (
                        <div className="p-4 text-center text-gray-500">
                          No results found for "{searchData.destination}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={searchData.checkIn}
                      onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={searchData.checkOut}
                      onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      className="pl-10"
                      value={searchData.guests}
                      onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <Button 
                size="lg" 
                className="w-full md:w-auto bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4 mr-2" />
                Search Hotels
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Hotels</h2>
            <p className="text-lg text-gray-600">Handpicked accommodations for your perfect stay</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white text-gray-900 shadow-lg">
                      <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                      {hotel.rating}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="text-sm text-gray-600 mr-2">{hotel.reviews} reviews</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      {hotel.amenities.slice(0, 4).map((amenity) => (
                        <div key={amenity} className="p-2 bg-gray-100 rounded-lg">
                          {getAmenityIcon(amenity)}
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${hotel.price}</div>
                      <div className="text-sm text-gray-600">per night</div>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                    onClick={() => handleBookNow(hotel)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HotelBooker?</h2>
            <p className="text-lg text-gray-600">Experience the difference with our premium booking service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Search</h3>
              <p className="text-gray-600">Find the perfect hotel with our advanced search and filtering options.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">Get the best deals with our price comparison and exclusive offers.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our dedicated support team is here to help you anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-amber-900 via-orange-900 to-yellow-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HB</span>
                </div>
                <span className="text-xl font-bold">HotelBooker</span>
              </div>
              <p className="text-gray-400">Your trusted partner for memorable stays worldwide.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-amber-200">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-amber-200">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-amber-200">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-200">
            <p>&copy; 2025 HotelBooker. All rights reserved.</p>
          </div>
        </div>
      </footer>

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

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        hotel={selectedHotel}
      />
    </div>
  );
}