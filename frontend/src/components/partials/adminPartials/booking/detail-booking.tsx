import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Building, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Edit,
  Eye,
  Star,
  DollarSign,
  Package,
  Loader2,
  CreditCard,
  AlertCircle,
  Download,
  Send,
  RefreshCw,
  Ticket,
  Users,
  FileText,
  MessageSquare
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Tambahkan interface untuk voucher yang mungkin missing
interface IVoucherData {
  bookingId: string;
  voucherCode: string;
  qrCode: string;
  validUntil: string;
  customerName: string;
  packageName: string;
  participantCount: number;
  totalAmount: number;
  voucherUrl?: string;
}

// Extend IBooking interface untuk field yang mungkin missing
interface ExtendedBooking extends IBooking {
  voucherGeneratedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

const DetailBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<ExtendedBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{ action: string; data?: any } | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await BookingAdminService.getBookingById(id!);
        if (response.success && response.data) {
          setBooking(response.data);
        } else {
          throw new Error(response.message || "Booking not found");
        }
      } catch (error: any) {
        console.error("Error fetching booking:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Gagal mengambil detail pemesanan"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) fetchBooking();
  }, [id, toast]);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleActionClick = (action: string, data?: any) => {
    setSelectedAction({ action, data });
    setIsActionDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAction || !booking) return;

    const { action } = selectedAction;

    try {
      setIsUpdating(true);
      let result;

      switch (action) {
        case "confirm":
          result = await BookingAdminService.confirmPayment(booking._id);
          break;
        case "cancel":
          result = await BookingAdminService.cancelBooking(booking._id, "Dibatalkan oleh admin");
          break;
        case "generate-voucher":
          result = await BookingAdminService.generateVoucher(booking._id);
          break;
        case "check-payment":
          result = await BookingAdminService.checkPaymentStatus(booking._id);
          break;
        case "send-reminder":
          await BookingAdminService.sendBookingReminder(booking._id);
          break;
        default:
          break;
      }

      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success && 'data' in result && result.data) {
          setBooking(result.data as IBooking);
        }
      }

      // Refresh booking data
      const refreshResponse = await BookingAdminService.getBookingById(booking._id);
      if (refreshResponse.success && refreshResponse.data) {
        setBooking(refreshResponse.data);
      }

    } catch (error: any) {
      console.error("Action failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal melakukan aksi"
      });
    } finally {
      setIsUpdating(false);
      setIsActionDialogOpen(false);
      setSelectedAction(null);
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
      default:
        return "melakukan aksi";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat detail pemesanan...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold mb-2">Pemesanan Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">Pemesanan yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Button onClick={() => navigate("/admin/booking")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Button 
              variant="link" 
              onClick={() => navigate("/admin/booking")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Booking Management
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Detail Pemesanan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{booking.bookingId}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {booking.customerInfo?.nama}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-500" />
              {booking.jumlahPeserta} orang
            </Badge>
            <Badge className={`flex items-center gap-1 ${getStatusVariant(booking.status)}`}>
              <Package className="w-3 h-3" />
              {booking.status}
            </Badge>
            <Badge className={`flex items-center gap-1 ${getPaymentStatusVariant(booking.paymentStatus)}`}>
              <CreditCard className="w-3 h-3" />
              {booking.paymentStatus}
            </Badge>
            <Badge variant="default" className="flex items-center gap-1 bg-green-600">
              <DollarSign className="w-3 h-3" />
              {formatPrice(booking.totalHarga || booking.harga)}
            </Badge>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                Aksi
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi Pemesanan</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {booking.status === "pending_verification" && (
                <DropdownMenuItem onClick={() => handleActionClick("confirm")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Konfirmasi Pembayaran
                </DropdownMenuItem>
              )}
              
              {booking.status === "confirmed" && !booking.voucherGenerated && (
                <DropdownMenuItem onClick={() => handleActionClick("generate-voucher")}>
                  <Ticket className="mr-2 h-4 w-4" />
                  Buat E-Voucher
                </DropdownMenuItem>
              )}
              
              {booking.paymentStatus === "pending" && (
                <DropdownMenuItem onClick={() => handleActionClick("check-payment")}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Cek Status Pembayaran
                </DropdownMenuItem>
              )}
              
              {booking.status === "pending" && (
                <DropdownMenuItem onClick={() => handleActionClick("send-reminder")}>
                  <Send className="mr-2 h-4 w-4" />
                  Kirim Pengingat
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {(booking.status === "pending" || booking.status === "pending_verification") && (
                <DropdownMenuItem 
                  onClick={() => handleActionClick("cancel")}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Batalkan Pemesanan
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {booking.status === "cancelled" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Pemesanan ini telah dibatalkan. {booking.cancelReason && `Alasan: ${booking.cancelReason}`}
          </AlertDescription>
        </Alert>
      )}

      {booking.paymentStatus === "pending" && booking.status !== "cancelled" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Pembayaran masih menunggu konfirmasi. Harap pantau status pembayaran secara berkala.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Package Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-600 rounded"></div>
                Informasi Paket Wisata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{booking.packageInfo?.nama}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {booking.packageInfo?.destination}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {booking.packageInfo?.durasi}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Harga per Orang</p>
                          <p className="text-blue-700 font-semibold">{formatPrice(booking.harga)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Jumlah Peserta</p>
                          <p className="text-green-700 font-semibold">{booking.jumlahPeserta} orang</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-600 rounded"></div>
                Jadwal Perjalanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tanggal Keberangkatan</p>
                    <p className="text-purple-700 font-semibold">
                      {formatDate(booking.selectedSchedule?.tanggalAwal)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tanggal Kepulangan</p>
                    <p className="text-orange-700 font-semibold">
                      {formatDate(booking.selectedSchedule?.tanggalAkhir)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-green-600 rounded"></div>
                Informasi Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nama Lengkap</p>
                      <p className="text-blue-700 font-semibold">{booking.customerInfo?.nama}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-green-700 font-semibold">{booking.customerInfo?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nomor Telepon</p>
                      <p className="text-purple-700 font-semibold">{booking.customerInfo?.telepon}</p>
                    </div>
                  </div>
                  
                  {booking.customerInfo?.instansi && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Building className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Instansi</p>
                        <p className="text-orange-700 font-semibold">{booking.customerInfo.instansi}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {booking.customerInfo?.alamat && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Alamat</p>
                  <p className="text-gray-900">{booking.customerInfo.alamat}</p>
                </div>
              )}
              
              {booking.customerInfo?.catatan && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Catatan Khusus
                  </p>
                  <p className="text-gray-900">{booking.customerInfo.catatan}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-yellow-600 rounded"></div>
                Informasi Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status Pembayaran</label>
                      <Badge className={`${getPaymentStatusVariant(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                    
                    {booking.paymentMethod && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                        <p className="text-gray-900 font-medium capitalize">
                          {booking.paymentMethod.replace('_', ' ')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Pembayaran</label>
                      <p className="text-2xl font-bold text-green-600">
                        {formatPrice(booking.totalHarga || booking.harga)}
                      </p>
                    </div>
                    
                    {booking.paymentDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pembayaran</label>
                        <p className="text-gray-900 font-medium">
                          {formatDateTime(booking.paymentDate)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Harga per orang</p>
                    <p className="font-medium">{formatPrice(booking.harga)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Jumlah peserta</p>
                    <p className="font-medium">{booking.jumlahPeserta} orang</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-bold text-green-600">{formatPrice(booking.totalHarga || booking.harga)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voucher Information */}
          {booking.voucherGenerated && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-indigo-600 rounded"></div>
                  Informasi E-Voucher
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Ticket className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Kode Voucher</p>
                    <p className="text-xl font-bold text-indigo-700">{booking.voucherCode}</p>
                    <p className="text-sm text-gray-600 mt-1">E-voucher telah dibuat dan dapat digunakan</p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-600 rounded"></div>
                Ringkasan Pemesanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {booking.bookingId}
                </div>
                <p className="text-sm text-gray-600">ID Pemesanan</p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={getStatusVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pembayaran</span>
                  <Badge className={getPaymentStatusVariant(booking.paymentStatus)}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">E-Voucher</span>
                  <span className="text-sm font-medium">
                    {booking.voucherGenerated ? (
                      <Badge className="bg-green-100 text-green-800">Sudah dibuat</Badge>
                    ) : (
                      <Badge variant="outline">Belum dibuat</Badge>
                    )}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {formatPrice(booking.totalHarga || booking.harga)}
                </div>
                <p className="text-sm text-gray-600">Total Pembayaran</p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-600 rounded"></div>
                Timeline Pemesanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Pemesanan Dibuat</p>
                    <p className="text-xs text-gray-600">{formatDateTime(booking.createdAt)}</p>
                  </div>
                </div>
                
                {booking.paymentDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Pembayaran Diterima</p>
                      <p className="text-xs text-gray-600">{formatDateTime(booking.paymentDate)}</p>
                    </div>
                  </div>
                )}
                
                {booking.voucherGenerated && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">E-Voucher Dibuat</p>
                      <p className="text-xs text-gray-600">
                        {booking.voucherGeneratedAt ? formatDateTime(booking.voucherGeneratedAt) : 'Tanggal tidak tersedia'}
                      </p>
                    </div>
                  </div>
                )}
                
                {booking.status === "cancelled" && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Pemesanan Dibatalkan</p>
                      <p className="text-xs text-gray-600">
                        {booking.cancelledAt ? formatDateTime(booking.cancelledAt) : formatDateTime(booking.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-green-600 rounded"></div>
                Kontak Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <a 
                    href={`mailto:${booking.customerInfo?.email}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {booking.customerInfo?.email}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <a 
                    href={`tel:${booking.customerInfo?.telepon}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {booking.customerInfo?.telepon}
                  </a>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`mailto:${booking.customerInfo?.email}`, '_blank')}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Kirim Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://wa.me/${booking.customerInfo?.telepon?.replace(/[^0-9]/g, '')}`, '_blank')}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-orange-600 rounded"></div>
                Statistik Pemesanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{booking.jumlahPeserta}</div>
                  <div className="text-sm text-gray-600">Peserta</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {booking.packageInfo?.durasi?.split(' ')[0] || 0}
                  </div>
                  <div className="text-sm text-gray-600">Hari</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(booking.harga).slice(0, -3)}
                  </div>
                  <div className="text-sm text-gray-600">Per Orang</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.ceil((new Date(booking.selectedSchedule?.tanggalAwal || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-gray-600">Hari Lagi</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Details Quick View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-indigo-600 rounded"></div>
                Detail Paket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket</label>
                  <p className="text-gray-900 font-medium">{booking.packageInfo?.nama}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destinasi</label>
                  <p className="text-gray-700">{booking.packageInfo?.destination}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi</label>
                  <p className="text-gray-700">{booking.packageInfo?.durasi}</p>
                </div>
                {booking.packageInfo?.armada && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transportasi</label>
                    <p className="text-gray-700">
                      {booking.packageInfo.armada.nama} - Kapasitas {booking.packageInfo.armada.kapasitas} orang
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-red-600 rounded"></div>
                Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {booking.voucherGenerated && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Implementation for downloading voucher
                      toast({
                        title: "Download E-Voucher",
                        description: "Fitur download e-voucher akan segera tersedia"
                      });
                    }}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download E-Voucher
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(booking.bookingId);
                    toast({
                      title: "Tersalin!",
                      description: "ID Booking telah disalin ke clipboard"
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Copy Booking ID
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    toast({
                      title: "Tersalin!",
                      description: "Link detail booking telah disalin"
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Aksi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin {selectedAction ? getActionText(selectedAction.action) : ""}? 
              {selectedAction?.action === "cancel" && " Tindakan ini tidak dapat dibatalkan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              className={selectedAction?.action === "cancel" 
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

export default DetailBooking;