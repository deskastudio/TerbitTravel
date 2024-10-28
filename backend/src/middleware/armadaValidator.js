import { body, validationResult } from "express-validator";

export const validateArmadaData = [
  body("nama").notEmpty().withMessage("Nama is required"),
  body("kapasitas").isNumeric().withMessage("Kapasitas harus berupa angka"),
  body("harga").isNumeric().withMessage("Harga harus berupa angka"),
  body("merek").notEmpty().withMessage("Merek is required"),
  (req, res, next) => {
    // Validasi bahwa setidaknya ada satu file gambar yang diunggah
    if (!req.files || req.files.length < 1) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
