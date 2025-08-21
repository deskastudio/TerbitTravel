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
  Truck,
  Users,
  DollarSign,
  Car
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useArmada } from "@/hooks/use-armada";
import { IArmada } from "@/types/armada.types";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ArmadaTable = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArmadaId, setSelectedArmadaId] = useState<string>("");

  // Filter states
  const [selectedKapasitas, setSelectedKapasitas] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000000]);
  const [selectedMerek, setSelectedMerek] = useState<string>("all");
  const [isFilterActive, setIsFilterActive] = useState(false);

  const {
    armadas,
    isLoadingArmadas,
    deleteArmada,
    isDeleting
  } = useArmada();

  const {
    uniqueKapasitas,
    uniqueMerek,
    minPrice,
    maxPrice,
    averagePrice,
    totalKapasitas
  } = useMemo(() => {
    if (!armadas?.length) {
      return {
        uniqueKapasitas: [],
        uniqueMerek: [],
        minPrice: 0,
        maxPrice: 5000000,
        averagePrice: 0,
        totalKapasitas: 0
      };
    }
  
    const validArmadas = armadas.filter(a => 
      typeof a.kapasitas === 'number' && 
      typeof a.harga === 'number' && 
      typeof a.merek === 'string'
    );
  
    return {
      uniqueKapasitas: Array.from(new Set(validArmadas.map(a => a.kapasitas))).sort((a, b) => a - b),
      uniqueMerek: Array.from(new Set(validArmadas.map(a => a.merek))).sort(),
      minPrice: validArmadas.length > 0 ? Math.min(...validArmadas.map(a => a.harga)) : 0,
      maxPrice: validArmadas.length > 0 ? Math.max(...validArmadas.map(a => a.harga)) : 5000000,
      averagePrice: validArmadas.length > 0 ? validArmadas.reduce((acc, a) => acc + a.harga, 0) / validArmadas.length : 0,
      totalKapasitas: validArmadas.reduce((acc, a) => acc + a.kapasitas, 0) // ✅ Ini yang diperbaiki - hanya total angka
    };
  }, [armadas]);

  // Initialize price range when data is loaded
  useEffect(() => {
    if (armadas?.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [armadas?.length, minPrice, maxPrice]);

  // Filtered armadas
  const filteredArmadas = useMemo(() => {
    return armadas?.filter((armada) => {
      const matchesSearch = 
        armada.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        armada.merek.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesKapasitas = 
        selectedKapasitas === "all" ||
        armada.kapasitas.toString() === selectedKapasitas;

      const matchesMerek =
        selectedMerek === "all" ||
        armada.merek === selectedMerek;

      const matchesPrice = 
        armada.harga >= priceRange[0] && armada.harga <= priceRange[1];

      return matchesSearch && matchesKapasitas && matchesMerek && matchesPrice;
    }) || [];
  }, [armadas, searchTerm, selectedKapasitas, selectedMerek, priceRange]);

  // Filter active state
  useEffect(() => {
    setIsFilterActive(
      selectedKapasitas !== "all" ||
      selectedMerek !== "all" ||
      priceRange[0] !== minPrice ||
      priceRange[1] !== maxPrice
    );
  }, [selectedKapasitas, selectedMerek, priceRange, minPrice, maxPrice]);

  const resetFilters = () => {
    setSelectedKapasitas("all");
    setSelectedMerek("all");
    setPriceRange([minPrice, maxPrice]);
    setIsFilterActive(false);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArmadas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredArmadas.length / itemsPerPage);

  // Delete handling
  const handleDeleteClick = (id: string) => {
    setSelectedArmadaId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedArmadaId) {
      try {
        await deleteArmada(selectedArmadaId);
        toast({
          title: "Sukses",
          description: "Armada berhasil dihapus"
        });
        setIsDeleteDialogOpen(false);
      } catch {
        toast({
          title: "Error",
          description: "Gagal menghapus armada",
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

  if (isLoadingArmadas) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data armada...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Armada Manajemen</h1>
          <p className="text-gray-600 mt-1">Kelola semua kendaraan dan armada transportasi</p>
        </div>
        <Button 
          onClick={() => navigate('/admin/armada/add')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Armada
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{armadas?.length || 0}</div>
                <div className="text-sm text-gray-600">Total Armada</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalKapasitas}</div>
                  <div className="text-sm text-gray-600">Total Kapasitas</div>
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
                <div className="text-2xl font-bold text-gray-900">{formatPrice(averagePrice).slice(0, -3)}</div>
                <div className="text-sm text-gray-600">Harga Rata-rata</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Car className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{uniqueMerek.length}</div>
                <div className="text-sm text-gray-600">Jenis Merek</div>
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
                placeholder="Cari armada atau merek..."
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
                  <SheetTitle>Filter Armada</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kapasitas Penumpang</label>
                    <Select 
                      value={selectedKapasitas} 
                      onValueChange={setSelectedKapasitas}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kapasitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kapasitas</SelectItem>
                        {uniqueKapasitas.map((kapasitas) => (
                          <SelectItem key={kapasitas} value={kapasitas.toString()}>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {kapasitas} Orang
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Merek Kendaraan</label>
                    <Select 
                      value={selectedMerek} 
                      onValueChange={setSelectedMerek}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih merek" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Merek</SelectItem>
                        {uniqueMerek.map((merek) => (
                          <SelectItem key={merek} value={merek}>
                            {merek}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">Rentang Harga Sewa</label>
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
          <CardTitle className="text-lg">Daftar Armada</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20">Foto</TableHead>
                  <TableHead>Nama Armada</TableHead>
                  <TableHead>Kapasitas</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Merek</TableHead>
                  <TableHead className="text-right w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl">🚐</div>
                        <p className="text-gray-500">Tidak ada armada yang ditemukan</p>
                        <p className="text-sm text-gray-400">Coba ubah filter pencarian Anda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((armada: IArmada) => (
                    <TableRow key={armada._id} className="hover:bg-gray-50">
                      <TableCell>
                        {armada.gambar && armada.gambar[0] && (
                          <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-100 group">
                            <img
                              src={`http://localhost:5000/${armada.gambar[0]}`}
                              alt={armada.nama}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/200x200?text=No+Image';
                              }}
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{armada.nama}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{armada.kapasitas}</span>
                          <span className="text-gray-500 text-sm">orang</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          {formatPrice(armada.harga)}
                        </div>
                        <div className="text-xs text-gray-500">per hari</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {armada.merek}
                        </Badge>
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
                            <DropdownMenuItem onClick={() => navigate(`/admin/armada/${armada._id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/armada/${armada._id}/edit`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(armada._id)}
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
              Apakah Anda yakin ingin menghapus armada ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data termasuk foto yang terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Ya, Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ArmadaTable;