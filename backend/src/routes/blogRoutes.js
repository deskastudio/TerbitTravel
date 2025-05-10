// src/routes/blogRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  addBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByCategory,
} from "../controllers/blogController.js";
import { validateBlogData } from "../middleware/blogValidator.js";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pastikan direktori upload ada
const uploadDir = path.join(process.cwd(), 'uploads/blog');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi multer untuk menyimpan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"));
  },
});

// Filter file untuk hanya menerima gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

const router = express.Router();

// Handle Multer errors
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: "File terlalu besar, maksimal 5MB",
        error: err.message 
      });
    }
    return res.status(400).json({ 
      message: "Error saat upload file", 
      error: err.message 
    });
  } else if (err) {
    return res.status(400).json({ 
      message: "Tipe file tidak didukung", 
      error: err.message 
    });
  }
  next();
};

// Route untuk menambahkan blog
router.post(
  "/add",
  upload.fields([
    { name: "gambarUtama", maxCount: 1 },
    { name: "gambarTambahan", maxCount: 10 },
  ]),
  handleMulterErrors,
  validateBlogData,
  (req, res, next) => {
    console.log("Validasi berhasil, lanjut ke controller");
    next();
  },
  addBlog
);

// Route untuk update blog
router.put(
  "/update/:id",
  upload.fields([
    { name: "gambarUtama", maxCount: 1 },
    { name: "gambarTambahan", maxCount: 10 },
  ]),
  handleMulterErrors,
  updateBlog
);

// Route lainnya tetap sama
router.delete("/delete/:id", authMiddleware, checkRole("admin"), deleteBlog);
router.get("/get", getAllBlogs);
router.get("/get/:id", getBlogById);
router.get("/category/:categoryId", getBlogsByCategory);

export default router;