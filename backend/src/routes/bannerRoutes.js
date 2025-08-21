// src/routes/bannerRoutes.js - Fixed version
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Import controllers - sesuaikan path dengan struktur folder Anda
import {
  addBanner,
  updateBanner,
  deleteBanner,
  getAllBanners,
  getBannerById,
  getActiveBanners
} from "../controllers/bannerController.js";

// Import middleware - sesuaikan path dengan struktur folder Anda
import { authMiddleware, checkRole } from "../middleware/adminAuthMiddleware.js";

// Import validators - sesuaikan path dengan struktur folder Anda
import { 
  validateAddBanner, 
  validateUpdateBanner, 
  validateBannerId 
} from "../middleware/bannerValidator.js";

const router = express.Router();

// Konfigurasi multer untuk file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/banner";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Konfigurasi multer dengan file filter
const upload = multer({ 
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, and WebP files are allowed!'), false);
    }
  }
});

// Error handling middleware untuk multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 2MB.'
      });
    }
  }
  if (err.message === 'Only JPG, JPEG, PNG, and WebP files are allowed!') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next(err);
};

// Simple file validation middleware (fallback jika tidak ada validateFileMiddleware)
const validateFileMiddleware = (req, res, next) => {
  if (req.file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      // Remove uploaded file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Only JPG, JPEG, PNG, and WebP files are allowed!'
      });
    }
  }
  next();
};

// ===== ADMIN PROTECTED ROUTES =====

/**
 * @route   POST /api/admin/banner/add
 * @desc    Add new banner (Admin Only)
 * @access  Private (Admin)
 */
router.post(
  "/add",
  authMiddleware,
  checkRole(["admin", "super-admin"]),
  upload.single("gambar"),
  handleMulterError,
  validateFileMiddleware,
  validateAddBanner,
  addBanner
);

/**
 * @route   PUT /api/admin/banner/update/:id
 * @desc    Update existing banner (Admin Only)
 * @access  Private (Admin)
 */
router.put(
  "/update/:id",
  authMiddleware,
  checkRole(["admin", "super-admin"]),
  upload.single("gambar"),
  handleMulterError,
  validateFileMiddleware,
  validateUpdateBanner,
  updateBanner
);

/**
 * @route   DELETE /api/admin/banner/delete/:id
 * @desc    Delete banner (Admin Only)
 * @access  Private (Admin)
 */
router.delete(
  "/delete/:id", 
  authMiddleware, 
  checkRole(["admin", "super-admin"]),
  validateBannerId,
  deleteBanner
);

/**
 * @route   GET /api/admin/banner/getAll
 * @desc    Get all banners with admin info (Admin Only)
 * @access  Private (Admin)
 */
router.get(
  "/getAll", 
  authMiddleware, 
  checkRole(["admin", "super-admin", "editor"]),
  getAllBanners
);

/**
 * @route   GET /api/admin/banner/get/:id
 * @desc    Get single banner by ID (Admin Only)
 * @access  Private (Admin)
 */
router.get(
  "/get/:id", 
  authMiddleware, 
  checkRole(["admin", "super-admin", "editor"]),
  validateBannerId,
  getBannerById
);

// ===== PUBLIC ROUTES (No Auth Required) =====

/**
 * @route   GET /api/banner/active
 * @desc    Get active banners for public display
 * @access  Public
 */
router.get("/active", getActiveBanners);

// ===== ERROR HANDLING =====
router.use((err, req, res, next) => {
  console.error('Banner Route Error:', err);
  
  // Clean up uploaded file on error
  if (req.file && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

export default router;