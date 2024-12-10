import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  deskripsi: { type: String, required: true },
  gambar: [{ type: String, required: true }], // Array untuk menyimpan path gambar
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
