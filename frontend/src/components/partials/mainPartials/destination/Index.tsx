"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, Calendar, Users, Filter } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// Types
type Destination = {
  id: number
  title: string
  location: string
  price: number
  discount?: number
  rating: number
  image: string
  category: string[]
  duration: string
  maxPeople: number
  isPopular: boolean
  isPromo: boolean
  isFlashSale: boolean
}

type Category = "semua" | "populer" | "promo" | "flash-sale"

// Sample data
const destinations: Destination[] = [
  {
    id: 1,
    title: "Pantai Kuta Bali",
    location: "Bali, Indonesia",
    price: 2500000,
    discount: 15,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=400",
    category: ["pantai", "populer"],
    duration: "3 hari 2 malam",
    maxPeople: 4,
    isPopular: true,
    isPromo: false,
    isFlashSale: false,
  },
  {
    id: 2,
    title: "Gunung Bromo",
    location: "Jawa Timur, Indonesia",
    price: 1800000,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=400",
    category: ["gunung", "populer"],
    duration: "2 hari 1 malam",
    maxPeople: 6,
    isPopular: true,
    isPromo: true,
    isFlashSale: false,
  },
  {
    id: 3,
    title: "Raja Ampat",
    location: "Papua, Indonesia",
    price: 5000000,
    discount: 20,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=400",
    category: ["pantai", "diving"],
    duration: "5 hari 4 malam",
    maxPeople: 2,
    isPopular: false,
    isPromo: false,
    isFlashSale: true,
  },
  {
    id: 4,
    title: "Danau Toba",
    location: "Sumatera Utara, Indonesia",
    price: 2200000,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=400",
    category: ["danau", "budaya"],
    duration: "4 hari 3 malam",
    maxPeople: 8,
    isPopular: false,
    isPromo: true,
    isFlashSale: false,
  },
  {
    id: 5,
    title: "Candi Borobudur",
    location: "Jawa Tengah, Indonesia",
    price: 1500000,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=400",
    category: ["sejarah", "budaya"],
    duration: "2 hari 1 malam",
    maxPeople: 10,
    isPopular: true,
    isPromo: false,
    isFlashSale: false,
  },
  {
    id: 6,
    title: "Pulau Komodo",
    location: "Nusa Tenggara Timur, Indonesia",
    price: 3500000,
    discount: 10,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=400",
    category: ["alam", "petualangan"],
    duration: "3 hari 2 malam",
    maxPeople: 6,
    isPopular: false,
    isPromo: false,
    isFlashSale: true,
  },
  {
    id: 7,
    title: "Kawah Ijen",
    location: "Jawa Timur, Indonesia",
    price: 1900000,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=400",
    category: ["gunung", "petualangan"],
    duration: "2 hari 1 malam",
    maxPeople: 4,
    isPopular: false,
    isPromo: true,
    isFlashSale: false,
  },
  {
    id: 8,
    title: "Taman Nasional Ujung Kulon",
    location: "Banten, Indonesia",
    price: 2800000,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=400",
    category: ["alam", "petualangan"],
    duration: "4 hari 3 malam",
    maxPeople: 6,
    isPopular: false,
    isPromo: false,
    isFlashSale: false,
  },
]

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Destination Card Component
const DestinationCard = ({ destination }: { destination: Destination }) => {
  const navigate = useNavigate()
  const discountedPrice = destination.discount
    ? destination.price - (destination.price * destination.discount) / 100
    : destination.price

  const handleViewDetail = () => {
    navigate(`/destinasi/${destination.id}`)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <img
          src={destination.image || "/placeholder.svg"}
          alt={destination.title}
          className="h-48 w-full object-cover"
        />
        {destination.isFlashSale && (
          <Badge className="absolute right-2 top-2 bg-red-500 hover:bg-red-600">Flash Sale</Badge>
        )}
        {destination.isPromo && !destination.isFlashSale && (
          <Badge className="absolute right-2 top-2 bg-orange-500 hover:bg-orange-600">Promo</Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-1">{destination.title}</CardTitle>
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
            {destination.rating}
          </div>
        </div>
        <CardDescription className="flex items-center mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span className="text-sm text-muted-foreground line-clamp-1">{destination.location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-1 mb-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {destination.duration}
          </div>
          <div className="flex items-center text-xs text-muted-foreground ml-2">
            <Users className="h-3.5 w-3.5 mr-1" />
            Maks. {destination.maxPeople} orang
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          {destination.discount ? (
            <div>
              <span className="text-sm line-through text-muted-foreground">{formatCurrency(destination.price)}</span>
              <div className="text-lg font-bold text-primary">{formatCurrency(discountedPrice)}</div>
            </div>
          ) : (
            <div className="text-lg font-bold text-primary">{formatCurrency(destination.price)}</div>
          )}
          <div className="text-xs text-muted-foreground">per orang</div>
        </div>
        <Button size="sm" onClick={handleViewDetail}>
          Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  )
}

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
)

// Recommendation Component
const RecommendationSection = ({ destinations }: { destinations: Destination[] }) => {
  // Get 3 random popular destinations for recommendations
  const recommendedDestinations = destinations
    .filter((d) => d.isPopular)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)

  return (
    <div className="mt-8 mb-12">
      <h2 className="text-2xl font-bold mb-4">Rekomendasi Untuk Anda</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedDestinations.map((destination) => (
          <DestinationCard key={`rec-${destination.id}`} destination={destination} />
        ))}
      </div>
    </div>
  )
}

// Main Component
export default function DestinationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [selectedCategory, setSelectedCategory] = useState<Category>("semua")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState("recommended")
  const [locationFilter, setLocationFilter] = useState("")
  const [priceRangeFilter, setPriceRangeFilter] = useState("")
  const [durationFilter, setDurationFilter] = useState("")

  const itemsPerPage = 6

  // Filter destinations based on search, category, and other filters
  const filteredDestinations = destinations.filter((destination) => {
    // Search filter
    const matchesSearch =
      debouncedSearchQuery === "" ||
      destination.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      destination.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase())

    // Category filter
    let matchesCategory = true
    if (selectedCategory === "populer") {
      matchesCategory = destination.isPopular
    } else if (selectedCategory === "promo") {
      matchesCategory = destination.isPromo
    } else if (selectedCategory === "flash-sale") {
      matchesCategory = destination.isFlashSale
    }

    // Location filter
    const matchesLocation =
      locationFilter === "" || destination.location.toLowerCase().includes(locationFilter.toLowerCase())

    // Price range filter
    let matchesPriceRange = true
    if (priceRangeFilter === "under-2m") {
      matchesPriceRange = destination.price < 2000000
    } else if (priceRangeFilter === "2m-4m") {
      matchesPriceRange = destination.price >= 2000000 && destination.price <= 4000000
    } else if (priceRangeFilter === "above-4m") {
      matchesPriceRange = destination.price > 4000000
    }

    // Duration filter
    let matchesDuration = true
    if (durationFilter === "1-2-days") {
      matchesDuration = destination.duration.includes("1 malam") || destination.duration.includes("2 hari")
    } else if (durationFilter === "3-4-days") {
      matchesDuration = destination.duration.includes("3 hari") || destination.duration.includes("4 hari")
    } else if (durationFilter === "5-plus-days") {
      matchesDuration =
        destination.duration.includes("5 hari") ||
        destination.duration.includes("6 hari") ||
        destination.duration.includes("7 hari")
    }

    return matchesSearch && matchesCategory && matchesLocation && matchesPriceRange && matchesDuration
  })

  // Sort destinations
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price
    } else if (sortBy === "price-high") {
      return b.price - a.price
    } else if (sortBy === "rating") {
      return b.rating - a.rating
    }
    // Default: recommended (no specific sort)
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedDestinations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedDestinations = sortedDestinations.slice(startIndex, startIndex + itemsPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    setIsLoading(true)
    setCurrentPage(page)
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as Category)
    setCurrentPage(1)
  }

  // Reset filters
  const resetFilters = () => {
    setLocationFilter("")
    setPriceRangeFilter("")
    setDurationFilter("")
  }

  // Simulate loading effect when changing filters
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [debouncedSearchQuery, selectedCategory, locationFilter, priceRangeFilter, durationFilter, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Jelajahi Destinasi Wisata Kami</h1>
        <p className="text-muted-foreground">
          Temukan berbagai destinasi wisata dan persiapkan petualangan Anda berikutnya!
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
      <Tabs defaultValue="semua" value={selectedCategory} onValueChange={handleCategoryChange} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="semua">Semua</TabsTrigger>
            <TabsTrigger value="populer">Populer</TabsTrigger>
            <TabsTrigger value="promo">Promo</TabsTrigger>
            <TabsTrigger value="flash-sale">Flash Sale</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Rekomendasi</SelectItem>
                <SelectItem value="price-low">Harga: Rendah ke Tinggi</SelectItem>
                <SelectItem value="price-high">Harga: Tinggi ke Rendah</SelectItem>
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
                  <SheetDescription>Sesuaikan pencarian Anda dengan filter berikut</SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Lokasi</h3>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih lokasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semua">Semua Lokasi</SelectItem>
                        <SelectItem value="bali">Bali</SelectItem>
                        <SelectItem value="jawa">Jawa</SelectItem>
                        <SelectItem value="sumatera">Sumatera</SelectItem>
                        <SelectItem value="papua">Papua</SelectItem>
                        <SelectItem value="nusa tenggara">Nusa Tenggara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Rentang Harga</h3>
                    <Select value={priceRangeFilter} onValueChange={setPriceRangeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih rentang harga" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semua">Semua Harga</SelectItem>
                        <SelectItem value="under-2m">Di bawah Rp2.000.000</SelectItem>
                        <SelectItem value="2m-4m">Rp2.000.000 - Rp4.000.000</SelectItem>
                        <SelectItem value="above-4m">Di atas Rp4.000.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Durasi</h3>
                    <Select value={durationFilter} onValueChange={setDurationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih durasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semua">Semua Durasi</SelectItem>
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

        <TabsContent value="semua" className="mt-0">
          {/* Recommendation Section */}
          <RecommendationSection destinations={destinations} />

          {/* Destinations Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <DestinationCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
          ) : paginatedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
              <p className="text-muted-foreground mb-4">
                Tidak ada destinasi wisata yang sesuai dengan filter Anda. Coba ubah filter atau cari dengan kata kunci
                lain.
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
                      e.preventDefault()
                      if (currentPage > 1) handlePageChange(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1

                  // Show first page, last page, current page, and pages around current page
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }

                  // Show ellipsis for gaps
                  if (page === 2 || page === totalPages - 1) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  return null
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) handlePageChange(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>

        <TabsContent value="populer" className="mt-0">
          {/* Same structure as "semua" tab but with filtered data */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <DestinationCardSkeleton key={`skeleton-pop-${index}`} />
                ))}
            </div>
          ) : paginatedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
              <p className="text-muted-foreground">
                Tidak ada destinasi wisata populer yang sesuai dengan filter Anda.
              </p>
            </div>
          )}

          {/* Pagination (same as above) */}
          {!isLoading && totalPages > 1 && (
            <Pagination className="mt-8">{/* Same pagination structure as above */}</Pagination>
          )}
        </TabsContent>

        <TabsContent value="promo" className="mt-0">
          {/* Same structure as other tabs */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <DestinationCardSkeleton key={`skeleton-promo-${index}`} />
                ))}
            </div>
          ) : paginatedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
              <p className="text-muted-foreground">Tidak ada destinasi wisata promo yang sesuai dengan filter Anda.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="flash-sale" className="mt-0">
          {/* Same structure as other tabs */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <DestinationCardSkeleton key={`skeleton-flash-${index}`} />
                ))}
            </div>
          ) : paginatedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
              <p className="text-muted-foreground">
                Tidak ada destinasi wisata flash sale yang sesuai dengan filter Anda.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* "Under Development" Section for empty states */}
      {paginatedDestinations.length === 0 && !isLoading && (
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
          <h2 className="text-2xl font-bold mb-2">Sedang Dalam Pengembangan</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Kami sedang bekerja keras untuk menyiapkan destinasi wisata yang luar biasa untuk Anda. Silakan kembali lagi
            nanti untuk melihat penawaran terbaru kami!
          </p>
        </div>
      )}
    </div>
  )
}
