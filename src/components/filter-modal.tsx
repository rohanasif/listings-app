"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter as FilterIcon } from "lucide-react";

interface FilterModalProps {
  onApplyFilters: (filters: FilterData) => void;
}

interface FilterData {
  priceRange: number[];
  location: string;
  propertyType: string[];
  amenities: string[];
  maxGuests: number;
  instantBook: boolean;
}

export default function FilterModal({ onApplyFilters }: FilterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterData>({
    priceRange: [0, 1000],
    location: "",
    propertyType: [],
    amenities: [],
    maxGuests: 10,
    instantBook: false,
  });

  const propertyTypes = [
    "Beach House",
    "Mountain Cabin",
    "Urban Loft",
    "Country Villa",
    "Lakeside Cottage",
    "Desert Oasis",
  ];

  const amenities = [
    "WiFi",
    "Kitchen",
    "Parking",
    "Pool",
    "Hot Tub",
    "Fireplace",
    "Air Conditioning",
    "Pet Friendly",
  ];

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      location: "",
      propertyType: [],
      amenities: [],
      maxGuests: 10,
      instantBook: false,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-12 px-4">
          <FilterIcon className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Properties</DialogTitle>
          <DialogDescription>
            Customize your search to find the perfect property.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price Range */}
          <div className="space-y-3">
            <Label>Price Range (per hour)</Label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  setFilters({ ...filters, priceRange: value as number[] })
                }
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter city, state, or country"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
          </div>

          {/* Property Type */}
          <div className="space-y-3">
            <Label>Property Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {propertyTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filters.propertyType.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters({
                          ...filters,
                          propertyType: [...filters.propertyType, type],
                        });
                      } else {
                        setFilters({
                          ...filters,
                          propertyType: filters.propertyType.filter(
                            (t) => t !== type
                          ),
                        });
                      }
                    }}
                  />
                  <Label htmlFor={type} className="text-sm font-normal">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-3">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters({
                          ...filters,
                          amenities: [...filters.amenities, amenity],
                        });
                      } else {
                        setFilters({
                          ...filters,
                          amenities: filters.amenities.filter(
                            (a) => a !== amenity
                          ),
                        });
                      }
                    }}
                  />
                  <Label htmlFor={amenity} className="text-sm font-normal">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Max Guests */}
          <div className="space-y-2">
            <Label htmlFor="maxGuests">Maximum Guests</Label>
            <Input
              id="maxGuests"
              type="number"
              min="1"
              max="50"
              value={filters.maxGuests}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  maxGuests: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>

          {/* Instant Book */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="instantBook"
              checked={filters.instantBook}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, instantBook: checked as boolean })
              }
            />
            <Label htmlFor="instantBook" className="text-sm font-normal">
              Instant Book Available
            </Label>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
