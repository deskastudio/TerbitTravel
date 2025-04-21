import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import User from "../models/user.js";
import { sendOTPEmail } from "../config/emailConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (user, temp = false) => {
  return jwt.sign(
    { id: user._id, role: "user", temp },
    process.env.JWT_SECRET,
    { expiresIn: temp ? "1h" : process.env.JWT_EXPIRES_IN || "1h" }
  );
};

export const registerUser = async (req, res) => {
  const { nama, email, password, alamat, noTelp, instansi } = req.body;
  const foto = req.file ? `/uploads/user/${req.file.filename}` : "";

  if (!nama || !email || !password || !alamat || !noTelp) {
    return res.status(400).json({ message: "Semua field diperlukan." });
  }

  try {
    // Cek user yang sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Kirim email OTP
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      return res.status(500).json({ 
        message: "Gagal mengirim email OTP. Silakan coba lagi." 
      });
    }

    // Buat user baru
    const newUser = new User({
      nama,
      email,
      password,
      alamat,
      noTelp,
      instansi,
      foto,
      otp,
      otpExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isVerified: false,
    });

    await newUser.save();

    res.status(201).json({
      message: "Registrasi berhasil. Silakan cek email Anda untuk kode OTP.",
      email: email // Mengembalikan email untuk digunakan di frontend
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: "Error dalam registrasi user", 
      error: error.message 
    });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user, !user.alamat || !user.noTelp);

    if (!user.alamat || !user.noTelp) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/lengkapi-profil?token=${token}`
      );
    }

    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/failure`);
  }
};

export const lengkapiProfil = async (req, res) => {
  try {
    const { userId } = req.params;
    const { alamat, noTelp, instansi } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        alamat,
        noTelp,
        instansi,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "Profil berhasil dilengkapi",
      token,
      user: {
        id: user._id,
        nama: user.nama,
        email: user.email,
        foto: user.foto,
        alamat: user.alamat,
        noTelp: user.noTelp,
        instansi: user.instansi,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal melengkapi profil", error });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Kode OTP tidak valid atau sudah kedaluwarsa.",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user);
    res.status(200).json({
      message: "Email berhasil diverifikasi.",
      token,
      user: {
        id: user._id,
        nama: user.nama,
        email: user.email,
        foto: user.foto,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error dalam verifikasi OTP", error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Email atau password salah." });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message:
          "Email belum diverifikasi. Silakan cek email Anda atau minta kode OTP baru.",
      });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        nama: user.nama,
        email: user.email,
        foto: user.foto,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email tidak terdaftar." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email sudah terverifikasi." });
    }

    const otp = generateOTP();
    
    // Kirim email OTP baru
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      return res.status(500).json({ 
        message: "Gagal mengirim ulang OTP. Silakan coba lagi." 
      });
    }

    // Update OTP di database
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    res.status(200).json({
      message: "Kode OTP baru telah dikirim ke email Anda.",
      email: email
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ 
      message: "Error dalam mengirim ulang OTP", 
      error: error.message 
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password -otp -otpExpires");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(userId, "-password -otp -otpExpires");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user by ID", error });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { nama, email, alamat, noTelp, instansi } = req.body;
  const foto = req.file ? `/uploads/user/${req.file.filename}` : "";

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (foto && user.foto && !user.foto.startsWith("http")) {
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
    if (foto) user.foto = foto;

    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        nama: user.nama,
        email: user.email,
        foto: user.foto,
        alamat: user.alamat,
        noTelp: user.noTelp,
        instansi: user.instansi,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.foto && !user.foto.startsWith("http")) {
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
