"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CheckCircle, ArrowRight, Copy, Clock, Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Komponen untuk menampilkan countdown
const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
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
  )
}

// Ganti BookingSteps dengan komponen yang menggunakan shadcn/ui
const BookingSteps = () => {
  const currentStep = 1 // Pembayaran adalah langkah saat ini

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep > 0 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
          >
            {currentStep > 0 ? <CheckCircle className="h-5 w-5" /> : "1"}
          </div>
          <span className="text-xs mt-2">Pemesanan</span>
        </div>

        <div className="flex-1 flex items-center">
          <div className={`h-1 w-full ${currentStep > 0 ? "bg-green-500" : "bg-muted"}`}></div>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep > 1 ? "bg-green-100 text-green-600" : currentStep === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : "2"}
          </div>
          <span className="text-xs mt-2">Pembayaran</span>
        </div>

        <div className="flex-1 flex items-center">
          <div className={`h-1 w-full ${currentStep > 1 ? "bg-green-500" : "bg-muted"}`}></div>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep > 2 ? "bg-green-100 text-green-600" : currentStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : "3"}
          </div>
          <span className="text-xs mt-2">Konfirmasi</span>
        </div>

        <div className="flex-1 flex items-center">
          <div className={`h-1 w-full ${currentStep > 2 ? "bg-green-500" : "bg-muted"}`}></div>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep > 3 ? "bg-green-100 text-green-600" : currentStep === 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {currentStep > 3 ? <CheckCircle className="h-5 w-5" /> : "4"}
          </div>
          <span className="text-xs mt-2">E-Voucher</span>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccess() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulasi data pemesanan
  const bookingData = {
    bookingId:
      "TRV" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0"),
    bookingDate: new Date().toISOString(),
    paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 jam dari sekarang
    totalAmount: 0, // Akan diupdate setelah data paket wisata diambil
    paymentMethod: "bank_transfer",
    bankAccounts: [
      { bank: "BCA", accountNumber: "1234567890", accountName: "PT Travedia Indonesia" },
      { bank: "Mandiri", accountNumber: "0987654321", accountName: "PT Travedia Indonesia" },
      { bank: "BNI", accountNumber: "1122334455", accountName: "PT Travedia Indonesia" },
    ],
    customerName: "John Doe", // Simulasi data pelanggan
    customerEmail: "john.doe@example.com",
    customerPhone: "081234567890",
    jumlahPeserta: 2,
    jadwal: {
      tanggalAwal: new Date().toISOString(),
      tanggalAkhir: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 hari dari sekarang
    },
  }

  // Ambil data paket wisata berdasarkan ID
  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        setIsLoading(true)
        if (!id) {
          throw new Error("ID paket wisata tidak ditemukan")
        }

        const data = await TourPackageService.getPackageById(id)
        console.log("Data paket wisata dari API:", data)
        setPaketWisata(data)
      } catch (error) {
        console.error("Error fetching package detail:", error)
        setError("Gagal mengambil data paket wisata")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackageDetail()
  }, [id])

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Berhasil disalin ke clipboard!")
      })
      .catch((err) => {
        console.error("Gagal menyalin teks: ", err)
      })
  }

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
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Pemesanan Berhasil!</h1>
          <p className="text-muted-foreground">
            Terima kasih telah memesan paket wisata kami. Silakan lakukan pembayaran untuk menyelesaikan transaksi.
          </p>
        </div>

        <BookingSteps />

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Detail Pemesanan</CardTitle>
                <CardDescription>Nomor Pemesanan: {bookingData.bookingId}</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(bookingData.bookingId)}>
                <Copy className="h-4 w-4 mr-2" />
                Salin
              </Button>
            </div>
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
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal Pemesanan</span>
                <span>{formatDate(bookingData.bookingDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pemesan</span>
                <span>{bookingData.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{bookingData.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telepon</span>
                <span>{bookingData.customerPhone}</span>
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

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Informasi Pembayaran</CardTitle>
            <CardDescription>Silakan lakukan pembayaran sebelum batas waktu yang ditentukan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-amber-50 border-amber-200">
              <Clock className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Batas Waktu Pembayaran</AlertTitle>
              <AlertDescription className="text-amber-700">
                <div className="mt-2 mb-3">
                  <Countdown targetDate={new Date(bookingData.paymentDeadline)} />
                </div>
                <div className="text-sm">
                  Harap selesaikan pembayaran sebelum {formatDate(bookingData.paymentDeadline)} pukul{" "}
                  {new Date(bookingData.paymentDeadline).toLocaleTimeString("id-ID")}
                </div>
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="bank_transfer">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bank_transfer">Transfer Bank</TabsTrigger>
                <TabsTrigger value="e_wallet">E-Wallet</TabsTrigger>
              </TabsList>
              <TabsContent value="bank_transfer" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {bookingData.bankAccounts.map((account, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold">{account.bank}</div>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(account.accountNumber)}>
                          <Copy className="h-4 w-4 mr-1" />
                          Salin
                        </Button>
                      </div>
                      <div className="text-lg font-mono mb-1">{account.accountNumber}</div>
                      <div className="text-sm text-muted-foreground">a.n. {account.accountName}</div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Jumlah yang harus dibayar:{" "}
                    <span className="font-semibold">{formatCurrency(bookingData.totalAmount)}</span>
                  </p>
                  <p className="mt-1">
                    Pastikan untuk transfer tepat sampai 3 digit terakhir untuk memudahkan verifikasi.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="e_wallet" className="pt-4">
                <div className="text-center p-6">
                  <div className="bg-muted rounded-lg p-4 inline-block mb-4">
                    <img src="/placeholder.svg?height=150&width=150" alt="QR Code" className="mx-auto" />
                  </div>
                  <p className="mb-2">Scan QR code di atas menggunakan aplikasi e-wallet Anda</p>
                  <p className="text-sm text-muted-foreground">
                    Didukung oleh: GoPay, OVO, DANA, LinkAja, dan ShopeePay
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-2 bg-muted/50 p-4">
            <h4 className="font-medium">Petunjuk Pembayaran:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Transfer sesuai dengan jumlah yang tertera</li>
              <li>Simpan bukti pembayaran Anda</li>
              <li>Pembayaran akan diverifikasi dalam waktu 1x24 jam</li>
              <li>Anda akan menerima e-voucher setelah pembayaran terverifikasi</li>
            </ol>
          </CardFooter>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate("/paket-wisata")}>
            Kembali ke Daftar Paket
          </Button>
          <Button onClick={() => navigate(`/booking-detail/${bookingData.bookingId}`)}>
            Lihat Detail Pemesanan
            <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </div>
    </div>
  )
}
