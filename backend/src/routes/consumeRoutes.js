import express from "express";
import multer from "multer";
import {
  addConsume,
  updateConsume,
  deleteConsume,
  getAllConsumes,
} from "../controllers/consumeController.js";
import {
  parseLauk,
  validateConsumeData,
} from "../middleware/consumeValidator.js";

const router = express.Router();

// Konfigurasi multer untuk menangani multipart/form-data
const upload = multer();

// Tambah konsumsi baru
router.post("/add", upload.none(), parseLauk, validateConsumeData, addConsume);
/**
 * @swagger
 * /consume/add:
 *   post:
 *     summary: Add a new consume
 *     tags: [Consume]
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

// Update konsumsi
router.put(
  "/update/:id",
  upload.none(),
  parseLauk,
  validateConsumeData,
  updateConsume
);
/**
 * @swagger
 * /consume/update/{id}:
 *   put:
 *     summary: Update an existing consume
 *     tags: [Consume]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Consume ID
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
 *                 example: "Nasi Uduk"
 *               harga:
 *                 type: number
 *                 description: Harga konsumsi
 *                 example: 30000
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

// Hapus konsumsi
router.delete("/delete/:id", deleteConsume);
/**
 * @swagger
 * /consume/delete/{id}:
 *   delete:
 *     summary: Delete a consume
 *     tags: [Consume]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Consume ID
 *     responses:
 *       200:
 *         description: Consume deleted successfully
 *       404:
 *         description: Consume not found
 *       500:
 *         description: Failed to delete consume
 */

// Ambil semua konsumsi
router.get("/get", getAllConsumes);
/**
 * @swagger
 * /consume/get:
 *   get:
 *     summary: Get all consumes
 *     tags: [Consume]
 *     responses:
 *       200:
 *         description: Successfully fetched consumes
 *       500:
 *         description: Failed to fetch consumes
 */

export default router;
