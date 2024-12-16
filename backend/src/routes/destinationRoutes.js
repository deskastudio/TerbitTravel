import express from "express";
import multer from "multer";
import path from "path";
import {
  addDestination,
  updateDestination,
  deleteDestination,
  getAllDestinations,
} from "../controllers/destinationController.js";
import { validateDestinationData } from "../middleware/destinationValidator.js";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";

// Konfigurasi multer untuk menyimpan file gambar di subfolder `uploads/destination`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/destination");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Destination
 *     description: API for managing destinations
 */

// Tambah destinasi
router.post(
  "/add",
  authMiddleware,
  checkRole("admin"),
  upload.array("foto"),
  validateDestinationData,
  addDestination
);
/**
 * @swagger
 * /destination/add:
 *   post:
 *     summary: Add a new destination
 *     description: Add a new destination including name, location, description, and multiple images.
 *     tags: [Destination]
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
 *                 example: "Pantai Indah"
 *               lokasi:
 *                 type: string
 *                 example: "Bali"
 *               deskripsi:
 *                 type: string
 *                 example: "Pantai yang indah dengan pasir putih."
 *               foto:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Destination added successfully
 *       400:
 *         description: Validation errors
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error adding destination
 */

// Update destinasi
router.put(
  "/update/:id",
  authMiddleware,
  checkRole("admin"),
  upload.array("foto"),
  validateDestinationData,
  updateDestination
);
/**
 * @swagger
 * /destination/update/{id}:
 *   put:
 *     summary: Update an existing destination
 *     description: Update a destination by ID including name, location, description, and images.
 *     tags: [Destination]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the destination to update
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
 *                 example: "Pantai Baru"
 *               lokasi:
 *                 type: string
 *                 example: "Lombok"
 *               deskripsi:
 *                 type: string
 *                 example: "Pantai dengan ombak tenang dan pemandangan sunset."
 *               foto:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Destination updated successfully
 *       404:
 *         description: Destination not found
 *       400:
 *         description: Validation errors
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error updating destination
 */

// Hapus destinasi
router.delete(
  "/delete/:id",
  authMiddleware,
  checkRole("admin"),
  deleteDestination
);
/**
 * @swagger
 * /destination/delete/{id}:
 *   delete:
 *     summary: Delete a destination
 *     description: Delete a destination by ID.
 *     tags: [Destination]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the destination to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Destination deleted successfully
 *       404:
 *         description: Destination not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error deleting destination
 */

// Ambil semua data destinasi
router.get("/getAll", authMiddleware, getAllDestinations);
/**
 * @swagger
 * /destination/getAll:
 *   get:
 *     summary: Get all destinations
 *     description: Retrieve a list of all destinations.
 *     tags: [Destination]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched destinations
 *       500:
 *         description: Error fetching destinations
 */

export default router;
