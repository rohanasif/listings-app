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
import { useState } from "react";
import FilterModal from "@/components/filter-modal";
import AIPhotoSearchModal from "@/components/ai-photo-search-modal";

interface Location {
  id: number;
  name: string;
  location: string;
  price: string;
  coordinates: [number, number];
}

interface SearchBarProps {
  listings: Location[];
  showMap: boolean;
  onToggleMap: (show: boolean) => void;
}

export default function SearchBar({
  listings,
  showMap,
  onToggleMap,
}: SearchBarProps) {
  const [activeFilters, setActiveFilters] = useState([
    "Filter 1",
    "Filter 2",
    "Filter 3",
  ]);

  const removeFilter = (filterToRemove: string) => {
    setActiveFilters(
      activeFilters.filter((filter) => filter !== filterToRemove)
    );
  };

  const handleMapToggle = () => {
    onToggleMap(!showMap);
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
            placeholder="Search"
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Location Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12 px-4">
              <MapPin className="h-4 w-4 mr-2" />
              California, USA
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>California, USA</DropdownMenuItem>
            <DropdownMenuItem>New York, USA</DropdownMenuItem>
            <DropdownMenuItem>Texas, USA</DropdownMenuItem>
            <DropdownMenuItem>Florida, USA</DropdownMenuItem>
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
        <FilterModal
          onApplyFilters={(filters) => console.log("Applied filters:", filters)}
        />
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
          Showing 1-{listings.length} of {listings.length} wedding locations
          across California, USA
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
