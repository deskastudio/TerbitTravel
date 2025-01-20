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
  Sheet,
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
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
import { useConsumption } from "@/hooks/use-consumption";
import { IConsumption } from "@/types/consumption.types";
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

const ConsumptionTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedConsumptionId, setSelectedConsumptionId] = useState<string>("");
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000000]);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);

  const {
    consumptions,
    isLoadingConsumptions,
    deleteConsumption
  } = useConsumption();

  useEffect(() => {
    if (consumptions?.length > 0) {
      const highest = Math.max(...consumptions.map(consumption => consumption.harga));
      setMaxPrice(highest);
      setPriceRange([0, highest]);
    }
  }, [consumptions]);

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

  useEffect(() => {
    setIsFilterActive(
      priceRange[0] !== 0 ||
      priceRange[1] !== maxPrice
    );
  }, [priceRange, maxPrice]);

  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setIsFilterActive(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConsumptions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDeleteClick = (id: string) => {
    setSelectedConsumptionId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedConsumptionId) {
      await deleteConsumption(selectedConsumptionId);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoadingConsumptions) {
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
        <h1 className="text-3xl font-bold tracking-tight">Daftar Konsumsi</h1>
        <Link to="/admin/consumption/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Konsumsi
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Cari konsumsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Search className="h-4 w-4 text-gray-400" />
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
                <label className="text-sm font-medium">Rentang Harga</label>
                <Slider
                  min={0}
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Menu</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Tidak ada data konsumsi yang sesuai dengan filter
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((consumption: IConsumption) => (
                <TableRow key={consumption._id}>
                  <TableCell className="font-medium">{consumption.nama}</TableCell>
                  <TableCell>
                    {consumption.harga.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </TableCell>
                  <TableCell>{consumption.lauk.join(", ")}</TableCell>
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

      <div className="flex justify-center space-x-2">
        {Array.from({ length: Math.ceil(filteredConsumptions.length / itemsPerPage) }, (_, i) => (
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
              Tindakan ini tidak dapat dibatalkan. Data konsumsi akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConsumptionTable;