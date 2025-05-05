// src/controllers/blogController.js
import Blog from "../models/blog.js";
import path from "path";
import fs from "fs";

// Add new blog
export const addBlog = async (req, res) => {
  const { judul, penulis, isi, kategori } = req.body;
  const gambarUtama = req.files["gambarUtama"]
    ? `/uploads/blog/${req.files["gambarUtama"][0].filename}`
    : "";
  const gambarTambahan = req.files["gambarTambahan"]
    ? req.files["gambarTambahan"].map(
        (file) => `/uploads/blog/${file.filename}`
      )
    : [];

  try {
    const newBlog = new Blog({
      judul,
      penulis,
      isi,
      gambarUtama,
      gambarTambahan,
      kategori, // Tambahkan kategori
    });
    await newBlog.save();
    res.status(201).json({ message: "Blog added successfully", data: newBlog });
  } catch (error) {
    console.error("Error adding blog:", error);
    res
      .status(500)
      .json({ message: "Failed to add blog", error: error.message });
  }
};

// Update existing blog
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { judul, penulis, isi, kategori } = req.body;
  const gambarUtama = req.file ? `uploads/blog/${req.file.filename}` : null; // Gambar utama
  const gambarTambahan = req.files
    ? req.files.map((file) => `uploads/blog/${file.filename}`)
    : [];

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Hapus gambar lama jika ada gambar baru yang diunggah
    if (gambarUtama && blog.gambarUtama) {
      const oldImagePath = path.join(__dirname, "../../", blog.gambarUtama);
      if (fs.existsSync(oldImagePath)) {
        await fs.promises.unlink(oldImagePath);
      }
    }

    // Hapus gambar tambahan lama
    for (const oldPath of blog.gambarTambahan) {
      const oldImagePath = path.join(__dirname, "../../", oldPath);
      if (fs.existsSync(oldImagePath)) {
        await fs.promises.unlink(oldImagePath);
      }
    }

    // Update data blog dengan gambar baru jika ada
    blog.judul = judul || blog.judul;
    blog.penulis = penulis || blog.penulis;
    blog.gambarUtama = gambarUtama || blog.gambarUtama;
    blog.gambarTambahan =
      gambarTambahan.length > 0 ? gambarTambahan : blog.gambarTambahan;
    blog.isi = isi || blog.isi;
    blog.kategori = kategori || blog.kategori; // Update kategori

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
      const filePath = path.join(__dirname, "../../", blog.gambarUtama);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }

    // Hapus semua gambar tambahan
    for (const gambarPath of blog.gambarTambahan) {
      const filePath = path.join(__dirname, "../../", gambarPath);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
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
    const blogs = await Blog.find()
      .populate({
        path: "kategori",
        select: "title", // Ambil hanya field 'title'
      })
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
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
