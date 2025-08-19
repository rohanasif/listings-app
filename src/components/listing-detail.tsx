"use client";

import { useState } from "react";
import Image from "next/image";
import { Share2, Heart, ArrowLeft, ArrowRight, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Location } from "@/lib/actions/listings";
import Link from "next/link";
import { toast } from "sonner";

interface ListingDetailProps {
  listing: Location;
  similarListings: Location[];
}

export default function ListingDetail({ listing, similarListings }: ListingDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock images for the gallery (in real app, these would come from the listing data)
  const images = [
    "/images/logo.png", // Main image
    "/images/logo.png", // Additional images
    "/images/logo.png",
    "/images/logo.png",
    "/images/logo.png",
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? "Removed from favorites" : "Added to favorites",
      { duration: 2000 }
    );
  };

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Inquiry submitted successfully!", {
      description: "We'll get back to you soon.",
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold">Listings</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8 text-sm">
              <Link href="/" className="hover:text-blue-400 transition-colors">SEARCH</Link>
              <Link href="/" className="hover:text-blue-400 transition-colors">PERMITS</Link>
              <Link href="/" className="hover:text-blue-400 transition-colors">BOOKING INQUIRY</Link>
              <Link href="/" className="hover:text-blue-400 transition-colors">LIST MY PROPERTY</Link>
              <Link href="/" className="hover:text-blue-400 transition-colors">PROJECTS</Link>
              <Link href="/" className="hover:text-blue-400 transition-colors">LOGIN</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Image Gallery */}
      <section className="relative">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <Image
            src={images[currentImageIndex]}
            alt={listing.name}
            fill
            className="object-cover"
            priority
          />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* Show All Photos Button */}
          <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors">
            SHOW ALL PHOTOS
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="bg-gray-800 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-yellow-400"
                      : "border-transparent hover:border-gray-600"
                  }`}
                >
                  <Image
                    src={images[index]}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Property Details and Inquiry Form */}
      <section className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Property Information & Inquiry Form */}
            <div className="space-y-8">
              {/* Location and Title */}
              <div>
                <p className="text-gray-400 text-sm mb-2">{listing.location}</p>
                <h1 className="text-4xl font-bold mb-4">{listing.name}</h1>
              </div>

              {/* Overview */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                <p className="text-gray-300 leading-relaxed">
                  {listing.description || `${listing.name} offers an unparalleled experience nestled in the heart of pristine wilderness. This stunning property combines rustic charm with modern amenities, making it perfect for families, groups, and corporate retreats. Variable rates are available based on season and group size. Our dedicated concierge team is available to arrange private chefs, guided tours, equipment rentals, and transportation to ensure your stay is nothing short of extraordinary.`}
                </p>
              </div>

              {/* Inquiry Form */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Inquire</h2>
                <form onSubmit={handleInquiry} className="space-y-4">
                  <div>
                    <Label htmlFor="jobName" className="text-gray-300">Job Name</Label>
                    <Input
                      id="jobName"
                      placeholder="Enter job name"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dates" className="text-gray-300">Dates Needed</Label>
                    <Input
                      id="dates"
                      placeholder="Select dates"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="projectType" className="text-gray-300">Project Type</Label>
                    <Input
                      id="projectType"
                      placeholder="Select project type"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="crewSize" className="text-gray-300">Crew/Talent or Guest Size</Label>
                    <Input
                      id="crewSize"
                      placeholder="Enter size"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hours" className="text-gray-300">Hours Needed</Label>
                    <Input
                      id="hours"
                      placeholder="Enter hours"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="areas" className="text-gray-300">Areas Needed</Label>
                    <Input
                      id="areas"
                      placeholder="Enter areas"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="miscInfo" className="text-gray-300">Miscellaneous Info Relevant to Your Project</Label>
                    <Textarea
                      id="miscInfo"
                      placeholder="Enter additional information..."
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg">
                    Reach Out
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Column - Additional Details & Tags */}
            <div className="space-y-8">
              {/* Share and Favorite Icons */}
              <div className="flex items-center justify-end space-x-4">
                <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Details */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <p className="text-gray-400">{listing.location.split(',')[0]}</p>
              </div>

              {/* Parking and Accessibility */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Parking and Accessibility</h3>
                <p className="text-gray-400">Available</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities?.slice(0, 6).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.propertyType && (
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">
                      {listing.propertyType}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">
                    {listing.maxGuests}+ Guests
                  </span>
                  {listing.instantBook && (
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">
                      Instant Book
                    </span>
                  )}
                  <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">
                    {listing.rating}★ Rating
                  </span>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm mt-2">
                  Show all 15 Tags
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Location</h2>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="h-96 bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Map showing {listing.location}</p>
                <p className="text-sm text-gray-500">Coordinates: {listing.coordinates.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Locations */}
      <section className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Similar Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarListings.map((similarListing) => (
              <Link
                key={similarListing.id}
                href={`/listing/${similarListing.id}`}
                className="group block"
              >
                <div className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors">
                  <div className="relative h-48">
                    <Image
                      src={similarListing.image}
                      alt={similarListing.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-400 text-sm mb-1">{similarListing.location}</p>
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {similarListing.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-bold">Listings</span>
              </div>
              <p className="text-gray-400">Find Perfect Filming Solutions</p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/" className="hover:text-white transition-colors">Permits</Link></li>
                  <li><Link href="/" className="hover:text-white transition-colors">Booking Inquiry</Link></li>
                  <li><Link href="/" className="hover:text-white transition-colors">List My Property</Link></li>
                  <li><Link href="/" className="hover:text-white transition-colors">Projects</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="/" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                  <li><Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>

            {/* Subscribe */}
            <div>
              <h4 className="font-semibold mb-3">Subscribe</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Get product updates"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  →
                </Button>
              </div>
              <div className="flex space-x-4 mt-4">
                <button className="text-gray-400 hover:text-white transition-colors">FB</button>
                <button className="text-gray-400 hover:text-white transition-colors">X</button>
                <button className="text-gray-400 hover:text-white transition-colors">IG</button>
                <button className="text-gray-400 hover:text-white transition-colors">TT</button>
                <button className="text-gray-400 hover:text-white transition-colors">YT</button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">©2025 Copyright. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
