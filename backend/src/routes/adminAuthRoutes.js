// src/routes/adminAuthRoutes.js
import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  verifyAdminToken,
  updateAdminProfile,
  changeAdminPassword,
  createAdminAccount,
} from "../controllers/adminAuthController.js";
import {
  adminAuthMiddleware,
  requireSuperAdmin,
} from "../middleware/adminAuthMiddleware.js";
import {
  validateAdminLogin,
  validateAdminProfileUpdate,
  validateAdminPasswordChange,
  validateCreateAdmin,
  loginRateLimit,
  sanitizeAdminInput,
} from "../middleware/adminAuthValidator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin Auth
 *   description: Admin authentication and management endpoints
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin Auth]
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
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 minimum: 6
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                 expiresIn:
 *                   type: number
 *       401:
 *         description: Invalid credentials
 *       423:
 *         description: Account locked
 *       429:
 *         description: Too many attempts
 */
router.post(
  "/login",
  loginRateLimit,
  sanitizeAdminInput,
  validateAdminLogin,
  loginAdmin
);

/**
 * @swagger
 * /admin/logout:
 *   post:
 *     summary: Admin logout
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", adminAuthMiddleware, logoutAdmin);

/**
 * @swagger
 * /admin/profile:
 *   get:
 *     summary: Get admin profile
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Admin not found
 */
router.get("/profile", adminAuthMiddleware, getAdminProfile);

/**
 * @swagger
 * /admin/verify-token:
 *   get:
 *     summary: Verify admin token
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 */
router.get("/verify-token", adminAuthMiddleware, verifyAdminToken);

/**
 * @swagger
 * /admin/create:
 *   post:
 *     summary: Create new admin account (first request will create super-admin)
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, super-admin]
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Validation errors or admin already exists
 *       500:
 *         description: Server error
 */
router.post(
  "/create",
  validateCreateAdmin,
  sanitizeAdminInput,
  createAdminAccount
);

export default router;
