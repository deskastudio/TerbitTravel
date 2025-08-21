// src/models/banner.js
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: true,
      trim: true,
    },
    deskripsi: {
      type: String,
      required: false,
      trim: true,
    },
    gambar: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    urutan: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;