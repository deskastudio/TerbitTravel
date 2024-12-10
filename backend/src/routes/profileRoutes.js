import express from "express";
import multer from "multer";
import {
  addProfile,
  getAllProfiles,
  updateProfile,
  deleteProfile,
} from "../controllers/profileController.js";
import {
  validateProfileData,
  validateFiles,
} from "../middleware/profileValidator.js";

const router = express.Router();

// Konfigurasi multer untuk multiple files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/profiles"); // Folder penyimpanan
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Nama file unik
  },
});
const upload = multer({ storage });

// Tambah profil baru
router.post(
  "/add",
  upload.array("gambar", 5),
  validateFiles, // Middleware untuk validasi file
  validateProfileData, // Middleware untuk validasi nama dan deskripsi
  addProfile
);
/**
 * @swagger
 * /profiles/add:
 *   post:
 *     summary: Add a new profile
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "John Doe"
 *               deskripsi:
 *                 type: string
 *                 example: "Software Engineer and Content Creator"
 *               gambar:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Failed to create profile
 */

// Ambil semua profil
router.get("/", getAllProfiles);
/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get all profiles
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Successfully fetched profiles
 *       500:
 *         description: Failed to fetch profiles
 */

// Perbarui profil
router.put(
  "/update/:id",
  upload.array("gambar", 5),
  validateProfileData, // Middleware untuk validasi nama dan deskripsi
  updateProfile
);
/**
 * @swagger
 * /profiles/update/{id}:
 *   put:
 *     summary: Update an existing profile
 *     tags: [Profile]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "John Updated"
 *               deskripsi:
 *                 type: string
 *                 example: "Updated description"
 *               gambar:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Failed to update profile
 */

// Hapus profil
router.delete("/delete/:id", deleteProfile);
/**
 * @swagger
 * /profiles/delete/{id}:
 *   delete:
 *     summary: Delete a profile
 *     tags: [Profile]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Failed to delete profile
 */

export default router;
