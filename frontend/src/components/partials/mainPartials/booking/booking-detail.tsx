// booking-detail.tsx
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
  ChevronDown,
  Copy,
  Camera,
  Upload,
  FileText,
  ExternalLink,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

// Status pemesanan
type BookingStatus = "pending" | "pending_verification" | "confirmed" | "completed" | "cancelled"

// Data placeholder untuk itinerary
const placeholderItinerary = [
  {
    hari: 1,
    aktivitas: [
      {
        waktu: "08:00 - 10:00",
        kegiatan: "Penjemputan di Lokasi",
        deskripsi: "Penjemputan oleh tour guide dan langsung menuju hotel untuk check-in.",
      },
      {
        waktu: "12:00 - 13:00",
        kegiatan: "Makan Siang",
        deskripsi: "Makan siang di restoran lokal dengan menu khas daerah.",
      },
      {
        waktu: "14:00 - 17:00",
        kegiatan: "Mengunjungi Objek Wisata",
        deskripsi: "Mengunjungi objek wisata utama di daerah.",
      },
      {
        waktu: "18:00 - 19:30",
        kegiatan: "Makan Malam",
        deskripsi: "Makan malam di restoran hotel atau restoran lokal.",
      },
    ],
  },
  {
    hari: 2,
    aktivitas: [
      {
        waktu: "07:00 - 08:00",
        kegiatan: "Sarapan di Hotel",
        deskripsi: "Sarapan pagi dengan menu internasional dan lokal.",
      },
      {
        waktu: "09:00 - 12:00",
        kegiatan: "Mengunjungi Objek Wisata",
        deskripsi: "Mengunjungi objek wisata utama di daerah.",
      },
      {
        waktu: "12:00 - 13:00",
        kegiatan: "Makan Siang",
        deskripsi: "Makan siang di restoran lokal.",
      },
      {
        waktu: "14:00 - 16:00",
        kegiatan: "Aktivitas Bebas",
        deskripsi: "Waktu bebas untuk berbelanja atau bersantai.",
      },
      {
        waktu: "18:00 - 19:30",
        kegiatan: "Makan Malam",
        deskripsi: "Makan malam di restoran hotel atau restoran lokal.",
      },
    ],
  },
  {
    hari: 3,
    aktivitas: [
      {
        waktu: "07:00 - 08:00",
        kegiatan: "Sarapan di Hotel",
        deskripsi: "Sarapan pagi dengan menu internasional dan lokal.",
      },
      {
        waktu: "09:00 - 11:00",
        kegiatan: "Check-out dan Persiapan Pulang",
        deskripsi: "Check-out dari hotel dan persiapan untuk perjalanan pulang.",
      },
      {
        waktu: "11:00 - 12:00",
        kegiatan: "Perjalanan Pulang",
        deskripsi: "Perjalanan kembali ke lokasi awal.",
      },
    ],
  },
]

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

// Komponen untuk menampilkan QR Code e-voucher
const EVoucher = ({
  bookingId,
  customerName,
  packageName,
  date,
}: {
  bookingId: string
  customerName: string
  packageName: string
  date: string
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

      <div className="space-y-2 text-center">
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
          <div className="text-sm text-muted-foreground">Tanggal</div>
          <div className="text-sm">{date}</div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          <span>Unduh</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          <span>Cetak</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
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

// Komponen Upload Bukti Pembayaran
const UploadPaymentProof = ({ 
  bookingId, 
  onSuccess 
}: { 
  bookingId: string
  onSuccess: () => void
}) => {
  const { toast } = useToast()
  const { uploadPaymentProof } = useBooking()
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    setSelectedFile(file)
    
    // Create preview URL
    const fileReader = new FileReader()
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string)
    }
    fileReader.readAsDataURL(file)
  }
  
  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile || !bookingId) return
    
    try {
      setIsUploading(true)
      const success = await uploadPaymentProof(bookingId, selectedFile)
      
      if (success) {
        toast({
          title: "Berhasil mengunggah bukti pembayaran",
          description: "Bukti pembayaran Anda akan diverifikasi dalam 1x24 jam"
        })
        onSuccess()
      }
    } catch (error) {
      console.error("Error uploading payment proof:", error)
      toast({
        variant: "destructive",
        title: "Gagal mengunggah bukti pembayaran",
        description: "Silakan coba lagi atau hubungi customer service"
      })
    } finally {
      setIsUploading(false)
    }
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Unggah Bukti Pembayaran
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unggah Bukti Pembayaran</DialogTitle>
          <DialogDescription>
            Silakan unggah bukti pembayaran untuk konfirmasi pemesanan Anda
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => document.getElementById('file-upload')?.click()}>
            {previewUrl ? (
              <div className="relative w-full h-48 mx-auto">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="h-full mx-auto object-contain" 
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-0 right-0 h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewUrl(null)
                    setSelectedFile(null)
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="py-4">
                <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Klik untuk memilih file atau seret dan lepas</p>
                <p className="text-xs text-muted-foreground">Mendukung: JPG, PNG, atau PDF (Maks. 5MB)</p>
              </div>
            )}
            <input 
              /* Lanjutan booking-detail.tsx */
              id="file-upload" 
              type="file" 
              className="hidden" 
              accept="image/*,application/pdf" 
              onChange={handleFileChange}
            />
          </div>
          
          {selectedFile && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm truncate flex-1">
                {selectedFile.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground bg-yellow-50 p-3 rounded border border-yellow-200">
            <p className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span>Pastikan bukti pembayaran memperlihatkan:</span>
            </p>
            <ul className="list-disc pl-6 mt-1 text-xs space-y-1">
              <li>Tanggal dan waktu transaksi</li>
              <li>Jumlah yang ditransfer</li>
              <li>Nomor rekening tujuan</li>
              <li>Status: Berhasil / Sukses</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()} disabled={isUploading}>
            Pilih File Lain
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <span className="animate-spin mr-2">
                  <Clock className="h-4 w-4" />
                </span>
                Mengunggah...
              </>
            ) : (
              "Unggah Bukti"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Komponen untuk konfirmasi pembatalan booking
const CancelBookingDialog = ({
  bookingId,
  onCancel
}: {
  bookingId: string
  onCancel: () => void
}) => {
  const { toast } = useToast()
  const { cancelBooking } = useBooking()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  const handleCancelBooking = async () => {
    if (!bookingId) return
    
    try {
      setIsLoading(true)
      const success = await cancelBooking(bookingId)
      
      if (success) {
        toast({
          title: "Pemesanan dibatalkan",
          description: "Pemesanan Anda telah berhasil dibatalkan"
        })
        onCancel()
        setIsOpen(false)
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        variant: "destructive",
        title: "Gagal membatalkan pemesanan",
        description: "Silakan coba lagi atau hubungi customer service"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          Batalkan Pemesanan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Batalkan Pemesanan</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin membatalkan pemesanan ini?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Peringatan</AlertTitle>
            <AlertDescription>
              <p>Pembatalan tidak dapat dibatalkan. Mohon perhatikan kebijakan pembatalan kami:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>7+ hari sebelum keberangkatan: pengembalian 100% (dikurangi biaya admin)</li>
                <li>3-6 hari sebelum keberangkatan: pengembalian 50%</li>
                <li>&lt;3 hari sebelum keberangkatan: tidak ada pengembalian</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Tidak, Kembali
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancelBooking}
            disabled={isLoading}
          >
            {isLoading ? "Membatalkan..." : "Ya, Batalkan Pemesanan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function BookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const { getBookingById, uploadPaymentProof, cancelBooking } = useBooking()
  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null)
  const [bookingData, setBookingData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadingPayment, setUploadingPayment] = useState(false)
  const [cancellingBooking, setCancellingBooking] = useState(false)

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
          
          // Jika tidak ada data booking di localStorage, gunakan dummy
          // Simulasi detail booking
          const dummyBooking = {
            bookingId: bookingId,
            bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 hari yang lalu
            paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 hari yang lalu
            status: "confirmed" as BookingStatus,
            totalAmount: 3000000,
            paymentMethod: "bank_transfer",
            bankName: "BCA",
            bankAccountNumber: "1234567890",
            customerInfo: {
              nama: user?.nama || "John Doe",
              email: user?.email || "john.doe@example.com",
              telepon: user?.telepon || "081234567890",
              alamat: user?.alamat || "Jl. Contoh No. 123, Jakarta"
            },
            jumlahPeserta: 2,
            schedule: {
              tanggalAwal: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 hari dari sekarang
              tanggalAkhir: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 hari dari sekarang
            },
            packageInfo: {
              id: "sample-id",
              nama: "Paket Wisata Demo",
              destination: "Bali"
            },
            tourGuide: {
              name: "Budi Santoso",
              phone: "081234567890",
              photo: "/placeholder.svg?height=100&width=100",
            },
            pickupLocation: "Bandara Soekarno-Hatta Terminal 3, Jakarta",
            pickupTime: "08:00 WIB",
            specialRequests: "Kamar dengan pemandangan laut jika memungkinkan.",
          }
          
          setBookingData(dummyBooking)
          
          // Ambil paket wisata dummy
          try {
            const packageData = await TourPackageService.getPackageById("sample-id")
            setPaketWisata(packageData)
          } catch (pkgErr) {
            console.error("Error fetching package data:", pkgErr)
            // Tidak perlu set error di sini karena booking data berhasil di-set
          }
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

  // Handle upload bukti pembayaran
  const handleUploadPayment = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !bookingId) return
    
    try {
      setUploadingPayment(true)
      
      const file = files[0]
      const success = await uploadPaymentProof(bookingId, file)
      
      if (success) {
        toast({
          title: "Berhasil mengunggah bukti pembayaran",
          description: "Bukti pembayaran Anda akan diverifikasi dalam 1x24 jam"
        })
        
        // Update status booking di state
        setBookingData(prev => ({
          ...prev,
          status: "pending_verification"
        }))
      }
    } catch (error) {
      console.error("Error uploading payment proof:", error)
      toast({
        variant: "destructive",
        title: "Gagal mengunggah bukti pembayaran",
        description: "Silakan coba lagi atau hubungi customer service"
      })
    } finally {
      setUploadingPayment(false)
    }
  }

  // Handle pembatalan booking
  const handleCancelBooking = async () => {
    if (!bookingId) return
    
    try {
      setCancellingBooking(true)
      
      const success = await cancelBooking(bookingId)
      
      if (success) {
        toast({
          title: "Pemesanan dibatalkan",
          description: "Pemesanan Anda telah berhasil dibatalkan"
        })
        
        // Update status booking di state
        setBookingData(prev => ({
          ...prev,
          status: "cancelled"
        }))
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        variant: "destructive",
        title: "Gagal membatalkan pemesanan",
        description: "Silakan coba lagi atau hubungi customer service"
      })
    } finally {
      setCancellingBooking(false)
    }
  }

  // Fungsi untuk handle payment success
  const handlePaymentSuccess = () => {
    // Update status booking di state
    setBookingData(prev => ({
      ...prev,
      status: "pending_verification"
    }))
  }

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

          {/* Alert untuk informasi penting */}
          {bookingData.status === "pending" && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Menunggu Pembayaran</AlertTitle>
              <AlertDescription className="text-yellow-700">
                <p className="mb-2">Silakan melakukan pembayaran sebelum batas waktu yang ditentukan.</p>
                <div className="mt-4">
                  <UploadPaymentProof 
                    bookingId={bookingData.bookingId}
                    onSuccess={handlePaymentSuccess}
                  />
                </div>
              </AlertDescription>
            </Alert>
          )}

          {bookingData.status === "pending_verification" && (
            <Alert className="bg-blue-50 border-blue-200">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Verifikasi Pembayaran</AlertTitle>
              <AlertDescription className="text-blue-700">
                <p className="mb-2">Bukti pembayaran Anda sedang diverifikasi. Proses ini akan selesai dalam 1x24 jam kerja.</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 bg-blue-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-1/2"></div>
                  </div>
                  <span className="text-xs">Sedang diproses</span>
                </div>
              </AlertDescription>
            </Alert>
          )}

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

          {/* Tabs untuk informasi detail */}
          <Tabs defaultValue="detail" className="bg-white rounded-lg shadow-sm">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="detail">Detail Pemesanan</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
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
                        {paketWisata && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{paketWisata.durasi}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {paketWisata ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-2">
                        <Hotel className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Akomodasi</div>
                          <div className="text-sm text-muted-foreground">{paketWisata.hotel.nama}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Bus className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Transportasi</div>
                          <div className="text-sm text-muted-foreground">{paketWisata.armada.nama}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Utensils className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Konsumsi</div>
                          <div className="text-sm text-muted-foreground">{paketWisata.consume.nama}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm italic">
                      Detail fasilitas akan ditampilkan saat data paket tersedia
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
                    <div>
                      <div className="text-sm text-muted-foreground">Alamat</div>
                      <div>{bookingData.customerInfo.alamat}</div>
                    </div>
                  </div>

                  {bookingData.specialRequests && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm text-muted-foreground">Permintaan Khusus</div>
                        <div>{bookingData.specialRequests}</div>
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
                      <div>{formatDate(bookingData.bookingDate)}</div>
                    </div>
                    {bookingData.paymentDate && (
                      <div>
                        <div className="text-sm text-muted-foreground">Tanggal Pembayaran</div>
                        <div>{formatDate(bookingData.paymentDate)}</div>
                      </div>
                    )}
                    {bookingData.paymentMethod && (
                      <div>
                        <div className="text-sm text-muted-foreground">Metode Pembayaran</div>
                        <div>
                          {bookingData.paymentMethod === "bank_transfer" 
                            ? `Transfer Bank ${bookingData.bankName || ""}` 
                            : bookingData.paymentMethod === "dp" 
                            ? "DP 50%" 
                            : bookingData.paymentMethod}
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

                <div className="p-4 space-y-2">
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
            </Card>

            {/* Informasi Penjemputan */}
            {bookingData.pickupLocation && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Informasi Penjemputan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Lokasi Penjemputan</div>
                      <div>{bookingData.pickupLocation}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Waktu Penjemputan</div>
                      <div>
                        {bookingData.pickupTime}, {formatDate(bookingData.schedule.tanggalAwal)}
                      </div>
                    </div>
                  </div>

                  {bookingData.tourGuide && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-4">
                        <img
                          src={bookingData.tourGuide.photo || "/placeholder.svg"}
                          alt={bookingData.tourGuide.name}
                          className="w-16 h-16 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64";
                          }}
                        />
                        <div>
                          <div className="font-medium">Tour Guide</div>
                          <div>{bookingData.tourGuide.name}</div>
                          <div className="text-sm text-muted-foreground">{bookingData.tourGuide.phone}</div>
                          /* Lanjutan booking-detail.tsx */
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tombol Aksi untuk tab Detail */}
            {(bookingData.status === "pending" || bookingData.status === "pending_verification") && (
              <div className="flex flex-wrap gap-3 pt-4">
                {bookingData.status === "pending" && (
                  <>
                    <CancelBookingDialog
                      bookingId={bookingData.bookingId}
                      onCancel={handleCancelBooking}
                    />
                    <UploadPaymentProof
                      bookingId={bookingData.bookingId}
                      onSuccess={handlePaymentSuccess}
                    />
                  </>
                )}
                {bookingData.status === "pending_verification" && (
                  <Alert className="w-full">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Pembayaran sedang diverifikasi</AlertTitle>
                    <AlertDescription>
                      Kami sedang memverifikasi pembayaran Anda. Proses ini akan selesai dalam 1x24 jam kerja.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </TabsContent>

          {/* Tab Itinerary */}
          <TabsContent value="itinerary" className="space-y-6 pt-4 px-6 pb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Itinerary Perjalanan</CardTitle>
                <CardDescription>Detail jadwal perjalanan {paketWisata?.durasi || "Anda"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {placeholderItinerary.map((hari) => (
                    <div key={hari.hari} className="relative border-l-2 border-primary/30 pl-6">
                      <div className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {hari.hari}
                      </div>
                      <h3 className="mb-4 text-lg font-medium">
                        Hari {hari.hari} - {hari.hari === 1 ? formatDate(bookingData.schedule.tanggalAwal) : ""}
                      </h3>

                      <div className="space-y-4">
                        {hari.aktivitas.map((aktivitas, index) => (
                          <div key={index} className="relative rounded-lg border p-4 bg-white hover:bg-gray-50 transition-colors">
                            <div className="mb-2 font-medium">{aktivitas.kegiatan}</div>
                            <div className="mb-2 text-sm text-muted-foreground">{aktivitas.waktu}</div>
                            <div className="text-sm text-muted-foreground">{aktivitas.deskripsi}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Apa yang harus dibawa?</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Kartu identitas (KTP/SIM/Passport)</li>
                        <li>E-voucher (cetak atau simpan di smartphone)</li>
                        <li>Pakaian yang sesuai dengan cuaca dan aktivitas</li>
                        <li>Obat-obatan pribadi</li>
                        <li>Kamera</li>
                        <li>Uang tunai untuk keperluan pribadi</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Kebijakan Pembatalan</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>
                          Pembatalan 7 hari atau lebih sebelum keberangkatan: pengembalian 100% (dikurangi biaya
                          administrasi)
                        </li>
                        <li>Pembatalan 3-6 hari sebelum keberangkatan: pengembalian 50%</li>
                        <li>Pembatalan kurang dari 3 hari sebelum keberangkatan: tidak ada pengembalian</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Syarat dan Ketentuan</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Peserta harus mengikuti arahan tour guide selama perjalanan</li>
                        <li>Jadwal dapat berubah sewaktu-waktu menyesuaikan kondisi lapangan</li>
                        <li>Peserta bertanggung jawab atas barang bawaan masing-masing</li>
                        <li>Peserta wajib mematuhi peraturan di tempat wisata</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Kontak Darurat</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-muted-foreground">
                        <p>Untuk keadaan darurat, silakan hubungi:</p>
                        <p>Customer Service: +62 812-3456-789 (24 jam)</p>
                        <p>Kantor Pusat: (021) 1234-5678 (Jam kerja)</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Fasilitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paketWisata && (
                    <>
                      <div>
                        <h3 className="mb-2 font-medium">Yang Termasuk:</h3>
                        <ul className="space-y-2">
                          {paketWisata.include.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                              <span className="text-sm text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="mb-2 font-medium">Yang Tidak Termasuk:</h3>
                        <ul className="space-y-2">
                          {paketWisata.exclude.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                              <span className="text-sm text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* E-Voucher */}
        {bookingData.status === "confirmed" || bookingData.status === "completed" ? (
          <EVoucher
            bookingId={bookingData.bookingId}
            customerName={bookingData.customerInfo.nama}
            packageName={bookingData.packageInfo.nama}
            date={`${formatDate(bookingData.schedule.tanggalAwal)} - ${formatDate(bookingData.schedule.tanggalAkhir)}`}
          />
        ) : (
          <Card className="shadow-md">
            <CardHeader className="pb-2 bg-primary/5 border-b">
              <CardTitle className="text-lg">E-Voucher</CardTitle>
            </CardHeader>
            <CardContent className="text-center p-6">
              {bookingData.status === "pending" ? (
                <>
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-10 w-10 text-yellow-500" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    E-voucher akan tersedia setelah pembayaran Anda dikonfirmasi.
                  </p>
                  <UploadPaymentProof
                    bookingId={bookingData.bookingId}
                    onSuccess={handlePaymentSuccess}
                  />
                </>
              ) : bookingData.status === "pending_verification" ? (
                <>
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-10 w-10 text-blue-500" />
                  </div>
                  <p className="font-medium mb-2">Pembayaran Sedang Diverifikasi</p>
                  <p className="text-muted-foreground mb-4">
                    E-voucher akan tersedia setelah pembayaran Anda diverifikasi.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-blue-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-1/2"></div>
                    </div>
                    <span className="text-xs">Dalam proses</span>
                  </div>
                </>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Pemesanan Dibatalkan</AlertTitle>
                  <AlertDescription>
                    Pemesanan ini telah dibatalkan, e-voucher tidak tersedia.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

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

        {/* Status Pemesanan */}
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
                    {formatDate(bookingData.bookingDate)}
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

        {/* Tombol Aksi */}
        <div className="space-y-3">
          <Button className="w-full" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Cetak Detail Pemesanan
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate("/paket-wisata")}>
            Lihat Paket Wisata Lainnya
          </Button>
        </div>
      </div>
    </div>
  </div>
)
}