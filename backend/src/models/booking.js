// models/booking.js - FIXED VERSION
import mongoose from "mongoose";

// ✅ Explicit customerInfo schema dengan semua field
const customerInfoSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    email: { type: String, required: true },
    telepon: { type: String, required: true },
    alamat: { type: String, default: "" },
    instansi: { type: String, default: "" }, // ✅ Explicitly defined
    catatan: { type: String, default: "" }, // ✅ Explicitly defined
  },
  {
    _id: false, // Tidak perlu _id untuk subdocument
    strict: false, // ✅ Allow additional fields if needed
  }
);

const bookingSchema = new mongoose.Schema(
  {
    // Custom ID untuk mengakomodasi format ID booking non-MongoDB
    customId: {
      type: String,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional untuk guest booking
    },

    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true, // Package wajib ada
    },

    // Schedule yang dipilih dari package.jadwal
    selectedSchedule: {
      tanggalAwal: { type: Date, required: true },
      tanggalAkhir: { type: Date, required: true },
    },

    jumlahPeserta: {
      type: Number,
      required: true,
      min: 1,
    },

    harga: {
      type: Number,
      required: true,
    },

    // ✅ Add totalAmount field
    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "pending_verification",
        "confirmed",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    // ✅ Use explicit customerInfo schema
    customerInfo: customerInfoSchema,

    // ✅ Add packageInfo for caching
    packageInfo: {
      id: String,
      nama: String,
      harga: Number,
      destination: String,
    },

    // ✅ Add schedule for compatibility
    schedule: {
      tanggalAwal: Date,
      tanggalAkhir: Date,
    },

    // Midtrans fields
    paymentToken: String,
    paymentOrderId: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "settlement", "capture", "deny", "cancel", "expire"],
      default: "pending",
    },
    paymentMethod: String,
    paymentDate: Date,
    paymentRedirectUrl: String,
    midtransTransactionId: String,
    midtransResponse: mongoose.Schema.Types.Mixed,

    // ✅ Additional payment fields
    webhookUrl: String,
    webhookReceived: { type: Boolean, default: false },
    transactionStatus: String,
    fraudStatus: String,
    paymentType: String,
    transactionTime: String,
    settlementTime: String,
    lastWebhookUpdate: Date,

    // ✅ Additional booking fields
    bookingDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    strict: false, // ✅ Allow additional fields at root level
  }
);

// Pre-save hook untuk generate customId
bookingSchema.pre("save", function (next) {
  if (!this.customId) {
    this.customId = `BOOK-${Date.now().toString().slice(-8)}`;
  }
  next();
});

// ✅ Pre-save hook untuk ensure customerInfo fields
bookingSchema.pre("save", function (next) {
  if (this.customerInfo) {
    // Ensure instansi and catatan are always present, even if empty
    if (this.customerInfo.instansi === undefined) {
      this.customerInfo.instansi = "";
    }
    if (this.customerInfo.catatan === undefined) {
      this.customerInfo.catatan = "";
    }
  }
  next();
});

// Index untuk optimasi query
bookingSchema.index({ customId: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ packageId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ createdAt: -1 });

const BookingModel = mongoose.model("Booking", bookingSchema);
export default BookingModel;
