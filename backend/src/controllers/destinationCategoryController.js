// src/controllers/destinationCategoryController.js

import DestinationCategory from "../models/destinationCategory.js";

// Add new destination category
export const addDestinationCategory = async (req, res) => {
  const { title } = req.body;

  try {
    const newCategory = new DestinationCategory({ title });
    await newCategory.save();
    res.status(201).json({
      message: "Destination category added successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error adding destination category:", error);
    res.status(500).json({
      message: "Failed to add destination category",
      error: error.message,
    });
  }
};

// Update existing destination category
export const updateDestinationCategory = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const updatedCategory = await DestinationCategory.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ message: "Destination category not found" });
    }

    res.status(200).json({
      message: "Destination category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating destination category:", error);
    res.status(500).json({
      message: "Failed to update destination category",
      error: error.message,
    });
  }
};

// Delete destination category by ID
export const deleteDestinationCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await DestinationCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ message: "Destination category not found" });
    }

    res
      .status(200)
      .json({ message: "Destination category deleted successfully" });
  } catch (error) {
    console.error("Error deleting destination category:", error);
    res.status(500).json({
      message: "Failed to delete destination category",
      error: error.message,
    });
  }
};

// Get all destination categories
export const getAllDestinationCategories = async (req, res) => {
  try {
    const categories = await DestinationCategory.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching destination categories:", error);
    res.status(500).json({
      message: "Failed to fetch destination categories",
      error: error.message,
    });
  }
};

// Get destination category by ID
export const getDestinationCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await DestinationCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Destination category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching destination category by ID:", error);
    res.status(500).json({
      message: "Failed to fetch destination category",
      error: error.message,
    });
  }
};
