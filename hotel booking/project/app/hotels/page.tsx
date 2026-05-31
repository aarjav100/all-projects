'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Filter, MapPin, Star, Wifi, Car, Coffee, Waves, Heart, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
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

interface Hotel {
  _id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  amenities: string[];
  description: string;
}

export default function HotelsPage() {
  const [priceRange, setPriceRange] = useState([100, 500]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{id: number, name: string, location: string, type: string}>>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<string>('any');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const amenityOptions = [
    { id: 'wifi', label: 'Free WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'restaurant', label: 'Restaurant', icon: Coffee },
    { id: 'pool', label: 'Pool', icon: Waves },
  ];

  // Fetch hotels from API
  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      // Add search query
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      // Add price range
      params.append('minPrice', priceRange[0].toString());
      params.append('maxPrice', priceRange[1].toString());
      
      // Add rating filter
      if (minRating !== 'any') {
        params.append('rating', minRating);
      }
      
      // Add amenities filter
      if (selectedAmenities.length > 0) {
        params.append('amenities', selectedAmenities.join(','));
      }
      
      // Add sort parameter
      params.append('sortBy', sortBy);
      
      const response = await fetch(`/api/hotels?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setHotels(data.data);
      } else {
        setError(data.message || 'Failed to fetch hotels');
        toast({
          title: "Error",
          description: data.message || 'Failed to fetch hotels',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError('Failed to fetch hotels');
      toast({
        title: "Error",
        description: 'Failed to fetch hotels',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotels when component mounts or filters change
  useEffect(() => {
    fetchHotels();
  }, [searchQuery, priceRange, minRating, selectedAmenities, sortBy]);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
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
      setSearchQuery(suggestion);
    } else {
      setSearchQuery(`${suggestion.name}, ${suggestion.location}`);
    }
    setShowSuggestions(false);
  };

  // Load search parameters from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, []);

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

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      case 'restaurant': return <Coffee className="w-4 h-4" />;
      case 'pool': return <Waves className="w-4 h-4" />;
      default: return null;
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  // Apply all filters
  const applyFilters = () => {
    toast({
      title: "Filters Applied",
      description: "Your search filters have been updated.",
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceRange([100, 500]);
    setSelectedAmenities([]);
    setMinRating('any');
    setSearchQuery('');
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
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
              <Link href="/hotels" className="text-amber-600 font-medium">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="p-6 sticky top-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6 relative" ref={searchRef}>
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Hotel name or location..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.trim().length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
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
                    {suggestions.length === 0 && filteredDestinations.length === 0 && searchQuery.trim().length > 0 && (
                      <div className="p-4 text-center text-gray-500">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000}
                  min={50}
                  step={25}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any rating</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    <SelectItem value="3.0">3.0+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Amenities</label>
                <div className="space-y-3">
                  {amenityOptions.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={selectedAmenities.includes(amenity.id)}
                        onCheckedChange={() => toggleAmenity(amenity.id)}
                      />
                      <label
                        htmlFor={amenity.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                      >
                        <amenity.icon className="w-4 h-4 mr-2" />
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </Card>
          </div>

          {/* Hotels List */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : `${hotels.length} Hotels Found`}
              </h1>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3 bg-gray-200 animate-pulse h-64 md:h-full"></div>
                      <CardContent className="md:w-2/3 p-6">
                        <div className="space-y-4">
                          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading hotels</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button 
                  className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                  onClick={fetchHotels}
                >
                  Try Again
                </Button>
              </Card>
            ) : hotels.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? `No hotels match your search for "${searchQuery}"` : 'Try adjusting your search criteria or filters.'}
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                    className="mr-2"
                  >
                    Clear Search
                  </Button>
                )}
                <Button 
                  className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                  onClick={clearFilters}
                >
                  View All Hotels
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {hotels.map((hotel) => (
                  <Card key={hotel._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="md:flex">
                      <div className="md:w-1/3 relative">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-64 md:h-full object-cover"
                        />
                        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                          <Heart className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      <CardContent className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{hotel.name}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{hotel.location}</span>
                            </div>
                          </div>
                          <Badge className="bg-white text-gray-900 shadow-lg border">
                            <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                            {hotel.rating}
                          </Badge>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">{hotel.description}</p>

                        <div className="flex items-center mb-4">
                          <span className="text-sm text-gray-600 mr-4">{hotel.reviews} reviews</span>
                          <div className="flex space-x-2">
                            {hotel.amenities.slice(0, 4).map((amenity) => (
                              <div key={amenity} className="p-1.5 bg-gray-100 rounded-lg" title={amenity}>
                                {getAmenityIcon(amenity)}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">${hotel.price}</div>
                            <div className="text-sm text-gray-600">per night</div>
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline">View Details</Button>
                            <Button 
                              className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                              onClick={() => handleBookNow(hotel)}
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <Button variant="outline" disabled>Previous</Button>
                <Button className="bg-gradient-to-r from-amber-600 to-orange-700 text-white">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </div>
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

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        hotel={selectedHotel}
      />
    </div>
  );
}