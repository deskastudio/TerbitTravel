import express from "express";
import upload from "../middleware/upload.js";
import {
  addGallery,
  updateGallery,
  deleteGallery,
  getAllGalleries,
  getGalleryById,
} from "../controllers/galleryController.js";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";
import { galleryValidator } from "../middleware/galleryValidator.js";

const router = express.Router();

// Swagger Documentation
/**
 * @swagger
 * tags:
 *   - name: Gallery
 *     description: API to manage galleries
 */

/**
 * @swagger
 * /gallery/add:
 *   post:
 *     summary: Add a new gallery
 *     tags: [Gallery]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               kategori:
 *                 type: string
 *                 description: The ID of the related GalleryCategory
 *               nama:
 *                 type: string
 *                 description: Name of the gallery item
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       201:
 *         description: Gallery added successfully
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
  galleryValidator,
  addGallery
);

/**
 * @swagger
 * /gallery/update/{id}:
 *   put:
 *     summary: Update an existing gallery by ID
 *     tags: [Gallery]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the gallery to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               kategori:
 *                 type: string
 *                 description: The ID of the related GalleryCategory
 *               nama:
 *                 type: string
 *                 description: Name of the gallery item
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: The new image file to upload
 *     responses:
 *       200:
 *         description: Gallery updated successfully
 *       404:
 *         description: Gallery not found
 *       500:
 *         description: Server error
 */
router.put(
  "/update/:id",
  authMiddleware,
  checkRole("admin"),
  upload.single("gambar"),
  galleryValidator,
  updateGallery
);

/**
 * @swagger
 * /gallery/delete/{id}:
 *   delete:
 *     summary: Delete a gallery by ID
 *     tags: [Gallery]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the gallery to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gallery deleted successfully
 *       404:
 *         description: Gallery not found
 *       500:
 *         description: Server error
 */
router.delete("/delete/:id", authMiddleware, checkRole("admin"), deleteGallery);

/**
 * @swagger
 * /gallery/getAll:
 *   get:
 *     summary: Get all galleries
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: Successfully fetched all galleries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   kategori:
 *                     type: string
 *                     description: ID of the related GalleryCategory
 *                   nama:
 *                     type: string
 *                   gambar:
 *                     type: string
 *                     description: Path to the image file
 *       500:
 *         description: Server error
 */
router.get("/getAll", getAllGalleries);

/**
 * @swagger
 * /gallery/{id}:
 *   get:
 *     summary: Get a gallery by ID
 *     tags: [Gallery]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the gallery to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the gallery
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 kategori:
 *                   type: string
 *                   description: ID of the related GalleryCategory
 *                 nama:
 *                   type: string
 *                 gambar:
 *                   type: string
 *                   description: Path to the image file
 *       404:
 *         description: Gallery not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getGalleryById);

export default router;
