import Review from "../models/Review.js";

// Tambah Review Baru (untuk semua user)
export const addReview = async (req, res) => {
  try {
    const { nama, isi } = req.body;

    // Membuat instance baru Review
    const newReview = new Review({
      nama,
      isi,
    });

    // Simpan review ke database
    await newReview.save();

    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ message: "Failed to add review", error });
  }
};

// Ambil Semua Review (untuk semua user)
export const getAllReviews = async (req, res) => {
  try {
    // Mengambil semua review yang statusnya visible
    const reviews = await Review.find({ status: "visible" }).sort({
      tanggal: -1,
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
};

// Menampilkan/Sembunyikan Review (untuk admin)
export const toggleReviewVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected: 'visible' or 'hidden'

    // Hanya admin yang bisa melakukan ini
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          message: "You do not have permission to perform this action.",
        });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Mengembalikan review yang sudah di-update
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res
      .status(200)
      .json({ message: `Review status updated to ${status}`, review });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update review visibility", error });
  }
};

// Hapus Review (untuk admin)
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Hanya admin yang bisa menghapus
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          message: "You do not have permission to perform this action.",
        });
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review", error });
  }
};
