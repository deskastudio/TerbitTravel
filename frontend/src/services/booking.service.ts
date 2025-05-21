// booking.service.ts
import axios from "@/lib/axios";

export interface BookingFormData {
  nama: string;
  email: string;
  telepon: string;
  instansi?: string;
  alamat: string;
  catatan?: string;
  metodePembayaran: "full" | "dp";
  setuju: boolean;
  jumlahPeserta: number;
  jadwalId: string;
  paketId: string;
  totalHarga: number;
}

export interface BookingResponse {
  bookingId: string;
  status: "pending" | "pending_verification" | "confirmed" | "completed" | "cancelled";
  totalAmount: number;
  createdAt: string;
  paymentDeadline: string;
  customerInfo: {
    nama: string;
    email: string;
    telepon: string;
    alamat: string;
    instansi?: string;
    catatan?: string;
  };
  packageInfo: {
    id: string;
    nama: string;
    harga: number;
    destination: string;
  };
  schedule: {
    tanggalAwal: string;
    tanggalAkhir: string;
  };
  jumlahPeserta: number;
  metodePembayaran: "full" | "dp";
  paymentMethod?: string;
  bankName?: string;
  bankAccountNumber?: string;
  paymentDate?: string;
  paymentStatus?: string;
  paymentToken?: string;
  paymentOrderId?: string;
  pickupLocation?: string;
  pickupTime?: string;
  tourGuide?: {
    name: string;
    phone: string;
    photo: string;
  };
}

export interface PaymentRequestData {
  bookingId: string;
  customerInfo: {
    nama: string;
    email: string;
    telepon: string;
    alamat: string;
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
  message?: string;
  redirect_url?: string;
  snap_token?: string;
}

export class BookingService {
  // Tambahkan retry mechanism untuk API calls
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
        // Only delay if we're going to retry
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
        }
      }
    }
    throw lastError;
  }

  /**
   * Buat booking baru
   */
  static async createBooking(data: BookingFormData): Promise<BookingResponse> {
    try {
      return await this.callWithRetry(async () => {
        // Generate a random bookingId for testing if needed
        const bookingId = `BK-${Date.now().toString().slice(-8)}`;

        try {
          // Coba endpoint API/Bookings
          const response = await axios.post("/api/Bookings", data);
          
          // Jika berhasil, simpan data booking ke localStorage untuk fallback
          if (response.data) {
            localStorage.setItem('lastBooking', JSON.stringify(response.data));
            return response.data;
          } else {
            throw new Error("API returned empty response");
          }
        } catch (apiError) {
          console.error("API call failed:", apiError);
          
          // Fallback: Buat dummy booking untuk development
          const dummyBooking: BookingResponse = {
            bookingId: bookingId,
            status: "pending",
            totalAmount: data.totalHarga,
            createdAt: new Date().toISOString(),
            paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 jam dari sekarang
            customerInfo: {
              nama: data.nama,
              email: data.email,
              telepon: data.telepon,
              alamat: data.alamat,
              instansi: data.instansi,
              catatan: data.catatan
            },
            packageInfo: {
              id: data.paketId,
              nama: "Loading...", // Will be updated later
              harga: parseInt(data.totalHarga.toString()) / data.jumlahPeserta,
              destination: "Loading..."
            },
            schedule: {
              tanggalAwal: data.jadwalId.split('-')[0],
              tanggalAkhir: data.jadwalId.split('-')[1]
            },
            jumlahPeserta: data.jumlahPeserta,
            metodePembayaran: data.metodePembayaran
          };
          
          localStorage.setItem('lastBooking', JSON.stringify(dummyBooking));
          return dummyBooking;
        }
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }

  /**
   * Mendapatkan detail booking berdasarkan ID
   */
  static async getBookingById(id: string): Promise<BookingResponse> {
    try {
      return await this.callWithRetry(async () => {
        try {
          // Coba endpoint API untuk mendapatkan detail booking
          const response = await axios.get(`/api/Bookings/${id}`);
          return response.data;
        } catch (apiError) {
          console.error(`API call failed for booking ID ${id}:`, apiError);
          
          // Fallback: Coba ambil data dari localStorage
          const lastBooking = localStorage.getItem('lastBooking');
          if (lastBooking) {
            const parsedBooking = JSON.parse(lastBooking);
            if (parsedBooking.bookingId === id) {
              return parsedBooking;
            }
          }
          
          // Jika tidak ada di localStorage, lempar error
          throw new Error(`Booking with ID ${id} not found`);
        }
      });
    } catch (error) {
      console.error(`Error fetching booking with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Mendapatkan semua booking untuk user yang login
   */
  static async getUserBookings(): Promise<BookingResponse[]> {
    try {
      return await this.callWithRetry(async () => {
        try {
          // Coba endpoint API untuk mendapatkan daftar booking user
          const response = await axios.get("/api/Bookings/user");
          return response.data;
        } catch (apiError) {
          console.error("API call failed for user bookings:", apiError);
          
          // Fallback: Coba ambil data dari localStorage
          const lastBooking = localStorage.getItem('lastBooking');
          if (lastBooking) {
            return [JSON.parse(lastBooking)];
          }
          
          // Jika tidak ada di localStorage, return empty array
          return [];
        }
      });
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      throw error;
    }
  }

  /**
   * Update status booking
   */
  static async updateBookingStatus(
    id: string,
    status: "pending" | "pending_verification" | "confirmed" | "completed" | "cancelled"
  ): Promise<BookingResponse> {
    try {
      return await this.callWithRetry(async () => {
        try {
          // Coba endpoint API untuk update status booking
          const response = await axios.patch(`/api/Bookings/${id}/status`, { status });
          
          // Update data di localStorage jika berhasil
          this.updateLocalStorage(id, { status });
          
          return response.data;
        } catch (apiError) {
          console.error(`API call failed for updating booking ${id} status:`, apiError);
          
          // Fallback: Update data di localStorage saja
          const updatedBooking = this.updateLocalStorage(id, { status });
          if (updatedBooking) {
            return updatedBooking;
          }
          
          // Jika tidak ada di localStorage, lempar error
          throw new Error(`Booking with ID ${id} not found`);
        }
      });
    } catch (error) {
      console.error(`Error updating booking status for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Simpan bukti pembayaran
   */
  static async uploadPaymentProof(
    id: string,
    file: File
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.callWithRetry(async () => {
        const formData = new FormData();
        formData.append("paymentProof", file);

        try {
          // Coba endpoint API untuk upload bukti pembayaran
          const response = await axios.post(`/api/Bookings/${id}/payment-proof`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          
          // Update status booking di localStorage
          this.updateLocalStorage(id, { status: "pending_verification" });
          
          return response.data;
        } catch (apiError) {
          console.error(`API call failed for uploading payment proof for booking ${id}:`, apiError);
          
          // Fallback: Update status di localStorage saja
          this.updateLocalStorage(id, { status: "pending_verification" });
          
          // Return success untuk keperluan demo
          return { success: true, message: "Bukti pembayaran berhasil diunggah (mode demo)" };
        }
      });
    } catch (error) {
      console.error(`Error uploading payment proof for booking ${id}:`, error);
      throw error;
    }
  }

  /**
   * Batalkan booking
   */
  static async cancelBooking(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await this.callWithRetry(async () => {
        try {
          // Coba endpoint API untuk batalkan booking
          const response = await axios.post(`/api/Bookings/${id}/cancel`);
          
          // Update status booking di localStorage
          this.updateLocalStorage(id, { status: "cancelled" });
          
          return response.data;
        } catch (apiError) {
          console.error(`API call failed for cancelling booking ${id}:`, apiError);
          
          // Fallback: Update status di localStorage saja
          this.updateLocalStorage(id, { status: "cancelled" });
          
          // Return success untuk keperluan demo
          return { success: true, message: "Pemesanan berhasil dibatalkan (mode demo)" };
        }
      });
    } catch (error) {
      console.error(`Error cancelling booking ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get available bank accounts for payment
   */
  static async getBankAccounts(): Promise<Array<{
    bank: string;
    accountNumber: string;
    accountName: string;
  }>> {
    try {
      return await this.callWithRetry(async () => {
        try {
          // Coba endpoint API untuk mendapatkan rekening bank
          const response = await axios.get("/api/Payments/bank-accounts");
          return response.data;
        } catch (apiError) {
          console.error("API call failed for bank accounts:", apiError);
          
          // Return default data untuk keperluan demo
          return [
            { bank: "BCA", accountNumber: "1234567890", accountName: "PT Travedia Indonesia" },
            { bank: "Mandiri", accountNumber: "0987654321", accountName: "PT Travedia Indonesia" },
            { bank: "BNI", accountNumber: "1122334455", accountName: "PT Travedia Indonesia" },
          ];
        }
      });
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      throw error;
    }
  }
  

// Perbaikan pada booking.service.ts - processPayment
static async processPayment(data: PaymentRequestData): Promise<PaymentResponse> {
  try {
    return await this.callWithRetry(async () => {
      try {
        console.log("Mengirim permintaan pembayaran ke API:", JSON.stringify(data));
        
        // Pastikan total amount sesuai dengan jumlah peserta * harga per orang
        const calculatedAmount = data.jumlahPeserta * data.packageInfo.harga;
        
        // Jika ada perbedaan antara total yang dikirim dan kalkulasi, gunakan hasil kalkulasi
        if (data.totalAmount !== calculatedAmount) {
          console.warn(`Total amount tidak sesuai kalkulasi. Menggunakan nilai kalkulasi: ${calculatedAmount}`);
          data.totalAmount = calculatedAmount;
        }
        
        // Coba endpoint API untuk proses pembayaran
        const response = await axios.post('/api/Payments/create', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log("Respons dari API payment:", response.data);
        
        // Jika berhasil, update data di localStorage
        if (response.data.success && (response.data.redirect_url || response.data.snap_token)) {
          this.updateLocalStorage(data.bookingId, { 
            paymentToken: response.data.snap_token,
            paymentOrderId: response.data.order_id || `ORDER-${data.bookingId}`,
            paymentStatus: 'pending'
          });
        }
        
        return response.data;
      } catch (apiError: any) {
        console.error("API call failed for payment processing:", apiError);
        console.error("Error details:", apiError.response?.data || apiError.message);
        
        // Perbaikan fallback mode:
        // 1. Verifikasi bahwa kita berada di environment development
        // 2. Berikan feedback yang lebih jelas kepada user
        if (process.env.NODE_ENV === 'development') {
          console.log("Menggunakan fallback payment response untuk development");
          
          // Fallback: Return dummy data untuk keperluan demo dengan token yang lebih valid
          const dummyResponse: PaymentResponse = {
            success: true,
            snap_token: `SNAP-${Date.now()}-DEMO`,
            redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${Date.now()}-DEMO`
          };
          
          // Update data di localStorage untuk menjaga konsistensi
          this.updateLocalStorage(data.bookingId, { 
            paymentToken: dummyResponse.snap_token,
            paymentOrderId: `ORDER-${data.bookingId}-${Date.now()}`,
            paymentStatus: 'pending'
          });
          
          return dummyResponse;
        }
        
        // Tambahkan informasi lebih detail tentang error
        const errorMessage = apiError.response?.data?.message || apiError.message || 'Terjadi kesalahan saat memproses pembayaran';
        throw new Error(errorMessage);
      }
    }, 3, 1500); // 3 percobaan dengan delay 1.5 detik antar percobaan
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
}
  
  /**
   * Get payment status
   */
  static async getPaymentStatus(bookingId: string): Promise<{
    success: boolean;
    status?: string;
    paymentMethod?: string;
    paymentDate?: string;
    message?: string;
  }> {
    try {
      return await this.callWithRetry(async () => {
        try {
          // Coba endpoint API untuk mendapatkan status pembayaran
          const response = await axios.get(`/api/Payments/status/${bookingId}`);
          
          // Update data di localStorage jika berhasil
          if (response.data.success && response.data.status) {
            this.updateLocalStorage(bookingId, { 
              paymentStatus: response.data.status,
              paymentMethod: response.data.paymentMethod,
              paymentDate: response.data.paymentDate
            });
            
            // Jika status settlement atau capture, update status booking jadi confirmed
            if (response.data.status === 'settlement' || response.data.status === 'capture') {
              this.updateLocalStorage(bookingId, { status: 'confirmed' });
            }
          }
          
          return response.data;
        } catch (apiError) {
          console.error(`API call failed for payment status of booking ${bookingId}:`, apiError);
          
          // Fallback: Return dummy data untuk keperluan demo
          return {
            success: true,
            status: 'pending',
            message: 'Status pembayaran sedang diproses (mode demo)'
          };
        }
      });
    } catch (error) {
      console.error(`Error getting payment status for booking ${bookingId}:`, error);
      throw error;
    }
  }
  
  /**
   * Complete payment (simulate payment success for testing)
   */
  static async completePayment(bookingId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      return await this.callWithRetry(async () => {
        try {
          // Coba endpoint API untuk simulasi pembayaran berhasil
          const response = await axios.post(`/api/Payments/complete/${bookingId}`);
          
          // Update data di localStorage jika berhasil
          if (response.data.success) {
            this.updateLocalStorage(bookingId, { 
              status: 'confirmed',
              paymentStatus: 'settlement',
              paymentDate: new Date().toISOString()
            });
          }
          
          return response.data;
        } catch (apiError) {
          console.error(`API call failed for completing payment of booking ${bookingId}:`, apiError);
          
          // Fallback: Update data di localStorage saja
          this.updateLocalStorage(bookingId, { 
            status: 'confirmed',
            paymentStatus: 'settlement',
            paymentDate: new Date().toISOString()
          });
          
          // Return success untuk keperluan demo
          return {
            success: true,
            message: 'Pembayaran berhasil diselesaikan (mode demo)'
          };
        }
      });
    } catch (error) {
      console.error(`Error completing payment for booking ${bookingId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get booking voucher
   */
  static async getBookingVoucher(bookingId: string): Promise<{
    voucherUrl: string;
    voucherCode: string;
  }> {
    try {
      return await this.callWithRetry(async () => {
        try {
          // Coba endpoint API untuk mendapatkan voucher
          const response = await axios.get(`/api/Bookings/${bookingId}/voucher`);
          return response.data;
        } catch (apiError) {
          console.error(`API call failed for voucher of booking ${bookingId}:`, apiError);
          
          // Fallback: Return dummy data untuk keperluan demo
          return {
            voucherUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`,
            voucherCode: bookingId
          };
        }
      });
    } catch (error) {
      console.error(`Error getting voucher for booking ${bookingId}:`, error);
      throw error;
    }
  }
  
  /**
   * Helper function to update localStorage data
   */
  private static updateLocalStorage(bookingId: string, updates: Record<string, any>): BookingResponse | null {
    const lastBooking = localStorage.getItem('lastBooking');
    if (lastBooking) {
      const parsedBooking = JSON.parse(lastBooking);
      if (parsedBooking.bookingId === bookingId) {
        const updatedBooking = { ...parsedBooking, ...updates };
        localStorage.setItem('lastBooking', JSON.stringify(updatedBooking));
        return updatedBooking;
      }
    }
    return null;
  }
}