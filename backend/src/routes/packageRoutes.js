import express from "express";
import multer from "multer";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";
import { validatePackageData } from "../middleware/packageValidator.js";
import {
  addPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";

const router = express.Router();
const upload = multer(); // Middleware untuk menangani multipart form-data

/**
 * @swagger
 * /packages:
 *   post:
 *     tags:
 *       - Packages
 *     summary: Add a new package
 *     description: Add a new travel package with detailed information.
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
 *                 description: Name of the package
 *               deskripsi:
 *                 type: string
 *                 description: Description of the package
 *               include:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Items included in the package
 *               exclude:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Items excluded from the package
 *               harga:
 *                 type: number
 *                 description: Price of the package
 *               status:
 *                 type: string
 *                 enum: [available, sold out]
 *                 description: Status of the package
 *               durasi:
 *                 type: string
 *                 description: Duration of the package
 *               jadwal:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     tanggalAwal:
 *                       type: string
 *                       format: date
 *                       description: Start date of the schedule
 *                     tanggalAkhir:
 *                       type: string
 *                       format: date
 *                       description: End date of the schedule
 *                     status:
 *                       type: string
 *                       enum: [tersedia, tidak tersedia]
 *                       description: Status of the schedule
 *               destination:
 *                 type: string
 *                 description: Destination ID
 *               hotel:
 *                 type: string
 *                 description: Hotel ID
 *               armada:
 *                 type: string
 *                 description: Armada ID
 *               consume:
 *                 type: string
 *                 description: Consumption ID
 *     responses:
 *       201:
 *         description: Package added successfully
 *       400:
 *         description: Invalid data
 */
router.post(
  "/",
  authMiddleware,
  upload.none(),
  validatePackageData,
  addPackage
);

/**
 * @swagger
 * /packages:
 *   get:
 *     tags:
 *       - Packages
 *     summary: Get all packages
 *     description: Retrieve a list of all travel packages.
 *     responses:
 *       200:
 *         description: List of travel packages
 */
router.get("/", getAllPackages);

/**
 * @swagger
 * /packages/{packageId}:
 *   get:
 *     tags:
 *       - Packages
 *     summary: Get a package by ID
 *     description: Retrieve a specific travel package by its ID.
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package found
 *       404:
 *         description: Package not found
 */
router.get("/:packageId", getPackageById);

/**
 * @swagger
 * /packages/{packageId}:
 *   put:
 *     tags:
 *       - Packages
 *     summary: Update a package by ID
 *     description: Update a travel package with new data.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the package to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 description: Name of the package
 *               deskripsi:
 *                 type: string
 *                 description: Description of the package
 *               include:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Items included in the package
 *               exclude:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Items excluded from the package
 *               harga:
 *                 type: number
 *                 description: Price of the package
 *               status:
 *                 type: string
 *                 enum: [available, sold out]
 *                 description: Status of the package
 *               durasi:
 *                 type: string
 *                 description: Duration of the package
 *               jadwal:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     tanggalAwal:
 *                       type: string
 *                       format: date
 *                       description: Start date of the schedule
 *                     tanggalAkhir:
 *                       type: string
 *                       format: date
 *                       description: End date of the schedule
 *                     status:
 *                       type: string
 *                       enum: [tersedia, tidak tersedia]
 *                       description: Status of the schedule
 *               destination:
 *                 type: string
 *                 description: Destination ID
 *               hotel:
 *                 type: string
 *                 description: Hotel ID
 *               armada:
 *                 type: string
 *                 description: Armada ID
 *               consume:
 *                 type: string
 *                 description: Consumption ID
 *     responses:
 *       200:
 *         description: Package updated successfully
 *       404:
 *         description: Package not found
 */
router.put(
  "/:packageId",
  authMiddleware,
  checkRole("admin"),
  upload.none(),
  validatePackageData,
  updatePackage
);

/**
 * @swagger
 * /packages/{packageId}:
 *   delete:
 *     tags:
 *       - Packages
 *     summary: Delete a package by ID
 *     description: Delete a travel package by its ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package deleted successfully
 *       404:
 *         description: Package not found
 */
router.delete("/:packageId", authMiddleware, checkRole("admin"), deletePackage);

export default router;
