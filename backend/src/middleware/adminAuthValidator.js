// src/middleware/adminAuthValidator.js
import { body, validationResult } from "express-validator";

// Validation rules for creating admin
export const validateCreateAdmin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
    
  body('role')
    .optional()
    .isIn(['admin', 'super-admin'])
    .withMessage('Role must be either admin or super-admin'),
    
  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map(error => ({
          field: error.param,
          message: error.msg,
          value: error.value
        }))
      });
    }
    
    next();
  }
];

// ✅ DEBUG: Validation rules for admin login
export const validateAdminLogin = [
  // Add debug logging
  (req, res, next) => {
    console.log("\n🔍 ========== VALIDATION DEBUG START ==========");
    console.log("📥 Request body:", JSON.stringify(req.body, null, 2));
    console.log("📏 Body keys:", Object.keys(req.body));
    console.log("📧 Email field:", typeof req.body.email, `"${req.body.email}"`);
    console.log("🔑 Password field:", typeof req.body.password, `"${req.body.password}"`);
    next();
  },

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    
  // ✅ DEBUG: Middleware function to handle validation errors
  (req, res, next) => {
    console.log("\n🔍 VALIDATION RESULT CHECK:");
    const errors = validationResult(req);
    console.log("❌ Has errors:", !errors.isEmpty());
    
    if (!errors.isEmpty()) {
      console.log("📋 Validation errors:", JSON.stringify(errors.array(), null, 2));
      console.log("🔍 ========== VALIDATION DEBUG END (FAILED) ==========\n");
      
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array().map(error => ({
          field: error.param,
          message: error.msg,
          value: error.value
        }))
      });
    }
    
    console.log("✅ Validation passed successfully!");
    console.log("🔍 ========== VALIDATION DEBUG END (SUCCESS) ==========\n");
    next();
  }
];

// Validation rules for updating admin profile
export const validateAdminProfileUpdate = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
    
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),
    
  // Middleware function to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array().map(error => ({
          field: error.param,
          message: error.msg,
          value: error.value
        }))
      });
    }
    next();
  }
];

// Validation rules for changing password
export const validateAdminPasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
    
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
    
  // Middleware function to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array().map(error => ({
          field: error.param,
          message: error.msg,
          value: error.value
        }))
      });
    }
    next();
  }
];

// ✅ DEBUG: Rate limiting middleware for login attempts
export const loginRateLimit = (req, res, next) => {
  console.log("\n🚦 ========== RATE LIMIT CHECK ==========");
  console.log("🌐 Client IP:", req.ip || req.connection.remoteAddress);
  
  // This is a simple in-memory rate limiting
  // In production, use Redis or a proper rate limiting library
  
  const clientIp = req.ip || req.connection.remoteAddress;
  const key = `login_attempts_${clientIp}`;
  
  // Initialize storage if not exists
  if (!global.loginAttempts) {
    global.loginAttempts = new Map();
    console.log("🆕 Initialized global login attempts storage");
  }
  
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10; // Max 10 attempts per 15 minutes
  
  // Get or initialize attempt data
  let attemptData = global.loginAttempts.get(key);
  
  if (!attemptData) {
    attemptData = { count: 0, firstAttempt: now };
    global.loginAttempts.set(key, attemptData);
    console.log("🆕 New IP attempt data created");
  } else {
    console.log(`📊 Current attempts: ${attemptData.count}/${maxAttempts}`);
  }
  
  // Reset if window has passed
  if (now - attemptData.firstAttempt > windowMs) {
    attemptData = { count: 0, firstAttempt: now };
    global.loginAttempts.set(key, attemptData);
    console.log("🔄 Attempt window reset");
  }
  
  // Check if limit exceeded
  if (attemptData.count >= maxAttempts) {
    const timeLeft = Math.ceil((attemptData.firstAttempt + windowMs - now) / 1000 / 60);
    console.log(`❌ Rate limit exceeded! Time left: ${timeLeft} minutes`);
    console.log("🚦 ========== RATE LIMIT END (BLOCKED) ==========\n");
    
    return res.status(429).json({
      message: `Too many login attempts. Please try again in ${timeLeft} minutes.`
    });
  }
  
  // Increment counter
  attemptData.count++;
  global.loginAttempts.set(key, attemptData);
  
  console.log(`✅ Rate limit passed. Attempts: ${attemptData.count}/${maxAttempts}`);
  console.log("🚦 ========== RATE LIMIT END (PASSED) ==========\n");
  
  next();
};

// ✅ DEBUG: Sanitize input middleware
export const sanitizeAdminInput = (req, res, next) => {
  console.log("\n🧹 ========== SANITIZE INPUT ==========");
  console.log("📥 Before sanitization:", JSON.stringify(req.body, null, 2));
  
  // Remove any potential XSS or harmful characters
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        const original = req.body[key];
        // Basic sanitization - remove script tags and common XSS patterns
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
          
        if (original !== req.body[key]) {
          console.log(`🧹 Sanitized ${key}: "${original}" → "${req.body[key]}"`);
        }
      }
    });
  }
  
  console.log("📤 After sanitization:", JSON.stringify(req.body, null, 2));
  console.log("🧹 ========== SANITIZE INPUT END ==========\n");
  
  next();
};