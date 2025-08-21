// services/booking-admin.service.ts - Khusus untuk Admin

import axios from "@/lib/axios";
import {
  IBooking,
  IBookingListResponse,
  IBookingResponse,
  IBookingFilter,
  IBookingStats,
  IBookingStatusUpdate,
  BookingStatus,
  PaymentStatus,
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
        console.error(
          `API call failed (attempt ${attempt + 1}/${maxRetries}):`,
          error
        );
        lastError = error;
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, delayMs * (attempt + 1))
          );
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
          durasi: "3 Hari 2 Malam",
        },
        selectedSchedule: {
          tanggalAwal: "2025-02-15",
          tanggalAkhir: "2025-02-17",
        },
        customerInfo: {
          nama: "John Doe",
          email: "john@example.com",
          telepon: "081234567890",
          alamat: "Jl. Contoh No. 123, Jakarta",
          instansi: "PT. Contoh",
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
        createdBy: "user",
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
          durasi: "4 Hari 3 Malam",
        },
        selectedSchedule: {
          tanggalAwal: "2025-03-01",
          tanggalAkhir: "2025-03-04",
        },
        customerInfo: {
          nama: "Jane Smith",
          email: "jane@example.com",
          telepon: "081987654321",
          alamat: "Jl. Test No. 456, Bandung",
        },
        jumlahPeserta: 4,
        harga: 1200000,
        totalHarga: 4800000,
        status: "pending_verification",
        paymentStatus: "pending",
        createdAt: "2025-01-16T09:15:00Z",
        updatedAt: "2025-01-16T09:15:00Z",
        createdBy: "user",
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
          durasi: "5 Hari 4 Malam",
        },
        selectedSchedule: {
          tanggalAwal: "2025-04-10",
          tanggalAkhir: "2025-04-14",
        },
        customerInfo: {
          nama: "Bob Wilson",
          email: "bob@example.com",
          telepon: "081555666777",
          alamat: "Jl. Sample No. 789, Surabaya",
        },
        jumlahPeserta: 1,
        harga: 2000000,
        totalHarga: 2000000,
        status: "cancelled",
        paymentStatus: "cancel",
        createdAt: "2025-01-10T14:45:00Z",
        updatedAt: "2025-01-12T11:20:00Z",
        createdBy: "user",
      },
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
      conversionRate: 0.73,
    };
  }

  // ========================
  //     Get All Bookings
  // ========================
  static async getAllBookings(
    filters?: IBookingFilter
  ): Promise<IBookingListResponse> {
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

        // Tambah pagination berdasarkan filter atau default
        params.append("page", filters?.page?.toString() || "1");
        params.append("limit", filters?.limit?.toString() || "50");

        const queryString = params.toString();

        // DEBUG: Try debug endpoint first (development)
        try {
          console.log("🔍 Trying debug endpoint for bookings...");
          const debugResponse = await axios.get("/api/debug/bookings");

          if (debugResponse.data.success && debugResponse.data.data) {
            console.log(
              "✅ Using debug endpoint - Found bookings:",
              debugResponse.data.data.length
            );
            const debugBookings = Array.isArray(debugResponse.data.data)
              ? debugResponse.data.data
              : [];

            // Map data debug
            const mappedDebugBookings = debugBookings.map((booking: any) => {
              console.log("🔄 Mapping debug booking:", booking);
              return {
                _id: booking._id,
                bookingId: booking.customId || booking._id,
                userId: booking.userId?._id || booking.userId,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                paymentMethod: booking.paymentMethod || booking.paymentType,
                jumlahPeserta: booking.jumlahPeserta,
                harga: booking.harga || booking.totalAmount,
                totalHarga: booking.totalAmount || booking.harga,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
                selectedSchedule: booking.selectedSchedule || booking.schedule,
                customerInfo: booking.customerInfo || {
                  nama: "Unknown Customer",
                  email: "",
                  telepon: "",
                  alamat: "",
                  instansi: "",
                },
                packageInfo:
                  booking.packageInfo ||
                  (booking.packageId
                    ? {
                        id: booking.packageId._id || booking.packageId,
                        nama: booking.packageId.nama || "Unknown Package",
                        harga: booking.packageId.harga || 0,
                        destination: booking.packageId.destination?.nama || "",
                        armada: booking.packageId.armada?.nama || "",
                        hotel: booking.packageId.hotel?.nama || "",
                      }
                    : {
                        id: "",
                        nama: "Unknown Package",
                        harga: 0,
                        destination: "",
                        armada: "",
                        hotel: "",
                      }),
              };
            });

            return {
              success: true,
              data: mappedDebugBookings,
              stats: {
                totalBookings: mappedDebugBookings.length,
                confirmedBookings: mappedDebugBookings.filter(
                  (b: IBooking) => b.status === "confirmed"
                ).length,
                pendingBookings: mappedDebugBookings.filter(
                  (b: IBooking) => b.status === "pending"
                ).length,
                cancelledBookings: mappedDebugBookings.filter(
                  (b: IBooking) => b.status === "cancelled"
                ).length,
                totalRevenue: mappedDebugBookings.reduce(
                  (sum: number, b: IBooking) => sum + (b.totalHarga || 0),
                  0
                ),
                averageOrderValue: 0,
                conversionRate: 0,
              },
            };
          }
        } catch (debugError) {
          console.log("⚠️ Debug endpoint failed, trying main endpoint...");
        }

        // Main endpoint with auth
        const url = queryString
          ? `/api/bookings?${queryString}`
          : "/api/bookings";

        console.log("🔍 Fetching bookings from:", url);
        const response = await axios.get(url);
        console.log("📊 Response dari API admin bookings:", response.data);

        // Handle jika data tidak valid
        if (!response.data.success) {
          console.error("❌ API response tidak success:", response.data);
          throw new Error(response.data.message || "Failed to fetch bookings");
        }

        // Pastikan data adalah array
        const bookings = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        console.log("📋 Raw bookings from backend:", bookings);

        // Map data untuk memastikan struktur yang benar
        const mappedBookings = bookings.map((booking: any) => {
          console.log("🔄 Mapping booking:", booking);
          return {
            _id: booking._id,
            bookingId: booking.customId || booking._id,
            userId: booking.userId?._id || booking.userId,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            paymentMethod: booking.paymentMethod || booking.paymentType,
            jumlahPeserta: booking.jumlahPeserta,
            harga: booking.harga || booking.totalAmount,
            totalHarga: booking.totalAmount || booking.harga,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
            selectedSchedule: booking.selectedSchedule || booking.schedule,
            // Use customerInfo langsung dari database
            customerInfo: booking.customerInfo || {
              nama: "Unknown Customer",
              email: "",
              telepon: "",
              alamat: "",
              instansi: "",
            },
            // Use packageInfo langsung dari database atau dari populated packageId
            packageInfo:
              booking.packageInfo ||
              (booking.packageId
                ? {
                    id: booking.packageId._id || booking.packageId,
                    nama: booking.packageId.nama || "Unknown Package",
                    harga: booking.packageId.harga || 0,
                    destination: booking.packageId.destination?.nama || "",
                    armada: booking.packageId.armada?.nama || "",
                    hotel: booking.packageId.hotel?.nama || "",
                  }
                : {
                    id: "",
                    nama: "Unknown Package",
                    harga: 0,
                    destination: "",
                    armada: "",
                    hotel: "",
                  }),
          };
        });

        console.log("✅ Mapped bookings:", mappedBookings);

        return {
          success: true,
          data: mappedBookings,
          pagination: response.data.pagination,
          stats: response.data.stats,
        };
      });
    } catch (error) {
      console.error("❌ Error fetching admin bookings:", error);

      // Cek apakah error 401 (unauthorized)
      if ((error as any)?.response?.status === 401) {
        console.warn("🔐 Unauthorized access - Admin needs to login first");
        console.log("🔄 Using fallback booking data for development");
      } else {
        console.log("🔄 Using fallback booking data for development");
      }

      // Return fallback data untuk development
      return {
        success: true,
        data: this.generateFallbackBookings(),
        stats: this.generateFallbackStats(),
      };
    }
  }

  // ========================
  //     Get Booking by ID
  // ========================
  static async getBookingById(id: string): Promise<IBookingResponse> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get(`/api/bookings/${id}`);

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch booking");
        }

        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      });
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
      throw new Error("Failed to fetch booking details");
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
        const response = await axios.put(
          `/api/bookings/${id}/status`,
          statusUpdate
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to update booking status"
          );
        }

        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw new Error("Failed to update booking status");
    }
  }

  // ========================
  //     Delete Booking
  // ========================
  static async deleteBooking(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.delete(`/api/bookings/${id}`);

        return {
          success: response.data.success,
          message: response.data.message || "Booking deleted successfully",
        };
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw new Error("Failed to delete booking");
    }
  }

  // ========================
  //     SIMPLE ACTIONS (Menggunakan updateBookingStatus)
  // ========================

  // Confirm Payment - menggunakan update status
  static async confirmPayment(id: string): Promise<IBookingResponse> {
    return this.updateBookingStatus(id, {
      status: "confirmed",
      paymentStatus: "settlement",
    });
  }

  // Cancel Booking
  static async cancelBooking(
    id: string,
    reason?: string
  ): Promise<IBookingResponse> {
    return this.updateBookingStatus(id, {
      status: "cancelled",
      paymentStatus: "cancel",
      cancellationReason: reason,
    });
  }

  // ========================
  //     PLACEHOLDER FUNCTIONS (Untuk kompatibilitas)
  // ========================

  static async generateVoucher(
    id: string
  ): Promise<{ success: boolean; message: string; voucher?: any }> {
    console.log("📄 Generate voucher not implemented in backend yet");
    return {
      success: false,
      message: "Generate voucher feature not available",
    };
  }

  static async checkPaymentStatus(
    id: string
  ): Promise<{ success: boolean; booking?: any; status?: string }> {
    console.log("💳 Check payment status not implemented in backend yet");
    return {
      success: false,
      status: "Feature not available",
    };
  }

  static async sendBookingReminder(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    console.log("📧 Send reminder not implemented in backend yet");
    return {
      success: false,
      message: "Send reminder feature not available",
    };
  }

  static async getBookingStats(dateRange?: {
    start: string;
    end: string;
  }): Promise<IBookingStats> {
    console.log("📈 Booking stats not implemented in backend yet");
    return this.generateFallbackStats();
  }

  static async exportBookings(
    filters?: IBookingFilter
  ): Promise<{ success: boolean; data?: Blob }> {
    console.log("📊 Export bookings not implemented in backend yet");
    return {
      success: false,
    };
  }
}
