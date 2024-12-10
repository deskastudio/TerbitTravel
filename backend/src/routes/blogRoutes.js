// src/routes/blogRoutes.js
import express from "express";
import {
  addBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
} from "../controllers/blogController.js";
import { validateBlogData } from "../middleware/blogValidator.js";
import multer from "multer";

// Konfigurasi multer untuk menyimpan gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/blog/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

// Routes add blog
/**
 * @swagger
 * /blog/add:
 *   post:
 *     summary: Add a new blog post
 *     description: Add a new blog post with title, author, main image, additional images, and content.
 *     tags: [Blog]
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
  upload.fields([
    { name: "gambarUtama", maxCount: 1 },
    { name: "gambarTambahan", maxCount: 10 },
  ]),
  validateBlogData,
  addBlog
);

//route update blog
/**
 * @swagger
 * /blog/update/{id}:
 *   put:
 *     summary: Update an existing blog post
 *     description: Update a blog post by ID with title, author, main image, additional images, and content.
 *     tags: [Blog]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the blog to update
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
  upload.fields([
    { name: "gambarUtama", maxCount: 1 },
    { name: "gambarTambahan", maxCount: 10 },
  ]),
  validateBlogData,
  updateBlog
);

// route delete blog
/**
 * @swagger
 * /blog/delete/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     description: Delete a blog post by its ID.
 *     tags: [Blog]
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
router.delete("/delete/:id", deleteBlog);

//route get all blogs
/**
 * @swagger
 * /blog/get:
 *   get:
 *     summary: Get all blog posts
 *     description: Retrieve a list of all blog posts.
 *     tags: [Blog]
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

router.get("/get", getAllBlogs);

export default router;
