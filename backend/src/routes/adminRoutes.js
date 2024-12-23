// src/routes/adminRoutes.js
import express from "express";
import {
  loginAdmin,
  addAdmin,
  getAllAdmins,
  deleteAdmin,
} from "../controllers/adminController.js";
import {
  validateLogin,
  handleValidationErrors,
} from "../middleware/validators.js";

const router = express.Router();

// Login admin
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
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", validateLogin, handleValidationErrors, loginAdmin);

// Endpoint untuk menambah admin
/**
 * @swagger
 * /admin/add:
 *   post:
 *     summary: Add new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin added successfully
 *       500:
 *         description: Error adding admin
 */
router.post("/add", addAdmin);

// Endpoint untuk menghapus admin
/**
 * @swagger
 * /admin/admin/{adminId}:
 *   delete:
 *     summary: Delete admin by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the admin to delete
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error deleting admin
 */
router.delete("/admin/:adminId", deleteAdmin);

// Endpoint untuk mendapatkan semua admin
/**
 * @swagger
 * /admin/dataAdmin:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
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
 *       500:
 *         description: Error fetching admin data
 */
router.get("/dataAdmin", getAllAdmins);

export default router;
