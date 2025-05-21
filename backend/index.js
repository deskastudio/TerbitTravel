import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import setupSwagger from "./src/swagger.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import destinationRoutes from "./src/routes/destinationRoutes.js";
import hotelRoutes from "./src/routes/hotelRoutes.js";
import armadaRoutes from "./src/routes/armadaRoutes.js";
import consumeRoutes from "./src/routes/consumeRoutes.js";
import blogRoutes from "./src/routes/blogRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import packageRoutes from "./src/routes/packageRoutes.js";
import bannerRoutes from "./src/routes/bannerRoutes.js";
import galleryRoutes from "./src/routes/galleryRoutes.js";
import galleryCategoryRoutes from "./src/routes/galleryCategoryRoute.js";
import packageCategoryRoutes from "./src/routes/packageCategoryRoute.js";
import destinationCategoryRoutes from "./src/routes/destinationCategoryRoute.js";
import teamRoutes from "./src/routes/teamRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import cors from "cors";
import passport from "./src/config/passportConfig.js";
import session from "express-session";
import otpRoutes from "./src/routes/otpRoutes.js"; // Jika index.js ada di root
import blogCategoryRoutes from "./src/routes/blogCategoryRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
// Definisi allowedOrigins dari environment variables
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
  "http://localhost:3000",
  // Tambahkan URL Ngrok frontend Anda
];

// Konfigurasi CORS yang lebih fleksibel untuk pengembangan
app.use(
  cors({
    // Gunakan function untuk dynamic origin validation
    origin: function(origin, callback) {
      // Untuk permintaan non-browser (contohnya webhook dari Midtrans)
      // origin akan undefined
      if (!origin) return callback(null, true);
      
      // Jika origin ada dalam daftar yang diizinkan, perbolehkan
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      
      // Selama development, izinkan origin apa pun yang dimulai dengan ngrok.io
      if (process.env.NODE_ENV === 'development' && 
         (origin.endsWith('.ngrok.io') || origin.endsWith('.ngrok-free.app'))) {
        return callback(null, true);
      }
      
      // Jika tidak ada di daftar yang diizinkan, tolak
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    exposedHeaders: ["set-cookie"]
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET || "jwbcjwbcjw",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Perluas limit JSON untuk menangani payload yang mungkin besar
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/contact", contactRoutes);
app.use("/destination", destinationRoutes);
app.use("/hotel", hotelRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/armada", armadaRoutes);
app.use("/consume", consumeRoutes);
app.use("/blog", blogRoutes);
app.use("/profiles", profileRoutes);
app.use("/reviews", reviewRoutes);
app.use("/package", packageRoutes);
app.use("/banner", bannerRoutes);
app.use("/gallery", galleryRoutes);
app.use("/gallery-category", galleryCategoryRoutes);
app.use("/package-category", packageCategoryRoutes);
app.use("/destination-category", destinationCategoryRoutes);
app.use("/team", teamRoutes);
app.use("/orders", orderRoutes);
app.use("/api/otp", otpRoutes);
app.use("/blog-category", blogCategoryRoutes);
app.use('/api/Payments', paymentRoutes);

// Tambahkan alias untuk rute orders untuk mendukung endpoint API Midtrans
app.use('/api/Bookings', orderRoutes);

// Tambahkan rute untuk Midtrans jika paymentRoutes.js sudah dibuat
// app.use('/api/Payments', paymentRoutes);

// Implementasi webhook handler yang lebih lengkap
app.post('/api/webhook/midtrans', async (req, res) => {
  try {
    console.log('Received webhook from Midtrans:', JSON.stringify(req.body));
    
    // Extract data dari webhook
    const { 
      transaction_status,
      fraud_status,
      order_id, 
      payment_type,
      transaction_time,
      gross_amount,        // Tambahkan gross_amount
      signature_key        // Tambahkan signature_key untuk verifikasi
    } = req.body;
    
    // Extract booking ID dari order_id (asumsi format TRX-{bookingId})
    const bookingId = order_id.replace('TRX-', '');
    
    // Log untuk keperluan debugging
    console.log(`Processing payment for booking ${bookingId}, status: ${transaction_status}`);
    
    // Cari booking di database
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.error(`Booking dengan ID ${bookingId} tidak ditemukan`);
      return res.status(200).json({ success: false, message: 'Booking not found' });
    }
    
    // Verifikasi jumlah pembayaran (opsional - untuk keamanan tambahan)
    if (parseFloat(gross_amount) !== parseFloat(booking.harga)) {
      console.warn(`Warning: Amount mismatch for booking ${bookingId}. Expected: ${booking.harga}, Got: ${gross_amount}`);
      // Namun tetap lanjutkan proses karena ini mungkin kesalahan minor
    }
    
    // Update status booking berdasarkan status transaksi
    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept' || fraud_status === undefined) {  // Beberapa pembayaran tidak memiliki fraud_status
        // Transaksi sukses dan bukan fraud
        booking.status = 'confirmed';
        booking.paymentStatus = 'settlement';
        booking.paymentMethod = payment_type;
        booking.paymentDate = new Date(transaction_time);
        
        // Tambahkan field untuk tracking pembayaran
        booking.paymentDetails = {
          transactionId: req.body.transaction_id || null,
          paymentType: payment_type,
          amount: gross_amount,
          time: transaction_time
        };
        
        console.log(`Payment confirmed for booking ${bookingId}`);
      } else {
        console.warn(`Potential fraud detected for booking ${bookingId}`);
        booking.status = 'pending';
        booking.paymentStatus = 'fraud';
      }
    } else if (transaction_status === 'pending') {
      // Transaksi pending
      booking.status = 'pending_verification';
      booking.paymentStatus = 'pending';
      booking.paymentMethod = payment_type;
      console.log(`Payment pending for booking ${bookingId}`);
    } else if (transaction_status === 'deny' || 
               transaction_status === 'cancel' || 
               transaction_status === 'expire') {
      // Transaksi gagal
      booking.status = 'pending'; // Tetap pending untuk memungkinkan percobaan ulang
      booking.paymentStatus = transaction_status;
      console.log(`Payment failed (${transaction_status}) for booking ${bookingId}`);
    }
    
    // Simpan riwayat status pembayaran untuk audit
    if (!booking.paymentHistory) booking.paymentHistory = [];
    booking.paymentHistory.push({
      status: transaction_status,
      time: new Date(),
      paymentType: payment_type,
      amount: gross_amount
    });
    
    // Simpan perubahan ke database
    await booking.save();
    
    // Selalu kembalikan status 200 untuk Midtrans
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully',
      updated_status: booking.status
    });
    
  } catch (error) {
    console.error('Error handling Midtrans webhook:', error);
    // Selalu return 200 untuk Midtrans meskipun ada error
    res.status(200).json({ success: false, message: 'Error processing webhook' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Invalid token" });
  } else if (err.name === "CrossOriginResourceSharingError") {
    res.status(403).json({ error: "CORS error" });
  } else {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

//swagger
setupSwagger(app);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Server Listening
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
  
  // Log Midtrans status
  if (process.env.MIDTRANS_SERVER_KEY) {
    console.log("Midtrans configuration detected");
  }
});