import Admin from "../models/admin.js";
import bcrypt from "bcrypt";

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
    res.status(200).json({ message: "Admin login successful", admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

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

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "-password"); // Menyembunyikan password
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin data", error });
  }
};
