import mongoose from "mongoose"; // Import mongoose untuk validasi ObjectId
import Package from "../models/package.js"; // Import model Package

/**
 * Menambah paket baru
 */
export const addPackage = async (req, res) => {
  try {
    const {
      nama,
      deskripsi,
      include,
      exclude,
      harga,
      status,
      destination,
      hotel,
      armada,
      consume,
    } = req.body;

    // Validasi apakah field penting ada
    if (!destination || !consume || !hotel || !armada) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPackage = new Package({
      nama,
      deskripsi,
      include,
      exclude,
      harga,
      status,
      destination,
      hotel,
      armada,
      consume,
    });

    await newPackage.save();

    res.status(201).json({
      message: "Package added successfully",
      package: newPackage,
    });
  } catch (error) {
    console.error("Error adding package:", error);
    res.status(500).json({ message: "Error adding package", error });
  }
};

/**
 * Mengambil semua paket
 */
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate("destination", "lokasi gambar")
      .populate("hotel", "nama alamat bintang")
      .populate("armada", "nama kapasitas")
      .populate("consume", "nama lauk harga");

    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
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
      .populate("consume", "nama lauk harga");

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
      destination, // Pastikan ID di sini adalah ObjectId yang valid
      hotel,
      armada,
      consume, // Pastikan ID di sini adalah ObjectId yang valid
    } = req.body;

    // Periksa dan konversi ID menjadi ObjectId jika berupa string
    const destinationId = new mongoose.Types.ObjectId(destination);
    const hotelId = new mongoose.Types.ObjectId(hotel);
    const armadaId = new mongoose.Types.ObjectId(armada);
    const consumeId = new mongoose.Types.ObjectId(consume);

    // Validasi apakah ObjectId valid (harus 24 karakter panjangnya)
    if (
      !mongoose.Types.ObjectId.isValid(destinationId) ||
      !mongoose.Types.ObjectId.isValid(consumeId) ||
      !mongoose.Types.ObjectId.isValid(hotelId) ||
      !mongoose.Types.ObjectId.isValid(armadaId)
    ) {
      return res.status(400).json({ message: "Invalid ObjectId(s) provided" });
    }

    // Update paket
    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      {
        nama,
        deskripsi,
        include,
        exclude,
        harga,
        status,
        destination: destinationId,
        hotel: hotelId,
        armada: armadaId,
        consume: consumeId,
      },
      { new: true } // Mengembalikan data terbaru setelah pembaruan
    )
      .populate("destination", "lokasi gambar")
      .populate("hotel", "nama alamat bintang")
      .populate("armada", "nama kapasitas")
      .populate("consume", "nama lauk harga");

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
