"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Info,
  Camera,
  Map,
  Users,
  Sun,
  ParkingCircle,
  Coffee,
  Bed,
  Bus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useDestination } from "@/hooks/use-destination";
import { IDestination } from "@/types/destination.types";
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

// Data default untuk melengkapi data dari API
const defaultData = {
  deskripsiLengkap: `Objek wisata ini merupakan salah satu destinasi populer di Indonesia dengan pemandangan alam yang memukau. Pengunjung dapat menikmati keindahan alam, udara segar, dan berbagai aktivitas menarik di sekitar lokasi.

  Dikelilingi oleh pegunungan dan hutan yang asri, tempat ini menawarkan pengalaman yang berbeda dari kehidupan perkotaan yang sibuk. Cocok untuk liburan keluarga, bulan madu, atau perjalanan solo.
  
  Berbagai aktivitas seperti hiking, berenang, berkemah, fotografi, dan menikmati budaya lokal dapat dilakukan di sini. Jangan lupa untuk mencoba kuliner khas daerah yang lezat selama kunjungan Anda.`,

  alamatLengkap:
    "Alamat lengkap akan ditampilkan berdasarkan data lokasi dari API",

  jamOperasional:
    "Buka 24 jam (beberapa atraksi memiliki jam operasional tersendiri)",

  hargaTiket: "Gratis (beberapa atraksi mungkin memerlukan tiket masuk)",

  fasilitas: [
    "Area Parkir",
    "Toilet Umum",
    "Penginapan",
    "Restoran",
    "Toko Suvenir",
    "Spot Foto",
    "Tempat Ibadah",
    "Pemandu Wisata",
  ],

  tips: [
    "Kunjungi pada pagi hari untuk menghindari keramaian",
    "Bawa pakaian hangat karena suhu bisa berubah-ubah",
    "Persiapkan kamera dengan baterai penuh untuk mengabadikan momen",
    "Bawa air minum yang cukup selama perjalanan",
    "Gunakan alas kaki yang nyaman untuk berjalan-jalan",
  ],

  ulasan: [
    {
      id: "u1",
      nama: "Budi Santoso",
      foto: "/placeholder.svg?height=40&width=40",
      rating: 5,
      tanggal: "15 Maret 2023",
      komentar:
        "Pemandangan yang luar biasa! Salah satu keajaiban alam Indonesia yang wajib dikunjungi.",
    },
    {
      id: "u2",
      nama: "Siti Rahma",
      foto: "/placeholder.svg?height=40&width=40",
      rating: 4,
      tanggal: "22 April 2023",
      komentar:
        "Pengalaman yang menyenangkan. Sayang beberapa area masih kurang terawat.",
    },
    {
      id: "u3",
      nama: "Agus Wijaya",
      foto: "/placeholder.svg?height=40&width=40",
      rating: 5,
      tanggal: "10 Juni 2023",
      komentar:
        "Tempat yang sempurna untuk liburan keluarga. Penduduk lokalnya juga sangat ramah dan membantu.",
    },
  ],

  ratingStats: {
    total: 256,
    average: 4.7,
    distribution: [5, 10, 15, 86, 140],
  },

  galeri: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ],

  aktivitas: [
    "Menikmati Pemandangan Alam",
    "Berfoto di Spot Instagramable",
    "Mencoba Kuliner Lokal",
    "Berinteraksi dengan Penduduk Setempat",
    "Mengikuti Tur Budaya",
  ],

  waktuTerbaik: {
    musim: "Musim Kemarau (Mei-September)",
    jam: "Pagi (06.00-10.00) atau Sore (15.00-18.00)",
  },

  transportasi: [
    "Kendaraan Pribadi",
    "Bus Umum",
    "Ojek Online",
    "Rental Kendaraan",
  ],

  akomodasi: ["Hotel", "Homestay", "Villa", "Penginapan"],

  faq: [
    {
      pertanyaan: "Berapa harga tiket masuk?",
      jawaban:
        "Tiket masuk bervariasi tergantung musim dan hari. Harga tiket dewasa sekitar Rp20.000-Rp50.000, sementara anak-anak di bawah 5 tahun gratis.",
    },
    {
      pertanyaan: "Apakah tempat ini cocok untuk anak-anak?",
      jawaban:
        "Ya, tempat ini cocok untuk semua usia. Terdapat area bermain untuk anak-anak dan jalur yang mudah diakses.",
    },
    {
      pertanyaan: "Apakah tersedia pemandu wisata?",
      jawaban:
        "Ya, tersedia jasa pemandu wisata lokal yang dapat memberi informasi lebih detail tentang sejarah dan keunikan tempat ini.",
    },
  ],
};

// Interface untuk destinasi dengan data UI
interface EnhancedDestination extends IDestination {
  deskripsiLengkap?: string;
  alamatLengkap?: string;
  jamOperasional?: string;
  hargaTiket?: string;
  fasilitas?: string[];
  tips?: string[];
  ulasan?: {
    id: string;
    nama: string;
    foto: string;
    rating: number;
    tanggal: string;
    komentar: string;
  }[];
  ratingStats?: {
    total: number;
    average: number;
    distribution: number[];
  };
  galeri?: string[];
  aktivitas?: string[];
  waktuTerbaik?: {
    musim: string;
    jam: string;
  };
  transportasi?: string[];
  akomodasi?: string[];
  faq?: {
    pertanyaan: string;
    jawaban: string;
  }[];
}

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useDestinationDetail } = useDestination();
  const { destination, isLoading, error } = useDestinationDetail(id || "");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [enhancedDestination, setEnhancedDestination] =
    useState<EnhancedDestination | null>(null);

  console.log("Detail page loaded with ID:", id);

  // Gabungkan data API dengan data default UI
  useEffect(() => {
    if (destination) {
      console.log("Destination data received:", destination);
      // Mengubah destination dari API menjadi format yang dibutuhkan UI
      setEnhancedDestination({
        ...destination,
        ...defaultData,
        // Override deskripsiLengkap dengan data dari API jika ada deskripsi
        deskripsiLengkap: destination.deskripsi || defaultData.deskripsiLengkap,
        // Gunakan alamat lokasi dari API sebagai alamat lengkap
        alamatLengkap: destination.lokasi || defaultData.alamatLengkap,
        // Konversi array foto API ke format galeri yang dibutuhkan UI
        galeri:
          destination.foto && destination.foto.length > 0
            ? destination.foto
            : defaultData.galeri,
      });
    }
  }, [destination]);

  // Fungsi navigasi galeri
  const nextImage = () => {
    if (enhancedDestination?.galeri) {
      setCurrentImageIndex((prev) =>
        prev === enhancedDestination.galeri!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (enhancedDestination?.galeri) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? enhancedDestination.galeri!.length - 1 : prev - 1
      );
    }
  };

  // Jika masih loading, tampilkan skeleton
  if (isLoading || !enhancedDestination) {
    return <DetailSkeleton />;
  }

  // Jika terjadi error, tampilkan pesan error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "Tidak dapat memuat data destinasi"}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/destination")}
        >
          Kembali ke Daftar Destinasi
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
          onClick={() => navigate("/destination")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Destinasi</span>
        </Button>
        <h1 className="mt-4 text-3xl font-bold">{enhancedDestination.nama}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{enhancedDestination.lokasi}</span>
          </div>
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span>
              {enhancedDestination.ratingStats?.average} (
              {enhancedDestination.ratingStats?.total} ulasan)
            </span>
          </div>
          {enhancedDestination.category && (
            <div className="flex items-center">
              <Badge variant="secondary">
                {typeof enhancedDestination.category === "string"
                  ? enhancedDestination.category
                  : enhancedDestination.category.title}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Galeri Foto */}
      <div className="relative mb-8 overflow-hidden rounded-xl">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={
              enhancedDestination.foto && enhancedDestination.foto.length > 0
                ? getImageUrl(enhancedDestination.foto[currentImageIndex])
                : enhancedDestination.galeri?.[currentImageIndex] ||
                  "/placeholder.svg"
            }
            alt={`${enhancedDestination.nama} - Foto ${currentImageIndex + 1}`}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/1200x675?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Navigasi Galeri - hanya tampilkan jika ada lebih dari 1 foto */}
        {(enhancedDestination.galeri?.length || 0) > 1 && (
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
              {enhancedDestination.galeri?.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  } transition-all`}
                  onClick={() => setCurrentImageIndex(index)}
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
            onClick={() => setIsFavorite(!isFavorite)}
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
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
              <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
              <TabsTrigger value="reviews">Ulasan</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-3 text-xl font-semibold">
                    Tentang {enhancedDestination.nama}
                  </h2>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {enhancedDestination.deskripsiLengkap}
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">
                    Aktivitas Populer
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {enhancedDestination.aktivitas?.map((aktivitas, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>{aktivitas}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">
                    Tips Berkunjung
                  </h2>
                  <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                    {enhancedDestination.tips?.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">
                    Pertanyaan Umum
                  </h2>
                  <div className="space-y-4">
                    {enhancedDestination.faq?.map((item, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">{item.pertanyaan}</h3>
                        <p className="text-muted-foreground">{item.jawaban}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="facilities">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold">
                    Fasilitas yang Tersedia
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {enhancedDestination.fasilitas?.map((fasilitas, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-lg">✓</span>
                        </div>
                        <span>{fasilitas}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">Transportasi</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {enhancedDestination.transportasi?.map(
                      (transport, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Bus className="h-5 w-5 text-primary" />
                          <span>{transport}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">
                    Akomodasi di Sekitar
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {enhancedDestination.akomodasi?.map((akomodasi, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Bed className="h-5 w-5 text-primary" />
                        <span>{akomodasi}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">
                    Informasi Tambahan
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Alamat</div>
                      <div className="text-muted-foreground">
                        {enhancedDestination.alamatLengkap}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Jam Operasional</div>
                      <div className="text-muted-foreground">
                        {enhancedDestination.jamOperasional}
                      </div>
                    </div>
                    {/* Harga tiket dihapus karena informasi harga hanya relevan untuk paket wisata */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Kategori</div>
                      <div className="text-muted-foreground">
                        {enhancedDestination.category
                          ? typeof enhancedDestination.category === "string"
                            ? enhancedDestination.category
                            : enhancedDestination.category.title
                          : "Umum"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Rating Summary */}
                  <div className="md:w-1/3">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="mb-2 text-center text-4xl font-bold">
                        {enhancedDestination.ratingStats?.average}
                      </div>
                      <div className="mb-4 flex justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i <
                              Math.floor(
                                enhancedDestination.ratingStats?.average || 0
                              )
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        Berdasarkan {enhancedDestination.ratingStats?.total}{" "}
                        ulasan
                      </div>

                      <div className="mt-4 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <div className="w-8 text-sm">{rating} ★</div>
                            <Progress
                              value={
                                ((enhancedDestination.ratingStats
                                  ?.distribution?.[5 - rating] || 0) /
                                  (enhancedDestination.ratingStats?.total ||
                                    1)) *
                                100
                              }
                              className="h-2"
                            />
                            <div className="w-8 text-right text-sm text-muted-foreground">
                              {enhancedDestination.ratingStats?.distribution?.[
                                5 - rating
                              ] || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="md:w-2/3">
                    <h2 className="mb-4 text-xl font-semibold">
                      Ulasan Pengunjung
                    </h2>
                    <div className="space-y-4">
                      {enhancedDestination.ulasan?.map((ulasan) => (
                        <Card key={ulasan.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={ulasan.foto || "/placeholder.svg"}
                                    alt={ulasan.nama}
                                  />
                                  <AvatarFallback>
                                    {ulasan.nama.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {ulasan.nama}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {ulasan.tanggal}
                                  </div>
                                </div>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < ulasan.rating
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="mt-3 text-muted-foreground">
                              {ulasan.komentar}
                            </div>
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

        {/* Sidebar */}
        <div>
          <div className="sticky top-8 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Informasi Destinasi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Lokasi</div>
                      <div className="text-sm text-muted-foreground">
                        {enhancedDestination.lokasi}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Jam Operasional</div>
                      <div className="text-sm text-muted-foreground">
                        {enhancedDestination.jamOperasional}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Sun className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Waktu Terbaik untuk Berkunjung
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {enhancedDestination.waktuTerbaik?.musim}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Kategori</div>
                    <div className="mt-2">
                      <Badge variant="secondary">
                        {enhancedDestination.category
                          ? typeof enhancedDestination.category === "string"
                            ? enhancedDestination.category
                            : enhancedDestination.category.title
                          : "Umum"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Cocok Untuk</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">Keluarga</Badge>
                      <Badge variant="secondary">Pasangan</Badge>
                      <Badge variant="secondary">Solo Traveler</Badge>
                      <Badge variant="secondary">Fotografer</Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="w-full">Lihat Paket Wisata</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Fasilitas Utama</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <ParkingCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">Area Parkir</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <span className="text-sm">Penginapan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-primary" />
                    <span className="text-sm">Restoran</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    <span className="text-sm">Spot Foto</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Destinasi Terdekat
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <img
                        src="/placeholder.svg?height=60&width=60"
                        alt={`Destinasi Terdekat ${i}`}
                        className="h-14 w-14 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium">
                          Destinasi Terdekat {i}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          15 km dari sini
                        </div>
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
  );
}
