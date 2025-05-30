// booking-form.tsx (Fixed Version)
import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Info,
  AlertCircle,
  Send,
  Loader2,
  Calendar,
  Clock,
  CreditCard,
  Tag,
  Star,
  PlusCircle,
  MinusCircle,
  Users,
  Landmark,
  Phone,
  Mail,
  Hotel,
  Bus,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { TourPackageService } from "@/services/tour-package.service";
import { BookingService, BookingFormData } from "@/services/booking.service";
import { useAuth } from "@/hooks/use-auth";
import { useBooking } from "@/hooks/use-booking";
import type { ITourPackage, Schedule } from "@/types/tour-package.types";
import { Badge } from "@/components/ui/badge";

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
const BookingSteps = () => {
  const currentStep = 1; // Form pemesanan adalah langkah pertama

  return (
    <div className="mb-8 relative">
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
          </div>
          <span className="text-xs mt-2 text-center">Pemesanan</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 2
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 2 ? <CheckCircle2 className="h-5 w-5" /> : "2"}
          </div>
          <span className="text-xs mt-2 text-center">Detail</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 3
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 3 ? <CheckCircle2 className="h-5 w-5" /> : "3"}
          </div>
          <span className="text-xs mt-2 text-center">Pembayaran</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 4
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 4 ? <CheckCircle2 className="h-5 w-5" /> : "4"}
          </div>
          <span className="text-xs mt-2 text-center">E-Voucher</span>
        </div>
      </div>

      {/* Connector lines */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
        <div
          className="h-full bg-primary transition-all duration-1000"
          style={{ width: "0%" }}
        ></div>
      </div>
    </div>
  );
};

export default function BookingForm() {
  const { id, scheduleId } = useParams<{ id: string; scheduleId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const {
    isLoading: isLoadingBooking,
    isSubmitting,
    error: bookingError,
    createBooking,
    validateBookingForm,
    calculateTotal,
    calculateDP,
  } = useBooking();

  const [paketWisata, setPaketWisata] = useState<ITourPackage | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [jumlahPeserta, setJumlahPeserta] = useState<number>(2);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    instansi: "",
    alamat: "",
    catatan: "",
    metodePembayaran: "full" as "full" | "dp",
    setuju: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Ambil data paket wisata berdasarkan ID
  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          throw new Error("ID paket wisata tidak ditemukan");
        }

        const data = await TourPackageService.getPackageById(id);
        console.log("📦 Data paket wisata dari API:", data);
        setPaketWisata(data);

        // Set jumlah peserta default
        if (data && data.armada) {
          const defaultCount = Math.max(
            1,
            Math.min(2, data.armada.kapasitas || 10)
          );
          setJumlahPeserta(defaultCount);
        }

        // Jika ada scheduleId, cari jadwal yang sesuai
        if (scheduleId && data.jadwal) {
          const schedule = data.jadwal.find(
            (j) => `${j.tanggalAwal}-${j.tanggalAkhir}` === scheduleId
          );
          if (schedule) {
            setSelectedSchedule(schedule);
          } else {
            // Cari jadwal tersedia pertama jika scheduleId tidak ditemukan
            const availableSchedule = data.jadwal.find(
              (j) => j.status === "tersedia"
            );
            if (availableSchedule) {
              setSelectedSchedule(availableSchedule);
            } else {
              throw new Error("Tidak ada jadwal tersedia");
            }
          }
        } else if (data.jadwal && data.jadwal.length > 0) {
          // Jika tidak ada scheduleId, gunakan jadwal pertama yang statusnya "tersedia"
          const availableSchedule = data.jadwal.find(
            (j) => j.status === "tersedia"
          );
          if (availableSchedule) {
            setSelectedSchedule(availableSchedule);
          } else {
            throw new Error("Tidak ada jadwal tersedia");
          }
        }
      } catch (error) {
        console.error("❌ Error fetching package detail:", error);
        setError("Gagal mengambil data paket wisata");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageDetail();
  }, [id, scheduleId]);

  // Isi form dengan data user yang sudah login
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        nama: user.nama || "",
        email: user.email || "",
        telepon: user.telepon || "",
        alamat: user.alamat || "",
      }));
    } else {
      // Jika user belum login, ambil data dari localStorage jika ada
      const savedUserData = localStorage.getItem("userData");
      if (savedUserData) {
        try {
          const userData = JSON.parse(savedUserData);
          setFormData((prev) => ({
            ...prev,
            nama: userData.nama || userData.fullName || "",
            email: userData.email || "",
            telepon: userData.telepon || userData.phone || "",
            alamat: userData.alamat || userData.address || "",
          }));
        } catch (e) {
          console.error("❌ Error parsing saved user data:", e);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, setuju: checked }));

    // Clear error for this field
    if (formErrors.setuju) {
      setFormErrors((prev) => ({ ...prev, setuju: "" }));
    }
  };

  // Handle radio change
  const handleRadioChange = (value: "full" | "dp") => {
    setFormData((prev) => ({ ...prev, metodePembayaran: value }));
  };

  // Handle increment/decrement jumlah peserta
  const increaseJumlahPeserta = () => {
    if (
      paketWisata &&
      paketWisata.armada &&
      jumlahPeserta < paketWisata.armada.kapasitas
    ) {
      setJumlahPeserta((prev) => prev + 1);
    }
  };

  const decreaseJumlahPeserta = () => {
    if (jumlahPeserta > 1) {
      setJumlahPeserta((prev) => prev - 1);
    }
  };

  // Validasi form manual
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      errors.nama = "Nama lengkap wajib diisi";
    }

    if (!formData.email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }

    if (!formData.telepon.trim()) {
      errors.telepon = "Nomor telepon wajib diisi";
    } else if (
      !/^(\+62|62|0)[0-9]{9,12}$/.test(formData.telepon.replace(/\s/g, ""))
    ) {
      errors.telepon = "Format nomor telepon tidak valid";
    }

    if (!formData.alamat.trim()) {
      errors.alamat = "Alamat wajib diisi";
    }

    if (!formData.setuju) {
      errors.setuju = "Anda harus menyetujui syarat dan ketentuan";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission - Updated untuk backend baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Formulir tidak valid",
        description: "Mohon periksa kembali data yang Anda masukkan",
      });
      return;
    }

    // Pastikan data paket dan jadwal tersedia
    if (!paketWisata || !selectedSchedule || !id) {
      toast({
        variant: "destructive",
        title: "Data tidak lengkap",
        description:
          "Terjadi kesalahan. Data paket wisata atau jadwal tidak tersedia.",
      });
      return;
    }

    try {
      // Buat data booking sesuai interface BookingFormData yang baru
      const bookingData: BookingFormData = {
        packageId: id, // Updated sesuai interface baru
        jumlahPeserta,
        customerInfo: {
          nama: formData.nama,
          email: formData.email,
          telepon: formData.telepon,
          alamat: formData.alamat,
          instansi: formData.instansi || "",
          catatan: formData.catatan || "",
        },
        selectedSchedule: {
          tanggalAwal: selectedSchedule.tanggalAwal,
          tanggalAkhir: selectedSchedule.tanggalAkhir,
        },
        userId: isAuthenticated && user ? user.id : undefined,
        metodePembayaran: formData.metodePembayaran, // Ini tetap untuk tracking di frontend
      };

      console.log("🚀 Mengirim data pemesanan:", bookingData);
      console.log("🔍 FINAL CHECK:");
      console.log("- formData.instansi:", `"${formData.instansi}"`);
      console.log("- formData.catatan:", `"${formData.catatan}"`);
      console.log("- customerInfo:", bookingData.customerInfo);
      console.log("- JSON string:", JSON.stringify(bookingData.customerInfo));
      console.log(
        "- Contains instansi:",
        JSON.stringify(bookingData).includes("instansi")
      );

      // Simpan data form terakhir ke localStorage untuk pengisian otomatis berikutnya
      if (!isAuthenticated) {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            nama: formData.nama,
            email: formData.email,
            telepon: formData.telepon,
            instansi: formData.instansi,
            alamat: formData.alamat,
          })
        );
      }

      // Call booking service dengan data yang sudah disesuaikan
      const bookingResponse = await BookingService.createBooking(bookingData);

      // ✅ TAMBAHKAN DEBUG LOG UNTUK MELIHAT STRUKTUR RESPONSE
      console.log("🔍 === BOOKING RESPONSE DEBUG ===");
      console.log(
        "🔍 Full response:",
        JSON.stringify(bookingResponse, null, 2)
      );
      console.log("🔍 Response success:", bookingResponse.success);
      console.log("🔍 Response data:", bookingResponse.data);
      console.log(
        "🔍 Response data keys:",
        Object.keys(bookingResponse.data || {})
      );
      console.log(
        "🔍 bookingResponse.data.bookingId:",
        bookingResponse.data?.bookingId
      );
      console.log(
        "🔍 bookingResponse.data.booking_id:",
        bookingResponse.data?.booking_id
      );
      console.log(
        "🔍 bookingResponse.data.customId:",
        bookingResponse.data?.customId
      );
      console.log("🔍 bookingResponse.booking_id:", bookingResponse.booking_id);
      console.log("🔍 bookingResponse.bookingId:", bookingResponse.bookingId);
      console.log("🔍 === END BOOKING RESPONSE DEBUG ===");

      if (bookingResponse.success && bookingResponse.data) {
        // ✅ EXTRACT bookingId dengan multiple fallback untuk handle berbagai format response
        const bookingId =
          bookingResponse.data.bookingId || // Format normal
          bookingResponse.data.booking_id || // Format dari payment response
          bookingResponse.data.customId || // Format dari database
          bookingResponse.booking_id || // Direct dari response root
          bookingResponse.bookingId || // Alternative dari response root
          bookingResponse.data._id || // MongoDB ObjectId sebagai fallback
          `BOOK-${Date.now().toString().slice(-8)}`; // Generate jika tidak ada

        console.log("🔍 Final extracted bookingId:", bookingId);
        console.log("🔍 BookingId type:", typeof bookingId);

        if (!bookingId || bookingId === "undefined") {
          console.error("❌ No valid bookingId found in response!");
          console.error(
            "❌ Available data:",
            Object.keys(bookingResponse.data || {})
          );
          throw new Error("Booking ID tidak ditemukan dalam response");
        }

        console.log("✅ Booking berhasil dibuat:", bookingId);

        // Simpan informasi tambahan untuk pembayaran
        const totalAmount =
          formData.metodePembayaran === "full"
            ? calculateTotal(paketWisata, jumlahPeserta)
            : calculateDP(paketWisata, jumlahPeserta);

        // ✅ Simpan booking info lengkap ke localStorage dengan bookingId yang benar
        const bookingInfo = {
          ...bookingResponse.data,
          bookingId: bookingId, // ✅ Pastikan bookingId di-set dengan benar
          customId: bookingId, // ✅ Set juga customId untuk compatibility
          metodePembayaran: formData.metodePembayaran,
          totalAmount,
          packageDetail: {
            nama: paketWisata.nama,
            destination: paketWisata.destination.nama,
            durasi: paketWisata.durasi,
            foto: paketWisata.foto?.[0],
            include: paketWisata.include,
            hotel: paketWisata.hotel,
            armada: paketWisata.armada,
            consume: paketWisata.consume,
          },
          // ✅ Preserve original customerInfo with instansi & catatan
          customerInfo: {
            ...bookingResponse.data.customerInfo,
            instansi:
              formData.instansi ||
              bookingResponse.data.customerInfo?.instansi ||
              "",
            catatan:
              formData.catatan ||
              bookingResponse.data.customerInfo?.catatan ||
              "",
          },
        };

        console.log(
          "🔍 Final bookingInfo to save:",
          JSON.stringify(bookingInfo, null, 2)
        );

        localStorage.setItem("currentBookingInfo", JSON.stringify(bookingInfo));
        localStorage.setItem("lastBooking", JSON.stringify(bookingInfo)); // ✅ Backup untuk fallback

        toast({
          title: "Booking berhasil dibuat!",
          description: `Booking ID: ${bookingId}`,
        });

        // ✅ Log sebelum redirect untuk debugging
        console.log("🔍 About to redirect to:", `/booking-detail/${bookingId}`);

        // Redirect ke halaman detail booking
        navigate(`/booking-detail/${bookingId}`);
      } else {
        console.error("❌ Booking response not successful:", bookingResponse);
        throw new Error(bookingResponse.message || "Gagal membuat booking");
      }
    } catch (error: any) {
      console.error("❌ Error submitting form:", error);

      // ✅ Enhanced error logging
      console.error("❌ Error details:");
      console.error("  - Name:", error.name);
      console.error("  - Message:", error.message);
      console.error("  - Stack:", error.stack);

      // Handle specific error messages
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast({
        variant: "destructive",
        title: "Gagal melakukan pemesanan",
        description: errorMessage,
      });
    }
  };

  // Buka WhatsApp
  const openWhatsApp = () => {
    const phone = "628123456789";
    const packageInfo = paketWisata
      ? `${paketWisata.nama} (${formatCurrency(paketWisata.harga)})`
      : "";
    const text = `Halo, saya ingin bertanya tentang paket wisata ${packageInfo}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-lg">Memuat data paket wisata...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !paketWisata || !selectedSchedule) {
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
          onClick={() => navigate(`/paket-wisata/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Detail Paket Wisata
        </Button>
      </div>
    );
  }

  // Login recommendation component
  const LoginRecommendation = () => {
    if (!isAuthenticated) {
      return (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">
            Login untuk pengalaman lebih baik
          </AlertTitle>
          <AlertDescription className="text-blue-700">
            <p className="mb-2">
              Login atau daftar untuk pengalaman pemesanan yang lebih baik dan
              untuk melacak riwayat perjalanan Anda.
            </p>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate("/login", {
                    state: { returnTo: window.location.pathname },
                  })
                }
              >
                Login
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate("/register", {
                    state: { returnTo: window.location.pathname },
                  })
                }
              >
                Daftar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-gray-50">
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

      {/* Menampilkan alur booking (progress steps) */}
      <BookingSteps />

      {/* Header Paket Wisata */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-primary">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              {paketWisata.nama}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{paketWisata.destination.nama}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{paketWisata.durasi}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {formatDate(selectedSchedule.tanggalAwal)} -{" "}
                  {formatDate(selectedSchedule.tanggalAkhir)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <Badge variant="outline">{paketWisata.kategori.title}</Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {formatCurrency(paketWisata.harga)}
            </div>
            <div className="text-sm text-muted-foreground">per orang</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Pemesanan */}
        <div className="lg:col-span-2">
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-xl">Formulir Pemesanan</CardTitle>
              <CardDescription>
                Silakan lengkapi data diri Anda untuk melanjutkan pemesanan
                paket wisata
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <LoginRecommendation />

              {bookingError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{bookingError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800">
                      Informasi Penting
                    </h3>
                    <p className="text-sm text-blue-700">
                      Pastikan data yang Anda masukkan sudah benar. E-ticket dan
                      voucher akan dikirimkan ke email yang terdaftar.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nama" className="text-base">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="nama"
                          name="nama"
                          placeholder="Masukkan nama lengkap Anda"
                          value={formData.nama}
                          onChange={handleInputChange}
                          className={`pl-10 ${
                            formErrors.nama ? "border-red-500" : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                        </div>
                      </div>
                      {formErrors.nama && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.nama}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-base">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="contoh@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`pl-10 ${
                            formErrors.email ? "border-red-500" : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                        </div>
                      </div>
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telepon" className="text-base">
                        Nomor Telepon <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="telepon"
                          name="telepon"
                          placeholder="08xxxxxxxxxx"
                          value={formData.telepon}
                          onChange={handleInputChange}
                          className={`pl-10 ${
                            formErrors.telepon ? "border-red-500" : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                        </div>
                      </div>
                      {formErrors.telepon && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.telepon}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="instansi" className="text-base">
                        Instansi (Opsional)
                      </Label>
                      <div className="relative">
                        <Input
                          id="instansi"
                          name="instansi"
                          placeholder="Nama instansi/perusahaan (jika ada)"
                          value={formData.instansi}
                          onChange={handleInputChange}
                          className="pl-10"
                          disabled={isSubmitting}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Landmark className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="alamat" className="text-base">
                      Alamat <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="alamat"
                        name="alamat"
                        placeholder="Masukkan alamat lengkap Anda"
                        value={formData.alamat}
                        onChange={handleInputChange}
                        className={`pl-10 pt-2 ${
                          formErrors.alamat ? "border-red-500" : ""
                        }`}
                        rows={3}
                        disabled={isSubmitting}
                      />
                      <div className="absolute left-3 top-3 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                      </div>
                    </div>
                    {formErrors.alamat && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.alamat}
                      </p>
                    )}
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
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg">
                    <Label className="text-base font-medium mb-2 block">
                      Jumlah Peserta
                    </Label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-full h-10 w-10"
                        onClick={decreaseJumlahPeserta}
                        disabled={jumlahPeserta <= 1 || isSubmitting}
                      >
                        <MinusCircle className="h-5 w-5" />
                      </Button>
                      <div className="mx-6 text-lg font-medium w-10 text-center">
                        {jumlahPeserta}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-full h-10 w-10"
                        onClick={increaseJumlahPeserta}
                        disabled={
                          paketWisata && paketWisata.armada
                            ? jumlahPeserta >= paketWisata.armada.kapasitas
                            : false || isSubmitting
                        }
                      >
                        <PlusCircle className="h-5 w-5" />
                      </Button>
                    </div>
                    {paketWisata && paketWisata.armada && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Kapasitas maksimal: {paketWisata.armada.kapasitas} orang
                      </p>
                    )}
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg">
                    <Label className="text-base font-medium mb-2 block">
                      Metode Pembayaran
                    </Label>
                    <RadioGroup
                      value={formData.metodePembayaran}
                      onValueChange={
                        handleRadioChange as (value: string) => void
                      }
                      className="flex flex-col space-y-3"
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <RadioGroupItem
                          value="full"
                          id="full"
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <Label htmlFor="full" className="font-medium">
                            Bayar Penuh
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Pembayaran langsung lunas
                          </p>
                        </div>
                        <div className="text-primary font-bold">
                          {formatCurrency(
                            calculateTotal(paketWisata, jumlahPeserta)
                          )}
                        </div>
                      </div>
                      <div className="flex items-center p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="dp" id="dp" className="mr-3" />
                        <div className="flex-1">
                          <Label htmlFor="dp" className="font-medium">
                            DP 50%
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Bayar DP dulu, sisanya dibayar nanti
                          </p>
                        </div>
                        <div className="text-primary font-bold">
                          {formatCurrency(
                            calculateDP(paketWisata, jumlahPeserta)
                          )}
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      id="setuju"
                      checked={formData.setuju}
                      onCheckedChange={handleCheckboxChange}
                      className={formErrors.setuju ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="setuju"
                        className="text-sm font-normal leading-snug text-muted-foreground"
                      >
                        Saya menyetujui syarat dan ketentuan yang berlaku serta
                        kebijakan privasi
                      </Label>
                      {formErrors.setuju && (
                        <p className="text-red-500 text-xs">
                          {formErrors.setuju}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Lanjutkan Pemesanan
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={openWhatsApp}
                    disabled={isSubmitting}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Tanya via WhatsApp
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Ringkasan Pemesanan */}
        <div>
          <div className="sticky top-8 space-y-6">
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle>Ringkasan Pemesanan</CardTitle>
                <CardDescription>
                  Detail paket wisata yang Anda pilih
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                    <img
                      src={
                        paketWisata.foto?.[0] ||
                        `https://source.unsplash.com/random/800x600/?travel,${paketWisata.destination.nama}`
                      }
                      alt={paketWisata.nama}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {paketWisata.nama}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{paketWisata.destination.nama}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Tanggal
                    </span>
                    <span className="font-medium">
                      {formatDate(selectedSchedule.tanggalAwal)} -{" "}
                      {formatDate(selectedSchedule.tanggalAkhir)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Durasi
                    </span>
                    <span className="font-medium">{paketWisata.durasi}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Jumlah Peserta
                    </span>
                    <span className="font-medium">{jumlahPeserta} orang</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Kapasitas Max
                    </span>
                    <span className="font-medium">
                      {paketWisata.armada.kapasitas} orang
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                  <div className="bg-white p-2 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Harga per orang
                    </div>
                    <div className="font-medium">
                      {formatCurrency(paketWisata.harga)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Harga per orang
                    </span>
                    <span className="font-medium">
                      {formatCurrency(paketWisata.harga)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Jumlah peserta
                    </span>
                    <span className="font-medium">x {jumlahPeserta}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>
                      {formData.metodePembayaran === "full"
                        ? "Total"
                        : "DP (50%)"}
                    </span>
                    <span className="text-primary text-lg">
                      {formData.metodePembayaran === "full"
                        ? formatCurrency(
                            calculateTotal(paketWisata, jumlahPeserta)
                          )
                        : formatCurrency(
                            calculateDP(paketWisata, jumlahPeserta)
                          )}
                    </span>
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

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Informasi Penting</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4">
                <Alert
                  variant="default"
                  className="py-2 bg-blue-50 border-blue-200"
                >
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-xs font-medium text-blue-800">
                    Pembayaran
                  </AlertTitle>
                  <AlertDescription className="text-xs text-blue-700">
                    Setelah mengisi formulir, Anda akan diarahkan ke halaman
                    detail pemesanan untuk melakukan pembayaran via Midtrans.
                  </AlertDescription>
                </Alert>

                <Alert
                  variant="default"
                  className="py-2 bg-green-50 border-green-200"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-xs font-medium text-green-800">
                    Konfirmasi Otomatis
                  </AlertTitle>
                  <AlertDescription className="text-xs text-green-700">
                    E-voucher akan otomatis tersedia setelah pembayaran berhasil
                    dan dapat diunduh langsung dari halaman detail pemesanan.
                  </AlertDescription>
                </Alert>

                <Alert
                  variant="default"
                  className="py-2 bg-amber-50 border-amber-200"
                >
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-xs font-medium text-amber-800">
                    Pembatalan
                  </AlertTitle>
                  <AlertDescription className="text-xs text-amber-700">
                    Pembatalan gratis hingga 7 hari sebelum keberangkatan.
                    Setelah itu akan dikenakan biaya administrasi.
                  </AlertDescription>
                </Alert>

                <Alert
                  variant="default"
                  className="py-2 bg-purple-50 border-purple-200"
                >
                  <CreditCard className="h-4 w-4 text-purple-600" />
                  <AlertTitle className="text-xs font-medium text-purple-800">
                    Metode Pembayaran
                  </AlertTitle>
                  <AlertDescription className="text-xs text-purple-700">
                    Mendukung pembayaran via Virtual Account, E-Wallet, Credit
                    Card, dan transfer bank melalui Midtrans.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Informasi Hotel & Akomodasi */}
            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="pb-2 bg-primary/5">
                <CardTitle className="text-base flex items-center gap-2">
                  <Hotel className="h-5 w-5 text-primary" />
                  Detail Akomodasi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <h4 className="font-medium mb-1">{paketWisata.hotel.nama}</h4>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(paketWisata.hotel.bintang)].map((_, index) => (
                      <Star
                        key={index}
                        className="h-3 w-3 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                    <span className="text-xs text-muted-foreground">
                      Hotel {paketWisata.hotel.bintang} Bintang
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {paketWisata.hotel.alamat}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-1 flex items-center gap-2">
                    <Bus className="h-4 w-4 text-primary" />
                    Transportasi
                  </h4>
                  <p className="text-sm">
                    {paketWisata.armada.nama} - {paketWisata.armada.merek}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Kapasitas {paketWisata.armada.kapasitas} orang
                  </p>
                </div>

                {paketWisata.consume && (
                  <div className="mb-2">
                    <h4 className="font-medium mb-1 flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-primary" />
                      Konsumsi
                    </h4>
                    <p className="text-sm">{paketWisata.consume.nama}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Service */}
            <Card className="shadow-sm bg-gradient-to-r from-primary/5 to-blue-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-medium mb-2">Butuh Bantuan?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Customer service kami siap membantu Anda 24/7
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open("tel:+628123456789", "_blank")}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      +62 812-3456-789
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={openWhatsApp}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
