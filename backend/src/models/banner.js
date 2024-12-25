import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    gambar: {
      type: String, // Path gambar
      required: true,
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
