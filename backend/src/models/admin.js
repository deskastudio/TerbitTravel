import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" }, // Tambahkan field role
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
