// File src/models/blogCategory.js
// Ubah komentar path
// src/models/blogCategory.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      unique: true,
    },
    deskripsi: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;