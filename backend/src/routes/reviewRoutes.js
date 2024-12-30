import express from "express";
import multer from "multer";
import {
  addReview,
  deleteReview,
  getAllReviews,
  getReviewById,
} from "../controllers/reviewController.js";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer(); // Middleware untuk menangani multipart form-data

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Add a new review
 *     description: Add a review with user ID, content, and date.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               isi:
 *                 type: string
 *                 description: Content of the review
 *     responses:
 *       201:
 *         description: Review successfully added
 *       400:
 *         description: Bad request, invalid data
 */
router.post("/", authMiddleware, upload.none(), addReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get a review by ID
 *     description: Retrieve a specific review by its ID for the logged-in user.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to retrieve
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *       404:
 *         description: Review not found
 */
router.get("/:reviewId", authMiddleware, getReviewById);

/**
 * @swagger
 * /reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews
 *     description: Retrieve all reviews from the database.
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get("/", getAllReviews);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review
 *     description: Delete a review by its ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router.delete("/:reviewId", authMiddleware, checkRole("admin"), deleteReview);

export default router;
