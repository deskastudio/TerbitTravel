import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MoreHorizontal, 
  Eye, 
  Search, 
  Loader2,
  FilterX,
  SlidersHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Send,
  Ticket,
  DollarSign,
  ShoppingCart,
  Users
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useBookingAdmin } from "@/hooks/use-booking-admin";
import { IBookingFilter, BookingStatus, PaymentStatus, PaymentMethod } from "@/types/booking.types";

const AdminBookingManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    bookings,
    stats,
    isLoading,
    isUpdating,
    isExporting,
    fetchAllBookings,
    confirmPayment,
    cancelBooking,
    generateVoucher,
    checkPaymentStatus,
    sendBookingReminder,
    exportBookings,
    deleteBooking,
  } = useBookingAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedAction, setSelectedAction] = useState<{ bookingId: string; action: string } | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<IBookingFilter>({
    status: "all",
    paymentStatus: "all",
    paymentMethod: "all",
  });
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Update filter active state
  useEffect(() => {
    setIsFilterActive(
      filters.status !== "all" ||
      filters.paymentStatus !== "all" ||
      filters.paymentMethod !== "all" ||
      !!filters.customerName ||
      !!filters.bookingId ||
      !!filters.dateRange?.start
    );
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      status: "all",
      paymentStatus: "all",
      paymentMethod: "all",
    });
    setSearchTerm("");
  };

  // Apply filters when they change
  useEffect(() => {
    const searchFilters = {
      ...filters,
      customerName: searchTerm || undefined,
    };
    fetchAllBookings(searchFilters);
  }, [filters, searchTerm, fetchAllBookings]);

  // Filtered bookings for display
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = 
        booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerInfo?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.packageInfo?.nama?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [bookings, searchTerm]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Action handlers
  const handleActionClick = (bookingId: string, action: string) => {
    setSelectedAction({ bookingId, action });
    setIsActionDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAction) return;

    const { bookingId, action } = selectedAction;

    try {
      switch (action) {
        case "confirm":
          await confirmPayment(bookingId);
          break;
        case "cancel":
          await cancelBooking(bookingId, "Dibatalkan oleh admin");
          break;
        case "generate-voucher":
          await generateVoucher(bookingId);
          break;
        case "check-payment":
          await checkPaymentStatus(bookingId);
          break;
        case "send-reminder":
          await sendBookingReminder(bookingId);
          break;
        case "delete":
          await deleteBooking(bookingId);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsActionDialogOpen(false);
      setSelectedAction(null);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusVariant = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "pending_verification":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusVariant = (status: PaymentStatus) => {
    switch (status) {
      case "settlement":
      case "capture":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "deny":
      case "cancel":
      case "expire":
      case "failure":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case "confirm":
        return "konfirmasi pembayaran";
      case "cancel":
        return "batalkan pemesanan";
      case "generate-voucher":
        return "buat e-voucher";
      case "check-payment":
        return "cek status pembayaran";
      case "send-reminder":
        return "kirim pengingat";
      case "delete":
        return "hapus pemesanan";
      default:
        return "melakukan aksi";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data pemesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pemesanan Manajemen</h1>
          <p className="text-gray-600 mt-1">Kelola semua pemesanan dan transaksi pelanggan</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => exportBookings(filters, 'excel')}
            disabled={isExporting}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
                <div className="text-sm text-gray-600">Total Booking</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.confirmedBookings}</div>
                <div className="text-sm text-gray-600">Terkonfirmasi</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue).slice(0, -3)}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
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
                placeholder="Cari booking ID, nama customer, atau paket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
                  <SheetTitle>Filter Pemesanan</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status Booking</label>
                    <Select 
                      value={filters.status || "all"} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as BookingStatus | "all" }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="pending_verification">Pending Verification</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status Pembayaran</label>
                    <Select 
                      value={filters.paymentStatus || "all"} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, paymentStatus: value as PaymentStatus | "all" }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status pembayaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="settlement">Settlement</SelectItem>
                        <SelectItem value="capture">Capture</SelectItem>
                        <SelectItem value="deny">Deny</SelectItem>
                        <SelectItem value="cancel">Cancel</SelectItem>
                        <SelectItem value="expire">Expire</SelectItem>
                        <SelectItem value="failure">Failure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Metode Pembayaran</label>
                    <Select 
                      value={filters.paymentMethod || "all"} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value as PaymentMethod | "all" }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih metode pembayaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Metode</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="gopay">GoPay</SelectItem>
                        <SelectItem value="ovo">OVO</SelectItem>
                        <SelectItem value="dana">DANA</SelectItem>
                        <SelectItem value="shopeepay">ShopeePay</SelectItem>
                        <SelectItem value="qris">QRIS</SelectItem>
                        <SelectItem value="bca_va">BCA VA</SelectItem>
                        <SelectItem value="bni_va">BNI VA</SelectItem>
                        <SelectItem value="bri_va">BRI VA</SelectItem>
                        <SelectItem value="mandiri_va">Mandiri VA</SelectItem>
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
          <CardTitle className="text-lg">Daftar Pemesanan</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead>Peserta</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl">📋</div>
                        <p className="text-gray-500">Tidak ada pemesanan yang ditemukan</p>
                        <p className="text-sm text-gray-400">Coba ubah filter pencarian Anda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((booking) => (
                    <TableRow key={booking._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{booking.bookingId}</div>
                        <div className="text-sm text-gray-500">{formatDate(booking.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{booking.customerInfo?.nama}</div>
                        <div className="text-sm text-gray-500">{booking.customerInfo?.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 truncate max-w-xs">
                          {booking.packageInfo?.nama}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.selectedSchedule?.tanggalAwal)} - {formatDate(booking.selectedSchedule?.tanggalAkhir)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{booking.jumlahPeserta} orang</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          {formatPrice(booking.totalHarga || booking.harga)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getStatusVariant(booking.status)}`}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={`text-xs ${getPaymentStatusVariant(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </Badge>
                          {booking.paymentMethod && (
                            <div className="text-xs text-gray-500">
                              {booking.paymentMethod}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatDate(booking.createdAt)}
                        </div>
                        {booking.paymentDate && (
                          <div className="text-xs text-gray-500">
                            Bayar: {formatDate(booking.paymentDate)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating}>
                              <span className="sr-only">Buka menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate(`/admin/booking/${booking._id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat detail
                            </DropdownMenuItem>
                            
                            {booking.status === "pending_verification" && (
                              <DropdownMenuItem onClick={() => handleActionClick(booking._id, "confirm")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Konfirmasi Pembayaran
                              </DropdownMenuItem>
                            )}
                            
                            {booking.status === "confirmed" && !booking.voucherGenerated && (
                              <DropdownMenuItem onClick={() => handleActionClick(booking._id, "generate-voucher")}>
                                <Ticket className="mr-2 h-4 w-4" />
                                Buat E-Voucher
                              </DropdownMenuItem>
                            )}
                            
                            {booking.paymentStatus === "pending" && (
                              <DropdownMenuItem onClick={() => handleActionClick(booking._id, "check-payment")}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Cek Status Pembayaran
                              </DropdownMenuItem>
                            )}
                            
                            {booking.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleActionClick(booking._id, "send-reminder")}>
                                <Send className="mr-2 h-4 w-4" />
                                Kirim Pengingat
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            {(booking.status === "pending" || booking.status === "pending_verification") && (
                              <DropdownMenuItem 
                                onClick={() => handleActionClick(booking._id, "cancel")}
                                className="text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Batalkan
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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

      {/* Action Confirmation Dialog */}
      <AlertDialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Aksi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin {selectedAction ? getActionText(selectedAction.action) : ""}? 
              {selectedAction?.action === "delete" && " Tindakan ini tidak dapat dibatalkan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              className={selectedAction?.action === "delete" || selectedAction?.action === "cancel" 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-blue-600 hover:bg-blue-700"
              }
            >
              Ya, {selectedAction ? getActionText(selectedAction.action) : "Lanjutkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBookingManagement;