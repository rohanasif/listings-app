"use server";

// Types
export interface LocationData {
  id: string;
  name: string;
  state: string;
  country: string;
  coordinates: [number, number]; // [latitude, longitude]
  timezone: string;
  population?: number;
  popular: boolean;
}

export interface LocationSearchParams {
  query?: string;
  country?: string;
  state?: string;
  popular?: boolean;
  limit?: number;
}

export interface GeocodingResult {
  location: string;
  coordinates: [number, number];
  formattedAddress: string;
  confidence: number;
}

export interface ReverseGeocodingResult {
  location: string;
  state: string;
  country: string;
  coordinates: [number, number];
  formattedAddress: string;
}

// Dummy location data
const locationsData: LocationData[] = [
  {
    id: "1",
    name: "Los Angeles",
    state: "California",
    country: "USA",
    coordinates: [34.0522, -118.2437],
    timezone: "PST",
    population: 3979576,
    popular: true,
  },
  {
    id: "2",
    name: "New York",
    state: "New York",
    country: "USA",
    coordinates: [40.7128, -74.006],
    timezone: "EST",
    population: 8336817,
    popular: true,
  },
  {
    id: "3",
    name: "Miami",
    state: "Florida",
    country: "USA",
    coordinates: [25.7617, -80.1918],
    timezone: "EST",
    population: 454279,
    popular: true,
  },
  {
    id: "4",
    name: "Austin",
    state: "Texas",
    country: "USA",
    coordinates: [30.2672, -97.7431],
    timezone: "CST",
    population: 978908,
    popular: true,
  },
  {
    id: "5",
    name: "San Francisco",
    state: "California",
    country: "USA",
    coordinates: [37.7749, -122.4194],
    timezone: "PST",
    population: 873965,
    popular: true,
  },
  {
    id: "6",
    name: "Seattle",
    state: "Washington",
    country: "USA",
    coordinates: [47.6062, -122.3321],
    timezone: "PST",
    population: 744955,
    popular: true,
  },
  {
    id: "7",
    name: "Denver",
    state: "Colorado",
    country: "USA",
    coordinates: [39.7392, -104.9903],
    timezone: "MST",
    population: 727211,
    popular: true,
  },
  {
    id: "8",
    name: "Nashville",
    state: "Tennessee",
    country: "USA",
    coordinates: [36.1627, -86.7816],
    timezone: "CST",
    population: 689447,
    popular: true,
  },
];

// Server Actions
export async function getLocations(
  params: LocationSearchParams = {}
): Promise<LocationData[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let filteredLocations = [...locationsData];

    if (params.query) {
      const query = params.query.toLowerCase();
      filteredLocations = filteredLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(query) ||
          location.state.toLowerCase().includes(query)
      );
    }

    if (params.country) {
      filteredLocations = filteredLocations.filter(
        (location) =>
          location.country.toLowerCase() === params.country!.toLowerCase()
      );
    }

    if (params.state) {
      filteredLocations = filteredLocations.filter(
        (location) =>
          location.state.toLowerCase() === params.state!.toLowerCase()
      );
    }

    if (params.popular) {
      filteredLocations = filteredLocations.filter(
        (location) => location.popular
      );
    }

    if (params.limit) {
      filteredLocations = filteredLocations.slice(0, params.limit);
    }

    return filteredLocations;
  } catch (_error) {
    throw new Error("Failed to fetch locations");
  }
}

export async function getPopularLocations(): Promise<LocationData[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return locationsData.filter((location) => location.popular);
  } catch (_error) {
    throw new Error("Failed to fetch popular locations");
  }
}

export async function getLocationsByCountry(
  country: string
): Promise<LocationData[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return locationsData.filter(
      (location) => location.country.toLowerCase() === country.toLowerCase()
    );
  } catch (_error) {
    throw new Error("Failed to fetch locations by country");
  }
}

export async function getLocationsByState(
  country: string,
  state: string
): Promise<LocationData[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return locationsData.filter(
      (location) =>
        location.country.toLowerCase() === country.toLowerCase() &&
        location.state.toLowerCase() === state.toLowerCase()
    );
  } catch (_error) {
    throw new Error("Failed to fetch locations by state");
  }
}

export async function searchLocations(
  query: string,
  limit: number = 10
): Promise<LocationData[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const filtered = locationsData.filter(
      (location) =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.state.toLowerCase().includes(query.toLowerCase())
    );
    return filtered.slice(0, limit);
  } catch (_error) {
    throw new Error("Failed to search locations");
  }
}

export async function geocodeLocation(
  location: string
): Promise<GeocodingResult> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Simple geocoding simulation
    const foundLocation = locationsData.find(
      (loc) =>
        loc.name.toLowerCase().includes(location.toLowerCase()) ||
        loc.state.toLowerCase().includes(location.toLowerCase())
    );

    if (foundLocation) {
      return {
        location: foundLocation.name,
        coordinates: foundLocation.coordinates,
        formattedAddress: `${foundLocation.name}, ${foundLocation.state}, ${foundLocation.country}`,
        confidence: 0.9,
      };
    }

    // Return default coordinates for unknown locations
    return {
      location,
      coordinates: [34.0522, -118.2437], // Default to LA
      formattedAddress: `${location}, USA`,
      confidence: 0.3,
    };
  } catch (_error) {
    throw new Error("Failed to geocode location");
  }
}

export async function reverseGeocode(
  coordinates: [number, number]
): Promise<ReverseGeocodingResult> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Simple reverse geocoding simulation
    const [lat, lng] = coordinates;

    // Find closest location
    let closestLocation = locationsData[0];
    let minDistance = Number.MAX_VALUE;

    for (const location of locationsData) {
      const distance = Math.sqrt(
        Math.pow(lat - location.coordinates[0], 2) +
          Math.pow(lng - location.coordinates[1], 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestLocation = location;
      }
    }

    return {
      location: closestLocation.name,
      state: closestLocation.state,
      country: closestLocation.country,
      coordinates: closestLocation.coordinates,
      formattedAddress: `${closestLocation.name}, ${closestLocation.state}, ${closestLocation.country}`,
    };
  } catch (_error) {
    throw new Error("Failed to reverse geocode coordinates");
  }
}

export async function getNearbyLocations(
  coordinates: [number, number],
  radius: number = 50
): Promise<LocationData[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const [lat, lng] = coordinates;

    return locationsData.filter((location) => {
      const distance = Math.sqrt(
        Math.pow(lat - location.coordinates[0], 2) +
          Math.pow(lng - location.coordinates[1], 2)
      );

      // Convert to approximate miles (rough conversion)
      const distanceInMiles = distance * 69;
      return distanceInMiles <= radius;
    });
  } catch (_error) {
    throw new Error("Failed to fetch nearby locations");
  }
}

export async function getLocationSuggestions(
  query: string,
  limit: number = 5
): Promise<string[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const suggestions = locationsData
      .filter(
        (location) =>
          location.name.toLowerCase().includes(query.toLowerCase()) ||
          location.state.toLowerCase().includes(query.toLowerCase())
      )
      .map((location) => `${location.name}, ${location.state}`)
      .slice(0, limit);

    return suggestions;
  } catch (_error) {
    throw new Error("Failed to fetch location suggestions");
  }
}

export async function getLocationStats(): Promise<{
  totalLocations: number;
  countries: number;
  states: number;
  popularLocations: number;
}> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const countries = new Set(locationsData.map((loc) => loc.country)).size;
    const states = new Set(locationsData.map((loc) => loc.state)).size;
    const popularLocations = locationsData.filter((loc) => loc.popular).length;

    return {
      totalLocations: locationsData.length,
      countries,
      states,
      popularLocations,
    };
  } catch (_error) {
    throw new Error("Failed to fetch location statistics");
  }
}
