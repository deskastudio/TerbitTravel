import Armada from "../models/armada.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Perbaikan cara mendapatkan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tambah data armada baru
export const addArmada = async (req, res) => {
  const { nama, kapasitas, harga, merek } = req.body;
  const gambarPaths = req.files.map(
    (file) => `uploads/armada/${file.filename}`
  );

  try {
    const newArmada = new Armada({
      nama,
      kapasitas,
      gambar: gambarPaths,
      harga,
      merek,
    });
    await newArmada.save();
    res
      .status(201)
      .json({ message: "Armada berhasil ditambahkan", data: newArmada });
  } catch (error) {
    console.error("Error adding armada:", error);
    res.status(500).json({
      message: "Gagal menambahkan armada",
      error: error.message,
    });
  }
};

// Update data armada yang ada
export const updateArmada = async (req, res) => {
  const { id } = req.params;
  const { nama, kapasitas, harga, merek } = req.body;
  const gambarPaths =
    req.files?.map((file) => `uploads/armada/${file.filename}`) || [];

  try {
    const armada = await Armada.findById(id);
    if (!armada) {
      return res.status(404).json({ message: "Armada tidak ditemukan" });
    }

    // Hapus gambar lama jika ada gambar baru yang diunggah
    if (gambarPaths.length > 0) {
      for (const oldPath of armada.gambar) {
        const oldImagePath = path.join(__dirname, "../../", oldPath);
        try {
          if (fs.existsSync(oldImagePath)) {
            await fs.promises.unlink(oldImagePath);
            console.log(`File lama berhasil dihapus: ${oldImagePath}`);
          }
        } catch (err) {
          console.error(`Gagal menghapus file lama ${oldImagePath}:`, err);
        }
      }
    }

    // Update data armada dengan gambar baru jika ada
    const updatedArmada = await Armada.findByIdAndUpdate(
      id,
      {
        nama: nama || armada.nama,
        kapasitas: kapasitas || armada.kapasitas,
        gambar: gambarPaths.length > 0 ? gambarPaths : armada.gambar,
        harga: harga || armada.harga,
        merek: merek || armada.merek,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Armada berhasil diupdate",
      data: updatedArmada,
    });
  } catch (error) {
    console.error("Error updating armada:", error);
    res.status(500).json({
      message: "Gagal mengupdate armada",
      error: error.message,
    });
  }
};

// Hapus armada berdasarkan ID
export const deleteArmada = async (req, res) => {
  const { id } = req.params;

  try {
    const armada = await Armada.findById(id);
    if (!armada) {
      return res.status(404).json({ message: "Armada tidak ditemukan" });
    }

    // Hapus semua file gambar yang terkait dengan armada ini
    for (const gambarPath of armada.gambar) {
      const filePath = path.join(__dirname, "../../", gambarPath);
      console.log(`Mencoba menghapus file: ${filePath}`);

      try {
        // Verifikasi bahwa path berada dalam direktori uploads
        const uploadsDir = path.join(__dirname, "../../uploads");
        if (!filePath.startsWith(uploadsDir)) {
          console.warn(`Invalid path detected: ${filePath}`);
          continue;
        }

        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
          console.log(`File berhasil dihapus: ${filePath}`);
        } else {
          console.log(`File tidak ditemukan: ${filePath}`);
        }
      } catch (err) {
        console.error(`Gagal menghapus file ${filePath}:`, err);
      }
    }

    // Hapus armada dari database
    await Armada.findByIdAndDelete(id);
    res.status(200).json({ message: "Armada berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting armada:", error);
    res.status(500).json({
      message: "Gagal menghapus armada",
      error: error.message,
    });
  }
};

// Tampilkan semua data armada
export const getAllArmada = async (req, res) => {
  try {
    const armadas = await Armada.find().sort({ createdAt: -1 });
    res.status(200).json(armadas);
  } catch (error) {
    console.error("Error fetching armadas:", error);
    res.status(500).json({
      message: "Gagal mengambil data armada",
      error: error.message,
    });
  }
};
