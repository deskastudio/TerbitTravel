// src/routes/blogRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  addBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
} from "../controllers/blogController.js";
import { validateBlogData } from "../middleware/blogValidator.js";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";

// Konfigurasi multer untuk menyimpan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/blog/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const router = express.Router();

/**
 * @swagger
 * /blog/add:
 *   post:
 *     summary: Add a new blog post (Admin only)
 *     description: Add a new blog post with title, author, main image, additional images, content, category and hashtags.
 *     tags: [Blog]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               judul:
 *                 type: string
 *                 example: "Amazing Travel Tips"
 *               penulis:
 *                 type: string
 *                 example: "John Doe"
 *               gambarUtama:
 *                 type: string
 *                 format: binary
 *               gambarTambahan:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               isi:
 *                 type: string
 *                 example: "This is the content of the blog post."
 *               kategori:
 *                 type: string
 *                 example: "614c84b0c1b8d8f53e5c3e2b"
 *               hashtags:
 *                 type: string
 *                 example: '["travel", "tips", "vacation"]'
 *     responses:
 *       201:
 *         description: Blog added successfully
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Error adding blog
 */
router.post(
  "/add",
  authMiddleware,
  checkRole("admin"),
  upload.fields([
    { name: "gambarUtama", maxCount: 1 },
    { name: "gambarTambahan", maxCount: 10 },
  ]),
  validateBlogData,
  addBlog
);

/**
 * @swagger
 * /blog/update/{id}:
 *   put:
 *     summary: Update an existing blog post (Admin only)
 *     description: Update a blog post by ID with title, author, main image, additional images, content, category and hashtags.
 *     tags: [Blog]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the blog to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               judul:
 *                 type: string
 *                 example: "Updated Travel Tips"
 *               penulis:
 *                 type: string
 *                 example: "Jane Doe"
 *               gambarUtama:
 *                 type: string
 *                 format: binary
 *               gambarTambahan:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               isi:
 *                 type: string
 *                 example: "Updated content of the blog post."
 *               kategori:
 *                 type: string
 *                 example: "614c84b0c1b8d8f53e5c3e2b"
 *               hashtags:
 *                 type: string
 *                 example: '["updated", "travel", "tips"]'
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       404:
 *         description: Blog not found
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Error updating blog
 */
router.put(
  "/update/:id",
  authMiddleware,
  checkRole("admin"),
  upload.fields([
    { name: "gambarUtama", maxCount: 1 },
    { name: "gambarTambahan", maxCount: 10 },
  ]),
  updateBlog
);

/**
 * @swagger
 * /blog/delete/{id}:
 *   delete:
 *     summary: Delete a blog post (Admin only)
 *     description: Delete a blog post by its ID.
 *     tags: [Blog]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the blog to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Error deleting blog
 */
router.delete("/delete/:id", authMiddleware, checkRole("admin"), deleteBlog);

/**
 * @swagger
 * /blog/get:
 *   get:
 *     summary: Get all blog posts with pagination, search and filtering
 *     description: Retrieve a list of blog posts with pagination, search functionality and category filtering.
 *     tags: [Blog]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: search
 *         in: query
 *         required: false
 *         description: Search term for filtering blogs by title, author, content or hashtags
 *         schema:
 *           type: string
 *       - name: kategori
 *         in: query
 *         required: false
 *         description: Category ID for filtering blogs by category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched blog posts
 *       500:
 *         description: Error fetching blogs
 */
router.get("/get", authMiddleware, getAllBlogs);

/**
 * @swagger
 * /blog/get/{id}:
 *   get:
 *     summary: Get a blog post by ID
 *     description: Retrieve a specific blog post by its ID.
 *     tags: [Blog]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the blog to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog fetched successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Error fetching blog
 */
router.get("/get/:id", authMiddleware, getBlogById);

export default router;