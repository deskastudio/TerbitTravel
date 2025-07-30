// types/booking.types.ts

export interface IBookingInput {
    packageId: string;
    jumlahPeserta: number;
    customerInfo: {
      nama: string;
      email: string;
      telepon: string;
      alamat?: string;
      instansi?: string;
      catatan?: string;
    };
    selectedSchedule: {
      tanggalAwal: string;
      tanggalAkhir: string;
    };
    userId?: string;
    metodePembayaran?: "full" | "dp";
  }
  
  export interface IBooking {
    _id: string;
    bookingId: string; // Custom ID seperti BOOK-12345678
    userId?: string;
    packageInfo: {
      id: string;
      nama: string;
      harga: number;
      destination?: string;
      durasi?: string;
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
    totalHarga: number;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: PaymentMethod;
    paymentDate?: string;
    paymentToken?: string;
    paymentOrderId?: string;
    voucherGenerated?: boolean;
    voucherCode?: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    lastWebhookUpdate?: string;
  }
  
  export type BookingStatus = 
    | "pending" 
    | "pending_verification" 
    | "confirmed" 
    | "completed" 
    | "cancelled";
  
  export type PaymentStatus = 
    | "pending" 
    | "settlement" 
    | "capture" 
    | "deny" 
    | "cancel" 
    | "expire" 
    | "failure";
  
  export type PaymentMethod = 
    | "credit_card" 
    | "bank_transfer" 
    | "echannel" 
    | "gopay" 
    | "ovo" 
    | "dana" 
    | "shopeepay" 
    | "qris"
    | "bca_va"
    | "bni_va"
    | "bri_va"
    | "mandiri_va"
    | "permata_va"
    | "other_va";
  
  export interface IBookingFilter {
    status?: BookingStatus | "all";
    paymentStatus?: PaymentStatus | "all";
    paymentMethod?: PaymentMethod | "all";
    dateRange?: {
      start: string;
      end: string;
    };
    packageId?: string | "all";
    customerName?: string;
    bookingId?: string;
  }
  
  export interface IBookingStats {
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
  }
  
  export interface IBookingResponse {
    success: boolean;
    data?: IBooking;
    message?: string;
    error?: string;
  }
  
  export interface IBookingListResponse {
    success: boolean;
    data?: IBooking[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
    stats?: IBookingStats;
    message?: string;
    error?: string;
  }
  
  // Interface untuk update booking status
  export interface IBookingStatusUpdate {
    status: BookingStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    paymentDate?: string;
    notes?: string;
  }
  
  // Interface untuk voucher generation
  export interface IVoucherData {
    bookingId: string;
    voucherCode: string;
    qrCode: string;
    validUntil: string;
    customerName: string;
    packageName: string;
    participantCount: number;
    totalAmount: number;
    voucherUrl?: string;
  }