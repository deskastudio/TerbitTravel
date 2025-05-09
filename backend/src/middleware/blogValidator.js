// src/middleware/blogValidator.js
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

// Fungsi untuk validasi data blog
export const validateBlogData = [
  // Validasi judul
  body("judul")
    .notEmpty()
    .withMessage("Judul tidak boleh kosong")
    .isLength({ min: 5, max: 100 })
    .withMessage("Judul harus antara 5 dan 100 karakter"),

  // Validasi penulis
  body("penulis")
    .notEmpty()
    .withMessage("Nama penulis tidak boleh kosong")
    .isLength({ min: 3, max: 50 })
    .withMessage("Nama penulis harus antara 3 dan 50 karakter"),

  // Validasi isi
  body("isi")
    .notEmpty()
    .withMessage("Isi blog tidak boleh kosong")
    .isLength({ min: 100 })
    .withMessage("Isi blog minimal 100 karakter"),

  // Validasi kategori
  body("kategori")
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Format ID kategori tidak valid");
      }
      return true;
    }),

  // Handler hasil validasi
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
