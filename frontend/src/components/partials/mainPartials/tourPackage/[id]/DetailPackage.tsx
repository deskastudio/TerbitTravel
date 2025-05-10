"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Info,
  Minus,
  Plus,
  Hotel,
  Bus,
  Utensils,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton" // Tambahkan impor Skeleton
import { TourPackageService } from "@/services/tour-package.service" // Tambahkan impor service
import { ITourPackage, Schedule, TourPackageStatus } from "@/types/tour-package.types" // Impor tipe data dari file types

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format tanggal
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
  return new Date(dateString).toLocaleDateString("id-ID", options)
}

// Komponen untuk menampilkan status paket wisata
const StatusBadge = ({ status }: { status: TourPackageStatus }) => {
  const statusConfig = {
    available: { label: "Tersedia", color: "bg-green-500 hover:bg-green-600" },
    booked: { label: "Sudah Dipesan", color: "bg-orange-500 hover:bg-orange-600" },
    in_progress: { label: "Sedang Berlangsung", color: "bg-blue-500 hover:bg-blue-600" },
    completed: { label: "Selesai", color: "bg-gray-500 hover:bg-gray-600" },
    cancelled: { label: "Dibatalkan", color: "bg-red-500 hover:bg-red-600" },
  }

  const config = statusConfig[status]

  return <Badge className={config.color}>{config.label}</Badge>
}

// Komponen untuk menampilkan rating hotel dengan bintang
const HotelStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`} />
      ))}
    </div>
  )
}

// Komponen Skeleton untuk loading
const DetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/2 mb-2" />
      </div>

      <Skeleton className="w-full h-[400px] rounded-xl mb-8" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-10 w-full mb-6" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>

        <div>
          <Skeleton className="h-[500px] w-full rounded-lg mb-6" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Data placeholder untuk ulasan dan galeri
const placeholderData = {
  ulasan: [
    {
      id: "u1",
      nama: "Pengunjung",
      foto: "/placeholder.svg?height=40&width=40",
      rating: 5,
      tanggal: "20 Februari 2023",
      komentar: "Paket wisata yang sangat memuaskan! Tour guide sangat ramah dan profesional.",
    },
    {
      id: "u2",
      nama: "Pengunjung",
      foto: "/placeholder.svg?height=40&width=40",
      rating: 4,
      tanggal: "15 Maret 2023",
      komentar: "Perjalanan yang menyenangkan. Hotel yang disediakan nyaman dan bersih.",
    },
  ],
  ratingStats: {
    total: 38,
    average: 4.5,
    distribution: [2, 3, 5, 12, 16],
  },
  galeri: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ],
  // Data placeholder untuk itinerary
  itinerary: [
    {
      hari: 1,
      aktivitas: [
        {
          waktu: "08:00 - 10:00",
          kegiatan: "Penjemputan di Lokasi",
          deskripsi: "Penjemputan oleh tour guide dan langsung menuju hotel untuk check-in.",
        },
        {
          waktu: "12:00 - 13:00",
          kegiatan: "Makan Siang",
          deskripsi: "Makan siang di restoran lokal dengan menu khas daerah.",
        },
      ],
    },
    {
      hari: 2,
      aktivitas: [
        {
          waktu: "07:00 - 08:00",
          kegiatan: "Sarapan di Hotel",
          deskripsi: "Sarapan pagi dengan menu internasional dan lokal.",
        },
        {
          waktu: "09:00 - 12:00",
          kegiatan: "Mengunjungi Objek Wisata",
          deskripsi: "Mengunjungi objek wisata utama di daerah.",
        },
      ],
    },
  ],
  // Data placeholder untuk FAQ
  faq: [
    {
      pertanyaan: "Apakah paket ini tersedia setiap hari?",
      jawaban:
        "Ya, paket ini tersedia untuk keberangkatan sesuai jadwal yang tertera. Untuk jadwal di luar yang tertera, silakan hubungi customer service kami.",
    },
    {
      pertanyaan: "Bagaimana jika saya ingin memperpanjang masa menginap?",
      jawaban:
        "Anda dapat memperpanjang masa menginap dengan tambahan biaya. Silakan hubungi customer service kami untuk informasi lebih lanjut.",
    },
  ],
}

export default function PaketWisataDetail() {
  const { id } = useParams<{ id: string }>() // Ambil ID dari URL
  const navigate = useNavigate()
  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState("")
  const [jumlahPeserta, setJumlahPeserta] = useState(2)

  // Ambil data paket wisata berdasarkan ID
  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        setIsLoading(true)
        if (!id) {
          throw new Error("ID paket wisata tidak ditemukan")
        }
        
        const data = await TourPackageService.getPackageById(id)
        console.log("Data paket wisata dari API:", data)
        setPaketWisata(data)
      } catch (error) {
        console.error("Error fetching package detail:", error)
        setError("Gagal mengambil data paket wisata")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackageDetail()
  }, [id])

  // Fungsi navigasi galeri
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === (placeholderData.galeri.length - 1) ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? placeholderData.galeri.length - 1 : prev - 1))
  }

  // Hitung total harga
  const calculateTotal = () => {
    if (!selectedSchedule || !paketWisata) return 0
    return paketWisata.harga * jumlahPeserta
  }

  // Mendapatkan jadwal yang dipilih
  const getSelectedSchedule = () => {
    if (!selectedSchedule || !paketWisata) return null
    return paketWisata.jadwal.find((j) => `${j.tanggalAwal}-${j.tanggalAkhir}` === selectedSchedule)
  }

  // Jika masih loading, tampilkan skeleton
  if (isLoading) {
    return <DetailSkeleton />
  }

  // Jika terjadi error, tampilkan pesan error
  if (error || !paketWisata) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Paket wisata tidak ditemukan"}</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/paket-wisata")}>
          Kembali ke Daftar Paket Wisata
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb dan Tombol Kembali */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 p-0 hover:bg-transparent" 
          onClick={() => navigate("/paket-wisata")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Paket Wisata</span>
        </Button>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-3xl font-bold">{paketWisata.nama}</h1>
          <StatusBadge status={paketWisata.status} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            <span>
              {paketWisata.destination.nama}, {paketWisata.destination.lokasi}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{paketWisata.durasi}</span>
          </div>
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span>
              {placeholderData.ratingStats.average} ({placeholderData.ratingStats.total} ulasan)
            </span>
          </div>
        </div>
      </div>

      {/* Galeri Foto */}
      <div className="relative mb-8 overflow-hidden rounded-xl">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={placeholderData.galeri[currentImageIndex] || "/placeholder.svg"}
            alt={`${paketWisata.nama} - Foto ${currentImageIndex + 1}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Navigasi Galeri */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
          onClick={prevImage}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
          onClick={nextImage}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Indikator Foto */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
          {placeholderData.galeri.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              } transition-all`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="absolute right-4 top-4 flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 hover:bg-white"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full bg-white/80 hover:bg-white">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Informasi dan Tab */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Konten Utama */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6 grid w-full grid-cols-4">
              <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="info">Info Penting</TabsTrigger>
              <TabsTrigger value="reviews">Ulasan</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-3 text-xl font-semibold">Tentang Paket Wisata</h2>
                  <div className="text-muted-foreground whitespace-pre-line">{paketWisata.deskripsi}</div>
                </div>

                <Separator />

                {/* Informasi Akomodasi dan Transportasi */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card>
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Hotel className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Akomodasi</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Hotel:</span> {paketWisata.hotel.nama}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Rating:</span>
                          <HotelStars rating={paketWisata.hotel.bintang} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Bus className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Transportasi</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Armada:</span> {paketWisata.armada.nama}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Kapasitas:</span> {paketWisata.armada.kapasitas} orang
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Konsumsi</h3>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Paket Makan:</span> {paketWisata.consume.nama}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Kategori</h3>
                      </div>
                      <div className="text-sm">
                        <Badge variant="secondary">{paketWisata.kategori.title}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">Fasilitas</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-medium">Yang Termasuk:</h3>
                      <ul className="space-y-2">
                        {paketWisata.include.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium">Yang Tidak Termasuk:</h3>
                      <ul className="space-y-2">
                        {paketWisata.exclude.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Minus className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="itinerary">
              <div className="space-y-6">
                <h2 className="mb-3 text-xl font-semibold">Itinerary {paketWisata.durasi}</h2>

                <div className="space-y-8">
                  {placeholderData.itinerary.map((hari) => (
                    <div key={hari.hari} className="relative border-l-2 border-primary/30 pl-6">
                      <div className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {hari.hari}
                      </div>
                      <h3 className="mb-4 text-lg font-medium">Hari {hari.hari}</h3>

                      <div className="space-y-4">
                        {hari.aktivitas.map((aktivitas, index) => (
                          <div key={index} className="relative rounded-lg border p-4">
                            <div className="mb-2 font-medium">{aktivitas.kegiatan}</div>
                            <div className="mb-2 text-sm text-muted-foreground">{aktivitas.waktu}</div>
                            <div className="text-sm text-muted-foreground">{aktivitas.deskripsi}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-3 text-xl font-semibold">Yang Termasuk dalam Paket</h2>
                  <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                    {paketWisata.include.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">Yang Tidak Termasuk dalam Paket</h2>
                  <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                    {paketWisata.exclude.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">Syarat & Ketentuan</h2>
                  <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                    <li>Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya</li>
                    <li>Minimal peserta 2 orang</li>
                    <li>Pembayaran DP 50% untuk konfirmasi booking</li>
                    <li>Pembatalan 7 hari sebelum keberangkatan dikenakan biaya 50%</li>
                    <li>Pembatalan 3 hari sebelum keberangkatan dikenakan biaya 100%</li>
                    <li>Itinerary dapat berubah menyesuaikan kondisi lapangan</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">Pertanyaan Umum</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {placeholderData.faq.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{item.pertanyaan}</AccordionTrigger>
                        <AccordionContent>{item.jawaban}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Rating Summary */}
                  <div className="md:w-1/3">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="mb-2 text-center text-4xl font-bold">{placeholderData.ratingStats.average}</div>
                      <div className="mb-4 flex justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(placeholderData.ratingStats.average)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        Berdasarkan {placeholderData.ratingStats.total} ulasan
                      </div>

                      <div className="mt-4 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <div className="w-8 text-sm">{rating} ★</div>
                            <Progress
                              value={
                                (placeholderData.ratingStats.distribution[5 - rating] /
                                  placeholderData.ratingStats.total) *
                                100
                              }
                              className="h-2"
                            />
                            <div className="w-8 text-right text-sm text-muted-foreground">
                              {placeholderData.ratingStats.distribution[5 - rating]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="md:w-2/3">
                    <h2 className="mb-4 text-xl font-semibold">Ulasan Peserta Tour</h2>
                    <div className="space-y-4">
                      {placeholderData.ulasan.map((ulasan) => (
                        <Card key={ulasan.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={ulasan.foto || "/placeholder.svg"} alt={ulasan.nama} />
                                  <AvatarFallback>{ulasan.nama.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{ulasan.nama}</div>
                                  <div className="text-sm text-muted-foreground">{ulasan.tanggal}</div>
                                </div>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < ulasan.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="mt-3 text-muted-foreground">{ulasan.komentar}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="outline">Lihat Semua Ulasan</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Booking Form */}
        <div>
          <div className="sticky top-8 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Harga</div>
                    <div className="text-2xl font-bold text-primary">{formatCurrency(paketWisata.harga)}</div>
                    <div className="text-sm text-muted-foreground">per orang</div>
                  </div>
                  <StatusBadge status={paketWisata.status} />
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tanggal">Pilih Jadwal Keberangkatan</Label>
                    <Select value={selectedSchedule} onValueChange={setSelectedSchedule}>
                      <SelectTrigger id="tanggal">
                        <SelectValue placeholder="Pilih jadwal" />
                      </SelectTrigger>
                      <SelectContent>
                      {paketWisata.jadwal.map((jadwal) => (
                          <SelectItem
                            key={`${jadwal.tanggalAwal}-${jadwal.tanggalAkhir}`}
                            value={`${jadwal.tanggalAwal}-${jadwal.tanggalAkhir}`}
                            disabled={jadwal.status === "tidak tersedia"}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>
                                {formatDate(jadwal.tanggalAwal)} - {formatDate(jadwal.tanggalAkhir)}
                              </span>
                              <span className="ml-2">
                                {jadwal.status === "tersedia" ? (
                                  <span className="text-green-500">Tersedia</span>
                                ) : (
                                  <span className="text-red-500">Penuh</span>
                                )}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jumlah">Jumlah Peserta</Label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setJumlahPeserta(Math.max(1, jumlahPeserta - 1))}
                        disabled={jumlahPeserta <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="jumlah"
                        type="number"
                        min="1"
                        max={paketWisata.armada.kapasitas}
                        value={jumlahPeserta}
                        onChange={(e) => setJumlahPeserta(Number.parseInt(e.target.value) || 1)}
                        className="mx-2 text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setJumlahPeserta(Math.min(paketWisata.armada.kapasitas, jumlahPeserta + 1))}
                        disabled={jumlahPeserta >= paketWisata.armada.kapasitas}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Maksimal {paketWisata.armada.kapasitas} peserta per grup
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Metode Pembayaran</Label>
                    <RadioGroup defaultValue="full">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full">Bayar Penuh</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dp" id="dp" />
                        <Label htmlFor="dp">DP 50%</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Pajak & Biaya Layanan</span>
                    <span>Termasuk</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!selectedSchedule || jumlahPeserta < 1 || paketWisata.status !== "available"}
                  >
                    Pesan Sekarang
                  </Button>
                  <Button variant="outline" className="w-full">
                    Tanya via WhatsApp
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>Pembayaran aman dan terenkripsi. Pembatalan gratis hingga 7 hari sebelum keberangkatan.</div>
                </div>
              </CardFooter>
            </Card>

            {paketWisata.status !== "available" && (
              <Alert variant="destructive">
                <AlertTitle>Paket Tidak Tersedia</AlertTitle>
                <AlertDescription>
                  Paket wisata ini saat ini tidak tersedia untuk pemesanan. Silakan pilih paket wisata lain atau hubungi
                  customer service kami untuk informasi lebih lanjut.
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Informasi Paket</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Durasi</div>
                      <div className="text-sm text-muted-foreground">{paketWisata.durasi}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Hotel className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Akomodasi</div>
                      <div className="text-sm text-muted-foreground">{paketWisata.hotel.nama}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bus className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Transportasi</div>
                      <div className="text-sm text-muted-foreground">{paketWisata.armada.nama}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Paket Wisata Serupa</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <img
                        src="/placeholder.svg?height=60&width=60"
                        alt={`Paket Wisata Serupa ${i}`}
                        className="h-14 w-14 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium">
                          Paket Wisata {paketWisata.destination.nama} {i}D{i - 1}N
                        </div>
                        <div className="text-sm text-primary font-medium">{formatCurrency(2000000 + i * 500000)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}