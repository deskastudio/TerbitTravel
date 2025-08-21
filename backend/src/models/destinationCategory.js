// File: models/galleryCategory.js
import mongoose from "mongoose";

const DestinationCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const DestinationCategory = mongoose.model(
  "DestinationCategory",
  DestinationCategorySchema
);
export default DestinationCategory;
