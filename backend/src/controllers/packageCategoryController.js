import PackageCategory from "../models/packageCategory.js"; // Pastikan model ini sesuai dengan lokasi
import Package from "../models/package.js"; // Model untuk paket wisata

// Add new package category
export const addPackageCategory = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newCategory = new PackageCategory({ title, description });
    await newCategory.save();
    res.status(201).json({
      message: "Package category added successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error adding package category:", error);
    res.status(500).json({
      message: "Failed to add package category",
      error: error.message,
    });
  }
};

// Update existing package category
export const updatePackageCategory = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedCategory = await PackageCategory.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Package category not found" });
    }

    res.status(200).json({
      message: "Package category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating package category:", error);
    res.status(500).json({
      message: "Failed to update package category",
      error: error.message,
    });
  }
};

// Delete package category by ID
export const deletePackageCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await PackageCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Package category not found" });
    }

    // Optional: You can also delete associated packages when category is deleted.
    await Package.updateMany({ categoryId: id }, { categoryId: null });

    res.status(200).json({ message: "Package category deleted successfully" });
  } catch (error) {
    console.error("Error deleting package category:", error);
    res.status(500).json({
      message: "Failed to delete package category",
      error: error.message,
    });
  }
};

// Get all package categories
export const getAllPackageCategories = async (req, res) => {
  try {
    const categories = await PackageCategory.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching package categories:", error);
    res.status(500).json({
      message: "Failed to fetch package categories",
      error: error.message,
    });
  }
};

// Get package category by ID
export const getPackageCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await PackageCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Package category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching package category by ID:", error);
    res.status(500).json({
      message: "Failed to fetch package category",
      error: error.message,
    });
  }
};
