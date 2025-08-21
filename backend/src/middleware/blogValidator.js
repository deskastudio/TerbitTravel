// src/middleware/blogValidator.js
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

// Fungsi untuk validasi data blog dengan pesan error yang lebih jelas
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
    .notEmpty()
    .withMessage("Kategori tidak boleh kosong")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Format ID kategori tidak valid");
      }
      return true;
    }),

  // Handler hasil validasi dengan pesan error yang lebih detail
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      
      // Cek apakah ada file yang diunggah
      if (!req.files || !req.files.gambarUtama) {
        errors.errors.push({
          msg: "Gambar utama wajib diunggah",
          param: "gambarUtama",
          location: "body"
        });
      }
      
      return res.status(400).json({ 
        message: "Validasi gagal", 
        errors: errors.array() 
      });
    }
    
    // Validasi gambar utama
    if (!req.files || !req.files.gambarUtama || req.files.gambarUtama.length === 0) {
      return res.status(400).json({ 
        message: "Validasi gagal", 
        errors: [{ msg: "Gambar utama wajib diunggah", param: "gambarUtama" }] 
      });
    }
    
    next();
  },
];