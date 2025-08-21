// src/controllers/galleryCategoryController.js

import GalleryCategory from "../models/galleryCategory.js";

// Add new gallery category
export const addGalleryCategory = async (req, res) => {
  const { title } = req.body;

  try {
    const newCategory = new GalleryCategory({ title });
    await newCategory.save();
    res.status(201).json({
      message: "Gallery category added successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error adding gallery category:", error);
    res.status(500).json({
      message: "Failed to add gallery category",
      error: error.message,
    });
  }
};

// Update existing gallery category
export const updateGalleryCategory = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const updatedCategory = await GalleryCategory.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Gallery category not found" });
    }

    res.status(200).json({
      message: "Gallery category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating gallery category:", error);
    res.status(500).json({
      message: "Failed to update gallery category",
      error: error.message,
    });
  }
};

// Delete gallery category by ID
export const deleteGalleryCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await GalleryCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Gallery category not found" });
    }

    res.status(200).json({ message: "Gallery category deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery category:", error);
    res.status(500).json({
      message: "Failed to delete gallery category",
      error: error.message,
    });
  }
};

// Get all gallery categories
export const getAllGalleryCategories = async (req, res) => {
  try {
    const categories = await GalleryCategory.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching gallery categories:", error);
    res.status(500).json({
      message: "Failed to fetch gallery categories",
      error: error.message,
    });
  }
};

// Get gallery category by ID
export const getGalleryCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await GalleryCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Gallery category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching gallery category by ID:", error);
    res.status(500).json({
      message: "Failed to fetch gallery category",
      error: error.message,
    });
  }
};
