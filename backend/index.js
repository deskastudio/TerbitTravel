import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes.js";
// import adminRoutes from "./src/routes/adminRoutes.js";
import setupSwagger from "./src/swagger.js";
import adminAuthRoutes from "./src/routes/adminAuthRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import destinationRoutes from "./src/routes/destinationRoutes.js";
import hotelRoutes from "./src/routes/hotelRoutes.js";
import armadaRoutes from "./src/routes/armadaRoutes.js";
import consumeRoutes from "./src/routes/consumeRoutes.js";
import blogRoutes from "./src/routes/blogRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import packageRoutes from "./src/routes/packageRoutes.js";
import testRoutes from "./src/routes/testRoutes.js";
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
import otpRoutes from "./src/routes/otpRoutes.js";
import blogCategoryRoutes from "./src/routes/blogCategoryRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import BookingModel from "./src/models/booking.js";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== BACKEND CORS CONFIGURATION - FINAL FIX =====
// Ganti bagian CORS di index.js dengan kode ini:

// ✅ PERBAIKAN: Parse allowed origins dari .env dengan proper cleaning
const allowedOrigins = (() => {
  const envOrigins = process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim()).filter(Boolean) : 
    [];
  
  // Default origins
  const defaultOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://terbit-travel.loca.lt",
    // Midtrans
    "https://app.sandbox.midtrans.com",
    "https://app.midtrans.com",
  ];
  
  // Combine dan remove duplicates
  const allOrigins = [...new Set([...defaultOrigins, ...envOrigins])];
  
  console.log("🌐 Allowed Origins:", allOrigins);
  return allOrigins;
})();

// ✅ PERBAIKAN: Localtunnel optimized CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.CORS_DEBUG === "true") {
      console.log(`🔍 CORS Check - Origin: "${origin}"`);
    }

    // ✅ ALWAYS allow no origin (critical for localtunnel)
    if (!origin) {
      if (process.env.CORS_DEBUG === "true") {
        console.log("✅ CORS allowed: No origin (localtunnel/server-to-server)");
      }
      return callback(null, true);
    }

    // ✅ ALWAYS allow in development
    if (process.env.NODE_ENV === "development") {
      if (process.env.CORS_DEBUG === "true") {
        console.log(`✅ Development mode: Allowing ${origin}`);
      }
      return callback(null, true);
    }

    // ✅ Check allowed origins
    if (allowedOrigins.includes(origin)) {
      if (process.env.CORS_DEBUG === "true") {
        console.log(`✅ CORS allowed: Listed origin - ${origin}`);
      }
      return callback(null, true);
    }

    // ✅ Allow localtunnel patterns
    if (origin.includes(".loca.lt") || origin.includes("localhost")) {
      if (process.env.CORS_DEBUG === "true") {
        console.log(`✅ CORS allowed: Tunnel/localhost pattern - ${origin}`);
      }
      return callback(null, true);
    }

    // Reject others in production
    console.log(`❌ CORS rejected: ${origin}`);
    console.log(`📝 Allowed: ${allowedOrigins.join(", ")}`);
    const corsError = new Error(`CORS Error: Origin ${origin} not allowed`);
    corsError.status = 403;
    callback(corsError);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With", 
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
    "bypass-tunnel-reminder",
    "User-Agent",
    "ngrok-skip-browser-warning",
  ],
  exposedHeaders: [
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Headers",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// ✅ PERBAIKAN: Explicit OPTIONS handler 
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  
  if (process.env.CORS_DEBUG === "true") {
    console.log(`✅ OPTIONS preflight for ${req.path} from ${origin}`);
  }
  
  // Set headers manually for OPTIONS
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", 
    "Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, bypass-tunnel-reminder, User-Agent");
  
  res.sendStatus(200);
});

// ✅ PERBAIKAN: Universal CORS middleware for ALL requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // ✅ Set CORS headers for ALL requests
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    // No origin - set wildcard (for server-to-server, Postman, etc)
    res.header("Access-Control-Allow-Origin", "*");
  }
  
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", 
    "Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, bypass-tunnel-reminder, User-Agent, ngrok-skip-browser-warning");
  
  // ✅ Debug logging for admin routes
  if (req.path.includes("admin") && process.env.CORS_DEBUG === "true") {
    console.log(`\n📨 ${req.method} ${req.path}`);
    console.log(`🌐 Origin: ${origin || "No origin"}`);
    console.log(`📋 Headers set: Origin=${origin || "*"}, Credentials=true`);
  }
  
  next();
});

// ✅ PERBAIKAN: Specific middleware untuk admin routes
app.use("/admin", (req, res, next) => {
  if (process.env.CORS_DEBUG === "true") {
    console.log(`\n🔑 Admin route accessed: ${req.method} ${req.path}`);
    console.log(`🌐 Origin: ${req.headers.origin || "No origin"}`);
    console.log(`📋 Content-Type: ${req.headers["content-type"]}`);
    console.log(`🔐 Authorization: ${req.headers.authorization ? "Present" : "None"}`);
  }
  
  next();
});

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ DEBUG: Request logging middleware
app.use((req, res, next) => {
  if (req.path.includes("admin") || req.path.includes("login")) {
    console.log(`\n📨 ${req.method} ${req.path}`);
    console.log(`🌐 Origin: ${req.headers.origin}`);
    console.log(
      `📋 Headers:`,
      JSON.stringify(
        {
          "content-type": req.headers["content-type"],
          authorization: req.headers["authorization"] ? "Bearer ***" : "None",
          origin: req.headers["origin"],
        },
        null,
        2
      )
    );
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`📤 Body:`, JSON.stringify(req.body, null, 2));
    }
  }
  next();
});

// ✅ TAMBAHAN: Middleware khusus untuk admin routes
app.use("/admin", (req, res, next) => {
  console.log(`\n🔑 Admin route accessed: ${req.method} ${req.path}`);
  console.log(`🌐 Origin: ${req.headers.origin}`);
  console.log(`📋 Content-Type: ${req.headers["content-type"]}`);

  // Set CORS headers khusus untuk admin routes
  if (req.headers.origin) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  next();
});

// 🔧 FIX: Middleware untuk menangani Midtrans-related requests
app.use((req, res, next) => {
  // Add specific headers for payment-related requests
  if (req.path.includes("/payment") || req.path.includes("/orders")) {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,OPTIONS,PATCH"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      console.log("🔧 Handling OPTIONS preflight for payment/orders");
      return res.sendStatus(200);
    }
  }
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Travel booking API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    ngrok_url: process.env.NGROK_URL || "Not set",
    cors_origins: allowedOrigins,
    endpoints: {
      admin_login: "/admin/login",
      admin_auth: "/admin",
      health: "/api/health",
    },
  });
});

// ✅ PERBAIKAN ROUTES - Setup routes
console.log("🔧 Setting up routes...");

// Routes
app.use("/user", userRoutes);
app.use("/admin", adminAuthRoutes); // ✅ PERBAIKAN: Route admin auth
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
app.use("/test", testRoutes);
app.use("/banner", bannerRoutes);
app.use("/gallery", galleryRoutes);
app.use("/gallery-category", galleryCategoryRoutes);
app.use("/package-category", packageCategoryRoutes);
app.use("/destination-category", destinationCategoryRoutes);
app.use("/team", teamRoutes);
// 🔥 COMMENT OUT ORDER ROUTES - Using custom booking handlers instead
// app.use("/orders", orderRoutes);
app.use("/api/otp", otpRoutes);
app.use("/blog-category", blogCategoryRoutes);

// PAYMENT ROUTES
app.use("/api/payments", paymentRoutes);
app.use("/api/Payments", paymentRoutes);

// BOOKING ROUTES - Using BookingModel (not Order)
app.use("/api/bookings", orderRoutes);
app.use("/api/Bookings", orderRoutes);

// 🔧 ADD: Additional booking endpoints for frontend compatibility
app.use("/api/orders", orderRoutes);
app.use("/orders", orderRoutes); // This should work with custom handlers below

// ✅ CUSTOM BOOKING ENDPOINTS - Using BookingModel for payment integration
// NOTE: These handlers use BookingModel (not Order model) because:
// 1. BookingModel has customId field (BOOK-xxxxxxx) needed by frontend
// 2. BookingModel supports payment integration (paymentStatus, transactionStatus)
// 3. BookingModel supports guest booking (customerInfo without userId)
// 4. Order model is for simple orders, Booking model is for complex travel bookings
app.get("/orders/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log(`📋 DEBUG: Fetching booking: ${bookingId}`);

    // ADD DEBUG: Show recent bookings in database
    const allBookings = await BookingModel.find({})
      .limit(10)
      .sort({ createdAt: -1 });
    console.log(
      `🔍 Recent bookings in DB:`,
      allBookings.map((b) => ({
        customId: b.customId,
        _id: b._id.toString(),
        status: b.status,
        createdAt: b.createdAt,
      }))
    );

    // Find booking by customId first
    let booking = await BookingModel.findOne({ customId: bookingId }).populate(
      "packageId"
    );
    console.log(
      `🔍 Found booking by customId "${bookingId}":`,
      booking ? "YES" : "NO"
    );

    if (!booking) {
      // Coba cari dengan MongoDB ObjectId
      if (bookingId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log(`🔍 Trying to find by ObjectId: ${bookingId}`);
        booking = await BookingModel.findById(bookingId).populate("packageId");
        console.log(
          `🔍 Found booking by ObjectId "${bookingId}":`,
          booking ? "YES" : "NO"
        );
      }
    }

    if (!booking) {
      console.error(`❌ Booking ${bookingId} not found in database`);
      return res.status(404).json({
        success: false,
        message: "Booking not found",
        debug: {
          searchedId: bookingId,
          availableBookings: allBookings.map((b) => b.customId),
        },
      });
    }

    console.log(`✅ Found booking:`, {
      customId: booking.customId,
      _id: booking._id,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });

    res.json({
      success: true,
      booking: {
        ...booking.toObject(),
        bookingId: booking.customId, // ✅ Add alias untuk frontend
        packageInfo: booking.packageId
          ? {
              id: booking.packageId._id,
              nama: booking.packageId.nama,
              destination:
                booking.packageId.destination?.nama || "Unknown Destination",
            }
          : null,
      },
    });
  } catch (error) {
    console.error("💥 Error fetching booking:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching booking",
      error: error.message,
    });
  }
});

app.get("/api/orders/:bookingId", async (req, res) => {
  // Redirect ke handler yang sama
  req.url = `/orders/${req.params.bookingId}`;
  return app._router.handle(req, res);
});

// DEBUG: Endpoint untuk semua booking tanpa auth (development only)
app.get("/api/debug/bookings", async (req, res) => {
  try {
    console.log("🔍 DEBUG: Fetching all bookings without auth");

    const bookings = await BookingModel.find()
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`📊 Found ${bookings.length} bookings`);

    res.json({
      success: true,
      data: bookings,
      total: bookings.length,
    });
  } catch (error) {
    console.error("❌ Error fetching debug bookings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
});

// DEBUG: Endpoint untuk search booking tertentu
app.get("/api/debug/booking/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log(`🔍 DEBUG: Searching for booking: ${bookingId}`);

    // Cari dengan berbagai cara
    const searchResults = {
      byCustomId: await BookingModel.findOne({ customId: bookingId }),
      byId: bookingId.match(/^[0-9a-fA-F]{24}$/)
        ? await BookingModel.findById(bookingId)
        : null,
      similar: await BookingModel.find({
        customId: {
          $regex: bookingId.replace(/[^A-Z0-9]/g, ""),
          $options: "i",
        },
      }).limit(5),
    };

    res.json({
      success: true,
      searchId: bookingId,
      results: searchResults,
      found: !!(searchResults.byCustomId || searchResults.byId),
    });
  } catch (error) {
    console.error("❌ Error in debug booking search:", error);
    res.status(500).json({
      success: false,
      message: "Error searching booking",
      error: error.message,
    });
  }
});

// 🔥 FIX: Test booking creation endpoint
app.post("/api/debug/create-test-booking", async (req, res) => {
  try {
    console.log("🔧 Creating test booking...");

    // Generate ID yang konsisten
    const now = new Date();
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD format
    const timeStr =
      now.getHours().toString().padStart(2, "0") +
      now.getMinutes().toString().padStart(2, "0");
    const randomStr = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");

    const bookingId = `BOOK-${dateStr}${timeStr}${randomStr}`;

    const testBooking = new BookingModel({
      customId: bookingId,
      customerInfo: {
        nama: "Test Customer",
        email: "test@example.com",
        noTelp: "081234567890",
      },
      packageId: null,
      jumlahPeserta: 1,
      tanggalAwal: new Date(),
      tanggalAkhir: new Date(),
      harga: 100000,
      status: "pending_verification",
      paymentStatus: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await testBooking.save();

    console.log(`✅ Test booking created: ${bookingId}`);

    res.json({
      success: true,
      message: "Test booking created",
      booking: {
        customId: testBooking.customId,
        _id: testBooking._id,
        status: testBooking.status,
        createdAt: testBooking.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Error creating test booking:", error);
    res.status(500).json({
      success: false,
      message: "Error creating test booking",
      error: error.message,
    });
  }
});

// 🔥 SOLUTION 3: Enhanced Debug Route
app.get("/api/debug/booking/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log(`🔍 DEBUG: Enhanced search for booking: ${bookingId}`);

    // Multiple search strategies
    const byCustomId = await BookingModel.findOne({ customId: bookingId });
    const byObjectId = bookingId.match(/^[0-9a-fA-F]{24}$/)
      ? await BookingModel.findById(bookingId)
      : null;

    // Get recent bookings for comparison
    const recent = await BookingModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("customId status paymentStatus createdAt");

    // Search for similar IDs
    const similarPattern = bookingId.replace(/[^A-Z0-9]/g, "");
    const similar = await BookingModel.find({
      customId: { $regex: similarPattern, $options: "i" },
    }).limit(5);

    const foundBooking = byCustomId || byObjectId;

    res.json({
      success: true,
      searchId: bookingId,
      found: !!foundBooking,
      booking: foundBooking,
      searchStrategies: {
        byCustomId: !!byCustomId,
        byObjectId: !!byObjectId,
      },
      recentBookings: recent.map((b) => ({
        id: b.customId,
        status: b.status,
        paymentStatus: b.paymentStatus,
        created: b.createdAt,
      })),
      similarBookings: similar.map((b) => ({
        id: b.customId,
        status: b.status,
      })),
      debug: {
        totalInDB: await BookingModel.countDocuments(),
        searchPattern: similarPattern,
      },
    });
  } catch (error) {
    console.error("❌ Error in enhanced debug search:", error);
    res.status(500).json({
      success: false,
      message: "Error in debug search",
      error: error.message,
    });
  }
});

// ✅ ADMIN SESSION CLEAR ENDPOINT
app.post("/admin/clear-session", (req, res) => {
  try {
    console.log("🧹 Clearing admin session data");

    // Clear any session data
    if (req.session) {
      req.session.destroy();
    }

    // Send response with instructions to clear localStorage
    res.json({
      success: true,
      message: "Session cleared successfully",
      instructions: {
        clearLocalStorage: true,
        keys: ["adminToken", "adminUser", "adminAuthExpiry"],
        redirect: "/admin/login",
      },
    });
  } catch (error) {
    console.error("❌ Error clearing session:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing session",
      error: error.message,
    });
  }
});

// ✅ MANUAL PAYMENT CHECK ENDPOINT - PERBAIKAN UTAMA
app.post("/api/booking/check-payment/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    console.log(`🔍 Manual payment check for booking: ${bookingId}`);

    // Find booking
    let booking = await BookingModel.findOne({ customId: bookingId });

    if (!booking) {
      // Coba cari dengan MongoDB ObjectId
      if (bookingId.match(/^[0-9a-fA-F]{24}$/)) {
        booking = await BookingModel.findById(bookingId);
      }
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    console.log(
      `📋 Current booking status: ${booking.status}, payment: ${booking.paymentStatus}`
    );

    // ✅ PERBAIKAN: Selalu query Midtrans untuk status terbaru
    if (booking.paymentOrderId || booking.midtransTransactionId) {
      try {
        const orderId = booking.paymentOrderId || booking.midtransTransactionId;
        console.log(`📡 Querying Midtrans for order: ${orderId}`);

        const midtransResponse = await fetch(
          `https://api.sandbox.midtrans.com/v2/${orderId}/status`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Basic ${Buffer.from(
                process.env.MIDTRANS_SERVER_KEY + ":"
              ).toString("base64")}`,
            },
          }
        );

        if (midtransResponse.ok) {
          const midtransData = await midtransResponse.json();
          console.log(`📊 Midtrans status response:`, midtransData);

          // ✅ PERBAIKAN: Update booking berdasarkan status Midtrans yang sebenarnya
          const oldStatus = booking.status;
          const oldPaymentStatus = booking.paymentStatus;

          if (
            midtransData.transaction_status === "settlement" ||
            (midtransData.transaction_status === "capture" &&
              midtransData.fraud_status === "accept")
          ) {
            // Update to confirmed
            booking.status = "confirmed";
            booking.paymentStatus = "settlement";
            booking.transactionStatus = midtransData.transaction_status;
            booking.fraudStatus = midtransData.fraud_status;
            booking.paymentDate = midtransData.settlement_time
              ? new Date(midtransData.settlement_time)
              : new Date();
            booking.lastWebhookUpdate = new Date();
            booking.webhookReceived = true;
            booking.midtransResponse = midtransData;

            // ✅ PENTING: Save ke database
            await booking.save();

            console.log(
              `✅ Booking updated: ${oldStatus} → ${booking.status}, ${oldPaymentStatus} → ${booking.paymentStatus}`
            );

            return res.json({
              success: true,
              status: "confirmed",
              message: "Payment status updated to confirmed",
              booking: booking,
              updated: true,
              oldStatus: oldStatus,
              newStatus: booking.status,
            });
          } else if (midtransData.transaction_status === "pending") {
            // Still pending
            booking.transactionStatus = midtransData.transaction_status;
            booking.lastWebhookUpdate = new Date();
            await booking.save();

            return res.json({
              success: true,
              status: "pending",
              message: "Payment still pending",
              booking: booking,
              midtransStatus: midtransData.transaction_status,
            });
          } else {
            // Other status (failed, cancelled, etc.)
            console.log(
              `⚠️ Unexpected transaction status: ${midtransData.transaction_status}`
            );

            return res.json({
              success: true,
              status: booking.status,
              message: `Transaction status: ${midtransData.transaction_status}`,
              booking: booking,
              midtransStatus: midtransData.transaction_status,
            });
          }
        } else {
          console.error(
            "❌ Failed to query Midtrans:",
            midtransResponse.status,
            midtransResponse.statusText
          );
        }
      } catch (midtransError) {
        console.error("❌ Error querying Midtrans:", midtransError);
      }
    }

    // Fallback - return current status
    return res.json({
      success: true,
      status: booking.status,
      message: "Current booking status",
      booking: booking,
    });
  } catch (error) {
    console.error("💥 Error in manual payment check:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// ✅ VOUCHER GENERATION ENDPOINT
app.post("/api/voucher/generate/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    console.log(`🎫 Generating voucher for booking: ${bookingId}`);

    // Find booking
    let booking = await BookingModel.findOne({ customId: bookingId }).populate(
      "packageId"
    );

    // Debug log untuk cek package data
    if (booking) {
      console.log(`📦 Package ID: ${booking?.packageId?._id}`);
      console.log(
        `📦 Package data:`,
        JSON.stringify(booking?.packageId, null, 2)
      );
    }

    if (!booking) {
      // Coba cari dengan MongoDB ObjectId
      if (bookingId.match(/^[0-9a-fA-F]{24}$/)) {
        booking = await BookingModel.findById(bookingId).populate("packageId");
      }
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if payment is confirmed
    if (
      booking.status !== "confirmed" ||
      booking.paymentStatus !== "settlement"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment not confirmed yet",
        currentStatus: booking.status,
        paymentStatus: booking.paymentStatus,
      });
    }

    // Generate voucher data
    const voucherData = {
      voucherId: `VOC-${booking.customId}-${Date.now()}`,
      bookingId: booking.customId,
      customerName:
        booking.customerInfo?.nama ||
        booking.customerInfo?.name ||
        booking.customerInfo?.fullName ||
        "Customer",
      packageName:
        booking.packageId?.nama ||
        booking.packageId?.name ||
        booking.packageId?.title ||
        "Travel Package",
      packageId: booking.packageId?._id,
      startDate: booking.tanggalAwal || booking.startDate,
      endDate: booking.tanggalAkhir || booking.endDate,
      participants: booking.jumlahPeserta,
      totalAmount: booking.harga,
      paymentStatus: booking.paymentStatus,
      generatedAt: new Date(),
      qrCode: `${process.env.FRONTEND_URL || "http://localhost:5173"}/voucher/${
        booking.customId
      }`,
      instructions: [
        "Voucher ini berlaku untuk 1 kali perjalanan",
        "Harap datang 30 menit sebelum keberangkatan",
        "Bawa identitas yang valid (KTP/Passport)",
        "Hubungi customer service jika ada pertanyaan",
      ],
      contactInfo: {
        phone: "+62-xxx-xxxx-xxxx",
        email: "support@travedia.com",
        website: "www.travedia.com",
      },
    };

    console.log(`✅ Voucher generated for ${bookingId}`);

    res.json({
      success: true,
      message: "Voucher generated successfully",
      voucher: voucherData,
    });
  } catch (error) {
    console.error("💥 Error generating voucher:", error);
    res.status(500).json({
      success: false,
      message: "Error generating voucher",
      error: error.message,
    });
  }
});

// ✅ GET VOUCHER ENDPOINT
app.get("/api/voucher/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking
    let booking = await BookingModel.findOne({ customId: bookingId }).populate(
      "packageId"
    );

    if (!booking) {
      if (bookingId.match(/^[0-9a-fA-F]{24}$/)) {
        booking = await BookingModel.findById(bookingId).populate("packageId");
      }
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if payment is confirmed
    if (
      booking.status !== "confirmed" ||
      booking.paymentStatus !== "settlement"
    ) {
      return res.status(400).json({
        success: false,
        message: "Voucher not available - payment not confirmed",
        currentStatus: booking.status,
        paymentStatus: booking.paymentStatus,
      });
    }

    // Return voucher data
    const voucherData = {
      voucherId: `VOC-${booking.customId}-${new Date(
        booking.paymentDate
      ).getTime()}`,
      bookingId: booking.customId,
      customerName:
        booking.customerInfo?.nama ||
        booking.customerInfo?.name ||
        booking.customerInfo?.fullName ||
        "Customer",
      packageName:
        booking.packageId?.nama ||
        booking.packageId?.name ||
        booking.packageId?.title ||
        "Travel Package",
      packageId: booking.packageId?._id,
      startDate: booking.tanggalAwal || booking.startDate,
      endDate: booking.tanggalAkhir || booking.endDate,
      participants: booking.jumlahPeserta,
      totalAmount: booking.harga,
      paymentStatus: booking.paymentStatus,
      paymentDate: booking.paymentDate,
      qrCode: `${process.env.FRONTEND_URL || "http://localhost:5173"}/voucher/${
        booking.customId
      }`,
      instructions: [
        "Voucher ini berlaku untuk 1 kali perjalanan",
        "Harap datang 30 menit sebelum keberangkatan",
        "Bawa identitas yang valid (KTP/Passport)",
        "Hubungi customer service jika ada pertanyaan",
      ],
      contactInfo: {
        phone: "+62-xxx-xxxx-xxxx",
        email: "support@travedia.com",
        website: "www.travedia.com",
      },
    };

    res.json({
      success: true,
      voucher: voucherData,
    });
  } catch (error) {
    console.error("💥 Error fetching voucher:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching voucher",
      error: error.message,
    });
  }
});

// ✅ WEBHOOK HANDLER - PERBAIKAN LENGKAP
app.post("/api/webhook/midtrans", async (req, res) => {
  try {
    console.log("📨 Received webhook from Midtrans:");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));

    const {
      transaction_status,
      fraud_status,
      order_id,
      payment_type,
      transaction_time,
      gross_amount,
      signature_key,
      transaction_id,
      status_code,
      settlement_time,
    } = req.body;

    // ✅ PERBAIKAN 1: Validasi signature untuk security
    if (signature_key && process.env.MIDTRANS_SERVER_KEY) {
      const crypto = await import("crypto");
      const hash = crypto.default
        .createHash("sha512")
        .update(
          order_id +
            status_code +
            gross_amount +
            process.env.MIDTRANS_SERVER_KEY
        )
        .digest("hex");

      if (hash !== signature_key) {
        console.error("❌ Invalid signature from Midtrans");
        return res.status(400).json({
          success: false,
          message: "Invalid signature",
        });
      }
      console.log("✅ Signature verified successfully");
    }

    // Validasi basic
    if (!order_id || !transaction_status) {
      console.error("❌ Invalid webhook: missing required fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ PERBAIKAN 2: Extract booking ID dengan pattern yang benar
    let bookingId;

    // Format: TRX-BOOK-01086213-1748601144363-421
    if (order_id.startsWith("TRX-BOOK-")) {
      // Split dan ambil bagian ke-2 (index 1) dan ke-3 (index 2)
      const orderParts = order_id.split("-");
      if (orderParts.length >= 3) {
        // Gabungkan "BOOK" + nomor
        bookingId = orderParts[1] + "-" + orderParts[2]; // "BOOK-01086213"
      } else {
        bookingId = order_id.replace("TRX-", "");
      }
    } else {
      // Fallback untuk format lama
      const orderParts = order_id.split("-");
      bookingId =
        orderParts.length >= 2 ? orderParts[1] : order_id.replace("TRX-", "");
    }

    console.log(`🔍 Processing payment for booking: ${bookingId}`);
    console.log(
      `📊 Transaction status: ${transaction_status}, Fraud status: ${fraud_status}`
    );

    // Cari booking di database
    let booking = await BookingModel.findOne({ customId: bookingId });

    if (!booking) {
      // Coba cari dengan MongoDB ObjectId jika bookingId adalah ObjectId yang valid
      if (bookingId.match(/^[0-9a-fA-F]{24}$/)) {
        booking = await BookingModel.findById(bookingId);
      }
    }

    if (!booking) {
      console.error(`❌ Booking dengan ID ${bookingId} tidak ditemukan`);
      // Tetap return 200 untuk Midtrans agar tidak retry
      return res.status(200).json({
        success: false,
        message: "Booking not found",
        order_id: order_id,
        extracted_booking_id: bookingId,
      });
    }

    console.log(
      `✅ Found booking: ${booking._id}, current status: ${booking.status}`
    );

    // ✅ PERBAIKAN 3: Status mapping yang lebih akurat
    let newBookingStatus = booking.status;
    let newPaymentStatus = transaction_status;
    let paymentDate = null;

    switch (transaction_status) {
      case "capture":
        if (fraud_status === "accept") {
          newBookingStatus = "confirmed";
          newPaymentStatus = "settlement";
          paymentDate = new Date();
        } else if (fraud_status === "challenge") {
          newBookingStatus = "pending_verification";
          newPaymentStatus = "pending";
        }
        break;

      case "settlement":
        newBookingStatus = "confirmed";
        newPaymentStatus = "settlement";
        paymentDate = settlement_time ? new Date(settlement_time) : new Date();
        break;

      case "pending":
        newBookingStatus = "pending_verification";
        newPaymentStatus = "pending";
        break;

      case "deny":
      case "cancel":
      case "expire":
        newBookingStatus = "cancelled";
        newPaymentStatus = "failed";
        break;

      case "refund":
      case "partial_refund":
        newBookingStatus = "refunded";
        newPaymentStatus = "refunded";
        break;

      default:
        console.log(`⚠️ Unknown transaction status: ${transaction_status}`);
        break;
    }

    // ✅ PERBAIKAN 4: Update booking dengan data lengkap
    const oldStatus = booking.status;
    const oldPaymentStatus = booking.paymentStatus;

    booking.status = newBookingStatus;
    booking.paymentStatus = newPaymentStatus;
    booking.paymentMethod = payment_type;
    booking.transactionStatus = transaction_status;
    booking.fraudStatus = fraud_status;
    booking.transactionTime = transaction_time;
    booking.settlementTime = settlement_time;
    booking.lastWebhookUpdate = new Date();
    booking.webhookReceived = true;

    if (paymentDate) {
      booking.paymentDate = paymentDate;
    }

    // Add Midtrans response data untuk debugging
    booking.midtransResponse = req.body;
    if (transaction_id) {
      booking.midtransTransactionId = transaction_id;
    }

    // Save to database
    await booking.save();

    console.log(`✅ Successfully updated booking ${bookingId}`);
    console.log(`📈 Status: ${oldStatus} → ${newBookingStatus}`);
    console.log(`💳 Payment: ${oldPaymentStatus} → ${newPaymentStatus}`);

    // ✅ PERBAIKAN 5: Special logging untuk confirmed payments
    if (newBookingStatus === "confirmed" && oldStatus !== "confirmed") {
      console.log(
        `🎉 PAYMENT CONFIRMED for booking ${bookingId}! E-voucher now available.`
      );
    }

    // Always return 200 to Midtrans
    res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
      booking_id: bookingId,
      old_status: oldStatus,
      new_status: newBookingStatus,
      old_payment_status: oldPaymentStatus,
      new_payment_status: newPaymentStatus,
      transaction_status: transaction_status,
    });
  } catch (error) {
    console.error("💥 Error handling Midtrans webhook:", error);
    // Always return 200 to Midtrans to prevent retries
    res.status(200).json({
      success: false,
      message: "Error processing webhook",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Webhook fallback routes
app.post("/webhook/midtrans", (req, res) => {
  req.url = "/api/webhook/midtrans";
  return app._router.handle(req, res);
});

app.post("/api/payments/webhook", async (req, res) => {
  req.url = "/api/webhook/midtrans";
  return app._router.handle(req, res);
});

app.post("/api/payments/notification", async (req, res) => {
  req.url = "/api/webhook/midtrans";
  return app._router.handle(req, res);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("💥 Error occurred:", err);

  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Invalid token" });
  } else if (err.message === "Not allowed by CORS") {
    res.status(403).json({
      error: "CORS error",
      origin: req.headers.origin,
      message: "Origin not allowed",
    });
  } else if (err.name === "ValidationError") {
    res.status(400).json({
      error: "Validation error",
      details: err.message,
    });
  } else {
    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong!",
    });
  }
});

// Swagger
setupSwagger(app);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  await mongoose.connection.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  await mongoose.connection.close();
  process.exit(0);
});

// Server Listening
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(
    `📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
  );
  console.log(
    `🌐 Ngrok URL: ${
      process.env.NGROK_URL || "Not set yet - run: ngrok http 5000"
    }`
  );
  console.log(
    `💳 Midtrans Environment: ${
      process.env.MIDTRANS_IS_PRODUCTION === "true" ? "Production" : "Sandbox"
    }`
  );
  console.log(`🔧 Allowed origins: ${allowedOrigins.join(", ")}`);
  console.log(`🔧 Node Environment: ${process.env.NODE_ENV || "development"}`);

  if (process.env.MIDTRANS_SERVER_KEY && process.env.MIDTRANS_CLIENT_KEY) {
    console.log("✅ Midtrans configuration detected");
    console.log(
      `🔑 Server Key: ${process.env.MIDTRANS_SERVER_KEY.substring(0, 10)}...`
    );
  } else {
    console.log(
      "⚠️  Warning: Midtrans configuration not found in environment variables"
    );
    console.log(
      "   Please set MIDTRANS_SERVER_KEY and MIDTRANS_CLIENT_KEY in .env file"
    );
  }

  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
