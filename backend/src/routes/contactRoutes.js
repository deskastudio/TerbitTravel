import express from "express";
import {
  addContact,
  updateContact,
  getContact,
} from "../controllers/contactController.js";
import { validateContactData } from "../middleware/contactValidator.js"; // Hanya impor `validateContactData`

const router = express.Router();

// Route untuk menambahkan data kontak (hanya bisa dilakukan sekali)
/**
 * @swagger
 * /contact/add:
 *   post:
 *     summary: Add contact data
 *     description: Add contact data only once. Further actions can only update the existing contact.
 *     tags: [Contact]
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
router.post("/add", validateContactData, addContact);

// Route untuk mengedit data kontak yang sudah ada
/**
 * @swagger
 * /contact/update:
 *   put:
 *     summary: Update contact data
 *     description: Update the existing contact data.
 *     tags: [Contact]
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
router.put("/update", validateContactData, updateContact);

// Route untuk mendapatkan data kontak yang sudah ada
/**
 * @swagger
 * /contact/get:
 *   get:
 *     summary: Get contact data
 *     description: Retrieve the contact data that has been stored.
 *     tags: [Contact]
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
router.get("/get", getContact);

export default router;
