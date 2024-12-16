import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Mengimpor jwt untuk membuat token

// Login admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Buat token JWT dengan role dan ID admin
    const token = jwt.sign(
      { id: admin._id, role: admin.role }, // Menyertakan id dan role admin
      process.env.JWT_SECRET, // Menggunakan secret key yang ada di .env
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h", // Durasi token 1 jam (default)
      }
    );

    // Kirimkan token di respons
    res.status(200).json({
      message: "Admin login successful",
      token, // Kirimkan token JWT
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Menambah admin
export const addAdmin = async (req, res) => {
  const { nama, email, password } = req.body;

  try {
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      nama,
      email,
      password: hashedPassword,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding admin", error });
  }
};

// Menghapus admin
export const deleteAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin", error });
  }
};

// Mendapatkan semua data admin
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "-password"); // Menyembunyikan password
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin data", error });
  }
};
