import Review from "../models/review.js";

// Menambah review (hanya untuk user)
export const addReview = async (req, res) => {
  try {
    const { isi } = req.body;

    if (!isi || isi.trim() === "") {
      return res.status(400).json({ message: "Isi review is required" });
    }

    const newReview = new Review({
      userId: req.userId, // User ID dari token
      isi,
      tanggal: new Date(),
    });

    await newReview.save();

    // Populate user data untuk respons
    const populatedReview = await Review.findById(newReview._id).populate(
      "userId",
      "nama"
    );

    res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error });
  }
};

// Menghapus review (hanya admin)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};

// Menampilkan semua review (bebas akses)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("userId", "nama");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Menampilkan review berdasarkan ID user yang login
export const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Cari review berdasarkan ID dan pastikan review milik user yang login
    const review = await Review.findOne({
      _id: reviewId,
      userId: req.userId,
    }).populate("userId", "nama");

    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found or not belonging to you" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error fetching review", error });
  }
};
