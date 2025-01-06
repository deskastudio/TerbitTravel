import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  deskripsi: { type: String, required: true },
  visi: { type: String, required: true },
  misi: { type: String, required: true },
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
