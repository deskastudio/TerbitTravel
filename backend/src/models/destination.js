import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  lokasi: { type: String, required: true },
  deskripsi: { type: String, required: true },
  foto: [{ type: String, required: true }], // Array of strings untuk menyimpan path gambar
});

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
