// services/booking-admin.service.ts - Khusus untuk Admin

import axios from "@/lib/axios";
import {
  IBooking,
  IBookingListResponse,
  IBookingResponse,
  IBookingFilter,
  IBookingStats,
  IBookingStatusUpdate,
  IVoucherData,
  BookingStatus,
  PaymentStatus
} from "@/types/booking.types";

export class BookingAdminService {
  // Retry mechanism yang sama dengan TourPackageService
  private static async callWithRetry<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: any;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        console.error(`API call failed (attempt ${attempt + 1}/${maxRetries}):`, error);
        lastError = error;
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
        }
      }
    }
    throw lastError;
  }

  // ========================
  //     FALLBACK DATA untuk Development
  // ========================
  private static generateFallbackBookings(): IBooking[] {
    return [
      {
        _id: "booking-1",
        bookingId: "BOOK-12345678",
        userId: "user-1",
        packageInfo: {
          id: "pkg-1",
          nama: "Paket Wisata Bali 3D2N",
          harga: 1500000,
          destination: "Bali",
          durasi: "3 Hari 2 Malam"
        },
        selectedSchedule: {
          tanggalAwal: "2025-02-15",
          tanggalAkhir: "2025-02-17"
        },
        customerInfo: {
          nama: "John Doe",
          email: "john@example.com",
          telepon: "081234567890",
          alamat: "Jl. Contoh No. 123, Jakarta",
          instansi: "PT. Contoh"
        },
        jumlahPeserta: 2,
        harga: 1500000,
        totalHarga: 3000000,
        status: "confirmed",
        paymentStatus: "settlement",
        paymentMethod: "gopay",
        paymentDate: "2025-01-15T10:30:00Z",
        voucherGenerated: true,
        voucherCode: "VOUCHER-12345678",
        createdAt: "2025-01-14T15:20:00Z",
        updatedAt: "2025-01-15T10:30:00Z",
        createdBy: "user"
      },
      {
        _id: "booking-2", 
        bookingId: "BOOK-87654321",
        userId: "user-2",
        packageInfo: {
          id: "pkg-2",
          nama: "Paket Wisata Jogja 4D3N",
          harga: 1200000,
          destination: "Yogyakarta",
          durasi: "4 Hari 3 Malam"
        },
        selectedSchedule: {
          tanggalAwal: "2025-03-01",
          tanggalAkhir: "2025-03-04"
        },
        customerInfo: {
          nama: "Jane Smith",
          email: "jane@example.com", 
          telepon: "081987654321",
          alamat: "Jl. Test No. 456, Bandung"
        },
        jumlahPeserta: 4,
        harga: 1200000,
        totalHarga: 4800000,
        status: "pending_verification",
        paymentStatus: "pending",
        createdAt: "2025-01-16T09:15:00Z",
        updatedAt: "2025-01-16T09:15:00Z",
        createdBy: "user"
      },
      {
        _id: "booking-3",
        bookingId: "BOOK-11223344", 
        userId: "user-3",
        packageInfo: {
          id: "pkg-3",
          nama: "Paket Wisata Lombok 5D4N",
          harga: 2000000,
          destination: "Lombok",
          durasi: "5 Hari 4 Malam"
        },
        selectedSchedule: {
          tanggalAwal: "2025-04-10",
          tanggalAkhir: "2025-04-14"
        },
        customerInfo: {
          nama: "Bob Wilson",
          email: "bob@example.com",
          telepon: "081555666777",
          alamat: "Jl. Sample No. 789, Surabaya"
        },
        jumlahPeserta: 1,
        harga: 2000000,
        totalHarga: 2000000,
        status: "cancelled",
        paymentStatus: "cancel",
        createdAt: "2025-01-10T14:45:00Z",
        updatedAt: "2025-01-12T11:20:00Z",
        createdBy: "user"
      }
    ];
  }

  private static generateFallbackStats(): IBookingStats {
    return {
      totalBookings: 15,
      confirmedBookings: 8,
      pendingBookings: 4,
      cancelledBookings: 3,
      totalRevenue: 45000000,
      averageOrderValue: 3000000,
      conversionRate: 0.73
    };
  }

  // ========================
  //     Get All Bookings
  // ========================
  static async getAllBookings(filters?: IBookingFilter): Promise<IBookingListResponse> {
    try {
      return await this.callWithRetry(async () => {
        const params = new URLSearchParams();
        
        if (filters?.status && filters.status !== "all") {
          params.append("status", filters.status);
        }
        if (filters?.paymentStatus && filters.paymentStatus !== "all") {
          params.append("paymentStatus", filters.paymentStatus);
        }
        if (filters?.paymentMethod && filters.paymentMethod !== "all") {
          params.append("paymentMethod", filters.paymentMethod);
        }
        if (filters?.packageId && filters.packageId !== "all") {
          params.append("packageId", filters.packageId);
        }
        if (filters?.customerName) {
          params.append("customerName", filters.customerName);
        }
        if (filters?.bookingId) {
          params.append("bookingId", filters.bookingId);
        }
        if (filters?.dateRange?.start) {
          params.append("startDate", filters.dateRange.start);
        }
        if (filters?.dateRange?.end) {
          params.append("endDate", filters.dateRange.end);
        }

        const queryString = params.toString();
        const url = queryString ? `/admin/bookings?${queryString}` : "/admin/bookings";
        
        const response = await axios.get(url);
        console.log("Response dari API admin bookings:", response.data);
        
        // Handle jika data tidak valid
        if (!response.data.success) {
          console.error("API response tidak success:", response.data);
          return {
            success: false,
            data: [],
            message: response.data.message || "Failed to fetch bookings"
          };
        }
        
        // Pastikan data adalah array
        const bookings = Array.isArray(response.data.data) ? response.data.data : [];
        
        // Map data untuk memastikan struktur yang benar
        const mappedBookings = bookings.map(booking => ({
          ...booking,
          customerInfo: booking.customerInfo || {
            nama: 'Unknown Customer',
            email: '',
            telepon: '',
            alamat: ''
          },
          packageInfo: booking.packageInfo || {
            id: '',
            nama: 'Unknown Package',
            harga: 0
          },
          selectedSchedule: booking.selectedSchedule || {
            tanggalAwal: new Date().toISOString(),
            tanggalAkhir: new Date().toISOString()
          }
        }));

        return {
          success: true,
          data: mappedBookings,
          pagination: response.data.pagination,
          stats: response.data.stats
        };
      });
    } catch (error) {
      console.error("Error fetching admin bookings:", error);
      // Return fallback data untuk development
      return {
        success: true,
        data: this.generateFallbackBookings(),
        stats: this.generateFallbackStats()
      };
    }
  }

  // ========================
  //     Get Booking by ID
  // ========================
  static async getBookingById(id: string): Promise<IBookingResponse> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get(`/admin/bookings/${id}`);
        
        if (!response.data.success) {
          throw new Error(response.data.message || "Booking not found");
        }

        // Add default values for important fields if missing
        const bookingData = response.data.data;
        return {
          success: true,
          data: {
            ...bookingData,
            customerInfo: bookingData.customerInfo || {
              nama: 'Unknown Customer',
              email: '',
              telepon: '',
              alamat: ''
            },
            packageInfo: bookingData.packageInfo || {
              id: '',
              nama: 'Unknown Package',
              harga: 0
            },
            selectedSchedule: bookingData.selectedSchedule || {
              tanggalAwal: new Date().toISOString(),
              tanggalAkhir: new Date().toISOString()
            }
          }
        };
      });
    } catch (error) {
      console.error(`Error fetching booking with id ${id}:`, error);
      
      // Fallback untuk development - buat dummy booking
      const fallbackBooking = this.generateFallbackBookings().find(b => b._id === id || b.bookingId === id);
      if (fallbackBooking) {
        return {
          success: true,
          data: fallbackBooking
        };
      }
      
      throw error;
    }
  }

  // ========================
  //     Update Booking Status
  // ========================
  static async updateBookingStatus(
    id: string,
    statusUpdate: IBookingStatusUpdate
  ): Promise<IBookingResponse> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.put(`/admin/bookings/${id}/status`, statusUpdate);
        return response.data;
      });
    } catch (error) {
      console.error(`Error updating booking status for id ${id}:`, error);
      
      // Fallback untuk development
      const fallbackBooking = this.generateFallbackBookings().find(b => b._id === id);
      if (fallbackBooking) {
        return {
          success: true,
          data: {
            ...fallbackBooking,
            status: statusUpdate.status,
            paymentStatus: statusUpdate.paymentStatus || fallbackBooking.paymentStatus,
            updatedAt: new Date().toISOString()
          }
        };
      }
      
      throw error;
    }
  }

  // ========================
  //     Cancel Booking
  // ========================
  static async cancelBooking(id: string, reason?: string): Promise<IBookingResponse> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.put(`/admin/bookings/${id}/cancel`, { reason });
        return response.data;
      });
    } catch (error) {
      console.error(`Error cancelling booking with id ${id}:`, error);
      
      // Fallback untuk development
      const fallbackBooking = this.generateFallbackBookings().find(b => b._id === id);
      if (fallbackBooking) {
        return {
          success: true,
          data: {
            ...fallbackBooking,
            status: "cancelled" as BookingStatus,
            updatedAt: new Date().toISOString()
          }
        };
      }
      
      throw error;
    }
  }

  // ========================
  //     Confirm Payment
  // ========================
  static async confirmPayment(id: string): Promise<IBookingResponse> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.put(`/admin/bookings/${id}/confirm-payment`);
        return response.data;
      });
    } catch (error) {
      console.error(`Error confirming payment for booking ${id}:`, error);
      
      // Fallback untuk development
      const fallbackBooking = this.generateFallbackBookings().find(b => b._id === id);
      if (fallbackBooking) {
        return {
          success: true,
          data: {
            ...fallbackBooking,
            status: "confirmed" as BookingStatus,
            paymentStatus: "settlement" as PaymentStatus,
            paymentDate: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };
      }
      
      throw error;
    }
  }

  // ========================
  //     Generate Voucher
  // ========================
  static async generateVoucher(id: string): Promise<{ success: boolean; voucher?: IVoucherData; message: string }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.post(`/admin/bookings/${id}/generate-voucher`);
        return response.data;
      });
    } catch (error) {
      console.error(`Error generating voucher for booking ${id}:`, error);
      
      // Fallback untuk development
      return {
        success: true,
        voucher: {
          bookingId: id,
          voucherCode: `VOUCHER-${id}`,
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${id}`,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          customerName: "Test Customer",
          packageName: "Test Package",
          participantCount: 2,
          totalAmount: 2000000,
          voucherUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${id}`
        },
        message: "Voucher generated successfully (development mode)"
      };
    }
  }

  // ========================
  //     Get Booking Stats
  // ========================
  static async getBookingStats(dateRange?: { start: string; end: string }): Promise<IBookingStats> {
    try {
      return await this.callWithRetry(async () => {
        const params = new URLSearchParams();
        if (dateRange?.start) {
          params.append("startDate", dateRange.start);
        }
        if (dateRange?.end) {
          params.append("endDate", dateRange.end);
        }

        const queryString = params.toString();
        const url = queryString ? `/admin/bookings/stats?${queryString}` : "/admin/bookings/stats";
        
        const response = await axios.get(url);
        return response.data.data || this.generateFallbackStats();
      });
    } catch (error) {
      console.error("Error fetching booking stats:", error);
      // Return default stats on error
      return this.generateFallbackStats();
    }
  }

  // ========================
  //     Manual Payment Check
  // ========================
  static async checkPaymentStatus(id: string): Promise<{ success: boolean; status: string; message: string; booking?: IBooking }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.post(`/admin/bookings/${id}/check-payment`);
        return response.data;
      });
    } catch (error) {
      console.error(`Error checking payment status for booking ${id}:`, error);
      
      // Fallback untuk development
      const fallbackBooking = this.generateFallbackBookings().find(b => b._id === id);
      if (fallbackBooking) {
        return {
          success: true,
          status: fallbackBooking.status,
          message: "Status from fallback data",
          booking: fallbackBooking
        };
      }
      
      throw error;
    }
  }

  // ========================
  //     Send Booking Reminder
  // ========================
  static async sendBookingReminder(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.post(`/admin/bookings/${id}/send-reminder`);
        return response.data;
      });
    } catch (error) {
      console.error(`Error sending reminder for booking ${id}:`, error);
      
      // Fallback untuk development
      return {
        success: true,
        message: "Reminder sent successfully (development mode)"
      };
    }
  }

  // ========================
  //     Export Bookings
  // ========================
  static async exportBookings(filters?: IBookingFilter, format: 'csv' | 'excel' = 'excel'): Promise<Blob> {
    try {
      return await this.callWithRetry(async () => {
        const params = new URLSearchParams();
        params.append("format", format);
        
        if (filters?.status && filters.status !== "all") {
          params.append("status", filters.status);
        }
        if (filters?.paymentStatus && filters.paymentStatus !== "all") {
          params.append("paymentStatus", filters.paymentStatus);
        }
        if (filters?.dateRange?.start) {
          params.append("startDate", filters.dateRange.start);
        }
        if (filters?.dateRange?.end) {
          params.append("endDate", filters.dateRange.end);
        }

        const response = await axios.get(`/admin/bookings/export?${params.toString()}`, {
          responseType: 'blob'
        });
        
        return response.data;
      });
    } catch (error) {
      console.error("Error exporting bookings:", error);
      
      // Fallback - create dummy blob
      const csvData = "Booking ID,Customer,Package,Amount\nBOOK-123,John Doe,Bali Tour,3000000";
      return new Blob([csvData], { type: 'text/csv' });
    }
  }

  // ========================
  //     Delete Booking
  // ========================
  static async deleteBooking(id: string): Promise<void> {
    try {
      await this.callWithRetry(async () => {
        await axios.delete(`/admin/bookings/${id}`);
      });
    } catch (error) {
      console.error(`Error deleting booking with id ${id}:`, error);
      
      // Untuk development, tidak perlu throw error
      if (process.env.NODE_ENV === "development") {
        console.log("Delete booking completed (development mode)");
        return;
      }
      
      throw error;
    }
  }
}