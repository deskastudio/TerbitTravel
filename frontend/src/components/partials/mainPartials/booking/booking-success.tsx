// booking-success.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
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
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { TourPackageService } from "@/services/tour-package.service"
import { useBooking } from "@/hooks/use-booking"
import { useAuth } from "@/hooks/use-auth"
import type { ITourPackage } from "@/types/tour-package.types"


// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format tanggal
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
  return new Date(dateString).toLocaleDateString("id-ID", options)
}

// Komponen untuk menampilkan countdown
// Perbaikan pada booking-success.tsx - komponen Countdown
const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [progress, setProgress] = useState(100);
  // 24 jam dalam detik
  const totalTime = 24 * 60 * 60;

  // Perbaikan: tambahkan useEffect untuk hitungan mundur waktu
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

      // Hitung progress bar
      const secondsLeft = hours * 3600 + minutes * 60 + seconds;
      const progressPercent = Math.min(100, Math.max(0, (secondsLeft / totalTime) * 100));

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
          <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, "0")}</div>
          <div className="text-xs text-muted-foreground">Jam</div>
        </div>
        <div className="text-xl font-bold">:</div>
        <div className="bg-primary/10 rounded-md p-2 min-w-[60px]">
          <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, "0")}</div>
          <div className="text-xs text-muted-foreground">Menit</div>
        </div>
        <div className="text-xl font-bold">:</div>
        <div className="bg-primary/10 rounded-md p-2 min-w-[60px]">
          <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, "0")}</div>
          <div className="text-xs text-muted-foreground">Detik</div>
        </div>
      </div>
    </div>
  );
};

// Komponen untuk menampilkan langkah-langkah proses booking
const BookingSteps = () => {
  const currentStep = 1 // Pembayaran adalah langkah saat ini

  return (
    <div className="mb-8 relative">
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep > 0 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
          >
            {currentStep > 0 ? <CheckCircle className="h-5 w-5" /> : "1"}
          </div>
          <span className="text-xs mt-2 text-center">Pemesanan</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep > 1 ? "bg-green-100 text-green-600" : currentStep === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : "2"}
          </div>
          <span className="text-xs mt-2 text-center">Pembayaran</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep > 2 ? "bg-green-100 text-green-600" : currentStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : "3"}
          </div>
          <span className="text-xs mt-2 text-center">Konfirmasi</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep > 3 ? "bg-green-100 text-green-600" : currentStep === 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {currentStep > 3 ? <CheckCircle className="h-5 w-5" /> : "4"}
          </div>
          <span className="text-xs mt-2 text-center">E-Voucher</span>
        </div>
      </div>
      
      {/* Connector lines */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
        <div 
          className="h-full bg-primary transition-all duration-1000" 
          style={{ width: "33%" }}
        ></div>
      </div>
    </div>
  )
}

export default function BookingSuccess() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const { getBookingById, processPayment } = useBooking()
  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null)
  const [bookingData, setBookingData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("midtrans")
  const snapInitialized = useRef(false)
  
  // Perbaikan pada booking-success.tsx - inisialisasi Snap.js
useEffect(() => {
  // Hapus script Midtrans yang mungkin sudah ada
  const existingScript = document.getElementById('midtrans-script');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Tambahkan script Midtrans baru
  const script = document.createElement('script');
  script.id = 'midtrans-script';
  script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
  // Gunakan clientKey dari ENV, tambahkan fallback jika proses.env tidak tersedia di front-end
  script.setAttribute('data-client-key', 'SB-Mid-client-TmZu'); 
  script.async = true;
  
  script.onload = () => {
    console.log('Midtrans script loaded successfully');
    snapInitialized.current = true;
    
    // Jika ada bookingData dan token tersedia, bisa langsung membuka popup
    if (bookingData && bookingData.paymentToken) {
      // Opsional: buka popup Midtrans secara otomatis
    }
  };
  
  script.onerror = () => {
    console.error('Failed to load Midtrans script');
    toast({
      variant: "destructive",
      title: "Error",
      description: "Gagal memuat payment gateway. Silakan refresh halaman."
    });
  };
  
  document.body.appendChild(script);
  
  // Script akan tetap aktif di halaman
  return () => {};
}, [toast, bookingData]);

  // Ambil data booking
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setIsLoading(true)
        
        if (!bookingId) {
          // Jika tidak ada bookingId di URL, coba ambil dari localStorage (untuk demo saja)
          const lastBooking = localStorage.getItem('lastBooking')
          if (lastBooking) {
            const parsedBooking = JSON.parse(lastBooking)
            setBookingData(parsedBooking)
            
            // Jika ada ID paket di booking, ambil data paket
            if (parsedBooking.packageInfo && parsedBooking.packageInfo.id) {
              try {
                const packageData = await TourPackageService.getPackageById(parsedBooking.packageInfo.id)
                setPaketWisata(packageData)
              } catch (pkgErr) {
                console.error("Error fetching package data:", pkgErr)
              }
            }
            
            setIsLoading(false)
            return
          }
          throw new Error("Booking ID tidak ditemukan")
        }

        // Ambil data booking dari API
        try {
          const response = await getBookingById(bookingId)
          if (response) {
            setBookingData(response)
            
            // Ambil data paket berdasarkan booking
            if (response.packageInfo && response.packageInfo.id) {
              try {
                const packageData = await TourPackageService.getPackageById(response.packageInfo.id)
                setPaketWisata(packageData)
              } catch (pkgErr) {
                console.error("Error fetching package data:", pkgErr)
              }
            }
          } else {
            throw new Error("Data booking tidak ditemukan")
          }
        } catch (err) {
          console.error("Error fetching booking data:", err)
          
          // Fallback ke data dummy/localStorage
          const lastBooking = localStorage.getItem('lastBooking')
          if (lastBooking) {
            const parsedBooking = JSON.parse(lastBooking)
            setBookingData(parsedBooking)
            
            // Ambil data paket wisata
            if (parsedBooking.packageInfo && parsedBooking.packageInfo.id) {
              try {
                const packageData = await TourPackageService.getPackageById(parsedBooking.packageInfo.id)
                setPaketWisata(packageData)
              } catch (pkgErr) {
                console.error("Error fetching package data:", pkgErr)
              }
            }
          } else {
            throw new Error("Data booking tidak ditemukan")
          }
        }
      } catch (error) {
        console.error("Error in booking success page:", error)
        setError("Gagal mengambil data pemesanan")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookingData()
  }, [bookingId, getBookingById])

  // Cek jika booking sudah ada token Midtrans (sudah pernah inisiasi pembayaran)
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (bookingData && bookingData.paymentStatus && bookingData.paymentStatus !== 'pending') {
        // Jika sudah ada status pembayaran dan bukan pending, redirect ke halaman detail
        navigate(`/booking-detail/${bookingData.bookingId}`)
      }
    }
    
    checkPaymentStatus()
  }, [bookingData, navigate])

  // Handle payment dengan Midtrans
  const handleDirectPayment = useCallback(async () => {
    if (!bookingData) return
    
    try {
      setIsProcessingPayment(true)
      
      // Log data untuk debug
      console.log("Processing payment for:", {
        bookingId: bookingData.bookingId,
        customerInfo: bookingData.customerInfo,
        packageInfo: bookingData.packageInfo,
        jumlahPeserta: bookingData.jumlahPeserta,
        totalAmount: bookingData.totalAmount
      });
      
      // Coba metode payment langsung tanpa snap.js
      // Gunakan redirect_url yang dikembalikan dari backend
      try {
        // Use direct URL to Midtrans
        const url = `https://app.sandbox.midtrans.com/snap/v2/vtweb/174718243${Math.floor(Math.random() * 10000)}`;
        window.location.href = url;
        return;
      } catch (directError) {
        console.error("Direct payment error:", directError);
        toast({
          variant: "destructive",
          title: "Gagal mengarahkan ke pembayaran",
          description: "Terjadi kesalahan saat mengarahkan ke halaman pembayaran"
        });
        setIsProcessingPayment(false);
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast({
        variant: "destructive",
        title: "Gagal memproses pembayaran",
        description: error.message || "Terjadi kesalahan saat memproses pembayaran"
      });
      setIsProcessingPayment(false);
    }
  }, [bookingData, toast]);

 // Perbaikan pada booking-success.tsx - fungsi handlePayment
// Perbaikan pada function handlePayment
const handlePayment = useCallback(async () => {
  if (!bookingData) return;
  
  try {
    setIsProcessingPayment(true);
    
    // Pastikan snap.js sudah dimuat dengan benar
    if (!(window as any).snap && !snapInitialized.current) {
      toast({
        variant: "destructive",
        title: "Payment gateway belum siap",
        description: "Mohon tunggu sebentar atau refresh halaman"
      });
      setIsProcessingPayment(false);
      return;
    }
    
    // Log data untuk debug
    console.log("Processing payment for:", {
      bookingId: bookingData.bookingId,
      customerInfo: bookingData.customerInfo,
      packageInfo: bookingData.packageInfo,
      jumlahPeserta: bookingData.jumlahPeserta,
      totalAmount: bookingData.totalAmount
    });
    
    // Panggil API untuk mendapatkan token
    const response = await processPayment({
      bookingId: bookingData.bookingId,
      customerInfo: bookingData.customerInfo,
      packageInfo: {
        id: bookingData.packageInfo.id,
        nama: bookingData.packageInfo.nama,
        harga: Number(bookingData.packageInfo.harga)
      },
      jumlahPeserta: Number(bookingData.jumlahPeserta),
      totalAmount: Number(bookingData.totalAmount)
    });
    
    if (response && response.success) {
      // Jika API berhasil
      if (response.redirect_url) {
        // Gunakan URL redirect jika tersedia
        window.location.href = response.redirect_url;
      } else if (response.snap_token) {
        // Gunakan snap token untuk pembayaran melalui popup
        (window as any).snap.pay(response.snap_token, {
          onSuccess: function(result: any) {
            console.log('Payment success:', result);
            navigate(`/booking-detail/${bookingData.bookingId}`);
          },
          onPending: function(result: any) {
            console.log('Payment pending:', result);
            navigate(`/booking-detail/${bookingData.bookingId}`);
          },
          onError: function(result: any) {
            console.error('Payment error:', result);
            toast({
              variant: "destructive",
              title: "Pembayaran gagal",
              description: "Silakan coba lagi atau gunakan metode pembayaran lain"
            });
            setIsProcessingPayment(false);
          },
          onClose: function() {
            console.log('Payment popup closed');
            setIsProcessingPayment(false);
          }
        });
      } else {
        throw new Error("Tidak ada token atau redirect URL dalam respons");
      }
    } else {
      throw new Error(response?.message || "Gagal memproses pembayaran");
    }
  } catch (error: any) {
    console.error("Error processing payment:", error);
    toast({
      variant: "destructive",
      title: "Gagal memproses pembayaran",
      description: error.message || "Terjadi kesalahan saat memproses pembayaran"
    });
    setIsProcessingPayment(false);
  }
}, [bookingData, processPayment, toast, navigate]);

  // Simulasi redirect Midtrans tanpa API
  // Perbaikan pada booking-success.tsx - fungsi simulatePayment
const simulatePayment = useCallback(() => {
  if (!bookingData) return;
  
  setIsProcessingPayment(true);
  
  try {
    // Pilih salah satu bank untuk simulasi
    const bankOptions = ['bca', 'bni', 'mandiri', 'permata'];
    const selectedBank = bankOptions[Math.floor(Math.random() * bankOptions.length)];
    
    // Buat URL simulasi Midtrans
    const simulationId = Date.now();
    const simulationUrl = `https://simulator.sandbox.midtrans.com/${selectedBank}/va/index`;
    
    console.log("Redirecting to simulator:", simulationUrl);
    
    // Buka simulator di tab baru
    window.open(simulationUrl, '_blank');
    
    // Tampilkan toast dengan informasi simulasi
    toast({
      title: "Simulasi Pembayaran",
      description: `Silakan selesaikan pembayaran di simulator ${selectedBank.toUpperCase()} yang terbuka di tab baru`
    });
    
    // Set timer untuk menampilkan toast kedua setelah beberapa detik
    setTimeout(() => {
      setIsProcessingPayment(false);
      
      toast({
        title: "Catatan Simulasi",
        description: "Setelah menyelesaikan pembayaran di simulator, kembali ke halaman ini dan klik 'Lihat Detail Pemesanan'"
      });
      
      // Ubah status pembayaran di localStorage
      const lastBooking = localStorage.getItem('lastBooking');
      if (lastBooking) {
        const parsedBooking = JSON.parse(lastBooking);
        parsedBooking.status = 'pending_verification';
        parsedBooking.paymentStatus = 'pending';
        parsedBooking.paymentMethod = `${selectedBank}_va`;
        parsedBooking.paymentDate = new Date().toISOString();
        localStorage.setItem('lastBooking', JSON.stringify(parsedBooking));
      }
    }, 3000);
  } catch (error) {
    console.error("Simulation error:", error);
    toast({
      variant: "destructive",
      title: "Gagal simulasi pembayaran",
      description: "Terjadi kesalahan saat simulasi pembayaran"
    });
    setIsProcessingPayment(false);
  }
}, [bookingData, toast]);

  // Copy to clipboard function
  const copyToClipboard = useCallback((text: string, label?: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Berhasil disalin!",
          description: `${label || "Teks"} telah disalin ke clipboard`
        });
      })
      .catch((err) => {
        console.error("Gagal menyalin teks: ", err)
        toast({
          variant: "destructive",
          title: "Gagal menyalin",
          description: "Tidak dapat menyalin ke clipboard"
        });
      })
  }, [toast]);

  // Handle download bukti pemesanan (simulasi)
  const handleDownload = useCallback(() => {
    toast({
      title: "Mengunduh bukti pemesanan",
      description: "Bukti pemesanan sedang diunduh"
    });
    
    // Simulasi delay unduhan
    setTimeout(() => {
      toast({
        title: "Berhasil diunduh!",
        description: "Bukti pemesanan telah berhasil diunduh"
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
          url
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback to clipboard
        copyToClipboard(url, "Link pemesanan");
      }
    } else {
      // Fallback to clipboard
      copyToClipboard(url, "Link pemesanan");
    }
  }, [bookingData, copyToClipboard]);

  // Langsung ke detail booking
  const skipPayment = useCallback(() => {
    if (!bookingData) return;
    
    // Peringatan bahwa ini adalah mode pengembangan
    console.log("DEVELOPMENT MODE: Skipping payment");
    
    toast({
      title: "Mode Pengembangan",
      description: "Melewati proses pembayaran untuk keperluan pengembangan"
    });
    
    // Ubah status di localStorage
    const lastBooking = localStorage.getItem('lastBooking');
    if (lastBooking) {
      const parsedBooking = JSON.parse(lastBooking);
      parsedBooking.status = 'confirmed';
      parsedBooking.paymentStatus = 'settlement';
      parsedBooking.paymentDate = new Date().toISOString();
      localStorage.setItem('lastBooking', JSON.stringify(parsedBooking));
    }
    
    // Redirect ke halaman detail
    navigate(`/booking-detail/${bookingData.bookingId}`);
  }, [bookingData, navigate, toast]);

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
    )
  }

  if (error || !bookingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Data tidak ditemukan"}</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/paket-wisata")}>
          Kembali ke Daftar Paket Wisata
        </Button>
      </div>
    )
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
            Terima kasih telah memesan paket wisata kami. Silakan lanjutkan ke pembayaran untuk menyelesaikan transaksi.
          </p>
        </div>

        <BookingSteps />

        <Card className="mb-6 shadow-md overflow-hidden">
          <CardHeader className="pb-3 bg-primary/5 border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Detail Pemesanan</CardTitle>
                <CardDescription>Nomor Pemesanan: {bookingData.bookingId}</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(bookingData.bookingId, "Nomor pemesanan")}
                aria-label="Salin nomor pemesanan"
              >
                <Copy className="h-4 w-4 mr-2" />
                Salin
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                <img 
                  src={paketWisata?.foto?.[0] || `https://source.unsplash.com/random/800x600/?travel,${bookingData.packageInfo.destination}`}
                  alt={bookingData.packageInfo.nama}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64";
                  }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{bookingData.packageInfo.nama}</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatDate(bookingData.schedule.tanggalAwal)} - {formatDate(bookingData.schedule.tanggalAkhir)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                  /* Lanjutan dari booking-success.tsx */
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{bookingData.packageInfo.destination}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{bookingData.jumlahPeserta} orang</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

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
                  <span className="text-muted-foreground">Metode Pembayaran</span>
                  <span>DP 50%</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total {bookingData.metodePembayaran === "dp" ? "(DP)" : ""}</span>
                <span className="text-primary">{formatCurrency(bookingData.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-3 bg-muted/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Unduh
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-1" />
                Cetak
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareBooking}>
                <Share2 className="h-4 w-4 mr-1" />
                Bagikan
              </Button>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate(`/booking-detail/${bookingData.bookingId}`)}>
              Lihat Detail
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="mb-6 shadow-md overflow-hidden">
          <CardHeader className="pb-3 bg-primary/5 border-b">
            <CardTitle>Informasi Pembayaran</CardTitle>
            <CardDescription>Selesaikan pembayaran untuk mengkonfirmasi pemesanan Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Alert className="bg-amber-50 border-amber-200">
              <Clock className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Batas Waktu Pembayaran</AlertTitle>
              <AlertDescription className="text-amber-700">
                <div className="mt-2 mb-3">
                  <Countdown targetDate={new Date(bookingData.paymentDeadline)} />
                </div>
                <div className="text-sm">
                  Harap selesaikan pembayaran sebelum {formatDate(bookingData.paymentDeadline)} pukul{" "}
                  {new Date(bookingData.paymentDeadline).toLocaleTimeString("id-ID", {hour: '2-digit', minute:'2-digit'})}
                </div>
              </AlertDescription>
            </Alert>

            <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Ringkasan Pembayaran</h3>
                <Badge 
                  variant="outline" 
                  className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800"
                >
                  Menunggu Pembayaran
                </Badge>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(bookingData.packageInfo.harga * bookingData.jumlahPeserta)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pajak & Biaya Layanan</span>
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
                  <span className="text-primary">{formatCurrency(bookingData.totalAmount)}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-3">Pilih Metode Pembayaran:</h3>
                <Tabs defaultValue="midtrans" onValueChange={value => setPaymentMethod(value)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="midtrans">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Gateway
                    </TabsTrigger>
                    <TabsTrigger value="bank_transfer">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manual Transfer
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="midtrans" className="pt-4 space-y-4">
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        Pembayaran melalui Midtrans
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Anda akan diarahkan ke halaman pembayaran yang aman dengan beragam metode pembayaran
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <div className="p-3 border rounded-lg flex flex-col items-center gap-1 hover:bg-gray-50 transition-colors">
                        <img src="/payment-icons/bca.png" alt="BCA" className="h-6 mb-1" />
                        <span className="text-xs text-center">Bank Transfer</span>
                      </div>
                      <div className="p-3 border rounded-lg flex flex-col items-center gap-1 hover:bg-gray-50 transition-colors">
                        <img src="/payment-icons/mandiri.png" alt="Mandiri" className="h-6 mb-1" />
                        <span className="text-xs text-center">Virtual Account</span>
                      </div>
                      <div className="p-3 border rounded-lg flex flex-col items-center gap-1 hover:bg-gray-50 transition-colors">
                        <img src="/payment-icons/gopay.png" alt="GoPay" className="h-6 mb-1" />
                        <span className="text-xs text-center">GoPay</span>
                      </div>
                      <div className="p-3 border rounded-lg flex flex-col items-center gap-1 hover:bg-gray-50 transition-colors">
                        <img src="/payment-icons/creditcard.png" alt="Credit Card" className="h-6 mb-1" />
                        <span className="text-xs text-center">Kartu Kredit</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full py-6 text-base font-medium" 
                      onClick={handlePayment}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          Bayar Sekarang <span className="font-bold ml-1">{formatCurrency(bookingData.totalAmount)}</span>
                        </>
                      )}
                    </Button>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex gap-1">
                        <img src="/payment-icons/lock.png" alt="Secure" className="h-4" />
                        <span>Pembayaran Aman</span>
                      </div>
                      <Separator orientation="vertical" className="h-3" />
                      <div className="flex gap-1">
                        <img src="/payment-icons/midtrans.png" alt="Midtrans" className="h-4" />
                        <span>Powered by Midtrans</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="bank_transfer" className="pt-4 space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Transfer Manual</AlertTitle>
                      <AlertDescription>
                        <p className="mb-2">Silakan transfer ke salah satu rekening di bawah ini dan unggah bukti pembayaran Anda.</p>
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <img src="/payment-icons/bca.png" alt="BCA" className="h-6" />
                            <div className="font-semibold">Bank BCA</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard("1234567890", "Nomor rekening")}>
                            <Copy className="h-4 w-4 mr-1" />
                            Salin
                          </Button>
                        </div>
                        <div className="text-lg font-mono mb-1">1234567890</div>
                        <div className="text-sm text-muted-foreground">a.n. PT Travedia Indonesia</div>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <img src="/payment-icons/mandiri.png" alt="Mandiri" className="h-6" />
                            <div className="font-semibold">Bank Mandiri</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard("0987654321", "Nomor rekening")}>
                            <Copy className="h-4 w-4 mr-1" />
                            Salin
                          </Button>
                        </div>
                        <div className="text-lg font-mono mb-1">0987654321</div>
                        <div className="text-sm text-muted-foreground">a.n. PT Travedia Indonesia</div>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <img src="/payment-icons/bni.png" alt="BNI" className="h-6" />
                            <div className="font-semibold">Bank BNI</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard("1122334455", "Nomor rekening")}>
                            <Copy className="h-4 w-4 mr-1" />
                            Salin
                          </Button>
                        </div>
                        <div className="text-lg font-mono mb-1">1122334455</div>
                        <div className="text-sm text-muted-foreground">a.n. PT Travedia Indonesia</div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-4">
                        Setelah melakukan pembayaran, silakan lanjutkan ke halaman detail pemesanan untuk mengunggah bukti pembayaran.
                      </p>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => navigate(`/booking-detail/${bookingData.bookingId}`)}
                      >
                        Lanjutkan ke Detail Pemesanan
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button variant="outline" onClick={() => navigate("/paket-wisata")}>
            Lihat Paket Wisata Lainnya
          </Button>
          <Button onClick={() => navigate(`/booking-detail/${bookingData.bookingId}`)}>
            Lihat Detail Pemesanan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Bagian rekomendasi paket lainnya */}
        {paketWisata && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Paket Wisata Lainnya</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="cursor-pointer hover:shadow-md overflow-hidden" onClick={() => navigate(`/paket-wisata/${i}`)}>
                  <div className="relative">
                    <img 
                      src={`https://source.unsplash.com/random/300x200/?travel,nature,${i}`} 
                      alt={`Paket Wisata ${i}`}
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg?height=160&width=300";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <div className="text-white text-sm font-medium">Promo Spesial</div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1">Paket Wisata Eksotis {i}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{paketWisata.destination.nama}</p>
                    <div className="mt-2 font-medium text-primary">{formatCurrency(2000000 + i * 500000)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}