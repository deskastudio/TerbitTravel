import express from "express";
import multer from "multer"; // Tambahkan import multer
import fs from "fs";
import path from "path";
import {
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
} from "../controllers/teamController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateTeam } from "../middleware/teamValidator.js";

// Konfigurasi multer untuk team
const teamStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/team";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadTeam = multer({ storage: teamStorage });
const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Team
 *     description: API to manage team members
 */

/**
 * @swagger
 * /team/add:
 *   post:
 *     summary: Add a new team member
 *     tags: [Team]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               description:
 *                 type: string
 *               facebook:
 *                 type: string
 *               email:
 *                 type: string
 *               instagram:
 *                 type: string
 *               linkedin:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Team member added successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  "/add",
  authMiddleware,
  uploadTeam.single("photo"),
  validateTeam,
  addTeamMember
);

/**
 * @swagger
 * /team/update/{id}:
 *   put:
 *     summary: Update an existing team member by ID
 *     tags: [Team]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               description:
 *                 type: string
 *               facebook:
 *                 type: string
 *               email:
 *                 type: string
 *               instagram:
 *                 type: string
 *               linkedin:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Team member updated successfully
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */
router.put(
  "/update/:id",
  authMiddleware,
  uploadTeam.single("photo"),
  validateTeam,
  updateTeamMember
);

/**
 * @swagger
 * /team/delete/{id}:
 *   delete:
 *     summary: Delete a team member by ID
 *     tags: [Team]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team member deleted successfully
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */
router.delete("/delete/:id", authMiddleware, deleteTeamMember);

/**
 * @swagger
 * /team/getAll:
 *   get:
 *     summary: Get all team members
 *     tags: [Team]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all team members
 *       500:
 *         description: Server error
 */
router.get("/getAll", authMiddleware, getAllTeamMembers);

/**
 * @swagger
 * /team/{id}:
 *   get:
 *     summary: Get a team member by ID
 *     tags: [Team]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the team member
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */
router.get("/:id", authMiddleware, getTeamMemberById);

export default router;
