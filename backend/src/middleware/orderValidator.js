import { body, validationResult } from "express-validator";

// Middleware untuk validasi input order
export const validateOrderInput = [
  body("userId").notEmpty().withMessage("User ID is required."),
  body("packageId").notEmpty().withMessage("Package ID is required."),
  body("armadaId").notEmpty().withMessage("Armada ID is required."),
  body("jumlahPeserta")
    .isInt({ min: 1 })
    .withMessage("Jumlah peserta harus berupa angka dan minimal 1."),
  body("nomorIdentitas").notEmpty().withMessage("Nomor identitas is required."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
