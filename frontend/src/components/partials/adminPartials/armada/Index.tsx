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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Sheet,
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
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
import { useNavigate, Link } from "react-router-dom";
import { useArmada } from "@/hooks/use-armada";
import { IArmada } from "@/types/armada.types";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

const ArmadaTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
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

  // Memoized unique values and ranges
  const {
    uniqueKapasitas,
    uniqueMerek,
    minPrice,
    maxPrice
  } = useMemo(() => {
    if (!armadas?.length) {
      return {
        uniqueKapasitas: [],
        uniqueMerek: [],
        minPrice: 0,
        maxPrice: 1000000000
      };
    }

    return {
      uniqueKapasitas: Array.from(new Set(armadas.map(a => a.kapasitas))).sort((a, b) => a - b),
      uniqueMerek: Array.from(new Set(armadas.map(a => a.merek))).sort(),
      minPrice: Math.min(...armadas.map(a => a.harga)),
      maxPrice: Math.max(...armadas.map(a => a.harga))
    };
  }, [armadas]);

  // Initialize price range when data is loaded
  useEffect(() => {
    if (armadas?.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [armadas?.length, minPrice, maxPrice]);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArmadas.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDeleteClick = (id: string) => {
    setSelectedArmadaId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedArmadaId) {
      await deleteArmada(selectedArmadaId);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoadingArmadas) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Daftar Armada</h1>
        <Link to="/admin/armada/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Armada
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Cari armada..."
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
                        {kapasitas} Orang
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Merek</label>
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
              <TableHead>Kapasitas</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Merek</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Tidak ada data armada yang sesuai dengan filter
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((armada: IArmada) => (
                <TableRow key={armada._id}>
                  <TableCell>
                    {armada.gambar && armada.gambar.length > 0 && (
                      <img
                        src={`http://localhost:5000/${armada.gambar[0]}`}
                        alt={armada.nama}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{armada.nama}</TableCell>
                  <TableCell>{armada.kapasitas} orang</TableCell>
                  <TableCell>
                    {armada.harga.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </TableCell>
                  <TableCell>{armada.merek}</TableCell>
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

      <div className="flex justify-center space-x-2">
        {Array.from({ length: Math.ceil(filteredArmadas.length / itemsPerPage) }, (_, i) => (
          <Button
            key={i}
            onClick={() => paginate(i + 1)}
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
              Tindakan ini tidak dapat dibatalkan. Data armada akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
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

export default ArmadaTable;