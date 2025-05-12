import Order from "../models/order.js";
import User from "../models/user.js";
import Package from "../models/package.js";
import Armada from "../models/armada.js";
import { createPaymentTransaction } from "../config/midtrans.js"; // Pastikan sudah mengimpor helper Midtrans

// Fungsi untuk menghitung total harga berdasarkan harga per orang dan jumlah peserta
const calculateTotalPrice = (hargaPerOrang, jumlahPeserta) => {
  return hargaPerOrang * jumlahPeserta;
};

// Fungsi untuk validasi dan membuat order
const validateAndCreateOrder = async (req, res, role) => {
  try {
    const { userId, packageId, armadaId, jumlahPeserta, nomorIdentitas } =
      req.body;

    // Validasi jika data tidak lengkap
    if (
      !userId ||
      !packageId ||
      !armadaId ||
      !jumlahPeserta ||
      !nomorIdentitas
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validasi jumlah peserta lebih dari 0
    if (jumlahPeserta <= 0) {
      return res
        .status(400)
        .json({ message: "Jumlah peserta harus lebih dari 0." });
    }

    // Ambil data user, package, dan armada
    const user = await User.findById(userId);
    const packageData = await Package.findById(packageId);
    const armada = await Armada.findById(armadaId);

    // Jika data tidak ditemukan, kembalikan error
    if (!user) return res.status(404).json({ message: "User not found." });
    if (!packageData)
      return res.status(404).json({ message: "Package not found." });
    if (!armada) return res.status(404).json({ message: "Armada not found." });

    // Hitung total harga
    const harga = calculateTotalPrice(packageData.harga, jumlahPeserta);

    // Buat order baru
    const order = new Order({
      userId: user._id,
      packageId: packageData._id,
      armadaId: armada._id,
      jumlahPeserta,
      harga,
      nomorIdentitas,
      status: "pending", // Status sementara hingga pembayaran
      createdBy: role,
    });

    // Simpan order ke database
    await order.save();

    // Populate data user dan package untuk Midtrans
    await order.populate([
      { path: "userId", select: "nama email noTelp" },
      { path: "packageId", select: "nama" },
    ]);

    // Buat transaksi di Midtrans untuk pembayaran
    const midtransResponse = await createPaymentTransaction(order);

    // Respons berhasil dengan data order dan link pembayaran Midtrans
    res.status(201).json({
      message: "Order created successfully.",
      order,
      payment: {
        token: midtransResponse.token, // Token untuk transaksi Midtrans
        redirect_url: midtransResponse.redirect_url, // URL untuk halaman pembayaran Midtrans
      },
    });
  } catch (error) {
    // Tangani error server
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
