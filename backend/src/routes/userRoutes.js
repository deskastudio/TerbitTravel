// src/routes/userRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  deleteUser,
  getAllUsers,
} from "../controllers/userController.js";
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from "../middleware/validators.js";

const router = express.Router();

// Register user
/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register new user
 *     tags: [User]
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
 *               alamat:
 *                 type: string
 *               noTelp:
 *                 type: string
 *               instansi:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Error registering user
 */
router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  registerUser
);

// Login user
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", validateLogin, handleValidationErrors, loginUser);

// Endpoint untuk menghapus user
/**
 * @swagger
 * /user/user/{userId}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */
router.delete("/user/:userId", deleteUser);

//endpoint untuk mendapatkan seluruh data user
/**
 * @swagger
 * /user/dataUser:
 *   get:
 *     summary: Get all users data
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Error fetching user data
 */
router.get("/dataUser", getAllUsers);
export default router;
