import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  alamat: { type: String, required: true },
  gambar: [{ type: String, required: true }], // Array of strings untuk menyimpan path gambar
  bintang: { type: Number, required: true, min: 1, max: 5 },
  harga: { type: Number, required: true },
  fasilitas: [{ type: String, required: true }],
});

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
