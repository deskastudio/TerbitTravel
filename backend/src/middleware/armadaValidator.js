import { body, validationResult } from "express-validator";
import { parseKapasitas } from "./parseKapasitas.js"; // Mengimpor middleware parseKapasitas

export const validateArmadaData = [
  // Memastikan ada file gambar
  (req, res, next) => {
    // Skip image validation for PUT/update requests if no new images
    if (req.method === 'PUT' && (!req.files || req.files.length === 0)) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      return next();
    }

    // For POST/create requests, require at least one image
    if (req.method === 'POST' && (!req.files || req.files.length < 1)) {
      return res.status(400).json({ message: "At least one image is required" });
    }
    next();
  },

  // Validasi data "nama"
  body("nama").notEmpty().withMessage("Nama is required"),

  // Validasi data "kapasitas"
  body("kapasitas")
    .custom((value) => {
      if (typeof value === "string") {
        return value
          .split(",")
          .every((item) => typeof item.trim() === "string");
      } else if (Array.isArray(value)) {
        return value.every((item) => typeof item === "string");
      }
      return false;
    })
    .withMessage(
      "Kapasitas harus berupa string yang dipisahkan koma atau array berisi string"
    ),

  // Validasi data "harga"
  body("harga").isNumeric().withMessage("Harga harus berupa angka"),

  // Validasi data "merek"
  body("merek").notEmpty().withMessage("Merek is required"),

  // Middleware untuk validasi dan parsing kapasitas
  (req, res, next) => {
    // Validasi hasil parsing
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },

  // Memanggil middleware parseKapasitas untuk memastikan kapasitas menjadi angka
  parseKapasitas,
];