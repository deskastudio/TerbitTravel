// hooks/use-booking.ts

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { BookingService, BookingFormData, BookingResponse, PaymentRequestData, PaymentResponse } from "@/services/booking.service";
import { ITourPackage } from "@/types/tour-package.types";
import { useAuth } from "@/hooks/use-auth";

export function useBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingResponse | null>(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Membuat booking baru
  const createBooking = useCallback(async (formData: BookingFormData): Promise<BookingResponse | null> => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Log data yang akan dikirim
      console.log("Submitting booking data:", formData);

      // Verifikasi data booking sebelum dikirim
      const { isValid, errors } = validateBookingForm(formData);
      if (!isValid) {
        const errorMessage = "Data pemesanan tidak valid. Silakan periksa kembali.";
        toast({
          variant: "destructive",
          title: "Gagal membuat pemesanan",
          description: errorMessage
        });
        setError(errorMessage);
        return null;
      }

      // Kirim data ke API
      const response = await BookingService.createBooking(formData);
      
      // Simpan data booking ke state
      setBookingData(response);
      
      toast({
        title: "Pemesanan berhasil!",
        description: "Silakan lakukan pembayaran untuk menyelesaikan transaksi"
      });
      
      return response;
    } catch (err: any) {
      console.error("Error creating booking:", err);
      
      let errorMessage = "Gagal membuat pemesanan";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      
      toast({
        variant: "destructive",
        title: "Gagal membuat pemesanan",
        description: errorMessage
      });
      
      setError(errorMessage);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  // Mendapatkan detail booking
  const getBookingById = useCallback(async (id: string): Promise<BookingResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await BookingService.getBookingById(id);
      setBookingData(response);
      return response;
    } catch (err: any) {
      console.error(`Error fetching booking with id ${id}:`, err);
      
      let errorMessage = "Gagal mendapatkan detail pemesanan";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mendapatkan daftar booking user
  const getUserBookings = useCallback(async (): Promise<BookingResponse[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      return await BookingService.getUserBookings();
    } catch (err: any) {
      console.error("Error fetching user bookings:", err);
      
      let errorMessage = "Gagal mendapatkan daftar pemesanan";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mengunggah bukti pembayaran
  const uploadPaymentProof = useCallback(async (id: string, file: File): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await BookingService.uploadPaymentProof(id, file);
      
      if (response.success) {
        toast({
          title: "Bukti pembayaran terkirim",
          description: "Bukti pembayaran Anda sedang diverifikasi"
        });
        
        // Perbarui bookingData jika ada
        if (bookingData && bookingData.bookingId === id) {
          setBookingData(prev => {
            if (!prev) return null;
            return {
              ...prev,
              status: "pending_verification"
            };
          });
        }
        
        return true;
      } else {
        throw new Error(response.message || "Gagal mengunggah bukti pembayaran");
      }
    } catch (err: any) {
      console.error(`Error uploading payment proof for booking ${id}:`, err);
      
      let errorMessage = "Gagal mengunggah bukti pembayaran";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        variant: "destructive",
        title: "Gagal mengunggah bukti pembayaran",
        description: errorMessage
      });
      
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast, bookingData]);

  // Membatalkan booking
  const cancelBooking = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await BookingService.cancelBooking(id);
      
      if (response.success) {
        toast({
          title: "Pemesanan dibatalkan",
          description: "Pemesanan Anda telah berhasil dibatalkan"
        });
        
        // Perbarui bookingData jika ada
        if (bookingData && bookingData.bookingId === id) {
          setBookingData(prev => {
            if (!prev) return null;
            return {
              ...prev,
              status: "cancelled"
            };
          });
        }
        
        return true;
      } else {
        throw new Error(response.message || "Gagal membatalkan pemesanan");
      }
    } catch (err: any) {
      console.error(`Error cancelling booking ${id}:`, err);
      
      let errorMessage = "Gagal membatalkan pemesanan";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        variant: "destructive",
        title: "Gagal membatalkan pemesanan",
        description: errorMessage
      });
      
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast, bookingData]);

  // Proses pembayaran dengan Midtrans
  const processPayment = useCallback(async (params: PaymentRequestData): Promise<PaymentResponse | null> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await BookingService.processPayment(params);
      
      if (!response.success) {
        throw new Error(response.message || "Gagal memproses pembayaran");
      }
      
      return response;
    } catch (err: any) {
      console.error("Error processing payment:", err);
      
      let errorMessage = "Gagal memproses pembayaran";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        variant: "destructive",
        title: "Gagal memproses pembayaran",
        description: errorMessage
      });
      
      setError(errorMessage);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  // Cek status pembayaran
  const checkPaymentStatus = useCallback(async (id: string): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await BookingService.getPaymentStatus(id);
      
      if (response.success && response.status) {
        // Update bookingData jika status berubah
        if (bookingData && bookingData.bookingId === id) {
          let newBookingStatus = bookingData.status;
          
          // Jika status pembayaran adalah settlement atau capture, update status booking menjadi confirmed
          if (response.status === 'settlement' || response.status === 'capture') {
            newBookingStatus = 'confirmed';
          }
          
          setBookingData(prev => {
            if (!prev) return null;
            return {
              ...prev,
              status: newBookingStatus,
              paymentStatus: response.status,
              paymentMethod: response.paymentMethod || prev.paymentMethod,
              paymentDate: response.paymentDate || prev.paymentDate
            };
          });
        }
        
        return response.status;
      }
      
      return null;
    } catch (err: any) {
      console.error(`Error checking payment status for booking ${id}:`, err);
      
      let errorMessage = "Gagal mengecek status pembayaran";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [bookingData]);

  // Simulasi pembayaran berhasil (untuk testing)
  const completePayment = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await BookingService.completePayment(id);
      
      if (response.success) {
        toast({
          title: "Pembayaran berhasil",
          description: "Pembayaran Anda telah berhasil dikonfirmasi"
        });
        
        // Update bookingData
        if (bookingData && bookingData.bookingId === id) {
          setBookingData(prev => {
            if (!prev) return null;
            return {
              ...prev,
              status: 'confirmed',
              paymentStatus: 'settlement',
              paymentDate: new Date().toISOString()
            };
          });
        }
        
        return true;
      } else {
        throw new Error(response.message || "Gagal menyelesaikan pembayaran");
      }
    } catch (err: any) {
      console.error(`Error completing payment for booking ${id}:`, err);
      
      let errorMessage = "Gagal menyelesaikan pembayaran";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        variant: "destructive",
        title: "Gagal menyelesaikan pembayaran",
        description: errorMessage
      });
      
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast, bookingData]);

  // Mendapatkan rekening bank untuk pembayaran
  const getBankAccounts = useCallback(async () => {
    try {
      return await BookingService.getBankAccounts();
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      // Return default data jika API belum siap
      return [
        { bank: "BCA", accountNumber: "1234567890", accountName: "PT Travedia Indonesia" },
        { bank: "Mandiri", accountNumber: "0987654321", accountName: "PT Travedia Indonesia" },
        { bank: "BNI", accountNumber: "1122334455", accountName: "PT Travedia Indonesia" },
      ];
    }
  }, []);

  // Mendapatkan voucher booking
  const getBookingVoucher = useCallback(async (id: string): Promise<{
    voucherUrl: string;
    voucherCode: string;
  } | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      return await BookingService.getBookingVoucher(id);
    } catch (err: any) {
      console.error(`Error fetching voucher for booking ${id}:`, err);
      
      let errorMessage = "Gagal mendapatkan voucher pemesanan";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validasi form booking
  const validateBookingForm = useCallback((formData: Omit<BookingFormData, 'paketId' | 'jadwalId' | 'jumlahPeserta' | 'totalHarga'>): { isValid: boolean; errors: Partial<BookingFormData> } => {
    const errors: Partial<BookingFormData> = {};

    if (!formData.nama || formData.nama.trim() === "") {
      errors.nama = "Nama lengkap harus diisi";
    }

    if (!formData.email || formData.email.trim() === "") {
      errors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }

    if (!formData.telepon || formData.telepon.trim() === "") {
      errors.telepon = "Nomor telepon harus diisi";
    } else if (!/^[0-9]{10,13}$/.test(formData.telepon.replace(/\D/g, ""))) {
      errors.telepon = "Nomor telepon tidak valid (10-13 digit)";
    }

    if (!formData.alamat || formData.alamat.trim() === "") {
      errors.alamat = "Alamat harus diisi";
    }

    if (!formData.setuju) {
      errors.setuju = "Anda harus menyetujui syarat dan ketentuan";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  // Menghitung total harga
  const calculateTotal = useCallback((paketWisata: ITourPackage, jumlahPeserta: number): number => {
    return paketWisata.harga * jumlahPeserta;
  }, []);

  // Menghitung DP (50% dari total)
  const calculateDP = useCallback((paketWisata: ITourPackage, jumlahPeserta: number): number => {
    return (paketWisata.harga * jumlahPeserta) * 0.5;
  }, []);

  return {
    isLoading,
    isSubmitting,
    error,
    bookingData,
    createBooking,
    getBookingById,
    getUserBookings,
    uploadPaymentProof,
    cancelBooking,
    processPayment,
    checkPaymentStatus,
    completePayment,
    getBankAccounts,
    getBookingVoucher,
    validateBookingForm,
    calculateTotal,
    calculateDP,
    // Expose user data dari useAuth
    user,
    isAuthenticated
  };
}