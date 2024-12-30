import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  addBanner,
  updateBanner,
  deleteBanner,
  getAllBanners,
} from "../controllers/bannerController.js";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";
import { validateFileMiddleware } from "../middleware/validateFileMiddleware.js";

const router = express.Router();

// Konfigurasi multer untuk file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/banner";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Gunakan timestamp untuk nama file unik
  },
});
const upload = multer({ storage });

// Swagger Documentation
/**
 * @swagger
 * tags:
 *   - name: Banner
 *     description: API to manage banner images
 */

/**
 * @swagger
 * /banner/add:
 *   post:
 *     summary: Add a new banner
 *     tags: [Banner]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: The banner image to upload (max 2MB, JPG/JPEG/PNG only)
 *     responses:
 *       201:
 *         description: Banner added successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  "/add",
  authMiddleware,
  checkRole("admin"),
  upload.single("gambar"),
  validateFileMiddleware,
  addBanner
);

/**
 * @swagger
 * /banner/update/{id}:
 *   put:
 *     summary: Update an existing banner by ID
 *     tags: [Banner]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the banner to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: The new banner image to upload (max 2MB, JPG/JPEG/PNG only)
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server error
 */
router.put(
  "/update/:id",
  authMiddleware,
  checkRole("admin"),
  upload.single("gambar"),
  validateFileMiddleware,
  updateBanner
);

/**
 * @swagger
 * /banner/delete/{id}:
 *   delete:
 *     summary: Delete a banner by ID
 *     tags: [Banner]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the banner to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server error
 */
router.delete("/delete/:id", authMiddleware, checkRole("admin"), deleteBanner);

/**
 * @swagger
 * /banner/getAll:
 *   get:
 *     summary: Get all banners
 *     tags: [Banner]
 *     responses:
 *       200:
 *         description: Successfully fetched all banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Banner ID
 *                   gambar:
 *                     type: string
 *                     description: Path to the banner image
 *       500:
 *         description: Server error
 */
router.get("/getAll", getAllBanners);

export default router;
