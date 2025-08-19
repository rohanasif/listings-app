"use server";

import { getListings } from "./listings";

// Types
export interface AISearchRequest {
  image: File;
  filters?: {
    location?: string;
    priceRange?: [number, number];
    propertyType?: string[];
    amenities?: string[];
    maxGuests?: number;
  };
}

export interface AISearchResponse {
  listings: unknown[];
  total: number;
  searchId: string;
  confidence: number;
  processingTime: number;
  suggestedFilters?: {
    propertyType?: string[];
    amenities?: string[];
    priceRange?: [number, number];
  };
}

export interface AISearchHistory {
  id: string;
  imageUrl: string;
  searchDate: string;
  resultCount: number;
  filters: Record<string, unknown>;
}

// In-memory storage for demo purposes
let searchHistory: AISearchHistory[] = [];
let searchCounter = 0;

// Server Actions
export async function searchByImage(
  request: AISearchRequest
): Promise<AISearchResponse> {
  try {
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate a unique search ID
    const searchId = `search_${Date.now()}_${++searchCounter}`;

    // Simulate AI analysis and suggested filters
    const suggestedFilters = {
      propertyType: ["Beach House", "Mountain Cabin"],
      amenities: ["Pool", "Hot Tub", "Kitchen"],
      priceRange: [300, 600] as [number, number],
    };

    // Get listings with suggested filters
    const filters = {
      ...request.filters,
      ...suggestedFilters,
    };

    const searchResults = await getListings(filters);

    // Calculate confidence based on image analysis simulation
    const confidence = 0.85 + Math.random() * 0.1; // 85-95% confidence

    // Store in search history
    const historyItem: AISearchHistory = {
      id: searchId,
      imageUrl: URL.createObjectURL(request.image),
      searchDate: new Date().toISOString(),
      resultCount: searchResults.total,
      filters: request.filters || {},
    };

    searchHistory.unshift(historyItem);

    // Keep only last 10 searches
    if (searchHistory.length > 10) {
      searchHistory = searchHistory.slice(0, 10);
    }

    return {
      listings: searchResults.listings,
      total: searchResults.total,
      searchId,
      confidence,
      processingTime: 2000,
      suggestedFilters,
    };
  } catch (_error) {
    throw new Error("AI search failed");
  }
}

export async function getSearchHistory(): Promise<AISearchHistory[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return searchHistory;
  } catch (_error) {
    throw new Error("Failed to fetch search history");
  }
}

export async function getSearchResult(
  searchId: string
): Promise<AISearchResponse | null> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const historyItem = searchHistory.find((item) => item.id === searchId);
    if (!historyItem) {
      return null;
    }

    // Re-run the search with stored filters
    const searchResults = await getListings(historyItem.filters);

    return {
      listings: searchResults.listings,
      total: searchResults.total,
      searchId,
      confidence: 0.85,
      processingTime: 100,
    };
  } catch (_error) {
    throw new Error("Failed to fetch search result");
  }
}

export async function deleteSearchHistory(searchId: string): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));

    searchHistory = searchHistory.filter((item) => item.id !== searchId);
  } catch (_error) {
    throw new Error("Failed to delete search history");
  }
}

export async function getImageSuggestions(_image: File): Promise<{
  suggestedFilters: {
    propertyType?: string[];
    amenities?: string[];
    priceRange?: [number, number];
  };
  confidence: number;
}> {
  try {
    // Simulate AI analysis time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate different suggestions based on image analysis
    const suggestions = [
      {
        propertyType: ["Beach House", "Coastal Villa"],
        amenities: ["Beach Access", "Pool", "Ocean View"],
        priceRange: [400, 800] as [number, number],
      },
      {
        propertyType: ["Mountain Cabin", "Ski Chalet"],
        amenities: ["Fireplace", "Hot Tub", "Mountain View"],
        priceRange: [300, 600] as [number, number],
      },
      {
        propertyType: ["Urban Loft", "City Apartment"],
        amenities: ["WiFi", "Kitchen", "City View"],
        priceRange: [200, 500] as [number, number],
      },
      {
        propertyType: ["Desert Villa", "Oasis Retreat"],
        amenities: ["Pool", "Hot Tub", "Desert View"],
        priceRange: [350, 700] as [number, number],
      },
    ];

    // Randomly select a suggestion
    const randomSuggestion =
      suggestions[Math.floor(Math.random() * suggestions.length)];
    const confidence = 0.7 + Math.random() * 0.2; // 70-90% confidence

    return {
      suggestedFilters: randomSuggestion,
      confidence,
    };
  } catch (_error) {
    throw new Error("Failed to get image suggestions");
  }
}

// Helper function to analyze image content (simulated)
async function _analyzeImageContent(_image: File): Promise<{
  dominantColors: string[];
  objects: string[];
  style: string;
  mood: string;
}> {
  // Simulate image analysis
  await new Promise((resolve) => setTimeout(resolve, 500));

  const analysisResults = [
    {
      dominantColors: ["blue", "white", "sand"],
      objects: ["ocean", "beach", "palm trees"],
      style: "coastal",
      mood: "relaxing",
    },
    {
      dominantColors: ["green", "brown", "white"],
      objects: ["mountains", "trees", "snow"],
      style: "mountain",
      mood: "adventurous",
    },
    {
      dominantColors: ["gray", "black", "white"],
      objects: ["buildings", "streets", "cars"],
      style: "urban",
      mood: "energetic",
    },
    {
      dominantColors: ["orange", "red", "brown"],
      objects: ["desert", "cactus", "rocks"],
      style: "desert",
      mood: "peaceful",
    },
  ];

  // Return random analysis result
  return analysisResults[Math.floor(Math.random() * analysisResults.length)];
}
