"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
  destinationId?: string;  // Added: ID destinasi untuk filter
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
    destinationId: tourPackage.destination._id, // Add the destination ID for filtering
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
  const navigate = useNavigate();
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

  // State untuk filter berdasarkan destinasi
  const [destinationFilter, setDestinationFilter] = useState<string | null>(null);
  const [destinationName, setDestinationName] = useState<string | null>(null);
  
  // Get destination filter from URL query parameters
  const [searchParams] = useSearchParams();
  const location = useLocation();

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
  }, [paketWisata]);

  // Check for destination filter in URL params or location state
  useEffect(() => {
    const destinationId = searchParams.get('destinationId');
    const locationState = location.state as { destinationName?: string, filterByDestination?: boolean, destinationId?: string } | null;
    
    console.log("🔄 URL parameters changed:");
    console.log("  destinationId from URL:", destinationId);
    console.log("  Location state:", locationState);
    
    // Run a debug check to see if any packages are available
    const runDebugCheck = async () => {
      try {
        const samplePackage = await TourPackageService.debugGetSinglePackage();
        console.log("🔍 Debug check complete. Package available:", !!samplePackage);
      } catch (error) {
        console.error("❌ Debug check failed:", error);
      }
    };
    
    runDebugCheck();
    
    if (destinationId) {
      console.log("📍 Setting destination filter from URL parameter:", destinationId);
      setDestinationFilter(destinationId);
    } else if (locationState?.filterByDestination && locationState.destinationId) {
      console.log("📍 Setting destination filter from location state:", locationState.destinationId);
      setDestinationFilter(locationState.destinationId);
      if (locationState.destinationName) {
        setDestinationName(locationState.destinationName);
      }
    }
  }, [searchParams, location]);

  // Fetch data kategori dan paket wisata dari API pada saat komponen dimount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        // Get destination ID from URL or state
        const locationState = location.state as { 
          destinationId?: string;
          destinationName?: string;
        } | null;
        
        // Check URL parameters and location state
        console.log("URL params:", Object.fromEntries(searchParams.entries()));
        console.log("Location state:", locationState);
        
        const destId = searchParams.get('destinationId') || 
                     locationState?.destinationId || null;
                     
        console.log("Destination ID for filtering:", destId);
        
        // Set destination name if available
        if (locationState?.destinationName) {
          setDestinationName(locationState.destinationName);
          console.log("Setting destination name:", locationState.destinationName);
        } else if (destId) {
          // If we have destId but no name, use a generic name
          setDestinationName("Pilihan Anda");
          console.log("Using generic destination name");
        }

        // Ambil kategori dan paket wisata secara parallel
        const categoriesPromise = TourPackageService.getAllCategories();
        
        // If destination filter is applied, get packages by destination
        // Variable to store package data
        let packagesData;
        
        // First fetch categories
        const categoriesData = await categoriesPromise;
        
        if (destId) {
          setDestinationFilter(destId);
          console.log(`🔍 Searching for packages with destination ID: ${destId}`);
          
          // Pendekatan sederhana: Pertama coba dengan ID destinasi yang diberikan
          console.log(`🔍 Mencoba mencari paket dengan ID destinasi: ${destId}`);
          packagesData = await TourPackageService.getPackagesByDestination(destId);
          
          // Jika tidak ditemukan dan kita punya nama destinasi, gunakan nama untuk mencari
          if (packagesData.length === 0 && destinationName) {
            console.log(`🔍 Tidak ditemukan paket dengan ID destinasi, mencoba dengan nama: "${destinationName}"`);
            packagesData = await TourPackageService.getPackagesByDestinationName(destinationName);
            
            if (packagesData.length > 0) {
              console.log(`✅ Berhasil menemukan ${packagesData.length} paket berdasarkan nama destinasi`);
              toast({
                title: "Paket wisata ditemukan!",
                description: `Ditemukan ${packagesData.length} paket wisata untuk destinasi "${destinationName}"`,
              });
            }
          }
          
          // Jika masih tidak ditemukan, coba metode ID similar sebagai cadangan
          if (packagesData.length === 0)
            console.log(`🔍 Mencoba metode pencarian ID yang mirip...`);
            
            // Coba cari ID yang mirip
            const similarDestResult = await TourPackageService.findPackagesByAlmostMatchingDestination(destId);
            
            if (similarDestResult.packages.length > 0) {
              packagesData = similarDestResult.packages;
              console.log(`✅ Ditemukan ${packagesData.length} paket dengan ID destinasi yang mirip: ${similarDestResult.matchedId}`);
              
              toast({
                title: "Paket wisata ditemukan!",
                description: `Ditemukan ${packagesData.length} paket wisata untuk destinasi serupa.`,
              });
              
              // Update filter ke ID yang ditemukan
              if (similarDestResult.matchedId) {
                console.log(`🔄 Memperbarui filter dari ${destId} ke ${similarDestResult.matchedId}`);
                setDestinationFilter(similarDestResult.matchedId);
              }
            } else {
              // Jika masih tidak ditemukan, tampilkan debug info
              console.log(`❌ Tidak ditemukan paket wisata untuk destinasi ini`);
            }
          }
         else {
          packagesData = await TourPackageService.getAllPackages();
        }

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

          // Log for debugging if filtering by destination
          if (destId) {
            console.log(`🔍 Destination filter active: ${destId}`);
            console.log(`📦 Found ${packagesData.length} packages for this destination`);
          }

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
  }, [toast, searchParams, location.state, destinationName]);

  // Filter packages based on search, category, destination, and other filters
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
    
    // Double-check destination filtering at UI level as well
    // This is a fallback in case the API-level filtering didn't work
    let matchesDestination = true;
    if (destinationFilter && paket.destinationId) {
      // Log for debugging
      console.log(`🔍 Checking package ${paket._id} destination: ${paket.destinationId} against filter: ${destinationFilter}`);
      
      // Clean both IDs for comparison
      const cleanPaketDestId = paket.destinationId.replace(/[^a-fA-F0-9]/g, '');
      const cleanFilterDestId = destinationFilter.replace(/[^a-fA-F0-9]/g, '');
      
      // Try multiple comparison strategies
      matchesDestination = 
        // Exact match
        paket.destinationId === destinationFilter ||
        // Match on cleaned IDs
        cleanPaketDestId === cleanFilterDestId ||
        // Substring match (in case one format is a subset of the other)
        cleanPaketDestId.includes(cleanFilterDestId) ||
        cleanFilterDestId.includes(cleanPaketDestId);
        
      // If still no match and both IDs are valid ObjectId format (24 hex chars),
      // check for high similarity (only 1-2 characters different)
      if (!matchesDestination && cleanPaketDestId.length === 24 && cleanFilterDestId.length === 24) {
        let matchingChars = 0;
        for (let i = 0; i < 24; i++) {
          if (cleanPaketDestId[i] === cleanFilterDestId[i]) matchingChars++;
        }
        
        const similarityPercentage = (matchingChars / 24) * 100;
        // If IDs are 90%+ similar (typically only 1-2 characters different), consider a match
        if (similarityPercentage >= 90) {
          console.log(`📊 High similarity match: ${paket.destinationId} is ${similarityPercentage.toFixed(1)}% similar to ${destinationFilter}`);
          matchesDestination = true;
        }
      }
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
      matchesFasilitas &&
      matchesDestination
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

      {/* Destination filter info if applied */}
      {destinationFilter && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-blue-800 font-medium flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Paket Wisata untuk: {destinationName || "Destinasi Pilihan"}
              </h3>
              <p className="text-sm text-blue-600 mt-1 mb-2">
                {filteredPaket.length > 0 ? (
                  `Ditemukan ${filteredPaket.length} paket wisata untuk destinasi ini`
                ) : (
                  "Mencari paket wisata yang sesuai dengan destinasi ini..."
                )}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Run the debug utility
                    TourPackageService.debugDestinationIdMatching(destinationFilter || "");
                  }}
                  className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded text-blue-700"
                >
                  Debug ID Format
                </button>
                {destinationName && (
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      if (!destinationName) return;
                      
                      // Show loading toast
                      toast({
                        title: "Mencari paket...",
                        description: `Mencari paket wisata untuk: ${destinationName}`,
                      });
                      
                      try {
                        // Try to get packages by destination name
                        const nameResult = await TourPackageService.getPackagesByDestinationName(destinationName);
                        
                        if (nameResult && nameResult.length > 0) {
                          // Convert to UI format
                          const savedFavorites = JSON.parse(
                            localStorage.getItem("favoritePackages") || "[]"
                          );
                          
                          const convertedData = nameResult.map((pkg) => {
                            const converted = convertToUIFormat(pkg);
                            converted.isFavorite = savedFavorites.includes(converted._id);
                            return converted;
                          });
                          
                          // Update the packages
                          setPaketWisata(convertedData);
                          
                          toast({
                            title: "Paket ditemukan!",
                            description: `Berhasil menemukan ${nameResult.length} paket wisata untuk ${destinationName}`,
                          });
                        } else {
                          toast({
                            variant: "destructive",
                            title: "Tidak ditemukan",
                            description: `Tidak ada paket wisata untuk destinasi: ${destinationName}`,
                          });
                        }
                      } catch (error) {
                        console.error("Error searching by name:", error);
                        toast({
                          variant: "destructive",
                          title: "Gagal mencari",
                          description: "Terjadi kesalahan saat mencari paket wisata",
                        });
                      }
                    }}
                    className="text-xs bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded text-amber-700"
                  >
                    Cari Dengan Nama
                  </button>
                )}
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (!destinationFilter) return;
                    
                    // Check for similar destination IDs and show the result
                    const similarResult = await TourPackageService.findPackagesByAlmostMatchingDestination(destinationFilter);
                    
                    if (similarResult.packages.length > 0) {
                      toast({
                        title: `Ditemukan ${similarResult.packages.length} paket!`,
                        description: `Tipe: ${similarResult.matchType === 'exact' ? 'ID persis sama' : 
                                             similarResult.matchType === 'high-similarity' ? 'ID sangat mirip' :
                                             'ID dengan prefiks sama'}`,
                      });
                      
                      // If there's a match, update the filter to the matched ID
                      if (similarResult.matchedId && similarResult.matchedId !== destinationFilter) {
                        setDestinationFilter(similarResult.matchedId);
                        toast({
                          title: "ID Diperbarui",
                          description: "Menggunakan ID destinasi yang mirip yang memiliki paket",
                        });
                      }
                      
                      // Convert packages to UI format
                      const savedFavorites = JSON.parse(
                        localStorage.getItem("favoritePackages") || "[]"
                      );
                      
                      const convertedData = similarResult.packages.map((pkg) => {
                        const converted = convertToUIFormat(pkg);
                        converted.isFavorite = savedFavorites.includes(converted._id);
                        return converted;
                      });
                      
                      // Update the packages
                      setPaketWisata(convertedData);
                    } else {
                      toast({
                        variant: "destructive",
                        title: "Tidak ditemukan",
                        description: "Tidak dapat menemukan destinasi dengan ID yang mirip",
                      });
                    }
                  }}
                  className="text-xs bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded text-purple-700"
                >
                  Cari ID Serupa
                </button>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => {
                  if (!destinationName) return;
                  
                  // Set search query to destination name to aid in manual search
                  setSearchQuery(destinationName);
                  // Clear destination filter
                  setDestinationFilter(null);
                  setDestinationName(null);
                }}
              >
                <Search className="h-3.5 w-3.5 mr-1" />
                Cari Manual
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setDestinationFilter(null);
                  setDestinationName(null);
                  navigate('/tour-package');
                }}
              >
                Lihat Semua Paket
              </Button>
            </div>
          </div>
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
                {destinationFilter
                  ? `Tidak ada paket wisata yang tersedia untuk destinasi ini saat ini.`
                  : `Tidak ada paket wisata yang sesuai dengan filter Anda. Coba ubah
                    filter atau cari dengan kata kunci lain.`
                }
              </p>
              {/* Show specific message when filtering by destination */}
              {destinationFilter && (
                <div className="bg-amber-50 border border-amber-200 p-4 mb-4 rounded-md text-sm">
                  <h4 className="font-medium text-amber-800 mb-1">Informasi</h4>
                  <p className="text-amber-700 mb-3">
                    Sistem telah mencoba menemukan paket wisata untuk destinasi ini (ID: <span className="font-mono bg-amber-100 px-1 rounded">{destinationFilter}</span>), 
                    namun belum menemukan paket yang sesuai. Beberapa kemungkinan penyebabnya:
                  </p>
                  <ul className="list-disc pl-5 text-amber-700 mb-3 space-y-1">
                    <li>Belum ada paket wisata yang tersedia untuk destinasi ini</li>
                    <li>Ada perbedaan ID destinasi pada database (format ID mungkin berbeda)</li>
                    <li>Destinasi ini termasuk dalam paket wisata gabungan</li>
                    <li>Coba klik "Lihat Semua Paket" dan filter secara manual</li>
                  </ul>
                  
                  {/* Debug info for developers */}
                  <div className="bg-gray-100 p-2 rounded-md mt-2 text-xs font-mono text-gray-700 overflow-auto">
                    <p className="font-bold">Debug Info:</p>
                    <p>ID: {destinationFilter}</p>
                    <p>Name: {destinationName}</p>
                    <p>Total Packages: {paketWisata.length}</p>
                    <p>Clean ID: {destinationFilter?.replace(/[^a-fA-F0-9]/g, '')}</p>
                    <p>Filtered Packages: {filteredPaket.length}</p>
                    <div className="mt-2 mb-1 border-t border-gray-300 pt-2">
                      <p className="font-semibold">Similar ID Checker:</p>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          if (!destinationFilter) return;
                          
                          // Check for similar destination IDs and show the result
                          const similarResult = await TourPackageService.findPackagesByAlmostMatchingDestination(destinationFilter);
                          
                          if (similarResult.packages.length > 0) {
                            toast({
                              title: `Found ${similarResult.packages.length} packages!`,
                              description: `Match type: ${similarResult.matchType}, ID: ${similarResult.matchedId}`,
                            });
                            
                            // If there's a match, update the filter to the matched ID
                            if (similarResult.matchedId && similarResult.matchedId !== destinationFilter) {
                              setDestinationFilter(similarResult.matchedId);
                              toast({
                                title: "ID Updated",
                                description: "Using similar destination ID that has packages",
                              });
                            }
                          } else {
                            toast({
                              variant: "destructive",
                              title: "No matches found",
                              description: "Could not find any destination with similar ID",
                            });
                          }
                        }}
                        className="px-2 py-1 bg-purple-600 text-white rounded text-xs mr-2 mt-1"
                      >
                        Find Similar ID
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          TourPackageService.debugDestinationIdMatching(destinationFilter || "");
                        }}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs mr-2 mt-1"
                      >
                        Run ID Format Check
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          TourPackageService.logRawPackageData();
                        }}
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs mt-1"
                      >
                        Log Raw Data
                      </button>
                      {destinationName && (
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            if (!destinationName) return;
                            
                            // Show loading toast
                            toast({
                              title: "Mencari paket...",
                              description: `Mencari paket wisata untuk: ${destinationName}`,
                            });
                            
                            try {
                              // Try to get packages by destination name
                              const nameResult = await TourPackageService.getPackagesByDestinationName(destinationName);
                              
                              if (nameResult && nameResult.length > 0) {
                                // Convert to UI format
                                const savedFavorites = JSON.parse(
                                  localStorage.getItem("favoritePackages") || "[]"
                                );
                                
                                const convertedData = nameResult.map((pkg) => {
                                  const converted = convertToUIFormat(pkg);
                                  converted.isFavorite = savedFavorites.includes(converted._id);
                                  return converted;
                                });
                                
                                // Update the packages
                                setPaketWisata(convertedData);
                                
                                toast({
                                  title: "Paket ditemukan!",
                                  description: `Berhasil menemukan ${nameResult.length} paket wisata untuk ${destinationName}`,
                                });
                              } else {
                                toast({
                                  variant: "destructive",
                                  title: "Tidak ditemukan",
                                  description: `Tidak ada paket wisata untuk destinasi: ${destinationName}`,
                                });
                              }
                            } catch (error) {
                              console.error("Error searching by name:", error);
                              toast({
                                variant: "destructive",
                                title: "Gagal mencari",
                                description: "Terjadi kesalahan saat mencari paket wisata",
                              });
                            }
                          }}
                          className="px-2 py-1 bg-yellow-600 text-white rounded text-xs mr-2 mt-1"
                        >
                          Cari Dengan Nama
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-2 justify-center">
                <Button onClick={resetFilters}>Reset Filter</Button>
                {destinationFilter && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setDestinationFilter(null);
                      setDestinationName(null);
                      navigate('/tour-package');
                    }}
                  >
                    Lihat Semua Paket
                  </Button>
                )}
              </div>
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
    </div>
  );
};

export default PaketWisataPage;
