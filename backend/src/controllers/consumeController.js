// src/controllers/consumeController.js
import Consume from "../models/consume.js";
import path from "path";

// Add new consume
export const addConsume = async (req, res) => {
  const { nama, harga, lauk } = req.body;

  try {
    const newConsume = new Consume({
      nama,
      harga,
      lauk,
    });
    await newConsume.save();
    res
      .status(201)
      .json({ message: "Consume added successfully", data: newConsume });
  } catch (error) {
    console.error("Error adding consume:", error);
    res
      .status(500)
      .json({ message: "Failed to add consume", error: error.message });
  }
};

// Update existing consume
export const updateConsume = async (req, res) => {
  const { id } = req.params;
  const { nama, harga, lauk } = req.body;

  try {
    const updatedConsume = await Consume.findByIdAndUpdate(
      id,
      { nama, harga, lauk },
      { new: true }
    );

    if (!updatedConsume) {
      return res.status(404).json({ message: "Consume not found" });
    }

    res
      .status(200)
      .json({ message: "Consume updated successfully", data: updatedConsume });
  } catch (error) {
    console.error("Error updating consume:", error);
    res
      .status(500)
      .json({ message: "Failed to update consume", error: error.message });
  }
};

// Delete consume by ID
export const deleteConsume = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedConsume = await Consume.findByIdAndDelete(id);
    if (!deletedConsume) {
      return res.status(404).json({ message: "Consume not found" });
    }

    res.status(200).json({ message: "Consume deleted successfully" });
  } catch (error) {
    console.error("Error deleting consume:", error);
    res
      .status(500)
      .json({ message: "Failed to delete consume", error: error.message });
  }
};

// Get all consumes
export const getAllConsumes = async (req, res) => {
  try {
    const consumes = await Consume.find().sort({ createdAt: -1 });
    res.status(200).json(consumes);
  } catch (error) {
    console.error("Error fetching consumes:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch consumes", error: error.message });
  }
};
