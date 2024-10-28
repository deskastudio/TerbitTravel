import { body, validationResult } from "express-validator";

export const validateHotelData = [
  body("nama").notEmpty().withMessage("Nama is required"),
  body("alamat").notEmpty().withMessage("Alamat is required"),
  body("bintang")
    .isInt({ min: 1, max: 5 })
    .withMessage("Bintang harus antara 1 dan 5"),
  body("harga").isNumeric().withMessage("Harga harus berupa angka"),
  body("fasilitas").notEmpty().withMessage("Fasilitas is required"),
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
