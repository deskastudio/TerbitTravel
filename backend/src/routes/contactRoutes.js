import express from "express";
import {
  addContact,
  updateContact,
  getContact,
} from "../controllers/contactController.js";
import { validateContactData } from "../middleware/contactValidator.js";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Contact
 *     description: API untuk mengelola data kontak
 */

/**
 * @swagger
 * /contact/add:
 *   post:
 *     summary: Add contact data (Admin only)
 *     description: Add contact data only once. Further actions can only update the existing contact.
 *     tags: [Contact]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instagram:
 *                 type: string
 *                 example: "https://instagram.com/yourprofile"
 *               email:
 *                 type: string
 *                 example: "contact@example.com"
 *               whatsapp:
 *                 type: string
 *                 example: "+628123456789"
 *               youtube:
 *                 type: string
 *                 example: "https://youtube.com/yourchannel"
 *               facebook:
 *                 type: string
 *                 example: "https://facebook.com/yourprofile"
 *               alamat:
 *                 type: string
 *                 example: "Jl. Example No.123, Jakarta"
 *     responses:
 *       201:
 *         description: Contact data added successfully
 *       400:
 *         description: Contact data already exists. Only updates are allowed.
 *       500:
 *         description: Error adding contact data
 */
router.post(
  "/add",
  authMiddleware,
  checkRole("admin"),
  validateContactData,
  addContact
);

/**
 * @swagger
 * /contact/update:
 *   put:
 *     summary: Update contact data (Admin only)
 *     description: Update the existing contact data.
 *     tags: [Contact]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instagram:
 *                 type: string
 *                 example: "https://instagram.com/yourprofile"
 *               email:
 *                 type: string
 *                 example: "contact@example.com"
 *               whatsapp:
 *                 type: string
 *                 example: "+628123456789"
 *               youtube:
 *                 type: string
 *                 example: "https://youtube.com/yourchannel"
 *               facebook:
 *                 type: string
 *                 example: "https://facebook.com/yourprofile"
 *               alamat:
 *                 type: string
 *                 example: "Jl. Example No.123, Jakarta"
 *     responses:
 *       200:
 *         description: Contact data updated successfully
 *       404:
 *         description: No contact data found to update
 *       500:
 *         description: Error updating contact data
 */
router.put(
  "/update",
  authMiddleware,
  checkRole("admin"),
  validateContactData,
  updateContact
);

/**
 * @swagger
 * /contact/get:
 *   get:
 *     summary: Get contact data (Admin only)
 *     description: Retrieve the contact data that has been stored.
 *     tags: [Contact]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved contact data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 instagram:
 *                   type: string
 *                   example: "https://instagram.com/yourprofile"
 *                 email:
 *                   type: string
 *                   example: "contact@example.com"
 *                 whatsapp:
 *                   type: string
 *                   example: "+628123456789"
 *                 youtube:
 *                   type: string
 *                   example: "https://youtube.com/yourchannel"
 *                 facebook:
 *                   type: string
 *                   example: "https://facebook.com/yourprofile"
 *                 alamat:
 *                   type: string
 *                   example: "Jl. Example No.123, Jakarta"
 *       404:
 *         description: No contact data found
 *       500:
 *         description: Error fetching contact data
 */
router.get("/get", authMiddleware, checkRole("admin"), getContact);

export default router;
