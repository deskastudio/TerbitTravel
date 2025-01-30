// pages/destination/Index.tsx
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
  SlidersHorizontal 
} from 'lucide-react';
import { useDestination } from "@/hooks/use-destination";

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
import { getImageUrl } from "@/utils/image-helper";

const DestinationPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [locationsRange, setLocationsRange] = useState<[string, string]>(["", ""]);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const itemsPerPage = 5;

  const {
    destinations,
    isLoadingDestinations,
    deleteDestination,
    isDeleting,
  } = useDestination();

  const {
    uniqueLocations,
    uniqueCategories,
  } = useMemo(() => {
    if (!destinations?.length) {
      return {
        uniqueLocations: [],
        uniqueCategories: []
      };
    }

    return {
      uniqueLocations: Array.from(new Set(destinations.map(d => d.lokasi))).sort(),
      uniqueCategories: Array.from(new Set(destinations.map(d => d.category.title))).sort(),
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
    return destinations?.filter((destination) => {
      const matchesSearch = 
        destination.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.lokasi.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        destination.category.title === selectedCategory;

      const matchesLocation =
        !locationsRange[0] && !locationsRange[1] ||
        (destination.lokasi >= locationsRange[0] && destination.lokasi <= locationsRange[1]);

      return matchesSearch && matchesCategory && matchesLocation;
    }) || [];
  }, [destinations, searchTerm, selectedCategory, locationsRange]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setLocationsRange(["", ""]);
    setIsFilterActive(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDestinations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await deleteDestination(selectedId);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error('Error deleting destination:', error);
      }
    }
  };

  if (isLoadingDestinations) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Daftar Destinasi</h1>
        <Link to="/admin/destination/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Destinasi
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Cari destinasi..."
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Tidak ada data destinasi yang sesuai dengan filter
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((destination) => (
                <TableRow key={destination._id}>
                 <TableCell>
                    {destination.foto && destination.foto.length > 0 && (
                      <div className="w-16 h-16 relative overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={getImageUrl(destination.foto[0])}
                          alt={destination.nama}
                          className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/200x200?text=No+Image';
                          }}
                          loading="lazy"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{destination.nama}</TableCell>
                  <TableCell>{destination.lokasi}</TableCell>
                  <TableCell>{destination.category.title}</TableCell>
                  <TableCell className="truncate max-w-xs">
                    {destination.deskripsi}
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
                        <DropdownMenuItem onClick={() => navigate(`/admin/destination/${destination._id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/admin/destination/${destination._id}/edit`)}>
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

      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
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
              Tindakan ini tidak dapat dibatalkan. Data destinasi akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
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

export default DestinationPage;