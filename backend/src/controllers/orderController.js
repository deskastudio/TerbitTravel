// Definisikan fungsi calculateTotalPrice langsung di controller
const calculateTotalPrice = (hargaPerOrang, jumlahPeserta) => {
  return hargaPerOrang * jumlahPeserta;
};

import Order from "../models/order.js";
import User from "../models/user.js";
import Package from "../models/package.js";
import Armada from "../models/armada.js";

// Fungsi untuk validasi dan membuat order
const validateAndCreateOrder = async (req, res, role) => {
  try {
    const { userId, packageId, armadaId, jumlahPeserta, nomorIdentitas } =
      req.body;

    if (
      !userId ||
      !packageId ||
      !armadaId ||
      !jumlahPeserta ||
      !nomorIdentitas
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (jumlahPeserta <= 0) {
      return res
        .status(400)
        .json({ message: "Jumlah peserta harus lebih dari 0." });
    }

    const user = await User.findById(userId);
    const packageData = await Package.findById(packageId);
    const armada = await Armada.findById(armadaId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!packageData) {
      return res.status(404).json({ message: "Package not found." });
    }

    if (!armada) {
      return res.status(404).json({ message: "Armada not found." });
    }

    const harga = calculateTotalPrice(packageData.harga, jumlahPeserta);

    const order = new Order({
      userId: user._id,
      packageId: packageData._id,
      armadaId: armada._id,
      jumlahPeserta,
      harga,
      nomorIdentitas,
      status: "pending",
      createdBy: role, // Track who created the order
    });

    await order.save();
    res.status(201).json({ message: "Order created successfully.", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create order.", error: error.message });
  }
};

// Add order by user
export const addOrderByUser = async (req, res) => {
  await validateAndCreateOrder(req, res, "user");
};

// Add order by admin
export const addOrderByAdmin = async (req, res) => {
  await validateAndCreateOrder(req, res, "admin");
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "nama email noTelp instansi")
      .populate("packageId", "nama jadwal harga")
      .populate("armadaId", "kapasitas nama")
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders.", error: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("userId", "nama email noTelp instansi")
      .populate("packageId", "nama jadwal harga")
      .populate("armadaId", "kapasitas nama")
      .exec();

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch order.", error: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete order.", error: error.message });
  }
};
