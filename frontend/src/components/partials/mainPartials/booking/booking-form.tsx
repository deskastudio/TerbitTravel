"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, CheckCircle2, Info, AlertCircle, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { TourPackageService } from "@/services/tour-package.service" // Impor service
import type { ITourPackage, Schedule } from "@/types/tour-package.types" // Impor tipe data

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

// Komponen Skeleton untuk loading
const BookingFormSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-10 w-3/4 mb-6" />
          <Skeleton className="h-6 w-1/2 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <div>
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Interface untuk form data
interface BookingFormData {
  nama: string
  email: string
  telepon: string
  instansi: string
  alamat: string
  catatan: string
  metodePembayaran: "full" | "dp"
  setuju: boolean
}

export default function BookingForm() {
  const { id, scheduleId } = useParams<{ id: string; scheduleId: string }>()
  const navigate = useNavigate()
  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [jumlahPeserta, setJumlahPeserta] = useState<number>(2)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<BookingFormData>({
    nama: "",
    email: "",
    telepon: "",
    instansi: "",
    alamat: "",
    catatan: "",
    metodePembayaran: "full",
    setuju: false,
  })
  const [formErrors, setFormErrors] = useState<Partial<BookingFormData>>({})

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

        // Jika ada scheduleId, cari jadwal yang sesuai
        if (scheduleId && data.jadwal) {
          const schedule = data.jadwal.find((j) => `${j.tanggalAwal}-${j.tanggalAkhir}` === scheduleId)
          if (schedule) {
            setSelectedSchedule(schedule)
          } else {
            throw new Error("Jadwal tidak ditemukan")
          }
        }
      } catch (error) {
        console.error("Error fetching package detail:", error)
        setError("Gagal mengambil data paket wisata")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackageDetail()
  }, [id, scheduleId])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user types
    if (formErrors[name as keyof BookingFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, setuju: checked }))

    // Clear error for this field
    if (formErrors.setuju) {
      setFormErrors((prev) => ({ ...prev, setuju: undefined }))
    }
  }

  // Handle radio change
  const handleRadioChange = (value: "full" | "dp") => {
    setFormData((prev) => ({ ...prev, metodePembayaran: value }))
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<BookingFormData> = {}

    if (!formData.nama.trim()) {
      errors.nama = "Nama lengkap harus diisi"
    }

    if (!formData.email.trim()) {
      errors.email = "Email harus diisi"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format email tidak valid"
    }

    if (!formData.telepon.trim()) {
      errors.telepon = "Nomor telepon harus diisi"
    } else if (!/^[0-9]{10,13}$/.test(formData.telepon.replace(/\D/g, ""))) {
      errors.telepon = "Nomor telepon tidak valid (10-13 digit)"
    }

    if (!formData.alamat.trim()) {
      errors.alamat = "Alamat harus diisi"
    }

    if (!formData.setuju) {
      errors.setuju = "Anda harus menyetujui syarat dan ketentuan"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      // Simulasi pengiriman data ke server
      console.log("Mengirim data pemesanan:", {
        paketId: id,
        jadwal: selectedSchedule,
        jumlahPeserta,
        ...formData,
      })

      // Simulasi delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect ke halaman sukses (dalam implementasi nyata, ini akan menunggu respons dari server)
      navigate(`/booking-success/${id}`)
    } catch (error) {
      console.error("Error submitting form:", error)
      setError("Gagal mengirim data pemesanan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Hitung total harga
  const calculateTotal = () => {
    if (!paketWisata) return 0
    return paketWisata.harga * jumlahPeserta
  }

  // Hitung DP (50% dari total)
  const calculateDP = () => {
    return calculateTotal() * 0.5
  }

  // Jika masih loading, tampilkan skeleton
  if (isLoading) {
    return <BookingFormSkeleton />
  }

  // Jika terjadi error, tampilkan pesan error
  if (error || !paketWisata || !selectedSchedule) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Data tidak ditemukan"}</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => navigate(`/paket-wisata/${id}`)}>
          Kembali ke Detail Paket Wisata
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb dan Tombol Kembali */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 p-0 hover:bg-transparent"
          onClick={() => navigate(`/paket-wisata/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Detail Paket</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Pemesanan */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-2">Formulir Pemesanan</h1>
          <p className="text-muted-foreground mb-6">
            Silakan lengkapi data diri Anda untuk melanjutkan pemesanan paket wisata
          </p>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nama" className="text-base">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nama"
                  name="nama"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className={formErrors.nama ? "border-red-500" : ""}
                />
                {formErrors.nama && <p className="text-red-500 text-sm mt-1">{formErrors.nama}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-base">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contoh@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <Label htmlFor="telepon" className="text-base">
                  Nomor Telepon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telepon"
                  name="telepon"
                  placeholder="08xxxxxxxxxx"
                  value={formData.telepon}
                  onChange={handleInputChange}
                  className={formErrors.telepon ? "border-red-500" : ""}
                />
                {formErrors.telepon && <p className="text-red-500 text-sm mt-1">{formErrors.telepon}</p>}
              </div>

              <div>
                <Label htmlFor="instansi" className="text-base">
                  Instansi (Opsional)
                </Label>
                <Input
                  id="instansi"
                  name="instansi"
                  placeholder="Nama instansi/perusahaan (jika ada)"
                  value={formData.instansi}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="alamat" className="text-base">
                  Alamat <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="alamat"
                  name="alamat"
                  placeholder="Masukkan alamat lengkap Anda"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className={formErrors.alamat ? "border-red-500" : ""}
                  rows={3}
                />
                {formErrors.alamat && <p className="text-red-500 text-sm mt-1">{formErrors.alamat}</p>}
              </div>

              <div>
                <Label htmlFor="catatan" className="text-base">
                  Catatan Tambahan (Opsional)
                </Label>
                <Textarea
                  id="catatan"
                  name="catatan"
                  placeholder="Permintaan khusus, pertanyaan, atau informasi tambahan"
                  value={formData.catatan}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Metode Pembayaran</Label>
                <RadioGroup
                  value={formData.metodePembayaran}
                  onValueChange={handleRadioChange as (value: string) => void}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="font-normal">
                      Bayar Penuh - {formatCurrency(calculateTotal())}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dp" id="dp" />
                    <Label htmlFor="dp" className="font-normal">
                      DP 50% - {formatCurrency(calculateDP())}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="setuju"
                  checked={formData.setuju}
                  onCheckedChange={handleCheckboxChange}
                  className={formErrors.setuju ? "border-red-500" : ""}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="setuju" className="text-sm font-normal leading-snug text-muted-foreground">
                    Saya menyetujui syarat dan ketentuan yang berlaku serta kebijakan privasi
                  </Label>
                  {formErrors.setuju && <p className="text-red-500 text-xs">{formErrors.setuju}</p>}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>Lanjutkan Pemesanan</>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => window.open("https://wa.me/628123456789", "_blank")}
              >
                <Send className="mr-2 h-4 w-4" />
                Tanya via WhatsApp
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar - Ringkasan Pemesanan */}
        <div>
          <div className="sticky top-8 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Ringkasan Pemesanan</CardTitle>
                <CardDescription>Detail paket wisata yang Anda pilih</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{paketWisata.nama}</h3>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{paketWisata.destination.nama}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tanggal</span>
                    <span className="font-medium">
                      {formatDate(selectedSchedule.tanggalAwal)} - {formatDate(selectedSchedule.tanggalAkhir)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durasi</span>
                    <span className="font-medium">{paketWisata.durasi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jumlah Peserta</span>
                    <span className="font-medium">{jumlahPeserta} orang</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga per orang</span>
                    <span className="font-medium">{formatCurrency(paketWisata.harga)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jumlah peserta</span>
                    <span className="font-medium">x {jumlahPeserta}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    *Harga sudah termasuk pajak dan biaya layanan
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 flex flex-col items-start p-4">
                <h4 className="font-medium mb-2">Fasilitas Termasuk:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {paketWisata.include.slice(0, 5).map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                  {paketWisata.include.length > 5 && (
                    <li className="text-sm text-muted-foreground">
                      + {paketWisata.include.length - 5} fasilitas lainnya
                    </li>
                  )}
                </ul>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Informasi Penting</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4">
                <Alert variant="default" className="py-2">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-xs font-medium">Pembayaran</AlertTitle>
                  <AlertDescription className="text-xs">
                    Setelah mengisi formulir, Anda akan diarahkan ke halaman pembayaran untuk menyelesaikan transaksi.
                  </AlertDescription>
                </Alert>

                <Alert variant="default" className="py-2">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-xs font-medium">Konfirmasi</AlertTitle>
                  <AlertDescription className="text-xs">
                    Pemesanan Anda akan dikonfirmasi dalam waktu 1x24 jam setelah pembayaran berhasil.
                  </AlertDescription>
                </Alert>

                <Alert variant="default" className="py-2">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-xs font-medium">Pembatalan</AlertTitle>
                  <AlertDescription className="text-xs">
                    Pembatalan gratis hingga 7 hari sebelum keberangkatan. Setelah itu akan dikenakan biaya.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Butuh bantuan? Hubungi customer service kami</p>
              <Button
                variant="link"
                className="text-primary p-0 h-auto"
                onClick={() => window.open("tel:+628123456789", "_blank")}
              >
                +62 812-3456-789
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
