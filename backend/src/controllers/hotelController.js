import Hotel from "../models/hotel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add new hotel
// hotelController.js
export const addHotel = async (req, res) => {
  try {
    const { nama, alamat, bintang, harga, fasilitas } = req.body;
    const gambarPaths = req.files.map(file => file.path);

    // Pastikan fasilitas adalah array
    const fasilitasArray = Array.isArray(fasilitas) ? fasilitas : [fasilitas];

    const hotel = new Hotel({
      nama,
      alamat,
      bintang,
      harga,
      fasilitas: fasilitasArray,
      gambar: gambarPaths,
    });

    await hotel.save();
    res.status(201).json({ message: 'Hotel added successfully', data: hotel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add hotel', error: error.message });
  }
};

// Update existing hotel
export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, alamat, bintang, harga, fasilitas, existingImage } = req.body;
    
    // Get current hotel data
    const currentHotel = await Hotel.findById(id);
    if (!currentHotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel tidak ditemukan"
      });
    }

    // Prepare update data
    const updateData = {
      nama,
      alamat,
      bintang: Number(bintang),
      harga: Number(harga),
      fasilitas: Array.isArray(fasilitas) ? fasilitas : [fasilitas],
    };

    // Handle image update
    if (req.files && req.files.length > 0) {
      // If there's a new image uploaded
      updateData.gambar = [req.files[0].path]; // Only take the first image
      
      // Delete old image if it exists
      if (currentHotel.gambar && currentHotel.gambar.length > 0) {
        try {
          const oldImagePath = path.join(__dirname, "../../", currentHotel.gambar[0]);
          if (fs.existsSync(oldImagePath)) {
            await fs.promises.unlink(oldImagePath);
          }
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
    } else if (existingImage) {
      // Keep existing image
      updateData.gambar = [existingImage];
    } else {
      // Keep current image if no new image is uploaded
      updateData.gambar = currentHotel.gambar;
    }

    // Update hotel in database
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Hotel berhasil diupdate",
      data: updatedHotel
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
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
