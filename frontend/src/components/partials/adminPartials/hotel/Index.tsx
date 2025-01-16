// Index.tsx
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
import { 
  MoreHorizontal, 
  Pencil, 
  Trash, 
  Eye, 
  Search, 
  Loader2, 
  Plus,
  FilterX,
  SlidersHorizontal 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  const [itemsPerPage] = useState(5);
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
  const { minPrice, maxPrice } = useMemo(() => {
    if (!hotels?.length) {
      return {
        minPrice: 0,
        maxPrice: 1000000000
      };
    }

    return {
      minPrice: Math.min(...hotels.map(h => h.harga)),
      maxPrice: Math.max(...hotels.map(h => h.harga))
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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Daftar Hotel</h1>
        <Button onClick={() => navigate('/admin/hotel/add')}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Hotel
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Cari hotel..."
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
              {isFilterActive && <span className="h-2 w-2 rounded-full bg-blue-600"></span>}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Hotel</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bintang Hotel</label>
                <Select value={selectedBintang} onValueChange={setSelectedBintang}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bintang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Bintang</SelectItem>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <SelectItem key={star} value={star.toString()}>
                        {star} Bintang
                      </SelectItem>
                    ))}
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gambar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Bintang</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Fasilitas</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Tidak ada data hotel yang sesuai dengan filter
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((hotel) => (
                <TableRow key={hotel._id}>
                  <TableCell>
                    {hotel.gambar && hotel.gambar[0] && (
                      <img
                        src={`http://localhost:5000/${hotel.gambar[0]}`}
                        alt={hotel.nama}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{hotel.nama}</TableCell>
                  <TableCell>{hotel.alamat}</TableCell>
                  <TableCell>{'⭐'.repeat(hotel.bintang)}</TableCell>
                  <TableCell>{formatPrice(hotel.harga)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {hotel.fasilitas.map((facility, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {facility}
                        </span>
                      ))}
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

      <div className="flex justify-center space-x-2">
        {Array.from({ length: Math.ceil(filteredHotels.length / itemsPerPage) }, (_, i) => (
          <Button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            variant={currentPage === i + 1 ? "default" : "outline"}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data hotel akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HotelTable;