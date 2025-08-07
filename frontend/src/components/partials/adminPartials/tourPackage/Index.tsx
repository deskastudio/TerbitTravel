import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash, 
  Eye, 
  Search, 
  Loader2, 
  Plus,
  FilterX,
  SlidersHorizontal,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Package
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useTourPackage } from "@/hooks/use-tour-package";

const TourPackageIndex = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    packages,
    destinations,
    isLoadingPackages,
    deleteTourPackage,
    isDeleting,
    refreshTourPackages,
  } = useTourPackage();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");

  // Filter states
  const [selectedDestination, setSelectedDestination] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Memoized values for filters
  const { minPrice, maxPrice, averagePrice, totalPackages } = useMemo(() => {
    if (!packages?.length) {
      return {
        minPrice: 0,
        maxPrice: 10000000,
        averagePrice: 0,
        totalPackages: 0
      };
    }

    return {
      minPrice: Math.min(...packages.map(p => p.harga)),
      maxPrice: Math.max(...packages.map(p => p.harga)),
      averagePrice: packages.reduce((acc, p) => acc + p.harga, 0) / packages.length,
      totalPackages: packages.length
    };
  }, [packages]);

  // Initialize price range when data is loaded
  useEffect(() => {
    if (packages?.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [packages?.length, minPrice, maxPrice]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages?.filter((pkg) => {
      const matchesSearch = 
        pkg.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDestination = 
        selectedDestination === "all" ||
        pkg.destination?._id === selectedDestination;

      const matchesStatus = 
        selectedStatus === "all" || pkg.status === selectedStatus;

      const matchesPrice = 
        pkg.harga >= priceRange[0] && pkg.harga <= priceRange[1];

      return matchesSearch && matchesDestination && matchesStatus && matchesPrice;
    }) || [];
  }, [packages, searchTerm, selectedDestination, selectedStatus, priceRange]);

  // Filter active state
  useEffect(() => {
    setIsFilterActive(
      selectedDestination !== "all" ||
      selectedStatus !== "all" ||
      priceRange[0] !== minPrice ||
      priceRange[1] !== maxPrice
    );
  }, [selectedDestination, selectedStatus, priceRange, minPrice, maxPrice]);

  const resetFilters = () => {
    setSelectedDestination("all");
    setSelectedStatus("all");
    setPriceRange([minPrice, maxPrice]);
    setIsFilterActive(false);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPackages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  // Delete handling
  const handleDeleteClick = (id: string) => {
    setSelectedPackageId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPackageId) {
      try {
        await deleteTourPackage(selectedPackageId);
        toast({
          title: "Sukses",
          description: "Paket wisata berhasil dihapus"
        });
        setIsDeleteDialogOpen(false);
        refreshTourPackages();
      } catch {
        toast({
          title: "Error",
          description: "Gagal menghapus paket wisata",
          variant: "destructive",
        });
      }
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "booked":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoadingPackages) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data paket wisata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Paket Wisata Manajemen</h1>
          <p className="text-gray-600 mt-1">Kelola semua paket wisata dan tur perjalanan</p>
        </div>
        <Button 
          onClick={() => navigate('/admin/paket-wisata/add')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Paket Wisata
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalPackages || 0}</div>
                <div className="text-sm text-gray-600">Total Paket</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatPrice(averagePrice).slice(0, -3)}</div>
                <div className="text-sm text-gray-600">Harga Rata-rata</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{destinations?.length || 0}</div>
                <div className="text-sm text-gray-600">Destinasi</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Search className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredPackages.length}</div>
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
                placeholder="Cari paket wisata atau deskripsi..."
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
                  {isFilterActive && <span className="h-2 w-2 rounded-full bg-blue-600"></span>}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Paket Wisata</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destinasi</label>
                    <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih destinasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Destinasi</SelectItem>
                        {destinations?.map((destination) => (
                          <SelectItem key={destination._id} value={destination._id}>
                            {destination.nama} - {destination.lokasi}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="available">Tersedia</SelectItem>
                        <SelectItem value="booked">Dipesan</SelectItem>
                        <SelectItem value="in_progress">Dalam Perjalanan</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">Rentang Harga</label>
                    <Slider
                      min={minPrice}
                      max={maxPrice}
                      step={100000}
                      value={priceRange}
                      onValueChange={(value: number[]) => setPriceRange(value as [number, number])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
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
          <CardTitle className="text-lg">Daftar Paket Wisata</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Nama Paket</TableHead>
                  <TableHead>Destinasi</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead className="text-right w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl">🏝️</div>
                        <p className="text-gray-500">Tidak ada paket wisata yang ditemukan</p>
                        <p className="text-sm text-gray-400">Coba ubah filter pencarian Anda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((pkg) => (
                    <TableRow key={pkg._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{pkg.nama}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {pkg.deskripsi}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-xs">{pkg.destination?.nama}</span>
                        </div>
                        <div className="text-sm text-gray-500">{pkg.destination?.lokasi}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{pkg.durasi}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          {formatPrice(pkg.harga)}
                        </div>
                        <div className="text-xs text-gray-500">per orang</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getStatusVariant(pkg.status)}`}>
                          {pkg.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{pkg.jadwal?.length || 0} jadwal</span>
                        </div>
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
                            <DropdownMenuItem onClick={() => navigate(`/admin/paket-wisata/${pkg._id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/paket-wisata/${pkg._id}/edit`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(pkg._id)}
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
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus paket wisata ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TourPackageIndex;