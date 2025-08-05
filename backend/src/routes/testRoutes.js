// Test endpoint untuk memastikan static files berfungsi
import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

// Test endpoint untuk melihat file yang tersedia
router.get("/test-images", (req, res) => {
  try {
    const uploadsPath = path.join(process.cwd(), "uploads", "destination");

    if (!fs.existsSync(uploadsPath)) {
      return res.json({
        message: "Upload directory tidak ditemukan",
        path: uploadsPath,
      });
    }

    const files = fs.readdirSync(uploadsPath);

    res.json({
      message: "Files di direktori uploads/destination:",
      path: uploadsPath,
      files: files,
      totalFiles: files.length,
      sampleUrls: files
        .slice(0, 3)
        .map((file) => `/uploads/destination/${file}`),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error reading directory",
      error: error.message,
    });
  }
});

// Test specific image
router.get("/test-image/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(
      process.cwd(),
      "uploads",
      "destination",
      filename
    );

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        message: "File tidak ditemukan",
        path: imagePath,
      });
    }

    const stats = fs.statSync(imagePath);
    res.json({
      message: "File ditemukan",
      path: imagePath,
      size: stats.size,
      url: `/uploads/destination/${filename}`,
      fullUrl: `${req.protocol}://${req.get(
        "host"
      )}/uploads/destination/${filename}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error checking file",
      error: error.message,
    });
  }
});

export default router;
