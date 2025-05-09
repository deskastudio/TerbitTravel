// src/routes/categoryRoutes.js
import express from "express";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
} from "../controllers/blogCategoryController.js";
import { body, validationResult } from "express-validator";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Validator untuk data kategori
const validateCategoryData = [
  body("nama").notEmpty().withMessage("Nama kategori wajib diisi"),
  body("deskripsi").notEmpty().withMessage("Deskripsi kategori wajib diisi"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * @swagger
 * /category/add:
 *   post:
 *     summary: Tambah kategori baru (Admin only)
 *     description: Menambahkan kategori baru dengan nama dan deskripsi.
 *     tags: [Category]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Pantai"
 *               deskripsi:
 *                 type: string
 *                 example: "Destinasi pantai terbaik di Indonesia"
 *     responses:
 *       201:
 *         description: Kategori berhasil ditambahkan
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Gagal menambahkan kategori
 */
router.post(
  "/add",
  authMiddleware,
  checkRole("admin"),
  validateCategoryData,
  addCategory
);

/**
 * @swagger
 * /category/update/{id}:
 *   put:
 *     summary: Update kategori (Admin only)
 *     description: Mengupdate kategori berdasarkan ID.
 *     tags: [Category]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID kategori yang akan diupdate
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Pantai"
 *               deskripsi:
 *                 type: string
 *                 example: "Destinasi pantai terbaik di Indonesia"
 *     responses:
 *       200:
 *         description: Kategori berhasil diupdate
 *       404:
 *         description: Kategori tidak ditemukan
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Gagal mengupdate kategori
 */
router.put(
  "/update/:id",
  authMiddleware,
  checkRole("admin"),
  validateCategoryData,
  updateCategory
);

/**
 * @swagger
 * /category/delete/{id}:
 *   delete:
 *     summary: Hapus kategori (Admin only)
 *     description: Menghapus kategori berdasarkan ID.
 *     tags: [Category]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID kategori yang akan dihapus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 *       404:
 *         description: Kategori tidak ditemukan
 *       500:
 *         description: Gagal menghapus kategori
 */
router.delete(
  "/delete/:id",
  authMiddleware,
  checkRole("admin"),
  deleteCategory
);

/**
 * @swagger
 * /category/get:
 *   get:
 *     summary: Dapatkan semua kategori
 *     description: Mengambil daftar semua kategori.
 *     tags: [Category]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua kategori
 *       500:
 *         description: Gagal mengambil kategori
 */
router.get("/get", authMiddleware, getAllCategories);

/**
 * @swagger
 * /category/get/{id}:
 *   get:
 *     summary: Dapatkan kategori berdasarkan ID
 *     description: Mengambil detail kategori berdasarkan ID.
 *     tags: [Category]
 *     security:
 *       - BearerAuth: [] # Token is required
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID kategori yang akan diambil
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mengambil kategori
 *       404:
 *         description: Kategori tidak ditemukan
 *       500:
 *         description: Gagal mengambil kategori
 */
router.get("/get/:id", authMiddleware, getCategoryById);

export default router;