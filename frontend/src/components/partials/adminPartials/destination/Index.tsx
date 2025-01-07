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

type Destination = {
  id: string;
  name: string;
  location: string;
  description: string;
  category: string;
};

const destinationData: Destination[] = [
  { id: "1", name: "Bali Beaches", location: "Bali", description: "Beautiful beaches and sunsets", category: "Beach" },
  { id: "2", name: "Mount Bromo", location: "East Java", description: "Scenic volcanic landscape", category: "Mountain" },
  { id: "3", name: "Borobudur Temple", location: "Central Java", description: "Ancient Buddhist temple", category: "Cultural" },
  { id: "4", name: "Komodo Island", location: "East Nusa Tenggara", description: "Home of Komodo dragons", category: "Nature" },
  { id: "5", name: "Jakarta Old Town", location: "Jakarta", description: "Historical district of Jakarta", category: "City" },
  { id: "6", name: "Toba Lake", location: "North Sumatra", description: "Largest volcanic lake in the world", category: "Lake" },
  { id: "7", name: "Yogyakarta Palace", location: "Yogyakarta", description: "Javanese royal palace", category: "Cultural" },
  { id: "8", name: "Tanjung Puting", location: "Central Kalimantan", description: "Orangutan conservation area", category: "Nature" },
  { id: "9", name: "Gili Islands", location: "West Nusa Tenggara", description: "Tropical paradise islands", category: "Beach" },
  { id: "10", name: "Bandung", location: "West Java", description: "City of flowers and cool climate", category: "City" },
];

const DestinationTable = () => {
  const [destinations, setDestinations] = useState(destinationData);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  const categories = ["all", ...new Set(destinations.map(destination => destination.category))];

  const filteredDestinations = destinations.filter(
    (destination) =>
      (destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       destination.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
       destination.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "all" || destination.category === categoryFilter)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDestinations.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const deleteDestination = (id: string) => {
    setDestinations(destinations.filter((destination) => destination.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search destinations..."
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
              <TableHead>Location</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((destination) => (
              <TableRow key={destination.id}>
                <TableCell className="font-medium">{destination.name}</TableCell>
                <TableCell>{destination.location}</TableCell>
                <TableCell>{destination.description}</TableCell>
                <TableCell>{destination.category}</TableCell>
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
                      <DropdownMenuItem onClick={() => navigate(`/destinations/${destination.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/destinations/${destination.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteDestination(destination.id)}>
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
        {Array.from({ length: Math.ceil(filteredDestinations.length / itemsPerPage) }, (_, i) => (
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

export default DestinationTable;

