import { body, validationResult } from "express-validator";

// Middleware untuk validasi data banner
export const validateBannerData = [
  body("gambar")
    .custom((value, { req }) => {
      if (!req.files || req.files.length === 0) {
        throw new Error("At least one image is required.");
      }
      if (req.files.length > 10) {
        throw new Error("You can upload a maximum of 10 images.");
      }
      return true;
    })
    .withMessage("Banner gambar is required and should be an array."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
