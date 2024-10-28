import express from "express";
import multer from "multer";
import {
  addArmada,
  updateArmada,
  deleteArmada,
  getAllArmada,
} from "../controllers/armadaController.js";
import { validateArmadaData } from "../middleware/armadaValidator.js";
import path from "path";

// Konfigurasi multer untuk menyimpan file gambar di subfolder `uploads/armada`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/armada");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const router = express.Router();
/**
 * @swagger
 * /armada/add:
 *   post:
 *     summary: Add a new armada with multiple images
 *     description: Add a new armada including multiple images, capacity, price, and brand.
 *     tags: [Armada]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Armada X"
 *               kapasitas:
 *                 type: number
 *                 example: 50
 *               gambar:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               harga:
 *                 type: number
 *                 example: 1500000
 *               merek:
 *                 type: string
 *                 example: "Merek A"
 *     responses:
 *       201:
 *         description: Armada added successfully
 *       400:
 *         description: Bad request, validation error
 *       500:
 *         description: Error adding armada
 */
router.post("/add", upload.array("gambar"), validateArmadaData, addArmada);

/**
 * @swagger
 * /armada/update/{id}:
 *   put:
 *     summary: Update armada information with multiple images
 *     description: Update an existing armada including multiple images, capacity, price, and brand.
 *     tags: [Armada]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the armada to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               kapasitas:
 *                 type: number
 *               gambar:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               harga:
 *                 type: number
 *               merek:
 *                 type: string
 *     responses:
 *       200:
 *         description: Armada updated successfully
 *       404:
 *         description: Armada not found
 *       500:
 *         description: Error updating armada
 */
router.put(
  "/update/:id",
  upload.array("gambar"),
  validateArmadaData,
  updateArmada
);

/**
 * @swagger
 * /armada/delete/{id}:
 *   delete:
 *     summary: Delete armada
 *     description: Delete an armada by its ID along with the associated images.
 *     tags: [Armada]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the armada to delete
 *     responses:
 *       200:
 *         description: Armada deleted successfully
 *       404:
 *         description: Armada not found
 *       500:
 *         description: Error deleting armada
 */
router.delete("/delete/:id", deleteArmada);

/**
 * @swagger
 * /armada/getAll:
 *   get:
 *     summary: Get all armadas
 *     description: Retrieve a list of all armadas stored in the database.
 *     tags: [Armada]
 *     responses:
 *       200:
 *         description: A list of all armadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nama:
 *                     type: string
 *                   kapasitas:
 *                     type: number
 *                   gambar:
 *                     type: array
 *                     items:
 *                       type: string
 *                   harga:
 *                     type: number
 *                   merek:
 *                     type: string
 *       500:
 *         description: Error fetching armadas
 */
router.get("/getAll", getAllArmada);

export default router;
