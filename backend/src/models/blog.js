// src/models/blog.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: true,
      trim: true,
    },
    penulis: {
      type: String,
      required: true,
      trim: true,
    },
    isi: {
      type: String,
      required: true,
    },
    gambarUtama: {
      type: String,
      default: "",
    },
    gambarTambahan: {
      type: [String],
      default: [],
    },
    kategori: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
