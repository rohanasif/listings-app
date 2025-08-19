"use server";

// Types
export interface Location {
  id: number;
  name: string;
  location: string;
  price: string;
  image: string;
  coordinates: [number, number]; // [latitude, longitude]
  propertyType?: string;
  amenities?: string[];
  maxGuests?: number;
  instantBook?: boolean;
  description?: string;
  rating?: number;
  reviewCount?: number;
}

export interface SearchFilters {
  query?: string;
  location?: string;
  priceRange?: [number, number];
  propertyType?: string[];
  amenities?: string[];
  maxGuests?: number;
  instantBook?: boolean;
  coordinates?: [number, number];
  radius?: number; // in miles
}

export interface SearchParams {
  page?: number;
  limit?: number;
  sortBy?: "price" | "rating" | "distance" | "name";
  sortOrder?: "asc" | "desc";
}

export interface SearchResponse {
  listings: Location[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// Dummy data moved to backend
const sampleListings: Location[] = [
  {
    id: 1,
    name: "Alpine Lodge Getaway",
    location: "WHISTLER, CANADA",
    price: "$350/hr",
    image: "/images/logo.png",
    coordinates: [50.1163, -122.9574],
    propertyType: "Mountain Cabin",
    amenities: ["WiFi", "Kitchen", "Fireplace", "Hot Tub"],
    maxGuests: 8,
    instantBook: true,
    description: "Cozy mountain retreat with stunning alpine views",
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: 2,
    name: "Coastal Paradise Retreat",
    location: "MALIBU, CALIFORNIA",
    price: "$450/hr",
    image: "/images/logo.png",
    coordinates: [34.0259, -118.7798],
    propertyType: "Beach House",
    amenities: ["WiFi", "Kitchen", "Pool", "Beach Access", "Parking"],
    maxGuests: 12,
    instantBook: true,
    description: "Luxurious beachfront property with ocean views",
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: 3,
    name: "Rainforest Cabin Experience",
    location: "OLYMPIC PENINSULA, WA",
    price: "$280/hr",
    image: "/images/logo.png",
    coordinates: [47.7511, -120.7401],
    propertyType: "Cabin",
    amenities: ["WiFi", "Kitchen", "Fireplace", "Hiking Trails"],
    maxGuests: 6,
    instantBook: false,
    description: "Secluded cabin surrounded by ancient rainforest",
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: 4,
    name: "Mountain View Estate",
    location: "ASPEN, COLORADO",
    price: "$520/hr",
    image: "/images/logo.png",
    coordinates: [39.1911, -106.8175],
    propertyType: "Mountain Villa",
    amenities: ["WiFi", "Kitchen", "Pool", "Hot Tub", "Ski Access"],
    maxGuests: 10,
    instantBook: true,
    description: "Luxury mountain estate with ski-in/ski-out access",
    rating: 4.9,
    reviewCount: 203,
  },
  {
    id: 5,
    name: "Desert Oasis Villa",
    location: "PALM SPRINGS, CA",
    price: "$380/hr",
    image: "/images/logo.png",
    coordinates: [33.8303, -116.5453],
    propertyType: "Desert Villa",
    amenities: ["WiFi", "Kitchen", "Pool", "Hot Tub", "Golf Course"],
    maxGuests: 8,
    instantBook: true,
    description: "Modern desert villa with mountain and golf course views",
    rating: 4.6,
    reviewCount: 94,
  },
  {
    id: 6,
    name: "Lakeside Cottage",
    location: "LAKE TAHOE, CA",
    price: "$420/hr",
    image: "/images/logo.png",
    coordinates: [39.0968, -120.0324],
    propertyType: "Cottage",
    amenities: ["WiFi", "Kitchen", "Lake Access", "Kayaks", "BBQ"],
    maxGuests: 6,
    instantBook: false,
    description: "Charming cottage with direct lake access",
    rating: 4.8,
    reviewCount: 178,
  },
  {
    id: 7,
    name: "Vineyard Manor",
    location: "NAPA VALLEY, CA",
    price: "$480/hr",
    image: "/images/logo.png",
    coordinates: [38.2975, -122.2869],
    propertyType: "Manor",
    amenities: ["WiFi", "Kitchen", "Wine Cellar", "Vineyard Tours", "Pool"],
    maxGuests: 14,
    instantBook: true,
    description: "Elegant manor surrounded by vineyards",
    rating: 4.9,
    reviewCount: 145,
  },
  {
    id: 8,
    name: "Beachfront Bungalow",
    location: "SANTA BARBARA, CA",
    price: "$550/hr",
    image: "/images/logo.png",
    coordinates: [34.4208, -119.6982],
    propertyType: "Bungalow",
    amenities: [
      "WiFi",
      "Kitchen",
      "Beach Access",
      "Surfboards",
      "Outdoor Shower",
    ],
    maxGuests: 8,
    instantBook: true,
    description: "Charming beachfront bungalow with surf access",
    rating: 4.7,
    reviewCount: 112,
  },
];

// Helper function to filter listings
function filterListings(
  listings: Location[],
  filters: SearchFilters
): Location[] {
  return listings.filter((listing) => {
    // Text query filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchesQuery =
        listing.name.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query) ||
        listing.description?.toLowerCase().includes(query);
      if (!matchesQuery) return false;
    }

    // Location filter
    if (filters.location) {
      if (
        !listing.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }
    }

    // Price range filter
    if (filters.priceRange) {
      const price = parseInt(listing.price.replace(/[^0-9]/g, ""));
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }
    }

    // Property type filter
    if (filters.propertyType && filters.propertyType.length > 0) {
      if (!filters.propertyType.includes(listing.propertyType || "")) {
        return false;
      }
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) =>
        listing.amenities?.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }

    // Max guests filter
    if (filters.maxGuests) {
      if ((listing.maxGuests || 0) < filters.maxGuests) {
        return false;
      }
    }

    // Instant book filter
    if (filters.instantBook !== undefined) {
      if (listing.instantBook !== filters.instantBook) {
        return false;
      }
    }

    return true;
  });
}

// Helper function to sort listings
function sortListings(
  listings: Location[],
  sortBy?: string,
  sortOrder: "asc" | "desc" = "asc"
): Location[] {
  if (!sortBy) return listings;

  const sorted = [...listings].sort((a, b) => {
    let aValue: number | string, bValue: number | string;

    switch (sortBy) {
      case "price":
        aValue = parseInt(a.price.replace(/[^0-9]/g, ""));
        bValue = parseInt(b.price.replace(/[^0-9]/g, ""));
        break;
      case "rating":
        aValue = a.rating || 0;
        bValue = b.rating || 0;
        break;
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return sorted;
}

// Server Actions
export async function getListings(
  filters: SearchFilters = {},
  params: SearchParams = {}
): Promise<SearchResponse> {
  try {
    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    let filteredListings = filterListings(sampleListings, filters);

    // Sort listings
    filteredListings = sortListings(
      filteredListings,
      params.sortBy,
      params.sortOrder
    );

    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedListings = filteredListings.slice(startIndex, endIndex);
    const total = filteredListings.length;
    const totalPages = Math.ceil(total / limit);
    const hasMore = endIndex < total;

    return {
      listings: paginatedListings,
      total,
      page,
      totalPages,
      hasMore,
    };
  } catch (_error) {
    throw new Error("Failed to fetch listings");
  }
}

export async function searchListings(
  query: string,
  filters: Omit<SearchFilters, "query"> = {},
  params: SearchParams = {}
): Promise<SearchResponse> {
  return getListings({ ...filters, query }, params);
}

export async function getListingsByLocation(
  location: string,
  filters: Omit<SearchFilters, "location"> = {},
  params: SearchParams = {}
): Promise<SearchResponse> {
  return getListings({ ...filters, location }, params);
}

export async function getListing(id: number): Promise<Location | null> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const listing = sampleListings.find((l) => l.id === id);
    return listing || null;
  } catch (_error) {
    throw new Error("Failed to fetch listing");
  }
}

export async function getPopularListingLocations(): Promise<string[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [
      "Los Angeles, California",
      "New York, New York",
      "Miami, Florida",
      "Austin, Texas",
    ];
  } catch (_error) {
    throw new Error("Failed to fetch popular locations");
  }
}
