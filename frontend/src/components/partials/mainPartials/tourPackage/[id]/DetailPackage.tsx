"use client"

import { useState, useEffect, useCallback } from "react"
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
  Users,
  AlertCircle
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
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast" // Tambahkan import useToast
import { TourPackageService } from "@/services/tour-package.service"
import { ITourPackage, Schedule, TourPackageStatus } from "@/types/tour-package.types"

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
};

export default function PaketWisataDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast() // Gunakan hook useToast
  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState("")
  const [jumlahPeserta, setJumlahPeserta] = useState(2)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [isImageLoading, setIsImageLoading] = useState(true)
  // State untuk gambar dan fasilitas hotel yang diambil dari database
  const [hotelImages, setHotelImages] = useState<string[]>([])
  const [hotelFacilities, setHotelFacilities] = useState<string[]>([])
  // State untuk gambar armada dan kapasitas
  const [armadaImages, setArmadaImages] = useState<string[]>([])
  const [armadaKapasitas, setArmadaKapasitas] = useState<string[]>([])
  // State untuk menu makanan/lauk
  const [menuMakanan, setMenuMakanan] = useState<string[]>([])

  // Tambahkan useEffect untuk memeriksa apakah paket ini sudah difavoritkan
  useEffect(() => {
    if (id) {
      const savedFavorites = JSON.parse(localStorage.getItem('favoritePackages') || '[]');
      setIsFavorite(savedFavorites.includes(id));
    }
  }, [id]);

  // Fungsi untuk toggle favorit
  const toggleFavorite = useCallback(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favoritePackages') || '[]');
    
    if (isFavorite) {
      // Hapus dari favorit
      const updatedFavorites = savedFavorites.filter((favId: string) => favId !== id);
      localStorage.setItem('favoritePackages', JSON.stringify(updatedFavorites));
      toast({
        title: "Dihapus dari favorit",
        description: "Paket wisata telah dihapus dari daftar favorit Anda"
      });
    } else {
      // Tambahkan ke favorit
      if (!savedFavorites.includes(id)) {
        savedFavorites.push(id);
        localStorage.setItem('favoritePackages', JSON.stringify(savedFavorites));
      }
      toast({
        title: "Ditambahkan ke favorit",
        description: "Paket wisata telah ditambahkan ke daftar favorit Anda"
      });
    }
    
    setIsFavorite(!isFavorite);
  }, [id, isFavorite, toast]);

  // Fungsi untuk sharing paket wisata
  const handleShare = useCallback(async () => {
    if (!paketWisata) return;
    
    const url = window.location.href;
    const title = `Paket Wisata ${paketWisata.nama}`;
    const text = `Lihat paket wisata ${paketWisata.nama} ke ${paketWisata.destination.nama} dengan harga mulai dari ${formatCurrency(paketWisata.harga)} per orang!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
        toast({
          title: "Berhasil dibagikan!",
          description: "Paket wisata telah dibagikan"
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback to clipboard
        copyToClipboard(url);
      }
    } else {
      // Fallback to clipboard
      copyToClipboard(url);
    }
  }, [paketWisata, toast]);

  // Fungsi untuk menyalin ke clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Disalin ke clipboard!",
          description: "Link paket wisata telah disalin. Anda dapat membagikannya sekarang"
        });
      })
      .catch(err => {
        console.error("Error copying to clipboard:", err);
        toast({
          variant: "destructive",
          title: "Gagal menyalin",
          description: "Tidak dapat menyalin link ke clipboard"
        });
      });
  };

  // Ambil data paket wisata berdasarkan ID
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
      
      // Generate placeholder images jika foto tidak tersedia
      let packageImages = data.foto && data.foto.length > 0 
        ? data.foto 
        : [
            `https://source.unsplash.com/random/800x600/?travel,${data.destination.nama}`,
            `https://source.unsplash.com/random/800x600/?${data.destination.nama},landscape`,
            `https://source.unsplash.com/random/800x600/?${data.destination.nama},scenery`
          ];
      
      // Set gambar hotel dari database
      // Perhatikan bahwa dalam model hotel, field-nya adalah "gambar" bukan "foto"
      const hotelImgs = data.hotel?.gambar && data.hotel.gambar.length > 0
        ? data.hotel.gambar
        : [
            `https://source.unsplash.com/random/800x600/?hotel,room,${data.hotel.nama}`,
            `https://source.unsplash.com/random/800x600/?hotel,lobby,${data.hotel.nama}`,
            `https://source.unsplash.com/random/800x600/?hotel,pool,${data.hotel.nama}`
          ];
      
      // Set gambar armada dari database
      // Perhatikan bahwa dalam model armada, field-nya adalah "gambar" bukan "foto"
      const armadaImgs = data.armada?.gambar && data.armada.gambar.length > 0
        ? data.armada.gambar
        : [
            `https://source.unsplash.com/random/800x600/?bus,${data.armada.nama}`,
            `https://source.unsplash.com/random/800x600/?coach,${data.armada.nama}`,
            `https://source.unsplash.com/random/800x600/?transport,${data.armada.nama}`
          ];
      
      // Set langsung fasilitas hotel dari database
      const hotelFacs = data.hotel?.fasilitas || [];
      
      // Set langsung kapasitas armada dari database
      const armadaKaps = data.armada?.kapasitas || [];
      
      // Set menu makanan dari field lauk di model consume
      const lauk = data.consume?.lauk || [];
      
      setGalleryImages(packageImages);
      setHotelImages(hotelImgs);
      setArmadaImages(armadaImgs);
      setHotelFacilities(hotelFacs);
      setArmadaKapasitas(armadaKaps);
      setMenuMakanan(lauk);
      setPaketWisata(data);
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
  const nextImage = useCallback(() => {
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => (prev === (galleryImages.length - 1) ? 0 : prev + 1))
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }, [galleryImages.length]);

  // Hitung total harga
  const calculateTotal = useCallback(() => {
    if (!selectedSchedule || !paketWisata) return 0
    return paketWisata.harga * jumlahPeserta
  }, [jumlahPeserta, paketWisata, selectedSchedule]);

  // Mendapatkan jadwal yang dipilih
  const getSelectedSchedule = useCallback(() => {
    if (!selectedSchedule || !paketWisata) return null
    return paketWisata.jadwal.find((j) => `${j.tanggalAwal}-${j.tanggalAkhir}` === selectedSchedule)
  }, [paketWisata, selectedSchedule]);

  // Handle image load complete
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Jika masih loading, tampilkan skeleton
  if (isLoading) {
    return <DetailSkeleton />
  }

  // Jika terjadi error, tampilkan pesan error
  if (error || !paketWisata) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
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
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Skeleton className="h-full w-full" />
            </div>
          )}
          <img
            src={galleryImages[currentImageIndex]}
            alt={`${paketWisata.nama} - Foto ${currentImageIndex + 1}`}
            className="h-full w-full object-cover"
            onLoad={handleImageLoad}
            onError={(e) => {
              // Fallback image if error
              (e.target as HTMLImageElement).src = "/placeholder.svg?height=600&width=1200";
              setIsImageLoading(false);
            }}
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
          {galleryImages.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              } transition-all`}
              onClick={() => {
                setIsImageLoading(true);
                setCurrentImageIndex(index);
              }}
            />
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="absolute right-4 top-4 flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 hover:bg-white"
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/80 hover:bg-white"
            onClick={handleShare}
            aria-label="Bagikan paket wisata"
          >
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
                <div className="md:w-1/2">
                  <div className="bg-muted/30 p-4 rounded-lg h-full">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg">{paketWisata.hotel.nama}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <HotelStars rating={paketWisata.hotel.bintang} />
                        <span className="text-sm text-muted-foreground">Hotel {paketWisata.hotel.bintang} Bintang</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{paketWisata.hotel.alamat}</span>
                      </div>
                    </div>

                    <h4 className="font-medium mb-2">Fasilitas Hotel:</h4>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {hotelFacilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="bg-primary/10 p-1.5 rounded-full">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <span>{facility}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2">
                      <h4 className="font-medium mb-1">Harga Hotel:</h4>
                      <div className="text-sm text-muted-foreground">
                        <div>{formatCurrency(paketWisata.hotel.harga)} per malam</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-1/2">
                  <div className="bg-muted/30 p-4 rounded-lg h-full">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg">{paketWisata.armada.nama}</h3>
                      <div className="mb-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{paketWisata.armada.merek}</Badge>
                      </div>
                    </div>

                    <h4 className="font-medium mb-2">Kapasitas Armada:</h4>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {armadaKapasitas.map((kapasitas, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="bg-primary/10 p-1.5 rounded-full">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <span>{kapasitas}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2">
                      <h4 className="font-medium mb-1">Harga Armada:</h4>
                      <div className="text-sm text-muted-foreground">
                        <div>{formatCurrency(paketWisata.armada.harga)} per hari</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 text-xl font-semibold">Menu Makanan</h2>
                  <p className="text-muted-foreground mb-4">
                    Berikut adalah menu makanan yang disediakan dalam paket {paketWisata.consume.nama}:
                  </p>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Daftar Menu:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                      {menuMakanan.map((menu, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Utensils className="h-4 w-4 text-primary mt-0.5" />
                          <span className="text-sm">{menu}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>* Menu dapat berubah sesuai dengan ketersediaan bahan makanan di lokasi</p>
                    <p>* Harga paket konsumsi: {formatCurrency(paketWisata.consume.harga)} per orang per hari</p>
                  </div>
                </div>

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
                    onClick={() => navigate(`/booking/${id}/${selectedSchedule}`)}
                  >
                    Pesan Sekarang
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      // Buka WhatsApp
                      const phone = "628123456789";
                      const text = `Halo, saya ingin bertanya tentang paket wisata *${paketWisata.nama}* ke ${paketWisata.destination.nama} dengan harga ${formatCurrency(paketWisata.harga)}.`;
                      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                  >
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
                <div className="space-y-4" id="similar-packages">
                  {/* Placeholder - nanti akan diisi dengan paket-paket serupa */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors" 
                      onClick={() => navigate(`/paket-wisata/similar-${i}`)}>
                      <img
                        src={`https://source.unsplash.com/random/60x60/?${paketWisata.destination.nama},travel,${i}`}
                        alt={`Paket Wisata Serupa ${i}`}
                        className="h-14 w-14 rounded-md object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg?height=60&width=60";
                        }}
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