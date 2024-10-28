import { body, validationResult } from "express-validator";

export const validateDestinationData = [
  body("nama").notEmpty().withMessage("Nama is required"),
  body("lokasi").notEmpty().withMessage("Lokasi is required"),
  body("deskripsi").notEmpty().withMessage("Deskripsi is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
