import { body, validationResult } from "express-validator";

// Middleware untuk menangani error validasi
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Middleware untuk validasi registrasi
export const validateRegister = [
  body("nama").notEmpty().withMessage("Nama is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("alamat").optional().isString(),
  body("noTelp").optional().isString(),
  body("instansi").optional().isString(),
  handleValidationErrors, // Validasi error
];

// Middleware untuk validasi login
export const validateLogin = [
  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors, // Validasi error
];
