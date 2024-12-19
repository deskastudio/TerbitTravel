import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  deskripsi: {
    type: String,
    required: true,
  },
  include: {
    type: [String], // List of included items
    required: true,
  },
  exclude: {
    type: [String], // List of excluded items
    required: true,
  },
  harga: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "sold out"], // Pilihan status
    default: "sold out", // Default menjadi 'sold out'
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination", // Referensi ke model destinasi
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel", // Referensi ke model hotel
    required: true,
  },
  armada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Armada", // Referensi ke model armada
    required: true,
  },
  consume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consume", // Referensi ke model konsumsi
    required: true,
  },
});

const Package = mongoose.model("Package", packageSchema);

export default Package;
