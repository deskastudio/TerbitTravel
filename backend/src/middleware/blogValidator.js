// src/middleware/blogValidator.js
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import Category from "../models/blogCategory.js";

export const validateBlogData = [
  body("judul").notEmpty().withMessage("Judul is required"),
  body("penulis").notEmpty().withMessage("Penulis is required"),
  body("isi").notEmpty().withMessage("Isi is required"),
  body("kategori")
    .notEmpty().withMessage("Kategori is required")
    .custom(async (value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid kategori ID format");
      }

      const category = await Category.findById(value);
      if (!category) {
        throw new Error("Kategori tidak ditemukan");
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