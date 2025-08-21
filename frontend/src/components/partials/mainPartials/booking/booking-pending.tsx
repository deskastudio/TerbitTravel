// booking-pending.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
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

// Komponen untuk menampilkan status pembayaran dengan indikator visual
const PaymentStatusBadge = ({
  status,
  isChecking,
}: {
  status: string;
  isChecking: boolean;
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "settlement":
      case "capture":
        return {
          color: "bg-green-100 text-green-700 border-green-200",
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Pembayaran Berhasil",
          description: "Transaksi telah dikonfirmasi",
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: <Clock className="h-4 w-4" />,
          text: "Menunggu Pembayaran",
          description: "Pembayaran sedang diproses",
        };
      case "deny":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: <XCircle className="h-4 w-4" />,
          text: "Pembayaran Ditolak",
          description: "Transaksi ditolak oleh bank",
        };
      case "cancel":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: <XCircle className="h-4 w-4" />,
          text: "Pembayaran Dibatalkan",
          description: "Transaksi dibatalkan",
        };
      case "expire":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: <XCircle className="h-4 w-4" />,
          text: "Pembayaran Kadaluarsa",
          description: "Batas waktu pembayaran telah habis",
        };
      case "failure":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: <XCircle className="h-4 w-4" />,
          text: "Pembayaran Gagal",
          description: "Transaksi tidak dapat diproses",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <Info className="h-4 w-4" />,
          text: "Status Tidak Diketahui",
          description: "Mohon hubungi customer service",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="space-y-2">
      <Badge
        className={`${config.color} flex items-center gap-2 text-sm px-3 py-2`}
      >
        {isChecking ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          config.icon
        )}
        {config.text}
      </Badge>
      <p className="text-sm text-muted-foreground">{config.description}</p>
    </div>
  );
};

// Komponen progress indikator
const PollingProgress = ({
  isActive,
  checkCount,
  maxChecks,
}: {
  isActive: boolean;
  checkCount: number;
  maxChecks: number;
}) => {
  const progress = (checkCount / maxChecks) * 100;

  if (!isActive) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Mengecek status otomatis...</span>
        <span>
          {checkCount}/{maxChecks}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default function BookingPending() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isManualChecking, setIsManualChecking] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [bookingStatus, setBookingStatus] = useState<string>("pending");
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [canAccessVoucher, setCanAccessVoucher] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  // Polling management
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [checkCount, setCheckCount] = useState(0);
  const [isPollingActive, setIsPollingActive] = useState(true);
  const maxChecks = 120; // 120 checks × 10 seconds = 20 menit
  const pollInterval = 10000; // 10 detik

  // Fungsi untuk mengecek status pembayaran
  const checkPaymentStatus = useCallback(
    async (showLoading = false) => {
      if (!bookingId) return;

      try {
        if (showLoading) setIsManualChecking(true);

        console.log("🔍 Checking payment status for booking:", bookingId);

        const response = await BookingService.getPaymentStatus(bookingId);

        if (response.success && response.data) {
          const {
            paymentStatus: newPaymentStatus,
            status: newBookingStatus,
            canAccessVoucher: newCanAccessVoucher,
            paymentMethod: newPaymentMethod,
          } = response.data;

          // Update state
          setPaymentStatus(newPaymentStatus);
          setBookingStatus(newBookingStatus);
          setCanAccessVoucher(newCanAccessVoucher);
          setPaymentMethod(newPaymentMethod);
          setLastChecked(new Date());
          setError(null);

          console.log("✅ Status updated:", {
            paymentStatus: newPaymentStatus,
            bookingStatus: newBookingStatus,
            canAccessVoucher: newCanAccessVoucher,
          });

          // Handle status berdasarkan hasil
          if (
            newPaymentStatus === "settlement" ||
            newPaymentStatus === "capture"
          ) {
            // Pembayaran berhasil
            setIsPollingActive(false);

            toast({
              title: "Pembayaran Berhasil!",
              description: "Anda akan dialihkan ke halaman E-Voucher",
            });

            setTimeout(() => {
              navigate(`/e-voucher/${bookingId}`);
            }, 2000);
          } else if (
            ["deny", "cancel", "expire", "failure"].includes(newPaymentStatus)
          ) {
            // Pembayaran gagal
            setIsPollingActive(false);

            if (showLoading) {
              toast({
                variant: "destructive",
                title: "Pembayaran Gagal",
                description: "Silakan coba lagi atau hubungi customer service",
              });
            }
          }

          // Increment check count untuk polling
          setCheckCount((prev) => prev + 1);
        } else {
          throw new Error(
            response.message || "Gagal mengecek status pembayaran"
          );
        }
      } catch (error: any) {
        console.error("❌ Error checking payment status:", error);

        if (showLoading) {
          setError(error.message || "Gagal mengecek status pembayaran");
          toast({
            variant: "destructive",
            title: "Gagal mengecek status",
            description: "Silakan coba lagi nanti",
          });
        }
      } finally {
        if (showLoading) setIsManualChecking(false);
      }
    },
    [bookingId, navigate, toast]
  );

  // Fungsi untuk mendapatkan data booking detail
  const fetchBookingData = useCallback(async () => {
    if (!bookingId) return;

    try {
      setIsLoading(true);
      const response = await BookingService.getBookingById(bookingId);

      if (response.success && response.data) {
        setBookingData(response.data);
        setPaymentStatus(response.data.paymentStatus || "pending");
        setBookingStatus(response.data.status || "pending");
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
      // Fallback ke localStorage jika API gagal
      const lastBooking = localStorage.getItem("lastBooking");
      if (lastBooking) {
        const parsedBooking = JSON.parse(lastBooking);
        if (parsedBooking.bookingId === bookingId) {
          setBookingData(parsedBooking);
          setPaymentStatus(parsedBooking.paymentStatus || "pending");
          setBookingStatus(parsedBooking.status || "pending");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  // Setup polling dan initial data fetch
  useEffect(() => {
    fetchBookingData();
  }, [fetchBookingData]);

  // Setup polling untuk payment status
  useEffect(() => {
    if (!bookingId || !isPollingActive) return;

    // Initial check
    checkPaymentStatus(false);

    // Setup interval
    intervalRef.current = setInterval(() => {
      if (checkCount >= maxChecks) {
        setIsPollingActive(false);
        console.log("⏰ Polling stopped: max checks reached");
        return;
      }

      checkPaymentStatus(false);
    }, pollInterval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [bookingId, isPollingActive, checkCount, checkPaymentStatus, maxChecks]);

  // Manual refresh handler
  const handleManualRefresh = () => {
    setCheckCount(0); // Reset counter
    setIsPollingActive(true); // Restart polling jika sudah stop
    checkPaymentStatus(true);
  };

  // Navigation handlers
  const handleGoToDetail = () => {
    navigate(`/booking-detail/${bookingId}`);
  };

  const handleGoToVoucher = () => {
    navigate(`/e-voucher/${bookingId}`);
  };

  const handleTryAgain = () => {
    navigate(`/booking-success/${bookingId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto"></div>
                <div className="h-6 bg-muted rounded mx-auto w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
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
        <Card className="shadow-lg border-l-4 border-l-primary">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {paymentStatus === "settlement" || paymentStatus === "capture" ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : ["deny", "cancel", "expire", "failure"].includes(
                  paymentStatus
                ) ? (
                <XCircle className="h-8 w-8 text-red-600" />
              ) : (
                <Clock className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-xl">
              {paymentStatus === "settlement" || paymentStatus === "capture"
                ? "Pembayaran Berhasil!"
                : ["deny", "cancel", "expire", "failure"].includes(
                    paymentStatus
                  )
                ? "Pembayaran Gagal"
                : "Menunggu Pembayaran"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status pembayaran */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                STATUS PEMBAYARAN
              </h3>
              <PaymentStatusBadge
                status={paymentStatus}
                isChecking={isManualChecking && !isLoading}
              />
            </div>

            <Separator />

            {/* Informasi booking */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                INFORMASI PEMESANAN
              </h3>
              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Booking ID:
                  </span>
                  <span className="font-mono text-sm">{bookingId}</span>
                </div>

                {bookingData && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Paket:
                      </span>
                      <span className="text-sm font-medium text-right max-w-[60%]">
                        {bookingData.packageInfo?.nama}
                      </span>
                    </div>
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
                  </>
                )}

                {paymentMethod && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Metode:
                    </span>
                    <span className="text-sm">{paymentMethod}</span>
                  </div>
                )}

                {lastChecked && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Terakhir dicek:
                    </span>
                    <span className="text-sm">
                      {lastChecked.toLocaleTimeString("id-ID")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress polling jika masih aktif */}
            {isPollingActive && paymentStatus === "pending" && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    PEMANTAUAN OTOMATIS
                  </h3>
                  <PollingProgress
                    isActive={isPollingActive}
                    checkCount={checkCount}
                    maxChecks={maxChecks}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Status akan diperbarui otomatis setiap{" "}
                    {pollInterval / 1000} detik
                  </p>
                </div>
              </>
            )}

            {/* Error state */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success message */}
            {(paymentStatus === "settlement" ||
              paymentStatus === "capture") && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">
                  Pembayaran Dikonfirmasi!
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Transaksi Anda telah berhasil diproses. E-Voucher sudah
                  tersedia.
                </AlertDescription>
              </Alert>
            )}

            {/* Failure message */}
            {["deny", "cancel", "expire", "failure"].includes(
              paymentStatus
            ) && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Pembayaran Tidak Berhasil</AlertTitle>
                <AlertDescription>
                  Silakan coba lagi atau hubungi customer service untuk bantuan.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-0">
            {/* Action buttons berdasarkan status */}
            {paymentStatus === "settlement" || paymentStatus === "capture" ? (
              // Pembayaran berhasil
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleGoToVoucher}
              >
                Lihat E-Voucher
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            ) : ["deny", "cancel", "expire", "failure"].includes(
                paymentStatus
              ) ? (
              // Pembayaran gagal
              <div className="w-full space-y-2">
                <Button className="w-full" onClick={handleTryAgain}>
                  Coba Bayar Lagi
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/contact")}
                >
                  Hubungi Customer Service
                </Button>
              </div>
            ) : (
              // Pembayaran pending
              <Button
                variant="outline"
                className="w-full"
                onClick={handleManualRefresh}
                disabled={isManualChecking}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isManualChecking ? "animate-spin" : ""
                  }`}
                />
                {isManualChecking ? "Mengecek..." : "Refresh Status"}
              </Button>
            )}

            {/* Detail button - always available */}
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleGoToDetail}
            >
              Lihat Detail Pemesanan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Help info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Butuh bantuan?{" "}
            <button
              onClick={() => navigate("/contact")}
              className="text-primary hover:underline"
            >
              Hubungi Customer Service
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
