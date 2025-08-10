// src/routes/paymentRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import {
  createPayment,
  handleNotification,
  getPaymentStatus,
  simulatePaymentSuccess,
  getDebugBookings,
  simulateWebhook,
  resetBookingStatus,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Helper middleware untuk auth opsional (tidak error jika tidak ada token)
const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;
      console.log("✅ User authenticated:", {
        userId: req.userId,
        role: req.userRole,
      });
    } else {
      console.log("ℹ️ No token provided - guest checkout");
    }
    next();
  } catch (error) {
    console.log("⚠️ Invalid token - proceeding as guest:", error.message);
    next(); // Continue without auth for guest checkout
  }
};

// Core payment routes
router.post("/create", optionalAuth, createPayment);
router.post("/notification", handleNotification);
router.post("/webhook", handleNotification);
router.post("/callback", handleNotification);
router.get("/status/:bookingId", getPaymentStatus);

// Development routes
if (process.env.NODE_ENV === "development") {
  router.post("/simulate-success/:bookingId", simulatePaymentSuccess);
  router.get("/debug/bookings", getDebugBookings);
  router.post("/debug/webhook/:bookingId", simulateWebhook);
  router.post("/debug/reset/:bookingId", resetBookingStatus);
}

export default router;
