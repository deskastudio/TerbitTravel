// src/controllers/blogCategoryController.js
import BlogCategory from "../models/blogCategory.js";

// Add new blog category
export const addBlogCategory = async (req, res) => {
  const { title } = req.body;

  try {
    const newCategory = new BlogCategory({ title });
    await newCategory.save();
    res.status(201).json({
      message: "Blog category added successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error adding blog category:", error);
    res.status(500).json({
      message: "Failed to add blog category",
      error: error.message,
    });
  }
};

// Update existing blog category
export const updateBlogCategory = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const updatedCategory = await BlogCategory.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    res.status(200).json({
      message: "Blog category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating blog category:", error);
    res.status(500).json({
      message: "Failed to update blog category",
      error: error.message,
    });
  }
};

// Delete blog category by ID
export const deleteBlogCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await BlogCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    res.status(200).json({ message: "Blog category deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog category:", error);
    res.status(500).json({
      message: "Failed to delete blog category",
      error: error.message,
    });
  }
};

// Get all blog categories
export const getAllBlogCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    res.status(500).json({
      message: "Failed to fetch blog categories",
      error: error.message,
    });
  }
};

// Get blog category by ID
export const getBlogCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await BlogCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching blog category by ID:", error);
    res.status(500).json({
      message: "Failed to fetch blog category",
      error: error.message,
    });
  }
};
