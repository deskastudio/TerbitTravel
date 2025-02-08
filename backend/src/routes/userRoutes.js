import express from "express";
import multer from "multer";
import path from "path";
import passport from "passport";
import {
  registerLimiter,
  loginLimiter,
  otpLimiter,
} from "../middleware/rateLimiter.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  verifyOTP,
  resendOTP,
  googleCallback,
  lengkapiProfil, // Add this
} from "../controllers/userController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/user");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and authentication
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - email
 *               - password
 *               - alamat
 *               - noTelp
 *             properties:
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               alamat:
 *                 type: string
 *               noTelp:
 *                 type: string
 *               instansi:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully. Please check email for OTP.
 */
router.post("/register", registerLimiter, upload.single("foto"), registerUser);

/**
 * @swagger
 * /user/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.post("/verify-otp", otpLimiter, verifyOTP);

/**
 * @swagger
 * /user/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP resent successfully
 */
router.post("/resend-otp", otpLimiter, resendOTP);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login with email and password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", loginLimiter, loginUser);

/**
 * @swagger
 * /user/auth/google:
 *   get:
 *     summary: Google OAuth login
 *     tags: [User]
 *     responses:
 *       302:
 *         description: Redirects to Google login
 */
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

/**
 * @swagger
 * /user/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [User]
 *     responses:
 *       302:
 *         description: Redirects to frontend with token
 */
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
  }),
  googleCallback
);

/**
 * @swagger
 * /user/dataUser:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 */
router.get("/dataUser", getAllUsers);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 */
router.get("/:userId", getUserById);

/**
 * @swagger
 * /user/update/{userId}:
 *   put:
 *     summary: Update user data
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *               alamat:
 *                 type: string
 *               noTelp:
 *                 type: string
 *               instansi:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put(
  "/update/:userId",
  upload.single("foto"),
  updateUser
);

/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     summary: Delete user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/:userId", authMiddleware, deleteUser);

/**
 * * @swagger
 * /user/lengkapi-profil/{userId}:
 *   post:
 *     summary: Complete user profile after Google OAuth
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alamat
 *               - noTelp
 *             properties:
 *               alamat:
 *                 type: string
 *               noTelp:
 *                 type: string
 *               instansi:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile completed successfully
 */
router.post("/lengkapi-profil/:userId", authMiddleware, lengkapiProfil);

router.post('/user/auth/google/callback', googleCallback);

export default router;
