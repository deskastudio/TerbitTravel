export function parseKapasitas(req, res, next) {
  if (req.body.kapasitas) {
    if (typeof req.body.kapasitas === "string") {
      req.body.kapasitas = req.body.kapasitas
        .split(",")
        .map((item) => parseInt(item.trim(), 10)); // Mengonversi string ke angka
    } else if (Array.isArray(req.body.kapasitas)) {
      req.body.kapasitas = req.body.kapasitas.map((item) => parseInt(item, 10)); // Mengonversi array string ke angka
    }
  }
  next(); // Melanjutkan ke middleware berikutnya
}
