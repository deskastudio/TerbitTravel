import fs from "fs";
import Banner from "../models/banner.js";

// Tambahkan banner baru
export const addBanner = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    // Cek jika sudah ada 10 banner
    const totalBanners = await Banner.countDocuments();
    if (totalBanners >= 10) {
      return res.status(400).json({ 
        success: false,
        message: "Maximum of 10 banners reached" 
      });
    }

    // Simpan banner baru
    const newBanner = new Banner({
      gambar: file.path,
      status: "active", // Default status
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await newBanner.save();

    res.status(201).json({ 
      success: true,
      message: "Banner added successfully", 
      data: newBanner 
    });
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update banner
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    // Cari banner berdasarkan ID
    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return res.status(404).json({ 
        success: false,
        message: `Banner with ID ${id} does not exist` 
      });
    }

    // Jika ada file baru, hapus file lama dan update path
    if (file) {
      // Hapus file lama
      if (fs.existsSync(existingBanner.gambar)) {
        fs.unlinkSync(existingBanner.gambar);
      }
      // Update path gambar
      existingBanner.gambar = file.path;
    }

    // Update fields lain jika ada
    if (req.body.status) {
      existingBanner.status = req.body.status;
    }
    if (req.body.title) {
      existingBanner.title = req.body.title;
    }
    if (req.body.description) {
      existingBanner.description = req.body.description;
    }
    if (req.body.link) {
      existingBanner.link = req.body.link;
    }

    existingBanner.updatedAt = new Date();
    await existingBanner.save();

    res.status(200).json({ 
      success: true,
      message: "Banner updated successfully", 
      data: existingBanner 
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Hapus banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari banner berdasarkan ID
    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return res.status(404).json({ 
        success: false,
        message: `Banner with ID ${id} does not exist` 
      });
    }

    // Hapus file gambar
    if (fs.existsSync(existingBanner.gambar)) {
      fs.unlinkSync(existingBanner.gambar);
    }

    // Hapus banner dari database
    await Banner.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true,
      message: "Banner deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Ambil semua banner (untuk admin)
export const getAllBanners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Banner.countDocuments();

    // Get banners with pagination
    const banners = await Banner.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: banners,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error getting all banners:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// ✅ TAMBAHAN: Get banner by ID (yang hilang)
export const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid banner ID format"
      });
    }

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: `Banner with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error("Error getting banner by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// ✅ TAMBAHAN: Get active banners (yang hilang) - untuk public display
export const getActiveBanners = async (req, res) => {
  try {
    // Get only active banners
    const banners = await Banner.find({ 
      $or: [
        { status: "active" },
        { status: { $exists: false } } // For banners without status field (backward compatibility)
      ]
    })
    .sort({ createdAt: -1 }) // Sort by newest first
    .limit(10); // Limit to maximum 10 banners

    // Transform the data to include full image URL
    const bannersWithFullUrl = banners.map(banner => ({
      _id: banner._id,
      gambar: banner.gambar,
      // Add full URL if needed
      imageUrl: `${req.protocol}://${req.get('host')}/${banner.gambar.replace(/\\/g, '/')}`,
      title: banner.title || '',
      description: banner.description || '',
      link: banner.link || '',
      status: banner.status || 'active',
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: bannersWithFullUrl,
      count: bannersWithFullUrl.length
    });
  } catch (error) {
    console.error("Error getting active banners:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// ✅ TAMBAHAN: Toggle banner status (bonus function)
export const toggleBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: `Banner with ID ${id} not found`
      });
    }

    // Toggle status
    banner.status = banner.status === 'active' ? 'inactive' : 'active';
    banner.updatedAt = new Date();
    await banner.save();

    res.status(200).json({
      success: true,
      message: `Banner status updated to ${banner.status}`,
      data: banner
    });
  } catch (error) {
    console.error("Error toggling banner status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};