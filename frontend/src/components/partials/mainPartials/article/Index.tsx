"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Search, Calendar, Clock, ChevronRight, Bookmark, Share2, TrendingUp, Eye } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

// Types
interface Artikel {
  id: string
  judul: string
  slug: string
  ringkasan: string
  isi: string
  gambar: string
  kategori: string[]
  penulis: {
    nama: string
    avatar: string
  }
  tanggalPublikasi: string
  waktuBaca: number
  dilihat: number
  isTrending: boolean
  isPopular: boolean
  isFeatured: boolean
}

type Kategori = "semua" | "wisata-alam" | "wisata-kuliner" | "wisata-sejarah" | "tips-travel" | "budaya"

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

// Format date
const formatTanggal = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, "d MMMM yyyy", { locale: id })
}

// Sample data
const artikelData: Artikel[] = [
  {
    id: "1",
    judul: "10 Pantai Tersembunyi di Bali yang Belum Banyak Dikunjungi Wisatawan",
    slug: "pantai-tersembunyi-bali",
    ringkasan:
      "Jelajahi keindahan pantai-pantai tersembunyi di Bali yang masih alami dan belum terjamah oleh keramaian wisatawan.",
    isi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    gambar: "/placeholder.svg?height=400&width=600",
    kategori: ["wisata-alam", "pantai"],
    penulis: {
      nama: "Andi Wijaya",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tanggalPublikasi: "2023-06-15",
    waktuBaca: 5,
    dilihat: 1250,
    isTrending: true,
    isPopular: true,
    isFeatured: true,
  },
  {
    id: "2",
    judul: "Panduan Lengkap Menjelajahi Kuliner Khas Yogyakarta",
    slug: "kuliner-khas-yogyakarta",
    ringkasan: "Temukan berbagai kuliner khas Yogyakarta yang wajib dicoba saat berkunjung ke kota pelajar ini.",
    isi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    gambar: "/placeholder.svg?height=400&width=600",
    kategori: ["wisata-kuliner", "yogyakarta"],
    penulis: {
      nama: "Dewi Lestari",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tanggalPublikasi: "2023-07-22",
    waktuBaca: 8,
    dilihat: 980,
    isTrending: false,
    isPopular: true,
    isFeatured: false,
  },
  {
    id: "3",
    judul: "Sejarah di Balik Candi Borobudur yang Jarang Diketahui",
    slug: "sejarah-candi-borobudur",
    ringkasan: "Menguak fakta-fakta menarik dan sejarah tersembunyi di balik kemegahan Candi Borobudur.",
    isi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    gambar: "/placeholder.svg?height=400&width=600",
    kategori: ["wisata-sejarah", "candi", "jawa-tengah"],
    penulis: {
      nama: "Prof. Bambang Sutrisno",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tanggalPublikasi: "2023-05-10",
    waktuBaca: 12,
    dilihat: 1560,
    isTrending: true,
    isPopular: false,
    isFeatured: true,
  },
  {
    id: "4",
    judul: "Tips Hemat Traveling ke Luar Negeri dengan Budget Terbatas",
    slug: "tips-hemat-traveling-luar-negeri",
    ringkasan: "Berbagai tips dan trik untuk bisa traveling ke luar negeri meskipun dengan budget yang terbatas.",
    isi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    gambar: "/placeholder.svg?height=400&width=600",
    kategori: ["tips-travel", "budget-travel"],
    penulis: {
      nama: "Rini Sulistyawati",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tanggalPublikasi: "2023-08-05",
    waktuBaca: 7,
    dilihat: 2100,
    isTrending: true,
    isPopular: true,
    isFeatured: false,
  },
  {
    id: "5",
    judul: "Mengenal Tradisi Upacara Kasada di Gunung Bromo",
    slug: "tradisi-upacara-kasada-bromo",
    ringkasan: "Mempelajari tradisi unik Upacara Kasada yang dilakukan oleh Suku Tengger di kawasan Gunung Bromo.",
    isi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    gambar: "/placeholder.svg?height=400&width=600",
    kategori: ["budaya", "tradisi", "jawa-timur"],
    penulis: {
      nama: "Dr. Hendra Wijaya",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tanggalPublikasi: "2023-07-01",
    waktuBaca: 10,
    dilihat: 890,
    isTrending: false,
    isPopular: false,
    isFeatured: true,
  },
  {
    id: "6",
    judul: "Panduan Lengkap Mendaki Gunung Rinjani untuk Pemula",
    slug: "panduan-mendaki-rinjani-pemula",
    ringkasan: "Informasi lengkap dan tips untuk pendaki pemula yang ingin menaklukkan Gunung Rinjani di Lombok.",
    isi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    gambar: "/placeholder.svg?height=400&width=600",
    kategori: ["wisata-alam", "pendakian", "lombok"],
    penulis: {
      nama: "Agus Pendaki",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tanggalPublikasi: "2023-06-20",
    waktuBaca: 15,
    dilihat: 1750,
    isTrending: true,
    isPopular: true,
    isFeatured: false,
  },
  {
    id: "7",
    judul: "7 Festival Budaya Indonesia yang Mendunia",
    slug: "festival-budaya-indonesia-mendunia",
    ringkasan: "Mengenal berbagai festival budaya Indonesia yang telah diakui dan diminati oleh wisatawan mancanegara.",
    isi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    gambar: "/placeholder.svg?height=400&width=600",
    kategori: ["budaya", "festival", "event"],
    penulis: {
      nama: "Siti Nurhaliza",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tanggalPublikasi: "2023-08-15",
    waktuBaca: 9,
    dilihat: 1120,
    isTrending: false,
    isPopular: true,
    isFeatured: true,
  },
  {
    id: "8",
    judul: "Wisata Kuliner Malam di Jakarta yang Wajib Dicoba",
    slug: "wisata-kuliner-malam-jakarta",
    ringkasan:
      "Rekomendasi tempat wisata kuliner malam di Jakarta yang menawarkan cita rasa autentik dan suasana yang menarik.",
    isi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    gambar: "/placeholder.svg?height=400&width=600",
    kategori: ["wisata-kuliner", "jakarta", "kuliner-malam"],
    penulis: {
      nama: "Budi Santoso",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tanggalPublikasi: "2023-08-10",
    waktuBaca: 6,
    dilihat: 980,
    isTrending: true,
    isPopular: false,
    isFeatured: false,
  },
  {
    id: "9",
    judul: "Menjelajahi Keindahan Bawah Laut Raja Ampat",
    slug: "keindahan-bawah-laut-raja-ampat",
    ringkasan: "Pengalaman menyelam dan menikmati keindahan terumbu karang dan biota laut di Raja Ampat, Papua.",
    isi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    gambar: "/placeholder.svg?height=400&width=600",
    kategori: ["wisata-alam", "diving", "papua"],
    penulis: {
      nama: "Maya Oceanographer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tanggalPublikasi: "2023-07-28",
    waktuBaca: 8,
    dilihat: 1450,
    isTrending: false,
    isPopular: true,
    isFeatured: true,
  },
  {
    id: "10",
    judul: "Cara Mengurus Visa Schengen untuk Liburan ke Eropa",
    slug: "cara-mengurus-visa-schengen",
    ringkasan: "Panduan lengkap dan tips mengurus visa Schengen untuk perjalanan wisata ke negara-negara Eropa.",
    isi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    gambar: "/placeholder.svg?height=400&width=600",
    kategori: ["tips-travel", "visa", "eropa"],
    penulis: {
      nama: "Diana Traveler",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tanggalPublikasi: "2023-06-05",
    waktuBaca: 11,
    dilihat: 2300,
    isTrending: true,
    isPopular: true,
    isFeatured: false,
  },
  {
    id: "11",
    judul: "Mengenal Seni Batik dari Berbagai Daerah di Indonesia",
    slug: "seni-batik-indonesia",
    ringkasan: "Mempelajari keunikan dan filosofi di balik motif batik dari berbagai daerah di Indonesia.",
    isi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    gambar: "/placeholder.svg?height=400&width=600",
    kategori: ["budaya", "seni", "batik"],
    penulis: {
      nama: "Prof. Ratna Batik",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tanggalPublikasi: "2023-05-20",
    waktuBaca: 9,
    dilihat: 1050,
    isTrending: false,
    isPopular: false,
    isFeatured: true,
  },
  {
    id: "12",
    judul: "5 Destinasi Wisata Ramah Anak di Indonesia",
    slug: "destinasi-wisata-ramah-anak",
    ringkasan: "Rekomendasi tempat wisata yang cocok untuk liburan bersama anak-anak di Indonesia.",
    isi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    gambar: "/placeholder.svg?height=400&width=600",
    kategori: ["wisata-keluarga", "anak", "liburan"],
    penulis: {
      nama: "Lina Family",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tanggalPublikasi: "2023-08-20",
    waktuBaca: 7,
    dilihat: 890,
    isTrending: true,
    isPopular: true,
    isFeatured: false,
  },
]

// Artikel Card Component
const ArtikelCard = ({ artikel }: { artikel: Artikel }) => {
  const navigate = useNavigate()

  const handleViewDetail = () => {
    navigate(`/artikel/${artikel.slug}`)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <img src={artikel.gambar || "/placeholder.svg"} alt={artikel.judul} className="h-48 w-full object-cover" />
        {artikel.isTrending && (
          <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Trending
          </Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {artikel.kategori.slice(0, 2).map((kategori) => (
            <Badge key={kategori} variant="outline" className="bg-muted/50">
              {kategori.replace(/-/g, " ")}
            </Badge>
          ))}
        </div>
        <CardTitle
          className="text-lg font-bold line-clamp-2 hover:text-primary cursor-pointer"
          onClick={handleViewDetail}
        >
          {artikel.judul}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{artikel.ringkasan}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {formatTanggal(artikel.tanggalPublikasi)}
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {artikel.waktuBaca} menit baca
          </div>
          <div className="flex items-center">
            <Eye className="h-3.5 w-3.5 mr-1" />
            {artikel.dilihat.toLocaleString()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={artikel.penulis.avatar || "/placeholder.svg"} alt={artikel.penulis.nama} />
            <AvatarFallback>{artikel.penulis.nama.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs">{artikel.penulis.nama}</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Featured Article Component
const FeaturedArticle = ({ artikel }: { artikel: Artikel }) => {
  const navigate = useNavigate()

  const handleViewDetail = () => {
    navigate(`/artikel/${artikel.slug}`)
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img src={artikel.gambar || "/placeholder.svg"} alt={artikel.judul} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex flex-wrap gap-2 mb-3">
          {artikel.kategori.slice(0, 2).map((kategori) => (
            <Badge key={kategori} className="bg-primary/80 hover:bg-primary text-white">
              {kategori.replace(/-/g, " ")}
            </Badge>
          ))}
        </div>
        <h2
          className="text-2xl font-bold mb-2 line-clamp-2 hover:text-primary/90 cursor-pointer"
          onClick={handleViewDetail}
        >
          {artikel.judul}
        </h2>
        <p className="text-sm text-gray-200 line-clamp-2 mb-3">{artikel.ringkasan}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src={artikel.penulis.avatar || "/placeholder.svg"} alt={artikel.penulis.nama} />
              <AvatarFallback>{artikel.penulis.nama.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{artikel.penulis.nama}</div>
              <div className="text-xs text-gray-300">{formatTanggal(artikel.tanggalPublikasi)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {artikel.waktuBaca} menit baca
            </div>
            <div className="flex items-center">
              <Eye className="h-3.5 w-3.5 mr-1" />
              {artikel.dilihat.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading Skeleton
const ArtikelCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <CardHeader className="p-4 pb-2">
      <div className="flex gap-2 mb-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-6 w-full mb-1" />
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-full mb-3" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0 flex justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </CardFooter>
  </Card>
)

// Main Component
export default function ArtikelPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [selectedKategori, setSelectedKategori] = useState<Kategori>("semua")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState("terbaru")

  const itemsPerPage = 6

  // Filter articles based on search, category, and other filters
  const filteredArtikel = artikelData.filter((artikel) => {
    // Search filter
    const matchesSearch =
      debouncedSearchQuery === "" ||
      artikel.judul.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      artikel.ringkasan.toLowerCase().includes(debouncedSearchQuery.toLowerCase())

    // Category filter
    let matchesKategori = true
    if (selectedKategori !== "semua") {
      matchesKategori = artikel.kategori.includes(selectedKategori)
    }

    return matchesSearch && matchesKategori
  })

  // Sort articles
  const sortedArtikel = [...filteredArtikel].sort((a, b) => {
    if (sortBy === "terbaru") {
      return new Date(b.tanggalPublikasi).getTime() - new Date(a.tanggalPublikasi).getTime()
    } else if (sortBy === "terpopuler") {
      return b.dilihat - a.dilihat
    } else if (sortBy === "waktu-baca") {
      return a.waktuBaca - b.waktuBaca
    }
    // Default: terbaru
    return new Date(b.tanggalPublikasi).getTime() - new Date(a.tanggalPublikasi).getTime()
  })

  // Pagination
  const totalPages = Math.ceil(sortedArtikel.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedArtikel = sortedArtikel.slice(startIndex, startIndex + itemsPerPage)

  // Get featured articles
  const featuredArticles = artikelData.filter((artikel) => artikel.isFeatured).slice(0, 3)

  // Get trending articles
  const trendingArticles = artikelData
    .filter((artikel) => artikel.isTrending)
    .sort((a, b) => b.dilihat - a.dilihat)
    .slice(0, 4)

  // Handle page change
  const handlePageChange = (page: number) => {
    setIsLoading(true)
    setCurrentPage(page)
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 500)
  }

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  // Handle category change
  const handleKategoriChange = (value: string) => {
    setSelectedKategori(value as Kategori)
    setCurrentPage(1)
  }

  // Simulate loading effect when changing filters
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [debouncedSearchQuery, selectedKategori, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Pustaka Artikel Travedia</h1>
        <p className="text-muted-foreground">Menghadirkan informasi terbaru seputar wisata, dan hal menarik lainnya.</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari artikel..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Featured Articles */}
      {currentPage === 1 && !debouncedSearchQuery && selectedKategori === "semua" && (
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {featuredArticles.length > 0 && <FeaturedArticle artikel={featuredArticles[0]} />}
            </div>
            <div className="flex flex-col gap-3">
              {featuredArticles.slice(1, 3).map((artikel) => (
                <Card key={artikel.id} className="overflow-hidden">
                  <div className="flex h-full">
                    <div className="w-1/3">
                      <img
                        src={artikel.gambar || "/placeholder.svg"}
                        alt={artikel.judul}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-3">
                      <Badge variant="outline" className="mb-2">
                        {artikel.kategori[0].replace(/-/g, " ")}
                      </Badge>
                      <h3 className="font-bold line-clamp-2 text-sm mb-1 hover:text-primary cursor-pointer">
                        {artikel.judul}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatTanggal(artikel.tanggalPublikasi)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <Tabs defaultValue="semua" value={selectedKategori} onValueChange={handleKategoriChange} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="semua">Semua</TabsTrigger>
            <TabsTrigger value="wisata-alam">Wisata Alam</TabsTrigger>
            <TabsTrigger value="wisata-kuliner">Wisata Kuliner</TabsTrigger>
            <TabsTrigger value="wisata-sejarah">Wisata Sejarah</TabsTrigger>
            <TabsTrigger value="tips-travel">Tips Travel</TabsTrigger>
            <TabsTrigger value="budaya">Budaya</TabsTrigger>
          </TabsList>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terbaru">Terbaru</SelectItem>
              <SelectItem value="terpopuler">Terpopuler</SelectItem>
              <SelectItem value="waktu-baca">Waktu Baca Tercepat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="semua" className="mt-0">
          {/* Trending Section */}
          {currentPage === 1 && !debouncedSearchQuery && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-red-500" /> Trending Saat Ini
                </h2>
                <Button variant="link" className="flex items-center">
                  Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {trendingArticles.map((artikel) => (
                  <Card key={artikel.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={artikel.gambar || "/placeholder.svg"}
                        alt={artikel.judul}
                        className="h-36 w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <h3 className="font-bold line-clamp-2 text-sm hover:text-primary/90 cursor-pointer">
                          {artikel.judul}
                        </h3>
                        <div className="flex items-center text-xs text-gray-300 mt-1">
                          <Eye className="h-3 w-3 mr-1" />
                          {artikel.dilihat.toLocaleString()} dilihat
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <ArtikelCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
          ) : paginatedArtikel.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArtikel.map((artikel) => (
                <ArtikelCard key={artikel.id} artikel={artikel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
              <p className="text-muted-foreground mb-4">
                Tidak ada artikel yang sesuai dengan pencarian Anda. Coba kata kunci lain atau filter yang berbeda.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedKategori("semua")
                  setSortBy("terbaru")
                }}
              >
                Reset Filter
              </Button>
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

        {/* Other category tabs have similar structure */}
        {["wisata-alam", "wisata-kuliner", "wisata-sejarah", "tips-travel", "budaya"].map((kategori) => (
          <TabsContent key={kategori} value={kategori} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <ArtikelCardSkeleton key={`skeleton-${kategori}-${index}`} />
                  ))}
              </div>
            ) : paginatedArtikel.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedArtikel.map((artikel) => (
                  <ArtikelCard key={artikel.id} artikel={artikel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
                <p className="text-muted-foreground">
                  Tidak ada artikel dalam kategori ini yang sesuai dengan pencarian Anda.
                </p>
              </div>
            )}

            {/* Pagination (same as above) */}
            {!isLoading && totalPages > 1 && (
              <Pagination className="mt-8">{/* Same pagination structure as above */}</Pagination>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Newsletter Subscription */}
      <div className="mt-16 mb-8 bg-primary/5 rounded-xl p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Dapatkan Artikel Terbaru</h2>
          <p className="text-muted-foreground mb-6">
            Berlangganan newsletter kami untuk mendapatkan informasi terbaru seputar wisata dan travel.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input type="email" placeholder="Alamat email Anda" className="flex-1" />
            <Button>Berlangganan</Button>
          </div>
        </div>
      </div>

      {/* "Under Development" Section for empty states */}
      {paginatedArtikel.length === 0 && !isLoading && (
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
            Kami sedang bekerja keras untuk menyiapkan artikel yang menarik untuk Anda. Silakan kembali lagi nanti untuk
            melihat konten terbaru kami!
          </p>
        </div>
      )}
    </div>
  )
}
