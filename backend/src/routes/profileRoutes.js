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

// Konfigurasi multer untuk penyimpanan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/profiles");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   - name: Profile
 *     description: API for managing profiles
 */

// Tambah profil baru
router.post(
  "/add",
  upload.array("gambar", 5),
  validateFiles,
  validateProfileData,
  addProfile
);
/**
 * @swagger
 * /profiles/add:
 *   post:
 *     summary: Add a new profile
 *     description: Add a new profile with name, description, and up to 5 images.
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
 *     description: Retrieve all stored profiles.
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
  validateProfileData,
  updateProfile
);
/**
 * @swagger
 * /profiles/update/{id}:
 *   put:
 *     summary: Update an existing profile
 *     description: Update a profile by its ID with optional new images.
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
 *                 example: "Updated Name"
 *               deskripsi:
 *                 type: string
 *                 example: "Updated Description"
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
 *     description: Delete a profile by its ID.
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
