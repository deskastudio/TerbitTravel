import fs from "fs";
import Gallery from "../models/gallery.js";

// Add new gallery
export const addGallery = async (req, res) => {
  try {
    const { nama, kategori } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Gambar harus diupload" });
    }

    const newGallery = new Gallery({
      nama,
      kategori,
      gambar: file.path,
    });

    await newGallery.save();

    res.status(201).json({
      message: "Gallery berhasil ditambahkan",
      data: newGallery,
    });
  } catch (error) {
    console.error("Error menambah gallery:", error);
    res.status(500).json({
      message: "Gagal menambah gallery",
      error: error.message,
    });
  }
};

// Update gallery
export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, kategori } = req.body;
    const file = req.file;

    const existingGallery = await Gallery.findById(id);
    if (!existingGallery) {
      return res.status(404).json({ message: "Gallery tidak ditemukan" });
    }

    if (file && fs.existsSync(existingGallery.gambar)) {
      fs.unlinkSync(existingGallery.gambar);
      existingGallery.gambar = file.path;
    }

    existingGallery.nama = nama;
    existingGallery.kategori = kategori;

    await existingGallery.save();

    res.status(200).json({
      message: "Gallery berhasil diupdate",
      data: existingGallery,
    });
  } catch (error) {
    console.error("Error mengupdate gallery:", error);
    res.status(500).json({
      message: "Gagal mengupdate gallery",
      error: error.message,
    });
  }
};

// Delete gallery
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await Gallery.findById(id);
    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery tidak ditemukan" });
    }

    if (fs.existsSync(galleryItem.gambar)) {
      fs.unlinkSync(galleryItem.gambar);
    }

    await Gallery.findByIdAndDelete(id);

    res.status(200).json({ message: "Gallery berhasil dihapus" });
  } catch (error) {
    console.error("Error menghapus gallery:", error);
    res.status(500).json({
      message: "Gagal menghapus gallery",
      error: error.message,
    });
  }
};

// Get all galleries
export const getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find()
      .populate({
        path: "kategori",
        select: "title", // Ambil hanya field 'title'
      })
      .sort({ createdAt: -1 });
    res.status(200).json(galleries);
  } catch (error) {
    console.error("Error mengambil galleries:", error);
    res.status(500).json({
      message: "Gagal mengambil galleries",
      error: error.message,
    });
  }
};

// Get gallery by ID
export const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await Gallery.findById(id).populate({
      path: "kategori",
      select: "title", // Ambil hanya field 'title'
    });
    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery tidak ditemukan" });
    }

    res.status(200).json(galleryItem);
  } catch (error) {
    console.error("Error mengambil gallery by ID:", error);
    res.status(500).json({
      message: "Gagal mengambil gallery",
      error: error.message,
    });
  }
};
