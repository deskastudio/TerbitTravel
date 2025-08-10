// booking-success.tsx (complete)
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ArrowRight,
  Copy,
  Clock,
  Calendar,
  MapPin,
  Users,
  Download,
  Printer,
  Share2,
  CreditCard,
  Loader2,
  AlertCircle,
  Info,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TourPackageService } from "@/services/tour-package.service";
import { useAuth } from "@/hooks/use-auth";
import { useMidtransPayment } from "@/hooks/use-midtrans-payment";
import { BookingService } from "@/services/booking.service";
import type { ITourPackage } from "@/types/tour-package.types";

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format tanggal
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

// Komponen untuk menampilkan countdown
const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [progress, setProgress] = useState(100);
  const totalTime = 24 * 60 * 60;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setProgress(0);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const secondsLeft = hours * 3600 + minutes * 60 + seconds;
      const progressPercent = Math.min(
        100,
        Math.max(0, (secondsLeft / totalTime) * 100)
      );

      setTimeLeft({ hours, minutes, seconds });
      setProgress(progressPercent);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, totalTime]);

  return (
    <div className="space-y-2">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-center gap-2 text-center">
        <div className="bg-primary/10 rounded-md p-2 min-w-[60px]">
          <div className="text-2xl font-bold">
            {String(timeLeft.hours).padStart(2, "0")}
          </div>
          <div className="text-xs text-muted-foreground">Jam</div>
        </div>
        <div className="text-xl font-bold">:</div>
        <div className="bg-primary/10 rounded-md p-2 min-w-[60px]">
          <div className="text-2xl font-bold">
            {String(timeLeft.minutes).padStart(2, "0")}
          </div>
          <div className="text-xs text-muted-foreground">Menit</div>
        </div>
        <div className="text-xl font-bold">:</div>
        <div className="bg-primary/10 rounded-md p-2 min-w-[60px]">
          <div className="text-2xl font-bold">
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>
          <div className="text-xs text-muted-foreground">Detik</div>
        </div>
      </div>
    </div>
  );
};

// Komponen untuk status pembayaran
const PaymentStatusIndicator = ({
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
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: <Clock className="h-4 w-4" />,
          text: "Menunggu Pembayaran",
        };
      case "deny":
      case "cancel":
      case "expire":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: <AlertCircle className="h-4 w-4" />,
          text: "Pembayaran Gagal",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <Info className="h-4 w-4" />,
          text: "Status Tidak Diketahui",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={`${config.color} flex items-center gap-2`}>
      {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : config.icon}
      {config.text}
    </Badge>
  );
};

export default function BookingSuccess() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Use Midtrans Payment Hook
  const {
    processPayment,
    isLoadingPayment,
    openSnapMidtrans,
    checkPaymentStatus: checkMidtransStatus,
  } = useMidtransPayment();

  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingPaymentStatus, setIsCheckingPaymentStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [lastStatusCheck, setLastStatusCheck] = useState<Date>(new Date());
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const maxStatusChecks = useRef(0);

  // Payment status checking function
  const checkPaymentStatus = useCallback(
    async (showLoading = false) => {
      if (!bookingData?.bookingId) return;

      try {
        if (showLoading) setIsCheckingPaymentStatus(true);

        const statusResponse = await BookingService.getPaymentStatus(
          bookingData.bookingId
        );

        if (statusResponse.success && statusResponse.data) {
          const newStatus = statusResponse.data.paymentStatus;
          setPaymentStatus(newStatus);
          setLastStatusCheck(new Date());

          // Update booking data dengan status terbaru
          setBookingData((prev: any) => ({
            ...prev,
            paymentStatus: newStatus,
            status: statusResponse.data?.status || prev.status,
          }));

          // Jika pembayaran berhasil, redirect ke e-voucher
          if (newStatus === "settlement" || newStatus === "capture") {
            toast({
              title: "Pembayaran Berhasil!",
              description: "Anda akan dialihkan ke halaman E-Voucher",
            });

            // Stop polling
            if (statusCheckInterval.current) {
              clearInterval(statusCheckInterval.current);
              statusCheckInterval.current = null;
            }

            // Redirect ke e-voucher
            setTimeout(() => {
              navigate(`/e-voucher/${bookingData.bookingId}`);
            }, 2000);
          }

          // Jika payment expired atau cancelled
          else if (["expire", "cancel", "deny"].includes(newStatus)) {
            toast({
              variant: "destructive",
              title: "Pembayaran Gagal",
              description: "Silakan coba lagi atau hubungi customer service",
            });

            // Stop polling
            if (statusCheckInterval.current) {
              clearInterval(statusCheckInterval.current);
              statusCheckInterval.current = null;
            }
          }

          console.log(`✅ Payment status updated: ${newStatus}`);
        }
      } catch (error) {
        console.error("❌ Error checking payment status:", error);

        if (showLoading) {
          toast({
            variant: "destructive",
            title: "Gagal mengecek status",
            description: "Silakan coba lagi nanti",
          });
        }
      } finally {
        if (showLoading) setIsCheckingPaymentStatus(false);
      }
    },
    [bookingData?.bookingId, navigate, toast]
  );

  // Setup polling untuk mengecek status pembayaran
  useEffect(() => {
    if (
      !bookingData?.bookingId ||
      paymentStatus === "settlement" ||
      paymentStatus === "capture"
    ) {
      return;
    }

    // Reset counter
    maxStatusChecks.current = 0;

    // Setup interval untuk polling status (setiap 10 detik)
    statusCheckInterval.current = setInterval(() => {
      maxStatusChecks.current += 1;

      // Stop polling setelah 60 kali check (10 menit)
      if (maxStatusChecks.current >= 60) {
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current);
          statusCheckInterval.current = null;
        }
        console.log("⏰ Stopped payment status polling after 10 minutes");
        return;
      }

      checkPaymentStatus(false);
    }, 10000); // Check setiap 10 detik

    // Cleanup
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
        statusCheckInterval.current = null;
      }
    };
  }, [bookingData?.bookingId, paymentStatus, checkPaymentStatus]);

  // Ambil data booking
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setIsLoading(true);
        console.log("🔍 Fetching booking data for ID:", bookingId);

        // ✅ First, try to get booking ID from URL params
        if (!bookingId) {
          console.log("⚠️ No bookingId in URL, checking localStorage...");
          const lastBooking = localStorage.getItem("lastBooking");
          if (lastBooking) {
            const parsedBooking = JSON.parse(lastBooking);
            console.log(
              "✅ Found booking in localStorage:",
              parsedBooking.bookingId
            );
            setBookingData(parsedBooking);
            setPaymentStatus(parsedBooking.paymentStatus || "pending");

            if (parsedBooking.packageInfo && parsedBooking.packageInfo.id) {
              try {
                const packageData = await TourPackageService.getPackageById(
                  parsedBooking.packageInfo.id
                );
                setPaketWisata(packageData);
              } catch (pkgErr) {
                console.error("Error fetching package data:", pkgErr);
              }
            }

            setIsLoading(false);
            return;
          }
          throw new Error("Booking ID tidak ditemukan");
        }

        // ✅ Try API first, with better error handling
        try {
          console.log("🌐 Trying API for booking:", bookingId);
          const response = await BookingService.getBookingById(bookingId);

          if (response && response.success && response.data) {
            console.log("✅ Got booking data from API:", response.data);
            setBookingData(response.data);
            setPaymentStatus(response.data.paymentStatus || "pending");

            if (response.data.packageInfo && response.data.packageInfo.id) {
              try {
                const packageData = await TourPackageService.getPackageById(
                  response.data.packageInfo.id
                );
                setPaketWisata(packageData);
              } catch (pkgErr) {
                console.error("Error fetching package data:", pkgErr);
              }
            }
          } else {
            throw new Error("Data booking tidak ditemukan di API");
          }
        } catch (apiErr) {
          console.error("❌ API call failed:", apiErr);

          // ✅ Fallback to localStorage with more detailed logging
          console.log("🔄 Falling back to localStorage...");
          const lastBooking = localStorage.getItem("lastBooking");

          if (lastBooking) {
            const parsedBooking = JSON.parse(lastBooking);
            console.log(
              "✅ Using localStorage booking:",
              parsedBooking.bookingId
            );

            // ✅ Verify the booking ID matches
            if (
              parsedBooking.bookingId === bookingId ||
              parsedBooking._id === bookingId
            ) {
              setBookingData(parsedBooking);
              setPaymentStatus(parsedBooking.paymentStatus || "pending");

              if (parsedBooking.packageInfo && parsedBooking.packageInfo.id) {
                try {
                  const packageData = await TourPackageService.getPackageById(
                    parsedBooking.packageInfo.id
                  );
                  setPaketWisata(packageData);
                } catch (pkgErr) {
                  console.error("Error fetching package data:", pkgErr);
                }
              }
            } else {
              console.error("❌ Booking ID mismatch:", {
                urlId: bookingId,
                storageId: parsedBooking.bookingId,
              });
              throw new Error(
                `Data booking ${bookingId} tidak cocok dengan localStorage`
              );
            }
          } else {
            console.error("❌ No booking data in localStorage either");
            throw new Error("Data booking tidak ditemukan");
          }
        }
      } catch (error) {
        console.error("💥 Error in booking success page:", error);
        setError(
          `Gagal mengambil data pemesanan: ${
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message
              : String(error)
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  // Handle payment dengan navigation yang proper
  const handlePayment = useCallback(async () => {
    if (!bookingData) return;

    try {
      const devModeBypass = process.env.NODE_ENV === "development";

      // ✅ Get userId from current authenticated user if not in bookingData
      const currentUserId = bookingData.userId || user?._id;

      console.log("🔍 User info for payment:", {
        bookingUserId: bookingData.userId,
        currentUser: user,
        finalUserId: currentUserId,
      });

      // ✅ Clear any existing payment token to force new payment session
      localStorage.removeItem("midtrans_snap_token");
      localStorage.removeItem("payment_session");

      const response = await processPayment({
        bookingId: bookingData.bookingId,
        userId: currentUserId, // ✅ Use current user ID if bookingData doesn't have it
        customerInfo: bookingData.customerInfo,
        packageInfo: {
          id: bookingData.packageInfo.id,
          nama: bookingData.packageInfo.nama,
          harga: Number(bookingData.packageInfo.harga),
        },
        jumlahPeserta: Number(bookingData.jumlahPeserta),
        totalAmount: Number(bookingData.totalAmount),
      });

      if (response && response.success) {
        if (response.redirect_url) {
          window.location.href = response.redirect_url;
          return;
        } else if (response.snap_token) {
          // Use openSnapMidtrans dengan callbacks untuk navigation
          openSnapMidtrans(response.snap_token, {
            onSuccess: (result: any) => {
              toast({
                title: "Pembayaran berhasil!",
                description: "Menunggu konfirmasi sistem...",
              });

              // Start polling status setelah payment success
              setTimeout(() => {
                checkPaymentStatus(true);
              }, 2000);
            },
            onPending: (result: any) => {
              toast({
                title: "Pembayaran dalam proses",
                description: "Menunggu konfirmasi pembayaran...",
              });

              // Redirect ke pending page
              setTimeout(() => {
                navigate(`/booking-pending/${bookingData.bookingId}`);
              }, 2000);
            },
            onError: (result: any) => {
              toast({
                variant: "destructive",
                title: "Pembayaran gagal",
                description: "Silakan coba lagi atau hubungi customer service",
              });

              // Redirect ke error page
              const errorParams = new URLSearchParams({
                error: "failure",
                message: result.status_message || "Pembayaran gagal",
                payment_method: result.payment_type || "unknown",
              });

              setTimeout(() => {
                navigate(
                  `/booking-error/${
                    bookingData.bookingId
                  }?${errorParams.toString()}`
                );
              }, 2000);
            },
            onClose: () => {
              toast({
                title: "Pembayaran dibatalkan",
                description: "Anda dapat mencoba lagi nanti",
              });
            },
          });
        } else {
          throw new Error("Tidak ada token atau redirect URL dalam respons");
        }
      } else {
        throw new Error(response?.message || "Gagal memproses pembayaran");
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);

      if (process.env.NODE_ENV === "development") {
        toast({
          title: "Error Pembayaran (DEV)",
          description: "Opsi simulasi pembayaran tersedia di mode development",
        });

        if (confirm("Simulasikan pembayaran berhasil untuk testing?")) {
          navigate(`/e-voucher/${bookingData.bookingId}`);
          return;
        }
      }

      const message =
        error?.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat memproses pembayaran";
      toast({
        variant: "destructive",
        title: "Gagal memproses pembayaran",
        description: message,
      });
    }
  }, [
    bookingData,
    processPayment,
    openSnapMidtrans,
    toast,
    navigate,
    checkPaymentStatus,
  ]);

  // Copy to clipboard function
  const copyToClipboard = useCallback(
    (text: string, label?: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast({
            title: "Berhasil disalin!",
            description: `${label || "Teks"} telah disalin ke clipboard`,
          });
        })
        .catch((err) => {
          console.error("Gagal menyalin teks: ", err);
          toast({
            variant: "destructive",
            title: "Gagal menyalin",
            description: "Tidak dapat menyalin ke clipboard",
          });
        });
    },
    [toast]
  );

  // Handle download bukti pemesanan (simulasi)
  const handleDownload = useCallback(() => {
    toast({
      title: "Mengunduh bukti pemesanan",
      description: "Bukti pemesanan sedang diunduh",
    });

    setTimeout(() => {
      toast({
        title: "Berhasil diunduh!",
        description: "Bukti pemesanan telah berhasil diunduh",
      });
    }, 2000);
  }, [toast]);

  // Handle share booking
  const handleShareBooking = useCallback(async () => {
    if (!bookingData) return;

    const url = window.location.href;
    const title = "Bukti Pemesanan Paket Wisata";
    const text = `Saya telah memesan paket wisata ${bookingData.packageInfo.nama} dengan nomor booking ${bookingData.bookingId}. Mari lihat detailnya!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        copyToClipboard(url, "Link pemesanan");
      }
    } else {
      copyToClipboard(url, "Link pemesanan");
    }
  }, [bookingData, copyToClipboard]);

  // Jika masih loading, tampilkan skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-muted rounded mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
          <div className="flex justify-between mt-10 mb-10">
            <div className="h-10 w-10 bg-muted rounded-full"></div>
            <div className="h-10 w-10 bg-muted rounded-full"></div>
            <div className="h-10 w-10 bg-muted rounded-full"></div>
            <div className="h-10 w-10 bg-muted rounded-full"></div>
          </div>
          <div className="h-36 w-full bg-muted rounded mb-8"></div>
          <div className="h-72 w-full bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Data tidak ditemukan"}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/paket-wisata")}
        >
          Kembali ke Daftar Paket Wisata
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Pemesanan Berhasil!</h1>
          <p className="text-muted-foreground">
            Terima kasih telah memesan paket wisata kami. Silakan lanjutkan ke
            pembayaran untuk menyelesaikan transaksi.
          </p>
        </div>

        {/* Status monitoring card */}
        <Card className="mb-6 border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium">Status Pembayaran:</div>
                <PaymentStatusIndicator
                  status={paymentStatus}
                  isChecking={isCheckingPaymentStatus}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => checkPaymentStatus(true)}
                  disabled={isCheckingPaymentStatus}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-1 ${
                      isCheckingPaymentStatus ? "animate-spin" : ""
                    }`}
                  />
                  Refresh Status
                </Button>
              </div>
            </div>

            {lastStatusCheck && (
              <div className="text-xs text-muted-foreground mt-2">
                Terakhir dicek: {lastStatusCheck.toLocaleTimeString("id-ID")}
              </div>
            )}

            {paymentStatus === "pending" && (
              <div className="text-xs text-blue-600 mt-1">
                💡 Status akan diperbarui otomatis setiap 10 detik
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-md overflow-hidden">
          <CardHeader className="pb-3 bg-primary/5 border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Detail Pemesanan</CardTitle>
                <CardDescription>
                  Nomor Pemesanan: {bookingData.bookingId}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(bookingData.bookingId, "Nomor pemesanan")
                }
                aria-label="Salin nomor pemesanan"
              >
                <Copy className="h-4 w-4 mr-2" />
                Salin
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            {/* Package info section */}
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                <img
                  src={paketWisata?.foto?.[0]}
                  alt={bookingData.packageInfo.nama}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "";
                  }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {bookingData.packageInfo.nama}
                </h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatDate(
                        bookingData.schedule?.tanggalAwal ||
                          bookingData.selectedSchedule?.tanggalAwal
                      )}{" "}
                      -{" "}
                      {formatDate(
                        bookingData.schedule?.tanggalAkhir ||
                          bookingData.selectedSchedule?.tanggalAkhir
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {bookingData.packageInfo.destination ||
                        "Destinasi Wisata"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{bookingData.jumlahPeserta} orang</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Customer info */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal Pemesanan</span>
                <span>{formatDate(bookingData.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pemesan</span>
                <span>{bookingData.customerInfo.nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{bookingData.customerInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telepon</span>
                <span>{bookingData.customerInfo.telepon}</span>
              </div>
            </div>

            <Separator />

            {/* Price breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Harga per orang</span>
                <span>{formatCurrency(bookingData.packageInfo.harga)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah peserta</span>
                <span>x {bookingData.jumlahPeserta}</span>
              </div>
              {bookingData.metodePembayaran === "dp" && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Metode Pembayaran
                  </span>
                  <span>DP 50%</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>
                  Total {bookingData.metodePembayaran === "dp" ? "(DP)" : ""}
                </span>
                <span className="text-primary">
                  {formatCurrency(bookingData.totalAmount)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-3 bg-muted/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Unduh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-1" />
                Cetak
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareBooking}>
                <Share2 className="h-4 w-4 mr-1" />
                Bagikan
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                navigate(`/booking-detail/${bookingData.bookingId}`)
              }
            >
              Lihat Detail
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Payment section - only show if payment is still pending */}
        {paymentStatus === "pending" && (
          <Card className="mb-6 shadow-md overflow-hidden">
            <CardHeader className="pb-3 bg-primary/5 border-b">
              <CardTitle>Informasi Pembayaran</CardTitle>
              <CardDescription>
                Selesaikan pembayaran untuk mengkonfirmasi pemesanan Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Alert className="bg-amber-50 border-amber-200">
                <Clock className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">
                  Batas Waktu Pembayaran
                </AlertTitle>
                <AlertDescription className="text-amber-700">
                  <div className="mt-2 mb-3">
                    <Countdown
                      targetDate={
                        new Date(
                          bookingData.paymentDeadline ||
                            Date.now() + 24 * 60 * 60 * 1000
                        )
                      }
                    />
                  </div>
                  <div className="text-sm">
                    Harap selesaikan pembayaran sebelum batas waktu yang
                    ditentukan
                  </div>
                </AlertDescription>
              </Alert>

              <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">
                    Ringkasan Pembayaran
                  </h3>
                  <PaymentStatusIndicator
                    status={paymentStatus}
                    isChecking={isCheckingPaymentStatus}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {formatCurrency(
                        bookingData.packageInfo.harga *
                          bookingData.jumlahPeserta
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Pajak & Biaya Layanan
                    </span>
                    <span>Termasuk</span>
                  </div>
                  {bookingData.metodePembayaran === "dp" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">DP (50%)</span>
                      <span>{formatCurrency(bookingData.totalAmount)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Pembayaran</span>
                    <span className="text-primary">
                      {formatCurrency(bookingData.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="bg-primary/5 p-4 rounded-lg mb-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Pembayaran melalui Midtrans
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Anda akan diarahkan ke halaman pembayaran yang aman dengan
                      beragam metode pembayaran
                    </p>
                  </div>

                  <Button
                    className="w-full py-6 text-base font-medium"
                    onClick={handlePayment}
                    disabled={isLoadingPayment}
                  >
                    {isLoadingPayment ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Bayar Sekarang{" "}
                        <span className="font-bold ml-1">
                          {formatCurrency(bookingData.totalAmount)}
                        </span>
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
                    <div className="flex gap-1">
                      <span>🔒 Pembayaran Aman</span>
                    </div>
                    <Separator orientation="vertical" className="h-3" />
                    <div className="flex gap-1">
                      <span>⚡ Powered by Midtrans</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success message for completed payments */}
        {(paymentStatus === "settlement" || paymentStatus === "capture") && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Pembayaran Berhasil!
                </h3>
                <p className="text-green-700 mb-4">
                  Terima kasih! Pembayaran Anda telah berhasil diproses.
                </p>
                <Button
                  onClick={() =>
                    navigate(`/e-voucher/${bookingData.bookingId}`)
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  Lihat E-Voucher
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Failed payment message */}
        {["expire", "cancel", "deny"].includes(paymentStatus) && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Pembayaran Gagal
                </h3>
                <p className="text-red-700 mb-4">
                  Pembayaran tidak dapat diproses. Silakan coba lagi atau
                  hubungi customer service.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handlePayment}
                    disabled={isLoadingPayment}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Coba Lagi
                  </Button>
                  <Button
                    onClick={() => navigate("/contact")}
                    variant="outline"
                  >
                    Hubungi CS
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button variant="outline" onClick={() => navigate("/paket-wisata")}>
            Lihat Paket Wisata Lainnya
          </Button>
          <Button
            onClick={() => navigate(`/booking-detail/${bookingData.bookingId}`)}
          >
            Lihat Detail Pemesanan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
