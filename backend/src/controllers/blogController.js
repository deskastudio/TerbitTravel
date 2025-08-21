// src/controllers/blogController.js
import Blog from "../models/blog.js";
import path from "path";
import fs from "fs";

// Add new blog
export const addBlog = async (req, res) => {
  try {
    console.log("Processing blog creation...");
    console.log("Request body:", req.body);
    
    // Validasi data dasar
    const { judul, penulis, isi, kategori } = req.body;
    if (!judul || !penulis || !isi || !kategori) {
      return res.status(400).json({ 
        message: "Data tidak lengkap", 
        details: "Semua field (judul, penulis, isi, kategori) wajib diisi" 
      });
    }
    
    // Validasi dan proses file upload
    console.log("Request files:", req.files);
    
    if (!req.files || !req.files.gambarUtama || req.files.gambarUtama.length === 0) {
      return res.status(400).json({ 
        message: "Gambar utama wajib diunggah" 
      });
    }
    
    // Handle file uploads
    const gambarUtama = `/uploads/blog/${req.files.gambarUtama[0].filename}`;
    
    const gambarTambahan = req.files.gambarTambahan && req.files.gambarTambahan.length > 0
      ? req.files.gambarTambahan.map(file => `/uploads/blog/${file.filename}`)
      : [];

    console.log("Processed gambarUtama:", gambarUtama);
    console.log("Processed gambarTambahan:", gambarTambahan);

    const newBlog = new Blog({
      judul,
      penulis,
      isi,
      gambarUtama,
      gambarTambahan,
      kategori,
    });
    
    console.log("Creating new blog:", newBlog);
    
    await newBlog.save();
    res.status(201).json({ message: "Blog added successfully", data: newBlog });
  } catch (error) {
    console.error("Error adding blog:", error);
    // Log error stack untuk debugging
    console.error("Error stack:", error.stack);
    
    res.status(500).json({ 
      message: "Failed to add blog", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


// Update existing blog
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { judul, penulis, isi, kategori } = req.body;
  
  try {
    console.log("Update blog ID:", id);
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Handle file uploads
    const gambarUtama = req.files && req.files["gambarUtama"] && req.files["gambarUtama"].length > 0
      ? `/uploads/blog/${req.files["gambarUtama"][0].filename}`
      : null;
      
    const gambarTambahan = req.files && req.files["gambarTambahan"] && req.files["gambarTambahan"].length > 0
      ? req.files["gambarTambahan"].map(
          (file) => `/uploads/blog/${file.filename}`
        )
      : [];

    // Hapus gambar lama jika ada gambar baru yang diunggah
    if (gambarUtama && blog.gambarUtama) {
      try {
        const oldImagePath = path.join(process.cwd(), blog.gambarUtama);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (unlinkError) {
        console.error("Error deleting old main image:", unlinkError);
        // Continue despite error
      }
    }

    // Hapus gambar tambahan lama jika ada gambar baru
    if (gambarTambahan.length > 0) {
      for (const oldPath of blog.gambarTambahan) {
        try {
          const oldImagePath = path.join(process.cwd(), oldPath);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (unlinkError) {
          console.error("Error deleting old additional image:", unlinkError);
          // Continue despite error
        }
      }
    }

    // Update data blog dengan gambar baru jika ada
    blog.judul = judul || blog.judul;
    blog.penulis = penulis || blog.penulis;
    blog.isi = isi || blog.isi;
    blog.kategori = kategori || blog.kategori;
    
    if (gambarUtama) {
      blog.gambarUtama = gambarUtama;
    }
    
    if (gambarTambahan.length > 0) {
      blog.gambarTambahan = gambarTambahan;
    }

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully", data: blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res
      .status(500)
      .json({ message: "Failed to update blog", error: error.message });
  }
};

// Delete blog by ID
export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Hapus gambar utama
    if (blog.gambarUtama) {
      try {
        const filePath = path.join(process.cwd(), blog.gambarUtama);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (unlinkError) {
        console.error("Error deleting main image:", unlinkError);
        // Continue despite error
      }
    }

    // Hapus semua gambar tambahan
    for (const gambarPath of blog.gambarTambahan) {
      try {
        const filePath = path.join(process.cwd(), gambarPath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (unlinkError) {
        console.error("Error deleting additional image:", unlinkError);
        // Continue despite error
      }
    }

    // Delete blog from database
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res
      .status(500)
      .json({ message: "Failed to delete blog", error: error.message });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    // Ambil parameter query untuk pagination, search, dan filter
    const { page = 1, limit = 10, search = "", kategori = "" } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    
    // Buat query filter
    const filter = {};
    
    // Tambahkan filter kategori jika ada
    if (kategori) {
      filter.kategori = kategori;
    }
    
    // Tambahkan filter pencarian jika ada
    if (search) {
      filter.$or = [
        { judul: { $regex: search, $options: "i" } },
        { penulis: { $regex: search, $options: "i" } },
        { isi: { $regex: search, $options: "i" } },
      ];
    }
    
    // Hitung total blogs untuk pagination
    const totalItems = await Blog.countDocuments(filter);
    
    // Ambil blogs dengan pagination
    const blogs = await Blog.find(filter)
      .populate({
        path: "kategori",
        select: "title", // Ambil hanya field 'title'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);
    
    // Buat metadata pagination
    const meta = {
      currentPage: pageNumber,
      itemsPerPage: limitNumber,
      totalItems,
      totalPages: Math.ceil(totalItems / limitNumber),
    };
    
    res.status(200).json({
      data: blogs,
      meta,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch blogs", error: error.message });
  }
};

// Fungsi untuk mendapatkan blog berdasarkan ID
export const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id).populate({
      path: "kategori",
      select: "title", // Ambil hanya field 'title'
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch blog", error: error.message });
  }
};

// Get blogs by category
export const getBlogsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const blogs = await Blog.find({ kategori: categoryId })
      .populate({
        path: "kategori",
        select: "title",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    res.status(500).json({
      message: "Failed to fetch blogs by category",
      error: error.message,
    });
  }
};