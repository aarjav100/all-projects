
import React, { useState, useEffect } from 'react';
import { MapPin, Store, Navigation, Clock, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Shop {
  id: number;
  name: string;
  address: string;
  distance: number;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

const NearbyShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock shop data - in a real app, this would come from an API
  const mockShops: Shop[] = [
    {
      id: 1,
      name: "BriskKart Downtown",
      address: "123 Main St, Downtown",
      distance: 0.8,
      phone: "(555) 123-4567",
      hours: "9:00 AM - 9:00 PM",
      lat: 40.7128,
      lng: -74.0060
    },
    {
      id: 2,
      name: "BriskKart Mall Center",
      address: "456 Mall Ave, Shopping District",
      distance: 1.2,
      phone: "(555) 234-5678",
      hours: "10:00 AM - 10:00 PM",
      lat: 40.7589,
      lng: -73.9851
    },
    {
      id: 3,
      name: "BriskKart Express",
      address: "789 Quick St, Business District",
      distance: 2.1,
      phone: "(555) 345-6789",
      hours: "8:00 AM - 11:00 PM",
      lat: 40.7488,
      lng: -73.9857
    },
    {
      id: 4,
      name: "BriskKart Superstore",
      address: "321 Mega Blvd, Suburban Area",
      distance: 3.5,
      phone: "(555) 456-7890",
      hours: "7:00 AM - 11:00 PM",
      lat: 40.7282,
      lng: -74.0776
    }
  ];

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Simulate API call to get nearby shops
        setTimeout(() => {
          const shopsWithDistance = mockShops.map(shop => ({
            ...shop,
            distance: calculateDistance(latitude, longitude, shop.lat, shop.lng)
          })).sort((a, b) => a.distance - b.distance);
          
          setShops(shopsWithDistance);
          setLoading(false);
        }, 1000);
      },
      (error) => {
        setError("Unable to retrieve your location. Please check your browser settings.");
        setLoading(false);
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const openInMaps = (shop: Shop) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    // Load mock data initially
    setShops(mockShops);
  }, []);

  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPin className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Find Nearby Stores</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Discover BriskKart locations near you for quick pickup and in-store shopping
        </p>
        <Button 
          onClick={getCurrentLocation} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          <Navigation className="h-4 w-4" />
          {loading ? 'Finding Your Location...' : 'Use My Location'}
        </Button>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>

      {userLocation && (
        <div className="text-center mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <MapPin className="h-5 w-5 text-green-600 inline mr-2" />
          <span className="text-green-700 dark:text-green-300">
            Location found! Showing stores near you.
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {shops.map((shop) => (
          <Card key={shop.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                {shop.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm">{shop.address}</p>
                  <p className="text-sm text-primary font-medium">
                    {shop.distance.toFixed(1)} miles away
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{shop.hours}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{shop.phone}</p>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openInMaps(shop)}
                  className="flex-1"
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  Directions
                </Button>
                <Button 
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(`tel:${shop.phone}`, '_self')}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {shops.length === 0 && !loading && (
        <div className="text-center py-8">
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No stores found in your area.</p>
        </div>
      )}
    </div>
  );
};

export default NearbyShops;
