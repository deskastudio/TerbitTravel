// order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    armadaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Armada",
      required: true,
    },
    jumlahPeserta: {
      type: Number,
      required: true,
    },
    nomorIdentitas: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    harga: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
