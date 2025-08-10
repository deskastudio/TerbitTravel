// booking-detail.tsx (Complete Clean Version)
"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  Download,
  Printer,
  Share2,
  Phone,
  QrCode,
  Mail,
  MessageSquare,
  Bus,
  Hotel,
  Utensils,
  AlertCircle,
  Copy,
  Info,
  ChevronRight,
  CreditCard,
  Loader2,
  RefreshCw,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TourPackageService } from "@/services/tour-package.service";
import { BookingService } from "@/services/booking.service";
import { useAuth } from "@/hooks/use-auth";
import type { ITourPackage } from "@/types/tour-package.types";
import { useToast } from "@/hooks/use-toast";
import { MidtransService } from "@/services/midtrans.service";

// Declare global Midtrans Snap interface
declare global {
  interface Window {
    snap?: {
      pay: (snapToken: string, options: any) => void;
      hide?: () => void;
    };
  }
}

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Format time
const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Status badge configuration
const getStatusConfig = (status: string) => {
  const configs = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      label: "Menunggu Pembayaran",
    },
    paid: { color: "bg-blue-100 text-blue-800", label: "Dibayar" },
    confirmed: { color: "bg-green-100 text-green-800", label: "Dikonfirmasi" },
    completed: { color: "bg-green-100 text-green-800", label: "Selesai" },
    cancelled: { color: "bg-red-100 text-red-800", label: "Dibatalkan" },
  };
  return configs[status as keyof typeof configs] || configs.pending;
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const config = getStatusConfig(status);
  return <Badge className={config.color}>{config.label}</Badge>;
};

// Contact Info Component
const ContactInfo = () => {
  const openWhatsApp = () => {
    const phone = "628123456789";
    const text = "Halo, saya membutuhkan bantuan terkait pemesanan saya.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <Phone className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-medium">Telepon</h4>
          <p className="text-sm text-muted-foreground">+62 812-3456-789</p>
          <p className="text-sm text-muted-foreground">
            Senin - Jumat, 08:00 - 17:00 WIB
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-medium">Email</h4>
          <p className="text-sm text-muted-foreground">cs@travedia.com</p>
          <p className="text-sm text-muted-foreground">Respon dalam 1x24 jam</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-medium">WhatsApp</h4>
          <p className="text-sm text-muted-foreground">+62 812-3456-789</p>
          <p className="text-sm text-muted-foreground">Layanan 24 jam</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={openWhatsApp}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

// Booking Steps Component
const BookingSteps = ({ currentStatus }: { currentStatus: string }) => {
  const getStepNumber = () => {
    switch (currentStatus) {
      case "pending":
        return 2;
      case "paid":
        return 3;
      case "confirmed":
        return 4;
      case "completed":
        return 5;
      default:
        return 1;
    }
  };

  const currentStep = getStepNumber();

  const steps = [
    { number: 1, title: "Pemesanan", description: "Paket dipilih" },
    { number: 2, title: "Pembayaran", description: "Menunggu pembayaran" },
    { number: 3, title: "Konfirmasi", description: "Pembayaran dikonfirmasi" },
    { number: 4, title: "Siap", description: "Siap berangkat" },
    { number: 5, title: "Selesai", description: "Perjalanan selesai" },
  ];

  return (
    <div className="flex justify-between items-center">
      {steps.map((step, index) => (
        <div key={step.number} className="flex flex-col items-center flex-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step.number <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step.number <= currentStep ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              step.number
            )}
          </div>
          <div className="text-center mt-2">
            <div className="text-xs font-medium">{step.title}</div>
            <div className="text-xs text-muted-foreground">
              {step.description}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`absolute top-4 w-full h-0.5 ${
                step.number < currentStep ? "bg-primary" : "bg-gray-200"
              }`}
              style={{ left: "50%", zIndex: -1 }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Main BookingDetail Component
export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [tourPackage, setTourPackage] = useState<ITourPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fetch booking data
  useEffect(() => {
    if (id) {
      fetchBookingData();
      checkPaymentSuccess();
    }
  }, [id]);

  // Check if payment was successful from localStorage
  const checkPaymentSuccess = () => {
    try {
      const paymentResult = localStorage.getItem("lastPaymentResult");
      if (paymentResult) {
        const result = JSON.parse(paymentResult);
        if (result.bookingId === id && result.status === "success") {
          console.log("🎉 Payment success detected for booking:", id);
          console.log("💳 Payment result:", result);

          // Clear the payment result to avoid showing it again
          localStorage.removeItem("lastPaymentResult");

          // Show success message
          toast({
            title: "Pembayaran Berhasil!",
            description: "E-voucher Anda siap diunduh.",
          });

          // Update booking status to 'paid'
          updateBookingStatus("paid");
        }
      }
    } catch (error) {
      console.error("Error checking payment success:", error);
    }
  };

  // Update booking status
  const updateBookingStatus = async (newStatus: string) => {
    try {
      console.log("🔄 Updating booking status to:", newStatus);
      // You can add API call here to update booking status in database
      // await BookingService.updateBookingStatus(id, newStatus);

      // For now, just update local state
      if (booking) {
        setBooking({
          ...booking,
          status: newStatus as any,
          paymentStatus: newStatus === "paid" ? "paid" : booking.paymentStatus,
        });
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const fetchBookingData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🔄 Fetching booking with ID:", id);
      const response = await BookingService.getBookingById(id!);
      console.log("📋 Booking response:", response);

      if (response.success && response.data) {
        setBooking(response.data);

        // Try to get package info if available
        if (response.data.packageInfo?.id) {
          const packageId = response.data.packageInfo.id;
          console.log("🎁 Fetching package info for:", packageId);

          try {
            const packageData = await TourPackageService.getPackageById(
              packageId
            );
            setTourPackage(packageData);
          } catch (packageError) {
            console.warn("⚠️ Failed to fetch package data:", packageError);
          }
        }
      } else {
        throw new Error(response.message || "Booking not found");
      }
    } catch (err) {
      console.error("💥 Error fetching booking data:", err);
      setError(
        err instanceof Error ? err.message : "Gagal memuat data pemesanan"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Get safe booking data with proper type handling
  const getSafeBookingData = () => {
    if (!booking) {
      return {
        orderNumber: "Loading...",
        status: "pending" as const,
        package: {
          nama: "Loading...",
          harga: 0,
          images: [] as string[],
        },
        schedule: {
          tanggalBerangkat: new Date().toISOString(),
          tanggalAkhir: new Date().toISOString(),
          waktuBerangkat: "08:00",
          waktuAkhir: "17:00",
        },
        participants: 1,
        totalPrice: 0,
        customerInfo: {
          nama: "Loading...",
          email: "loading@example.com",
          telepon: "0000000000",
        },
      };
    }

    console.log("🔍 Raw booking data:", booking);

    // Handle different response formats from API
    const safeData = {
      // Use customId from booking or fallback to bookingId/_id
      orderNumber:
        booking.customId || booking.bookingId || booking._id || "N/A",
      status: booking.status || "pending",

      // Package information
      package: {
        nama: booking.packageInfo?.nama || "Unknown Package",
        harga: booking.packageInfo?.harga || booking.harga || 0,
        images:
          tourPackage?.foto ||
          (tourPackage?.imageUrl ? [tourPackage.imageUrl] : []),
      },

      // Schedule information
      schedule: {
        tanggalBerangkat:
          booking.selectedSchedule?.tanggalAwal ||
          booking.schedule?.tanggalAwal ||
          new Date().toISOString(),
        tanggalAkhir:
          booking.selectedSchedule?.tanggalAkhir ||
          booking.schedule?.tanggalAkhir ||
          new Date().toISOString(),
        waktuBerangkat: "08:00",
        waktuAkhir: "17:00",
      },

      // Participants and pricing
      participants: booking.jumlahPeserta || 1,
      totalPrice: booking.totalAmount || booking.harga || 0,

      // Customer info
      customerInfo: booking.customerInfo || {
        nama: "N/A",
        email: "N/A",
        telepon: "N/A",
      },
    };

    console.log("✅ Processed safe booking data:", safeData);
    return safeData;
  };

  // Handle payment using MidtransService
  const handleProceedToPayment = async () => {
    if (!booking || !user) return;

    try {
      setIsProcessingPayment(true);

      // Use the actual booking ID from the fetched data - prioritize customId
      const bookingId = booking.customId || booking.bookingId || booking._id;
      console.log("💳 Processing payment for booking:", bookingId);

      // Open Midtrans payment popup
      await MidtransService.openPaymentPopup(bookingId, {
        onSuccess: (result: any) => {
          toast({
            title: "Pembayaran Berhasil!",
            description:
              "Terima kasih, pembayaran Anda telah berhasil diproses.",
          });
          fetchBookingData();
        },
        onPending: (result: any) => {
          toast({
            title: "Pembayaran Pending",
            description:
              "Pembayaran Anda sedang diproses. Silakan tunggu konfirmasi.",
            variant: "default",
          });
        },
        onError: (result: any) => {
          console.error("Payment error:", result);
          toast({
            title: "Pembayaran Gagal",
            description: "Terjadi kesalahan saat memproses pembayaran.",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Error",
        description: "Gagal memproses pembayaran. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle download e-voucher
  const handleDownloadEVoucher = () => {
    try {
      console.log("📥 Downloading e-voucher for booking:", id);

      // Create e-voucher content
      const voucherContent = `
        =============================================
                    E-VOUCHER TERBIT TRAVEL
        =============================================
        
        Booking ID: ${safeBookingData.orderNumber}
        Nama Pemesan: ${safeBookingData.customerInfo.nama}
        Email: ${safeBookingData.customerInfo.email}
        Telepon: ${safeBookingData.customerInfo.telepon}
        
        DETAIL PAKET WISATA:
        Nama Paket: ${safeBookingData.package.nama}
        Jumlah Peserta: ${safeBookingData.participants} orang
        
        JADWAL:
        Tanggal Berangkat: ${formatDate(
          safeBookingData.schedule.tanggalBerangkat
        )}
        Tanggal Pulang: ${formatDate(safeBookingData.schedule.tanggalAkhir)}
        
        PEMBAYARAN:
        Total Biaya: ${formatCurrency(safeBookingData.totalPrice)}
        Status: LUNAS
        
        CATATAN PENTING:
        - Voucher ini wajib ditunjukkan saat keberangkatan
        - Simpan voucher ini dengan baik
        - Hubungi customer service untuk perubahan jadwal
        
        Customer Service:
        Telepon: +62 814-0082-0084
        Email: travediaterbitsemesta@gmail.com
        
        Terima kasih telah mempercayai Terbit Travel!
        =============================================
      `;

      // Create and download file
      const blob = new Blob([voucherContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `E-Voucher-${safeBookingData.orderNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "E-Voucher Downloaded!",
        description: "E-voucher berhasil diunduh. Simpan file dengan baik.",
      });
    } catch (error) {
      console.error("Error downloading e-voucher:", error);
      toast({
        title: "Error",
        description: "Gagal mengunduh e-voucher. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  // Handle print functionality
  const handlePrint = () => {
    window.print();
    toast({
      title: "Mencetak...",
      description:
        "Silakan gunakan dialog print browser untuk mencetak detail booking.",
    });
  };

  // Handle share functionality
  const handleShare = async () => {
    const shareData = {
      title: `Detail Booking - ${safeBookingData.package.nama}`,
      text: `Detail pemesanan paket ${safeBookingData.package.nama} untuk ${safeBookingData.participants} orang`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Berhasil!",
          description: "Detail booking berhasil dibagikan",
        });
      } catch (error) {
        console.log("Share cancelled or failed:", error);
      }
    } else {
      // Fallback: copy URL to clipboard
      copyToClipboard(window.location.href);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Berhasil!",
        description: "Link berhasil disalin ke clipboard",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Error",
        description: "Gagal menyalin link",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Memuat detail pemesanan...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchBookingData} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const safeBookingData = getSafeBookingData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detail Pemesanan</h1>
            <p className="text-muted-foreground">
              Order ID: {safeBookingData.orderNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Status Pemesanan</CardTitle>
                  <StatusBadge status={safeBookingData.status} />
                </div>
              </CardHeader>
              <CardContent>
                <BookingSteps currentStatus={safeBookingData.status} />
              </CardContent>
            </Card>

            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Paket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  {safeBookingData.package.images &&
                    safeBookingData.package.images[0] && (
                      <img
                        src={safeBookingData.package.images[0]}
                        alt={safeBookingData.package.nama}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {safeBookingData.package.nama}
                    </h3>
                    <p className="text-2xl font-bold text-primary mt-2">
                      {formatCurrency(safeBookingData.package.harga)}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Schedule Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Tanggal Berangkat</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(safeBookingData.schedule.tanggalBerangkat)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Waktu Berangkat</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(safeBookingData.schedule.waktuBerangkat)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Jumlah Peserta</p>
                      <p className="text-sm text-muted-foreground">
                        {safeBookingData.participants} orang
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Total Pembayaran</p>
                      <p className="text-sm font-bold text-primary">
                        {formatCurrency(safeBookingData.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {safeBookingData.status === "pending" && (
                  <Button
                    className="w-full"
                    onClick={handleProceedToPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Lanjutkan Pembayaran
                      </>
                    )}
                  </Button>
                )}

                {/* E-voucher Actions for Paid/Confirmed Bookings */}
                {(safeBookingData.status === "paid" ||
                  safeBookingData.status === "confirmed") && (
                  <>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 mb-2"
                      onClick={() => navigate(`/e-voucher/${id}`)}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Lihat E-Voucher
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleDownloadEVoucher}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download E-Voucher
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Cetak Detail
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan Detail
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Butuh Bantuan?</CardTitle>
                <CardDescription>
                  Tim customer service kami siap membantu Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactInfo />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
