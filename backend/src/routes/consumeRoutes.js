import express from "express";
import multer from "multer";
import {
  addConsume,
  updateConsume,
  deleteConsume,
  getAllConsumes,
  getConsumeById,
} from "../controllers/consumeController.js";
import {
  parseLauk,
  validateConsumeData,
} from "../middleware/consumeValidator.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer();

/**
 * @swagger
 * tags:
 *   - name: Consume
 *     description: API untuk mengelola konsumsi
 */

/**
 * @swagger
 * /consume/add:
 *   post:
 *     summary: Add a new consume (Admin only)
 *     tags: [Consume]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 description: Nama konsumsi
 *                 example: "Nasi Goreng"
 *               harga:
 *                 type: number
 *                 description: Harga konsumsi
 *                 example: 25000
 *               lauk:
 *                 type: array
 *                 description: Pilihan lauk
 *                 items:
 *                   type: string
 *                   example: "Ayam Goreng"
 *     responses:
 *       201:
 *         description: Consume added successfully
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Failed to add consume
 */
router.post(
  "/add",
  // authMiddleware, // Uncomment jika authentication diperlukan
  upload.none(),
  parseLauk,
  validateConsumeData,
  addConsume
);

/**
 * @swagger
 * /consume/update/{id}:
 *   put:
 *     summary: Update an existing consume (Admin only)
 *     tags: [Consume]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Consume ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 description: Nama konsumsi
 *               harga:
 *                 type: number
 *                 description: Harga konsumsi
 *               lauk:
 *                 type: array
 *                 description: Pilihan lauk
 *                 items:
 *                   type: string
 *                   example: "Tempe Goreng"
 *     responses:
 *       200:
 *         description: Consume updated successfully
 *       404:
 *         description: Consume not found
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Failed to update consume
 */
router.put(
  "/update/:id",
  // authMiddleware, // Uncomment jika authentication diperlukan
  upload.none(),
  parseLauk,
  validateConsumeData,
  updateConsume
);

/**
 * @swagger
 * /consume/delete/{id}:
 *   delete:
 *     summary: Delete a consume (Admin only)
 *     tags: [Consume]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Consume ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consume deleted successfully
 *       404:
 *         description: Consume not found
 *       500:
 *         description: Failed to delete consume
 */
router.delete("/delete/:id", deleteConsume);

/**
 * @swagger
 * /consume/getAll:
 *   get:
 *     summary: Get all consumes (Logged-in users)
 *     tags: [Consume]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched consumes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID konsumsi
 *                     example: "614d1b2e1c4f2d0d9c19b8c8"
 *                   nama:
 *                     type: string
 *                     description: Nama konsumsi
 *                     example: "Nasi Goreng"
 *                   harga:
 *                     type: number
 *                     description: Harga konsumsi
 *                     example: 25000
 *                   lauk:
 *                     type: array
 *                     description: Pilihan lauk
 *                     items:
 *                       type: string
 *                       example: "Ayam Goreng"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-08-30T09:30:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-08-31T09:30:00.000Z"
 *       500:
 *         description: Failed to fetch consumes
 */
router.get("/getAll", getAllConsumes);

/**
 * @swagger
 * /consume/{id}:
 *   get:
 *     summary: Ambil data konsumsi berdasarkan ID
 *     tags: [Consume]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID konsumsi yang akan diambil
 *     responses:
 *       200:
 *         description: Data konsumsi ditemukan
 *       404:
 *         description: Konsumsi tidak ditemukan
 *       500:
 *         description: Kesalahan server
 */
router.get("/:id", getConsumeById);

export default router;