// src/controllers/categoryController.js
// src/controllers/blogCategoryController.js
import Category from "../models/blogCategory.js";

// Tambah kategori baru
export const addCategory = async (req, res) => {
  const { nama, deskripsi } = req.body;

  try {
    // Cek apakah kategori sudah ada
    const existingCategory = await Category.findOne({ nama });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Kategori dengan nama ini sudah ada" });
    }

    const newCategory = new Category({
      nama,
      deskripsi,
    });
    await newCategory.save();
    res
      .status(201)
      .json({ message: "Kategori berhasil ditambahkan", data: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res
      .status(500)
      .json({ message: "Gagal menambahkan kategori", error: error.message });
  }
};

// Update kategori
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    // Cek apakah nama sudah digunakan oleh kategori lain
    if (nama !== category.nama) {
      const existingCategory = await Category.findOne({ nama });
      if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Kategori dengan nama ini sudah ada" });
      }
    }

    // Update data kategori
    category.nama = nama || category.nama;
    category.deskripsi = deskripsi || category.deskripsi;

    await category.save();
    res
      .status(200)
      .json({ message: "Kategori berhasil diupdate", data: category });
  } catch (error) {
    console.error("Error updating category:", error);
    res
      .status(500)
      .json({ message: "Gagal mengupdate kategori", error: error.message });
  }
};

// Hapus kategori
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(500)
      .json({ message: "Gagal menghapus kategori", error: error.message });
  }
};

// Dapatkan semua kategori
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ nama: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil kategori", error: error.message });
  }
};

// Dapatkan kategori berdasarkan ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil kategori", error: error.message });
  }
};