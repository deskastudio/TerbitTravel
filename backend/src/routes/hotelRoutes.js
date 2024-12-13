// src/routes/hotelRoutes.js
import express from "express";
import multer from "multer";
import {
  addHotel,
  updateHotel,
  deleteHotel,
  getAllHotels,
} from "../controllers/hotelController.js";
import { validateHotelData } from "../middleware/hotelValidator.js";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";
import path from "path";

// Konfigurasi multer untuk menyimpan file gambar di subfolder `uploads/hotel`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/hotel");
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
 *   - name: Hotel
 *     description: API for managing hotels
 */

// Tambah hotel baru
router.post(
  "/add",
  authMiddleware,
  checkRole("admin"),
  upload.array("gambar", 5),
  validateHotelData,
  addHotel
);
/**
 * @swagger
 * /hotel/add:
 *   post:
 *     summary: Add a new hotel
 *     description: Add a new hotel including images, rating, price, and facilities.
 *     tags: [Hotel]
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
 *                 example: "Hotel Santika"
 *               alamat:
 *                 type: string
 *                 example: "Jl. Malioboro No.123, Yogyakarta"
 *               gambar:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               bintang:
 *                 type: integer
 *                 example: 4
 *               harga:
 *                 type: number
 *                 example: 500000
 *               fasilitas:
 *                 type: string
 *                 example: "WiFi, Kolam Renang, Spa"
 *     responses:
 *       201:
 *         description: Hotel added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

// Update hotel
router.put(
  "/update/:id",
  authMiddleware,
  checkRole("admin"),
  upload.array("gambar", 5),
  validateHotelData,
  updateHotel
);
/**
 * @swagger
 * /hotel/update/{id}:
 *   put:
 *     summary: Update hotel details
 *     description: Update a hotel's information, including images, rating, price, and facilities.
 *     tags: [Hotel]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Hotel ID
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
 *                 example: "Hotel Baru"
 *               alamat:
 *                 type: string
 *                 example: "Jl. Baru No.1, Jakarta"
 *               gambar:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               bintang:
 *                 type: integer
 *                 example: 5
 *               harga:
 *                 type: number
 *                 example: 750000
 *               fasilitas:
 *                 type: string
 *                 example: "Gym, Restoran, WiFi"
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *       404:
 *         description: Hotel not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

// Hapus hotel
router.delete("/delete/:id", authMiddleware, checkRole("admin"), deleteHotel);
/**
 * @swagger
 * /hotel/delete/{id}:
 *   delete:
 *     summary: Delete a hotel
 *     description: Delete a hotel by ID along with its associated images.
 *     tags: [Hotel]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 *       404:
 *         description: Hotel not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

// Ambil semua hotel
router.get("/getAll", authMiddleware, getAllHotels);
/**
 * @swagger
 * /hotel/getAll:
 *   get:
 *     summary: Get all hotels
 *     description: Retrieve a list of all hotels.
 *     tags: [Hotel]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched hotels
 *       500:
 *         description: Server error
 */

export default router;
