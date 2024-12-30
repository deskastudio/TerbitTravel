import Profile from "../models/profile.js";

// Tambah profil baru
export const addProfile = async (req, res) => {
  try {
    const { nama, deskripsi } = req.body;
    const gambar = req.files.map((file) => file.path);

    const newProfile = new Profile({ nama, deskripsi, gambar });
    await newProfile.save();

    res
      .status(201)
      .json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    res.status(500).json({ message: "Failed to create profile", error });
  }
};

// Ambil semua profil
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profiles", error });
  }
};

// Perbarui profil
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi } = req.body;
    const gambar = req.files.map((file) => file.path);

    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { nama, deskripsi, gambar },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};

// Hapus profil
export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProfile = await Profile.findByIdAndDelete(id);

    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete profile", error });
  }
};
