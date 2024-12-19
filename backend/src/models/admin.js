// src/models/admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  alamat: { type: String, required: true },
  noTelepon: { type: String, required: true },
  foto: { type: String }, // Menyimpan path foto admin
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
