import express from "express";
import multer from "multer";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";
import { validatePackageData } from "../middleware/packageValidator.js";
import {
  addPackage,
  getAllPackages,
  getPackageById,
  getPackagesByCategory,
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
 *               kategori:
 *                 type: string
 *                 description: Category ID
 *     responses:
 *       201:
 *         description: Package added successfully
 *       400:
 *         description: Invalid data
 */
router.post("/", upload.none(), validatePackageData, addPackage);

/**
 * @swagger
 * /packages:
 *   get:
 *     tags:
 *       - Packages
 *     summary: Get all packages
 *     description: Retrieve all travel packages.
 *     responses:
 *       200:
 *         description: A list of all packages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Package'
 */
router.get("/", getAllPackages);

/**
 * @swagger
 * /packages/{packageId}:
 *   get:
 *     tags:
 *       - Packages
 *     summary: Get a specific package by ID
 *     description: Retrieve details of a specific travel package by its ID.
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         description: The ID of the package to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The package details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 */
router.get("/:packageId", getPackageById);

/**
 * @swagger
 * /packages/category/{categoryId}:
 *   get:
 *     tags:
 *       - Packages
 *     summary: Get packages by category
 *     description: Retrieve packages filtered by category ID.
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: The ID of the category to filter by
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: Maximum number of packages to return
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: excludeId
 *         description: Package ID to exclude from results
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of packages in the category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Package'
 */
router.get("/category/:categoryId", getPackagesByCategory);

/**
 * @swagger
 * /packages/{packageId}:
 *   put:
 *     tags:
 *       - Packages
 *     summary: Update a package by ID
 *     description: Update an existing travel package with new information.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         description: The ID of the package to update
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
 *               kategori:
 *                 type: string
 *                 description: Category ID
 *     responses:
 *       200:
 *         description: Package updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Package not found
 */
router.put("/:packageId", upload.none(), validatePackageData, updatePackage);

/**
 * @swagger
 * /packages/{packageId}:
 *   delete:
 *     tags:
 *       - Packages
 *     summary: Delete a package by ID
 *     description: Delete an existing travel package by its ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         description: The ID of the package to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Package deleted successfully
 *       404:
 *         description: Package not found
 */
router.delete("/:packageId", deletePackage);

export default router;
