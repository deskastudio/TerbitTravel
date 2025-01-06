import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    kategori: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GalleryCategory", // Menghubungkan kategori dengan GalleryCategory
      required: true,
    },
    gambar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
