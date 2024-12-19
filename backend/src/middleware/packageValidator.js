export const validatePackageData = (req, res, next) => {
  let {
    nama,
    deskripsi,
    include,
    exclude,
    harga,
    status,
    destination,
    hotel,
    armada,
    consume,
  } = req.body;

  // Pastikan include dan exclude adalah array (jika dikirim sebagai string, split menggunakan koma)
  if (typeof include === "string") {
    include = include.split(",").map((item) => item.trim());
  }
  if (typeof exclude === "string") {
    exclude = exclude.split(",").map((item) => item.trim());
  }

  // Validasi keberadaan semua field
  if (
    !nama ||
    !deskripsi ||
    !include ||
    !exclude ||
    !harga ||
    !destination ||
    !hotel ||
    !armada ||
    !consume
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validasi bahwa include dan exclude adalah array
  if (!Array.isArray(include) || !Array.isArray(exclude)) {
    return res
      .status(400)
      .json({ message: "'include' and 'exclude' must be arrays" });
  }

  // Validasi bahwa status memiliki nilai valid
  if (status && !["available", "sold out"].includes(status)) {
    return res
      .status(400)
      .json({ message: "'status' must be 'available' or 'sold out'" });
  }

  // Validasi bahwa harga adalah angka positif
  if (isNaN(harga) || harga <= 0) {
    return res
      .status(400)
      .json({ message: "'harga' must be a positive number" });
  }

  // Simpan data yang sudah diproses kembali ke req.body
  req.body.include = include;
  req.body.exclude = exclude;

  next(); // Melanjutkan ke proses berikutnya jika semua validasi lolos
};
