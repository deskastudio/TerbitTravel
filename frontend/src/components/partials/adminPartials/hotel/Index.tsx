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
import { MoreHorizontal, Pencil, Trash, Eye, Search, Star } from 'lucide-react';
import { useNavigate } from "react-router-dom";

type Hotel = {
  id: string;
  name: string;
  address: string;
  stars: number;
  price: number;
  category: string;
};

const hotelData: Hotel[] = [
  { id: "1", name: "Luxury Resort", address: "Bali", stars: 5, price: 2000000, category: "Resort" },
  { id: "2", name: "City Center Hotel", address: "Jakarta", stars: 4, price: 1000000, category: "Business" },
  { id: "3", name: "Beach Villa", address: "Lombok", stars: 4, price: 1500000, category: "Villa" },
  { id: "4", name: "Mountain Lodge", address: "Bandung", stars: 3, price: 800000, category: "Lodge" },
  { id: "5", name: "Budget Inn", address: "Yogyakarta", stars: 2, price: 300000, category: "Budget" },
  { id: "6", name: "Eco Resort", address: "Sumatra", stars: 4, price: 1200000, category: "Eco" },
  { id: "7", name: "Boutique Hotel", address: "Surabaya", stars: 4, price: 1100000, category: "Boutique" },
  { id: "8", name: "Family Resort", address: "Bali", stars: 5, price: 1800000, category: "Resort" },
  { id: "9", name: "Business Hotel", address: "Jakarta", stars: 3, price: 750000, category: "Business" },
  { id: "10", name: "Beachfront Resort", address: "Bintan", stars: 5, price: 2500000, category: "Resort" },
];

const HotelTable = () => {
  const [hotels, setHotels] = useState(hotelData);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [starFilter, setStarFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  const categories = ["all", ...new Set(hotels.map(hotel => hotel.category))];
  const stars = ["all", "1", "2", "3", "4", "5"];

  const filteredHotels = hotels.filter(
    (hotel) =>
      (hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       hotel.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "all" || hotel.category === categoryFilter) &&
      (starFilter === "all" || hotel.stars === parseInt(starFilter))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const deleteHotel = (id: string) => {
    setHotels(hotels.filter((hotel) => hotel.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search hotels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <div className="flex space-x-2">
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
          <Select value={starFilter} onValueChange={setStarFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by stars" />
            </SelectTrigger>
            <SelectContent>
              {stars.map((star) => (
                <SelectItem key={star} value={star}>
                  {star === "all" ? "All Stars" : `${star} Star${parseInt(star) > 1 ? 's' : ''}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Stars</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((hotel) => (
              <TableRow key={hotel.id}>
                <TableCell className="font-medium">{hotel.name}</TableCell>
                <TableCell>{hotel.address}</TableCell>
                <TableCell>
                  <div className="flex">
                    {Array.from({ length: hotel.stars }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {hotel.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </TableCell>
                <TableCell>{hotel.category}</TableCell>
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
                      <DropdownMenuItem onClick={() => navigate(`/hotels/${hotel.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/hotels/${hotel.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteHotel(hotel.id)}>
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
        {Array.from({ length: Math.ceil(filteredHotels.length / itemsPerPage) }, (_, i) => (
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

export default HotelTable;

