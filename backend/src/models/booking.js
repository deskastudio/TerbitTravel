// models/booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // Primary ID akan otomatis dibuat oleh MongoDB
  
  // Custom ID untuk mengakomodasi format ID booking non-MongoDB
  customId: {
    type: String,
    index: true // Tambahkan indeks untuk pencarian cepat
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Ubah menjadi false untuk fleksibilitas
  },
  
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: false, // Ubah menjadi false untuk fleksibilitas
  },
  
  jumlahPeserta: {
    type: Number,
    required: true,
  },
  
  harga: {
    type: Number,
    required: true,
  },
  
  status: {
    type: String,
    enum: ['pending', 'pending_verification', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  
  // Data customer
  customerInfo: {
    nama: String,
    email: String,
    telepon: String,
    alamat: String,
    instansi: String,
    catatan: String,
  },
  
  // Midtrans fields
  paymentToken: String,        // Snap token dari Midtrans
  paymentOrderId: String,      // Order ID yang dikirim ke Midtrans
  paymentStatus: {            // Status pembayaran dari Midtrans
    type: String,
    enum: ['pending', 'settlement', 'capture', 'deny', 'cancel', 'expire', null],
    default: 'pending'
  },
  paymentMethod: String,      // Metode pembayaran yang digunakan
  paymentDate: Date,          // Waktu pembayaran berhasil
  midtransResponse: Object,   // Respons lengkap dari Midtrans
  paymentRedirectUrl: String, // URL redirect untuk halaman pembayaran
  
  // Tambahan
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Pre-save hook untuk memastikan customId selalu ada
bookingSchema.pre('save', function(next) {
  // Jika tidak ada customId, gunakan _id sebagai customId
  if (!this.customId) {
    this.customId = this._id.toString();
  }
  next();
});

export const BookingModel = mongoose.model('Booking', bookingSchema);

export default BookingModel;