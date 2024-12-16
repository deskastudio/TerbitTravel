// src/models/consumeModel.js
import mongoose from "mongoose";

const consumeSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    harga: {
      type: Number,
      required: true,
    },
    lauk: {
      type: [String], // Array of strings
      required: true,
    },
  },
  { timestamps: true }
);

const Consume = mongoose.model("Consume", consumeSchema);

export default Consume;
