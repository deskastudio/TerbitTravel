"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users, Filter } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useDestination } from "@/hooks/use-destination";
import { IDestination } from "@/types/destination.types";
import { getImageUrl } from "@/utils/image-helper";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Enhanced destination type (API data + UI specific fields)
interface EnhancedDestination extends IDestination {
  // Harga dihapus dari interface karena destinasi tidak memiliki harga
  rating?: number;
  image?: string;
  duration?: string;
  maxPeople?: number;
}

// No formatting functions needed here

// Destination Card Component
const DestinationCard = ({
  destination,
}: {
  destination: EnhancedDestination;
}) => {
  const navigate = useNavigate();
  // Harga dihapus karena destinasi seharusnya tidak memiliki harga

  const handleViewDetail = () => {
    console.log("Navigating to destination detail:", destination._id);
    navigate(`/destination/${destination._id}`);
  };

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={handleViewDetail}
    >
      <div className="relative">
        <img
          src={
            destination.foto?.[0]
              ? getImageUrl(destination.foto[0])
              : destination.image || "/placeholder.svg"
          }
          alt={destination.nama}
          className="h-48 w-full object-cover"
          onError={() => {
            // No fallback image
          }}
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-1">
            {destination.nama}
          </CardTitle>
          <div className="flex items-center text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-yellow-500 mr-1"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
            {destination.rating || 4.5}
          </div>
        </div>
        <CardDescription className="flex items-center mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span className="text-sm text-muted-foreground line-clamp-1">
            {destination.lokasi}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-1 mb-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {destination.duration || "3 hari 2 malam"}
          </div>
          <div className="flex items-center text-xs text-muted-foreground ml-2">
            <Users className="h-3.5 w-3.5 mr-1" />
            Maks. {destination.maxPeople || 4} orang
          </div>
        </div>
        {destination.category && (
          <Badge variant="outline" className="mt-1">
            {typeof destination.category === "string"
              ? destination.category
              : destination.category.title}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end items-center">
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetail();
          }}
        >
          Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  );
};

// Loading Skeleton
const DestinationCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <CardHeader className="p-4 pb-0">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="p-4 pt-2">
      <Skeleton className="h-4 w-full mb-2" />
    </CardContent>
    <CardFooter className="p-4 pt-0 flex justify-between items-center">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-9 w-24" />
    </CardFooter>
  </Card>
);

// Recommendation Component
const RecommendationSection = ({
  destinations,
}: {
  destinations: EnhancedDestination[];
}) => {
  // Get 3 random destinations for recommendations
  const recommendedDestinations = [...destinations]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(3, destinations.length));

  if (recommendedDestinations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 mb-12">
      <h2 className="text-2xl font-bold mb-4">Rekomendasi Untuk Anda</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedDestinations.map((destination) => (
          <DestinationCard
            key={`rec-${destination._id}`}
            destination={destination}
          />
        ))}
      </div>
    </div>
  );
};

// Main Component
export default function DestinationPage() {
  const { destinations, isLoadingDestinations, destinationsError, categories } =
    useDestination();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
  const [locationFilter, setLocationFilter] = useState("");
  // Filter harga dihapus karena destinasi tidak memiliki harga
  const [durationFilter, setDurationFilter] = useState("");
  const [enhancedDestinations, setEnhancedDestinations] = useState<
    EnhancedDestination[]
  >([]);

  const itemsPerPage = 6;

  // Log destinations when they change
  useEffect(() => {
    console.log("Destinations loaded:", destinations.length);
  }, [destinations]);

  // Enhance destinations with additional UI data
  useEffect(() => {
    if (destinations.length > 0) {
      // Add UI display properties to each destination - harga dihapus
      const enhanced = destinations.map((dest) => {
        // Mengubah dari string ke number dengan parseFloat
        const ratingValue = parseFloat((Math.random() * 0.9 + 4.0).toFixed(1));

        return {
          ...dest,
          // Harga dan diskon dihapus karena destinasi tidak memiliki harga
          rating: ratingValue, // Sekarang rating adalah number, bukan string
          duration: `${Math.floor(Math.random() * 4) + 2} hari ${
            Math.floor(Math.random() * 3) + 1
          } malam`,
          maxPeople: Math.floor(Math.random() * 6) + 2,
        };
      });

      setEnhancedDestinations(enhanced);
      setIsLoading(false);
    }
  }, [destinations]);

  // Filter destinations based on search, category, and other filters
  const filteredDestinations = enhancedDestinations.filter((destination) => {
    // Search filter
    const matchesSearch =
      debouncedSearchQuery === "" ||
      destination.nama
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) ||
      destination.lokasi
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());

    // Category filter
    let matchesCategory = true;
    if (selectedCategory !== "semua") {
      // Match by API category ID
      if (destination.category) {
        if (typeof destination.category === "string") {
          matchesCategory = destination.category === selectedCategory;
        } else {
          matchesCategory = destination.category._id === selectedCategory;
        }
      } else {
        matchesCategory = false;
      }
    }

    // Location filter
    const matchesLocation =
      locationFilter === "" ||
      destination.lokasi.toLowerCase().includes(locationFilter.toLowerCase());

    // Price range filter dihapus karena destinasi tidak memiliki harga
    // Semua opsi filter harga akan selalu mengembalikan true
    const matchesPriceRange = true;

    // Duration filter
    let matchesDuration = true;
    if (durationFilter === "1-2-days") {
      matchesDuration =
        (destination.duration || "").includes("1 malam") ||
        (destination.duration || "").includes("2 hari");
    } else if (durationFilter === "3-4-days") {
      matchesDuration =
        (destination.duration || "").includes("3 hari") ||
        (destination.duration || "").includes("4 hari");
    } else if (durationFilter === "5-plus-days") {
      matchesDuration =
        (destination.duration || "").includes("5 hari") ||
        (destination.duration || "").includes("6 hari") ||
        (destination.duration || "").includes("7 hari");
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation &&
      matchesPriceRange &&
      matchesDuration
    );
  });

  // Sort destinations - pengurutan berdasarkan harga dihapus
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (sortBy === "rating") {
      return (
        parseFloat(b.rating?.toString() || "0") -
        parseFloat(a.rating?.toString() || "0")
      );
    }
    // Default: recommended (no specific sort)
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedDestinations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDestinations = sortedDestinations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setLocationFilter("");
    // setPriceRangeFilter dihapus karena destinasi tidak memiliki harga
    setDurationFilter("");
  };

  // Simulate loading effect when changing filters
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    debouncedSearchQuery,
    selectedCategory,
    locationFilter,
    // priceRangeFilter dihapus karena destinasi tidak memiliki harga
    durationFilter,
    sortBy,
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Jelajahi Destinasi Wisata Kami
        </h1>
        <p className="text-muted-foreground">
          Temukan berbagai destinasi wisata dan persiapkan petualangan Anda
          berikutnya!
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari destinasi wisata..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Category Tabs */}
      <Tabs
        defaultValue="semua"
        value={selectedCategory}
        onValueChange={handleCategoryChange}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex overflow-x-auto">
            <TabsList>
              <TabsTrigger value="semua">Semua</TabsTrigger>
              {/* Hanya kategori dari API */}
              {categories.map((category) => (
                <TabsTrigger key={category._id} value={category._id}>
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Rekomendasi</SelectItem>
                {/* Opsi pengurutan harga dihapus karena destinasi tidak memiliki harga */}
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter</SheetTitle>
                  <SheetDescription>
                    Sesuaikan pencarian Anda dengan filter berikut
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Lokasi</h3>
                    <Select
                      value={locationFilter}
                      onValueChange={setLocationFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih lokasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Semua Lokasi</SelectItem>
                        <SelectItem value="bali">Bali</SelectItem>
                        <SelectItem value="jawa">Jawa</SelectItem>
                        <SelectItem value="sumatera">Sumatera</SelectItem>
                        <SelectItem value="papua">Papua</SelectItem>
                        <SelectItem value="nusa tenggara">
                          Nusa Tenggara
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter harga dihapus karena destinasi tidak memiliki harga */}

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Durasi</h3>
                    <Select
                      value={durationFilter}
                      onValueChange={setDurationFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih durasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Semua Durasi</SelectItem>
                        <SelectItem value="1-2-days">1-2 Hari</SelectItem>
                        <SelectItem value="3-4-days">3-4 Hari</SelectItem>
                        <SelectItem value="5-plus-days">5+ Hari</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filter
                  </Button>
                  <SheetClose asChild>
                    <Button>Terapkan</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <TabsContent value={selectedCategory} className="mt-0">
          {isLoadingDestinations ? (
            // Tampilkan skeleton selama data destinasi utama dimuat
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <DestinationCardSkeleton key={`initial-skeleton-${index}`} />
                ))}
            </div>
          ) : destinationsError ? (
            // Tampilkan pesan error jika gagal memuat data
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Gagal Memuat Data</h3>
              <p className="text-muted-foreground mb-4">
                Terjadi kesalahan saat memuat data destinasi. Silakan coba lagi
                nanti.
              </p>
              <Button onClick={() => window.location.reload()}>
                Muat Ulang
              </Button>
            </div>
          ) : (
            // Tampilkan konten utama jika data sudah dimuat
            <>
              {/* Recommendation Section - jika ini tab "semua" dan ada data */}
              {selectedCategory === "semua" &&
                enhancedDestinations.length > 0 && (
                  <RecommendationSection destinations={enhancedDestinations} />
                )}

              {/* Destinations Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <DestinationCardSkeleton
                        key={`filter-skeleton-${index}`}
                      />
                    ))}
                </div>
              ) : paginatedDestinations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedDestinations.map((destination) => (
                    <DestinationCard
                      key={destination._id}
                      destination={destination}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
                  <p className="text-muted-foreground mb-4">
                    Tidak ada destinasi wisata yang sesuai dengan filter Anda.
                    Coba ubah filter atau cari dengan kata kunci lain.
                  </p>
                  <Button onClick={resetFilters}>Reset Filter</Button>
                </div>
              )}

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const page = index + 1;

                      // Show first page, last page, current page, and pages around current page
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={page === currentPage}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      // Show ellipsis for gaps
                      if (page === 2 || page === totalPages - 1) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            handlePageChange(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* "Under Development" Section for when there are no destinations */}
      {enhancedDestinations.length === 0 &&
        !isLoadingDestinations &&
        !destinationsError && (
          <div className="bg-blue-50 rounded-xl p-8 text-center my-8">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Sedang Dalam Pengembangan
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Kami sedang bekerja keras untuk menyiapkan destinasi wisata yang
              luar biasa untuk Anda. Silakan kembali lagi nanti untuk melihat
              penawaran terbaru kami!
            </p>
          </div>
        )}
    </div>
  );
}
