import express from "express";
import multer from "multer";
import path from "path";
import {
  addArmada,
  updateArmada,
  deleteArmada,
  getAllArmada,
  getArmadaById,
} from "../controllers/armadaController.js";
import { validateArmadaData } from "../middleware/armadaValidator.js";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";
import { parseKapasitas } from "../middleware/parseKapasitas.js";

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/armada");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Armada
 *     description: Endpoint untuk pengelolaan armada (hanya untuk admin)
 */

/**
 * @swagger
 * /armada/add:
 *   post:
 *     summary: Tambah data armada baru
 *     tags: [Armada]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 description: Nama armada
 *                 example: "Armada A"
 *               kapasitas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Kapasitas penumpang
 *
 *               harga:
 *                 type: number
 *                 description: Harga per hari
 *                 example: 200000
 *               merek:
 *                 type: string
 *                 description: Merek armada
 *                 example: "Toyota"
 *               gambar:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Armada berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 *       500:
 *         description: Kesalahan server
 */
router.post(
  "/add",
  authMiddleware,
  checkRole("admin"),
  upload.array("gambar"),
  validateArmadaData,
  parseKapasitas,
  addArmada
);

/**
 * @swagger
 * /armada/update/{id}:
 *   put:
 *     summary: Update data armada
 *     tags: [Armada]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID armada yang akan diupdate
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 description: Nama armada
 *               kapasitas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Kapasitas penumpang
 *               harga:
 *                 type: number
 *                 description: Harga per hari
 *               merek:
 *                 type: string
 *                 description: Merek armada
 *               gambar:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Armada berhasil diupdate
 *       404:
 *         description: Armada tidak ditemukan
 *       500:
 *         description: Kesalahan server
 */
router.put(
  "/update/:id",
  authMiddleware,
  checkRole("admin"),
  upload.array("gambar"),
  validateArmadaData,
  parseKapasitas,
  updateArmada
);

/**
 * @swagger
 * /armada/delete/{id}:
 *   delete:
 *     summary: Hapus data armada
 *     tags: [Armada]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID armada yang akan dihapus
 *     responses:
 *       200:
 *         description: Armada berhasil dihapus
 *       404:
 *         description: Armada tidak ditemukan
 *       500:
 *         description: Kesalahan server
 */
router.delete("/delete/:id", authMiddleware, checkRole("admin"), deleteArmada);

/**
 * @swagger
 * /armada/getAll:
 *   get:
 *     summary: Ambil semua data armada
 *     tags: [Armada]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua armada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID armada
 *                   nama:
 *                     type: string
 *                     description: Nama armada
 *                   kapasitas:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Kapasitas penumpang
 *                   gambar:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Path gambar armada
 *                   harga:
 *                     type: number
 *                     description: Harga per hari
 *                   merek:
 *                     type: string
 *                     description: Merek armada
 *       500:
 *         description: Kesalahan server
 */
router.get("/getAll", authMiddleware, checkRole("admin"), getAllArmada);

/**
 * @swagger
 * /armada/{id}:
 *   get:
 *     summary: Ambil data armada berdasarkan ID
 *     tags: [Armada]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID armada yang akan diambil
 *     responses:
 *       200:
 *         description: Data armada ditemukan
 *       404:
 *         description: Armada tidak ditemukan
 *       500:
 *         description: Kesalahan server
 */
router.get("/:id", authMiddleware, checkRole("admin"), getArmadaById);

export default router;
