import { body, validationResult } from "express-validator";

export const validateProfileData = [
  body("deskripsi").notEmpty().withMessage("Deskripsi is required"),
  body("visi").notEmpty().withMessage("Visi is required"),
  body("misi").notEmpty().withMessage("Misi is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
