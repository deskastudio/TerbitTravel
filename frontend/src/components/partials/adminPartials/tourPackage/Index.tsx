import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate here
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Plus,
  Search,
  SlidersHorizontal,
  FilterX,
  Loader2,
} from "lucide-react";
import { useTourPackage } from "@/hooks/use-tour-package";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;
const PRICE_RANGES = [
  { label: "Semua Harga", value: "all" },
  { label: "< Rp 500.000", value: "0-500000" },
  { label: "Rp 500.000 - Rp 1.000.000", value: "500000-1000000" },
  { label: "Rp 1.000.000 - Rp 2.000.000", value: "1000000-2000000" },
  { label: "> Rp 2.000.000", value: "2000000-above" },
];

const TourPackagePage = () => {
  const navigate = useNavigate(); // Define navigate here
  const {
    packages,
    destinations,
    isLoadingPackages,
    deleteTourPackage, 
    isDeleting,
    refreshTourPackages,
  } = useTourPackage();

  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Format functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Filter functions
  const isInPriceRange = (price: number, range: string) => {
    if (range === "all") return true;
    const [min, max] = range.split("-").map(Number);
    if (range === "2000000-above") return price > 2000000;
    return price >= min && price <= max;
  };

   // Filtered and paginated data
   const filteredPackages = (packages || []).filter((pkg) => {
    const matchesSearch = pkg.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pkg.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDestination = selectedDestination === "all" || 
                              pkg.destination?._id === selectedDestination;
    const matchesStatus = selectedStatus === "all" || pkg.status === selectedStatus;
    const matchesPriceRange = isInPriceRange(pkg.harga, selectedPriceRange);
 
    return matchesSearch && matchesDestination && matchesStatus && matchesPriceRange;
  });
 
  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    console.log("Packages:", packages);
    console.log("Filtered packages:", filteredPackages);
  }, [packages]); 

  // Check if filters are active
  useEffect(() => {
    setIsFilterActive(
      selectedDestination !== "all" ||
      selectedStatus !== "all" ||
      selectedPriceRange !== "all"
    );
  }, [selectedDestination, selectedStatus, selectedPriceRange]);

  // Status badge variant
  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, string> = {
      available: "bg-green-100 text-green-800",
      booked: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  // Handle delete
  const handleDelete = async () => {
    if (selectedPackageId) {
      try {
        await deleteTourPackage(selectedPackageId);
        setIsDeleteDialogOpen(false);
        refreshTourPackages();
      } catch (error) {
        console.error("Error deleting package:", error);
      }
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedDestination("all");
    setSelectedStatus("all");
    setSelectedPriceRange("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  if (isLoadingPackages) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Paket Tour</h1>
        <Button onClick={() => navigate("/admin/paket-wisata/add")}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Paket
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center flex-1 space-x-2">
          <Input
            placeholder="Cari paket tour..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Search className="h-4 w-4 text-gray-500" />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
              {isFilterActive && (
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Paket</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Destinasi</label>
                <Select
                  value={selectedDestination}
                  onValueChange={setSelectedDestination}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih destinasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Destinasi</SelectItem>
                    {destinations.map((destination) => (
                      <SelectItem key={destination._id} value={destination._id}>
                        {destination.nama}
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Rentang Harga</label>
                <Select
                  value={selectedPriceRange}
                  onValueChange={setSelectedPriceRange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih rentang harga" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Paket</TableHead>
              <TableHead>Destinasi</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!packages?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Tidak ada data paket
                </TableCell>
              </TableRow>
            ) : !filteredPackages.length ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Tidak ada data paket yang sesuai dengan filter
                </TableCell>
              </TableRow>
            ) : (
              paginatedPackages.map((pkg) => (
                <TableRow key={pkg._id}>
                  <TableCell className="font-medium">{pkg.nama || '-'}</TableCell>
                  <TableCell>{pkg.destination?.nama || '-'}</TableCell>
                  <TableCell>{pkg.durasi || '-'}</TableCell>
                  <TableCell>{pkg.harga ? formatPrice(pkg.harga) : '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeVariant(pkg.status)}`}>
                      {pkg.status || 'N/A'} 
                    </span>
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
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/paket-wisata/${pkg._id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/admin/paket-wisata/${pkg._id}/edit`)
                          }
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedPackageId(pkg._id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
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

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (
                  (page === currentPage - 2 && page > 2) ||
                  (page === currentPage + 2 && page < totalPages - 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <span className="px-4 py-2">...</span>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus paket tour ini? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
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
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TourPackagePage;
