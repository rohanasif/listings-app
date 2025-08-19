"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
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
import { Upload, X, Search } from "lucide-react";
import { searchByImage } from "@/lib/actions/ai-search";

interface AIPhotoSearchModalProps {
  onSearch: (imageFile: File) => void;
}

export default function AIPhotoSearchModal({
  onSearch,
}: AIPhotoSearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSearching, setIsSearching] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSearch = async () => {
    if (selectedImage) {
      try {
        setIsSearching(true);
        const response = await searchByImage({ image: selectedImage });
        toast.success("AI Search Complete", {
          description: `Found similar properties with ${Math.round(
            response.confidence * 100
          )}% confidence`,
          duration: 4000,
        });
        onSearch(selectedImage);
        setIsOpen(false);
      } catch (_error) {
        toast.error("AI search failed", {
          description: "Please try again",
          duration: 5000,
        });
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleRemoveImage();
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-12 px-4">
          <Search className="h-4 w-4 mr-2" />
          AI Photo Search
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Photo Search</DialogTitle>
          <DialogDescription>
            Upload a photo to find similar properties using AI technology.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload Area */}
          <div className="space-y-4">
            {!selectedImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-4"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
                <p className="text-sm text-gray-600">
                  Upload a photo of a property or style you like
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPG, PNG, GIF (Max 10MB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={previewUrl!}
                    alt="Preview"
                    width={800}
                    height={256}
                    className="w-full h-64 object-cover rounded-lg"
                    unoptimized
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>File:</strong> {selectedImage.name}
                  </p>
                  <p>
                    <strong>Size:</strong>{" "}
                    {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSearch}
            disabled={!selectedImage || isSearching}
          >
            <Search className="h-4 w-4 mr-2" />
            {isSearching ? "Searching..." : "Search Properties"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
