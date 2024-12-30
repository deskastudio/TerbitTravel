import { body, validationResult } from "express-validator";

/**
 * Middleware untuk memproses 'lauk' sebagai array jika dikirim dalam format string
 */
const parseLauk = (req, res, next) => {
  if (req.body.lauk && typeof req.body.lauk === "string") {
    // Split string yang dipisahkan koma menjadi array
    req.body.lauk = req.body.lauk.split(",").map((item) => item.trim());
  }
  next();
};

export const validateConsumeData = [
  // Pastikan 'nama' tidak kosong
  body("nama").notEmpty().withMessage("Name is required"),
  // Pastikan 'harga' adalah angka
  body("harga").isNumeric().withMessage("Price must be a number"),
  // Pastikan 'lauk' adalah array setelah parsing
  body("lauk").custom((value) => {
    if (!Array.isArray(value)) {
      throw new Error("Lauk must be an array");
    }
    if (value.length === 0) {
      throw new Error("Lauk cannot be an empty array");
    }
    return true;
  }),
  // Middleware untuk memproses error
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Export parseLauk middleware untuk digunakan di router
export { parseLauk };
