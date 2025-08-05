"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users, Filter, Heart } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast"; // Tambahkan import useToast
import ImageWithFallback from "@/components/ui/image-with-fallback";
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
import { TourPackageService } from "@/services/tour-package.service"; // Tambahkan import service
import { ITourPackage, IPackageCategory } from "@/types/tour-package.types"; // Tambahkan import tipe

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

// Types
type CategoryType = "semua" | string; // Diubah agar dinamis berdasarkan ID kategori

// Interface for travel package
interface IPaketWisata {
  _id: string;
  nama: string;
  destinasi: string[];
  deskripsi: string;
  harga: number;
  diskon?: number;
  durasi: string;
  maxPeserta: number;
  rating: number;
  foto: string[];
  fasilitas: string[];
  kategoriId: string; // ID kategori untuk filter
  createdAt?: string;
  updatedAt?: string;
  isFavorite?: boolean; // Tambahkan properti untuk favorit
}

// Fungsi untuk mengkonversi ITourPackage ke IPaketWisata dengan penanganan gambar yang lebih baik
const convertToUIFormat = (tourPackage: ITourPackage): IPaketWisata => {
  // Ambil nilai random untuk rating (sementara) - ini sebaiknya diganti dengan rata-rata rating asli
  const randomRating = 4 + Math.random();
  const rating = parseFloat(randomRating.toFixed(1));

  // Ambil nilai random untuk diskon (sementara) - ini sebaiknya diganti dengan diskon asli jika ada
  const diskon =
    Math.random() > 0.5 ? Math.floor(Math.random() * 20) : undefined;

  // Gambar paket diambil dari destinasi
  const photos =
    tourPackage.foto &&
    Array.isArray(tourPackage.foto) &&
    tourPackage.foto.length > 0
      ? tourPackage.foto
      : [];

  return {
    _id: tourPackage._id,
    nama: tourPackage.nama,
    destinasi: [tourPackage.destination.nama, tourPackage.destination.lokasi], // Tambahkan lokasi
    deskripsi: tourPackage.deskripsi,
    harga: tourPackage.harga,
    diskon: diskon, // Random diskon
    durasi: tourPackage.durasi,
    maxPeserta: parseInt(tourPackage.armada?.kapasitas?.[0]) || 15, // Gunakan elemen pertama dari array kapasitas
    rating: rating,
    foto: photos,
    fasilitas: [...tourPackage.include], // Gunakan include sebagai fasilitas
    kategoriId: tourPackage.kategori._id, // ID kategori
    createdAt: tourPackage.createdAt,
    updatedAt: tourPackage.updatedAt,
    isFavorite: tourPackage.isFavorite || false,
  };
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Travel Package Card Component
const PaketWisataCard = ({ paket }: { paket: IPaketWisata }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const discountedPrice = paket.diskon
    ? paket.harga - (paket.harga * paket.diskon) / 100
    : paket.harga;

  // State untuk favorit
  const [isFavorite, setIsFavorite] = useState(paket.isFavorite || false);

  const handleViewDetail = () => {
    navigate(`/paket-wisata/${paket._id}`);
  };

  // Toggle favorit
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah navigasi ke detail

    const savedFavorites = JSON.parse(
      localStorage.getItem("favoritePackages") || "[]"
    );

    if (savedFavorites.includes(paket._id)) {
      // Hapus dari favorit
      const updatedFavorites = savedFavorites.filter(
        (id: string) => id !== paket._id
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
      savedFavorites.push(paket._id);
      localStorage.setItem("favoritePackages", JSON.stringify(savedFavorites));

      toast({
        title: "Ditambahkan ke favorit",
        description: "Paket wisata telah ditambahkan ke daftar favorit Anda",
      });
    }

    // Update state isFavorite lokal
    setIsFavorite(!isFavorite);
  };

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={handleViewDetail}
    >
      <div className="relative">
        <div className="h-48 w-full">
          <ImageWithFallback
            src={paket.foto?.[0]}
            alt={paket.nama}
            className="h-full w-full object-cover"
            fallbackText="Travel Package"
            width={400}
            height={192}
          />
        </div>

        {paket.diskon && (
          <Badge className="absolute left-2 top-2 bg-green-500 hover:bg-green-600">
            {paket.diskon}% OFF
          </Badge>
        )}

        {/* Tombol favorit */}
        <button
          className="absolute right-2 top-2 bg-white/80 hover:bg-white p-1.5 rounded-full"
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-1">
            {paket.nama}
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
            {paket.rating}
          </div>
        </div>
        <CardDescription className="flex items-center mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span className="text-sm text-muted-foreground line-clamp-1">
            {paket.destinasi.join(", ")}
          </span>
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
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
          {paket.deskripsi}
        </p>
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
              <span className="text-sm line-through text-muted-foreground">
                {formatCurrency(paket.harga)}
              </span>
              <div className="text-lg font-bold text-primary">
                {formatCurrency(discountedPrice)}
              </div>
            </div>
          ) : (
            <div className="text-lg font-bold text-primary">
              {formatCurrency(paket.harga)}
            </div>
          )}
          <div className="text-xs text-muted-foreground">per orang</div>
        </div>
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
);

// Recommendation Component
const RecommendationSection = ({
  paketWisata,
}: {
  paketWisata: IPaketWisata[];
}) => {
  // Dapatkan paket dengan rating tertinggi untuk rekomendasi
  const recommendedPaket = [...paketWisata]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="mt-8 mb-12">
      <h2 className="text-2xl font-bold mb-4">Rekomendasi Untuk Anda</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedPaket.length > 0 ? (
          recommendedPaket.map((paket) => (
            <PaketWisataCard key={`rec-${paket._id}`} paket={paket} />
          ))
        ) : (
          <>
            <PaketWisataCardSkeleton />
            <PaketWisataCardSkeleton />
            <PaketWisataCardSkeleton />
          </>
        )}
      </div>
    </div>
  );
};

// Main Component
const PaketWisataPage: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Set isLoading awal ke true
  const [sortBy, setSortBy] = useState("recommended");
  const [durasiFilter, setDurasiFilter] = useState("");
  const [hargaFilter, setHargaFilter] = useState("");
  const [fasilitasFilter, setFasilitasFilter] = useState("");

  // State untuk menyimpan data kategori dari API
  const [categories, setCategories] = useState<IPackageCategory[]>([]);

  // State untuk menyimpan data paket wisata dari API
  const [paketWisata, setPaketWisata] = useState<IPaketWisata[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const itemsPerPage = 6;

  // Tambahkan useEffect untuk memperoleh data favorit dari localStorage
  useEffect(() => {
    // Ambil data paket favorit dari localStorage
    const checkFavorites = () => {
      const savedFavorites = JSON.parse(
        localStorage.getItem("favoritePackages") || "[]"
      );

      // Tandai paket yang sudah difavoritkan
      if (paketWisata.length > 0 && savedFavorites.length > 0) {
        const updatedPakets = paketWisata.map((paket) => ({
          ...paket,
          isFavorite: savedFavorites.includes(paket._id),
        }));
        setPaketWisata(updatedPakets);
      }
    };

    checkFavorites();
  }, [paketWisata.length]);

  // Fetch data kategori dan paket wisata dari API pada saat komponen dimount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        // Ambil kategori dan paket wisata secara parallel
        const [categoriesData, packagesData] = await Promise.all([
          TourPackageService.getAllCategories(),
          TourPackageService.getAllPackages(),
        ]);

        console.log("Data kategori dari API:", categoriesData);
        console.log("Data paket wisata dari API:", packagesData);

        // Set kategori
        if (categoriesData && Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          console.error(
            "Data kategori yang diterima bukan array:",
            categoriesData
          );
          toast({
            variant: "destructive",
            title: "Error",
            description: "Format data kategori tidak valid",
          });
        }

        // Set paket wisata
        if (packagesData && Array.isArray(packagesData)) {
          // Ambil data favorit dari localStorage
          const savedFavorites = JSON.parse(
            localStorage.getItem("favoritePackages") || "[]"
          );

          // Konversi data dari API ke format yang dibutuhkan UI dan tandai yang favorit
          const convertedData = packagesData.map((pkg) => {
            const converted = convertToUIFormat(pkg);
            // Cek apakah paket ini ada di favorit
            converted.isFavorite = savedFavorites.includes(converted._id);
            return converted;
          });

          console.log("Data paket wisata setelah konversi:", convertedData);

          setPaketWisata(convertedData);
        } else {
          console.error(
            "Data paket wisata yang diterima bukan array:",
            packagesData
          );
          setFetchError("Format data tidak valid");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Format data paket wisata tidak valid",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchError("Gagal mengambil data");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal mengambil data dari server",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter packages based on search, category, and other filters
  const filteredPaket = paketWisata.filter((paket) => {
    // Search filter
    const matchesSearch =
      debouncedSearchQuery === "" ||
      paket.nama.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      paket.destinasi.some((dest) =>
        dest.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      ) ||
      paket.deskripsi
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());

    // Category filter
    let matchesCategory = true;
    if (selectedCategory !== "semua") {
      matchesCategory = paket.kategoriId === selectedCategory;
    }

    // Durasi filter
    let matchesDurasi = true;
    if (durasiFilter === "1-2-days") {
      matchesDurasi =
        paket.durasi.includes("1 malam") || paket.durasi.includes("2 hari");
    } else if (durasiFilter === "3-4-days") {
      matchesDurasi =
        paket.durasi.includes("3 hari") || paket.durasi.includes("4 hari");
    } else if (durasiFilter === "5-plus-days") {
      matchesDurasi =
        paket.durasi.includes("5 hari") ||
        paket.durasi.includes("6 hari") ||
        paket.durasi.includes("7 hari");
    }

    // Harga filter
    let matchesHarga = true;
    if (hargaFilter === "under-2m") {
      matchesHarga = paket.harga < 2000000;
    } else if (hargaFilter === "2m-4m") {
      matchesHarga = paket.harga >= 2000000 && paket.harga <= 4000000;
    } else if (hargaFilter === "above-4m") {
      matchesHarga = paket.harga > 4000000;
    }

    // Fasilitas filter
    let matchesFasilitas = true;
    if (fasilitasFilter && fasilitasFilter !== "semua") {
      matchesFasilitas = paket.fasilitas.some(
        (f) => f.toLowerCase() === fasilitasFilter.toLowerCase()
      );
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDurasi &&
      matchesHarga &&
      matchesFasilitas
    );
  });

  // Sort packages
  const sortedPaket = [...filteredPaket].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.harga - b.harga;
    } else if (sortBy === "price-high") {
      return b.harga - a.harga;
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "duration-short") {
      return a.durasi.localeCompare(b.durasi);
    } else if (sortBy === "duration-long") {
      return b.durasi.localeCompare(a.durasi);
    }
    // Default: recommended (no specific sort)
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPaket.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPaket = sortedPaket.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Handle search change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  // Handle category change
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value as CategoryType);
    setCurrentPage(1);
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setDurasiFilter("");
    setHargaFilter("");
    setFasilitasFilter("");
  }, []);

  // Get all unique facilities for filter
  const allFasilitas = Array.from(
    new Set(paketWisata.flatMap((paket) => paket.fasilitas))
  );

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
    durasiFilter,
    hargaFilter,
    fasilitasFilter,
    sortBy,
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Jelajahi Paket Wisata Kami</h1>
        <p className="text-muted-foreground">
          Temukan berbagai paket wisata dan persiapkan petualangan Anda
          berikutnya!
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

      {/* Error Message if API fetch failed */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-center">
          <p className="text-red-700">{fetchError}</p>
          <p className="text-sm text-red-600 mt-1">
            Silakan coba muat ulang halaman ini
          </p>
        </div>
      )}

      {/* Category Tabs - Dinamis dari Database + Tab Semua */}
      <Tabs
        defaultValue="semua"
        value={selectedCategory}
        onValueChange={handleCategoryChange}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList className="overflow-x-auto">
            <TabsTrigger value="semua">Semua</TabsTrigger>

            {/* Tab dari database */}
            {categories.map((category) => (
              <TabsTrigger key={category._id} value={category._id}>
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Rekomendasi</SelectItem>
                <SelectItem value="price-low">
                  Harga: Rendah ke Tinggi
                </SelectItem>
                <SelectItem value="price-high">
                  Harga: Tinggi ke Rendah
                </SelectItem>
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
                <SelectItem value="duration-short">
                  Durasi: Terpendek
                </SelectItem>
                <SelectItem value="duration-long">
                  Durasi: Terpanjang
                </SelectItem>
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
                    <h3 className="text-sm font-medium">Durasi</h3>
                    <Select
                      value={durasiFilter}
                      onValueChange={setDurasiFilter}
                    >
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
                        <SelectItem value="under-2m">
                          Di bawah Rp2.000.000
                        </SelectItem>
                        <SelectItem value="2m-4m">
                          Rp2.000.000 - Rp4.000.000
                        </SelectItem>
                        <SelectItem value="above-4m">
                          Di atas Rp4.000.000
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Fasilitas</h3>
                    <Select
                      value={fasilitasFilter}
                      onValueChange={setFasilitasFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih fasilitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semua">Semua Fasilitas</SelectItem>
                        {allFasilitas.map((fasilitas) => (
                          <SelectItem
                            key={fasilitas}
                            value={fasilitas.toLowerCase()}
                          >
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

        {/* Content untuk tab 'semua' */}
        <TabsContent value="semua" className="mt-0">
          {/* Recommendation Section */}
          {!isLoading && paketWisata.length > 0 && (
            <RecommendationSection paketWisata={paketWisata} />
          )}

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
                Tidak ada paket wisata yang sesuai dengan filter Anda. Coba ubah
                filter atau cari dengan kata kunci lain.
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
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
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
        </TabsContent>

        {/* Content untuk tab kategori dari database */}
        {categories.map((category) => (
          <TabsContent key={category._id} value={category._id} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <PaketWisataCardSkeleton
                      key={`skeleton-${category._id}-${index}`}
                    />
                  ))}
              </div>
            ) : paginatedPaket.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPaket.map((paket) => (
                  <PaketWisataCard
                    key={`${category._id}-${paket._id}`}
                    paket={paket}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
                <p className="text-muted-foreground">
                  Tidak ada paket wisata dalam kategori "{category.title}" yang
                  sesuai dengan filter Anda.
                </p>
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
                        if (currentPage > 1) handlePageChange(currentPage - 1);
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
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={`${category._id}-page-${page}`}>
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
                    if (page === 2 || page === totalPages - 1) {
                      return (
                        <PaginationItem
                          key={`${category._id}-ellipsis-${page}`}
                        >
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
          </TabsContent>
        ))}
      </Tabs>

      {/* "Under Development" Section for empty states */}
      {!isLoading && paketWisata.length === 0 && !fetchError && (
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
            Kami sedang bekerja keras untuk menyiapkan paket wisata yang luar
            biasa untuk Anda. Silakan kembali lagi nanti untuk melihat penawaran
            terbaru kami!
          </p>
        </div>
      )}

      {/* Tampilkan paket favorit jika ada */}
      {!isLoading && paketWisata.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Paket Wisata Favorit Anda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paketWisata
              .filter((paket) => paket.isFavorite)
              .slice(0, 3)
              .map((paket) => (
                <PaketWisataCard key={`fav-${paket._id}`} paket={paket} />
              ))}
            {paketWisata.filter((paket) => paket.isFavorite).length === 0 && (
              <div className="col-span-3 text-center py-8">
                <p className="text-muted-foreground">
                  Anda belum memiliki paket wisata favorit. Klik ikon ❤️ pada
                  paket wisata untuk menambahkannya ke daftar favorit.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Banner */}
      <div className="mt-12 bg-primary/5 rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-3">
              Butuh Bantuan Menemukan Paket Wisata?
            </h2>
            <p className="text-muted-foreground mb-4">
              Tim kami siap membantu Anda merancang perjalanan sesuai dengan
              kebutuhan dan preferensi Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  const phone = "628123456789";
                  const text =
                    "Halo, saya ingin konsultasi tentang paket wisata.";
                  window.open(
                    `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
                    "_blank"
                  );
                }}
              >
                Hubungi Kami via WhatsApp
              </Button>
              <Button variant="outline">Lihat FAQ</Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-full h-64">
              <ImageWithFallback
                src=""
                alt="Customer Service"
                className="w-full h-full rounded-lg shadow-lg object-cover"
                fallbackText="Customer Service"
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mt-12 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            Dapatkan Penawaran Terbaik
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Berlangganan newsletter kami untuk mendapatkan informasi tentang
            promosi dan paket wisata terbaru.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input type="email" placeholder="Email Anda" className="flex-1" />
            <Button>Berlangganan</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaketWisataPage;
