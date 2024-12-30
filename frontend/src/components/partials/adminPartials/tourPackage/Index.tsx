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
import { MoreHorizontal, Pencil, Trash, Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

type TourPackage = {
  id: string;
  name: string;
  destination: string;
  price: number;
  duration: string;
  status: string;
};

const tourPackages: TourPackage[] = [
  { id: "1", name: "Bali Adventure", destination: "Bali", price: 1000000, duration: "3 days", status: "available" },
  { id: "2", name: "Jakarta City Tour", destination: "Jakarta", price: 500000, duration: "1 day", status: "booked" },
  { id: "3", name: "Yogyakarta Cultural Experience", destination: "Yogyakarta", price: 750000, duration: "2 days", status: "available" },
  { id: "4", name: "Lombok Beach Getaway", destination: "Lombok", price: 1200000, duration: "4 days", status: "in_progress" },
  { id: "5", name: "Bandung Highland Tour", destination: "Bandung", price: 600000, duration: "2 days", status: "completed" },
];

const TourPackagePage = () => {
  const [packages, setPackages] = useState(tourPackages);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredPackages = packages
    .filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((pkg) => (statusFilter === "all" ? true : pkg.status === statusFilter));

  const deletePackage = (id: string) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  const updatePackageStatus = (id: string, newStatus: string) => {
    setPackages(
      packages.map((pkg) => (pkg.id === id ? { ...pkg, status: newStatus } : pkg))
    );
    setEditingStatus(null);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      available: "bg-green-100 text-green-800",
      booked: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          statusClasses[status as keyof typeof statusClasses]
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>{pkg.destination}</TableCell>
                <TableCell>
                  {pkg.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </TableCell>
                <TableCell>{pkg.duration}</TableCell>
                <TableCell>
                  {editingStatus === pkg.id ? (
                    <Select
                      value={pkg.status}
                      onValueChange={(newStatus) =>
                        updatePackageStatus(pkg.id, newStatus)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="booked">Booked</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    getStatusBadge(pkg.status)
                  )}
                </TableCell>
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
                      <DropdownMenuItem onClick={() => navigate(`/tour-packages/${pkg.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/tour-packages/${pkg.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingStatus(pkg.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Change Status
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deletePackage(pkg.id)}>
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
    </div>
  );
};

export default TourPackagePage;
