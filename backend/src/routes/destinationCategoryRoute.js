import express from "express";
import {
  addDestinationCategory,
  updateDestinationCategory,
  deleteDestinationCategory,
  getAllDestinationCategories,
  getDestinationCategoryById,
} from "../controllers/destinationCategoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateCategory } from "../middleware/categoryValidator.js";

const router = express.Router();

/**
 * @swagger
 * /destination-category/add:
 *   post:
 *     summary: Add a new destination category
 *     tags: [DestinationCategory]
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
 *                 description: Title of the destination category
 *                 example: "Beach"
 *     responses:
 *       201:
 *         description: Destination category added successfully
 *       500:
 *         description: Failed to add destination category
 */
router.post("/add", validateCategory, addDestinationCategory);

/**
 * @swagger
 * /destination-category/update/{id}:
 *   put:
 *     summary: Update an existing destination category
 *     tags: [DestinationCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the destination category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the destination category
 *                 example: "Mountain"
 *     responses:
 *       200:
 *         description: Destination category updated successfully
 *       404:
 *         description: Destination category not found
 *       500:
 *         description: Failed to update destination category
 */
router.put(
  "/update/:id",
  validateCategory,
  updateDestinationCategory
);

/**
 * @swagger
 * /destination-category/delete/{id}:
 *   delete:
 *     summary: Delete a destination category
 *     tags: [DestinationCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the destination category
 *     responses:
 *       200:
 *         description: Destination category deleted successfully
 *       404:
 *         description: Destination category not found
 *       500:
 *         description: Failed to delete destination category
 */
router.delete("/delete/:id", deleteDestinationCategory);

/**
 * @swagger
 * /destination-category/get:
 *   get:
 *     summary: Get all destination categories
 *     tags: [DestinationCategory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched destination categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the destination category
 *                     example: "614d1b2e1c4f2d0d9c19b8c8"
 *                   title:
 *                     type: string
 *                     description: Title of the destination category
 *                     example: "Beach"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-08-30T09:30:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-08-31T09:30:00.000Z"
 *       500:
 *         description: Failed to fetch destination categories
 */
router.get("/get", getAllDestinationCategories);

/**
 * @swagger
 * /destination-category/{id}:
 *   get:
 *     summary: Get destination category by ID
 *     tags: [DestinationCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the destination category
 *     responses:
 *       200:
 *         description: Successfully fetched destination category
 *       404:
 *         description: Destination category not found
 *       500:
 *         description: Failed to fetch destination category
 */
router.get("/:id", getDestinationCategoryById);

export default router;
