import multer from "multer";
import path from "path";
import fs from "fs";

// Konfigurasi multer untuk file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tentukan folder berdasarkan kondisi atau parameter dalam request
    let dir = "./uploads/gallery"; // Default ke gallery
    if (req.body.uploadType === "team") {
      // Misalnya menggunakan body untuk menentukan tipe upload
      dir = "./uploads/team";
    }

    // Pastikan folder ada
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Gunakan timestamp untuk nama file unik
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;
