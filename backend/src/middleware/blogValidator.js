// src/middleware/blogValidator.js
import { body, validationResult } from "express-validator";

export const validateBlogData = [
  body("judul").notEmpty().withMessage("Judul is required"),
  body("penulis").notEmpty().withMessage("Penulis is required"),
  body("isi").notEmpty().withMessage("Isi is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
