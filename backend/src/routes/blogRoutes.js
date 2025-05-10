// src/routes/blogRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  addBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByCategory,
} from "../controllers/blogController.js";
import { validateBlogData } from "../middleware/blogValidator.js";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pastikan direktori upload ada
const uploadDir = path.join(process.cwd(), 'uploads/blog');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi multer untuk menyimpan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"));
  },
});

// Filter file untuk hanya menerima gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

const router = express.Router();

/**
 * @swagger
 * /blog/add:
 *   post:
 *     summary: Add a new blog post (Admin only)
 *     description: Add a new blog post with title, author, main image, additional images, content, category.
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
 *               kategori:
 *                 type: string
 *                 example: "614d1b2e1c4f2d0d9c19b8c8"
 *                 description: ID of the blog category
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
 *     responses:
 *       201:
 *         description: Blog added successfully
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Error adding blog
 */
// Pastikan middleware upload dan validasi terpasang dengan benar
router.post(
  "/add",
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
 *     description: Update a blog post by ID with title, author, main image, additional images, content, and category.
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
 *               kategori:
 *                 type: string
 *                 example: "614d1b2e1c4f2d0d9c19b8c8"
 *                 description: ID of the blog category
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
 *         description: Search term for filtering blogs by title, author, content
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
 *         description: Blogs fetched successfully
 *       500:
 *         description: Error fetching blogs
 */
router.get("/get", getAllBlogs);

/**
 * @swagger
 * /blog/get/{id}:
 *   get:
 *     summary: Get a blog post by ID
 *     description: Retrieve a specific blog post by its ID.
 *     tags: [Blog]
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
router.get("/get/:id", getBlogById);

/**
 * @swagger
 * /blog/category/{categoryId}:
 *   get:
 *     summary: Get all blog posts by category
 *     description: Retrieve a list of all blog posts for a specific category.
 *     tags: [Blog]
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: ID of the category to get blogs for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched blogs by category
 *       500:
 *         description: Error fetching blogs by category
 */
router.get("/category/:categoryId", getBlogsByCategory);

export default router;