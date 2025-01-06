// models/destination.js
import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    lokasi: { type: String, required: true },
    deskripsi: { type: String, required: true },
    foto: [{ type: String, required: true }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DestinationCategory",
      required: true,
    },
  },
  { timestamps: true }
);

const Destination = mongoose.model("Destination", destinationSchema);
export default Destination;
