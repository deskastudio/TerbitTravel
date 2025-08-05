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
    type: [String],
    required: true,
  },
  exclude: {
    type: [String],
    required: true,
  },
  harga: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "sold out"],
    default: "available",
  },
  durasi: {
    type: String,
    required: true,
  },
  jadwal: [
    {
      tanggalAwal: { type: Date, required: true },
      tanggalAkhir: { type: Date, required: true },
      status: {
        type: String,
        enum: ["tersedia", "tidak tersedia"],
        default: "tersedia",
      },
    },
  ],
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  armada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Armada",
    required: true,
  },
  consume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consume",
    required: true,
  },
  kategori: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PackageCategory",
    required: true,
  },
});

const Package = mongoose.model("Package", packageSchema);
export default Package;
