import Destination from "../models/destination.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add new destination
export const addDestination = async (req, res) => {
  const { nama, lokasi, deskripsi } = req.body;
  const fotoPaths = req.files.map(
    (file) => `uploads/destination/${file.filename}`
  );

  try {
    const newDestination = new Destination({
      nama,
      lokasi,
      deskripsi,
      foto: fotoPaths,
    });
    await newDestination.save();
    res.status(201).json({
      message: "Destination added successfully",
      data: newDestination,
    });
  } catch (error) {
    console.error("Error adding destination:", error);
    res
      .status(500)
      .json({ message: "Failed to add destination", error: error.message });
  }
};

// Update existing destination
export const updateDestination = async (req, res) => {
  const { id } = req.params;
  const { nama, lokasi, deskripsi } = req.body;
  const fotoPaths =
    req.files?.map((file) => `uploads/destination/${file.filename}`) || [];

  try {
    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    // Delete old images if new ones are uploaded
    if (fotoPaths.length > 0) {
      for (const oldPath of destination.foto) {
        const oldImagePath = path.join(__dirname, "../../", oldPath);
        try {
          if (fs.existsSync(oldImagePath)) {
            await fs.promises.unlink(oldImagePath);
            console.log(`Old file deleted successfully: ${oldImagePath}`);
          }
        } catch (err) {
          console.error(`Failed to delete old file ${oldImagePath}:`, err);
        }
      }
    }

    // Update destination data with new images if any
    destination.nama = nama || destination.nama;
    destination.lokasi = lokasi || destination.lokasi;
    destination.deskripsi = deskripsi || destination.deskripsi;
    destination.foto = fotoPaths.length > 0 ? fotoPaths : destination.foto;

    await destination.save();
    res
      .status(200)
      .json({ message: "Destination updated successfully", data: destination });
  } catch (error) {
    console.error("Error updating destination:", error);
    res
      .status(500)
      .json({ message: "Failed to update destination", error: error.message });
  }
};

// Delete destination by ID
export const deleteDestination = async (req, res) => {
  const { id } = req.params;

  try {
    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    // Delete all images associated with this destination
    for (const fotoPath of destination.foto) {
      const filePath = path.join(__dirname, "../../", fotoPath);
      console.log(`Attempting to delete file at path: ${filePath}`);

      try {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
          console.log(`File deleted: ${filePath}`);
        } else {
          console.log(`File not found: ${filePath}`);
        }
      } catch (err) {
        console.error(`Failed to delete file ${filePath}:`, err);
      }
    }

    // Delete destination from database
    await Destination.findByIdAndDelete(id);
    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    res
      .status(500)
      .json({ message: "Failed to delete destination", error: error.message });
  }
};

// Fetch all destinations
export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch destinations", error: error.message });
  }
};
// Ambil data destinasi berdasarkan ID
export const getDestinationById = async (req, res) => {
  const { id } = req.params;

  try {
    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json(destination);
  } catch (error) {
    console.error("Error fetching destination by ID:", error);
    res.status(500).json({
      message: "Failed to fetch destination",
      error: error.message,
    });
  }
};
