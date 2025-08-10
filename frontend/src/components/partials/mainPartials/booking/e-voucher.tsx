// e-voucher.tsx - Fixed Version
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
  QrCode,
  Star,
  Loader2,
  RefreshCw,
} from "lucide-react";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TourPackageService } from "@/services/tour-package.service";
import { useBooking } from "@/hooks/use-booking";
import { useAuth } from "@/hooks/use-auth";
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

// Format tanggal dan waktu
const formatDateTime = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

// Helper function untuk status message
const getStatusMessage = (status: string): string => {
  switch (status) {
    case "pending":
      return "Silakan selesaikan pembayaran terlebih dahulu";
    case "pending_verification":
      return "Pembayaran sedang diverifikasi, silakan tunggu beberapa saat";
    case "cancelled":
      return "Pemesanan telah dibatalkan";
    default:
      return "Status pemesanan tidak valid untuk e-voucher";
  }
};

// Komponen untuk menampilkan langkah-langkah alur pemesanan
const BookingSteps = () => {
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
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
            <CheckCircle className="h-5 w-5" />
          </div>
          <span className="text-xs mt-2 text-center">Detail</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
            <CheckCircle className="h-5 w-5" />
          </div>
          <span className="text-xs mt-2 text-center">Pembayaran</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
            <CheckCircle className="h-5 w-5" />
          </div>
          <span className="text-xs mt-2 text-center">E-Voucher</span>
        </div>
      </div>

      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
        <div
          className="h-full bg-primary transition-all duration-1000"
          style={{ width: "100%" }}
        ></div>
      </div>
    </div>
  );
};

// Komponen untuk menampilkan QR Code e-voucher
const EVoucher = ({
  bookingId,
  customerName,
  packageName,
  date,
  destination,
  jumlahPeserta,
  bookingData,
}: {
  bookingId: string;
  customerName: string;
  packageName: string;
  date: string;
  destination: string;
  jumlahPeserta: number;
  bookingData: any;
}) => {
  // Debug image paths if available
  useEffect(() => {
    if (bookingData) {
      console.log("📸 EVoucher component - Available image paths:");
      console.log("- imagesPaths:", bookingData.imagesPaths?.slice(0, 3));
      console.log("- packageDetail?.foto:", bookingData.packageDetail?.foto);
      console.log("- packageId?.foto?.[0]:", bookingData.packageId?.foto?.[0]);
      console.log("- packageId?.destination?.foto:", bookingData.packageId?.destination?.foto);
      
      // Try to load the first image to see if it works
      if (bookingData.imagesPaths?.[0]) {
        const img = new Image();
        img.onload = () => console.log("✅ Test image loaded successfully:", bookingData.imagesPaths[0]);
        img.onerror = () => console.error("❌ Test image failed to load:", bookingData.imagesPaths[0]);
        img.src = bookingData.imagesPaths[0];
      }
    }
  }, [bookingData]);
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setPrinting] = useState(false);

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

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const voucherData = {
        bookingId,
        customerName,
        packageName,
        destination,
        date,
        jumlahPeserta,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${bookingId}`,
        generatedAt: new Date().toISOString(),
      };

      const content = `
E-VOUCHER TRAVEDIA
==================
Booking ID: ${bookingId}
Nama: ${customerName}
Paket: ${packageName}
Destinasi: ${destination}
Tanggal: ${date}
Jumlah Peserta: ${jumlahPeserta} orang

QR Code: ${voucherData.qrCodeUrl}

Tunjukkan voucher ini kepada tour guide saat keberangkatan.
Datang 30 menit sebelum waktu keberangkatan.

Generated: ${formatDateTime(voucherData.generatedAt)}
      `.trim();

      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `e-voucher-${bookingId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "E-Voucher berhasil diunduh!",
        description: "File e-voucher telah disimpan ke perangkat Anda",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Gagal mengunduh",
        description: "Terjadi kesalahan saat mengunduh e-voucher",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    setPrinting(true);

    setTimeout(() => {
      window.print();
      setPrinting(false);

      toast({
        title: "E-Voucher siap dicetak",
        description: "Halaman e-voucher telah disiapkan untuk pencetakan",
      });
    }, 500);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = "E-Voucher Travedia";
    const text = `Saya telah memesan paket wisata ${packageName} dengan nomor booking ${bookingId}. Lihat E-Voucher saya!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });

        toast({
          title: "E-Voucher berhasil dibagikan",
          description: "Link e-voucher telah dibagikan",
        });
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-md relative overflow-hidden print:shadow-none">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mt-16 -mr-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -mb-12 -ml-12"></div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
          <QrCode className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold">E-Voucher Travedia</h3>
        <p className="text-sm text-muted-foreground">
          Tunjukkan voucher ini kepada tour guide kami
        </p>
        <Badge
          variant="outline"
          className="mt-2 bg-green-50 text-green-700 border-green-200"
        >
          ✓ Pembayaran Terkonfirmasi
        </Badge>
      </div>

      <div className="flex justify-center mb-6">
        {/* QR Code - Package image removed as requested */}
        <div className="p-3 border-2 border-dashed border-primary/30 rounded-lg relative bg-white">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${bookingId}&margin=10`}
            alt="QR Code E-Voucher"
            className="border rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' fill='%23f3f4f6'/%3E%3Ctext x='90' y='90' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='12' fill='%236b7280'%3EQR Code%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border border-primary/30 rounded-full"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border border-primary/30 rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border border-primary/30 rounded-full"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border border-primary/30 rounded-full"></div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-muted-foreground mb-1">Booking ID</div>
            <div className="font-bold flex items-center justify-center gap-2">
              {bookingId}
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => copyToClipboard(bookingId)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-muted-foreground mb-1">Peserta</div>
            <div className="font-bold">{jumlahPeserta} orang</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-dashed">
            <span className="text-muted-foreground">Nama</span>
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-dashed">
            <span className="text-muted-foreground">Paket</span>
            <span className="font-medium text-right">{packageName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-dashed">
            <span className="text-muted-foreground">Destinasi</span>
            <span className="font-medium">{destination}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-dashed">
            <span className="text-muted-foreground">Tanggal</span>
            <span className="font-medium text-right">{date}</span>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-center gap-2 print:hidden">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>Unduh</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={handlePrint}
          disabled={isPrinting}
        >
          {isPrinting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Printer className="h-4 w-4" />
          )}
          <span>Cetak</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          <span>Bagikan</span>
        </Button>
      </div>

      <div className="hidden print:block mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
        <p>
          E-Voucher Travedia - Dicetak pada{" "}
          {formatDateTime(new Date().toISOString())}
        </p>
        <p>Untuk bantuan: +62 812-3456-789 | cs@travedia.com</p>
      </div>
    </div>
  );
};

// Contact Info Component
const ContactInfo = () => {
  const openWhatsApp = () => {
    const phone = "628123456789";
    const text =
      "Halo, saya membutuhkan bantuan terkait e-voucher perjalanan saya.";
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

// ✅ FIXED: Fetch booking data dengan API yang benar
const fetchBookingData = async (bookingId: string) => {
  try {
    console.log(`📋 Fetching booking: ${bookingId}`);

    // ✅ Use environment variable for API URL
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/orders/${bookingId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch booking");
    }

    // ✅ FIXED: Return the actual booking data, not wrapped in 'data'
    return data.booking || data.data;
  } catch (error) {
    console.error("❌ Error fetching booking:", error);
    throw error;
  }
};

// ✅ FIXED: Generate voucher dengan API yang benar
const generateVoucher = async (bookingId: string) => {
  try {
    console.log(`🎫 Generating voucher for: ${bookingId}`);

    // ✅ Use environment variable for API URL
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(
      `${apiUrl}/api/voucher/generate/${bookingId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to generate voucher");
    }

    return data.voucher;
  } catch (error) {
    console.error("❌ Error generating voucher:", error);
    throw error;
  }
};

// ✅ FIXED: Check payment status
const checkPaymentStatus = async (bookingId: string) => {
  try {
    console.log(`🔄 Checking payment status for: ${bookingId}`);

    // ✅ Use environment variable for API URL
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(
      `${apiUrl}/api/booking/check-payment/${bookingId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error checking payment status:", error);
    throw error;
  }
};

// Main Component
export default function EVoucherPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [voucherData, setVoucherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [lastStatusCheck, setLastStatusCheck] = useState<Date | null>(null);

  // Manual refresh function
  const handleManualRefresh = async () => {
    if (!bookingId) return;

    try {
      setIsCheckingStatus(true);
      console.log("🔄 Manual status refresh...");

      const statusResult = await checkPaymentStatus(bookingId);

      if (statusResult.success && statusResult.status === "confirmed") {
        window.location.reload();
      } else {
        toast({
          title: "Status Belum Berubah",
          description: "Pembayaran masih dalam proses verifikasi",
        });
      }

      setLastStatusCheck(new Date());
    } catch (error: any) {
      console.error("❌ Manual refresh error:", error);
      toast({
        variant: "destructive",
        title: "Gagal memeriksa status",
        description: "Silakan coba lagi dalam beberapa saat",
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // ✅ FIXED: Simplified useEffect with correct API calls
  useEffect(() => {
    const fetchBookingAndVoucher = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!bookingId) {
          throw new Error("ID booking tidak ditemukan");
        }

        console.log("🎫 Fetching e-voucher data for:", bookingId);

        // ✅ Step 1: Fetch booking data
        let bookingDetail = null;
        try {
          bookingDetail = await fetchBookingData(bookingId);

          // ✅ DEBUG: Log structure
          console.log(
            "📋 Raw booking response:",
            JSON.stringify(bookingDetail, null, 2)
          );
        } catch (fetchError) {
          console.error("❌ Failed to fetch booking:", fetchError);
          throw new Error("Data booking tidak ditemukan");
        }

        // ✅ Step 2: Validate payment status
        const allowedStatuses = ["confirmed", "completed"];
        const allowedPaymentStatuses = ["settlement", "capture"];

        // ✅ FIXED: Handle case where bookingDetail might be wrapped in 'data'
        let actualBookingData = bookingDetail;
        if (bookingDetail.data) {
          actualBookingData = bookingDetail.data;
        }

        const isValidStatus = allowedStatuses.includes(
          actualBookingData.status
        );
        const isValidPaymentStatus = allowedPaymentStatuses.includes(
          actualBookingData.paymentStatus
        );

        if (!isValidStatus || !isValidPaymentStatus) {
          console.log("⚠️ Status not valid, trying manual check...");

          try {
            const statusResult = await checkPaymentStatus(bookingId);
            if (statusResult.success && statusResult.status === "confirmed") {
              console.log("✅ Payment confirmed via manual check");
              actualBookingData = statusResult.booking;
            } else {
              const statusMessage = getStatusMessage(actualBookingData.status);
              throw new Error(
                `E-Voucher hanya tersedia untuk pemesanan yang telah dikonfirmasi. ${statusMessage}.`
              );
            }
          } catch (statusError) {
            const statusMessage = getStatusMessage(actualBookingData.status);
            throw new Error(
              `E-Voucher hanya tersedia untuk pemesanan yang telah dikonfirmasi. ${statusMessage}.`
            );
          }
        }

        setBookingData(actualBookingData);
        console.log("✅ Booking data loaded:", JSON.stringify({
          "packageId": actualBookingData.packageId,
          "packageInfo": actualBookingData.packageInfo,
          "packageDetail": actualBookingData.packageDetail,
          "foto source": actualBookingData.packageDetail?.foto || actualBookingData.packageId?.foto?.[0]
        }, null, 2));

        // ✅ Step 3: Generate voucher
        try {
          const voucher = await generateVoucher(bookingId);
          setVoucherData(voucher);
          console.log("🎫 Voucher generated successfully");
        } catch (voucherError) {
          console.error("❌ Error generating voucher:", voucherError);
          // Use fallback voucher data
          setVoucherData({
            voucherUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${bookingId}`,
            voucherCode: bookingId,
          });
        }

        // ✅ Step 4: Get package details and images from all possible sources
        // Initialize an array to store possible image paths
        let possibleImages: string[] = [];
        
        if (actualBookingData.packageId && typeof actualBookingData.packageId === "object") {
          setPaketWisata(actualBookingData.packageId);
          console.log("✅ Using packageId object data:", actualBookingData.packageId);
          
          // Add images from packageId.foto array if available
          if (actualBookingData.packageId.foto && Array.isArray(actualBookingData.packageId.foto)) {
            possibleImages = [...possibleImages, ...actualBookingData.packageId.foto];
          } else if (actualBookingData.packageId.foto) {
            possibleImages.push(actualBookingData.packageId.foto);
          }
          
          // Check for imageUrl as well (alternate format)
          if (actualBookingData.packageId.imageUrl) {
            possibleImages.push(actualBookingData.packageId.imageUrl);
          }
        }
        
        // Check packageDetail for images (usually from localStorage in booking form)
        if (actualBookingData.packageDetail) {
          console.log("✅ Using packageDetail data:", actualBookingData.packageDetail);
          
          if (actualBookingData.packageDetail.foto) {
            if (Array.isArray(actualBookingData.packageDetail.foto)) {
              possibleImages = [...possibleImages, ...actualBookingData.packageDetail.foto];
            } else {
              possibleImages.push(actualBookingData.packageDetail.foto);
            }
          }
        }
        
        // Check destination for images
        if (actualBookingData.packageId?.destination?.foto) {
          console.log("✅ Found destination images:", actualBookingData.packageId.destination.foto);
          
          if (Array.isArray(actualBookingData.packageId.destination.foto)) {
            possibleImages = [...possibleImages, ...actualBookingData.packageId.destination.foto];
          } else {
            possibleImages.push(actualBookingData.packageId.destination.foto);
          }
        }
        
        // If no images found, fetch from API as a last resort
        if (possibleImages.length === 0 && actualBookingData.packageInfo?.id) {
          try {
            console.log("🔍 Fetching package data from API with ID:", actualBookingData.packageInfo.id);
            const packageData = await TourPackageService.getPackageById(
              actualBookingData.packageInfo.id
            );
            console.log("✅ Fetched package data:", packageData);
            setPaketWisata(packageData);
            
            // Add images from fetched package
            if (packageData.foto && Array.isArray(packageData.foto)) {
              possibleImages = [...possibleImages, ...packageData.foto];
            } else if (packageData.foto) {
              possibleImages.push(packageData.foto);
            }
            
            // Check for imageUrl as well
            if (packageData.imageUrl) {
              possibleImages.push(packageData.imageUrl);
            }
            
            // Check destination images from fetched package
            if (packageData.destination?.foto) {
              if (Array.isArray(packageData.destination.foto)) {
                possibleImages = [...possibleImages, ...packageData.destination.foto];
              } else {
                possibleImages.push(packageData.destination.foto);
              }
            }
          } catch (packageError) {
            console.error("❌ Error loading package data:", packageError);
          }
        }
        
        // Store the found images in booking data for easy access in components
        actualBookingData.imagesPaths = possibleImages.filter(Boolean);
        
        // Debug the available image sources
        console.log("🖼️ Available image sources found:", possibleImages.length);
        console.log("🖼️ First 3 images:", possibleImages.slice(0, 3));
        
        // Store the enhanced data
        setBookingData({
          ...actualBookingData,
          imagesPaths: possibleImages.filter(Boolean)
        });
        

        toast({
          title: "E-Voucher berhasil dimuat",
          description: "E-voucher Anda siap digunakan untuk perjalanan",
        });
      } catch (error: any) {
        console.error("💥 Error fetching booking and voucher:", error);
        setError(error.message || "Gagal mengambil data e-voucher");

        toast({
          variant: "destructive",
          title: "Gagal memuat e-voucher",
          description:
            error.message || "Silakan coba lagi atau hubungi customer service",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingAndVoucher();
  }, [bookingId]); // ✅ FIXED: Only bookingId dependency

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold">Memuat E-Voucher</h2>
            <p className="text-muted-foreground">
              Mohon tunggu, sedang mengambil data e-voucher Anda...
            </p>
          </div>

          <div className="mt-8 animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded mx-auto"></div>
            <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
            <div className="mt-8 mb-8 w-64 h-64 bg-muted rounded-lg mx-auto"></div>
            <div className="space-y-2">
              <div className="h-4 w-40 bg-muted rounded mx-auto"></div>
              <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
              <div className="h-4 w-36 bg-muted rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error || !bookingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>E-Voucher Tidak Tersedia</AlertTitle>
            <AlertDescription>
              {error || "Data tidak ditemukan"}
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate(`/booking-detail/${bookingId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Detail Pemesanan
            </Button>

            <Button
              variant="outline"
              onClick={handleManualRefresh}
              disabled={isCheckingStatus}
            >
              {isCheckingStatus ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Periksa Status Pembayaran
            </Button>

            <Button variant="outline" onClick={() => window.location.reload()}>
              Muat Ulang
            </Button>
          </div>

          {error?.includes("tidak dikonfirmasi") && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">
                Belum bisa akses e-voucher?
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                E-voucher akan tersedia setelah pembayaran Anda dikonfirmasi
                oleh sistem. Proses konfirmasi biasanya memakan waktu 1-5 menit
                setelah pembayaran berhasil.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleManualRefresh}
                  disabled={isCheckingStatus}
                >
                  {isCheckingStatus ? "Memeriksa..." : "Periksa Sekarang"}
                </Button>
                {lastStatusCheck && (
                  <span className="text-xs text-blue-600 self-center">
                    Terakhir dicek:{" "}
                    {formatDateTime(lastStatusCheck.toISOString())}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
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
          onClick={() => navigate(`/booking-detail/${bookingId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Detail Pemesanan</span>
        </Button>
      </div>

      {/* Progress Steps */}
      <BookingSteps />

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">E-Voucher Perjalanan Anda</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Tunjukkan E-Voucher ini kepada tour guide kami saat hari
            keberangkatan. Pastikan untuk datang 30 menit sebelum waktu yang
            ditentukan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content: E-Voucher */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="h-5 w-5 text-primary" />
                      E-Voucher Travedia
                    </CardTitle>
                    <CardDescription>
                      Voucher Elektronik untuk Paket Wisata Anda
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    ✓ Valid
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <EVoucher
                  bookingId={bookingData.customId || bookingData.bookingId}
                  customerName={bookingData.customerInfo?.nama || "Customer"}
                  packageName={
                    bookingData.packageId?.nama ||
                    bookingData.packageInfo?.nama ||
                    bookingData.packageDetail?.nama ||
                    "Travel Package"
                  }
                  date={`${formatDate(
                    bookingData.tanggalAwal ||
                      bookingData.selectedSchedule?.tanggalAwal ||
                      bookingData.schedule?.tanggalAwal
                  )} - ${formatDate(
                    bookingData.tanggalAkhir ||
                      bookingData.selectedSchedule?.tanggalAkhir ||
                      bookingData.schedule?.tanggalAkhir
                  )}`}
                  destination={
                    bookingData.packageId?.destination?.nama ||
                    bookingData.packageInfo?.destination ||
                    bookingData.packageDetail?.destination ||
                    "Unknown Destination"
                  }
                  jumlahPeserta={bookingData.jumlahPeserta}
                  bookingData={bookingData}
                />
              </CardContent>
              <CardFooter className="bg-muted/50 p-4">
                <Alert className="w-full bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Penting</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>
                        Simpan E-Voucher ini dengan baik dan pastikan bisa
                        diakses saat perjalanan
                      </li>
                      <li>
                        Datang 30 menit sebelum waktu keberangkatan untuk
                        registrasi
                      </li>
                      <li>
                        Bawa kartu identitas yang sesuai dengan nama di voucher
                      </li>
                      <li>Hubungi customer service jika ada pertanyaan</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>

            {/* Informasi Paket */}
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Informasi Paket Wisata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                    <ImageWithFallback
                      src={bookingData?.imagesPaths?.[0] || paketWisata?.foto?.[0] || bookingData?.packageDetail?.foto}
                      alt={bookingData.packageId?.nama || bookingData.packageInfo?.nama || "Paket Wisata"}
                      className="h-full w-full object-cover"
                      fallbackClassName="h-full w-full rounded-md"
                      fallbackText="Travel Package"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {bookingData.packageId?.nama ||
                        bookingData.packageInfo?.nama}
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatDate(
                            bookingData.tanggalAwal ||
                              bookingData.selectedSchedule?.tanggalAwal ||
                              bookingData.schedule?.tanggalAwal
                          )}{" "}
                          -{" "}
                          {formatDate(
                            bookingData.tanggalAkhir ||
                              bookingData.selectedSchedule?.tanggalAkhir ||
                              bookingData.schedule?.tanggalAkhir
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {bookingData.packageId?.destination?.nama ||
                            bookingData.packageInfo?.destination}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{bookingData.jumlahPeserta} orang</span>
                      </div>
                      {(paketWisata?.durasi ||
                        bookingData.packageId?.durasi) && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {paketWisata?.durasi ||
                              bookingData.packageId?.durasi}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {(paketWisata || bookingData.packageId) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(paketWisata?.hotel || bookingData.packageId?.hotel) && (
                      <div className="flex items-start gap-2">
                        <Hotel className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Akomodasi</div>
                          <div className="text-sm text-muted-foreground">
                            {paketWisata?.hotel?.nama ||
                              bookingData.packageId?.hotel?.nama}
                          </div>
                          {(paketWisata?.hotel?.bintang ||
                            bookingData.packageId?.hotel?.bintang) && (
                            <div className="flex items-center gap-1 mt-1">
                              {[
                                ...Array(
                                  paketWisata?.hotel?.bintang ||
                                    bookingData.packageId?.hotel?.bintang
                                ),
                              ].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-500 text-yellow-500"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {(paketWisata?.armada || bookingData.packageId?.armada) && (
                      <div className="flex items-start gap-2">
                        <Bus className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Transportasi</div>
                          <div className="text-sm text-muted-foreground">
                            {paketWisata?.armada?.nama ||
                              bookingData.packageId?.armada?.nama}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {paketWisata?.armada?.merek ||
                              bookingData.packageId?.armada?.merek}{" "}
                            - Kapasitas{" "}
                            {(() => {
                              const kapasitas =
                                paketWisata?.armada?.kapasitas ||
                                bookingData.packageId?.armada?.kapasitas;
                              return Array.isArray(kapasitas)
                                ? kapasitas[0]
                                : kapasitas;
                            })()}{" "}
                            orang
                          </div>
                        </div>
                      </div>
                    )}
                    {(paketWisata?.consume ||
                      bookingData.packageId?.consume) && (
                      <div className="flex items-start gap-2">
                        <Utensils className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Konsumsi</div>
                          <div className="text-sm text-muted-foreground">
                            {paketWisata?.consume?.nama ||
                              bookingData.packageId?.consume?.nama}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(paketWisata?.include || bookingData.packageId?.include) &&
                  ((paketWisata?.include?.length ?? 0) > 0 ||
                    (bookingData.packageId?.include?.length ?? 0) > 0) && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">
                          Fasilitas Termasuk:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(
                            paketWisata?.include ||
                            bookingData.packageId?.include
                          )
                            ?.slice(0, 6)
                            .map((item: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-muted-foreground">
                                  {item}
                                </span>
                              </div>
                            ))}
                          {(
                            paketWisata?.include ||
                            bookingData.packageId?.include
                          )?.length > 6 && (
                            <div className="text-sm text-muted-foreground">
                              +{" "}
                              {(
                                paketWisata?.include ||
                                bookingData.packageId?.include
                              ).length - 6}{" "}
                              fasilitas lainnya
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informasi Keberangkatan */}
            <Card className="shadow-md">
              <CardHeader className="pb-3 bg-primary/5 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Informasi Keberangkatan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Pembayaran Terkonfirmasi</span>
                  </h3>
                  <p className="text-sm text-green-700">
                    Pembayaran Anda telah dikonfirmasi. E-Voucher ini berlaku
                    untuk perjalanan Anda.
                  </p>
                  {bookingData.paymentDate && (
                    <p className="text-xs text-green-600 mt-1">
                      Dibayar: {formatDateTime(bookingData.paymentDate)}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Tanggal Keberangkatan
                    </div>
                    <div className="font-medium">
                      {formatDate(
                        bookingData.tanggalAwal ||
                          bookingData.selectedSchedule?.tanggalAwal ||
                          bookingData.schedule?.tanggalAwal
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Tanggal Pulang
                    </div>
                    <div className="font-medium">
                      {formatDate(
                        bookingData.tanggalAkhir ||
                          bookingData.selectedSchedule?.tanggalAkhir ||
                          bookingData.schedule?.tanggalAkhir
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Waktu Kumpul
                    </div>
                    <div className="font-medium">07:30 WIB</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Lokasi Kumpul
                    </div>
                    <div className="font-medium">
                      Kantor Travedia - Jl. Pahlawan No. 123, Tangerang
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Total Biaya
                    </div>
                    <div className="font-medium text-primary">
                      {formatCurrency(
                        bookingData.totalAmount || bookingData.harga
                      )}
                    </div>
                  </div>
                </div>

                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">
                    Persiapan Keberangkatan
                  </AlertTitle>
                  <AlertDescription className="text-amber-700">
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Datang 30 menit sebelum waktu keberangkatan</li>
                      <li>Bawa kartu identitas (KTP/SIM/Passport)</li>
                      <li>Siapkan e-voucher dalam bentuk digital atau cetak</li>
                      <li>Hubungi tour guide jika ada kendala</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="bg-primary/5 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Tour Guide Anda
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      <img
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23e5e7eb'/%3E%3Cpath d='M24 12c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6zm0 20c-4.4 0-8 1.8-8 4v2h16v-2c0-2.2-3.6-4-8-4z' fill='%236b7280'/%3E%3C/svg%3E"
                        alt="Tour Guide"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">Budi Santoso</div>
                      <div className="text-sm text-muted-foreground">
                        +62 812-3456-7890
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Tour Guide Berpengalaman
                      </div>
                    </div>
                  </div>
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

            {/* Opsi Tindakan */}
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-primary/5 border-b">
                <CardTitle className="text-lg">Opsi & Bantuan</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${
                      bookingData.customId || bookingData.bookingId
                    }&margin=20`;
                    window.open(url, "_blank");
                  }}
                >
                  <Download className="h-4 w-4" />
                  Unduh QR Code Besar
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4" />
                  Cetak E-Voucher
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => navigate(`/booking-detail/${bookingId}`)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Detail Pemesanan
                </Button>
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => navigate(`/paket-wisata`)}
                >
                  <ChevronRight className="h-4 w-4" />
                  Lihat Paket Wisata Lainnya
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contact Card */}
            <Card className="shadow-md bg-red-50 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Kontak Darurat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-red-700">
                  <p className="font-medium">Tour Guide: +62 812-3456-7890</p>
                  <p>Customer Service 24/7: +62 812-3456-789</p>
                  <p>Email: emergency@travedia.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Apa yang Harus Dibawa?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Kartu identitas (KTP/SIM/Passport)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>E-voucher ini (digital atau cetak)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Pakaian sesuai destinasi dan cuaca</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Obat-obatan pribadi jika ada</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Kamera untuk dokumentasi</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kebijakan Perjalanan</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Pembatalan gratis hingga 7 hari sebelum keberangkatan</li>
                <li>
                  • Reschedule dapat dilakukan maksimal 3 hari sebelum
                  keberangkatan
                </li>
                <li>
                  • Keterlambatan peserta dapat mengakibatkan perubahan
                  itinerary
                </li>
                <li>
                  • Travedia tidak bertanggung jawab atas kehilangan barang
                  pribadi
                </li>
                <li>
                  • Ikuti instruksi tour guide untuk keamanan dan kenyamanan
                  bersama
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
