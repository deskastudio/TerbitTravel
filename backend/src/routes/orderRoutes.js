// src/routes/orderRoutes.js
import express from "express";
import multer from "multer";
import {
  addOrderByUser,
  addOrderByAdmin,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserBookings,
} from "../controllers/orderController.js";
import { createPayment } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Konfigurasi Multer untuk handling multipart/form-data
const upload = multer();

// Create booking by user
router.post("/", authMiddleware, addOrderByUser);

// Create booking by admin
router.post("/admin", authMiddleware, upload.none(), addOrderByAdmin);

// Get all bookings (admin only)
router.get("/", authMiddleware, getAllOrders);

// Get booking by ID (support both customId and MongoDB ObjectId)
router.get("/:id", getOrderById);

// Update booking status (admin only)
router.put("/:id/status", authMiddleware, updateOrderStatus);

// Payment endpoint - create Midtrans snap token for booking
router.post("/:id/payment", createPayment);

// Delete booking
router.delete("/:id", authMiddleware, deleteOrder);

// Get user's bookings
router.get("/user/:userId", authMiddleware, getUserBookings);

// Public endpoint untuk get booking (untuk frontend yang tidak perlu auth)
router.get("/public/:id", getOrderById);

export default router;
