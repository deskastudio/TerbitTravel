// src/controllers/payment.controller.js - COMPLETE FIXED VERSION
import midtransClient from "midtrans-client";
import BookingModel from "../models/booking.js";
import Package from "../models/package.js"; // ✅ ADD THIS IMPORT
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Inisialisasi Snap API
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Core API untuk status checking
const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// FUNGSI UNTUK FORMAT DATE MIDTRANS
const formatMidtransDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const timezoneOffset = "+0700";

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${timezoneOffset}`;
};

// Fungsi untuk verifikasi signature Midtrans
const verifySignature = (notification) => {
  const { order_id, status_code, gross_amount, signature_key } = notification;
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  const hash = crypto
    .createHash("sha512")
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest("hex");

  return hash === signature_key;
};

// Fungsi untuk menentukan status booking
const determineBookingStatus = (transactionStatus, fraudStatus) => {
  switch (transactionStatus) {
    case "capture":
      return fraudStatus === "accept" ? "confirmed" : "pending_verification";
    case "settlement":
      return "confirmed";
    case "pending":
      return "pending_verification";
    case "deny":
    case "cancel":
    case "expire":
      return "cancelled";
    default:
      return "pending";
  }
};

export const createPayment = async (req, res) => {
  console.log("🔄 Starting createPayment:", JSON.stringify(req.body, null, 2));

  try {
    let { bookingId, customerInfo, packageInfo, jumlahPeserta, totalAmount } =
      req.body;

    // ✅ HANDLE BOTH REQUEST FORMATS
    console.log("🔍 === REQUEST TYPE DETECTION ===");

    // Case 1: Direct booking creation (first request type)
    if (!bookingId && req.body.packageId) {
      console.log("🔍 Detected: Direct booking creation request");

      // ✅ FETCH REAL PACKAGE DATA FROM DATABASE
      const packageData = await Package.findById(req.body.packageId)
        .populate("destination", "nama provinsi")
        .populate("hotel", "nama alamat bintang")
        .populate("armada", "nama merek kapasitas")
        .populate("kategori", "title");

      if (!packageData) {
        console.error("❌ Package not found:", req.body.packageId);
        return res.status(404).json({
          success: false,
          message: "Package not found",
        });
      }

      console.log("✅ Found package data:", {
        id: packageData._id,
        nama: packageData.nama,
        harga: packageData.harga,
        destination: packageData.destination?.nama,
      });

      // Generate bookingId
      bookingId = `BOOK-${Date.now().toString().slice(-8)}`;

      // ✅ USE REAL PACKAGE DATA
      packageInfo = {
        id: packageData._id.toString(),
        nama: packageData.nama, // ✅ Real package name
        harga: packageData.harga, // ✅ Real package price
        destination: packageData.destination?.nama || "Unknown",
        durasi: packageData.durasi,
        kategori: packageData.kategori?.title,
        include: packageData.include,
        hotel: packageData.hotel
          ? {
              nama: packageData.hotel.nama,
              alamat: packageData.hotel.alamat,
              bintang: packageData.hotel.bintang,
            }
          : null,
        armada: packageData.armada
          ? {
              nama: packageData.armada.nama,
              merek: packageData.armada.merek,
              kapasitas: packageData.armada.kapasitas,
            }
          : null,
      };

      // Extract other info
      jumlahPeserta = req.body.jumlahPeserta;
      totalAmount = packageData.harga * req.body.jumlahPeserta; // ✅ Real calculation
      customerInfo = req.body.customerInfo;

      console.log("🔍 Generated booking data:");
      console.log("  - bookingId:", bookingId);
      console.log("  - packageInfo:", JSON.stringify(packageInfo, null, 2));
      console.log("  - realPrice:", packageData.harga);
      console.log("  - calculatedTotal:", totalAmount);
      console.log("  - customerInfo:", JSON.stringify(customerInfo, null, 2));
    }
    // Case 2: Payment creation (second request type)
    else if (bookingId) {
      console.log("🔍 Detected: Payment creation request");
      console.log(
        "🔍 Existing customerInfo:",
        JSON.stringify(customerInfo, null, 2)
      );
    }
    // Case 3: Invalid request
    else {
      console.error("❌ Invalid request format");
      return res.status(400).json({
        success: false,
        message: "Invalid request: missing bookingId or packageId",
      });
    }

    // ✅ Validate required fields after processing
    if (
      !bookingId ||
      !customerInfo ||
      !packageInfo ||
      !jumlahPeserta ||
      !totalAmount
    ) {
      console.error("❌ Missing required fields after processing");
      console.error("  - bookingId:", !!bookingId);
      console.error("  - customerInfo:", !!customerInfo);
      console.error("  - packageInfo:", !!packageInfo);
      console.error("  - jumlahPeserta:", !!jumlahPeserta);
      console.error("  - totalAmount:", !!totalAmount);

      return res.status(400).json({
        success: false,
        message: "Missing required fields after processing",
      });
    }

    console.log("🔍 === CUSTOMER INFO PRESERVATION ===");
    console.log("🔍 Raw customerInfo:", JSON.stringify(customerInfo, null, 2));
    console.log("🔍 customerInfo.instansi:", `"${customerInfo?.instansi}"`);
    console.log("🔍 customerInfo.catatan:", `"${customerInfo?.catatan}"`);

    // ✅ PRESERVE customerInfo exactly as received
    const preservedCustomerInfo = {
      nama: customerInfo?.nama || "",
      email: customerInfo?.email || "",
      telepon: customerInfo?.telepon || "",
      alamat: customerInfo?.alamat || "",
      instansi: customerInfo?.instansi || "",
      catatan: customerInfo?.catatan || "",
    };

    console.log(
      "🔍 Preserved customerInfo:",
      JSON.stringify(preservedCustomerInfo, null, 2)
    );

    // ✅ Generate unique order ID
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const orderId = `TRX-${bookingId}-${timestamp}-${random}`;
    console.log(`📝 Generated order ID: ${orderId}`);

    // Validasi dan parsing amount
    const grossAmount = parseInt(totalAmount);
    if (isNaN(grossAmount) || grossAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount",
      });
    }

    // ✅ URL configuration
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    // Buat expiry time (24 jam dari sekarang)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);
    const formattedExpiryDate = formatMidtransDate(expiryDate);

    // ✅ Enhanced callbacks
    const callbacks = {
      finish: `${frontendUrl}/booking-detail/${bookingId}?payment_success=true&order_id=${orderId}&timestamp=${timestamp}`,
      error: `${frontendUrl}/booking-error/${bookingId}?order_id=${orderId}&reason=payment_error`,
      pending: `${frontendUrl}/booking-detail/${bookingId}?payment_success=pending&order_id=${orderId}&status=pending`,
    };

    // ✅ Webhook URL configuration
    const webhookUrl = `${backendUrl}/api/webhook/midtrans`;

    // Parameter untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: preservedCustomerInfo.nama
          ? preservedCustomerInfo.nama.split(" ")[0]
          : "Customer",
        last_name: preservedCustomerInfo.nama
          ? preservedCustomerInfo.nama.split(" ").slice(1).join(" ")
          : "",
        email: preservedCustomerInfo.email || "customer@example.com",
        phone: preservedCustomerInfo.telepon || "08123456789",
      },
      item_details: [
        {
          id: packageInfo.id || "tour-package",
          price: Math.round(grossAmount / parseInt(jumlahPeserta)),
          quantity: parseInt(jumlahPeserta),
          name: packageInfo.nama || "Tour Package",
        },
      ],
      callbacks: callbacks,
      notification_url: webhookUrl,
      expiry: {
        start_time: formattedExpiryDate,
        unit: "hours",
        duration: 24,
      },
      custom_field1: bookingId,
      custom_field2: timestamp.toString(),
      custom_field3: "travedia_booking",
      credit_card: {
        secure: true,
        save_card: false,
      },
      enabled_payments: [
        "credit_card",
        "gopay",
        "bank_transfer",
        "indomaret",
        "alfamart",
        "akulaku",
        "bca_klikpay",
        "bca_klikbca",
        "bri_epay",
        "echannel",
        "permata_va",
        "bca_va",
        "bni_va",
        "other_va",
        "qris",
      ],
    };

    // Buat transaksi Midtrans
    const transaction = await snap.createTransaction(parameter);
    console.log("✅ Midtrans transaction created successfully");

    // ✅ ENHANCED BOOKING SAVE
    try {
      let booking = await BookingModel.findOne({ customId: bookingId });

      if (!booking) {
        console.log("📝 Creating new booking record");
        console.log(
          "🔍 Creating with preservedCustomerInfo:",
          JSON.stringify(preservedCustomerInfo, null, 2)
        );

        const defaultSchedule = {
          tanggalAwal: new Date(),
          tanggalAkhir: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        };

        booking = new BookingModel({
          customId: bookingId,
          packageId: packageInfo.id,
          jumlahPeserta: parseInt(jumlahPeserta),
          harga: grossAmount,
          totalAmount: grossAmount,
          status: "pending",
          paymentStatus: "pending",
          customerInfo: preservedCustomerInfo, // ✅ Use preserved data
          packageInfo: {
            id: packageInfo.id,
            nama: packageInfo.nama,
            harga: packageInfo.harga,
            destination: packageInfo.destination || "Unknown",
          },
          selectedSchedule: req.body.selectedSchedule || defaultSchedule,
          schedule: req.body.selectedSchedule || defaultSchedule,
          paymentToken: transaction.token,
          paymentOrderId: orderId,
          paymentRedirectUrl: transaction.redirect_url,
          webhookUrl: webhookUrl,
          webhookReceived: false,
          transactionStatus: "pending",
          fraudStatus: null,
          paymentType: null,
          transactionTime: null,
          settlementTime: null,
          lastWebhookUpdate: null,
          bookingDate: new Date(),
          createdAt: new Date(),
        });
      } else {
        console.log("🔄 Updating existing booking:", booking._id);

        // ✅ Update with preserved data
        booking.customerInfo = preservedCustomerInfo;
        booking.paymentToken = transaction.token;
        booking.paymentOrderId = orderId;
        booking.paymentRedirectUrl = transaction.redirect_url;
        // ... update other fields
      }

      console.log(
        "🔍 Before save - customerInfo:",
        JSON.stringify(booking.customerInfo, null, 2)
      );
      await booking.save();
      console.log(
        "🔍 After save - customerInfo:",
        JSON.stringify(booking.customerInfo, null, 2)
      );

      const fetchedBooking = await BookingModel.findById(booking._id);
      console.log(
        "🔍 Fetched from DB - customerInfo:",
        JSON.stringify(fetchedBooking.customerInfo, null, 2)
      );
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
    }

    // ✅ Enhanced response
    const responseData = {
      success: true,
      data: {
        snap_token: transaction.token,
        redirect_url: transaction.redirect_url,
        order_id: orderId,
        booking_id: bookingId,
        callback_urls: callbacks,
        webhook_url: webhookUrl,
      },
      snap_token: transaction.token,
      redirect_url: transaction.redirect_url,
      message: "Payment transaction created successfully",
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("💥 Error creating payment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating payment transaction",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// GET PAYMENT STATUS
export const getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log("🔍 Checking payment status for bookingId:", bookingId);

    let booking = null;

    if (bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await BookingModel.findById(bookingId);
    }

    if (!booking) {
      booking = await BookingModel.findOne({ customId: bookingId });
    }

    if (!booking) {
      console.log(`❌ Booking not found for id: ${bookingId}`);
      return res.status(404).json({
        success: false,
        message: "Booking tidak ditemukan",
      });
    }

    console.log(`✅ Found booking:`, {
      id: booking._id,
      customId: booking.customId,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });

    let midtransStatus = null;
    if (booking.paymentOrderId) {
      try {
        const statusResponse = await coreApi.transaction.status(
          booking.paymentOrderId
        );
        midtransStatus = statusResponse.transaction_status;
        console.log("📊 Latest Midtrans status:", midtransStatus);

        if (midtransStatus !== booking.paymentStatus) {
          const newBookingStatus = determineBookingStatus(
            midtransStatus,
            statusResponse.fraud_status
          );
          if (newBookingStatus !== booking.status) {
            booking.status = newBookingStatus;
            booking.paymentStatus = midtransStatus;
            if (newBookingStatus === "confirmed" && !booking.paymentDate) {
              booking.paymentDate = new Date();
            }
            await booking.save();
            console.log(
              `🔄 Updated booking status from Midtrans check: ${newBookingStatus}`
            );
          }
        }
      } catch (midtransError) {
        console.log(
          "⚠️ Could not fetch status from Midtrans:",
          midtransError.message
        );
      }
    }

    res.status(200).json({
      success: true,
      data: {
        bookingId: booking._id,
        customId: booking.customId,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        paymentDate: booking.paymentDate,
        paymentOrderId: booking.paymentOrderId,
        midtransStatus: midtransStatus,
        canAccessVoucher: booking.status === "confirmed",
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      },
    });
  } catch (error) {
    console.error("💥 Error getting payment status:", error);
    res.status(500).json({
      success: false,
      message: "Error mendapatkan status pembayaran",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// HANDLE NOTIFICATION (WEBHOOK)
export const handleNotification = async (req, res) => {
  try {
    console.log(
      "📨 Received Midtrans notification:",
      JSON.stringify(req.body, null, 2)
    );

    const notification = req.body;

    if (!notification || !notification.order_id) {
      console.error("❌ Invalid notification: missing order_id");
      return res.status(400).json({ message: "Invalid notification data" });
    }

    if (
      process.env.NODE_ENV === "production" &&
      !verifySignature(notification)
    ) {
      console.error("❌ Invalid signature from Midtrans");
      return res.status(400).json({ message: "Invalid signature" });
    }

    console.log("✅ Signature verified (or skipped for development)");

    const {
      order_id,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_time,
      gross_amount,
      transaction_id,
    } = notification;

    const orderParts = order_id.split("-");
    const bookingId = orderParts.length >= 2 ? orderParts[1] : null;

    if (!bookingId) {
      console.error("❌ Could not extract bookingId from order_id:", order_id);
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    console.log(`📊 Processing notification for booking ${bookingId}`);
    console.log(
      `📊 Transaction status: ${transaction_status}, Fraud status: ${fraud_status}`
    );

    const bookingStatus = determineBookingStatus(
      transaction_status,
      fraud_status
    );
    const paymentDate =
      ["capture", "settlement"].includes(transaction_status) &&
      fraud_status !== "challenge"
        ? new Date()
        : null;

    console.log(`📊 Determined booking status: ${bookingStatus}`);

    try {
      const booking = await BookingModel.findOne({ customId: bookingId });

      if (booking) {
        const oldStatus = booking.status;

        booking.status = bookingStatus;
        booking.paymentStatus = transaction_status;
        booking.paymentMethod = payment_type;
        booking.paymentDate = paymentDate;
        booking.midtransTransactionId = transaction_id;
        booking.midtransResponse = notification;

        await booking.save();

        console.log(`✅ Successfully updated booking ${bookingId}`);
        console.log(`📈 Status changed: ${oldStatus} → ${bookingStatus}`);

        if (bookingStatus === "confirmed") {
          console.log(
            `🎉 PAYMENT CONFIRMED for booking ${bookingId}! E-voucher now available.`
          );
        }
      } else {
        console.error(`❌ Booking ${bookingId} not found in database`);
      }
    } catch (dbError) {
      console.error(
        `❌ Database error updating booking ${bookingId}:`,
        dbError
      );
    }

    res.status(200).json({
      success: true,
      message: "Notification processed successfully",
    });
  } catch (error) {
    console.error("💥 Error handling notification:", error);
    res.status(200).json({
      success: true,
      message: "Notification received with errors",
    });
  }
};

// GET DEBUG BOOKINGS
export const getDebugBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find()
      .select(
        "customId status paymentStatus paymentMethod paymentDate customerInfo.nama customerInfo.email createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

// SIMULATE WEBHOOK
export const simulateWebhook = async (req, res) => {
  const { bookingId } = req.params;
  const { status = "settlement" } = req.body;

  const simulatedNotification = {
    transaction_time: new Date().toISOString(),
    transaction_status: status,
    transaction_id: `debug-${Date.now()}`,
    status_message: "Success, transaction is found",
    status_code: "200",
    signature_key: "debug-signature",
    payment_type: "bank_transfer",
    order_id: `TRX-${bookingId}-${Date.now()}`,
    merchant_id: "debug-merchant",
    gross_amount: "1000000.00",
    fraud_status: "accept",
    currency: "IDR",
  };

  req.body = simulatedNotification;
  return handleNotification(req, res);
};

// RESET BOOKING STATUS
export const resetBookingStatus = async (req, res) => {
  try {
    const booking = await BookingModel.findOne({
      customId: req.params.bookingId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "pending";
    booking.paymentStatus = "pending";
    booking.paymentDate = null;
    booking.paymentMethod = null;
    await booking.save();

    res.json({
      success: true,
      message: "Booking status reset to pending",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resetting booking",
      error: error.message,
    });
  }
};

// SIMULATE PAYMENT SUCCESS (Development Only)
export const simulatePaymentSuccess = async (req, res) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      success: false,
      message: "Only available in development mode",
    });
  }

  try {
    const { bookingId } = req.params;
    console.log(`🧪 Simulating payment success for booking: ${bookingId}`);

    const booking = await BookingModel.findOne({ customId: bookingId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking tidak ditemukan",
      });
    }

    booking.status = "confirmed";
    booking.paymentStatus = "settlement";
    booking.paymentMethod = "simulation";
    booking.paymentDate = new Date();
    booking.midtransTransactionId = `sim-${Date.now()}`;

    await booking.save();

    console.log(`✅ Successfully simulated payment for booking ${bookingId}`);

    res.status(200).json({
      success: true,
      message: "Payment simulation completed successfully",
      data: {
        bookingId: booking.customId,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error) {
    console.error("💥 Error in simulate payment:", error);
    res.status(500).json({
      success: false,
      message: "Error in payment simulation",
      error: error.message,
    });
  }
};
