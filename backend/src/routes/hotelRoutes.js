import express from "express";
import multer from "multer";
import {
  addHotel,
  updateHotel,
  deleteHotel,
  getAllHotels,
} from "../controllers/hotelController.js";
import { validateHotelData } from "../middleware/hotelValidator.js";
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
 * /hotel/add:
 *   post:
 *     summary: Add a new hotel with multiple images
 *     description: Add a new hotel including multiple images, rating, price, and facilities.
 *     tags: [Hotel]
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
 *                 description: Rating of the hotel (1 to 5)
 *               harga:
 *                 type: number
 *                 example: 500000
 *                 description: Price per night in IDR
 *               fasilitas:
 *                 type: string
 *                 example: "WiFi, Kolam Renang, Spa"
 *                 description: Facilities separated by commas
 *     responses:
 *       201:
 *         description: Hotel added successfully
 *       400:
 *         description: Bad request, validation error
 *       500:
 *         description: Error adding hotel
 */
router.post("/add", upload.array("gambar", 5), validateHotelData, addHotel);

/**
 * @swagger
 * /hotel/update/{id}:
 *   put:
 *     summary: Update hotel information with multiple images
 *     description: Update an existing hotel including multiple images, rating, price, and facilities.
 *     tags: [Hotel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the hotel to update
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
 *                 description: Rating of the hotel (1 to 5)
 *               harga:
 *                 type: number
 *                 example: 500000
 *                 description: Price per night in IDR
 *               fasilitas:
 *                 type: string
 *                 example: "WiFi, Kolam Renang, Spa"
 *                 description: Facilities separated by commas
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Error updating hotel
 */
router.put(
  "/update/:id",
  upload.array("gambar", 5),
  validateHotelData,
  updateHotel
);

// Update data hotel

// route untuk hapus data hotel
/**
 * @swagger
 * /hotel/delete/{id}:
 *   delete:
 *     summary: Delete hotel
 *     description: Delete a hotel by its ID along with the associated image.
 *     tags: [Hotel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the hotel to delete
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Error deleting hotel
 */
router.delete("/delete/:id", deleteHotel); // Hapus hotel

/**
 * @swagger
 * /hotel/getAll:
 *   get:
 *     summary: Get all hotels
 *     description: Retrieve a list of all hotels stored in the database.
 *     tags: [Hotel]
 *     responses:
 *       200:
 *         description: A list of all hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nama:
 *                     type: string
 *                     example: "Hotel Santika"
 *                   alamat:
 *                     type: string
 *                     example: "Jl. Malioboro No.123, Yogyakarta"
 *                   gambar:
 *                     type: string
 *                     example: "/uploads/hotel/123456789.png"
 *                   bintang:
 *                     type: integer
 *                     example: 4
 *                   harga:
 *                     type: number
 *                     example: 500000
 *                   fasilitas:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "WiFi"
 *       500:
 *         description: Error fetching hotels
 */
router.get("/getAll", getAllHotels);

export default router;
