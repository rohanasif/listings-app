"use client";

import { useState, useEffect } from "react";
import { MapPin, Heart, Star } from "lucide-react";
import MapSidebar from "@/components/map-sidebar";
import SearchBar from "@/components/search-bar";
import {
  getListings,
  type Location,
  type SearchFilters,
} from "@/lib/actions/listings";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function HomeComponent() {
  const [showMap, setShowMap] = useState(false);
  const [listings, setListings] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial listings on component mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await getListings();
        setListings(response.listings);
      } catch (_error) {
        toast.error("Failed to load listings", {
          description: "Please try again later",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleToggleMap = (show: boolean) => {
    setShowMap(show);
  };

  return (
    <div className="flex-1 min-h-screen">
      <SearchBar
        listings={listings}
        showMap={showMap}
        onToggleMap={handleToggleMap}
        onSearchResults={setListings}
        onApplyFilters={async (filters: SearchFilters) => {
          try {
            const response = await getListings(filters);
            setListings(response.listings);
            toast.success("Filters applied", {
              description: `Found ${response.listings.length} properties`,
              duration: 3000,
            });
          } catch (_error) {
            toast.error("Failed to apply filters");
          }
        }}
      />
      <div className="w-full p-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-4 animate-pulse"></div>
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-4"></div>
              <p className="text-muted-foreground text-lg">
                No properties found
              </p>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search criteria
              </p>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listing/${listing.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Property Image */}
                <div className="relative h-48">
                  <Image
                    src={listing.image}
                    alt={listing.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1">
                    <Heart className="w-4 h-4 text-gray-600" />
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
                      ${listing.price}/night
                    </span>
                  </div>
                  <h3 className="font-medium text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {listing.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{listing.maxGuests}+ Guests</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-600">{listing.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Map Sidebar */}
      <MapSidebar
        isVisible={showMap}
        listings={listings}
        onClose={() => setShowMap(false)}
      />
    </div>
  );
}
