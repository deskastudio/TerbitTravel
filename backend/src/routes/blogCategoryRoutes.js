// src/routes/blogRoutesCategory.js
import express from "express";
import {
  addBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getAllBlogCategories,
  getBlogCategoryById,
} from "../controllers/blogCategoryController.js";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /blog-category/add:
 *   post:
 *     summary: Add a new blog category (Admin only)
 *     description: Add a new blog category with title
 *     tags: [Blog Category]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Travel"
 *     responses:
 *       201:
 *         description: Blog category added successfully
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Error adding blog category
 */
router.post("/add", authMiddleware, checkRole("admin"), addBlogCategory);

/**
 * @swagger
 * /blog-category/update/{id}:
 *   put:
 *     summary: Update an existing blog category (Admin only)
 *     description: Update a blog category by ID with new title
 *     tags: [Blog Category]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the blog category to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Travel"
 *     responses:
 *       200:
 *         description: Blog category updated successfully
 *       404:
 *         description: Blog category not found
 *       500:
 *         description: Error updating blog category
 */
router.put(
  "/update/:id",
  authMiddleware,
  checkRole("admin"),
  updateBlogCategory
);

/**
 * @swagger
 * /blog-category/delete/{id}:
 *   delete:
 *     summary: Delete a blog category (Admin only)
 *     description: Delete a blog category by its ID
 *     tags: [Blog Category]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the blog category to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog category deleted successfully
 *       404:
 *         description: Blog category not found
 *       500:
 *         description: Error deleting blog category
 */
router.delete(
  "/delete/:id",
  authMiddleware,
  checkRole("admin"),
  deleteBlogCategory
);

/**
 * @swagger
 * /blog-category/get:
 *   get:
 *     summary: Get all blog categories
 *     description: Retrieve a list of all blog categories
 *     tags: [Blog Category]
 *     responses:
 *       200:
 *         description: Successfully fetched all blog categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "614d1b2e1c4f2d0d9c19b8c8"
 *                   title:
 *                     type: string
 *                     example: "Travel"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-08-30T09:30:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-08-31T09:30:00.000Z"
 *       500:
 *         description: Error fetching blog categories
 */
router.get("/get", getAllBlogCategories);

/**
 * @swagger
 * /blog-category/get/{id}:
 *   get:
 *     summary: Get a blog category by ID
 *     description: Retrieve a specific blog category by its ID
 *     tags: [Blog Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the blog category to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog category fetched successfully
 *       404:
 *         description: Blog category not found
 *       500:
 *         description: Error fetching blog category
 */
router.get("/get/:id", getBlogCategoryById);

export default router;