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
    const destinationData = {
      nama,
      lokasi,
      deskripsi,
      foto: fotoPaths,
    };

    // Only add category if it's provided and not empty
    if (req.body.category && req.body.category.trim() !== "") {
      destinationData.category = req.body.category;
    }

    const newDestination = new Destination(destinationData);
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
  const { nama, lokasi, deskripsi, replaceImages, deleteImages } = req.body;
  // Foto baru (jika ada)
  const fotoPaths =
    req.files?.map((file) => `uploads/destination/${file.filename}`) || [];

  console.log("🔧 UpdateDestination Debug Info:");
  console.log("📁 Request body:", req.body);
  console.log("🔄 replaceImages value:", replaceImages);
  console.log("🔄 replaceImages type:", typeof replaceImages);
  console.log("🗑️ deleteImages value:", deleteImages);
  console.log("🗑️ deleteImages type:", typeof deleteImages);
  console.log("📸 New foto paths:", fotoPaths);
  console.log("📸 Files received:", req.files?.length || 0);

  try {
    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    console.log("📂 Current destination photos:", destination.foto);

    // Handle individual photo deletion first
    if (deleteImages && deleteImages.length > 0) {
      console.log("🗑️ Processing individual photo deletions...");
      const imagesToDelete = Array.isArray(deleteImages)
        ? deleteImages
        : [deleteImages];

      for (const imageToDelete of imagesToDelete) {
        const filePath = path.join(__dirname, "../../", imageToDelete);
        console.log(`🗑️ Attempting to delete individual image: ${filePath}`);

        try {
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log(
              `✅ Successfully deleted individual image: ${imageToDelete}`
            );
          } else {
            console.log(`⚠️ Individual image file not found: ${imageToDelete}`);
          }
        } catch (error) {
          console.error(
            `❌ Error deleting individual image ${imageToDelete}:`,
            error
          );
        }

        // Remove from destination.foto array
        destination.foto = destination.foto.filter(
          (foto) => foto !== imageToDelete
        );
      }
      console.log("📂 Photos after individual deletions:", destination.foto);
    }

    // Handle foto update logic
    if (fotoPaths.length > 0) {
      console.log("📸 Processing new images upload...");
      if (replaceImages === "true") {
        console.log(
          "🔄 REPLACE MODE: Deleting old images and setting new ones"
        );
        // Replace all existing images with new ones

        // Delete old image files from filesystem
        for (const oldFotoPath of destination.foto) {
          const filePath = path.join(__dirname, "../../", oldFotoPath);
          console.log(`🗑️ Attempting to delete: ${filePath}`);
          try {
            if (fs.existsSync(filePath)) {
              await fs.promises.unlink(filePath);
              console.log(`✅ Successfully deleted old image: ${filePath}`);
            } else {
              console.log(`⚠️ File not found: ${filePath}`);
            }
          } catch (error) {
            console.error(`❌ Error deleting old image ${filePath}:`, error);
          }
        }

        // Set new images only
        destination.foto = fotoPaths;
        console.log(
          `✅ Replaced all images with ${fotoPaths.length} new images`
        );
      } else {
        console.log("➕ ADD MODE: Appending new images to existing ones");
        // Add new images to existing ones (original behavior)
        if (destination.foto.length + fotoPaths.length > 5) {
          return res.status(400).json({
            message: "Maksimal 5 gambar diperbolehkan untuk destinasi ini.",
          });
        }

        destination.foto = [...destination.foto, ...fotoPaths];
        console.log(
          `✅ Added ${fotoPaths.length} new images, total: ${destination.foto.length}`
        );
      }
    } else {
      console.log("📸 No new images uploaded");
      console.log("🔄 replaceImages flag:", replaceImages);
      console.log("📂 Keeping existing photos:", destination.foto);
    }

    // Update data lain
    destination.nama = nama || destination.nama;
    destination.lokasi = lokasi || destination.lokasi;
    destination.deskripsi = deskripsi || destination.deskripsi;

    // Only update category if provided
    if (req.body.category !== undefined) {
      if (req.body.category && req.body.category.trim() !== "") {
        destination.category = req.body.category;
      } else {
        // If empty string is sent, remove category
        destination.category = undefined;
      }
    }

    await destination.save();
    res.status(200).json({
      message: "Destination updated successfully",
      data: destination,
    });
  } catch (error) {
    console.error("Error updating destination:", error);
    res
      .status(500)
      .json({ message: "Failed to update destination", error: error.message });
  }
};

// Fetch all destinations with category populated
export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find()
      .populate("category", "title") // Populating category with tittle
      .sort({ createdAt: -1 });
    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch destinations", error: error.message });
  }
};

// Fetch destination by ID with category populated
export const getDestinationById = async (req, res) => {
  const { id } = req.params;

  try {
    const destination = await Destination.findById(id).populate(
      "category",
      "title"
    ); // Populating category with tittle
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
