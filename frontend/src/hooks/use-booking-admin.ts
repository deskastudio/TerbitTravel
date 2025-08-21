// hooks/use-booking-admin.ts - Khusus untuk Admin (Fixed)

import { useState, useEffect, useCallback } from "react";
import { BookingAdminService } from "@/services/booking-admin.service";
import {
  IBooking,
  IBookingFilter,
  IBookingStats,
  IBookingStatusUpdate,
  IVoucherData
} from "@/types/booking.types";
import { useToast } from "@/hooks/use-toast";

export function useBookingAdmin() {
  // ========================
  //     State Data
  // ========================
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [stats, setStats] = useState<IBookingStats>({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0
  });

  // ========================
  //     State Loading
  // ========================
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { toast } = useToast();

  // ========================
  //   Fetch All Bookings
  // ========================
  const fetchAllBookings = useCallback(async (filters?: IBookingFilter) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching admin bookings with filters:", filters);

      const response = await BookingAdminService.getAllBookings(filters);
      
      if (response.success) {
        console.log('Fetched admin bookings:', response.data);
        setBookings(response.data || []);
        if (response.stats) {
          setStats(response.stats);
        }
      } else {
        throw new Error(response.message || "Failed to fetch bookings");
      }

    } catch (err) {
      console.error("Error fetching admin bookings:", err);
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil data pemesanan"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // ========================
  //   Fetch Booking Stats
  // ========================
  const fetchBookingStats = useCallback(async (dateRange?: { start: string; end: string }) => {
    try {
      const statsData = await BookingAdminService.getBookingStats(dateRange);
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching booking stats:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil statistik pemesanan"
      });
    }
  }, [toast]);

  // ========================
  //   Update Booking Status
  // ========================
  const updateBookingStatus = async (id: string, statusUpdate: IBookingStatusUpdate) => {
    try {
      setIsUpdating(true);
      
      const response = await BookingAdminService.updateBookingStatus(id, statusUpdate);
      
      if (response.success && response.data) {
        // Update booking in local state
        setBookings(prev => prev.map(booking => 
          booking._id === id ? { ...booking, ...response.data } : booking
        ));

        toast({
          title: "Sukses",
          description: "Status pemesanan berhasil diperbarui",
        });

        // Refresh stats
        await fetchBookingStats();
        
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update booking status");
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui status pemesanan",
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  // ========================
  //   Confirm Payment
  // ========================
  const confirmPayment = async (id: string) => {
    try {
      setIsUpdating(true);
      
      const response = await BookingAdminService.confirmPayment(id);
      
      if (response.success && response.data) {
        // Update booking in local state
        setBookings(prev => prev.map(booking => 
          booking._id === id ? { ...booking, ...response.data } : booking
        ));

        toast({
          title: "Sukses",
          description: "Pembayaran berhasil dikonfirmasi",
        });

        // Refresh stats
        await fetchBookingStats();
        
        return response.data;
      } else {
        throw new Error(response.message || "Failed to confirm payment");
      }
    } catch (err) {
      console.error("Error confirming payment:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengkonfirmasi pembayaran",
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  // ========================
  //   Cancel Booking
  // ========================
  const cancelBooking = async (id: string, reason?: string) => {
    try {
      setIsUpdating(true);
      
      const response = await BookingAdminService.cancelBooking(id, reason);
      
      if (response.success && response.data) {
        // Update booking in local state
        setBookings(prev => prev.map(booking => 
          booking._id === id ? { ...booking, ...response.data } : booking
        ));

        toast({
          title: "Sukses",
          description: "Pemesanan berhasil dibatalkan",
        });

        // Refresh stats
        await fetchBookingStats();
        
        return response.data;
      } else {
        throw new Error(response.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal membatalkan pemesanan",
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  // ========================
  //   Generate Voucher
  // ========================
  const generateVoucher = async (id: string): Promise<IVoucherData | null> => {
    try {
      setIsUpdating(true);
      
      const response = await BookingAdminService.generateVoucher(id);
      
      if (response.success && response.voucher) {
        // Update booking in local state
        setBookings(prev => prev.map(booking => 
          booking._id === id ? { ...booking, voucherGenerated: true, voucherCode: response.voucher?.voucherCode } : booking
        ));

        toast({
          title: "Sukses",
          description: "E-voucher berhasil dibuat",
        });
        
        return response.voucher;
      } else {
        throw new Error(response.message || "Failed to generate voucher");
      }
    } catch (err) {
      console.error("Error generating voucher:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal membuat e-voucher",
      });
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  // ========================
  //   Check Payment Status
  // ========================
  const checkPaymentStatus = async (id: string) => {
    try {
      setIsUpdating(true);
      
      const response = await BookingAdminService.checkPaymentStatus(id);
      
      if (response.success && response.booking) {
        // Update booking in local state
        setBookings(prev => prev.map(booking => 
          booking._id === id ? { ...booking, ...response.booking } : booking
        ));

        toast({
          title: "Status Diperbarui",
          description: `Status pembayaran: ${response.status}`,
        });
        
        return response.booking;
      } else {
        throw new Error(response.message || "Failed to check payment status");
      }
    } catch (err) {
      console.error("Error checking payment status:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memeriksa status pembayaran",
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  // ========================
  //   Send Reminder
  // ========================
  const sendBookingReminder = async (id: string) => {
    try {
      setIsUpdating(true);
      
      const response = await BookingAdminService.sendBookingReminder(id);
      
      if (response.success) {
        toast({
          title: "Sukses",
          description: "Pengingat berhasil dikirim",
        });
        
        return true;
      } else {
        throw new Error(response.message || "Failed to send reminder");
      }
    } catch (err) {
      console.error("Error sending reminder:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengirim pengingat",
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // ========================
  //   Export Bookings
  // ========================
  const exportBookings = async (filters?: IBookingFilter, format: 'csv' | 'excel' = 'excel') => {
    try {
      setIsExporting(true);
      
      const blob = await BookingAdminService.exportBookings(filters, format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `bookings-export-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Sukses",
        description: "Data pemesanan berhasil diekspor",
      });
      
    } catch (err) {
      console.error("Error exporting bookings:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengekspor data pemesanan",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // ========================
  //   Delete Booking
  // ========================
  const deleteBooking = async (id: string) => {
    try {
      setIsUpdating(true);
      
      await BookingAdminService.deleteBooking(id);
      
      // Remove booking from local state
      setBookings(prev => prev.filter(booking => booking._id !== id));

      toast({
        title: "Sukses",
        description: "Pemesanan berhasil dihapus",
      });

      // Refresh stats
      await fetchBookingStats();
      
    } catch (err) {
      console.error("Error deleting booking:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus pemesanan",
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  // ========================
  //   useEffect -> Mount
  // ========================
  useEffect(() => {
    fetchAllBookings();
    fetchBookingStats();
  }, [fetchAllBookings, fetchBookingStats]);

  // ========================
  //     Return API
  // ========================
  return {
    // Data
    bookings,
    stats,

    // State loading / error
    isLoading,
    isUpdating,
    isExporting,
    error,

    // Admin booking operations
    fetchAllBookings,
    fetchBookingStats,
    updateBookingStatus,
    confirmPayment,
    cancelBooking,
    generateVoucher,
    checkPaymentStatus,
    sendBookingReminder,
    exportBookings,
    deleteBooking,

    // Refresh
    refreshData: () => {
      fetchAllBookings();
      fetchBookingStats();
    },
  };
}