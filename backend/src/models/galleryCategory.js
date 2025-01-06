// File: models/galleryCategory.js
import mongoose from "mongoose";

const GalleryCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const GalleryCategory = mongoose.model(
  "GalleryCategory",
  GalleryCategorySchema
);
export default GalleryCategory;
