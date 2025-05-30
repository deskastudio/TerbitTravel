// services/booking.service.ts

// Updated interfaces untuk konsistensi dengan backend
export interface BookingFormData {
  packageId: string; // Ubah dari paketId
  jumlahPeserta: number;
  customerInfo: {
    nama: string;
    email: string;
    telepon: string;
    alamat?: string;
    instansi?: string;
    catatan?: string;
  };
  selectedSchedule?: {
    tanggalAwal: string;
    tanggalAkhir: string;
  };
  userId?: string; // Optional untuk guest booking
  metodePembayaran?: "full" | "dp"; // Optional, handled di frontend saja
}

export interface BookingResponse {
  success: boolean;
  data?: {
    bookingId: string; // customId dari backend
    _id: string; // MongoDB ObjectId
    userId?: string;
    packageInfo: {
      id: string;
      nama: string;
      harga: number;
      destination?: string;
      armada?: {
        nama: string;
        kapasitas: number;
        merek: string;
      };
    };
    selectedSchedule: {
      tanggalAwal: string;
      tanggalAkhir: string;
    };
    customerInfo: {
      nama: string;
      email: string;
      telepon: string;
      alamat?: string;
      instansi?: string;
      catatan?: string;
    };
    jumlahPeserta: number;
    harga: number;
    status:
      | "pending"
      | "pending_verification"
      | "confirmed"
      | "completed"
      | "cancelled";
    paymentStatus:
      | "pending"
      | "settlement"
      | "capture"
      | "deny"
      | "cancel"
      | "expire";
    createdAt: string;
    createdBy?: string;
  };
  message?: string;
  error?: string;
}

export interface PaymentRequestData {
  bookingId: string;
  customerInfo: {
    nama: string;
    email: string;
    telepon: string;
    alamat?: string;
  };
  packageInfo: {
    id: string;
    nama: string;
    harga: number;
  };
  jumlahPeserta: number;
  totalAmount: number;
}

export interface PaymentResponse {
  success: boolean;
  snap_token?: string;
  redirect_url?: string;
  order_id?: string;
  message?: string;
  error?: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  data?: {
    bookingId: string;
    customId: string;
    status: string;
    paymentStatus: string;
    paymentMethod?: string;
    paymentDate?: string;
    canAccessVoucher: boolean;
  };
  message?: string;
}

export class BookingService {
  private static readonly API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || // ✅ Use VITE_BACKEND_URL
    (process.env.NODE_ENV === "development"
      ? "http://localhost:5000" // ✅ Consistent dengan backend
      : "https://your-production-api.com");

  // Retry mechanism
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

  /**
   * Buat booking baru (Updated untuk backend baru)
   */
  static async createBooking(data: BookingFormData): Promise<BookingResponse> {
    try {
      console.log("🔄 Creating booking with data:", data);

      return await this.callWithRetry(async () => {
        try {
          // Call backend endpoint yang baru
          const response = await fetch(
            `${this.API_BASE_URL}/api/payments/create`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (result.success && result.data) {
            // Simpan ke localStorage untuk fallback
            localStorage.setItem("lastBooking", JSON.stringify(result.data));
            console.log(
              "✅ Booking created successfully:",
              result.data.bookingId
            );
            return result;
          } else {
            throw new Error(result.message || "Failed to create booking");
          }
        } catch (apiError: any) {
          console.error("❌ API call failed:", apiError);

          // Fallback untuk development
          if (process.env.NODE_ENV === "development") {
            const dummyBooking = {
              success: true,
              data: {
                bookingId: `BOOK-${Date.now().toString().slice(-8)}`,
                _id: `dummy-${Date.now()}`,
                userId: data.userId,
                packageInfo: {
                  id: data.packageId,
                  nama: "Tour Package",
                  harga: 1000000,
                  destination: "Unknown Destination",
                },
                selectedSchedule: data.selectedSchedule || {
                  tanggalAwal: new Date().toISOString(),
                  tanggalAkhir: new Date(
                    Date.now() + 3 * 24 * 60 * 60 * 1000
                  ).toISOString(),
                },
                customerInfo: data.customerInfo,
                jumlahPeserta: data.jumlahPeserta,
                harga: 1000000 * data.jumlahPeserta,
                status: "pending" as const,
                paymentStatus: "pending" as const,
                createdAt: new Date().toISOString(),
                createdBy: "user",
              },
            };

            localStorage.setItem(
              "lastBooking",
              JSON.stringify(dummyBooking.data)
            );
            return dummyBooking;
          }

          throw apiError;
        }
      });
    } catch (error) {
      console.error("💥 Error creating booking:", error);
      throw error;
    }
  }

  /**
   * Get booking by ID (Support customId dan MongoDB ObjectId)
   */
  static async getBookingById(id: string): Promise<BookingResponse> {
    try {
      return await this.callWithRetry(async () => {
        try {
          // Coba endpoint baru yang support customId
          const response = await fetch(`${this.API_BASE_URL}/orders/${id}`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (result.success && result.data) {
            return result;
          } else {
            throw new Error(result.message || "Booking not found");
          }
        } catch (apiError) {
          console.error(`❌ API call failed for booking ID ${id}:`, apiError);

          // Fallback ke localStorage
          const lastBooking = localStorage.getItem("lastBooking");
          if (lastBooking) {
            const parsedBooking = JSON.parse(lastBooking);
            if (parsedBooking.bookingId === id || parsedBooking._id === id) {
              return {
                success: true,
                data: parsedBooking,
              };
            }
          }

          throw new Error(`Booking with ID ${id} not found`);
        }
      });
    } catch (error) {
      console.error(`💥 Error fetching booking ${id}:`, error);
      throw error;
    }
  }

  /**
   * Process payment dengan Midtrans (Updated endpoint)
   */
  static async processPayment(
    data: PaymentRequestData
  ): Promise<PaymentResponse> {
    try {
      console.log("💳 Processing payment:", data);

      return await this.callWithRetry(async () => {
        try {
          const response = await fetch(
            `${this.API_BASE_URL}/api/payments/create`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log("✅ Payment response:", result);

          if (result.success) {
            // Update localStorage dengan payment token
            this.updateLocalStorage(data.bookingId, {
              paymentToken: result.snap_token,
              paymentOrderId: result.order_id,
              paymentStatus: "pending",
            });
          }

          return result;
        } catch (apiError: any) {
          console.error("❌ Payment API call failed:", apiError);

          // Development fallback
          if (process.env.NODE_ENV === "development") {
            console.log("🧪 Using development payment fallback");
            const dummyResponse: PaymentResponse = {
              success: true,
              snap_token: `SNAP-${Date.now()}-DEV`,
              redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${Date.now()}`,
              order_id: `TRX-${data.bookingId}-${Date.now()}`,
            };

            this.updateLocalStorage(data.bookingId, {
              paymentToken: dummyResponse.snap_token,
              paymentOrderId: dummyResponse.order_id,
              paymentStatus: "pending",
            });

            return dummyResponse;
          }

          throw apiError;
        }
      });
    } catch (error) {
      console.error("💥 Error processing payment:", error);
      throw error;
    }
  }

  /**
   * Get payment status (Updated endpoint)
   */
  static async getPaymentStatus(
    bookingId: string
  ): Promise<PaymentStatusResponse> {
    try {
      return await this.callWithRetry(async () => {
        try {
          const response = await fetch(
            `${this.API_BASE_URL}/api/payments/status/${bookingId}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (result.success && result.data) {
            // Update localStorage dengan status terbaru
            this.updateLocalStorage(bookingId, {
              status: result.data.status,
              paymentStatus: result.data.paymentStatus,
              paymentMethod: result.data.paymentMethod,
              paymentDate: result.data.paymentDate,
            });
          }

          return result;
        } catch (apiError) {
          console.error(
            `❌ Payment status API call failed for ${bookingId}:`,
            apiError
          );

          // Fallback ke localStorage
          const lastBooking = localStorage.getItem("lastBooking");
          if (lastBooking) {
            const parsedBooking = JSON.parse(lastBooking);
            if (parsedBooking.bookingId === bookingId) {
              return {
                success: true,
                data: {
                  bookingId: parsedBooking._id,
                  customId: parsedBooking.bookingId,
                  status: parsedBooking.status || "pending",
                  paymentStatus: parsedBooking.paymentStatus || "pending",
                  paymentMethod: parsedBooking.paymentMethod,
                  paymentDate: parsedBooking.paymentDate,
                  canAccessVoucher: parsedBooking.status === "confirmed",
                },
              };
            }
          }

          throw new Error(`Payment status for booking ${bookingId} not found`);
        }
      });
    } catch (error) {
      console.error(`💥 Error getting payment status for ${bookingId}:`, error);
      throw error;
    }
  }

  /**
   * Simulate payment success (Development only)
   */
  static async simulatePaymentSuccess(
    bookingId: string
  ): Promise<{ success: boolean; message: string }> {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Simulation only available in development mode");
    }

    try {
      const response = await fetch(
        `${this.API_BASE_URL}/api/payments/simulate-success/${bookingId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update localStorage
        this.updateLocalStorage(bookingId, {
          status: "confirmed",
          paymentStatus: "settlement",
          paymentDate: new Date().toISOString(),
        });
      }

      return result;
    } catch (error) {
      console.error(`💥 Error simulating payment for ${bookingId}:`, error);

      // Fallback untuk development
      this.updateLocalStorage(bookingId, {
        status: "confirmed",
        paymentStatus: "settlement",
        paymentDate: new Date().toISOString(),
      });

      return {
        success: true,
        message: "Payment simulation completed successfully (fallback)",
      };
    }
  }

  /**
   * Get user bookings
   */
  static async getUserBookings(userId?: string): Promise<BookingResponse[]> {
    try {
      return await this.callWithRetry(async () => {
        try {
          const endpoint = userId
            ? `${this.API_BASE_URL}/orders/user/${userId}`
            : `${this.API_BASE_URL}/orders`;

          const response = await fetch(endpoint);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (result.success && result.data) {
            return result.data;
          } else {
            return [];
          }
        } catch (apiError) {
          console.error("❌ Get user bookings API call failed:", apiError);

          // Fallback ke localStorage
          const lastBooking = localStorage.getItem("lastBooking");
          if (lastBooking) {
            return [JSON.parse(lastBooking)];
          }

          return [];
        }
      });
    } catch (error) {
      console.error("💥 Error fetching user bookings:", error);
      return [];
    }
  }

  /**
   * Get booking voucher/e-voucher
   */
  static async getBookingVoucher(bookingId: string): Promise<{
    voucherUrl: string;
    voucherCode: string;
  }> {
    try {
      // Untuk sementara return dummy data karena backend belum implement voucher endpoint
      return {
        voucherUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`,
        voucherCode: bookingId,
      };
    } catch (error) {
      console.error(`💥 Error getting voucher for ${bookingId}:`, error);
      throw error;
    }
  }

  /**
   * Helper function to update localStorage
   */
  private static updateLocalStorage(
    bookingId: string,
    updates: Record<string, any>
  ): any {
    const lastBooking = localStorage.getItem("lastBooking");
    if (lastBooking) {
      const parsedBooking = JSON.parse(lastBooking);
      if (
        parsedBooking.bookingId === bookingId ||
        parsedBooking._id === bookingId
      ) {
        const updatedBooking = { ...parsedBooking, ...updates };
        localStorage.setItem("lastBooking", JSON.stringify(updatedBooking));
        return updatedBooking;
      }
    }
    return null;
  }

  /**
   * Check payment status manual (untuk trigger webhook check)
   */
  static async checkPaymentStatus(bookingId: string): Promise<{
    success: boolean;
    status: string;
    message: string;
    booking?: any;
  }> {
    try {
      console.log(`🔄 Manual payment status check for: ${bookingId}`);

      return await this.callWithRetry(async () => {
        try {
          const response = await fetch(
            `${this.API_BASE_URL}/api/booking/check-payment/${bookingId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log(`✅ Payment status check result:`, result);

          // Update localStorage jika status berubah
          if (result.success && result.booking) {
            this.updateLocalStorage(bookingId, {
              status: result.booking.status,
              paymentStatus: result.booking.paymentStatus,
              paymentDate: result.booking.paymentDate,
              lastWebhookUpdate: result.booking.lastWebhookUpdate,
            });
          }

          return result;
        } catch (apiError) {
          console.error(
            `❌ Payment status check API failed for ${bookingId}:`,
            apiError
          );

          // Fallback check localStorage
          const lastBooking = localStorage.getItem("lastBooking");
          if (lastBooking) {
            const parsedBooking = JSON.parse(lastBooking);
            if (
              parsedBooking.bookingId === bookingId ||
              parsedBooking._id === bookingId
            ) {
              return {
                success: true,
                status: parsedBooking.status || "pending",
                message: "Status from localStorage",
                booking: parsedBooking,
              };
            }
          }

          throw new Error(`Failed to check payment status for ${bookingId}`);
        }
      });
    } catch (error) {
      console.error(
        `💥 Error checking payment status for ${bookingId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get booking dengan auto status refresh
   */
  static async getBookingWithStatusRefresh(
    id: string
  ): Promise<BookingResponse> {
    try {
      console.log(`📋 Fetching booking with status refresh: ${id}`);

      // First get current booking
      const bookingResponse = await this.getBookingById(id);

      if (!bookingResponse.success || !bookingResponse.data) {
        throw new Error("Booking not found");
      }

      const booking = bookingResponse.data;

      // If payment is pending, try to refresh status
      if (
        booking.paymentStatus === "pending" ||
        booking.status === "pending_verification"
      ) {
        console.log("⏳ Payment pending, checking latest status...");

        try {
          const statusCheck = await this.checkPaymentStatus(
            booking.bookingId || booking._id || id
          );
          if (statusCheck.success && statusCheck.booking) {
            // Return updated booking
            return {
              success: true,
              data: statusCheck.booking,
            };
          }
        } catch (statusError) {
          console.warn(
            "⚠️ Status refresh failed, using current booking data:",
            statusError
          );
        }
      }

      return bookingResponse;
    } catch (error) {
      console.error(
        `💥 Error fetching booking with status refresh ${id}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Generate voucher
   */
  static async generateVoucher(bookingId: string): Promise<{
    success: boolean;
    voucher?: any;
    message: string;
  }> {
    try {
      console.log(`🎫 Generating voucher for: ${bookingId}`);

      // First check if payment is confirmed
      const statusCheck = await this.checkPaymentStatus(bookingId);

      if (statusCheck.status !== "confirmed") {
        throw new Error(
          `E-voucher tidak tersedia. Status pembayaran: ${statusCheck.status}`
        );
      }

      return await this.callWithRetry(async () => {
        try {
          const response = await fetch(
            `${this.API_BASE_URL}/api/voucher/generate/${bookingId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log(`✅ Voucher generated:`, result);

          return result;
        } catch (apiError) {
          console.error(
            `❌ Voucher generation API failed for ${bookingId}:`,
            apiError
          );

          // Fallback voucher untuk development
          if (process.env.NODE_ENV === "development") {
            const fallbackVoucher = {
              success: true,
              voucher: {
                bookingId: bookingId,
                qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`,
                voucherCode: bookingId,
                validUntil: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toISOString(),
                customerName:
                  statusCheck.booking?.customerInfo?.nama || "Customer",
                packageName:
                  statusCheck.booking?.packageInfo?.nama || "Tour Package",
                participantCount: statusCheck.booking?.jumlahPeserta || 1,
                totalAmount: statusCheck.booking?.harga || 0,
              },
              message: "Voucher generated successfully (development mode)",
            };

            return fallbackVoucher;
          }

          throw new Error("Failed to generate voucher");
        }
      });
    } catch (error) {
      console.error(`💥 Error generating voucher for ${bookingId}:`, error);
      throw error;
    }
  }

  /**
   * Check if voucher is available
   */
  static async isVoucherAvailable(bookingId: string): Promise<boolean> {
    try {
      const statusCheck = await this.checkPaymentStatus(bookingId);
      return (
        statusCheck.status === "confirmed" &&
        statusCheck.booking?.paymentStatus === "settlement"
      );
    } catch (error) {
      console.error(
        `Error checking voucher availability for ${bookingId}:`,
        error
      );
      return false;
    }
  }
}
