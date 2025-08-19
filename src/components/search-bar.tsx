"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, MapPin, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import FilterModal from "@/components/filter-modal";
import AIPhotoSearchModal from "@/components/ai-photo-search-modal";
import { getPopularLocations, searchListings } from "@/lib/actions";
import { Location, SearchFilters } from "@/lib/actions/listings";
import { LocationData } from "@/lib/actions/locations";

interface SearchBarProps {
  listings: Location[];
  showMap: boolean;
  onToggleMap: (show: boolean) => void;
  onSearchResults?: (listings: Location[]) => void;
  onLocationChange?: (location: string) => void;
  onApplyFilters?: (filters: SearchFilters) => void;
}

export default function SearchBar({
  listings,
  showMap,
  onToggleMap,
  onSearchResults,
  onLocationChange,
  onApplyFilters,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("California, USA");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const [popularLocations, setPopularLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);

  // Load popular locations on mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locations = await getPopularLocations();
        setPopularLocations(locations);
      } catch (_error) {
        toast.error("Failed to load locations");
      }
    };

    loadLocations();
  }, []);

  const removeFilter = (filterToRemove: string) => {
    setActiveFilters(
      activeFilters.filter((filter) => filter !== filterToRemove)
    );
  };

  const handleMapToggle = () => {
    onToggleMap(!showMap);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        setLoading(true);
        const response = await searchListings(searchQuery.trim());
        onSearchResults?.(response.listings);
        toast.success("Search Complete", {
          description: `Found ${response.listings.length} properties`,
          duration: 3000,
        });
      } catch (_error) {
        toast.error("Search failed", {
          description: "Please try again",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLocationSelect = async (location: string) => {
    setSelectedLocation(location);
    onLocationChange?.(location);
    
    // Trigger a search with the new location
    try {
      setLoading(true);
      const response = await searchListings("", { location });
      onSearchResults?.(response.listings);
      toast.success("Location updated", {
        description: `Found ${response.listings.length} properties in ${location}`,
        duration: 2000,
      });
    } catch (_error) {
      toast.error("Failed to search by location");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full p-6">
      {/* Main Search Bar */}
      <div className="flex items-center gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="search-input"
            type="text"
            placeholder="Search properties, locations, or styles..."
            className="pl-10 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Location Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12 px-4">
              <MapPin className="h-4 w-4 mr-2" />
              {selectedLocation}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {loading ? (
              <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
            ) : popularLocations.length === 0 ? (
              <DropdownMenuItem disabled>
                No locations available
              </DropdownMenuItem>
            ) : (
              popularLocations.map((location, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() =>
                    handleLocationSelect(`${location.name}, ${location.state}`)
                  }
                >
                  {location.name}, {location.state}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* AI Photo Search Modal */}
        <AIPhotoSearchModal
          onSearch={(imageFile) => {
            console.log("AI Photo Search triggered with:", imageFile.name);
            // TODO: Implement AI photo search functionality
          }}
        />

        {/* Filter Modal */}
        <FilterModal onApplyFilters={(filters) => onApplyFilters?.(filters)} />
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-white px-3 py-2 rounded-lg text-sm border border-gray-200"
            >
              {filter}
              <button
                onClick={() => removeFilter(filter)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Results Count and Map Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm">
          {loading
            ? "Searching..."
            : `Showing 1-${listings.length} of ${listings.length} wedding locations across ${selectedLocation}`}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">Show Map</span>
          <button
            onClick={handleMapToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showMap ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showMap ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
