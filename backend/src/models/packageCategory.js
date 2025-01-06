// File: models/galleryCategory.js
import mongoose from "mongoose";

const PackageCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const PackageCategory = mongoose.model(
  "PackageCategory",
  PackageCategorySchema
);
export default PackageCategory;
