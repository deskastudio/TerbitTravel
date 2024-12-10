import Profile from "../models/profile.js";

// Tambah profil baru
export const addProfile = async (req, res) => {
  try {
    const { nama, deskripsi } = req.body;
    const gambar = req.files ? req.files.map((file) => file.path) : [];

    if (gambar.length === 0) {
      return res.status(400).json({ message: "Gambar is required" });
    }

    const newProfile = new Profile({ nama, deskripsi, gambar });
    await newProfile.save();
    res
      .status(201)
      .json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create profile", error: error.message });
  }
};

// Ambil semua profil
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch profiles", error: error.message });
  }
};

// Perbarui profil
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi } = req.body;
    const gambar = req.files ? req.files.map((file) => file.path) : undefined;

    const updatedData = {
      nama,
      deskripsi,
      ...(gambar && { gambar }), // Hanya update gambar jika ada
    };

    const updatedProfile = await Profile.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
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
    res
      .status(500)
      .json({ message: "Failed to delete profile", error: error.message });
  }
};
