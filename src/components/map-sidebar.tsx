"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import "@/lib/leafletFix";

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface Location {
  id: number;
  name: string;
  location: string;
  price: string;
  coordinates: [number, number]; // [latitude, longitude]
}

interface MapSidebarProps {
  isVisible: boolean;
  listings: Location[];
  onClose: () => void;
}

export default function MapSidebar({
  isVisible,
  listings,
  onClose,
}: MapSidebarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isVisible || !isMounted) {
    return null;
  }

  // Calculate center point from all listings
  const center: [number, number] =
    listings.length > 0
      ? [
          listings.reduce((sum, listing) => sum + listing.coordinates[0], 0) /
            listings.length,
          listings.reduce((sum, listing) => sum + listing.coordinates[1], 0) /
            listings.length,
        ]
      : [37.7749, -122.4194]; // Default to San Francisco

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-200"
      onClick={handleOverlayClick}
    >
      {/* Map Container */}
      <div className="absolute right-0 top-0 h-full w-96 bg-background border-l shadow-lg animate-in slide-in-from-right-0 duration-300">
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 bg-background/90 hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-full w-full">
          <MapContainer
            center={center}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {listings.map((listing) => (
              <Marker key={listing.id} position={listing.coordinates}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-sm">{listing.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {listing.location}
                    </p>
                    <p className="text-xs font-medium text-green-600">
                      {listing.price}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
