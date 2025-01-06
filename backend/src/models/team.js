import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    photo: { type: String, required: true },
    position: { type: String, required: true },
    description: { type: String, required: true },
    facebook: { type: String },
    email: { type: String, required: true },
    instagram: { type: String },
    linkedin: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
