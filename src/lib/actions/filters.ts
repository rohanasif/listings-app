"use server";

import { getListings } from "./listings";

// Types
export interface FilterOption {
  value: string;
  label: string;
  count: number;
  selected?: boolean;
}

export interface FilterGroup {
  id: string;
  name: string;
  type: "checkbox" | "radio" | "range" | "select";
  options: FilterOption[];
  multiple?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export interface FilterMetadata {
  propertyTypes: FilterGroup;
  amenities: FilterGroup;
  priceRange: FilterGroup;
  guestCapacity: FilterGroup;
  instantBook: FilterGroup;
  locations: FilterGroup;
}

export interface AppliedFilters {
  propertyType: string[];
  amenities: string[];
  priceRange: [number, number];
  maxGuests: number;
  instantBook: boolean;
  location: string;
  coordinates?: [number, number];
  radius?: number;
}

export interface FilterStats {
  totalListings: number;
  filteredCount: number;
  priceDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  propertyTypeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  amenityDistribution: Array<{
    amenity: string;
    count: number;
    percentage: number;
  }>;
}

// Available filter options
const propertyTypes = [
  "Beach House",
  "Mountain Cabin",
  "Urban Loft",
  "Country Villa",
  "Lakeside Cottage",
  "Desert Oasis",
  "Cabin",
  "Mountain Villa",
  "Desert Villa",
  "Cottage",
  "Manor",
  "Bungalow",
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
  "Beach Access",
  "Hiking Trails",
  "Ski Access",
  "Golf Course",
  "Lake Access",
  "Kayaks",
  "BBQ",
  "Wine Cellar",
  "Vineyard Tours",
  "Surfboards",
  "Outdoor Shower",
];

// Server Actions
export async function getFilterMetadata(): Promise<FilterMetadata> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Get all listings to calculate counts
    const allListings = await getListings();

    // Calculate property type counts
    const propertyTypeCounts = propertyTypes.map((type) => {
      const count = allListings.listings.filter(
        (listing) => listing.propertyType === type
      ).length;
      return { value: type, label: type, count };
    });

    // Calculate amenity counts
    const amenityCounts = amenities.map((amenity) => {
      const count = allListings.listings.filter((listing) =>
        listing.amenities?.includes(amenity)
      ).length;
      return { value: amenity, label: amenity, count };
    });

    // Calculate price range
    const prices = allListings.listings.map((listing) =>
      parseInt(listing.price.replace(/[^0-9]/g, ""))
    );
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Calculate guest capacity counts
    const guestCounts = [2, 4, 6, 8, 10, 12, 14].map((guests) => {
      const count = allListings.listings.filter(
        (listing) => (listing.maxGuests || 0) >= guests
      ).length;
      return { value: guests.toString(), label: `${guests}+ guests`, count };
    });

    return {
      propertyTypes: {
        id: "propertyType",
        name: "Property Type",
        type: "checkbox",
        options: propertyTypeCounts,
        multiple: true,
      },
      amenities: {
        id: "amenities",
        name: "Amenities",
        type: "checkbox",
        options: amenityCounts,
        multiple: true,
      },
      priceRange: {
        id: "priceRange",
        name: "Price Range",
        type: "range",
        options: [],
        min: minPrice,
        max: maxPrice,
        step: 10,
      },
      guestCapacity: {
        id: "guestCapacity",
        name: "Guest Capacity",
        type: "select",
        options: guestCounts,
        multiple: false,
      },
      instantBook: {
        id: "instantBook",
        name: "Instant Book",
        type: "checkbox",
        options: [
          {
            value: "true",
            label: "Available",
            count: allListings.listings.filter((l) => l.instantBook).length,
          },
          {
            value: "false",
            label: "Not Available",
            count: allListings.listings.filter((l) => !l.instantBook).length,
          },
        ],
        multiple: false,
      },
      locations: {
        id: "locations",
        name: "Popular Locations",
        type: "select",
        options: [
          {
            value: "California",
            label: "California",
            count: allListings.listings.filter((l) =>
              l.location.includes("CALIFORNIA")
            ).length,
          },
          {
            value: "Colorado",
            label: "Colorado",
            count: allListings.listings.filter((l) =>
              l.location.includes("COLORADO")
            ).length,
          },
          {
            value: "Washington",
            label: "Washington",
            count: allListings.listings.filter((l) => l.location.includes("WA"))
              .length,
          },
          {
            value: "Canada",
            label: "Canada",
            count: allListings.listings.filter((l) =>
              l.location.includes("CANADA")
            ).length,
          },
        ],
        multiple: false,
      },
    };
  } catch (_error) {
    throw new Error("Failed to fetch filter metadata");
  }
}

export async function getFilterOptions(
  appliedFilters: Partial<AppliedFilters> = {}
): Promise<FilterMetadata> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Get filtered listings to calculate dynamic counts
    const filteredListings = await getListings(appliedFilters);

    // Recalculate counts based on applied filters
    const propertyTypeCounts = propertyTypes.map((type) => {
      const count = filteredListings.listings.filter(
        (listing) => listing.propertyType === type
      ).length;
      return { value: type, label: type, count };
    });

    const amenityCounts = amenities.map((amenity) => {
      const count = filteredListings.listings.filter((listing) =>
        listing.amenities?.includes(amenity)
      ).length;
      return { value: amenity, label: amenity, count };
    });

    const prices = filteredListings.listings.map((listing) =>
      parseInt(listing.price.replace(/[^0-9]/g, ""))
    );
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

    const guestCounts = [2, 4, 6, 8, 10, 12, 14].map((guests) => {
      const count = filteredListings.listings.filter(
        (listing) => (listing.maxGuests || 0) >= guests
      ).length;
      return { value: guests.toString(), label: `${guests}+ guests`, count };
    });

    return {
      propertyTypes: {
        id: "propertyType",
        name: "Property Type",
        type: "checkbox",
        options: propertyTypeCounts,
        multiple: true,
      },
      amenities: {
        id: "amenities",
        name: "Amenities",
        type: "checkbox",
        options: amenityCounts,
        multiple: true,
      },
      priceRange: {
        id: "priceRange",
        name: "Price Range",
        type: "range",
        options: [],
        min: minPrice,
        max: maxPrice,
        step: 10,
      },
      guestCapacity: {
        id: "guestCapacity",
        name: "Guest Capacity",
        type: "select",
        options: guestCounts,
        multiple: false,
      },
      instantBook: {
        id: "instantBook",
        name: "Instant Book",
        type: "checkbox",
        options: [
          {
            value: "true",
            label: "Available",
            count: filteredListings.listings.filter((l) => l.instantBook)
              .length,
          },
          {
            value: "false",
            label: "Not Available",
            count: filteredListings.listings.filter((l) => !l.instantBook)
              .length,
          },
        ],
        multiple: false,
      },
      locations: {
        id: "locations",
        name: "Popular Locations",
        type: "select",
        options: [
          {
            value: "California",
            label: "California",
            count: filteredListings.listings.filter((l) =>
              l.location.includes("CALIFORNIA")
            ).length,
          },
          {
            value: "Colorado",
            label: "Colorado",
            count: filteredListings.listings.filter((l) =>
              l.location.includes("COLORADO")
            ).length,
          },
          {
            value: "Washington",
            label: "Washington",
            count: filteredListings.listings.filter((l) =>
              l.location.includes("WA")
            ).length,
          },
          {
            value: "Canada",
            label: "Canada",
            count: filteredListings.listings.filter((l) =>
              l.location.includes("CANADA")
            ).length,
          },
        ],
        multiple: false,
      },
    };
  } catch (_error) {
    throw new Error("Failed to fetch filter options");
  }
}

export async function getPropertyTypes(
  appliedFilters: Partial<AppliedFilters> = {}
): Promise<FilterGroup> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const filteredListings = await getListings(appliedFilters);

    const propertyTypeCounts = propertyTypes.map((type) => {
      const count = filteredListings.listings.filter(
        (listing) => listing.propertyType === type
      ).length;
      return { value: type, label: type, count };
    });

    return {
      id: "propertyType",
      name: "Property Type",
      type: "checkbox",
      options: propertyTypeCounts,
      multiple: true,
    };
  } catch (_error) {
    throw new Error("Failed to fetch property types");
  }
}

export async function getAmenities(
  appliedFilters: Partial<AppliedFilters> = {}
): Promise<FilterGroup> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const filteredListings = await getListings(appliedFilters);

    const amenityCounts = amenities.map((amenity) => {
      const count = filteredListings.listings.filter((listing) =>
        listing.amenities?.includes(amenity)
      ).length;
      return { value: amenity, label: amenity, count };
    });

    return {
      id: "amenities",
      name: "Amenities",
      type: "checkbox",
      options: amenityCounts,
      multiple: true,
    };
  } catch (_error) {
    throw new Error("Failed to fetch amenities");
  }
}

export async function getPriceRangeStats(
  appliedFilters: Partial<AppliedFilters> = {}
): Promise<{
  min: number;
  max: number;
  average: number;
  median: number;
  percentiles: {
    p25: number;
    p75: number;
    p90: number;
  };
}> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const filteredListings = await getListings(appliedFilters);
    const prices = filteredListings.listings.map((listing) =>
      parseInt(listing.price.replace(/[^0-9]/g, ""))
    );

    if (prices.length === 0) {
      return {
        min: 0,
        max: 1000,
        average: 0,
        median: 0,
        percentiles: { p25: 0, p75: 0, p90: 0 },
      };
    }

    const sortedPrices = prices.sort((a, b) => a - b);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const average =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const median = sortedPrices[Math.floor(sortedPrices.length / 2)];
    const p25 = sortedPrices[Math.floor(sortedPrices.length * 0.25)];
    const p75 = sortedPrices[Math.floor(sortedPrices.length * 0.75)];
    const p90 = sortedPrices[Math.floor(sortedPrices.length * 0.9)];

    return {
      min,
      max,
      average: Math.round(average),
      median,
      percentiles: { p25, p75, p90 },
    };
  } catch (_error) {
    throw new Error("Failed to fetch price range statistics");
  }
}

export async function getFilterStats(
  appliedFilters: Partial<AppliedFilters> = {}
): Promise<FilterStats> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const allListings = await getListings();
    const filteredListings = await getListings(appliedFilters);

    // Price distribution
    const priceRanges = [
      { min: 0, max: 200, label: "$0 - $200" },
      { min: 200, max: 400, label: "$200 - $400" },
      { min: 400, max: 600, label: "$400 - $600" },
      { min: 600, max: 800, label: "$600+" },
    ];

    const priceDistribution = priceRanges.map((range) => {
      const count = filteredListings.listings.filter((listing) => {
        const price = parseInt(listing.price.replace(/[^0-9]/g, ""));
        return price >= range.min && price < range.max;
      }).length;
      const percentage =
        filteredListings.total > 0 ? (count / filteredListings.total) * 100 : 0;
      return { range: range.label, count, percentage: Math.round(percentage) };
    });

    // Property type distribution
    const propertyTypeDistribution = propertyTypes
      .map((type) => {
        const count = filteredListings.listings.filter(
          (listing) => listing.propertyType === type
        ).length;
        const percentage =
          filteredListings.total > 0
            ? (count / filteredListings.total) * 100
            : 0;
        return { type, count, percentage: Math.round(percentage) };
      })
      .filter((item) => item.count > 0);

    // Amenity distribution
    const amenityDistribution = amenities
      .map((amenity) => {
        const count = filteredListings.listings.filter((listing) =>
          listing.amenities?.includes(amenity)
        ).length;
        const percentage =
          filteredListings.total > 0
            ? (count / filteredListings.total) * 100
            : 0;
        return { amenity, count, percentage: Math.round(percentage) };
      })
      .filter((item) => item.count > 0);

    return {
      totalListings: allListings.total,
      filteredCount: filteredListings.total,
      priceDistribution,
      propertyTypeDistribution,
      amenityDistribution,
    };
  } catch (_error) {
    throw new Error("Failed to fetch filter statistics");
  }
}
