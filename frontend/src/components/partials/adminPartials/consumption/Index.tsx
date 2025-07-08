import { useState, useEffect, useMemo } from "react";
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
  UtensilsCrossed,
  DollarSign,
  Package,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useConsumption } from "@/hooks/use-consumption";
import { IConsumption } from "@/types/consumption.types";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ConsumptionTable = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedConsumptionId, setSelectedConsumptionId] = useState<string>("");

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const {
    consumptions,
    isLoadingConsumptions,
    consumptionsError,
    deleteConsumption,
    refreshConsumptions
  } = useConsumption();

  // Fetch consumptions
  useEffect(() => {
    refreshConsumptions();
  }, [refreshConsumptions]);

  // Memoized values for filters and stats
  const { minPrice, maxPrice, averagePrice, totalMenus } = useMemo(() => {
    if (!consumptions?.length) {
      return {
        minPrice: 0,
        maxPrice: 1000000,
        averagePrice: 0,
        totalMenus: 0
      };
    }

    return {
      minPrice: Math.min(...consumptions.map(c => c.harga)),
      maxPrice: Math.max(...consumptions.map(c => c.harga)),
      averagePrice: consumptions.reduce((acc, c) => acc + c.harga, 0) / consumptions.length,
      totalMenus: consumptions.reduce((acc, c) => acc + c.lauk.length, 0)
    };
  }, [consumptions]);

  // Initialize price range when data is loaded
  useEffect(() => {
    if (consumptions?.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [consumptions?.length, minPrice, maxPrice]);

  // Filtered consumptions
  const filteredConsumptions = useMemo(() => {
    return consumptions?.filter((consumption) => {
      const matchesSearch = 
        consumption.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consumption.lauk.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesPrice = 
        consumption.harga >= priceRange[0] && consumption.harga <= priceRange[1];

      return matchesSearch && matchesPrice;
    }) || [];
  }, [consumptions, searchTerm, priceRange]);

  // Filter active state
  useEffect(() => {
    setIsFilterActive(
      priceRange[0] !== minPrice ||
      priceRange[1] !== maxPrice
    );
  }, [priceRange, minPrice, maxPrice]);

  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setIsFilterActive(false);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConsumptions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredConsumptions.length / itemsPerPage);

  // Delete handling
  const handleDeleteClick = (id: string) => {
    setSelectedConsumptionId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedConsumptionId) {
      try {
        await deleteConsumption(selectedConsumptionId);
        toast({
          title: "Sukses",
          description: "Konsumsi berhasil dihapus"
        });
        setIsDeleteDialogOpen(false);
      } catch {
        toast({
          title: "Error",
          description: "Gagal menghapus konsumsi",
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

  const truncateMenus = (menus: string[], maxItems: number = 2) => {
    if (menus.length <= maxItems) {
      return menus;
    }
    return [...menus.slice(0, maxItems)];
  };

  if (isLoadingConsumptions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data konsumsi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Consumption Management</h1>
          <p className="text-gray-600 mt-1">Kelola semua paket konsumsi dan menu acara</p>
        </div>
        <Button 
          onClick={() => navigate('/admin/consumption/add')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Konsumsi
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UtensilsCrossed className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{consumptions?.length || 0}</div>
                <div className="text-sm text-gray-600">Total Konsumsi</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
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
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatPrice(minPrice).slice(0, -3)}</div>
                <div className="text-sm text-gray-600">Harga Terendah</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalMenus}</div>
                <div className="text-sm text-gray-600">Total Menu</div>
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
                placeholder="Cari konsumsi atau menu..."
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
                  <SheetTitle>Filter Konsumsi</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Rentang Harga per Porsi</label>
                    <Slider
                      min={minPrice}
                      max={maxPrice}
                      step={1000}
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
          <CardTitle className="text-lg">Daftar Konsumsi</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Nama Konsumsi</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Menu</TableHead>
                  <TableHead className="text-right w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl">🍽️</div>
                        <p className="text-gray-500">Tidak ada konsumsi yang ditemukan</p>
                        <p className="text-sm text-gray-400">Coba ubah filter pencarian Anda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((consumption: IConsumption) => (
                    <TableRow key={consumption._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{consumption.nama}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          {formatPrice(consumption.harga)}
                        </div>
                        <div className="text-xs text-gray-500">per porsi</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {truncateMenus(consumption.lauk).map((menu, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {menu}
                            </Badge>
                          ))}
                          {consumption.lauk.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{consumption.lauk.length - 2}
                            </Badge>
                          )}
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
                            <DropdownMenuItem onClick={() => navigate(`/admin/consumption/${consumption._id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/consumption/${consumption._id}/edit`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(consumption._id)}
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
              Apakah Anda yakin ingin menghapus konsumsi ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data menu yang terkait.
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

export default ConsumptionTable;