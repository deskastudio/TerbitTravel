import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Hotel,
  Bus,
  Utensils,
  Users,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { TourPackageService } from "@/services/tour-package.service";
import { ITourPackage } from "@/types/tour-package.types";
import { getImageUrl } from "@/utils/image-helper";

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format tanggal
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

// Komponen untuk menampilkan status paket wisata
// ✅ SIMPLE: StatusBadge yang simple dan praktis
// Ganti StatusBadge di DetailPackage.tsx (line 54-80)

const StatusBadge = ({ status }: { status?: string }) => {
  // ✅ SIMPLE: Handle apa aja yang dateng dari backend
  const getStatusDisplay = (status: string | undefined) => {
    if (!status) return { label: "Tersedia", color: "bg-green-500" };
    
    const statusStr = String(status).toLowerCase();
    
    // ✅ Map semua kemungkinan ke tampilan yang masuk akal
    if (statusStr.includes('tersedia') || statusStr.includes('available')) {
      return { label: "Tersedia", color: "bg-green-500" };
    }
    if (statusStr.includes('booked') || statusStr.includes('dipesan')) {
      return { label: "Sudah Dipesan", color: "bg-orange-500" };
    }
    if (statusStr.includes('progress') || statusStr.includes('berlangsung')) {
      return { label: "Sedang Berlangsung", color: "bg-blue-500" };
    }
    if (statusStr.includes('completed') || statusStr.includes('selesai')) {
      return { label: "Selesai", color: "bg-gray-500" };
    }
    if (statusStr.includes('cancelled') || statusStr.includes('batal')) {
      return { label: "Dibatalkan", color: "bg-red-500" };
    }
    if (statusStr.includes('draft')) {
      return { label: "Draft", color: "bg-gray-400" };
    }
    if (statusStr.includes('pending') || statusStr.includes('tunggu')) {
      return { label: "Menunggu", color: "bg-yellow-500" };
    }
    if (statusStr.includes('active') || statusStr.includes('aktif')) {
      return { label: "Aktif", color: "bg-green-500" };
    }
    
    // ✅ Default: Apapun yang dateng, jadikan "Tersedia"
    return { label: "Tersedia", color: "bg-green-500" };
  };

  const config = getStatusDisplay(status);
  
  return <Badge className={config.color}>{config.label}</Badge>;
};
// Komponen untuk menampilkan rating hotel dengan bintang
const HotelStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

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
  );
};

export default function PaketWisataDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(true);
  // State untuk menu makanan/lauk
  const [menuMakanan, setMenuMakanan] = useState<string[]>([]);
  // State untuk paket sejenis (akan diambil dari API)
  const [similarPackages, setSimilarPackages] = useState<ITourPackage[]>([]);

  // Tambahkan useEffect untuk memeriksa apakah paket ini sudah difavoritkan
  useEffect(() => {
    if (id) {
      const savedFavorites = JSON.parse(
        localStorage.getItem("favoritePackages") || "[]"
      );
      setIsFavorite(savedFavorites.includes(id));
    }
  }, [id]);

  // Fungsi untuk menyalin ke clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Disalin ke clipboard!",
          description:
            "Link paket wisata telah disalin. Anda dapat membagikannya sekarang",
        });
      })
      .catch((err) => {
        console.error("Error copying to clipboard:", err);
        toast({
          variant: "destructive",
          title: "Gagal menyalin",
          description: "Tidak dapat menyalin link ke clipboard",
        });
      });
  }, [toast]);

  // Fungsi untuk toggle favorit
  const toggleFavorite = useCallback(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favoritePackages") || "[]"
    );

    if (isFavorite) {
      // Hapus dari favorit
      const updatedFavorites = savedFavorites.filter(
        (favId: string) => favId !== id
      );
      localStorage.setItem(
        "favoritePackages",
        JSON.stringify(updatedFavorites)
      );
      toast({
        title: "Dihapus dari favorit",
        description: "Paket wisata telah dihapus dari daftar favorit Anda",
      });
    } else {
      // Tambahkan ke favorit
      if (!savedFavorites.includes(id)) {
        savedFavorites.push(id);
        localStorage.setItem(
          "favoritePackages",
          JSON.stringify(savedFavorites)
        );
      }
      toast({
        title: "Ditambahkan ke favorit",
        description: "Paket wisata telah ditambahkan ke daftar favorit Anda",
      });
    }

    setIsFavorite(!isFavorite);
  }, [id, isFavorite, toast]);

  // Fungsi untuk sharing paket wisata
  const handleShare = useCallback(async () => {
    if (!paketWisata) return;

    const url = window.location.href;
    const title = `Paket Wisata ${paketWisata.nama}`;
    const text = `Lihat paket wisata ${paketWisata.nama} ke ${
      paketWisata.destination.nama
    } dengan harga mulai dari ${formatCurrency(paketWisata.harga)} per orang!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        toast({
          title: "Berhasil dibagikan!",
          description: "Paket wisata telah dibagikan",
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
  }, [paketWisata, toast, copyToClipboard]);

  // Ambil data paket wisata berdasarkan ID dan paket sejenis
  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          throw new Error("ID paket wisata tidak ditemukan");
        }

        // Mengambil data paket wisata
        const data = await TourPackageService.getPackageById(id);
        console.log("Data paket wisata dari API:", data);

        // Pastikan objek hotel memiliki array fasilitas, jika kosong gunakan array kosong
        if (data.hotel && !data.hotel.fasilitas) {
          data.hotel.fasilitas = [];
        }

        // Mengambil foto dari destinasi jika tersedia
        // Use getImageUrl to ensure proper formatting of image URLs
        const packageImages: string[] =
          data.destination &&
          data.destination.foto &&
          data.destination.foto.length > 0
            ? data.destination.foto.map((foto) =>
                foto.startsWith("http") ? foto : getImageUrl(foto)
              )
            : [];

        // Set menu makanan dari field lauk di model consume
        const lauk: string[] = data.consume?.lauk || [];

        setGalleryImages(packageImages);
        setMenuMakanan(lauk);
        setPaketWisata(data);

        // Setelah mengambil detail paket, ambil paket sejenis berdasarkan kategori
        if (data.kategori && data.kategori._id) {
          try {
            const similarPackagesData =
              await TourPackageService.getPackagesByCategory(
                data.kategori._id,
                3,
                id
              );
            console.log("Data paket sejenis dari API:", similarPackagesData);
            setSimilarPackages(similarPackagesData || []);
          } catch (err: unknown) {
            const errorMessage =
              err instanceof Error ? err.message : "Unknown error";
            console.error("Error fetching similar packages:", errorMessage);
            // Tidak perlu menampilkan error, karena ini fitur tambahan
          }
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching package detail:", errorMessage);
        setError("Gagal mengambil data paket wisata");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageDetail();
  }, [id]);

  // Fungsi navigasi galeri
  const nextImage = useCallback(() => {
    setIsImageLoading(true);
    setCurrentImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    setIsImageLoading(true);
    setCurrentImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  }, [galleryImages.length]);

  // Fungsi untuk navigasi ke halaman booking
  const handleBooking = useCallback(() => {
    if (!selectedSchedule || !id) return;
    navigate(`/booking/${id}/${selectedSchedule}`);
  }, [id, navigate, selectedSchedule]);

  // (Removed unused getSelectedSchedule function)

  // Handle image load complete
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Jika masih loading, tampilkan skeleton
  if (isLoading) {
    return <DetailSkeleton />;
  }

  // Jika terjadi error, tampilkan pesan error
  if (error || !paketWisata) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Paket wisata tidak ditemukan"}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/paket-wisata")}
        >
          Kembali ke Daftar Paket Wisata
        </Button>
      </div>
    );
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
        </div>
      </div>

      {/* Galeri Foto */}
      <div className="relative mb-8 overflow-hidden rounded-xl">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            </div>
          )}
          <img
            src={
              galleryImages[currentImageIndex] &&
              galleryImages[currentImageIndex].startsWith("http")
                ? galleryImages[currentImageIndex]
                : getImageUrl(galleryImages[currentImageIndex])
            }
            alt={`${paketWisata.nama} - Foto ${currentImageIndex + 1}`}
            className="h-full w-full object-cover"
            onLoad={handleImageLoad}
            onError={() => {
              // Just set loading to false when image errors
              setIsImageLoading(false);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Navigasi Galeri */}
        {galleryImages.length > 1 && (
          <>
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
                  aria-label={`Lihat foto ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Tombol Aksi */}
        <div className="absolute right-4 top-4 flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 hover:bg-white"
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
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
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="mb-6 grid w-full grid-cols-3 bg-muted/60 p-1 rounded-xl">
              <TabsTrigger
                value="overview"
                className="flex gap-2 items-center rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Info className="h-4 w-4" />
                <span>Ikhtisar</span>
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="flex gap-2 items-center rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <AlertCircle className="h-4 w-4" />
                <span>Info Penting</span>
              </TabsTrigger>
              <TabsTrigger
                value="facilities"
                className="flex gap-2 items-center rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Fasilitas</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Info className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">
                      Tentang Paket Wisata
                    </h2>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-4 text-muted-foreground whitespace-pre-line">
                    {paketWisata.deskripsi}
                  </div>
                </div>

                <Separator />

                {/* Informasi Akomodasi dan Transportasi */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:w-full">
                    <div className="bg-muted/30 p-4 rounded-lg h-full border border-muted/50 hover:shadow-sm transition-shadow">
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Hotel className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">
                            {paketWisata.hotel.nama}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mb-2 pl-7">
                          <HotelStars rating={paketWisata.hotel.bintang} />
                          <span className="text-sm text-muted-foreground">
                            Hotel {paketWisata.hotel.bintang} Bintang
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2 pl-7">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{paketWisata.hotel.alamat}</span>
                        </div>
                      </div>

                      <div className="bg-primary/5 rounded-md p-3 mt-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Fasilitas Hotel:
                        </h4>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {paketWisata.hotel.fasilitas &&
                          paketWisata.hotel.fasilitas.length > 0 ? (
                            paketWisata.hotel.fasilitas.map(
                              (facility, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm pl-6"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                  <span>{facility}</span>
                                </div>
                              )
                            )
                          ) : (
                            <div className="col-span-2 text-sm text-muted-foreground pl-6">
                              Informasi fasilitas tidak tersedia
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-full">
                    <div className="bg-muted/30 p-4 rounded-lg h-full border border-muted/50 hover:shadow-sm transition-shadow">
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Bus className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">
                            {paketWisata.armada.nama}
                          </h3>
                        </div>
                        <div className="mb-2 flex flex-wrap gap-2 pl-7">
                          <Badge variant="outline" className="bg-primary/5">
                            {paketWisata.armada.merek}
                          </Badge>
                        </div>
                      </div>

                      <div className="bg-primary/5 rounded-md p-3 mt-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          Kapasitas Armada:
                        </h4>
                        <div className="flex items-center gap-2 text-sm mb-2 pl-6">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span>
                            Maksimal{" "}
                            {paketWisata.armada.kapasitas?.[0] ||
                              paketWisata.armada.kapasitas}{" "}
                            orang
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {menuMakanan.length > 0 && (
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Utensils className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">Menu Makanan</h2>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border border-muted/50 hover:shadow-sm transition-shadow">
                        <p className="text-muted-foreground mb-4">
                          Berikut adalah menu makanan yang disediakan dalam
                          paket {paketWisata.consume.nama}:
                        </p>

                        <div className="bg-primary/5 rounded-md p-3">
                          <h3 className="font-medium mb-3 flex items-center gap-2">
                            <Tag className="h-4 w-4 text-primary" />
                            Daftar Menu:
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                            {menuMakanan.map((menu, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 pl-2"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                                <span className="text-sm">{menu}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-primary" />
                            Menu dapat berubah sesuai dengan ketersediaan bahan
                            makanan di lokasi
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <AlertCircle className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">
                      Syarat & Ketentuan
                    </h2>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-4">
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>
                        <span>
                          Harga dapat berubah sewaktu-waktu tanpa pemberitahuan
                          sebelumnya
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>
                        <span>
                          Minimal peserta {paketWisata.minimalPeserta || 2}{" "}
                          orang
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>
                        <span>Pembayaran DP 50% untuk konfirmasi booking</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>
                        <span>
                          Pembatalan 7 hari sebelum keberangkatan dikenakan
                          biaya 50%
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>
                        <span>
                          Pembatalan 3 hari sebelum keberangkatan dikenakan
                          biaya 100%
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>
                        <span>
                          Itinerary dapat berubah menyesuaikan kondisi lapangan
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">
                    Informasi Tambahan
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Paket wisata ini mencakup perjalanan selama{" "}
                      {paketWisata.durasi} ke {paketWisata.destination.nama},
                      {paketWisata.destination.lokasi}.
                    </p>
                    <p>
                      Anda akan menginap di {paketWisata.hotel.nama}, hotel
                      berbintang {paketWisata.hotel.bintang}
                      yang berlokasi di {paketWisata.hotel.alamat}.
                    </p>
                    <p>
                      Transportasi menggunakan {paketWisata.armada.nama} dengan
                      kapasitas maksimal
                      {paketWisata.armada.kapasitas?.[0] ||
                        paketWisata.armada.kapasitas}{" "}
                      orang.
                    </p>
                    {paketWisata.deskripsiTambahan && (
                      <p>{paketWisata.deskripsiTambahan}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Info className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">
                      Jadwal Keberangkatan
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {paketWisata.jadwal.length > 0 ? (
                      paketWisata.jadwal.map((jadwal, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-4 border border-muted/60 rounded-md bg-muted/10 hover:shadow-sm transition-shadow"
                        >
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              {formatDate(jadwal.tanggalAwal)} -{" "}
                              {formatDate(jadwal.tanggalAkhir)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 pl-6">
                              {jadwal.keterangan || paketWisata.durasi}
                            </div>
                          </div>
                          <Badge
                            className={`${
                              jadwal.status === "tersedia"
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-red-500 hover:bg-red-600"
                            } text-white`}
                          >
                            {jadwal.status === "tersedia"
                              ? "Tersedia"
                              : "Penuh"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-6 border border-dashed border-muted rounded-lg">
                        <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <div className="text-muted-foreground">
                          Tidak ada jadwal keberangkatan yang tersedia saat ini.
                          Silakan hubungi customer service kami untuk informasi
                          lebih lanjut.
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => {
                            const phone = "628123456789";
                            const text = `Halo, saya ingin informasi jadwal keberangkatan paket wisata ${paketWisata.nama}.`;
                            window.open(
                              `https://wa.me/${phone}?text=${encodeURIComponent(
                                text
                              )}`,
                              "_blank"
                            );
                          }}
                        >
                          Hubungi Kami
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="facilities">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">Fasilitas</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="bg-green-50/50 rounded-lg p-4 border border-green-100">
                      <h3 className="mb-3 font-medium flex items-center gap-2 text-green-800">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span>Yang Termasuk</span>
                      </h3>
                      <ul className="space-y-3">
                        {paketWisata.include.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                            </div>
                            <span className="text-sm text-green-900">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50/50 rounded-lg p-4 border border-red-100">
                      <h3 className="mb-3 font-medium flex items-center gap-2 text-red-800">
                        <Minus className="h-5 w-5 text-red-600" />
                        <span>Yang Tidak Termasuk</span>
                      </h3>
                      <ul className="space-y-3">
                        {paketWisata.exclude.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Minus className="h-3.5 w-3.5 text-red-600" />
                            </div>
                            <span className="text-sm text-red-900">{item}</span>
                          </li>
                        ))}
                      </ul>
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
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(paketWisata.harga)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per orang
                    </div>
                  </div>
                  <StatusBadge status={paketWisata.status} />
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="tanggal"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4 text-primary" />
                      Pilih Jadwal Keberangkatan
                    </Label>
                    <Select
                      value={selectedSchedule}
                      onValueChange={setSelectedSchedule}
                    >
                      <SelectTrigger id="tanggal" className="bg-white">
                        <SelectValue placeholder="Pilih jadwal perjalanan" />
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
                                {formatDate(jadwal.tanggalAwal)} -{" "}
                                {formatDate(jadwal.tanggalAkhir)}
                              </span>
                              <span className="ml-2">
                                {jadwal.status === "tersedia" ? (
                                  <span className="text-green-500">
                                    Tersedia
                                  </span>
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
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={
                      !selectedSchedule || paketWisata.status !== "available"
                    }
                    onClick={handleBooking}
                  >
                    Lanjut ke Pemesanan
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // Buka WhatsApp
                      const phone = "628123456789";
                      const text = `Halo, saya ingin bertanya tentang paket wisata *${
                        paketWisata.nama
                      }* ke ${
                        paketWisata.destination.nama
                      } dengan harga ${formatCurrency(paketWisata.harga)}.`;
                      window.open(
                        `https://wa.me/${phone}?text=${encodeURIComponent(
                          text
                        )}`,
                        "_blank"
                      );
                    }}
                  >
                    Tanya via WhatsApp
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    Pembayaran aman dan terenkripsi. Pembatalan gratis hingga 7
                    hari sebelum keberangkatan.
                  </div>
                </div>
              </CardFooter>
            </Card>

            {paketWisata.status !== "available" && (
              <Alert variant="destructive">
                <AlertTitle>Paket Tidak Tersedia</AlertTitle>
                <AlertDescription>
                  Paket wisata ini saat ini tidak tersedia untuk pemesanan.
                  Silakan pilih paket wisata lain atau hubungi customer service
                  kami untuk informasi lebih lanjut.
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
                      <div className="text-sm text-muted-foreground">
                        {paketWisata.durasi}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Hotel className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Akomodasi</div>
                      <div className="text-sm text-muted-foreground">
                        {paketWisata.hotel.nama}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bus className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Transportasi</div>
                      <div className="text-sm text-muted-foreground">
                        {paketWisata.armada.nama}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Kapasitas</div>
                      <div className="text-sm text-muted-foreground">
                        Maksimal{" "}
                        {paketWisata.armada.kapasitas?.[0] ||
                          paketWisata.armada.kapasitas}{" "}
                        orang
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {similarPackages.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Paket Wisata Serupa
                  </h3>
                  <div className="space-y-4" id="similar-packages">
                    {similarPackages.map((pkg) => (
                      <div
                        key={pkg._id}
                        className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                        onClick={() => navigate(`/paket-wisata/${pkg._id}`)}
                      >
                        <img
                          src={
                            pkg.destination &&
                            pkg.destination.foto &&
                            pkg.destination.foto.length > 0
                              ? getImageUrl(pkg.destination.foto[0])
                              : "https://placehold.co/400x400?text=No+Image"
                          }
                          alt={pkg.nama}
                          className="h-14 w-14 rounded-md object-cover"
                          onError={() => {
                            // No fallback image needed
                          }}
                        />
                        <div>
                          <div className="font-medium line-clamp-2">
                            {pkg.nama}
                          </div>
                          <div className="text-sm text-primary font-medium">
                            {formatCurrency(pkg.harga)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
