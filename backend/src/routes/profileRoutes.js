import express from "express";
import {
  addProfile,
  updateProfile,
  getProfile,
} from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateProfileData } from "../middleware/profileValidator.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * tags:
 *   - name: Profile
 *     description: API for managing profile
 */

/**
 * @swagger
 * /profile/add:
 *   post:
 *     summary: Add profile (one-time use)
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deskripsi:
 *                 type: string
 *                 description: Description of the profile
 *                 example: "Company profile description here."
 *     responses:
 *       201:
 *         description: Profile added successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to add profile
 */
router.post("/add", authMiddleware, validateProfileData, addProfile);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get profile
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Profile ID
 *                 deskripsi:
 *                   type: string
 *                   description: Description of the profile
 *                   example: "Company profile description here."
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Profile creation date
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Last update date
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Failed to fetch profile
 */
router.get("/", authMiddleware, getProfile);

/**
 * @swagger
 * /profile/update:
 *   put:
 *     summary: Update profile
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deskripsi:
 *                 type: string
 *                 description: Updated description of the profile
 *                 example: "Updated company profile description."
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Failed to update profile
 */
router.put("/update", authMiddleware, validateProfileData, updateProfile);

export default router;
