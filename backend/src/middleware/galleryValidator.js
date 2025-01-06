// middleware/galleryValidator.js
import { body, validationResult } from "express-validator";
import GalleryCategory from "../models/galleryCategory.js";

export const galleryValidator = [
  body("nama").notEmpty().withMessage("Nama harus diisi"),
  body("kategori")
    .notEmpty()
    .withMessage("Kategori harus diisi")
    .custom(async (value) => {
      const category = await GalleryCategory.findById(value);
      if (!category) {
        throw new Error("ID Kategori tidak valid");
      }
      return true;
    }),
  body("gambar").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Gambar harus diupload");
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
