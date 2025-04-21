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
import { OAuth2Client } from 'google-auth-library';
import User from "../models/user.js";
import jwt from "jsonwebtoken";

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

// Inisialisasi OAuth2Client
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
});

// Endpoint untuk Google Register
router.post("/auth/google/register", async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ 
        status: 'error',
        message: 'No credential provided' 
      });
    }

    // Verifikasi token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Failed to verify Google token');
    }

    const { name, email, picture, sub: googleId } = payload;

    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ 
      $or: [{ email }, { googleId }] 
    });

    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email sudah terdaftar. Silakan login menggunakan Google.'
      });
    }

    // Buat user baru
    const user = await User.create({
      nama: name,
      email,
      foto: picture,
      googleId,
      isVerified: true,
      password: Math.random().toString(36).slice(-8)
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      status: 'success',
      message: 'Registrasi dengan Google berhasil',
      data: {
        token,
        user: {
          id: user._id,
          nama: user.nama,
          email: user.email,
          foto: user.foto,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Google register error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Gagal melakukan registrasi dengan Google'
    });
  }
});

// Google Login
router.post("/auth/google/login", async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: 'No credential provided' });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId } = payload;

    // Find user
    const user = await User.findOne({ 
      $or: [{ email }, { googleId }] 
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Akun tidak ditemukan'
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login Google berhasil',
      data: {
        token,
        user: {
          id: user._id,
          nama: user.nama,
          email: user.email,
          foto: user.foto,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Gagal login dengan Google'
    });
  }
});

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
router.post("/register", registerLimiter, upload.none(), registerUser);


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

export default router;
