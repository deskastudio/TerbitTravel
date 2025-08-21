import { body, validationResult } from "express-validator";

/**
 * Validator untuk kategori galeri
 */
export const validateCategory = [
  // Pastikan 'title' tidak kosong
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  // Middleware untuk menangani error validasi
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
