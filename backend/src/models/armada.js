import mongoose from "mongoose";

const armadaSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  kapasitas: { type: Number, required: true },
  gambar: [{ type: String, required: true }], // Array of strings untuk menyimpan path gambar
  harga: { type: Number, required: true },
  merek: { type: String, required: true },
});

const Armada = mongoose.model("Armada", armadaSchema);

export default Armada;
