// src/middleware/orderValidator.js - FIXED VERSION
import { body, validationResult } from "express-validator";

// Middleware untuk validasi input booking
export const validateOrderInput = [
  // Package ID is required
  body("packageId")
    .notEmpty()
    .withMessage("Package ID is required")
    .isMongoId()
    .withMessage("Package ID must be a valid MongoDB ObjectId"),

  // Jumlah peserta validation
  body("jumlahPeserta")
    .isInt({ min: 1, max: 50 })
    .withMessage("Jumlah peserta harus berupa angka antara 1-50"),

  // Customer info validation
  body("customerInfo").isObject().withMessage("Customer info is required"),

  body("customerInfo.nama")
    .notEmpty()
    .withMessage("Nama customer is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nama must be between 2-100 characters"),

  body("customerInfo.email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("customerInfo.telepon")
    .notEmpty()
    .withMessage("Nomor telepon is required")
    .matches(/^(\+62|62|0)[0-9]{9,13}$/)
    .withMessage("Format nomor telepon tidak valid (contoh: 08123456789)"),

  // ✅ FIXED: Optional fields with proper handling
  body("customerInfo.alamat")
    .optional({ nullable: true, checkFalsy: false }) // ✅ Allow empty strings
    .isLength({ max: 500 })
    .withMessage("Alamat maksimal 500 karakter"),

  body("customerInfo.instansi")
    .optional({ nullable: true, checkFalsy: false }) // ✅ Allow empty strings
    .isLength({ max: 100 })
    .withMessage("Instansi maksimal 100 karakter"),

  body("customerInfo.catatan")
    .optional({ nullable: true, checkFalsy: false }) // ✅ Allow empty strings
    .isLength({ max: 1000 })
    .withMessage("Catatan maksimal 1000 karakter"),

  // Optional user ID validation (for logged in users)
  body("userId")
    .optional()
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),

  // Optional schedule validation
  body("selectedSchedule")
    .optional()
    .isObject()
    .withMessage("Selected schedule must be an object"),

  body("selectedSchedule.tanggalAwal")
    .optional()
    .isISO8601()
    .withMessage("Tanggal awal must be a valid date"),

  body("selectedSchedule.tanggalAkhir")
    .optional()
    .isISO8601()
    .withMessage("Tanggal akhir must be a valid date"),

  // ✅ ENHANCED Error handling middleware
  (req, res, next) => {
    // ✅ DEBUG: Log request body before validation
    console.log(
      "🔍 VALIDATOR - Raw request body:",
      JSON.stringify(req.body, null, 2)
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation errors:", errors.array());
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.path || err.param,
          message: err.msg,
          value: err.value,
        })),
      });
    }

    // ✅ DEBUG: Log request body after validation
    console.log(
      "✅ VALIDATOR - Body after validation:",
      JSON.stringify(req.body, null, 2)
    );
    console.log(
      "✅ VALIDATOR - customerInfo after validation:",
      JSON.stringify(req.body.customerInfo, null, 2)
    );

    next();
  },
];

// Middleware untuk validasi update status
export const validateStatusUpdate = [
  body("status")
    .optional()
    .isIn([
      "pending",
      "pending_verification",
      "confirmed",
      "completed",
      "cancelled",
    ])
    .withMessage(
      "Status must be one of: pending, pending_verification, confirmed, completed, cancelled"
    ),

  body("paymentStatus")
    .optional()
    .isIn(["pending", "settlement", "capture", "deny", "cancel", "expire"])
    .withMessage(
      "Payment status must be one of: pending, settlement, capture, deny, cancel, expire"
    ),

  // Error handling
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

// Middleware untuk validasi ID parameter
export const validateIdParam = [
  body("id").custom((value) => {
    // Allow both MongoDB ObjectId and custom booking ID format
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(value);
    const isCustomId = /^BOOK-\d{8}$/.test(value);

    if (!isMongoId && !isCustomId) {
      throw new Error(
        "ID must be either MongoDB ObjectId or booking ID format (BOOK-xxxxxxxx)"
      );
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
        errors: errors.array(),
      });
    }
    next();
  },
];
