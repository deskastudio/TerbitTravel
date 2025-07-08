// src/validators/bannerValidator.js
import { body, param, query, validationResult } from "express-validator";
import fs from "fs";

// Helper function untuk handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Clean up uploaded file if validation fails
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Validator untuk add banner
export const validateAddBanner = [
  body("judul")
    .notEmpty()
    .withMessage("Judul banner is required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Judul must be between 3-100 characters"),
  
  body("deskripsi")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Deskripsi must not exceed 500 characters"),
  
  body("link")
    .optional()
    .trim()
    .custom((value) => {
      if (value && !/^https?:\/\/.+/.test(value)) {
        throw new Error("Link must be a valid URL (http:// or https://)");
      }
      return true;
    }),
  
  body("isActive")
    .optional()
    .custom((value) => {
      if (value !== undefined && !['true', 'false', '1', '0', true, false].includes(value)) {
        throw new Error("isActive must be boolean or string boolean");
      }
      return true;
    }),
  
  body("urutan")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Urutan must be a positive integer"),

  // Custom validation untuk file
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "Banner image is required",
        errors: [{ field: "gambar", message: "Banner image is required" }]
      });
    }
    next();
  },

  handleValidationErrors
];

// Validator untuk update banner
export const validateUpdateBanner = [
  param("id")
    .isMongoId()
    .withMessage("Invalid banner ID format"),

  body("judul")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Judul must be between 3-100 characters"),
  
  body("deskripsi")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Deskripsi must not exceed 500 characters"),
  
  body("link")
    .optional()
    .trim()
    .custom((value) => {
      if (value && value !== '' && !/^https?:\/\/.+/.test(value)) {
        throw new Error("Link must be a valid URL (http:// or https://)");
      }
      return true;
    }),
  
  body("isActive")
    .optional()
    .custom((value) => {
      if (value !== undefined && !['true', 'false', '1', '0', true, false].includes(value)) {
        throw new Error("isActive must be boolean or string boolean");
      }
      return true;
    }),
  
  body("urutan")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Urutan must be a positive integer"),

  handleValidationErrors
];

// Validator untuk banner ID
export const validateBannerId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid banner ID format"),

  handleValidationErrors
];

// Validator untuk reorder banners
export const validateReorderBanners = [
  body("bannerOrder")
    .isArray({ min: 1 })
    .withMessage("Banner order must be a non-empty array"),
  
  body("bannerOrder.*.id")
    .isMongoId()
    .withMessage("Each banner must have a valid ID"),
  
  body("bannerOrder.*.urutan")
    .isInt({ min: 0 })
    .withMessage("Urutan must be a non-negative integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map(err => ({
          field: err.path || err.param,
          message: err.msg
        }))
      });
    }

    // Additional validation - check for duplicate IDs
    const bannerOrder = req.body.bannerOrder;
    const ids = bannerOrder.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    
    if (ids.length !== uniqueIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate banner IDs found in order array",
        errors: [{ field: "bannerOrder", message: "Banner IDs must be unique" }]
      });
    }

    // Check for duplicate urutan values
    const urutanValues = bannerOrder.map(item => item.urutan);
    const uniqueUrutan = [...new Set(urutanValues)];
    
    if (urutanValues.length !== uniqueUrutan.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate urutan values found",
        errors: [{ field: "bannerOrder", message: "Urutan values must be unique" }]
      });
    }

    next();
  }
];

// Validator untuk bulk delete
export const validateBulkDelete = [
  body("bannerIds")
    .isArray({ min: 1, max: 10 })
    .withMessage("Banner IDs must be an array with 1-10 items"),
  
  body("bannerIds.*")
    .isMongoId()
    .withMessage("Each banner ID must be a valid MongoDB ObjectId"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map(err => ({
          field: err.path || err.param,
          message: err.msg
        }))
      });
    }

    // Check for duplicate IDs
    const bannerIds = req.body.bannerIds;
    const uniqueIds = [...new Set(bannerIds)];
    
    if (bannerIds.length !== uniqueIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate banner IDs found",
        errors: [{ field: "bannerIds", message: "Banner IDs must be unique" }]
      });
    }

    next();
  }
];

// Validator untuk query parameters
export const validateBannerQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  
  query("sortBy")
    .optional()
    .isIn(['judul', 'createdAt', 'urutan', 'isActive'])
    .withMessage("Sort by must be: judul, createdAt, urutan, or isActive"),
  
  query("sortOrder")
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage("Sort order must be 'asc' or 'desc'"),
  
  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive filter must be boolean"),
  
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be 1-100 characters"),

  handleValidationErrors
];

// Default export untuk backward compatibility
export default {
  validateAddBanner,
  validateUpdateBanner,
  validateBannerId,
  validateReorderBanners,
  validateBulkDelete,
  validateBannerQuery
};