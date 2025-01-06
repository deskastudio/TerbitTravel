import Profile from "../models/profile.js";

// Tambah profil baru (hanya jika belum ada)
export const addProfile = async (req, res) => {
  try {
    const existingProfile = await Profile.findOne();
    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists. Use update to modify the profile.",
      });
    }

    const { deskripsi, visi, misi } = req.body;

    const newProfile = new Profile({ deskripsi, visi, misi });
    await newProfile.save();

    res
      .status(201)
      .json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    res.status(500).json({ message: "Failed to create profile", error });
  }
};

// Ambil profil (hanya ada satu)
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error });
  }
};

// Perbarui profil
export const updateProfile = async (req, res) => {
  try {
    const { deskripsi, visi, misi } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { deskripsi, visi, misi },
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
