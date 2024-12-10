import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    isi: {
      type: String,
      required: true,
    },
    tanggal: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["visible", "hidden"],
      default: "visible", // Defaultnya adalah visible
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
