import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  alamat: { type: String, required: true },
  noTelp: { type: String, required: true },
  instansi: { type: String },
  foto: { type: String }, // Tambahkan untuk menyimpan path gambar
});

const User = mongoose.model("User", userSchema);
export default User;
