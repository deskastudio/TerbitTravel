// middleware/validatePackageData.js
export const validatePackageData = (req, res, next) => {
  let { include, exclude, jadwal } = req.body;

  // Konversi string ke array jika perlu
  if (typeof include === "string") {
    include = include.split(",").map((item) => item.trim());
    req.body.include = include;
  }

  if (typeof exclude === "string") {
    exclude = exclude.split(",").map((item) => item.trim());
    req.body.exclude = exclude;
  }

  if (typeof jadwal === "string") {
    try {
      jadwal = JSON.parse(jadwal); // Jika dikirim sebagai JSON string, parsing ke array
      req.body.jadwal = jadwal;
    } catch (error) {
      return res
        .status(400)
        .json({ message: "'jadwal' must be an array or valid JSON" });
    }
  }

  // Validasi ulang bahwa include, exclude, dan jadwal adalah array
  if (!Array.isArray(include) || !Array.isArray(exclude)) {
    return res
      .status(400)
      .json({ message: "'include' and 'exclude' must be arrays" });
  }

  if (!Array.isArray(jadwal)) {
    return res.status(400).json({ message: "'jadwal' must be an array" });
  }

  // Validasi format jadwal
  if (jadwal.some((item) => !item.tanggalAwal || !item.tanggalAkhir)) {
    return res.status(400).json({
      message:
        "Each 'jadwal' item must include 'tanggalAwal' and 'tanggalAkhir'",
    });
  }

  next();
};
