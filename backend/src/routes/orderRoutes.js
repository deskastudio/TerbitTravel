import express from "express";
import multer from "multer";
import {
  addOrderByUser,
  addOrderByAdmin,
  getAllOrders,
  getOrderById,
  deleteOrder,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateOrderInput } from "../middleware/orderValidator.js";

const router = express.Router();

// Konfigurasi Multer untuk handling multipart/form-data
const upload = multer();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - packageId
 *         - armadaId
 *         - jumlahPeserta
 *         - nomorIdentitas
 *       properties:
 *         userId:
 *           type: string
 *           description: ID dari user yang memesan
 *         packageId:
 *           type: string
 *           description: ID dari paket wisata yang dipilih
 *         armadaId:
 *           type: string
 *           description: ID dari armada yang dipilih
 *         jumlahPeserta:
 *           type: integer
 *           description: Jumlah peserta dalam pemesanan
 *         nomorIdentitas:
 *           type: string
 *           description: Nomor identitas pemesan (KTP/SIM/Passport)
 *         status:
 *           type: string
 *           description: Status pemesanan
 *           enum: [pending, confirmed, cancelled, completed]
 *         harga:
 *           type: number
 *           description: Total harga pemesanan
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API untuk manajemen pemesanan
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Membuat pemesanan baru oleh user
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               packageId:
 *                 type: string
 *               armadaId:
 *                 type: string
 *               jumlahPeserta:
 *                 type: integer
 *               nomorIdentitas:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pemesanan berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully.
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  authMiddleware,
  upload.none(),
  validateOrderInput,
  addOrderByUser
);

/**
 * @swagger
 * /orders/admin:
 *   post:
 *     summary: Membuat pemesanan baru oleh admin
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               packageId:
 *                 type: string
 *               armadaId:
 *                 type: string
 *               jumlahPeserta:
 *                 type: integer
 *               nomorIdentitas:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pemesanan berhasil dibuat oleh admin
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */
router.post(
  "/admin",
  authMiddleware,
  upload.none(),
  validateOrderInput,
  addOrderByAdmin
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Mendapatkan semua data pemesanan
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua pemesanan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Mendapatkan detail pemesanan berdasarkan ID
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID pemesanan
 *     responses:
 *       200:
 *         description: Detail pemesanan ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Pemesanan tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get("/:id", authMiddleware, getOrderById);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Menghapus pemesanan berdasarkan ID
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID pemesanan yang akan dihapus
 *     responses:
 *       200:
 *         description: Pemesanan berhasil dihapus
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Pemesanan tidak ditemukan
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
