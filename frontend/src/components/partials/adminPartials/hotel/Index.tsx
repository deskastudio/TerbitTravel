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
  Building,
  Star,
  DollarSign,
  MapPin
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getImageUrl } from "@/utils/image-helper";

interface Hotel {
  _id: string;
  nama: string;
  alamat: string;
  bintang: number;
  harga: number;
  fasilitas: string[];
  gambar: string[];
}

const HotelTable = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");

  // Filter states
  const [selectedBintang, setSelectedBintang] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000000]);
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Fetch hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/hotel/getAll');
        setHotels(response.data || []);
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
        toast({
          title: "Error",
          description: "Gagal mengambil data hotel",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [toast]);

  // Memoized values for filters
  const { minPrice, maxPrice, averageRating, totalFacilities } = useMemo(() => {
    if (!hotels?.length) {
      return {
        minPrice: 0,
        maxPrice: 1000000000,
        averageRating: 0,
        totalFacilities: 0
      };
    }

    return {
      minPrice: Math.min(...hotels.map(h => h.harga)),
      maxPrice: Math.max(...hotels.map(h => h.harga)),
      averageRating: hotels.reduce((acc, h) => acc + h.bintang, 0) / hotels.length,
      totalFacilities: hotels.reduce((acc, h) => acc + h.fasilitas.length, 0)
    };
  }, [hotels]);

  // Initialize price range when data is loaded
  useEffect(() => {
    if (hotels?.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [hotels?.length, minPrice, maxPrice]);

  // Filtered hotels
  const filteredHotels = useMemo(() => {
    return hotels?.filter((hotel) => {
      const matchesSearch = 
        hotel.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.alamat.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBintang = 
        selectedBintang === "all" ||
        hotel.bintang.toString() === selectedBintang;

      const matchesPrice = 
        hotel.harga >= priceRange[0] && hotel.harga <= priceRange[1];

      return matchesSearch && matchesBintang && matchesPrice;
    }) || [];
  }, [hotels, searchTerm, selectedBintang, priceRange]);

  // Filter active state
  useEffect(() => {
    setIsFilterActive(
      selectedBintang !== "all" ||
      priceRange[0] !== minPrice ||
      priceRange[1] !== maxPrice
    );
  }, [selectedBintang, priceRange, minPrice, maxPrice]);

  const resetFilters = () => {
    setSelectedBintang("all");
    setPriceRange([minPrice, maxPrice]);
    setIsFilterActive(false);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  // Delete handling
  const handleDeleteClick = (id: string) => {
    setSelectedHotelId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedHotelId) {
      try {
        await axios.delete(`/hotel/delete/${selectedHotelId}`);
        setHotels(hotels.filter(hotel => hotel._id !== selectedHotelId));
        toast({
          title: "Sukses",
          description: "Hotel berhasil dihapus"
        });
        setIsDeleteDialogOpen(false);
      } catch {
        toast({
          title: "Error",
          description: "Gagal menghapus hotel",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data hotel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Hotel Manajemen</h1>
          <p className="text-gray-600 mt-1">Kelola semua data hotel dan akomodasi</p>
        </div>
        <Button 
          onClick={() => navigate('/admin/hotel/add')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Hotel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{hotels?.length || 0}</div>
                <div className="text-sm text-gray-600">Total Hotel</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Rata-rata Rating</div>
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
                <div className="text-2xl font-bold text-gray-900">{formatPrice(minPrice).slice(0, -3)}</div>
                <div className="text-sm text-gray-600">Harga Terendah</div>
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
                <div className="text-2xl font-bold text-gray-900">{filteredHotels.length}</div>
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
                placeholder="Cari hotel atau alamat..."
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
                  <SheetTitle>Filter Hotel</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating Bintang</label>
                    <Select value={selectedBintang} onValueChange={setSelectedBintang}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Rating</SelectItem>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <SelectItem key={star} value={star.toString()}>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: star }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                              ))}
                              <span className="ml-1">{star} Bintang</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">Rentang Harga per Malam</label>
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
          <CardTitle className="text-lg">Daftar Hotel</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20">Foto</TableHead>
                  <TableHead>Nama Hotel</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Fasilitas</TableHead>
                  <TableHead className="text-right w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl">🏨</div>
                        <p className="text-gray-500">Tidak ada hotel yang ditemukan</p>
                        <p className="text-sm text-gray-400">Coba ubah filter pencarian Anda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((hotel) => (
                    <TableRow key={hotel._id} className="hover:bg-gray-50">
                      <TableCell>
                        {hotel.gambar && hotel.gambar[0] && (
                          <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-100 group">
                            <img
                              src={getImageUrl(hotel.gambar[0])}
                              alt={hotel.nama}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/200x200?text=No+Image';
                              }}
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{hotel.nama}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-xs">{hotel.alamat}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${
                                i < hotel.bintang 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">({hotel.bintang})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          {formatPrice(hotel.harga)}
                        </div>
                        <div className="text-xs text-gray-500">per malam</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {hotel.fasilitas.slice(0, 2).map((facility, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {facility}
                            </Badge>
                          ))}
                          {hotel.fasilitas.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{hotel.fasilitas.length - 2}
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
                            <DropdownMenuItem onClick={() => navigate(`/admin/hotel/${hotel._id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/hotel/${hotel._id}/edit`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(hotel._id)}
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
              Apakah Anda yakin ingin menghapus hotel ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data termasuk foto yang terkait.
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

export default HotelTable;