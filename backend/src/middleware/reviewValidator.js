// Middleware untuk validasi data review
export const validateReviewData = (req, res, next) => {
  const { nama, isi } = req.body;

  if (!nama || nama.trim() === "") {
    return res.status(400).json({ message: "Nama is required" });
  }

  if (!isi || isi.trim() === "") {
    return res.status(400).json({ message: "Isi review is required" });
  }

  next();
};
