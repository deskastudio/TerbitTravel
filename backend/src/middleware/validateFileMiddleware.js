export const validateFileMiddleware = (req, res, next) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "File is required" });
  }

  // Validasi ekstensi file
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const ext = file.originalname
    .toLowerCase()
    .slice(file.originalname.lastIndexOf("."));
  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({
      message: "Invalid file type. Only JPG, JPEG, and PNG are allowed.",
    });
  }

  // Validasi ukuran file
  if (file.size > 2 * 1024 * 1024) {
    return res.status(400).json({ message: "File size cannot exceed 2MB." });
  }

  next();
};
