// e-voucher.tsx
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
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

// Komponen untuk menampilkan langkah-langkah alur pemesanan
const BookingSteps = () => {
  const currentStep = 4 // E-Voucher adalah langkah keempat

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
              currentStep > 2 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
          </div>
          <span className="text-xs mt-2 text-center">Detail</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep > 3 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
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
          style={{ width: "100%" }}
        ></div>
      </div>
    </div>
  )
}

// Komponen untuk menampilkan QR Code e-voucher
const EVoucher = ({
  bookingId,
  customerName,
  packageName,
  date,
  destination,
  jumlahPeserta
}: {
  bookingId: string
  customerName: string
  packageName: string
  date: string
  destination: string
  jumlahPeserta: number
}) => {
  const { toast } = useToast()
  
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
      title: "Mengunduh E-Voucher",
      description: "E-Voucher Anda sedang diunduh"
    });
    
    // Simulasi delay unduhan
    setTimeout(() => {
      toast({
        title: "Berhasil diunduh!",
        description: "E-Voucher telah berhasil diunduh"
      });
    }, 2000);
  };
  
  // Handle share
  const handleShare = async () => {
    const url = window.location.href;
    const title = "E-Voucher Travedia";
    const text = `Saya telah memesan paket wisata ${packageName} dengan nomor booking ${bookingId}. Lihat E-Voucher saya!`;

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
  
  return (
    <div className="border rounded-lg p-6 bg-white shadow-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mt-16 -mr-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -mb-12 -ml-12"></div>
      
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold">E-Voucher Travedia</h3>
        <p className="text-sm text-muted-foreground">Tunjukkan voucher ini kepada tour guide kami</p>
      </div>

      <div className="flex justify-center mb-4">
        <div className="p-2 border border-dashed border-primary/50 rounded-lg relative">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${bookingId}`} 
            alt="QR Code" 
            className="border p-2 rounded-lg"
            onError={(e) => {
              // Fallback jika API QR tidak berfungsi
              (e.target as HTMLImageElement).src = "/placeholder.svg?height=180&width=180";
            }}
          />
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border border-primary/50 rounded-full"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border border-primary/50 rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border border-primary/50 rounded-full"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border border-primary/50 rounded-full"></div>
        </div>
      </div>

      <div className="space-y-3 text-center mb-4">
        <div>
          <div className="text-sm text-muted-foreground">Booking ID</div>
          <div className="font-bold flex items-center justify-center gap-2">
            {bookingId}
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(bookingId)}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Nama</div>
          <div>{customerName}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Paket</div>
          <div className="text-sm">{packageName}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Destinasi</div>
          <div className="text-sm">{destination}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Tanggal</div>
          <div className="text-sm">{date}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Jumlah Peserta</div>
          <div className="text-sm">{jumlahPeserta} orang</div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" className="gap-1" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          <span>Unduh</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          <span>Cetak</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          <span>Bagikan</span>
        </Button>
      </div>
    </div>
  )
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

export default function EVoucherPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const { getBookingById, getBookingVoucher } = useBooking()
  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null)
  const [bookingData, setBookingData] = useState<any>(null)
  const [voucherData, setVoucherData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ambil data booking dan voucher
  useEffect(() => {
    const fetchBookingAndVoucher = async () => {
      try {
        setIsLoading(true)

        if (!bookingId) {
          throw new Error("ID booking tidak ditemukan")
        }

        // Coba ambil data booking dari API
        try {
          // Ambil detail booking
          const bookingDetail = await getBookingById(bookingId)
          if (!bookingDetail) {
            throw new Error("Data booking tidak ditemukan")
          }

          // Periksa status booking, hanya confirmed atau completed yang bisa mendapatkan e-voucher
          if (bookingDetail.status !== "confirmed" && bookingDetail.status !== "completed") {
            throw new Error("E-Voucher hanya tersedia untuk pemesanan yang telah dikonfirmasi pembayarannya")
          }
          
          setBookingData(bookingDetail)
          
          // Jika ada ID paket, ambil detail paket
          if (bookingDetail.packageInfo && bookingDetail.packageInfo.id) {
            const packageData = await TourPackageService.getPackageById(bookingDetail.packageInfo.id)
            setPaketWisata(packageData)
          }

          // Ambil data voucher
          try {
            const voucher = await getBookingVoucher(bookingId)
            setVoucherData(voucher)
          } catch (voucherErr) {
            console.error("Error fetching voucher data:", voucherErr)
            // Tetap lanjutkan meskipun gagal mengambil data voucher spesifik
          }
        } catch (err) {
          console.error("Error fetching booking detail or voucher:", err)
          
          // Fallback ke data dummy/localStorage
          const lastBooking = localStorage.getItem('lastBooking')
          if (lastBooking) {
            try {
              const parsedBooking = JSON.parse(lastBooking)
              if (parsedBooking.bookingId === bookingId) {
                // Periksa status booking, hanya confirmed atau completed yang bisa mendapatkan e-voucher
                if (parsedBooking.status !== "confirmed" && parsedBooking.status !== "completed") {
                  throw new Error("E-Voucher hanya tersedia untuk pemesanan yang telah dikonfirmasi pembayarannya")
                }
                
                setBookingData(parsedBooking)
                
                // Jika ada ID paket, ambil detail paket
                if (parsedBooking.packageInfo && parsedBooking.packageInfo.id) {
                  const packageData = await TourPackageService.getPackageById(parsedBooking.packageInfo.id)
                  setPaketWisata(packageData)
                }
                
                // Set voucher data dummy
                setVoucherData({
                  voucherUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`,
                  voucherCode: bookingId
                })
                return
              }
            } catch (e) {
              console.error("Error parsing lastBooking:", e)
              throw e
            }
          }
          
          throw new Error("Data booking tidak ditemukan atau belum dikonfirmasi pembayarannya");
        }
      } catch (error: any) {
        console.error("Error fetching booking and voucher:", error)
        setError(error.message || "Gagal mengambil data e-voucher")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookingAndVoucher()
  }, [bookingId, getBookingById, getBookingVoucher])

  // Jika masih loading, tampilkan skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-muted rounded mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
          <div className="mt-8 mb-8 w-64 h-64 bg-muted rounded-lg mx-auto"></div>
          <div className="h-4 w-40 bg-muted rounded mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded mx-auto mb-4"></div>
          <div className="h-4 w-36 bg-muted rounded mx-auto mb-4"></div>
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
        <Button variant="outline" className="mt-4" onClick={() => navigate(`/booking-detail/${bookingId}`)}>
          Kembali ke Detail Pemesanan
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
          onClick={() => navigate(`/booking-detail/${bookingId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Detail Pemesanan</span>
        </Button>
      </div>

      {/* Menampilkan alur booking (progress steps) */}
      <BookingSteps />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">E-Voucher Perjalanan Anda</h1>
          <p className="text-muted-foreground">
            Tunjukkan E-Voucher ini kepada tour guide kami saat hari keberangkatan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Konten Utama: E-Voucher */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle>E-Voucher Travedia</CardTitle>
                <CardDescription>
                  Voucher Elektronik untuk Paket Wisata Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <EVoucher
                  bookingId={bookingData.bookingId}
                  customerName={bookingData.customerInfo.nama}
                  packageName={bookingData.packageInfo.nama}
                  date={`${formatDate(bookingData.schedule.tanggalAwal)} - ${formatDate(bookingData.schedule.tanggalAkhir)}`}
                  destination={bookingData.packageInfo.destination}
                  jumlahPeserta={bookingData.jumlahPeserta}
                />
              </CardContent>
              <CardFooter className="bg-muted/50 p-4">
                <Alert className="w-full bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Penting</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Simpan E-Voucher ini dengan baik. Harap datang 30 menit sebelum waktu keberangkatan.
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>

            {/* Informasi Paket */}
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Informasi Paket Wisata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                    <img 
                      src={paketWisata?.foto?.[0] || `/placeholder.svg?height=64&width=64`}
                      alt={bookingData.packageInfo.nama}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64";
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informasi Keberangkatan */}
            <Card className="shadow-md">
              <CardHeader className="pb-3 bg-primary/5 border-b">
                <CardTitle className="text-lg">Informasi Keberangkatan</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Pembayaran Terkonfirmasi</span>
                  </h3>
                  <p className="text-sm text-green-700">
                    Pembayaran Anda telah dikonfirmasi. E-Voucher ini berlaku untuk perjalanan Anda.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Tanggal Keberangkatan</div>
                    <div className="font-medium">{formatDate(bookingData.schedule.tanggalAwal)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Tanggal Pulang</div>
                    <div className="font-medium">{formatDate(bookingData.schedule.tanggalAkhir)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Waktu Kumpul</div>
                    <div className="font-medium">07:30 WIB</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Lokasi Kumpul</div>
                    <div className="font-medium">Kantor Travedia - Jl. Pahlawan No. 123, Tangerang</div>
                  </div>
                </div>

                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Penting!</AlertTitle>
                  <AlertDescription className="text-amber-700">
                  Mohon datang 30 menit sebelum waktu keberangkatan untuk proses registrasi. Pastikan membawa kartu identitas dan e-voucher ini.
                  </AlertDescription>
                </Alert>
                
                {/* Tour Guide Info (Hanya contoh) */}
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Tour Guide Anda</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      <img 
                        src="/placeholder.svg?height=48&width=48" 
                        alt="Tour Guide" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">Budi Santoso</div>
                      <div className="text-sm text-muted-foreground">+62 812-3456-7890</div>
                    </div>
                  </div>
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

            {/* Opsi Tindakan */}
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-primary/5 border-b">
                <CardTitle className="text-lg">Opsi</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={() => {
                    const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${bookingData.bookingId}`;
                    window.open(url, '_blank');
                  }}
                >
                  <Download className="h-4 w-4" />
                  Unduh QR Code
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}