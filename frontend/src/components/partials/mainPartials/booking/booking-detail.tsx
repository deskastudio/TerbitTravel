// booking-detail.tsx (Complete Fixed Version)
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
import { useBooking } from "@/hooks/use-booking";
import { useAuth } from "@/hooks/use-auth";
import type { ITourPackage } from "@/types/tour-package.types";
import { useToast } from "@/hooks/use-toast";

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

// Komponen untuk menampilkan langkah-langkah alur pemesanan
const BookingSteps = ({ currentStatus }: { currentStatus: string }) => {
  const getStepNumber = () => {
    switch (currentStatus) {
      case "pending":
        return 2;
      case "pending_verification":
        return 3;
      case "confirmed":
        return 4;
      case "completed":
        return 4;
      default:
        return 2;
    }
  };

  const currentStep = getStepNumber();

  return (
    <div className="mb-8 relative">
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
            <CheckCircle className="h-5 w-5" />
          </div>
          <span className="text-xs mt-2 text-center">Pemesanan</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 2
                ? "bg-green-100 text-green-600"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep >= 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
          </div>
          <span className="text-xs mt-2 text-center">Detail</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 3
                ? currentStep === 3 && currentStatus === "pending_verification"
                  ? "bg-primary text-primary-foreground"
                  : "bg-green-100 text-green-600"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 3 ? <CheckCircle className="h-5 w-5" /> : "3"}
          </div>
          <span className="text-xs mt-2 text-center">Pembayaran</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 4
                ? "bg-green-100 text-green-600"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep >= 4 ? <CheckCircle className="h-5 w-5" /> : "4"}
          </div>
          <span className="text-xs mt-2 text-center">E-Voucher</span>
        </div>
      </div>

      {/* Connector lines */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
        <div
          className="h-full bg-primary transition-all duration-1000"
          style={{
            width:
              currentStep === 2
                ? "33%"
                : currentStep === 3
                ? "66%"
                : currentStep >= 4
                ? "100%"
                : "0%",
          }}
        ></div>
      </div>
    </div>
  );
};

// Status pemesanan
type BookingStatus =
  | "pending"
  | "pending_verification"
  | "confirmed"
  | "completed"
  | "cancelled";
type PaymentStatus =
  | "pending"
  | "settlement"
  | "capture"
  | "deny"
  | "cancel"
  | "expire";

// Komponen untuk menampilkan status pemesanan
const BookingStatusBadge = ({ status }: { status: BookingStatus }) => {
  const statusConfig = {
    pending: {
      label: "Menunggu Pembayaran",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    pending_verification: {
      label: "Verifikasi Pembayaran",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    confirmed: {
      label: "Pembayaran Dikonfirmasi",
      color: "bg-green-500 hover:bg-green-600",
    },
    completed: {
      label: "Perjalanan Selesai",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    cancelled: { label: "Dibatalkan", color: "bg-red-500 hover:bg-red-600" },
  };

  const config = statusConfig[status];

  return <Badge className={config.color}>{config.label}</Badge>;
};

// Komponen untuk menampilkan informasi kontak
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

export default function BookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { getBookingById } = useBooking();
  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // ✅ HELPER FUNCTION: Safe data access dengan default values
  const getSafeBookingData = () => {
    if (!bookingData) return null;

    return {
      ...bookingData,
      bookingId: bookingData.bookingId || bookingData.customId || "Unknown",
      packageInfo: {
        id: bookingData.packageInfo?.id || "",
        nama: bookingData.packageInfo?.nama || "Tour Package",
        harga: bookingData.packageInfo?.harga || 0,
        destination:
          bookingData.packageInfo?.destination || "Unknown Destination",
        ...bookingData.packageInfo,
      },
      customerInfo: {
        nama: bookingData.customerInfo?.nama || "Unknown Customer",
        email: bookingData.customerInfo?.email || "",
        telepon: bookingData.customerInfo?.telepon || "",
        alamat: bookingData.customerInfo?.alamat || "",
        instansi: bookingData.customerInfo?.instansi || "",
        catatan: bookingData.customerInfo?.catatan || "",
        ...bookingData.customerInfo,
      },
      selectedSchedule: bookingData.selectedSchedule || {
        tanggalAwal: new Date().toISOString(),
        tanggalAkhir: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      schedule: bookingData.schedule || {
        tanggalAwal: new Date().toISOString(),
        tanggalAkhir: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      jumlahPeserta: bookingData.jumlahPeserta || 1,
      totalAmount:
        bookingData.totalAmount ||
        bookingData.harga ||
        bookingData.packageInfo?.harga ||
        0,
      status: bookingData.status || "pending",
      paymentStatus: bookingData.paymentStatus || "pending",
      paymentMethod: bookingData.paymentMethod || "",
      paymentDate: bookingData.paymentDate || null,
      bookingDate:
        bookingData.bookingDate ||
        bookingData.createdAt ||
        new Date().toISOString(),
      createdAt: bookingData.createdAt || new Date().toISOString(),
    };
  };

  // Polling untuk status pembayaran
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    const safeBookingData = getSafeBookingData();

    if (safeBookingData && safeBookingData.status === "pending_verification") {
      intervalId = setInterval(async () => {
        try {
          console.log("🔄 Checking payment status...");
          const updatedBooking = await BookingService.getBookingById(
            bookingId!
          );

          if (updatedBooking.success && updatedBooking.data) {
            const newStatus = updatedBooking.data.status;

            if (newStatus !== safeBookingData.status) {
              console.log(
                `✅ Status updated: ${safeBookingData.status} -> ${newStatus}`
              );
              setBookingData(updatedBooking.data);

              if (newStatus === "confirmed") {
                toast({
                  title: "Pembayaran Berhasil!",
                  description:
                    "Pembayaran Anda telah dikonfirmasi. E-voucher sudah tersedia.",
                });
              }
            }
          }
        } catch (error) {
          console.error("❌ Error checking payment status:", error);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [bookingData?.status, bookingId, toast]);

  // Ambil data booking dan paket wisata
  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setIsLoading(true);

        if (!bookingId) {
          throw new Error("ID booking tidak ditemukan");
        }

        // Handle jika datang dari payment success
        const urlParams = new URLSearchParams(window.location.search);
        const isFromPayment = urlParams.get("payment_success") === "true";
        const transactionStatus = urlParams.get("transaction_status");

        console.log("📦 Fetching booking detail for:", bookingId);

        // Coba ambil data booking dari API
        try {
          const bookingDetail = await BookingService.getBookingById(bookingId);

          if (bookingDetail.success && bookingDetail.data) {
            let updatedBooking = bookingDetail.data;

            // Update status berdasarkan parameter URL dari Midtrans
            if (isFromPayment && transactionStatus) {
              if (
                transactionStatus === "settlement" ||
                transactionStatus === "capture"
              ) {
                updatedBooking.status = "confirmed";
                updatedBooking.paymentStatus = "settlement";
                (updatedBooking as any).paymentDate = new Date().toISOString();

                toast({
                  title: "Pembayaran Berhasil!",
                  description:
                    "Pembayaran Anda telah dikonfirmasi. E-voucher sudah tersedia.",
                });
              } else if (transactionStatus === "pending") {
                updatedBooking.status = "pending_verification";
                updatedBooking.paymentStatus = "pending";
              }
            }

            setBookingData(updatedBooking);

            // Jika ada ID paket, ambil detail paket
            if (updatedBooking.packageInfo && updatedBooking.packageInfo.id) {
              try {
                const packageData = await TourPackageService.getPackageById(
                  updatedBooking.packageInfo.id
                );
                setPaketWisata(packageData);
              } catch (packageError) {
                console.error("❌ Error fetching package:", packageError);
                // Continue without package details
              }
            }

            return;
          }
        } catch (err) {
          console.error("❌ Error fetching booking from API:", err);

          // Fallback ke localStorage
          const lastBooking = localStorage.getItem("lastBooking");
          if (lastBooking) {
            try {
              const parsedBooking = JSON.parse(lastBooking);
              if (
                parsedBooking.bookingId === bookingId ||
                parsedBooking._id === bookingId
              ) {
                // Update status berdasarkan parameter URL
                if (isFromPayment && transactionStatus) {
                  if (
                    transactionStatus === "settlement" ||
                    transactionStatus === "capture"
                  ) {
                    parsedBooking.status = "confirmed";
                    parsedBooking.paymentStatus = "settlement";
                    parsedBooking.paymentDate = new Date().toISOString();
                    localStorage.setItem(
                      "lastBooking",
                      JSON.stringify(parsedBooking)
                    );

                    toast({
                      title: "Pembayaran Berhasil!",
                      description:
                        "Pembayaran Anda telah dikonfirmasi. E-voucher sudah tersedia.",
                    });
                  } else if (transactionStatus === "pending") {
                    parsedBooking.status = "pending_verification";
                    parsedBooking.paymentStatus = "pending";
                    localStorage.setItem(
                      "lastBooking",
                      JSON.stringify(parsedBooking)
                    );
                  }
                }

                setBookingData(parsedBooking);

                // Jika ada ID paket, ambil detail paket
                if (parsedBooking.packageInfo && parsedBooking.packageInfo.id) {
                  try {
                    const packageData = await TourPackageService.getPackageById(
                      parsedBooking.packageInfo.id
                    );
                    setPaketWisata(packageData);
                  } catch (packageError) {
                    console.error("❌ Error fetching package:", packageError);
                  }
                }

                return;
              }
            } catch (e) {
              console.error("❌ Error parsing lastBooking:", e);
            }
          }

          throw new Error("Data booking tidak ditemukan");
        }
      } catch (error) {
        console.error("💥 Error fetching booking detail:", error);
        setError("Gagal mengambil data pemesanan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetail();
  }, [bookingId, toast]);

  // Manual status refresh
  const handleRefreshStatus = async () => {
    if (!bookingId) return;

    try {
      setIsCheckingStatus(true);
      console.log("🔄 Manual status refresh...");

      const updatedBooking = await BookingService.getPaymentStatus(bookingId);

      if (updatedBooking.success && updatedBooking.data) {
        // Update booking data dengan status terbaru
        const data = updatedBooking.data;
        setBookingData((prev: any) => ({
          ...prev,
          status: data.status,
          paymentStatus: data.paymentStatus,
          paymentDate: data.paymentDate,
        }));

        toast({
          title: "Status Diperbarui",
          description: `Status pembayaran: ${updatedBooking.data.paymentStatus}`,
        });
      }
    } catch (error) {
      console.error("❌ Error refreshing status:", error);
      toast({
        variant: "destructive",
        title: "Gagal memperbarui status",
        description: "Silakan coba lagi dalam beberapa saat",
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Berhasil disalin!",
          description: "Teks telah disalin ke clipboard",
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
  };

  // Handle download
  const handleDownload = () => {
    toast({
      title: "Mengunduh bukti pemesanan",
      description: "Bukti pemesanan sedang diunduh",
    });

    // Simulasi delay unduhan
    setTimeout(() => {
      toast({
        title: "Berhasil diunduh!",
        description: "Bukti pemesanan telah berhasil diunduh",
      });
    }, 2000);
  };

  // Handle proceeding to payment - Updated untuk Midtrans integration
  // Handle proceeding to payment - Fixed untuk mencegah multiple calls
  const handleProceedToPayment = async () => {
    const safeBookingData = getSafeBookingData();
    if (!safeBookingData || !bookingId || isProcessingPayment) return;

    try {
      setIsProcessingPayment(true);

      // 🔥 PERBAIKAN 1: Cek apakah sudah ada payment token
      if (
        safeBookingData.paymentToken &&
        safeBookingData.paymentStatus === "pending"
      ) {
        console.log(
          "🔄 Using existing payment token:",
          safeBookingData.paymentToken
        );

        // Langsung buka Midtrans dengan token yang sudah ada
        await openMidtransPayment(safeBookingData.paymentToken);
        return;
      }

      // Prepare payment data
      const paymentData = {
        bookingId: bookingId,
        customerInfo: {
          nama: safeBookingData.customerInfo.nama,
          email: safeBookingData.customerInfo.email,
          telepon: safeBookingData.customerInfo.telepon,
          alamat: safeBookingData.customerInfo.alamat,
        },
        packageInfo: {
          id: safeBookingData.packageInfo.id,
          nama: safeBookingData.packageInfo.nama,
          harga: safeBookingData.packageInfo.harga,
        },
        jumlahPeserta: safeBookingData.jumlahPeserta,
        totalAmount: safeBookingData.totalAmount,
      };

      console.log("💳 Processing payment with data:", paymentData);

      // Call payment service
      const paymentResponse = await BookingService.processPayment(paymentData);
      console.log("🔄 Payment response:", paymentResponse);

      // Cek berbagai format response
      const snapToken =
        (paymentResponse as any).snap_token ||
        (paymentResponse as any).data?.snap_token ||
        (paymentResponse as any).token;

      if ((paymentResponse as any).success && snapToken) {
        console.log("✅ Got Snap token:", snapToken);

        // Update booking status to pending_verification
        setBookingData((prev: any) => ({
          ...prev,
          status: "pending_verification",
          paymentToken: snapToken,
          paymentStatus: "pending",
        }));

        // Buka Midtrans payment
        await openMidtransPayment(snapToken);
      } else {
        console.error("❌ No snap token received:", paymentResponse);
        throw new Error(
          paymentResponse.message || "Gagal mendapatkan token pembayaran"
        );
      }
    } catch (error: any) {
      console.error("💥 Error processing payment:", error);

      toast({
        variant: "destructive",
        title: "Gagal Memproses Pembayaran",
        description: error.message || "Silakan coba lagi dalam beberapa saat",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // 🔥 PERBAIKAN 2: Pisahkan fungsi untuk buka Midtrans
  const openMidtransPayment = async (snapToken: string) => {
    try {
      // Load Midtrans script
      const loadMidtransScript = () => {
        return new Promise((resolve, reject) => {
          // Cek apakah script sudah ada
          const existingScript = document.querySelector(
            'script[src*="snap.js"]'
          );
          if (existingScript) {
            console.log("📜 Midtrans script already loaded");
            resolve(true);
            return;
          }

          const script = document.createElement("script");
          script.src = "https://app.sandbox.midtrans.com/snap/snap.js";

          const midtransClientKey =
            import.meta.env.VITE_MIDTRANS_CLIENT_KEY ||
            "SB-Mid-client-your-client-key";

          console.log(
            "🔑 Using Midtrans Client Key:",
            midtransClientKey.substring(0, 20) + "..."
          );
          script.setAttribute("data-client-key", midtransClientKey);

          script.onload = () => {
            console.log("✅ Midtrans script loaded successfully");
            resolve(true);
          };

          script.onerror = (error) => {
            console.error("❌ Failed to load Midtrans script:", error);
            reject(new Error("Gagal memuat script Midtrans"));
          };

          document.head.appendChild(script);
        });
      };

      // Load script
      await loadMidtransScript();

      // Tunggu sebentar untuk memastikan script ter-load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 🔥 PERBAIKAN 3: Cek status Midtrans dan hindari multiple calls
      if (typeof window !== "undefined" && (window as any).snap) {
        // Pastikan tidak ada popup yang sedang terbuka
        try {
          (window as any).snap.hide();
        } catch (e) {
          // Ignore error jika tidak ada popup
        }

        console.log("🚀 Opening Midtrans popup with token:", snapToken);

        // @ts-ignore
        (window as any).snap.pay(snapToken, {
          onSuccess: function (result: any) {
            console.log("✅ Payment success:", result);

            // Update status dulu
            setBookingData((prev: any) => ({
              ...prev,
              status: "confirmed",
              paymentStatus: "settlement",
              paymentDate: new Date().toISOString(),
            }));

            toast({
              title: "Pembayaran Berhasil!",
              description: "Pembayaran Anda telah dikonfirmasi.",
            });

            // Redirect dengan delay untuk memastikan state ter-update
            setTimeout(() => {
              navigate(
                `/booking-detail/${bookingId}?payment_success=true&transaction_status=${result.transaction_status}&from=midtrans`
              );
            }, 1000);
          },

          onPending: function (result: any) {
            console.log("⏳ Payment pending:", result);

            // Update status ke pending_verification
            setBookingData((prev: any) => ({
              ...prev,
              status: "pending_verification",
              paymentStatus: "pending",
            }));

            toast({
              title: "Pembayaran Sedang Diproses",
              description:
                "Pembayaran Anda sedang diverifikasi. Silakan tunggu beberapa saat.",
            });

            // Redirect ke halaman yang sama dengan status pending
            setTimeout(() => {
              navigate(
                `/booking-detail/${bookingId}?payment_success=pending&transaction_status=${result.transaction_status}&from=midtrans`
              );
            }, 1000);
          },

          onError: function (result: any) {
            console.error("❌ Payment error:", result);

            toast({
              variant: "destructive",
              title: "Pembayaran Gagal",
              description: "Terjadi kesalahan saat memproses pembayaran.",
            });

            // Redirect ke halaman error
            setTimeout(() => {
              navigate(
                `/booking-error/${bookingId}?reason=payment_error&from=midtrans`
              );
            }, 2000);
          },

          onClose: function () {
            console.log("💸 Payment popup closed by user");

            toast({
              title: "Pembayaran Dibatalkan",
              description: "Anda dapat melanjutkan pembayaran kapan saja.",
            });
          },
        });
      } else {
        console.error("❌ window.snap is not available");
        throw new Error(
          "Midtrans Snap tidak tersedia. Silakan refresh halaman."
        );
      }
    } catch (scriptError) {
      console.error("❌ Script loading error:", scriptError);
      throw new Error("Gagal memuat payment gateway. Silakan coba lagi.");
    }
  };
  // Handle share
  const handleShare = async () => {
    const safeBookingData = getSafeBookingData();
    if (!safeBookingData) return;

    const url = window.location.href;
    const title = "Bukti Pemesanan Paket Wisata";
    const text = `Saya telah memesan paket wisata ${safeBookingData.packageInfo.nama} dengan nomor booking ${safeBookingData.bookingId}. Mari lihat detailnya!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback to clipboard
        copyToClipboard(url);
      }
    } else {
      // Fallback to clipboard
      copyToClipboard(url);
    }
  };

  // Jika masih loading, tampilkan skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-muted rounded mb-4"></div>
            <div className="h-4 w-32 bg-muted rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-96 bg-muted rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ SAFE DATA dengan error handling
  const safeBookingData = getSafeBookingData();

  if (error || !safeBookingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Data booking tidak ditemukan atau tidak lengkap"}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/paket-wisata")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Paket Wisata
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-gray-50">
      {/* Breadcrumb dan Tombol Kembali */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 p-0 hover:bg-transparent"
          onClick={() => navigate("/paket-wisata")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Paket Wisata</span>
        </Button>
      </div>

      {/* Menampilkan alur booking (progress steps) */}
      <BookingSteps currentStatus={safeBookingData.status} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Konten Utama */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-l-4 border-l-primary">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Detail Pemesanan</h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-muted-foreground">
                    Booking ID: {safeBookingData.bookingId}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0"
                    onClick={() => copyToClipboard(safeBookingData.bookingId)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookingStatusBadge status={safeBookingData.status} />
                {safeBookingData.status === "pending_verification" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshStatus}
                    disabled={isCheckingStatus}
                  >
                    {isCheckingStatus ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Status-specific notification alerts */}
          {safeBookingData.status === "confirmed" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">
                Pembayaran Berhasil
              </AlertTitle>
              <AlertDescription className="text-green-700">
                <p className="mb-2">
                  Pembayaran Anda telah dikonfirmasi. E-voucher telah dikirim ke
                  email Anda dan dapat diunduh di halaman ini.
                </p>
                <Button
                  className="mt-2"
                  onClick={() =>
                    navigate(`/e-voucher/${safeBookingData.bookingId}`)
                  }
                >
                  Lihat E-Voucher
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {safeBookingData.status === "pending_verification" && (
            <Alert className="bg-blue-50 border-blue-200">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">
                Verifikasi Pembayaran
              </AlertTitle>
              <AlertDescription className="text-blue-700">
                <p className="mb-2">
                  Pembayaran Anda sedang diverifikasi. Proses ini biasanya
                  selesai dalam beberapa menit.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 bg-blue-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-2/3 animate-pulse"></div>
                  </div>
                  <span className="text-xs">Sedang diproses</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleRefreshStatus}
                  disabled={isCheckingStatus}
                >
                  {isCheckingStatus ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh Status
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {safeBookingData.status === "pending" && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">
                Menunggu Pembayaran
              </AlertTitle>
              <AlertDescription className="text-yellow-700">
                <p className="mb-2">
                  Silakan melakukan pembayaran untuk menyelesaikan transaksi
                  Anda.
                </p>
                <Button
                  className="mt-2"
                  onClick={handleProceedToPayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Lanjutkan ke Pembayaran
                    </>
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {safeBookingData.status === "completed" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">
                Perjalanan Selesai
              </AlertTitle>
              <AlertDescription className="text-green-700">
                Terima kasih telah menggunakan layanan kami. Kami harap Anda
                puas dengan perjalanan Anda.
              </AlertDescription>
            </Alert>
          )}

          {safeBookingData.status === "cancelled" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pemesanan Dibatalkan</AlertTitle>
              <AlertDescription>
                Pemesanan ini telah dibatalkan.
              </AlertDescription>
            </Alert>
          )}

          {/* Tabs untuk informasi detail */}
          <Tabs defaultValue="detail" className="bg-white rounded-lg shadow-sm">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detail">Detail Pemesanan</TabsTrigger>
              <TabsTrigger value="info">Informasi Penting</TabsTrigger>
            </TabsList>

            {/* Tab Detail Pemesanan */}
            <TabsContent value="detail" className="space-y-6 pt-4 px-6 pb-6">
              {/* Informasi Paket */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Informasi Paket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                      <img
                        src={
                          paketWisata?.foto?.[0] ||
                          `https://source.unsplash.com/random/800x600/?travel,${safeBookingData.packageInfo.destination}`
                        }
                        alt={safeBookingData.packageInfo.nama}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {safeBookingData.packageInfo.nama}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatDate(
                              safeBookingData.selectedSchedule.tanggalAwal
                            )}{" "}
                            -{" "}
                            {formatDate(
                              safeBookingData.selectedSchedule.tanggalAkhir
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{safeBookingData.packageInfo.destination}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{safeBookingData.jumlahPeserta} orang</span>
                        </div>
                        {paketWisata?.durasi && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{paketWisata.durasi}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {paketWisata && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {paketWisata.hotel && (
                        <div className="flex items-start gap-2">
                          <Hotel className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">Akomodasi</div>
                            <div className="text-sm text-muted-foreground">
                              {paketWisata.hotel.nama}
                            </div>
                          </div>
                        </div>
                      )}
                      {paketWisata.armada && (
                        <div className="flex items-start gap-2">
                          <Bus className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">Transportasi</div>
                            <div className="text-sm text-muted-foreground">
                              {paketWisata.armada.nama}
                            </div>
                          </div>
                        </div>
                      )}
                      {paketWisata.consume && (
                        <div className="flex items-start gap-2">
                          <Utensils className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">Konsumsi</div>
                            <div className="text-sm text-muted-foreground">
                              {paketWisata.consume.nama}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Informasi Pemesan */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Informasi Pemesan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Nama Lengkap
                      </div>
                      <div>{safeBookingData.customerInfo.nama}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div>{safeBookingData.customerInfo.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Nomor Telepon
                      </div>
                      <div>{safeBookingData.customerInfo.telepon}</div>
                    </div>
                    {safeBookingData.customerInfo.alamat && (
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Alamat
                        </div>
                        <div>{safeBookingData.customerInfo.alamat}</div>
                      </div>
                    )}
                    {safeBookingData.customerInfo.instansi && (
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Instansi
                        </div>
                        <div>{safeBookingData.customerInfo.instansi}</div>
                      </div>
                    )}
                  </div>

                  {safeBookingData.customerInfo.catatan && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Catatan
                        </div>
                        <div>{safeBookingData.customerInfo.catatan}</div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Informasi Pembayaran */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Informasi Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Tanggal Pemesanan
                      </div>
                      <div>{formatDate(safeBookingData.bookingDate)}</div>
                    </div>
                    {safeBookingData.paymentDate && (
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Tanggal Pembayaran
                        </div>
                        <div>{formatDate(safeBookingData.paymentDate)}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Metode Pembayaran
                      </div>
                      <div>
                        {safeBookingData.paymentMethod === "bank_transfer"
                          ? `Transfer Bank`
                          : safeBookingData.paymentMethod === "midtrans"
                          ? "Payment Gateway Midtrans"
                          : safeBookingData.paymentMethod ||
                            "Midtrans Payment Gateway"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Status Pembayaran
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            safeBookingData.status === "confirmed" ||
                            safeBookingData.status === "completed"
                              ? "bg-green-500"
                              : safeBookingData.status ===
                                "pending_verification"
                              ? "bg-blue-500"
                              : safeBookingData.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span>
                          {safeBookingData.status === "pending"
                            ? "Menunggu Pembayaran"
                            : safeBookingData.status === "pending_verification"
                            ? "Verifikasi Pembayaran"
                            : safeBookingData.status === "confirmed"
                            ? "Pembayaran Berhasil"
                            : safeBookingData.status === "completed"
                            ? "Perjalanan Selesai"
                            : "Dibatalkan"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 space-y-2 bg-gray-50 rounded-md">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Harga per orang
                      </span>
                      <span>
                        {formatCurrency(safeBookingData.packageInfo.harga)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Jumlah peserta
                      </span>
                      <span>x {safeBookingData.jumlahPeserta}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatCurrency(safeBookingData.totalAmount)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      *Harga sudah termasuk pajak dan biaya layanan
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Informasi Penting */}
            <TabsContent value="info" className="space-y-6 pt-4 px-6 pb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Informasi Penting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">E-Voucher</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      E-voucher akan tersedia setelah pembayaran berhasil
                      dikonfirmasi. Tunjukkan e-voucher kepada tour guide saat
                      hari keberangkatan.
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-amber-50 border-amber-200">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">
                      Pembatalan
                    </AlertTitle>
                    <AlertDescription className="text-amber-700">
                      <p>
                        Pembatalan gratis hingga 7 hari sebelum keberangkatan.
                      </p>
                      <p>
                        Pembatalan kurang dari 7 hari akan dikenakan biaya
                        administrasi.
                      </p>
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">
                      Kontak Darurat
                    </AlertTitle>
                    <AlertDescription className="text-blue-700">
                      <p>Untuk keadaan darurat, silakan hubungi:</p>
                      <p>Customer Service: +62 812-3456-789 (24 jam)</p>
                    </AlertDescription>
                  </Alert>

                  {/* Fasilitas jika tersedia dari paket wisata */}
                  {paketWisata &&
                    paketWisata.include &&
                    paketWisata.include.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Fasilitas Termasuk:</h3>
                        <ul className="space-y-2">
                          {paketWisata.include.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                              <span className="text-sm text-muted-foreground">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informasi Booking Status dan Pembayaran */}
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="pb-2 bg-primary/5 border-b">
              <CardTitle className="text-lg">Status Pemesanan</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 border-b bg-white">
                <div className="flex justify-between items-center">
                  <div className="text-sm">Status</div>
                  <BookingStatusBadge status={safeBookingData.status} />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-green-600">
                      Pemesanan Dibuat
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(safeBookingData.bookingDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      safeBookingData.status === "pending_verification" ||
                      safeBookingData.status === "confirmed" ||
                      safeBookingData.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : safeBookingData.status === "pending"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {safeBookingData.status === "pending_verification" ||
                    safeBookingData.status === "confirmed" ||
                    safeBookingData.status === "completed" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      "2"
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-medium ${
                        safeBookingData.status === "pending_verification" ||
                        safeBookingData.status === "confirmed" ||
                        safeBookingData.status === "completed"
                          ? "text-green-600"
                          : safeBookingData.status === "pending"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      Pembayaran
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {safeBookingData.status === "pending"
                        ? "Menunggu Pembayaran"
                        : safeBookingData.status === "cancelled"
                        ? "Dibatalkan"
                        : safeBookingData.paymentDate
                        ? formatDate(safeBookingData.paymentDate)
                        : "Dalam proses"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      safeBookingData.status === "confirmed" ||
                      safeBookingData.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : safeBookingData.status === "pending_verification"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {safeBookingData.status === "confirmed" ||
                    safeBookingData.status === "completed" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      "3"
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-medium ${
                        safeBookingData.status === "confirmed" ||
                        safeBookingData.status === "completed"
                          ? "text-green-600"
                          : safeBookingData.status === "pending_verification"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      E-Voucher
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {safeBookingData.status === "confirmed" ||
                      safeBookingData.status === "completed"
                        ? "E-Voucher Tersedia"
                        : safeBookingData.status === "pending_verification"
                        ? "Verifikasi Pembayaran"
                        : "Belum Tersedia"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      safeBookingData.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {safeBookingData.status === "completed" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      "4"
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-medium ${
                        safeBookingData.status === "completed"
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      Perjalanan Selesai
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {safeBookingData.status === "completed"
                        ? "Terima kasih atas kepercayaan Anda"
                        : formatDate(
                            safeBookingData.selectedSchedule.tanggalAkhir
                          )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aksi Cepat */}
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="pb-2 bg-primary/5 border-b">
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {safeBookingData.status === "pending" ? (
                <div className="p-4">
                  <Button
                    className="w-full bg-primary mb-3"
                    onClick={handleProceedToPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Lanjutkan ke Pembayaran
                      </>
                    )}
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">
                    Lakukan pembayaran untuk mengonfirmasi pemesanan Anda
                  </div>
                </div>
              ) : safeBookingData.status === "pending_verification" ? (
                <div className="p-4">
                  <Button
                    variant="outline"
                    className="w-full mb-3"
                    onClick={handleRefreshStatus}
                    disabled={isCheckingStatus}
                  >
                    {isCheckingStatus ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memeriksa...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Status
                      </>
                    )}
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">
                    Pembayaran Anda sedang diverifikasi. Klik refresh untuk
                    update terbaru.
                  </div>
                </div>
              ) : safeBookingData.status === "confirmed" ||
                safeBookingData.status === "completed" ? (
                <div className="p-4">
                  <Button
                    className="w-full bg-primary mb-3"
                    onClick={() =>
                      navigate(`/e-voucher/${safeBookingData.bookingId}`)
                    }
                  >
                    Lihat E-Voucher
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">
                    Tunjukkan e-voucher kepada tour guide saat hari
                    keberangkatan
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex justify-center py-3">
                    <Clock className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    Pemesanan telah dibatalkan
                  </div>
                </div>
              )}

              <Separator />

              <div className="p-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Unduh Detail Pemesanan
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4" />
                  Cetak Detail Pemesanan
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Bagikan Detail Pemesanan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Kontak */}
          <Card className="shadow-md">
            <CardHeader className="pb-2 bg-primary/5 border-b">
              <CardTitle className="text-lg">Butuh Bantuan?</CardTitle>
              <CardDescription>
                Tim customer service kami siap membantu Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 p-6">
              <ContactInfo />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
