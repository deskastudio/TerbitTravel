// src/models/blogModel.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: true,
    },
    penulis: {
      type: String,
      required: true,
    },
    gambarUtama: {
      type: String, // Path untuk gambar utama
      required: true,
    },
    gambarTambahan: {
      type: [String], // Array untuk gambar tambahan
      default: [],
    },
    isi: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
