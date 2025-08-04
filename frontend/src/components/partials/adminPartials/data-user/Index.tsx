import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "@/utils/image-helper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Loader2,
  Search,
  MoreHorizontal,
  Trash,
  Eye,
  Plus,
  FilterX,
  SlidersHorizontal,
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import { useUser } from "@/hooks/use-user";

const ITEMS_PER_PAGE = 8;

const UserIndex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const { users, loading, error, deleteUser, isDeleting } = useUser({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Memoized values for stats
  const { totalUsers, verifiedUsers, unverifiedUsers, incompleteUsers } =
    useMemo(() => {
      if (!users?.length) {
        return {
          totalUsers: 0,
          verifiedUsers: 0,
          unverifiedUsers: 0,
          incompleteUsers: 0,
        };
      }

      return {
        totalUsers: users.length,
        verifiedUsers: users.filter((u) => u.status === "verified").length,
        unverifiedUsers: users.filter((u) => u.status === "unverified").length,
        incompleteUsers: users.filter((u) => u.status === "incomplete_profile")
          .length,
      };
    }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return (
      users?.filter((user) => {
        const matchesSearch =
          user.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.instansi?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || user.status === statusFilter;

        return matchesSearch && matchesStatus;
      }) || []
    );
  }, [users, searchTerm, statusFilter]);

  // Check if filters are active
  useEffect(() => {
    setIsFilterActive(statusFilter !== "all");
  }, [statusFilter]);

  const resetFilters = () => {
    setStatusFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
    setIsFilterActive(false);
  };

  // Pagination
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId) {
      await deleteUser(selectedUserId);
      setIsDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "unverified":
        return "bg-yellow-100 text-yellow-800";
      case "incomplete_profile":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "verified":
        return "Terverifikasi";
      case "unverified":
        return "Belum Verifikasi";
      case "incomplete_profile":
        return "Profil Tidak Lengkap";
      default:
        return "Tidak Diketahui";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            User Management
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola semua data pengguna dan akun user
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/user/add")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Tambah User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalUsers}
                </div>
                <div className="text-sm text-gray-600">Total User</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {verifiedUsers}
                </div>
                <div className="text-sm text-gray-600">Terverifikasi</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <UserX className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {unverifiedUsers}
                </div>
                <div className="text-sm text-gray-600">Belum Verifikasi</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Search className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredUsers.length}
                </div>
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
                placeholder="Cari nama, email, atau instansi..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {isFilterActive && (
                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter User</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Status Verifikasi
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={handleStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="verified">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-green-600" />
                            Terverifikasi
                          </div>
                        </SelectItem>
                        <SelectItem value="unverified">
                          <div className="flex items-center gap-2">
                            <UserX className="h-4 w-4 text-yellow-600" />
                            Belum Verifikasi
                          </div>
                        </SelectItem>
                        <SelectItem value="incomplete_profile">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-red-600" />
                            Profil Tidak Lengkap
                          </div>
                        </SelectItem>
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
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar User</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="text-center text-red-500 py-8">{error.message}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>User</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Instansi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bergabung</TableHead>
                    <TableHead className="text-right w-20">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-4xl">👥</div>
                          <p className="text-gray-500">
                            Tidak ada user yang ditemukan
                          </p>
                          <p className="text-sm text-gray-400">
                            Coba ubah filter pencarian Anda
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((user) => (
                      <TableRow key={user._id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {user.foto ? (
                              <div className="w-10 h-10 relative overflow-hidden rounded-full bg-gray-100">
                                <img
                                  src={getImageUrl(user.foto)}
                                  alt={user.nama}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.nama}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user._id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Mail className="h-3 w-3" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span className="text-sm">{user.noTelp}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Building className="h-3 w-3" />
                            <span className="text-sm">
                              {user.instansi || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs ${getStatusVariant(
                              user.status || "unverified"
                            )}`}
                          >
                            {getStatusLabel(user.status || "unverified")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "-"}
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
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/admin/user/${user._id}`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat detail
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(user._id)}
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
          )}
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
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak
              dapat dibatalkan dan akan menghapus semua data terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghapus...
                </>
              ) : (
                "Ya, Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserIndex;
