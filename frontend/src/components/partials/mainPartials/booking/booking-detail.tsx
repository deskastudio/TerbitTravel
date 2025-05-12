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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TourPackageService } from "@/services/tour-package.service" // Impor service
import type { ITourPackage } from "@/types/tour-package.types" // Impor tipe data

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
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"

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
  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold">E-Voucher Travedia</h3>
        <p className="text-sm text-muted-foreground">Tunjukkan voucher ini kepada tour guide kami</p>
      </div>

      <div className="flex justify-center mb-4">
        <img src="/placeholder.svg?height=180&width=180" alt="QR Code" className="border p-2 rounded-lg" />
      </div>

      <div className="space-y-2 text-center">
        <div>
          <div className="text-sm text-muted-foreground">Booking ID</div>
          <div className="font-bold">{bookingId}</div>
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
        <Button variant="outline" size="sm" className="gap-1">
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

export default function BookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulasi data pemesanan
  const bookingData = {
    bookingId: bookingId || "TRV123456",
    bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 hari yang lalu
    paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 hari yang lalu
    status: "confirmed" as BookingStatus,
    totalAmount: 0, // Akan diupdate setelah data paket wisata diambil
    paymentMethod: "bank_transfer",
    bankName: "BCA",
    bankAccountNumber: "1234567890",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "081234567890",
    customerAddress: "Jl. Contoh No. 123, Jakarta",
    jumlahPeserta: 2,
    jadwal: {
      tanggalAwal: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 hari dari sekarang
      tanggalAkhir: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 hari dari sekarang
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

  // Ambil data paket wisata (simulasi)
  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setIsLoading(true)

        // Simulasi fetch data paket wisata
        // Dalam implementasi nyata, ini akan mengambil data pemesanan dan paket wisata terkait
        const data = await TourPackageService.getPackageById("sample-id")
        console.log("Data paket wisata dari API:", data)
        setPaketWisata(data)
      } catch (error) {
        console.error("Error fetching booking detail:", error)
        setError("Gagal mengambil data pemesanan")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookingDetail()
  }, [bookingId])

  // Jika masih loading atau error, tampilkan pesan
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

  if (error || !paketWisata) {
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

  // Update total amount based on package price
  bookingData.totalAmount = paketWisata.harga * bookingData.jumlahPeserta

  return (
    <div className="container mx-auto px-4 py-8">
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Detail Pemesanan</h1>
              <p className="text-muted-foreground">Booking ID: {bookingData.bookingId}</p>
            </div>
            <BookingStatusBadge status={bookingData.status} />
          </div>

          {/* Alert untuk informasi penting */}
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
          <Tabs defaultValue="detail">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="detail">Detail Pemesanan</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="info">Informasi Penting</TabsTrigger>
            </TabsList>

            {/* Tab Detail Pemesanan */}
            <TabsContent value="detail" className="space-y-6 pt-4">
              {/* Informasi Paket */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Informasi Paket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{paketWisata.nama}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatDate(bookingData.jadwal.tanggalAwal)} - {formatDate(bookingData.jadwal.tanggalAkhir)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{paketWisata.destination.nama}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{bookingData.jumlahPeserta} orang</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{paketWisata.durasi}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

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
                      <div>{bookingData.customerName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div>{bookingData.customerEmail}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Nomor Telepon</div>
                      <div>{bookingData.customerPhone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Alamat</div>
                      <div>{bookingData.customerAddress}</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm text-muted-foreground">Permintaan Khusus</div>
                    <div>{bookingData.specialRequests || "-"}</div>
                  </div>
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
                    <div>
                      <div className="text-sm text-muted-foreground">Tanggal Pembayaran</div>
                      <div>{formatDate(bookingData.paymentDate)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Metode Pembayaran</div>
                      <div>Transfer Bank {bookingData.bankName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Pembayaran Berhasil</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Harga per orang</span>
                      <span>{formatCurrency(paketWisata.harga)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jumlah peserta</span>
                      <span>x {bookingData.jumlahPeserta}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(bookingData.totalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informasi Penjemputan */}
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
                        {bookingData.pickupTime}, {formatDate(bookingData.jadwal.tanggalAwal)}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-4">
                    <img
                      src={bookingData.tourGuide.photo || "/placeholder.svg"}
                      alt={bookingData.tourGuide.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">Tour Guide</div>
                      <div>{bookingData.tourGuide.name}</div>
                      <div className="text-sm text-muted-foreground">{bookingData.tourGuide.phone}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Itinerary */}
            <TabsContent value="itinerary" className="space-y-6 pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Itinerary Perjalanan</CardTitle>
                  <CardDescription>Detail jadwal perjalanan {paketWisata.durasi} Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {placeholderItinerary.map((hari) => (
                      <div key={hari.hari} className="relative border-l-2 border-primary/30 pl-6">
                        <div className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                          {hari.hari}
                        </div>
                        <h3 className="mb-4 text-lg font-medium">
                          Hari {hari.hari} - {hari.hari === 1 ? formatDate(bookingData.jadwal.tanggalAwal) : ""}
                        </h3>

                        <div className="space-y-4">
                          {hari.aktivitas.map((aktivitas, index) => (
                            <div key={index} className="relative rounded-lg border p-4">
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
            <TabsContent value="info" className="space-y-6 pt-4">
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* E-Voucher */}
          <EVoucher
            bookingId={bookingData.bookingId}
            customerName={bookingData.customerName}
            packageName={paketWisata.nama}
            date={`${formatDate(bookingData.jadwal.tanggalAwal)} - ${formatDate(bookingData.jadwal.tanggalAkhir)}`}
          />

          {/* Informasi Kontak */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Butuh Bantuan?</CardTitle>
              <CardDescription>Tim customer service kami siap membantu Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactInfo />
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
