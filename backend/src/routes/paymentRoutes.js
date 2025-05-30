// src/routes/paymentRoutes.js
import express from "express";
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

// Core payment routes
router.post("/create", createPayment);
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
