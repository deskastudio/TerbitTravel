import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import User from "../models/user.js";

// Definisi manual untuk __dirname dalam modul ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register user
export const registerUser = async (req, res) => {
  const { nama, email, password, alamat, noTelp, instansi } = req.body;
  const foto = req.file ? `/uploads/user/${req.file.filename}` : ""; // Foto opsional

  if (!nama || !email || !password || !alamat || !noTelp) {
    return res.status(400).json({ message: "Semua field diperlukan." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      nama,
      email,
      password: hashedPassword,
      alamat,
      noTelp,
      instansi,
      foto,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.foto) {
      const filePath = path.join(__dirname, "../../", user.foto);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(userId, "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user by ID", error });
  }
};

// Update user
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { nama, email, alamat, noTelp, instansi } = req.body;
  const foto = req.file ? `/uploads/user/${req.file.filename}` : "";

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (foto && user.foto) {
      const oldFilePath = path.join(__dirname, "../../", user.foto);
      if (fs.existsSync(oldFilePath)) {
        await fs.promises.unlink(oldFilePath);
      }
    }

    user.nama = nama || user.nama;
    user.email = email || user.email;
    user.alamat = alamat || user.alamat;
    user.noTelp = noTelp || user.noTelp;
    user.instansi = instansi || user.instansi;
    user.foto = foto || user.foto;

    await user.save();
    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};
