// src/routes/blogRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  addBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById, // Import fungsi baru untuk mendapatkan blog berdasarkan ID
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
 *     description: Add a new blog post with title, author, main image, additional images, and content.
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
 *     description: Update a blog post by ID with title, author, main image, additional images, and content.
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
  validateBlogData,
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
 *     summary: Get all blog posts (Accessible by logged-in users)
 *     description: Retrieve a list of all blog posts.
 *     tags: [Blog]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     responses:
 *       200:
 *         description: Successfully fetched all blog posts
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
 *                   judul:
 *                     type: string
 *                     example: "Amazing Travel Tips"
 *                   penulis:
 *                     type: string
 *                     example: "John Doe"
 *                   gambarUtama:
 *                     type: string
 *                     example: "/uploads/blog/main_image.jpg"
 *                   gambarTambahan:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "/uploads/blog/additional_image1.jpg"
 *                   isi:
 *                     type: string
 *                     example: "This is the content of the blog post."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-08-30T09:30:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-08-31T09:30:00.000Z"
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
