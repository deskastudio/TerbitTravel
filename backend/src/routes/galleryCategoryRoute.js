import express from "express";
import {
  addGalleryCategory,
  updateGalleryCategory,
  deleteGalleryCategory,
  getAllGalleryCategories,
  getGalleryCategoryById,
} from "../controllers/galleryCategoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateCategory } from "../middleware/categoryValidator.js";

const router = express.Router();

/**
 * @swagger
 * /gallery-category/add:
 *   post:
 *     summary: Add a new gallery category
 *     tags: [GalleryCategory]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:  # Mengubah ini untuk menggunakan application/json
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the gallery category
 *                 example: "Nature"
 *     responses:
 *       201:
 *         description: Gallery category added successfully
 *       500:
 *         description: Failed to add gallery category
 */
router.post("/add", authMiddleware, validateCategory, addGalleryCategory);

/**
 * @swagger
 * /gallery-category/update/{id}:
 *   put:
 *     summary: Update an existing gallery category
 *     tags: [GalleryCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the gallery category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:  # Mengubah ini untuk menggunakan application/json
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the gallery category
 *                 example: "Wildlife"
 *     responses:
 *       200:
 *         description: Gallery category updated successfully
 *       404:
 *         description: Gallery category not found
 *       500:
 *         description: Failed to update gallery category
 */
router.put(
  "/update/:id",
  authMiddleware,
  validateCategory,
  updateGalleryCategory
);

/**
 * @swagger
 * /gallery-category/delete/{id}:
 *   delete:
 *     summary: Delete a gallery category
 *     tags: [GalleryCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the gallery category
 *     responses:
 *       200:
 *         description: Gallery category deleted successfully
 *       404:
 *         description: Gallery category not found
 *       500:
 *         description: Failed to delete gallery category
 */
router.delete("/delete/:id", authMiddleware, deleteGalleryCategory);

/**
 * @swagger
 * /gallery-category/get:
 *   get:
 *     summary: Get all gallery categories
 *     tags: [GalleryCategory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched gallery categories
 *         content:
 *           application/json:  # Menambahkan content type application/json
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the gallery category
 *                     example: "614d1b2e1c4f2d0d9c19b8c8"
 *                   title:
 *                     type: string
 *                     description: Title of the gallery category
 *                     example: "Nature"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-08-30T09:30:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-08-31T09:30:00.000Z"
 *       500:
 *         description: Failed to fetch gallery categories
 */
router.get("/get", authMiddleware, getAllGalleryCategories);

/**
 * @swagger
 * /gallery-category/{id}:
 *   get:
 *     summary: Get gallery category by ID
 *     tags: [GalleryCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the gallery category
 *     responses:
 *       200:
 *         description: Successfully fetched gallery category
 *       404:
 *         description: Gallery category not found
 *       500:
 *         description: Failed to fetch gallery category
 */
router.get("/:id", authMiddleware, getGalleryCategoryById);

export default router;
