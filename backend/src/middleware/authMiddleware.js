import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/admin.js";
import User from "../models/user.js";

// Middleware untuk otentikasi admin saat login
export const authenticateAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari admin berdasarkan email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Buat token JWT dengan role
    const token = jwt.sign(
      { id: admin._id, role: admin.role }, // Menyertakan role dalam payload
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h", // Token valid untuk 1 jam
      }
    );

    res.status(200).json({
      message: "Admin login successful",
      token, // Kirimkan token JWT
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Middleware untuk otentikasi user saat login
export const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user._id, role: "user" }, // Role default user
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    res.status(200).json({
      message: "User login successful",
      token, // Kirimkan token JWT
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Middleware untuk verifikasi JWT
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Ambil token Bearer
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication failed: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi token
    req.userId = decoded.id; // Simpan userId dari token ke req
    req.userRole = decoded.role; // Simpan role dari token ke req
    next(); // Lanjutkan ke controller berikutnya
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed: Invalid or expired token",
      error,
    });
  }
};

// Middleware tambahan untuk memeriksa role
export const checkRole = (role) => (req, res, next) => {
  if (req.userRole !== role) {
    return res
      .status(403)
      .json({
        message: `Access denied: Only ${role} can perform this action.`,
      });
  }
  next();
};
