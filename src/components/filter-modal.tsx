"use client";

import { useState, useEffect } from "react";
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
import { getFilterMetadata, type FilterMetadata } from "@/lib/actions/filters";
import { type SearchFilters } from "@/lib/actions/listings";
import { toast } from "sonner";

interface FilterModalProps {
  onApplyFilters: (filters: SearchFilters) => void;
}

export default function FilterModal({ onApplyFilters }: FilterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 1000],
    location: "",
    propertyType: [],
    amenities: [],
    maxGuests: 10,
    instantBook: false,
  });
  const [filterMetadata, setFilterMetadata] = useState<FilterMetadata | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Load filter metadata when modal opens
  useEffect(() => {
    if (isOpen && !filterMetadata) {
      const loadFilters = async () => {
        try {
          setLoading(true);
          const metadata = await getFilterMetadata();
          setFilterMetadata(metadata);
        } catch (_error) {
          toast.error("Failed to load filter options");
        } finally {
          setLoading(false);
        }
      };

      loadFilters();
    }
  }, [isOpen, filterMetadata]);

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
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading price range...
              </div>
            ) : filterMetadata?.priceRange ? (
              <div className="px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      priceRange: value as [number, number],
                    })
                  }
                  max={filterMetadata.priceRange.max}
                  min={filterMetadata.priceRange.min}
                  step={filterMetadata.priceRange.step || 10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>${filters.priceRange?.[0] || 0}</span>
                  <span>${filters.priceRange?.[1] || 1000}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Price range not available
              </div>
            )}
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
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading property types...
              </div>
            ) : filterMetadata?.propertyTypes ? (
              <div className="grid grid-cols-2 gap-3">
                {filterMetadata.propertyTypes.options.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={filters.propertyType?.includes(type.value) || false}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            propertyType: [...(filters.propertyType || []), type.value],
                          });
                        } else {
                          setFilters({
                            ...filters,
                            propertyType: (filters.propertyType || []).filter(
                              (t) => t !== type.value
                            ),
                          });
                        }
                      }}
                    />
                    <Label htmlFor={type.value} className="text-sm font-normal">
                      {type.label} ({type.count})
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No property types available
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label>Amenities</Label>
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading amenities...
              </div>
            ) : filterMetadata?.amenities ? (
              <div className="grid grid-cols-2 gap-3">
                {filterMetadata.amenities.options.map((amenity) => (
                  <div
                    key={amenity.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={amenity.value}
                      checked={filters.amenities?.includes(amenity.value) || false}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            amenities: [...(filters.amenities || []), amenity.value],
                          });
                        } else {
                          setFilters({
                            ...filters,
                            amenities: (filters.amenities || []).filter(
                              (a) => a !== amenity.value
                            ),
                          });
                        }
                      }}
                    />
                    <Label
                      htmlFor={amenity.value}
                      className="text-sm font-normal"
                    >
                      {amenity.label} ({amenity.count})
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No amenities available
              </div>
            )}
          </div>

          {/* Max Guests */}
          <div className="space-y-2">
            <Label htmlFor="maxGuests">Maximum Guests</Label>
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading guest options...
              </div>
            ) : filterMetadata?.guestCapacity ? (
              <div className="grid grid-cols-2 gap-3">
                {filterMetadata.guestCapacity.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={option.value}
                      checked={(filters.maxGuests || 0) >= parseInt(option.value)}
                      onCheckedChange={(_checked) => {
                        if (_checked) {
                          setFilters({
                            ...filters,
                            maxGuests: parseInt(option.value),
                          });
                        }
                      }}
                    />
                    <Label
                      htmlFor={option.value}
                      className="text-sm font-normal"
                    >
                      {option.label} ({option.count})
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </div>

          {/* Instant Book */}
          <div className="space-y-3">
            <Label>Instant Book</Label>
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading instant book options...
              </div>
            ) : filterMetadata?.instantBook ? (
              <div className="space-y-2">
                {filterMetadata.instantBook.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={option.value}
                      checked={
                        option.value === "true"
                          ? filters.instantBook
                          : !filters.instantBook
                      }
                      onCheckedChange={(_checked) => {
                        setFilters({
                          ...filters,
                          instantBook: option.value === "true",
                        });
                      }}
                    />
                    <Label
                      htmlFor={option.value}
                      className="text-sm font-normal"
                    >
                      {option.label} ({option.count})
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
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
