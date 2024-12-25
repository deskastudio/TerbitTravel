import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

// Definisi manual untuk __dirname dalam modul ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Login admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Menambah admin
export const addAdmin = async (req, res) => {
  const { nama, email, password, alamat, noTelepon } = req.body;
  const foto = req.file ? `/uploads/admin/${req.file.filename}` : "";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      nama,
      email,
      password: hashedPassword,
      foto,
      alamat,
      noTelepon,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding admin", error });
  }
};

// Menghapus admin
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  console.log("Delete request for admin ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid ID format");
    return res.status(400).json({ message: "Invalid admin ID format" });
  }

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      console.log("Admin not found");
      return res.status(404).json({ message: "Admin not found" });
    }

    console.log("Admin found:", admin);

    if (admin.foto) {
      const filePath = path.join(__dirname, "../../", admin.foto);
      console.log("Attempting to delete file:", filePath);

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log("File deleted successfully");
      } else {
        console.log("File not found:", filePath);
      }
    }

    await admin.deleteOne();
    console.log("Admin deleted successfully");
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res
      .status(500)
      .json({ message: "Error deleting admin", error: error.message });
  }
};

// Mendapatkan semua admin
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin data", error });
  }
};

// Mendapatkan admin berdasarkan ID
export const getAdminById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid admin ID format" });
  }

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin by ID", error });
  }
};

// Update admin
export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { nama, email, password, alamat, noTelepon } = req.body;
  const foto = req.file ? `/uploads/admin/${req.file.filename}` : "";

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid admin ID format" });
  }

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Hapus file gambar lama jika file baru diunggah
    if (foto && admin.foto) {
      const oldFilePath = path.join(__dirname, "../../", admin.foto);
      console.log("Attempting to delete old file:", oldFilePath);

      if (fs.existsSync(oldFilePath)) {
        await fs.promises.unlink(oldFilePath);
        console.log("Old file deleted successfully");
      } else {
        console.log("Old file not found:", oldFilePath);
      }
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    admin.nama = nama || admin.nama;
    admin.email = email || admin.email;
    admin.foto = foto || admin.foto;
    admin.alamat = alamat || admin.alamat;
    admin.noTelepon = noTelepon || admin.noTelepon;

    await admin.save();
    res
      .status(200)
      .json({ message: "Admin updated successfully", data: admin });
  } catch (error) {
    console.error("Error updating admin:", error);
    res
      .status(500)
      .json({ message: "Error updating admin", error: error.message });
  }
};
