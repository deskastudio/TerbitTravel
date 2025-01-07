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

type Consumption = {
  id: string;
  name: string;
  price: number;
  category: string;
  menuItems: string[];
};

const consumptionData: Consumption[] = [
  { id: "1", name: "Breakfast Buffet", price: 150000, category: "Breakfast", menuItems: ["Eggs", "Bacon", "Pancakes"] },
  { id: "2", name: "Lunch Set", price: 200000, category: "Lunch", menuItems: ["Salad", "Main Course", "Dessert"] },
  { id: "3", name: "Dinner Gala", price: 350000, category: "Dinner", menuItems: ["Appetizer", "Soup", "Main Course", "Dessert"] },
  { id: "4", name: "Snack Box", price: 50000, category: "Snack", menuItems: ["Sandwich", "Fruit", "Drink"] },
  { id: "5", name: "BBQ Night", price: 300000, category: "Special", menuItems: ["Grilled Meats", "Sides", "Drinks"] },
  { id: "6", name: "Brunch Buffet", price: 250000, category: "Brunch", menuItems: ["Pastries", "Eggs Benedict", "Fruit Platter"] },
  { id: "7", name: "Afternoon Tea", price: 180000, category: "Tea", menuItems: ["Scones", "Sandwiches", "Pastries"] },
  { id: "8", name: "Cocktail Reception", price: 400000, category: "Special", menuItems: ["Canapés", "Drinks", "Dessert Bites"] },
  { id: "9", name: "Vegan Lunch", price: 220000, category: "Lunch", menuItems: ["Salad", "Vegan Main", "Fruit Dessert"] },
  { id: "10", name: "Kids Meal", price: 100000, category: "Special", menuItems: ["Chicken Nuggets", "Fries", "Ice Cream"] },
];

const ConsumptionTable = () => {
  const [consumptions, setConsumptions] = useState(consumptionData);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  const categories = ["all", ...new Set(consumptions.map(consumption => consumption.category))];

  const filteredConsumptions = consumptions.filter(
    (consumption) =>
      (consumption.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       consumption.menuItems.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (categoryFilter === "all" || consumption.category === categoryFilter)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConsumptions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const deleteConsumption = (id: string) => {
    setConsumptions(consumptions.filter((consumption) => consumption.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search consumptions..."
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
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Menu Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((consumption) => (
              <TableRow key={consumption.id}>
                <TableCell className="font-medium">{consumption.name}</TableCell>
                <TableCell>
                  {consumption.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </TableCell>
                <TableCell>{consumption.category}</TableCell>
                <TableCell>{consumption.menuItems.join(", ")}</TableCell>
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
                      <DropdownMenuItem onClick={() => navigate(`/consumptions/${consumption.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/consumptions/${consumption.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteConsumption(consumption.id)}>
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
    </div>
  );
};

export default ConsumptionTable;

