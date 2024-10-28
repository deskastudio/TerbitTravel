// src/middleware/validators.js
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Admin from "../models/admin.js"; // Pastikan path model admin sesuai

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
  handleValidationErrors,
];

// Middleware untuk validasi login
export const validateLogin = [
  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Middleware untuk menangani error validasi
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Middleware untuk otentikasi admin
export const authenticateAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Cari admin berdasarkan email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Jika login berhasil, simpan data admin di request untuk keperluan selanjutnya
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
