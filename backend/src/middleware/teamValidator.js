import { body, validationResult } from "express-validator";

// Validation rules for team member data
export const validateTeam = [
  body("name").notEmpty().withMessage("Name is required."),
  body("position").notEmpty().withMessage("Position is required."),
  body("description").notEmpty().withMessage("Description is required."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("facebook")
    .optional()
    .isURL()
    .withMessage("Facebook must be a valid URL."),
  body("instagram")
    .optional()
    .isURL()
    .withMessage("Instagram must be a valid URL."),
  body("linkedin")
    .optional()
    .isURL()
    .withMessage("LinkedIn must be a valid URL."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
