// pages/destination/Index.tsx - IMPROVED VERSION with DEBUG
import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  Eye,
  Search,
  Plus,
  Loader2,
  FilterX,
  SlidersHorizontal,
  MapPin,
  Tag,
  Bug, // Added for debug icon
} from "lucide-react";
import { useDestination } from "@/hooks/use-destination";
// import APIConnectionTest from "@/components/debug/APIConnectionTest";
import CORSHeader from "@/components/debug/CORSHeader";
import { APIError, toAPIError } from "@/types/api.types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageUrl } from "@/utils/image-helper";
import APIConnectionTest from "@/components/debug/APIConnectionTest";

const DestinationPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [locationsRange, setLocationsRange] = useState<[string, string]>([
    "",
    "",
  ]);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [showDebug, setShowDebug] = useState(false); // Added debug state
  const itemsPerPage = 8;

  const {
    destinations,
    isLoadingDestinations,
    deleteDestination,
    isDeleting,
    destinationsError, // ✅ Add error state
    refreshDestinations, // ✅ Add refresh function
  } = useDestination();

  const { uniqueLocations, uniqueCategories } = useMemo(() => {
    if (!destinations?.length) {
      return {
        uniqueLocations: [],
        uniqueCategories: [],
      };
    }

    return {
      uniqueLocations: Array.from(
        new Set(destinations.map((d) => d.lokasi))
      ).sort(),
      uniqueCategories: Array.from(
        new Set(
          destinations
            .filter((d) => d.category && d.category.title) // ✅ Filter out destinations without category
            .map((d) => d.category.title)
        )
      ).sort(),
    };
  }, [destinations]);

  useEffect(() => {
    setIsFilterActive(
      selectedCategory !== "all" ||
        locationsRange[0] !== "" ||
        locationsRange[1] !== ""
    );
  }, [selectedCategory, locationsRange]);

  const filteredDestinations = useMemo(() => {
    if (!destinations?.length) return [];

    // ✅ Additional data validation
    const validDestinations = destinations.filter((destination) => {
      // Basic validation
      if (!destination || !destination._id || !destination.nama) {
        console.warn("⚠️ Invalid destination data:", destination);
        return false;
      }
      return true;
    });

    return validDestinations.filter((destination) => {
      const matchesSearch =
        destination.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.lokasi.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (destination.category &&
          destination.category.title === selectedCategory); // ✅ Safe access to category

      const matchesLocation =
        (!locationsRange[0] && !locationsRange[1]) ||
        (destination.lokasi >= locationsRange[0] &&
          destination.lokasi <= locationsRange[1]);

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [destinations, searchTerm, selectedCategory, locationsRange]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setLocationsRange(["", ""]);
    setIsFilterActive(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDestinations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await deleteDestination(selectedId);
        setIsDeleteDialogOpen(false);
      } catch (error: unknown) {
        const apiError = toAPIError(error);
        console.error("Error deleting destination:", apiError.message);
      }
    }
  };

  // ✅ Add error handling
  if (destinationsError) {
    return (
      <div className="space-y-6">
        {/* Debug Panel Toggle for Error State */}
        <div className="flex justify-between items-center">
          <div className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center gap-2"
          >
            <Bug className="h-4 w-4" />
            {showDebug ? "Hide Debug" : "Show Debug"}
          </Button>
        </div>

        {/* Debug Panel */}
        {showDebug && (
          <div className="border-2 border-dashed border-orange-300 p-4 bg-orange-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-orange-800">
              🔧 Debug Panel - Error State
            </h3>
            <div className="mb-4 text-sm space-y-2">
              <div>
                <strong>Error:</strong> {toAPIError(destinationsError).message}
              </div>
              <div>
                <strong>API URL:</strong> {import.meta.env.VITE_API_URL}
              </div>
              <div>
                <strong>Full URL:</strong> {import.meta.env.VITE_API_URL}
                /destination/getAll
              </div>
            </div>
            {/* <APIConnectionTest /> */}
          </div>
        )}

        {/* Error State */}
        <div className="flex justify-center items-center h-64">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Gagal Memuat Data Destinasi
            </h2>
            <p className="text-gray-600 mb-4">
              Terjadi kesalahan saat mengambil data destinasi dari server.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              Error: {toAPIError(destinationsError).message}
            </div>
            <div className="space-x-2">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Refresh Halaman
              </Button>
              <Button onClick={() => refreshDestinations()} variant="outline">
                Refresh Data
              </Button>
              <Link to="/admin/dashboard">
                <Button variant="default">Kembali ke Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingDestinations) {
    return (
      <div className="space-y-6">
        {/* Debug Panel Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center h-32">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Memuat data destinasi...</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center gap-2"
          >
            <Bug className="h-4 w-4" />
            {showDebug ? "Hide Debug" : "Show Debug"}
          </Button>
        </div>

        {/* Debug Panel */}
        {showDebug && (
          <div className="border-2 border-dashed border-orange-300 p-4 bg-orange-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-orange-800">
              🔧 Debug Panel
            </h3>
            <APIConnectionTest />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Panel Toggle - Always visible */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDebug(!showDebug)}
          className="flex items-center gap-2"
        >
          <Bug className="h-4 w-4" />
          {showDebug ? "Hide Debug" : "Show Debug"}
        </Button>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div className="border-2 border-dashed border-orange-300 p-4 bg-orange-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-orange-800">
            🔧 Debug Panel
          </h3>
          <div className="mb-4 text-sm">
            <div>
              <strong>Total Destinations:</strong> {destinations?.length || 0}
            </div>
            <div>
              <strong>Filtered Destinations:</strong>{" "}
              {filteredDestinations.length}
            </div>
            <div>
              <strong>Current Items:</strong> {currentItems.length}
            </div>
            <div>
              <strong>Loading State:</strong>{" "}
              {isLoadingDestinations ? "Loading" : "Loaded"}
            </div>
            <div>
              <strong>API URL:</strong> {import.meta.env.VITE_API_URL}
            </div>
            <div>
              <strong>Raw Destinations Data:</strong>
            </div>
            <pre className="text-xs bg-gray-100 p-2 rounded max-h-32 overflow-auto">
              {JSON.stringify(destinations?.slice(0, 2), null, 2)}
            </pre>
          </div>

          {/* CORS Header Debug */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">CORS Debug:</h4>
            <CORSHeader />
          </div>

          <APIConnectionTest />
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Destination Management
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola semua destinasi wisata yang tersedia
          </p>
        </div>
        <Link to="/admin/destination/add">
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Tambah Destinasi
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {destinations?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Total Destinasi</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Tag className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {uniqueCategories.length}
                </div>
                <div className="text-sm text-gray-600">Kategori</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Search className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredDestinations.length}
                </div>
                <div className="text-sm text-gray-600">Hasil Filter</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari destinasi atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {isFilterActive && (
                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Destinasi</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kategori</label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {uniqueCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lokasi</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih lokasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <SheetFooter>
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full flex items-center gap-2"
                  >
                    <FilterX className="h-4 w-4" />
                    Reset Filter
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Destinasi</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20">Foto</TableHead>
                  <TableHead>Nama Destinasi</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="max-w-xs">Deskripsi</TableHead>
                  <TableHead className="text-right w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl">🏝️</div>
                        <p className="text-gray-500">
                          Tidak ada destinasi yang ditemukan
                        </p>
                        <p className="text-sm text-gray-400">
                          Coba ubah filter pencarian Anda
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((destination) => (
                    <TableRow
                      key={destination._id}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        {destination.foto && destination.foto.length > 0 && (
                          <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-100 group">
                            <img
                              src={getImageUrl(destination.foto[0])}
                              alt={destination.nama}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://placehold.co/200x200?text=No+Image";
                              }}
                              loading="lazy"
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {destination.nama}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {destination.lokasi}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 w-fit"
                        >
                          <Tag className="h-3 w-3" />
                          {destination.category?.title ||
                            "Tidak ada kategori"}{" "}
                          {/* ✅ Safe access with fallback */}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p
                          className="truncate text-gray-600"
                          title={destination.deskripsi}
                        >
                          {destination.deskripsi}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Buka menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/admin/destination/${destination._id}`
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/admin/destination/${destination._id}/edit`
                                )
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedId(destination._id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus destinasi ini? Tindakan ini
              tidak dapat dibatalkan dan akan menghapus semua data termasuk foto
              yang terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DestinationPage;
