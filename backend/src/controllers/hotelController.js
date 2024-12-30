import Hotel from "../models/hotel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add new hotel
export const addHotel = async (req, res) => {
  const { nama, alamat, bintang, harga, fasilitas } = req.body;
  const gambarPaths = req.files.map((file) => `uploads/hotel/${file.filename}`);

  try {
    const newHotel = new Hotel({
      nama,
      alamat,
      gambar: gambarPaths,
      bintang,
      harga,
      fasilitas: fasilitas.split(","),
    });
    await newHotel.save();
    res
      .status(201)
      .json({ message: "Hotel added successfully", data: newHotel });
  } catch (error) {
    console.error("Error adding hotel:", error);
    res
      .status(500)
      .json({ message: "Failed to add hotel", error: error.message });
  }
};

// Update existing hotel
export const updateHotel = async (req, res) => {
  const { id } = req.params;
  const { nama, alamat, bintang, harga, fasilitas } = req.body;
  const gambarPaths =
    req.files?.map((file) => `uploads/hotel/${file.filename}`) || [];

  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Delete old images if new ones are uploaded
    if (gambarPaths.length > 0) {
      for (const oldPath of hotel.gambar) {
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

    // Update hotel data with new images if any
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      {
        nama: nama || hotel.nama,
        alamat: alamat || hotel.alamat,
        gambar: gambarPaths.length > 0 ? gambarPaths : hotel.gambar,
        bintang: bintang || hotel.bintang,
        harga: harga || hotel.harga,
        fasilitas: fasilitas ? fasilitas.split(",") : hotel.fasilitas,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Hotel updated successfully", data: updatedHotel });
  } catch (error) {
    console.error("Error updating hotel:", error);
    res
      .status(500)
      .json({ message: "Failed to update hotel", error: error.message });
  }
};

// Delete hotel by ID
export const deleteHotel = async (req, res) => {
  const { id } = req.params;

  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Delete all images associated with this hotel
    for (const gambarPath of hotel.gambar) {
      const filePath = path.join(__dirname, "../../", gambarPath);
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

    // Delete hotel from database
    await Hotel.findByIdAndDelete(id);
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res
      .status(500)
      .json({ message: "Failed to delete hotel", error: error.message });
  }
};

// Fetch all hotels
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch hotels", error: error.message });
  }
};
// Fungsi untuk mendapatkan hotel berdasarkan ID
export const getHotelById = async (req, res) => {
  const { id } = req.params;

  try {
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch hotel", error: error.message });
  }
};
