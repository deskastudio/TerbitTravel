import express from "express";
import {
  addPackageCategory,
  updatePackageCategory,
  deletePackageCategory,
  getAllPackageCategories,
  getPackageCategoryById,
} from "../controllers/packageCategoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateCategory } from "../middleware/categoryValidator.js";

const router = express.Router();

/**
 * @swagger
 * /package-category/add:
 *   post:
 *     summary: Add a new package category
 *     tags: [PackageCategory]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the package category
 *                 example: "Premium"
 *     responses:
 *       201:
 *         description: Package category added successfully
 *       500:
 *         description: Failed to add package category
 */
router.post("/add", addPackageCategory);

/**
 * @swagger
 * /package-category/update/{id}:
 *   put:
 *     summary: Update an existing package category
 *     tags: [PackageCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the package category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the package category
 *                 example: "Standard"
 *     responses:
 *       200:
 *         description: Package category updated successfully
 *       404:
 *         description: Package category not found
 *       500:
 *         description: Failed to update package category
 */
router.put(
  "/update/:id",
  updatePackageCategory
);

/**
 * @swagger
 * /package-category/delete/{id}:
 *   delete:
 *     summary: Delete a package category
 *     tags: [PackageCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the package category
 *     responses:
 *       200:
 *         description: Package category deleted successfully
 *       404:
 *         description: Package category not found
 *       500:
 *         description: Failed to delete package category
 */
router.delete("/delete/:id", deletePackageCategory);

/**
 * @swagger
 * /package-category/get:
 *   get:
 *     summary: Get all package categories
 *     tags: [PackageCategory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched package categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the package category
 *                     example: "614d1b2e1c4f2d0d9c19b8c8"
 *                   title:
 *                     type: string
 *                     description: Title of the package category
 *                     example: "Premium"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-08-30T09:30:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-08-31T09:30:00.000Z"
 *       500:
 *         description: Failed to fetch package categories
 */
router.get("/getAll", getAllPackageCategories);

/**
 * @swagger
 * /package-category/{id}:
 *   get:
 *     summary: Get package category by ID
 *     tags: [PackageCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the package category
 *     responses:
 *       200:
 *         description: Successfully fetched package category
 *       404:
 *         description: Package category not found
 *       500:
 *         description: Failed to fetch package category
 */
router.get("/:id", getPackageCategoryById);

export default router;
