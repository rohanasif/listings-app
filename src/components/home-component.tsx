"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import MapSidebar from "@/components/map-sidebar";
import SearchBar from "@/components/search-bar";

interface Location {
  id: number;
  name: string;
  location: string;
  price: string;
  image: string;
  coordinates: [number, number]; // [latitude, longitude]
}

export default function HomeComponent() {
  const [showMap, setShowMap] = useState(false);

  const sampleListings: Location[] = [
    {
      id: 1,
      name: "Alpine Lodge Getaway",
      location: "WHISTLER, CANADA",
      price: "$350/hr",
      image: "/images/logo.png",
      coordinates: [50.1163, -122.9574], // Whistler coordinates
    },
    {
      id: 2,
      name: "Coastal Paradise Retreat",
      location: "MALIBU, CALIFORNIA",
      price: "$450/hr",
      image: "/images/logo.png",
      coordinates: [34.0259, -118.7798], // Malibu coordinates
    },
    {
      id: 3,
      name: "Rainforest Cabin Experience",
      location: "OLYMPIC PENINSULA, WA",
      price: "$280/hr",
      image: "/images/logo.png",
      coordinates: [47.7511, -120.7401], // Olympic Peninsula coordinates
    },
    {
      id: 4,
      name: "Mountain View Estate",
      location: "ASPEN, COLORADO",
      price: "$520/hr",
      image: "/images/logo.png",
      coordinates: [39.1911, -106.8175], // Aspen coordinates
    },
    {
      id: 5,
      name: "Desert Oasis Villa",
      location: "PALM SPRINGS, CA",
      price: "$380/hr",
      image: "/images/logo.png",
      coordinates: [33.8303, -116.5453], // Palm Springs coordinates
    },
    {
      id: 6,
      name: "Lakeside Cottage",
      location: "LAKE TAHOE, CA",
      price: "$420/hr",
      image: "/images/logo.png",
      coordinates: [39.0968, -120.0324], // Lake Tahoe coordinates
    },
    {
      id: 7,
      name: "Vineyard Manor",
      location: "NAPA VALLEY, CA",
      price: "$480/hr",
      image: "/images/logo.png",
      coordinates: [38.2975, -122.2869], // Napa Valley coordinates
    },
    {
      id: 8,
      name: "Beachfront Bungalow",
      location: "SANTA BARBARA, CA",
      price: "$550/hr",
      image: "/images/logo.png",
      coordinates: [34.4208, -119.6982], // Santa Barbara coordinates
    },
  ];

  const handleToggleMap = (show: boolean) => {
    setShowMap(show);
  };

  return (
    <div className="flex-1 min-h-screen">
      <SearchBar
        listings={sampleListings}
        showMap={showMap}
        onToggleMap={handleToggleMap}
      />
      <div className="w-full p-6">
        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleListings.map((listing) => (
            <div
              key={listing.id}
              className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow border"
            >
              {/* Property Image */}
              <div className="relative h-48">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm">Property Image</p>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {listing.location}
                  </div>
                  <span className="text-green-600 font-semibold text-sm">
                    {listing.price}
                  </span>
                </div>
                <h3 className="font-medium text-lg">{listing.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Sidebar */}
      <MapSidebar isVisible={showMap} listings={sampleListings} onClose={() => setShowMap(false)} />
    </div>
  );
}
