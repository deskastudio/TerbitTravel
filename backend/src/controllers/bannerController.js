import fs from "fs";
import Banner from "../models/banner.js";

// Tambahkan banner baru
export const addBanner = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Cek jika sudah ada 10 banner
    const totalBanners = await Banner.countDocuments();
    if (totalBanners >= 10) {
      return res.status(400).json({ message: "Maximum of 10 banners reached" });
    }

    // Simpan banner baru
    const newBanner = new Banner({
      gambar: file.path,
    });
    await newBanner.save();

    res
      .status(201)
      .json({ message: "Banner added successfully", data: newBanner });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update banner
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Cari banner berdasarkan ID
    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return res
        .status(404)
        .json({ message: `Banner with ID ${id} does not exist` });
    }

    // Hapus file lama
    if (fs.existsSync(existingBanner.gambar)) {
      fs.unlinkSync(existingBanner.gambar);
    }

    // Perbarui data banner
    existingBanner.gambar = file.path;
    await existingBanner.save();

    res
      .status(200)
      .json({ message: "Banner updated successfully", data: existingBanner });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Hapus banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari banner berdasarkan ID
    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return res
        .status(404)
        .json({ message: `Banner with ID ${id} does not exist` });
    }

    // Hapus file gambar
    if (fs.existsSync(existingBanner.gambar)) {
      fs.unlinkSync(existingBanner.gambar);
    }

    // Hapus banner dari database
    await Banner.findByIdAndDelete(id);

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Ambil semua banner
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
