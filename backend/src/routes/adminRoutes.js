import express from "express";
import multer from "multer";
import path from "path";
import {
  loginAdmin,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins,
  getAdminById,
} from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/admin");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Menggunakan timestamp untuk nama file unik
  },
});

const upload = multer({ storage });
const router = express.Router();

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "dimas@gmail.com"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", loginAdmin);

/**
 * @swagger
 * /admin/add:
 *   post:
 *     summary: Add a new admin
 *     tags: [Admin]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *               alamat:
 *                 type: string
 *               noTelepon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin added successfully
 *       500:
 *         description: Error adding admin
 */
router.post("/add", upload.single("foto"), addAdmin);

/**
 * @swagger
 * /admin/update/{id}:
 *   put:
 *     summary: Update admin details
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Admin ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *               alamat:
 *                 type: string
 *               noTelepon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error updating admin
 */
router.put("/update/:id", upload.single("foto"), updateAdmin);

/**
 * @swagger
 * /admin/delete/{id}:
 *   delete:
 *     summary: Delete admin by ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Admin ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error deleting admin
 */
router.delete("/delete/:id", authMiddleware, deleteAdmin);

/**
 * @swagger
 * /admin/data:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nama:
 *                     type: string
 *                   email:
 *                     type: string
 *                   foto:
 *                     type: string
 *                   alamat:
 *                     type: string
 *                   noTelepon:
 *                     type: string
 *       500:
 *         description: Error fetching admin data
 */
router.get("/data", authMiddleware, getAllAdmins);

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Get admin by ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Admin ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched admin by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nama:
 *                   type: string
 *                 email:
 *                   type: string
 *                 foto:
 *                   type: string
 *                 alamat:
 *                   type: string
 *                 noTelepon:
 *                   type: string
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error fetching admin by ID
 */
router.get("/:id", authMiddleware, getAdminById);

export default router;
