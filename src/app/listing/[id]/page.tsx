import { getListing, getListings } from "@/lib/actions/listings";
import { notFound } from "next/navigation";
import ListingDetail from "@/components/listing-detail";

interface ListingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listingId = parseInt(id);
  
  if (isNaN(listingId)) {
    notFound();
  }

  const listing = await getListing(listingId);
  
  if (!listing) {
    notFound();
  }

  // Get similar listings for the "Similar Locations" section
  const allListings = await getListings();
  const similarListings = allListings.listings
    .filter(l => l.id !== listingId)
    .slice(0, 4);

  return (
    <ListingDetail 
      listing={listing} 
      similarListings={similarListings}
    />
  );
}
