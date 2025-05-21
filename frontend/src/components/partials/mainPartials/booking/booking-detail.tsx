// booking-detail.tsx (perbaikan)
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
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
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Komponen untuk menampilkan langkah-langkah alur pemesanan
const BookingSteps = () => {
  const currentStep = 2 // Detail pemesanan adalah langkah kedua

  return (
    <div className="mb-8 relative">
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep > 1 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
          </div>
          <span className="text-xs mt-2 text-center">Pemesanan</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
          </div>
          <span className="text-xs mt-2 text-center">Detail</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 3 ? <CheckCircle className="h-5 w-5" /> : "3"}
          </div>
          <span className="text-xs mt-2 text-center">Pembayaran</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 4 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 4 ? <CheckCircle className="h-5 w-5" /> : "4"}
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

// Status pemesanan
type BookingStatus = "pending" | "pending_verification" | "confirmed" | "completed" | "cancelled"

// Komponen untuk menampilkan status pemesanan
const BookingStatusBadge = ({ status }: { status: BookingStatus }) => {
  const statusConfig = {
    pending: { label: "Menunggu Pembayaran", color: "bg-yellow-500 hover:bg-yellow-600" },
    pending_verification: { label: "Verifikasi Pembayaran", color: "bg-blue-500 hover:bg-blue-600" },
    confirmed: { label: "Pembayaran Dikonfirmasi", color: "bg-green-500 hover:bg-green-600" },
    completed: { label: "Perjalanan Selesai", color: "bg-blue-500 hover:bg-blue-600" },
    cancelled: { label: "Dibatalkan", color: "bg-red-500 hover:bg-red-600" },
  }

  const config = statusConfig[status]

  return <Badge className={config.color}>{config.label}</Badge>
}

// Komponen untuk menampilkan informasi kontak
const ContactInfo = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <Phone className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-medium">Telepon</h4>
          <p className="text-sm text-muted-foreground">+62 812-3456-789</p>
          <p className="text-sm text-muted-foreground">Senin - Jumat, 08:00 - 17:00 WIB</p>
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
        </div>
      </div>
    </div>
  )
}

export default function BookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const { getBookingById } = useBooking()
  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null)
  const [bookingData, setBookingData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ambil data booking dan paket wisata
  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setIsLoading(true)

        if (!bookingId) {
          throw new Error("ID booking tidak ditemukan")
        }

        // Coba ambil data booking dari API
        try {
          const bookingDetail = await getBookingById(bookingId)
          if (bookingDetail) {
            // Update status ke confirmed jika datang dari halaman payment success
            const isFromPayment = new URLSearchParams(window.location.search).get('payment_success');
            if (isFromPayment === 'true' && (bookingDetail.status === 'pending' || bookingDetail.status === 'pending_verification')) {
              bookingDetail.status = 'confirmed';
              bookingDetail.paymentDate = new Date().toISOString();
              // Dalam kasus nyata, ini akan diupdate melalui API
              // Karena ini simulasi, kita akan langsung update localStorage juga
              const lastBooking = localStorage.getItem('lastBooking');
              if (lastBooking) {
                const parsedBooking = JSON.parse(lastBooking);
                parsedBooking.status = 'confirmed';
                parsedBooking.paymentStatus = 'settlement';
                parsedBooking.paymentDate = new Date().toISOString();
                localStorage.setItem('lastBooking', JSON.stringify(parsedBooking));
              }
            }
            
            setBookingData(bookingDetail)
            
            // Jika ada ID paket, ambil detail paket
            if (bookingDetail.packageInfo && bookingDetail.packageInfo.id) {
              const packageData = await TourPackageService.getPackageById(bookingDetail.packageInfo.id)
              setPaketWisata(packageData)
            }
            return
          }
        } catch (err) {
          console.error("Error fetching booking detail from API:", err)
          
          // Fallback ke data dummy/localStorage
          const lastBooking = localStorage.getItem('lastBooking')
          if (lastBooking) {
            try {
              const parsedBooking = JSON.parse(lastBooking)
              if (parsedBooking.bookingId === bookingId) {
                // Update status ke confirmed jika datang dari halaman payment success
                const isFromPayment = new URLSearchParams(window.location.search).get('payment_success');
                if (isFromPayment === 'true' && (parsedBooking.status === 'pending' || parsedBooking.status === 'pending_verification')) {
                  parsedBooking.status = 'confirmed';
                  parsedBooking.paymentDate = new Date().toISOString();
                  localStorage.setItem('lastBooking', JSON.stringify(parsedBooking));
                }
                
                setBookingData(parsedBooking)
                
                // Jika ada ID paket, ambil detail paket
                if (parsedBooking.packageInfo && parsedBooking.packageInfo.id) {
                  const packageData = await TourPackageService.getPackageById(parsedBooking.packageInfo.id)
                  setPaketWisata(packageData)
                }
                return
              }
            } catch (e) {
              console.error("Error parsing lastBooking:", e)
            }
          }
          
          throw new Error("Data booking tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching booking detail:", error)
        setError("Gagal mengambil data pemesanan")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookingDetail()
  }, [bookingId, getBookingById, user])

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Berhasil disalin!",
          description: "Teks telah disalin ke clipboard"
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
  }
  
  // Handle download
  const handleDownload = () => {
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
  };

  // Handle proceeding to payment
  const handleProceedToPayment = () => {
    // Redirect to booking-success page for payment (alur 2->3)
    navigate(`/booking-success/${bookingId}`);
  };
  
  // Handle share
  const handleShare = async () => {
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
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-muted rounded mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  // Jika terjadi error, tampilkan pesan error
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
      <BookingSteps />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Konten Utama */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-l-4 border-l-primary">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Detail Pemesanan</h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-muted-foreground">Booking ID: {bookingData.bookingId}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 p-0"
                    onClick={() => copyToClipboard(bookingData.bookingId)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <BookingStatusBadge status={bookingData.status} />
            </div>
          </div>

          {/* Status-specific notification alerts */}
            {bookingData.status === "confirmed" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Pembayaran Berhasil</AlertTitle>
                <AlertDescription className="text-green-700">
                  Pembayaran Anda telah dikonfirmasi. E-voucher telah dikirim ke email Anda dan dapat diunduh di halaman
                  ini.
                </AlertDescription>
              </Alert>
            )}

            {bookingData.status === "pending_verification" && (
              <Alert className="bg-blue-50 border-blue-200">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Verifikasi Pembayaran</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <p className="mb-2">Pembayaran Anda sedang diverifikasi. Proses ini akan selesai dalam beberapa menit.</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 bg-blue-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-1/2"></div>
                    </div>
                    <span className="text-xs">Sedang diproses</span>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {bookingData.status === "pending" && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <Clock className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Menunggu Pembayaran</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  <p className="mb-2">Silakan melakukan pembayaran untuk menyelesaikan transaksi.</p>
                  <Button 
                    className="mt-2"
                    onClick={handleProceedToPayment}
                  >
                    Lanjutkan ke Pembayaran
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {bookingData.status === "completed" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Perjalanan Selesai</AlertTitle>
                <AlertDescription className="text-green-700">
                  Terima kasih telah menggunakan layanan kami. Kami harap Anda puas dengan perjalanan Anda.
                </AlertDescription>
              </Alert>
            )}

            {bookingData.status === "cancelled" && (
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
                          src={paketWisata?.foto?.[0] }
                          alt={bookingData.packageInfo.nama}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "";
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{bookingData.packageInfo.nama}</h3>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {formatDate(bookingData.schedule.tanggalAwal)} - {formatDate(bookingData.schedule.tanggalAkhir)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{bookingData.packageInfo.destination}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{bookingData.jumlahPeserta} orang</span>
                          </div>
                          {paketWisata && paketWisata.durasi && (
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
                              <div className="text-sm text-muted-foreground">{paketWisata.hotel.nama}</div>
                            </div>
                          </div>
                        )}
                        {paketWisata.armada && (
                          <div className="flex items-start gap-2">
                            <Bus className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium">Transportasi</div>
                              <div className="text-sm text-muted-foreground">{paketWisata.armada.nama}</div>
                            </div>
                          </div>
                        )}
                        {paketWisata.consume && (
                          <div className="flex items-start gap-2">
                            <Utensils className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium">Konsumsi</div>
                              <div className="text-sm text-muted-foreground">{paketWisata.consume.nama}</div>
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
                        <div className="text-sm text-muted-foreground">Nama Lengkap</div>
                        <div>{bookingData.customerInfo.nama}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div>{bookingData.customerInfo.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Nomor Telepon</div>
                        <div>{bookingData.customerInfo.telepon}</div>
                      </div>
                      {bookingData.customerInfo.alamat && (
                        <div>
                          <div className="text-sm text-muted-foreground">Alamat</div>
                          <div>{bookingData.customerInfo.alamat}</div>
                        </div>
                      )}
                    </div>
  
                    {bookingData.customerInfo.catatan && (
                      <>
                        <Separator />
                        <div>
                          <div className="text-sm text-muted-foreground">Catatan</div>
                          <div>{bookingData.customerInfo.catatan}</div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
  
                {/* Informasi Pembayaran */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Informasi Pembayaran</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Tanggal Pemesanan</div>
                        <div>{formatDate(bookingData.bookingDate || bookingData.createdAt)}</div>
                      </div>
                      {bookingData.paymentDate && (
                        <div>
                          <div className="text-sm text-muted-foreground">Tanggal Pembayaran</div>
                          <div>{formatDate(bookingData.paymentDate)}</div>
                        </div>
                      )}
                      {(bookingData.paymentMethod || bookingData.metodePembayaran) && (
                        <div>
                          <div className="text-sm text-muted-foreground">Metode Pembayaran</div>
                          <div>
                            {bookingData.paymentMethod === "bank_transfer" 
                              ? `Transfer Bank ${bookingData.bankName || ""}` 
                              : bookingData.paymentMethod === "midtrans"
                              ? "Payment Gateway Midtrans"
                              : bookingData.metodePembayaran === "dp" 
                              ? "DP 50%" 
                              : bookingData.paymentMethod || bookingData.metodePembayaran || "Midtrans"}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            bookingData.status === "confirmed" || bookingData.status === "completed" 
                              ? "bg-green-500" 
                              : bookingData.status === "pending" 
                                ? "bg-yellow-500"
                                : bookingData.status === "pending_verification"
                                ? "bg-blue-500"
                                : "bg-red-500"
                          }`}></div>
                          <span>{
                            bookingData.status === "pending" 
                              ? "Menunggu Pembayaran" 
                              : bookingData.status === "pending_verification"
                              ? "Verifikasi Pembayaran"
                              : bookingData.status === "confirmed" 
                              ? "Pembayaran Berhasil" 
                              : bookingData.status === "completed"
                                ? "Perjalanan Selesai"
                                : "Dibatalkan"
                          }</span>
                        </div>
                      </div>
                    </div>
  
                    <Separator />
  
                    <div className="p-4 space-y-2 bg-gray-50 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Harga per orang</span>
                        <span>{formatCurrency(bookingData.packageInfo.harga)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Jumlah peserta</span>
                        <span>x {bookingData.jumlahPeserta}</span>
                      </div>
                      {(bookingData.metodePembayaran === "dp" || bookingData.paymentMethod === "dp") && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Metode Pembayaran</span>
                          <span>DP 50%</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total {(bookingData.metodePembayaran === "dp" || bookingData.paymentMethod === "dp") ? "(DP)" : ""}</span>
                        <span className="text-primary">{formatCurrency(bookingData.totalAmount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
  
                {/* Tombol Aksi untuk tab Detail (hanya jika status pending) */}
                {bookingData.status === "pending" && (
                  <div className="pt-4">
                    <Button 
                      className="w-full"
                      onClick={handleProceedToPayment}
                    >
                      Lanjutkan ke Pembayaran
                    </Button>
                  </div>
                )}
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
                        E-voucher akan tersedia setelah pembayaran berhasil dikonfirmasi. Tunjukkan e-voucher kepada tour guide saat hari keberangkatan.
                      </AlertDescription>
                    </Alert>
  
                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800">Kontak Darurat</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        <p>Untuk keadaan darurat, silakan hubungi:</p>
                        <p>Customer Service: +62 812-3456-789 (24 jam)</p>
                      </AlertDescription>
                    </Alert>
  
                    {/* Fasilitas jika tersedia dari paket wisata */}
                    {paketWisata && paketWisata.include && paketWisata.include.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Fasilitas Termasuk:</h3>
                        <ul className="space-y-2">
                          {paketWisata.include.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                              <span className="text-sm text-muted-foreground">{item}</span>
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
                    <BookingStatusBadge status={bookingData.status} />
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      bookingData.status !== "cancelled" ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                    }`}>
                      {bookingData.status !== "cancelled" ? <CheckCircle className="h-4 w-4" /> : "1"}
                    </div>
                    <div>
                      <div className={`font-medium ${
                        bookingData.status !== "cancelled" ? "text-green-600" : "text-muted-foreground"
                      }`}>
                        Pemesanan Dibuat
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(bookingData.bookingDate || bookingData.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      bookingData.status === "pending_verification" || bookingData.status === "confirmed" || bookingData.status === "completed" 
                        ? "bg-green-100 text-green-600" 
                        : bookingData.status === "pending" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                    }`}>
                      {bookingData.status === "pending_verification" || bookingData.status === "confirmed" || bookingData.status === "completed" 
                        ? <CheckCircle className="h-4 w-4" /> 
                        : "2"}
                    </div>
                    <div>
                      <div className={`font-medium ${
                        bookingData.status === "pending_verification" || bookingData.status === "confirmed" || bookingData.status === "completed" 
                          ? "text-green-600" 
                          : bookingData.status === "pending" 
                            ? "text-primary" 
                            : "text-muted-foreground"
                      }`}>
                        Pembayaran
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {bookingData.status === "pending" 
                          ? "Menunggu Pembayaran" 
                          : bookingData.status === "cancelled" 
                            ? "Dibatalkan" 
                            : bookingData.paymentDate 
                              ? formatDate(bookingData.paymentDate) 
                              : "Dalam proses"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      bookingData.status === "confirmed" || bookingData.status === "completed" 
                        ? "bg-green-100 text-green-600" 
                        : bookingData.status === "pending_verification" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                    }`}>
                      {bookingData.status === "confirmed" || bookingData.status === "completed" 
                        ? <CheckCircle className="h-4 w-4" /> 
                        : "3"}
                    </div>
                    <div>
                      <div className={`font-medium ${
                        bookingData.status === "confirmed" || bookingData.status === "completed" 
                          ? "text-green-600" 
                          : bookingData.status === "pending_verification" 
                            ? "text-primary" 
                            : "text-muted-foreground"
                      }`}>
                        E-Voucher
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {bookingData.status === "confirmed" || bookingData.status === "completed" 
                          ? "E-Voucher Tersedia" 
                          : bookingData.status === "pending_verification" 
                            ? "Verifikasi Pembayaran" 
                            : "Belum Tersedia"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      bookingData.status === "completed" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {bookingData.status === "completed" 
                        ? <CheckCircle className="h-4 w-4" /> 
                        : "4"}
                    </div>
                    <div>
                      <div className={`font-medium ${
                        bookingData.status === "completed" 
                          ? "text-green-600" 
                          : "text-muted-foreground"
                      }`}>
                        Perjalanan Selesai
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {bookingData.status === "completed" 
                          ? "Terima kasih atas kepercayaan Anda" 
                          : formatDate(bookingData.schedule.tanggalAkhir)}
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
                {bookingData.status === "pending" ? (
                  <div className="p-4">
                    <Button 
                      className="w-full bg-primary mb-3" 
                      onClick={handleProceedToPayment}
                    >
                      Lanjutkan ke Pembayaran
                    </Button>
                    <div className="text-sm text-muted-foreground text-center">
                      Lakukan pembayaran untuk mengonfirmasi pemesanan Anda
                    </div>
                  </div>
                ) : bookingData.status === "confirmed" || bookingData.status === "completed" ? (
                  <div className="p-4">
                    <Button 
                      className="w-full bg-primary mb-3" 
                      onClick={() => navigate(`/e-voucher/${bookingData.bookingId}`)}
                    >
                      Lihat E-Voucher
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                    <div className="text-sm text-muted-foreground text-center">
                      Tunjukkan e-voucher kepada tour guide saat hari keberangkatan
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex justify-center py-3">
                      <Clock className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="text-sm text-muted-foreground text-center">
                      Pembayaran Anda sedang diproses atau pemesanan telah dibatalkan
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
                <CardDescription>Tim customer service kami siap membantu Anda</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 p-6">
                <ContactInfo />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }