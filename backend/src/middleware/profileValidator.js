import { body, validationResult } from "express-validator";

export const validateProfileData = [
  // Validasi nama
  body("nama").notEmpty().withMessage("Nama is required"),
  // Validasi deskripsi
  body("deskripsi").notEmpty().withMessage("Deskripsi is required"),
  // Middleware untuk menangani error
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware untuk memastikan file gambar ada
export const validateFiles = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one gambar file is required" });
  }
  next();
};
