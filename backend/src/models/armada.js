// Model Armada
import mongoose from "mongoose";

const armadaSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  kapasitas: [{ type: String, required: true }], // Ubah kapasitas menjadi array of strings
  gambar: [{ type: String, required: true }],
  harga: { type: Number, required: true },
  merek: { type: String, required: true },
});

const Armada = mongoose.model("Armada", armadaSchema);
export default Armada;
