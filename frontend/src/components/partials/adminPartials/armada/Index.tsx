import { useState } from "react";
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
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Pencil, Trash, Eye, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";

type Armada = {
  id: string;
  name: string;
  capacity: number;
  price: number;
  brand: string;
  category: string;
};

const armadaData: Armada[] = [
  { id: "1", name: "Bus A", capacity: 40, price: 1000000, brand: "Mercedes", category: "Bus" },
  { id: "2", name: "Van B", capacity: 12, price: 500000, brand: "Toyota", category: "Van" },
  { id: "3", name: "Car C", capacity: 4, price: 300000, brand: "Honda", category: "Car" },
  { id: "4", name: "Minibus D", capacity: 20, price: 750000, brand: "Isuzu", category: "Minibus" },
  { id: "5", name: "SUV E", capacity: 7, price: 600000, brand: "Mitsubishi", category: "SUV" },
  // Add more items for pagination demonstration
  { id: "6", name: "Bus F", capacity: 35, price: 950000, brand: "Volvo", category: "Bus" },
  { id: "7", name: "Van G", capacity: 15, price: 550000, brand: "Hyundai", category: "Van" },
  { id: "8", name: "Car H", capacity: 5, price: 350000, brand: "Toyota", category: "Car" },
  { id: "9", name: "Minibus I", capacity: 25, price: 800000, brand: "Mercedes", category: "Minibus" },
  { id: "10", name: "SUV J", capacity: 8, price: 650000, brand: "Ford", category: "SUV" },
];

const ArmadaTable = () => {
  const [armadas, setArmadas] = useState(armadaData);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  const categories = ["all", ...new Set(armadas.map(armada => armada.category))];

  const filteredArmadas = armadas.filter(
    (armada) =>
      (armada.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       armada.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "all" || armada.category === categoryFilter)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArmadas.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const deleteArmada = (id: string) => {
    setArmadas(armadas.filter((armada) => armada.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search armadas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((armada) => (
              <TableRow key={armada.id}>
                <TableCell className="font-medium">{armada.name}</TableCell>
                <TableCell>{armada.capacity}</TableCell>
                <TableCell>
                  {armada.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </TableCell>
                <TableCell>{armada.brand}</TableCell>
                <TableCell>{armada.category}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/armadas/${armada.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/armadas/${armada.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteArmada(armada.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
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
    </div>
  );
};

export default ArmadaTable;

