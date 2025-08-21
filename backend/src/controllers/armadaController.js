import Armada from "../models/armada.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tambah Armada
export const addArmada = async (req, res) => {
  const { nama, kapasitas, harga, merek } = req.body;

  // Pastikan kapasitas menjadi array string jika berupa string yang dipisahkan koma
  const kapasitasArray = Array.isArray(kapasitas)
    ? kapasitas
    : kapasitas.split(",").map((item) => item.trim());

  const gambarPaths = req.files.map(
    (file) => `uploads/armada/${file.filename}`
  );

  try {
    const newArmada = new Armada({
      nama,
      kapasitas: kapasitasArray, // Simpan kapasitas dalam bentuk array string
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
    res
      .status(500)
      .json({ message: "Gagal menambahkan armada", error: error.message });
  }
};

// Update Armada
export const updateArmada = async (req, res) => {
  const { id } = req.params;
  const { nama, kapasitas, harga, merek } = req.body;
  const gambarPaths = req.files?.map((file) => `uploads/armada/${file.filename}`) || [];


  try {
    const armada = await Armada.findById(id);
    if (!armada) {
      return res.status(404).json({ message: "Armada tidak ditemukan" });
    }

    let updatedGambar = armada.gambar;
    if (gambarPaths.length > 0) {
      // Hapus gambar lama jika ada gambar baru
      for (const oldPath of armada.gambar) {
        const oldImagePath = path.join(__dirname, "../../", oldPath);
        try {
          if (fs.existsSync(oldImagePath)) {
            await fs.promises.unlink(oldImagePath);
          }
        } catch (err) {
          console.error(`Gagal menghapus file lama ${oldImagePath}:`, err);
        }
      }
      updatedGambar = gambarPaths;
    }

    const updatedArmada = await Armada.findByIdAndUpdate(
      id,
      {
        nama: nama || armada.nama,
        harga: harga || armada.harga,
        merek: merek || armada.merek,
        gambar: updatedGambar
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Armada berhasil diupdate", data: updatedArmada });
  } catch (error) {
    console.error("Error updating armada:", error);
    res
      .status(500)
      .json({ message: "Gagal mengupdate armada", error: error.message });
  }
};

// Hapus Armada
export const deleteArmada = async (req, res) => {
  const { id } = req.params;

  try {
    const armada = await Armada.findById(id);
    if (!armada) {
      return res.status(404).json({ message: "Armada tidak ditemukan" });
    }

    // Hapus file gambar jika ada
    for (const gambarPath of armada.gambar) {
      const filePath = path.join(__dirname, "../../", gambarPath);
      try {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      } catch (err) {
        console.error(`Gagal menghapus file ${filePath}:`, err);
      }
    }

    await Armada.findByIdAndDelete(id);
    res.status(200).json({ message: "Armada berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting armada:", error);
    res
      .status(500)
      .json({ message: "Gagal menghapus armada", error: error.message });
  }
};

// Ambil Semua Armada
export const getAllArmada = async (req, res) => {
  try {
    const armadas = await Armada.find().sort({ createdAt: -1 });
    res.status(200).json(armadas);
  } catch (error) {
    console.error("Error fetching armadas:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data armada", error: error.message });
  }
};

// Ambil Armada Berdasarkan ID
export const getArmadaById = async (req, res) => {
  const { id } = req.params;

  try {
    const armada = await Armada.findById(id);
    if (!armada) {
      return res.status(404).json({ message: "Armada tidak ditemukan" });
    }

    res.status(200).json(armada);
  } catch (error) {
    console.error("Error fetching armada by ID:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data armada", error: error.message });
  }
};
