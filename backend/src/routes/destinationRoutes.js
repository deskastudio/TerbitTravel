import express from "express";
import multer from "multer";
import {
  addDestination,
  updateDestination,
  deleteDestination,
  getAllDestinations,
} from "../controllers/destinationController.js";
import path from "path";

// Konfigurasi multer untuk menyimpan file gambar di subfolder `uploads/destination`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/destination"); // Menyimpan gambar di subfolder destination
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file dengan timestamp
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/add", upload.array("foto"), addDestination); // Tambah destinasi
// Route untuk menambahkan destinasi
/**
 * @swagger
 * /destination/add:
 *   post:
 *     summary: Add new destination
 *     description: Add a new destination including multiple photos.
 *     tags: [Destination]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Pantai Kuta"
 *               lokasi:
 *                 type: string
 *                 example: "Bali, Indonesia"
 *               deskripsi:
 *                 type: string
 *                 example: "Pantai Kuta adalah salah satu destinasi wisata yang terkenal di Bali."
 *               foto:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Destination added successfully
 *       500:
 *         description: Error adding destination
 */
router.put("/update/:id", upload.array("foto"), updateDestination); // Update destinasi
// Route untuk mengedit destinasi berdasarkan ID
/**
 * @swagger
 * /destination/update/{id}:
 *   put:
 *     summary: Update destination
 *     description: Update an existing destination by its ID.
 *     tags: [Destination]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the destination to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Pantai Kuta"
 *               lokasi:
 *                 type: string
 *                 example: "Bali, Indonesia"
 *               deskripsi:
 *                 type: string
 *                 example: "Pantai Kuta adalah salah satu destinasi wisata yang terkenal di Bali."
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
 *       500:
 *         description: Error updating destination
 */

router.delete("/delete/:id", deleteDestination); // Hapus destinasi
/**
 * @swagger
 * /destination/delete/{id}:
 *   delete:
 *     summary: Delete a destination
 *     description: Delete a destination by its ID. Semua gambar terkait destinasi juga akan dihapus dari server.
 *     tags: [Destination]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the destination to delete
 *     responses:
 *       200:
 *         description: Destination deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Destination deleted successfully"
 *       404:
 *         description: Destination not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Destination not found"
 *       500:
 *         description: Error deleting destination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting destination"
 */
router.get("/getAll", getAllDestinations); // Ambil semua data destinasi
// Route untuk mendapatkan semua destinasi
/**
 * @swagger
 * /destination/getAll:
 *   get:
 *     summary: Get all destinations
 *     description: Retrieve all destinations stored in the database, excluding image data.
 *     tags: [Destination]
 *     responses:
 *       200:
 *         description: A list of all destinations without image data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nama:
 *                     type: string
 *                     example: "Pantai Kuta"
 *                   lokasi:
 *                     type: string
 *                     example: "Bali, Indonesia"
 *                   deskripsi:
 *                     type: string
 *                     example: "Pantai Kuta adalah salah satu destinasi wisata yang terkenal di Bali."
 *       500:
 *         description: Error fetching destinations
 */

export default router;
