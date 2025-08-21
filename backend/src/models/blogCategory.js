// src/models/blogCategory.js
import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);

export default BlogCategory;
