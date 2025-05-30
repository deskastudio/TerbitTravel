// booking-error.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  XCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { BookingService } from "@/services/booking.service";
import { useMidtransPayment } from "@/hooks/use-midtrans-payment";

export default function BookingError() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { processPayment, isLoadingPayment } = useMidtransPayment();

  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("failure");

  // Get error info from URL params
  const errorType = searchParams.get("error") || "unknown";
  const errorMessage = searchParams.get("message") || "Pembayaran gagal";
  const paymentMethod = searchParams.get("payment_method");

  // Get error message based on type
  const getErrorMessage = (type: string) => {
    switch (type) {
      case "deny":
        return "Pembayaran ditolak oleh bank. Periksa saldo atau coba metode lain.";
      case "cancel":
        return "Pembayaran dibatalkan. Anda dapat mencoba lagi.";
      case "expire":
        return "Pembayaran kadaluarsa. Silakan buat pemesanan baru.";
      case "failure":
        return "Terjadi kesalahan sistem. Silakan coba lagi.";
      case "timeout":
        return "Koneksi timeout. Periksa koneksi internet dan coba lagi.";
      case "insufficient":
        return "Saldo tidak mencukupi. Coba dengan metode pembayaran lain.";
      default:
        return errorMessage;
    }
  };

  // Fetch booking data
  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) return;

      try {
        setIsLoading(true);
        const response = await BookingService.getBookingById(bookingId);

        if (response.success && response.data) {
          setBookingData(response.data);
          setPaymentStatus(response.data.paymentStatus || "failure");
        } else {
          // Fallback ke localStorage
          const lastBooking = localStorage.getItem("lastBooking");
          if (lastBooking) {
            const parsedBooking = JSON.parse(lastBooking);
            if (parsedBooking.bookingId === bookingId) {
              setBookingData(parsedBooking);
              setPaymentStatus(parsedBooking.paymentStatus || "failure");
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching booking data:", error);
        setError("Gagal mengambil data pemesanan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  // Check if payment actually succeeded (kadang error redirect salah)
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!bookingId) return;

      try {
        const statusResponse = await BookingService.getPaymentStatus(bookingId);

        if (statusResponse.success && statusResponse.data) {
          const currentStatus = statusResponse.data.paymentStatus;

          // Jika ternyata pembayaran berhasil, redirect ke voucher
          if (currentStatus === "settlement" || currentStatus === "capture") {
            toast({
              title: "Pembayaran Berhasil!",
              description: "Mengalihkan ke halaman E-Voucher...",
            });
            setTimeout(() => {
              navigate(`/e-voucher/${bookingId}`);
            }, 1500);
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    if (bookingData) {
      checkPaymentStatus();
    }
  }, [bookingData, bookingId, navigate, toast]);

  // Handle retry payment menggunakan hook
  const handleRetryPayment = async () => {
    if (!bookingData) return;

    try {
      toast({
        title: "Mempersiapkan pembayaran...",
        description: "Mohon tunggu sebentar",
      });

      // Gunakan hook untuk retry payment
      await processPayment({
        bookingId: bookingData.bookingId,
        customerInfo: bookingData.customerInfo,
        packageInfo: {
          id: bookingData.packageInfo.id,
          nama: bookingData.packageInfo.nama,
          harga: Number(bookingData.packageInfo.harga),
        },
        jumlahPeserta: Number(bookingData.jumlahPeserta),
        totalAmount: Number(bookingData.totalAmount),
      });
    } catch (error: any) {
      console.error("Error initiating retry:", error);
      toast({
        variant: "destructive",
        title: "Gagal mempersiapkan pembayaran",
        description: error.message || "Silakan coba lagi nanti",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto"></div>
                <div className="h-6 bg-muted rounded mx-auto w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg border-l-4 border-l-red-500">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-800">
              Pembayaran Gagal
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Transaksi tidak dapat diselesaikan
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error message */}
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Terjadi kesalahan pembayaran</AlertTitle>
              <AlertDescription>
                {getErrorMessage(errorType)}
                {paymentMethod && (
                  <p className="text-xs mt-2">Metode: {paymentMethod}</p>
                )}
              </AlertDescription>
            </Alert>

            {/* Booking info */}
            {bookingData && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    DETAIL PEMESANAN
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Booking ID:
                      </span>
                      <span className="font-mono text-sm">
                        {bookingData.bookingId}
                      </span>
                    </div>

                    {bookingData.packageInfo && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Paket:
                        </span>
                        <span className="text-sm font-medium text-right max-w-[60%]">
                          {bookingData.packageInfo.nama}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total:
                      </span>
                      <span className="text-sm font-semibold">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(bookingData.totalAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        {paymentStatus === "deny"
                          ? "Ditolak"
                          : paymentStatus === "cancel"
                          ? "Dibatalkan"
                          : paymentStatus === "expire"
                          ? "Kadaluarsa"
                          : "Gagal"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Contact options */}
            <Separator />
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                BUTUH BANTUAN?
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={() => window.open("tel:+6281400820084")}
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-xs">Telepon</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={() =>
                    window.open("mailto:travediaterbitsemesta@gmail.com")
                  }
                >
                  <Mail className="h-4 w-4" />
                  <span className="text-xs">Email</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={() => window.open("https://wa.me/6281400820084")}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">WhatsApp</span>
                </Button>
              </div>
            </div>

            {/* Error fallback */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-0">
            {/* Main action */}
            <Button
              className="w-full"
              onClick={handleRetryPayment}
              disabled={isLoadingPayment}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  isLoadingPayment ? "animate-spin" : ""
                }`}
              />
              {isLoadingPayment ? "Memproses..." : "Coba Bayar Lagi"}
            </Button>

            {/* Secondary actions */}
            <div className="w-full space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/booking-detail/${bookingId}`)}
              >
                Lihat Detail Pemesanan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {errorType === "expire" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/paket-wisata")}
                >
                  Buat Pemesanan Baru
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Help footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Masalah terus berlanjut?{" "}
            <button
              onClick={() => navigate("/contact")}
              className="text-primary hover:underline font-medium"
            >
              Hubungi Customer Service
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
