import User from "../models/user.js"; // Pastikan jalur ini benar
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  const { nama, email, password, alamat, noTelp, instansi } = req.body;

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
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

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
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
// Menampilkan semua data user
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Menyembunyikan password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
};
