// src/controllers/orderController.js
import BookingModel from "../models/booking.js";
import User from "../models/user.js";
import Package from "../models/package.js";

// Fungsi untuk menghitung total harga
const calculateTotalPrice = (hargaPerOrang, jumlahPeserta) => {
  return hargaPerOrang * jumlahPeserta;
};

// Fungsi untuk validasi dan membuat booking
const validateAndCreateOrder = async (req, res, role) => {
  try {
    // ✅ STEP 1: DEBUG RAW REQUEST
    console.log("🚨 === DEEP DEBUG START ===");
    console.log("🚨 Full req.body:", JSON.stringify(req.body, null, 2));
    console.log("🚨 req.body.customerInfo:", req.body.customerInfo);
    console.log(
      "🚨 Keys in customerInfo:",
      Object.keys(req.body.customerInfo || {})
    );

    const { userId, packageId, jumlahPeserta, customerInfo, selectedSchedule } =
      req.body;

    // ✅ STEP 2: DEBUG DESTRUCTURED DATA
    console.log("🚨 After destructuring:");
    console.log("🚨 customerInfo:", customerInfo);
    console.log("🚨 customerInfo.instansi:", `"${customerInfo?.instansi}"`);
    console.log("🚨 customerInfo.catatan:", `"${customerInfo?.catatan}"`);
    console.log("🚨 typeof instansi:", typeof customerInfo?.instansi);
    console.log("🚨 typeof catatan:", typeof customerInfo?.catatan);
    console.log("🚨 instansi length:", customerInfo?.instansi?.length);
    console.log("🚨 catatan length:", customerInfo?.catatan?.length);

    // ✅ STEP 3: TEST CONDITIONS
    const hasInstansi = !!(
      customerInfo?.instansi && customerInfo.instansi.trim() !== ""
    );
    const hasCatatan = !!(
      customerInfo?.catatan && customerInfo.catatan.trim() !== ""
    );
    console.log("🚨 hasInstansi condition:", hasInstansi);
    console.log("🚨 hasCatatan condition:", hasCatatan);

    console.log(`📝 Creating booking by ${role}:`, {
      packageId,
      jumlahPeserta,
      customerInfo: customerInfo?.nama,
    });

    // Validasi input dasar
    if (!packageId || !jumlahPeserta || !customerInfo) {
      return res.status(400).json({
        success: false,
        message: "Required fields: packageId, jumlahPeserta, customerInfo",
      });
    }

    // Validasi customerInfo
    if (!customerInfo.nama || !customerInfo.email || !customerInfo.telepon) {
      return res.status(400).json({
        success: false,
        message: "Customer info requires: nama, email, telepon",
      });
    }

    // Validasi jumlah peserta
    if (jumlahPeserta <= 0) {
      return res.status(400).json({
        success: false,
        message: "Jumlah peserta harus lebih dari 0",
      });
    }

    // Ambil data package dengan populate armada
    const packageData = await Package.findById(packageId)
      .populate("armada", "nama kapasitas merek")
      .populate("destination", "nama")
      .populate("hotel", "nama")
      .populate("kategori", "title");

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    // Validasi kapasitas armada (dari package.armada)
    if (packageData.armada && jumlahPeserta > packageData.armada.kapasitas) {
      return res.status(400).json({
        success: false,
        message: `Jumlah peserta (${jumlahPeserta}) melebihi kapasitas armada ${packageData.armada.nama} (${packageData.armada.kapasitas} orang)`,
      });
    }

    // Validasi schedule jika disediakan
    let bookingSchedule = null;
    if (selectedSchedule) {
      // Cari schedule yang cocok di package.jadwal
      const availableSchedule = packageData.jadwal?.find(
        (jadwal) =>
          jadwal.tanggalAwal.toISOString().split("T")[0] ===
            new Date(selectedSchedule.tanggalAwal)
              .toISOString()
              .split("T")[0] &&
          jadwal.tanggalAkhir.toISOString().split("T")[0] ===
            new Date(selectedSchedule.tanggalAkhir)
              .toISOString()
              .split("T")[0] &&
          jadwal.status === "tersedia"
      );

      if (!availableSchedule) {
        return res.status(400).json({
          success: false,
          message: "Selected schedule not available",
        });
      }

      bookingSchedule = {
        tanggalAwal: availableSchedule.tanggalAwal,
        tanggalAkhir: availableSchedule.tanggalAkhir,
      };
    } else {
      // Gunakan schedule pertama yang tersedia
      const firstAvailable = packageData.jadwal?.find(
        (jadwal) => jadwal.status === "tersedia"
      );
      if (!firstAvailable) {
        return res.status(400).json({
          success: false,
          message: "No available schedule for this package",
        });
      }

      bookingSchedule = {
        tanggalAwal: firstAvailable.tanggalAwal,
        tanggalAkhir: firstAvailable.tanggalAkhir,
      };
    }

    // Validasi user jika userId disediakan
    let user = null;
    if (userId) {
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    }

    // Hitung total harga
    const totalHarga = calculateTotalPrice(packageData.harga, jumlahPeserta);

    // ✅ STEP 4: BUILD CUSTOMER INFO WITH PROPER HANDLING
    console.log("🚨 Building customerInfo object...");

    // Base required fields
    const finalCustomerInfo = {
      nama: customerInfo.nama,
      email: customerInfo.email,
      telepon: customerInfo.telepon,
    };

    // ✅ CONDITIONAL FIELDS - MULTIPLE APPROACHES
    // Approach 1: Check and trim
    if (
      customerInfo.alamat &&
      typeof customerInfo.alamat === "string" &&
      customerInfo.alamat.trim() !== ""
    ) {
      finalCustomerInfo.alamat = customerInfo.alamat.trim();
      console.log("🚨 Added alamat:", finalCustomerInfo.alamat);
    }

    if (
      customerInfo.instansi &&
      typeof customerInfo.instansi === "string" &&
      customerInfo.instansi.trim() !== ""
    ) {
      finalCustomerInfo.instansi = customerInfo.instansi.trim();
      console.log("🚨 Added instansi:", finalCustomerInfo.instansi);
    } else {
      console.log(
        "🚨 SKIPPED instansi - value:",
        customerInfo.instansi,
        "type:",
        typeof customerInfo.instansi
      );
    }

    if (
      customerInfo.catatan &&
      typeof customerInfo.catatan === "string" &&
      customerInfo.catatan.trim() !== ""
    ) {
      finalCustomerInfo.catatan = customerInfo.catatan.trim();
      console.log("🚨 Added catatan:", finalCustomerInfo.catatan);
    } else {
      console.log(
        "🚨 SKIPPED catatan - value:",
        customerInfo.catatan,
        "type:",
        typeof customerInfo.catatan
      );
    }

    console.log(
      "🚨 FINAL customerInfo to save:",
      JSON.stringify(finalCustomerInfo, null, 2)
    );
    console.log("🚨 === DEEP DEBUG END ===");

    // ✅ STEP 5: CREATE BOOKING WITH FIXED CUSTOMER INFO
    const booking = new BookingModel({
      userId: user ? user._id : null,
      packageId: packageData._id,
      selectedSchedule: bookingSchedule,
      jumlahPeserta,
      harga: totalHarga,
      status: "pending",
      paymentStatus: "pending",
      customerInfo: finalCustomerInfo, // ✅ Use the properly built object
    });

    console.log(
      "🔍 Before save - booking.customerInfo:",
      JSON.stringify(booking.customerInfo, null, 2)
    );

    // Simpan booking ke database
    await booking.save();

    console.log(`✅ Booking created: ${booking.customId} by ${role}`);

    // ✅ STEP 6: VERIFY WHAT WAS ACTUALLY SAVED
    const savedBooking = await BookingModel.findById(booking._id);
    console.log(
      "🔍 After save - from DB:",
      JSON.stringify(savedBooking.customerInfo, null, 2)
    );

    // Response berhasil
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        bookingId: booking.customId,
        _id: booking._id,
        userId: booking.userId,
        packageInfo: {
          id: packageData._id,
          nama: packageData.nama,
          harga: packageData.harga,
          destination: packageData.destination?.nama,
          armada: packageData.armada
            ? {
                nama: packageData.armada.nama,
                kapasitas: packageData.armada.kapasitas,
                merek: packageData.armada.merek,
              }
            : null,
        },
        selectedSchedule: booking.selectedSchedule,
        customerInfo: savedBooking.customerInfo, // ✅ Return what was actually saved
        jumlahPeserta: booking.jumlahPeserta,
        harga: booking.harga,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt,
        createdBy: role,
      },
    });
  } catch (error) {
    console.error("💥 Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Add booking by user
export const addOrderByUser = async (req, res) => {
  await validateAndCreateOrder(req, res, "user");
};

// Add booking by admin
export const addOrderByAdmin = async (req, res) => {
  await validateAndCreateOrder(req, res, "admin");
};

// Get all bookings
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const bookings = await BookingModel.find(filter)
      .populate("userId", "nama email noTelp instansi")
      .populate({
        path: "packageId",
        select: "nama harga destination armada hotel",
        populate: [
          { path: "destination", select: "nama" },
          { path: "armada", select: "nama kapasitas merek" },
          { path: "hotel", select: "nama bintang" },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await BookingModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("💥 Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Get booking by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    let booking = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await BookingModel.findById(id);
    } else {
      booking = await BookingModel.findOne({ customId: id });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Populate dengan armada dari package
    await booking.populate([
      { path: "userId", select: "nama email noTelp instansi" },
      {
        path: "packageId",
        select: "nama harga destination armada hotel durasi",
        populate: [
          { path: "destination", select: "nama" },
          { path: "armada", select: "nama kapasitas merek" },
          { path: "hotel", select: "nama bintang alamat" },
        ],
      },
    ]);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("💥 Error fetching booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Update booking status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    let booking = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await BookingModel.findById(id);
    } else {
      booking = await BookingModel.findOne({ customId: id });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    if (status === "confirmed" && !booking.paymentDate) {
      booking.paymentDate = new Date();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("💥 Error updating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Delete booking
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    let booking = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await BookingModel.findByIdAndDelete(id);
    } else {
      booking = await BookingModel.findOneAndDelete({ customId: id });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("💥 Error deleting booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { userId };
    if (status) filter.status = status;

    const bookings = await BookingModel.find(filter)
      .populate({
        path: "packageId",
        select: "nama harga destination armada",
        populate: [
          { path: "destination", select: "nama" },
          { path: "armada", select: "nama kapasitas" },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await BookingModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("💥 Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};
