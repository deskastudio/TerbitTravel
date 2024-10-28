import fs from "fs";
import path from "path";

// Dapatkan __dirname menggunakan import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Tentukan path file gambar yang ingin diuji
const gambarPath = "uploads/armada/1730079668683.png"; // Path dari database
const filePath = path.join(__dirname, gambarPath); // Gunakan path.join dengan benar

// Tambahkan log untuk debug
console.log(`Current directory: ${__dirname}`); // Log direktori saat ini
console.log(`Image path from database: ${gambarPath}`); // Log path gambar dari database
console.log(`Constructed file path: ${filePath}`); // Log path yang dibangun

// Cek keberadaan file
if (fs.existsSync(filePath)) {
  console.log(`File found: ${filePath}`); // Log bahwa file ditemukan
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err.message}`);
    } else {
      console.log(`File deleted successfully: ${filePath}`);
    }
  });
} else {
  console.log(`File not found: ${filePath}`); // Log bahwa file tidak ditemukan
}
