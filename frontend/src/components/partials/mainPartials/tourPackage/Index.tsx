"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
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
type Category = "semua" | "populer" | "promo" | "flash-sale"

// Interface for travel package
interface IPaketWisata {
  _id: string
  nama: string
  destinasi: string[]
  deskripsi: string
  harga: number
  diskon?: number
  durasi: string
  maxPeserta: number
  rating: number
  foto: string[]
  fasilitas: string[]
  isPopular?: boolean
  isPromo?: boolean
  isFlashSale?: boolean
  createdAt?: string
  updatedAt?: string
}

// Sample data
const paketWisata: IPaketWisata[] = [
  {
    _id: "1",
    nama: "Pesona Bali 3 Hari 2 Malam",
    destinasi: ["Pantai Kuta", "Ubud", "Tanah Lot"],
    deskripsi: "Nikmati liburan di Pulau Dewata dengan mengunjungi destinasi-destinasi ikonik di Bali.",
    harga: 2500000,
    diskon: 15,
    durasi: "3 hari 2 malam",
    maxPeserta: 15,
    rating: 4.7,
    foto: ["/placeholder.svg?height=200&width=400"],
    fasilitas: ["Hotel", "Transport", "Makan 3x", "Tour Guide"],
    isPopular: true,
    isPromo: false,
    isFlashSale: false,
  },
  {
    _id: "2",
    nama: "Eksotisme Lombok",
    destinasi: ["Gili Trawangan", "Pantai Senggigi", "Gunung Rinjani"],
    deskripsi: "Jelajahi keindahan alam Lombok yang masih alami dan eksotis.",
    harga: 3000000,
    durasi: "4 hari 3 malam",
    maxPeserta: 10,
    rating: 4.8,
    foto: ["/placeholder.svg?height=200&width=400"],
    fasilitas: ["Hotel", "Transport", "Makan 3x", "Tour Guide", "Snorkeling"],
    isPopular: true,
    isPromo: true,
    isFlashSale: false,
  },
  {
    _id: "3",
    nama: "Petualangan Raja Ampat",
    destinasi: ["Pulau Wayag", "Teluk Kabui", "Pianemo"],
    deskripsi: "Eksplorasi surga bawah laut di Raja Ampat dengan keindahan terumbu karang dan ikan warna-warni.",
    harga: 8500000,
    diskon: 10,
    durasi: "5 hari 4 malam",
    maxPeserta: 8,
    rating: 4.9,
    foto: ["/placeholder.svg?height=200&width=400"],
    fasilitas: ["Resort", "Transport", "Makan 3x", "Tour Guide", "Diving", "Snorkeling"],
    isPopular: false,
    isPromo: false,
    isFlashSale: true,
  },
  {
    _id: "4",
    nama: "Wisata Budaya Yogyakarta",
    destinasi: ["Candi Borobudur", "Candi Prambanan", "Keraton Yogyakarta", "Malioboro"],
    deskripsi: "Telusuri sejarah dan budaya Jawa di kota pelajar Yogyakarta.",
    harga: 1800000,
    durasi: "3 hari 2 malam",
    maxPeserta: 20,
    rating: 4.6,
    foto: ["/placeholder.svg?height=200&width=400"],
    fasilitas: ["Hotel", "Transport", "Makan 2x", "Tour Guide", "Tiket Masuk"],
    isPopular: true,
    isPromo: false,
    isFlashSale: false,
  },
  {
    _id: "5",
    nama: "Gunung Bromo Sunrise Tour",
    destinasi: ["Gunung Bromo", "Bukit Teletubbies", "Pasir Berbisik", "Gunung Penanjakan"],
    deskripsi: "Saksikan keajaiban matahari terbit dari puncak Gunung Bromo yang memukau.",
    harga: 1500000,
    diskon: 5,
    durasi: "2 hari 1 malam",
    maxPeserta: 12,
    rating: 4.7,
    foto: ["/placeholder.svg?height=200&width=400"],
    fasilitas: ["Homestay", "Jeep 4x4", "Makan 2x", "Tour Guide", "Tiket Masuk"],
    isPopular: true,
    isPromo: true,
    isFlashSale: false,
  },
  {
    _id: "6",
    nama: "Eksplorasi Pulau Komodo",
    destinasi: ["Pulau Komodo", "Pulau Rinca", "Pink Beach", "Pulau Padar"],
    deskripsi: "Bertemu dengan komodo, hewan purba yang masih hidup hingga saat ini di habitat aslinya.",
    harga: 4500000,
    durasi: "4 hari 3 malam",
    maxPeserta: 10,
    rating: 4.8,
    foto: ["/placeholder.svg?height=200&width=400"],
    fasilitas: ["Hotel", "Kapal", "Makan 3x", "Tour Guide", "Ranger", "Snorkeling"],
    isPopular: false,
    isPromo: false,
    isFlashSale: true,
  },
  {
    _id: "7",
    nama: "Pesona Danau Toba",
    destinasi: ["Danau Toba", "Pulau Samosir", "Tomok", "Tuktuk"],
    deskripsi: "Nikmati keindahan danau vulkanik terbesar di dunia dengan budaya Batak yang kental.",
    harga: 2200000,
    durasi: "3 hari 2 malam",
    maxPeserta: 15,
    rating: 4.5,
    foto: ["/placeholder.svg?height=200&width=400"],
    fasilitas: ["Hotel", "Transport", "Makan 3x", "Tour Guide", "Kapal Ferry"],
    isPopular: false,
    isPromo: true,
    isFlashSale: false,
  },
  {
    _id: "8",
    nama: "Wisata Sejarah Malang",
    destinasi: ["Jatim Park", "Museum Angkut", "Kota Batu", "Candi Singosari"],
    deskripsi: "Jelajahi kota Malang yang sejuk dengan berbagai destinasi wisata edukatif dan sejarah.",
    harga: 1600000,
    diskon: 8,
    durasi: "3 hari 2 malam",
    maxPeserta: 20,
    rating: 4.4,
    foto: ["/placeholder.svg?height=200&width=400"],
    fasilitas: ["Hotel", "Transport", "Makan 2x", "Tour Guide", "Tiket Masuk"],
    isPopular: false,
    isPromo: true,
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

// Travel Package Card Component
const PaketWisataCard = ({ paket }: { paket: IPaketWisata }) => {
  const navigate = useNavigate()
  const discountedPrice = paket.diskon ? paket.harga - (paket.harga * paket.diskon) / 100 : paket.harga

  const handleViewDetail = () => {
    navigate(`/paket-wisata/${paket._id}`)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <img src={paket.foto[0] || "/placeholder.svg"} alt={paket.nama} className="h-48 w-full object-cover" />
        {paket.isFlashSale && <Badge className="absolute right-2 top-2 bg-red-500 hover:bg-red-600">Flash Sale</Badge>}
        {paket.isPromo && !paket.isFlashSale && (
          <Badge className="absolute right-2 top-2 bg-orange-500 hover:bg-orange-600">Promo</Badge>
        )}
        {paket.diskon && (
          <Badge className="absolute left-2 top-2 bg-green-500 hover:bg-green-600">{paket.diskon}% OFF</Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-1">{paket.nama}</CardTitle>
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
            {paket.rating}
          </div>
        </div>
        <CardDescription className="flex items-center mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span className="text-sm text-muted-foreground line-clamp-1">{paket.destinasi.join(", ")}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-1 mb-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {paket.durasi}
          </div>
          <div className="flex items-center text-xs text-muted-foreground ml-2">
            <Users className="h-3.5 w-3.5 mr-1" />
            Maks. {paket.maxPeserta} orang
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{paket.deskripsi}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {paket.fasilitas.slice(0, 3).map((fasilitas, index) => (
            <Badge key={index} variant="outline" className="bg-muted/50">
              {fasilitas}
            </Badge>
          ))}
          {paket.fasilitas.length > 3 && (
            <Badge variant="outline" className="bg-muted/50">
              +{paket.fasilitas.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          {paket.diskon ? (
            <div>
              <span className="text-sm line-through text-muted-foreground">{formatCurrency(paket.harga)}</span>
              <div className="text-lg font-bold text-primary">{formatCurrency(discountedPrice)}</div>
            </div>
          ) : (
            <div className="text-lg font-bold text-primary">{formatCurrency(paket.harga)}</div>
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
const PaketWisataCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <CardHeader className="p-4 pb-0">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="p-4 pt-2">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <div className="flex gap-2 mt-3">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0 flex justify-between items-center">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-9 w-24" />
    </CardFooter>
  </Card>
)

// Recommendation Component
const RecommendationSection = ({ paketWisata }: { paketWisata: IPaketWisata[] }) => {
  // Get 3 random popular packages for recommendations
  const recommendedPaket = paketWisata
    .filter((p) => p.isPopular)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)

  return (
    <div className="mt-8 mb-12">
      <h2 className="text-2xl font-bold mb-4">Rekomendasi Untuk Anda</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedPaket.map((paket) => (
          <PaketWisataCard key={`rec-${paket._id}`} paket={paket} />
        ))}
      </div>
    </div>
  )
}

// Main Component
const PaketWisataPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [selectedCategory, setSelectedCategory] = useState<Category>("semua")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState("recommended")
  const [durasiFilter, setDurasiFilter] = useState("")
  const [hargaFilter, setHargaFilter] = useState("")
  const [fasilitasFilter, setFasilitasFilter] = useState("")

  const itemsPerPage = 6

  // Filter packages based on search, category, and other filters
  const filteredPaket = paketWisata.filter((paket) => {
    // Search filter
    const matchesSearch =
      debouncedSearchQuery === "" ||
      paket.nama.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      paket.destinasi.some((dest) => dest.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
      paket.deskripsi.toLowerCase().includes(debouncedSearchQuery.toLowerCase())

    // Category filter
    let matchesCategory = true
    if (selectedCategory === "populer") {
      matchesCategory = !!paket.isPopular
    } else if (selectedCategory === "promo") {
      matchesCategory = !!paket.isPromo
    } else if (selectedCategory === "flash-sale") {
      matchesCategory = !!paket.isFlashSale
    }

    // Durasi filter
    let matchesDurasi = true
    if (durasiFilter === "1-2-days") {
      matchesDurasi = paket.durasi.includes("1 malam") || paket.durasi.includes("2 hari")
    } else if (durasiFilter === "3-4-days") {
      matchesDurasi = paket.durasi.includes("3 hari") || paket.durasi.includes("4 hari")
    } else if (durasiFilter === "5-plus-days") {
      matchesDurasi =
        paket.durasi.includes("5 hari") || paket.durasi.includes("6 hari") || paket.durasi.includes("7 hari")
    }

    // Harga filter
    let matchesHarga = true
    if (hargaFilter === "under-2m") {
      matchesHarga = paket.harga < 2000000
    } else if (hargaFilter === "2m-4m") {
      matchesHarga = paket.harga >= 2000000 && paket.harga <= 4000000
    } else if (hargaFilter === "above-4m") {
      matchesHarga = paket.harga > 4000000
    }

    // Fasilitas filter
    let matchesFasilitas = true
    if (fasilitasFilter && fasilitasFilter !== "semua") {
      matchesFasilitas = paket.fasilitas.some((f) => f.toLowerCase() === fasilitasFilter.toLowerCase())
    }

    return matchesSearch && matchesCategory && matchesDurasi && matchesHarga && matchesFasilitas
  })

  // Sort packages
  const sortedPaket = [...filteredPaket].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.harga - b.harga
    } else if (sortBy === "price-high") {
      return b.harga - a.harga
    } else if (sortBy === "rating") {
      return b.rating - a.rating
    } else if (sortBy === "duration-short") {
      return a.durasi.localeCompare(b.durasi)
    } else if (sortBy === "duration-long") {
      return b.durasi.localeCompare(a.durasi)
    }
    // Default: recommended (no specific sort)
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedPaket.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPaket = sortedPaket.slice(startIndex, startIndex + itemsPerPage)

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setIsLoading(true)
    setCurrentPage(page)
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  // Handle search change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }, [])

  // Handle category change
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value as Category)
    setCurrentPage(1)
  }, [])

  // Reset filters
  const resetFilters = useCallback(() => {
    setDurasiFilter("")
    setHargaFilter("")
    setFasilitasFilter("")
  }, [])

  // Get all unique facilities for filter
  const allFasilitas = Array.from(new Set(paketWisata.flatMap((paket) => paket.fasilitas)))

  // Simulate loading effect when changing filters
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [debouncedSearchQuery, selectedCategory, durasiFilter, hargaFilter, fasilitasFilter, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Jelajahi Paket Wisata Kami</h1>
        <p className="text-muted-foreground">
          Temukan berbagai paket wisata dan persiapkan petualangan Anda berikutnya!
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari paket wisata..."
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
                <SelectItem value="duration-short">Durasi: Terpendek</SelectItem>
                <SelectItem value="duration-long">Durasi: Terpanjang</SelectItem>
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
                    <h3 className="text-sm font-medium">Durasi</h3>
                    <Select value={durasiFilter} onValueChange={setDurasiFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih durasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-durasi">Semua Durasi</SelectItem>
                        <SelectItem value="1-2-days">1-2 Hari</SelectItem>
                        <SelectItem value="3-4-days">3-4 Hari</SelectItem>
                        <SelectItem value="5-plus-days">5+ Hari</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Rentang Harga</h3>
                    <Select value={hargaFilter} onValueChange={setHargaFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih rentang harga" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-harga">Semua Harga</SelectItem>
                        <SelectItem value="under-2m">Di bawah Rp2.000.000</SelectItem>
                        <SelectItem value="2m-4m">Rp2.000.000 - Rp4.000.000</SelectItem>
                        <SelectItem value="above-4m">Di atas Rp4.000.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Fasilitas</h3>
                    <Select value={fasilitasFilter} onValueChange={setFasilitasFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih fasilitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semua">Semua Fasilitas</SelectItem>
                        {allFasilitas.map((fasilitas) => (
                          <SelectItem key={fasilitas} value={fasilitas.toLowerCase()}>
                            {fasilitas}
                          </SelectItem>
                        ))}
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
          <RecommendationSection paketWisata={paketWisata} />

          {/* Packages Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <PaketWisataCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
          ) : paginatedPaket.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPaket.map((paket) => (
                <PaketWisataCard key={paket._id} paket={paket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
              <p className="text-muted-foreground mb-4">
                Tidak ada paket wisata yang sesuai dengan filter Anda. Coba ubah filter atau cari dengan kata kunci
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
                  <PaketWisataCardSkeleton key={`skeleton-pop-${index}`} />
                ))}
            </div>
          ) : paginatedPaket.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPaket.map((paket) => (
                <PaketWisataCard key={paket._id} paket={paket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
              <p className="text-muted-foreground">Tidak ada paket wisata populer yang sesuai dengan filter Anda.</p>
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
                  <PaketWisataCardSkeleton key={`skeleton-promo-${index}`} />
                ))}
            </div>
          ) : paginatedPaket.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPaket.map((paket) => (
                <PaketWisataCard key={paket._id} paket={paket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
              <p className="text-muted-foreground">Tidak ada paket wisata promo yang sesuai dengan filter Anda.</p>
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
                  <PaketWisataCardSkeleton key={`skeleton-flash-${index}`} />
                ))}
            </div>
          ) : paginatedPaket.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPaket.map((paket) => (
                <PaketWisataCard key={paket._id} paket={paket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
              <p className="text-muted-foreground">Tidak ada paket wisata flash sale yang sesuai dengan filter Anda.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* "Under Development" Section for empty states */}
      {paginatedPaket.length === 0 && !isLoading && (
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
            Kami sedang bekerja keras untuk menyiapkan paket wisata yang luar biasa untuk Anda. Silakan kembali lagi
            nanti untuk melihat penawaran terbaru kami!
          </p>
        </div>
      )}
    </div>
  )
}

export default PaketWisataPage
