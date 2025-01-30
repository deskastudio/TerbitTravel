import mongoose from "mongoose";
import Package from "../models/package.js";

/**
 * Menambah paket baru
 */
// packageController.js 
export const addPackage = async (req, res) => {
  try {
    const {
      nama, deskripsi, include, exclude, harga, status,
      durasi, jadwal, destination, hotel, armada, consume, kategori
    } = req.body;

    // Validate required fields
    if (!nama || !deskripsi || !harga || !durasi || 
        !destination || !hotel || !armada || !consume || !kategori) {
      return res.status(400).json({ 
        message: "Semua field wajib diisi"
      });
    }

    const newPackage = new Package({
      nama, deskripsi, include, exclude, harga, status,
      durasi, jadwal, destination, hotel, armada, consume, kategori
    });

    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      message: "Error adding package",
      error: error.message 
    });
  }
};

/**
 * Mengambil semua paket
 */
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate("destination", "nama lokasi")  
      .populate("hotel", "nama bintang")
      .populate("armada", "nama kapasitas")
      .populate("consume", "nama")
      .populate("kategori", "title");
 
    console.log('Found packages:', packages);
    res.json(packages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Error fetching packages", error });
  }  
 };

/**
 * Mengambil paket berdasarkan ID
 */
export const getPackageById = async (req, res) => {
  try {
    const { packageId } = req.params;

    const foundPackage = await Package.findById(packageId)
      .populate("destination", "lokasi gambar")
      .populate("hotel", "nama alamat bintang")
      .populate("armada", "nama kapasitas")
      .populate("consume", "nama lauk harga")
      .populate("kategori", "nama"); // Populate kategori

    if (!foundPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(foundPackage);
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({ message: "Error fetching package", error });
  }
};

/**
 * Memperbarui paket berdasarkan ID
 */
export const updatePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const {
      nama,
      deskripsi,
      include,
      exclude,
      harga,
      status,
      durasi,
      jadwal,
      destination,
      hotel,
      armada,
      consume,
      kategori, // Tambahkan kategori
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({ message: "Invalid package ID" });
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      {
        nama,
        deskripsi,
        include,
        exclude,
        harga,
        status,
        durasi,
        jadwal,
        destination,
        hotel,
        armada,
        consume,
        kategori, // Menyimpan kategori
      },
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json({
      message: "Package updated successfully",
      package: updatedPackage,
    });
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ message: "Error updating package", error });
  }
};

/**
 * Menghapus paket berdasarkan ID
 */
export const deletePackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    const deletedPackage = await Package.findByIdAndDelete(packageId);

    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ message: "Error deleting package", error });
  }
};
