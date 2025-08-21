// hooks/use-booking.ts - Fixed for Midtrans Integration

import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  BookingService,
  BookingFormData,
  BookingResponse,
  PaymentRequestData,
  PaymentResponse,
  PaymentStatusResponse,
} from "@/services/booking.service";
import { ITourPackage } from "@/types/tour-package.types";
import { useAuth } from "@/hooks/use-auth";

export interface UseBookingReturn {
  // States
  isLoading: boolean;
  isSubmitting: boolean;
  isPolling: boolean;
  error: string | null;
  bookingData: BookingResponse | null;

  // Booking Operations
  createBooking: (formData: BookingFormData) => Promise<BookingResponse | null>;
  getBookingById: (id: string) => Promise<any>;
  getUserBookings: () => Promise<BookingResponse[]>;

  // Payment Operations
  processPayment: (
    params: PaymentRequestData
  ) => Promise<PaymentResponse | null>;
  checkPaymentStatus: (id: string) => Promise<PaymentStatusResponse | null>;
  simulatePaymentSuccess: (id: string) => Promise<boolean>;
  startPollingPaymentStatus: (id: string) => void;
  stopPollingPaymentStatus: () => void;

  // Enhanced Payment Operations (New)
  checkPaymentStatusManual: (id: string) => Promise<boolean>;
  getBookingByIdWithRefresh: (id: string) => Promise<any>;
  startEnhancedPollingPaymentStatus: (id: string) => void;
  checkVoucherAvailability: (id: string) => Promise<boolean>;
  generateBookingVoucher: (id: string) => Promise<any | null>;

  // Booking Management
  cancelBooking: (id: string) => Promise<boolean>;
  uploadPaymentProof?: (id: string, file: File) => Promise<boolean>;

  // Voucher Operations
  getBookingVoucher: (
    id: string
  ) => Promise<{ voucherUrl: string; voucherCode: string } | null>;

  // Utility Functions
  validateBookingForm: (formData: any) => {
    isValid: boolean;
    errors: Record<string, string>;
  };
  calculateTotal: (paketWisata: ITourPackage, jumlahPeserta: number) => number;
  calculateDP: (paketWisata: ITourPackage, jumlahPeserta: number) => number;
  getBankAccounts: () => Promise<any[]>;

  // Auth Data
  user: any;
  isAuthenticated: boolean;

  // State Management
  setBookingData: (data: BookingResponse | null) => void;
  clearError: () => void;
}

export function useBooking(): UseBookingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingResponse | null>(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Ref untuk polling interval
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ✅ ENHANCED METHOD 1: Manual webhook check
  const checkPaymentStatusManual = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(`🔄 Manual payment status check for: ${id}`);

        const response = await BookingService.checkPaymentStatus(id);

        if (response.success && response.booking) {
          console.log(`✅ Manual check result: ${response.status}`);

          // Update booking data with latest status
          if (
            bookingData?.data &&
            (bookingData.data.bookingId === id || bookingData.data._id === id)
          ) {
            const currentStatus = bookingData.data.status;
            const newStatus = response.booking.status;

            if (currentStatus !== newStatus) {
              console.log(`🔄 Status updated: ${currentStatus} → ${newStatus}`);

              setBookingData((prev) =>
                prev?.data
                  ? {
                      ...prev,
                      data: {
                        ...prev.data,
                        status: newStatus as any,
                        paymentStatus: response.booking.paymentStatus as any,
                        paymentMethod: response.booking.paymentMethod,
                        paymentDate: response.booking.paymentDate,
                        lastWebhookUpdate: response.booking.lastWebhookUpdate,
                      },
                    }
                  : prev
              );

              // Show toast for successful confirmation
              if (newStatus === "confirmed" && currentStatus !== "confirmed") {
                toast({
                  title: "Pembayaran Dikonfirmasi!",
                  description:
                    "Pembayaran Anda telah berhasil dikonfirmasi. E-voucher sudah tersedia.",
                });
              }
            }
          }

          return response.status === "confirmed";
        }

        return false;
      } catch (err: any) {
        console.error(`❌ Error in manual payment check for ${id}:`, err);
        const errorMessage = err.message || "Gagal memeriksa status pembayaran";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [bookingData, toast]
  );

  // ✅ ENHANCED METHOD 2: Get booking with status refresh
  const getBookingByIdWithRefresh = useCallback(
    async (id: string): Promise<any> => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("📦 Fetching booking with status refresh:", id);

        const response = await BookingService.getBookingWithStatusRefresh(id);

        if (response.success && response.data) {
          setBookingData(response);
          return response.data;
        } else {
          throw new Error(response.message || "Booking tidak ditemukan");
        }
      } catch (err: any) {
        console.error(`❌ Error fetching booking with refresh ${id}:`, err);

        // Fallback ke localStorage
        try {
          const lastBooking = localStorage.getItem("lastBooking");
          if (lastBooking) {
            const parsedBooking = JSON.parse(lastBooking);
            if (parsedBooking.bookingId === id || parsedBooking._id === id) {
              console.log("📱 Using localStorage fallback for booking:", id);
              return parsedBooking;
            }
          }
        } catch (fallbackError) {
          console.error("❌ Fallback error:", fallbackError);
        }

        const errorMessage =
          err.message || "Gagal mendapatkan detail pemesanan";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ✅ ENHANCED METHOD 3: Enhanced polling dengan webhook check
  const startEnhancedPollingPaymentStatus = useCallback(
    (id: string) => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      setIsPolling(true);
      console.log("🔄 Starting enhanced payment status polling for:", id);

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const isConfirmed = await checkPaymentStatusManual(id);

          if (isConfirmed) {
            console.log("🎉 Payment confirmed via enhanced polling!");
            stopPollingPaymentStatus();
          }
        } catch (error) {
          console.error("❌ Enhanced polling error:", error);
        }
      }, 10000); // Poll every 10 seconds
    },
    [checkPaymentStatusManual]
  );

  // ✅ ENHANCED METHOD 4: Check voucher availability
  const checkVoucherAvailability = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const isAvailable = await BookingService.isVoucherAvailable(id);
        return isAvailable;
      } catch (error) {
        console.error(
          `❌ Error checking voucher availability for ${id}:`,
          error
        );
        return false;
      }
    },
    []
  );

  // ✅ ENHANCED METHOD 5: Generate voucher
  const generateBookingVoucher = useCallback(
    async (id: string): Promise<any | null> => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(`🎫 Generating voucher for booking: ${id}`);

        const result = await BookingService.generateVoucher(id);

        if (result.success && result.voucher) {
          toast({
            title: "E-Voucher Dibuat!",
            description:
              "E-voucher Anda telah berhasil dibuat dan siap digunakan.",
          });

          return result.voucher;
        } else {
          throw new Error(result.message || "Gagal membuat e-voucher");
        }
      } catch (err: any) {
        console.error(`❌ Error generating voucher for ${id}:`, err);

        const errorMessage = err.message || "Gagal membuat e-voucher";

        toast({
          variant: "destructive",
          title: "Gagal Membuat E-Voucher",
          description: errorMessage,
        });

        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Membuat booking baru
  const createBooking = useCallback(
    async (formData: BookingFormData): Promise<BookingResponse | null> => {
      try {
        setIsSubmitting(true);
        setError(null);

        console.log("🚀 Creating booking with data:", formData);

        const { isValid, errors } = validateBookingForm(formData);
        if (!isValid) {
          const errorMessage =
            "Data pemesanan tidak valid. Silakan periksa kembali.";
          console.error("❌ Validation errors:", errors);

          toast({
            variant: "destructive",
            title: "Gagal membuat pemesanan",
            description: errorMessage,
          });
          setError(errorMessage);
          return null;
        }

        const response = await BookingService.createBooking(formData);

        if (response.success && response.data) {
          setBookingData(response);

          console.log(
            "✅ Booking created successfully:",
            response.data.bookingId
          );

          toast({
            title: "Pemesanan berhasil!",
            description: `Booking ID: ${response.data.bookingId}. Silakan lakukan pembayaran.`,
          });

          return response;
        } else {
          throw new Error(response.message || "Gagal membuat booking");
        }
      } catch (err: any) {
        console.error("❌ Error creating booking:", err);

        let errorMessage = "Gagal membuat pemesanan";
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        toast({
          variant: "destructive",
          title: "Gagal membuat pemesanan",
          description: errorMessage,
        });

        setError(errorMessage);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast]
  );

  // Mendapatkan detail booking
  const getBookingById = useCallback(async (id: string): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("📦 Fetching booking:", id);

      const response = await BookingService.getBookingById(id);

      if (response.success && response.data) {
        setBookingData(response);
        return response.data;
      } else {
        throw new Error(response.message || "Booking tidak ditemukan");
      }
    } catch (err: any) {
      console.error(`❌ Error fetching booking ${id}:`, err);

      // Fallback ke localStorage
      try {
        const lastBooking = localStorage.getItem("lastBooking");
        if (lastBooking) {
          const parsedBooking = JSON.parse(lastBooking);
          if (parsedBooking.bookingId === id || parsedBooking._id === id) {
            console.log("📱 Using localStorage fallback for booking:", id);
            return parsedBooking;
          }
        }
      } catch (fallbackError) {
        console.error("❌ Fallback error:", fallbackError);
      }

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal mendapatkan detail pemesanan";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get user bookings
  const getUserBookings = useCallback(async (): Promise<BookingResponse[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const userId = isAuthenticated && user ? user.id : undefined;
      return await BookingService.getUserBookings(userId);
    } catch (err: any) {
      console.error("❌ Error fetching user bookings:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal mendapatkan daftar pemesanan";
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Process payment
  const processPayment = useCallback(
    async (params: PaymentRequestData): Promise<PaymentResponse | null> => {
      try {
        setIsSubmitting(true);
        setError(null);

        console.log("💳 Processing payment:", params);

        const response = await BookingService.processPayment(params);

        if (response.success) {
          console.log("✅ Payment processing initiated:", response.snap_token);

          if (response.snap_token && bookingData) {
            setBookingData((prev) =>
              prev
                ? {
                    ...prev,
                    data: prev.data
                      ? {
                          ...prev.data,
                          status: "pending_verification" as any,
                          paymentToken: response.snap_token,
                        }
                      : prev.data,
                  }
                : prev
            );
          }

          return response;
        } else {
          throw new Error(response.message || "Gagal memproses pembayaran");
        }
      } catch (err: any) {
        console.error("❌ Error processing payment:", err);

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Gagal memproses pembayaran";

        toast({
          variant: "destructive",
          title: "Gagal memproses pembayaran",
          description: errorMessage,
        });

        setError(errorMessage);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast, bookingData]
  );

  // Check payment status (original method)
  const checkPaymentStatus = useCallback(
    async (id: string): Promise<PaymentStatusResponse | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await BookingService.getPaymentStatus(id);

        if (response.success && response.data) {
          if (
            bookingData?.data &&
            (bookingData.data.bookingId === id || bookingData.data._id === id)
          ) {
            const currentStatus = bookingData.data.status;
            const newStatus = response.data.status;

            if (currentStatus !== newStatus) {
              console.log(`🔄 Status updated: ${currentStatus} → ${newStatus}`);

              setBookingData((prev) =>
                prev?.data
                  ? {
                      ...prev,
                      data: {
                        ...prev.data,
                        status: newStatus as any,
                        paymentStatus: response.data!.paymentStatus as any,
                        paymentMethod: response.data!.paymentMethod,
                        paymentDate: response.data!.paymentDate,
                      },
                    }
                  : prev
              );
            }
          }

          return response;
        }

        return null;
      } catch (err: any) {
        console.error(`❌ Error checking payment status for ${id}:`, err);

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Gagal mengecek status pembayaran";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [bookingData]
  );

  // Start polling payment status
  const startPollingPaymentStatus = useCallback(
    (id: string) => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      setIsPolling(true);
      console.log("🔄 Starting payment status polling for:", id);

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await BookingService.getPaymentStatus(id);

          if (response.success && response.data) {
            const status = response.data.status;

            if (
              bookingData?.data &&
              (bookingData.data.bookingId === id || bookingData.data._id === id)
            ) {
              const currentStatus = bookingData.data.status;

              if (currentStatus !== status) {
                console.log(
                  `✅ Polling detected status change: ${currentStatus} → ${status}`
                );

                setBookingData((prev) =>
                  prev?.data
                    ? {
                        ...prev,
                        data: {
                          ...prev.data,
                          status: status as any,
                          paymentStatus: response.data!.paymentStatus as any,
                          paymentMethod: response.data!.paymentMethod,
                          paymentDate: response.data!.paymentDate,
                        },
                      }
                    : prev
                );

                if (status === "confirmed" || status === "cancelled") {
                  stopPollingPaymentStatus();

                  if (status === "confirmed") {
                    toast({
                      title: "Pembayaran Berhasil!",
                      description:
                        "Pembayaran Anda telah dikonfirmasi. E-voucher sudah tersedia.",
                    });
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("❌ Polling error:", error);
        }
      }, 5000);
    },
    [bookingData, toast]
  );

  // Stop polling payment status
  const stopPollingPaymentStatus = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
    console.log("⏹️ Stopped payment status polling");
  }, []);

  // Simulate payment success
  const simulatePaymentSuccess = useCallback(
    async (id: string): Promise<boolean> => {
      if (process.env.NODE_ENV !== "development") {
        console.warn("⚠️ simulatePaymentSuccess only available in development");
        return false;
      }

      try {
        setIsSubmitting(true);
        setError(null);

        const response = await BookingService.simulatePaymentSuccess(id);

        if (response.success) {
          toast({
            title: "Pembayaran Disimulasikan",
            description: "Pembayaran berhasil disimulasikan untuk testing",
          });

          if (
            bookingData?.data &&
            (bookingData.data.bookingId === id || bookingData.data._id === id)
          ) {
            setBookingData((prev) =>
              prev?.data
                ? {
                    ...prev,
                    data: {
                      ...prev.data,
                      status: "confirmed" as any,
                      paymentStatus: "settlement" as any,
                      paymentDate: new Date().toISOString(),
                    },
                  }
                : prev
            );
          }

          return true;
        } else {
          throw new Error(
            response.message || "Gagal mensimulasikan pembayaran"
          );
        }
      } catch (err: any) {
        console.error(`❌ Error simulating payment for ${id}:`, err);

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Gagal mensimulasikan pembayaran";

        toast({
          variant: "destructive",
          title: "Gagal mensimulasikan pembayaran",
          description: errorMessage,
        });

        setError(errorMessage);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast, bookingData]
  );

  // Cancel booking
  const cancelBooking = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setIsSubmitting(true);
        setError(null);

        toast({
          title: "Pemesanan dibatalkan",
          description: "Pemesanan Anda telah berhasil dibatalkan",
        });

        if (
          bookingData?.data &&
          (bookingData.data.bookingId === id || bookingData.data._id === id)
        ) {
          setBookingData((prev) =>
            prev?.data
              ? {
                  ...prev,
                  data: {
                    ...prev.data,
                    status: "cancelled" as any,
                  },
                }
              : prev
          );
        }

        return true;
      } catch (err: any) {
        console.error(`❌ Error cancelling booking ${id}:`, err);

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Gagal membatalkan pemesanan";

        toast({
          variant: "destructive",
          title: "Gagal membatalkan pemesanan",
          description: errorMessage,
        });

        setError(errorMessage);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast, bookingData]
  );

  // Get booking voucher
  const getBookingVoucher = useCallback(
    async (
      id: string
    ): Promise<{ voucherUrl: string; voucherCode: string } | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await BookingService.getBookingVoucher(id);
      } catch (err: any) {
        console.error(`❌ Error fetching voucher for booking ${id}:`, err);

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Gagal mendapatkan voucher pemesanan";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get bank accounts
  const getBankAccounts = useCallback(async () => {
    try {
      return [
        {
          bank: "BCA",
          accountNumber: "1234567890",
          accountName: "PT Travedia Indonesia",
        },
        {
          bank: "Mandiri",
          accountNumber: "0987654321",
          accountName: "PT Travedia Indonesia",
        },
        {
          bank: "BNI",
          accountNumber: "1122334455",
          accountName: "PT Travedia Indonesia",
        },
      ];
    } catch (error) {
      console.error("❌ Error fetching bank accounts:", error);
      return [];
    }
  }, []);

  // Validate booking form
  const validateBookingForm = useCallback(
    (formData: any): { isValid: boolean; errors: Record<string, string> } => {
      const errors: Record<string, string> = {};

      if (!formData.customerInfo?.nama?.trim()) {
        errors.nama = "Nama lengkap harus diisi";
      }

      if (!formData.customerInfo?.email?.trim()) {
        errors.email = "Email harus diisi";
      } else if (!/\S+@\S+\.\S+/.test(formData.customerInfo.email)) {
        errors.email = "Format email tidak valid";
      }

      if (!formData.customerInfo?.telepon?.trim()) {
        errors.telepon = "Nomor telepon harus diisi";
      } else if (
        !/^(\+62|62|0)[0-9]{9,12}$/.test(
          formData.customerInfo.telepon.replace(/\s/g, "")
        )
      ) {
        errors.telepon = "Format nomor telepon tidak valid";
      }

      if (!formData.customerInfo?.alamat?.trim()) {
        errors.alamat = "Alamat harus diisi";
      }

      if (!formData.packageId?.trim()) {
        errors.packageId = "ID paket harus diisi";
      }

      if (!formData.jumlahPeserta || formData.jumlahPeserta < 1) {
        errors.jumlahPeserta = "Jumlah peserta minimal 1 orang";
      }

      if (
        !formData.selectedSchedule?.tanggalAwal ||
        !formData.selectedSchedule?.tanggalAkhir
      ) {
        errors.selectedSchedule = "Jadwal keberangkatan harus dipilih";
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors,
      };
    },
    []
  );

  // Calculate total
  const calculateTotal = useCallback(
    (paketWisata: ITourPackage, jumlahPeserta: number): number => {
      if (!paketWisata?.harga || !jumlahPeserta) return 0;
      return paketWisata.harga * jumlahPeserta;
    },
    []
  );

  // Calculate DP
  const calculateDP = useCallback(
    (paketWisata: ITourPackage, jumlahPeserta: number): number => {
      if (!paketWisata?.harga || !jumlahPeserta) return 0;
      return Math.round(paketWisata.harga * jumlahPeserta * 0.5);
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return {
    // States
    isLoading,
    isSubmitting,
    isPolling,
    error,
    bookingData,

    // Booking Operations
    createBooking,
    getBookingById,
    getUserBookings,

    // Payment Operations
    processPayment,
    checkPaymentStatus,
    simulatePaymentSuccess,
    startPollingPaymentStatus,
    stopPollingPaymentStatus,

    // Enhanced Payment Operations
    checkPaymentStatusManual,
    getBookingByIdWithRefresh,
    startEnhancedPollingPaymentStatus,
    checkVoucherAvailability,
    generateBookingVoucher,

    // Booking Management
    cancelBooking,

    // Voucher Operations
    getBookingVoucher,

    // Utility Functions
    validateBookingForm,
    calculateTotal,
    calculateDP,
    getBankAccounts,

    // Auth Data
    user,
    isAuthenticated,

    // State Management
    setBookingData,
    clearError,
  };
}
