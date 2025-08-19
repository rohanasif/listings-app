"use client";

import dynamic from "next/dynamic";

// Dynamically import the home component to avoid SSR issues with Leaflet
const HomeComponent = dynamic(() => import("@/components/home-component"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-4 animate-pulse"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <HomeComponent />;
}
