import { body, validationResult } from "express-validator";

export const validateContactData = [
  body("instagram").optional().isString(),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("whatsapp").optional().isString(),
  body("youtube").optional().isString(),
  body("facebook").optional().isString(),
  body("alamat").optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
