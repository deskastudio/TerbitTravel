import * as z from "zod";

export const tourPackageSchema = z.object({
  nama: z.string().min(1, "Nama paket wajib diisi"),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
  include: z.array(z.string()),
  exclude: z.array(z.string()),
  jadwal: z.array(z.object({
    tanggalAwal: z.string(),
    tanggalAkhir: z.string(),
    status: z.string()
  })),
  status: z.string(),
  durasi: z.string().min(1, "Durasi wajib diisi"),
  harga: z.number().min(0, "Harga tidak boleh negatif"),
  destination: z.string().min(1, "Destinasi wajib dipilih"),
  hotel: z.string().min(1, "Hotel wajib dipilih"),
  armada: z.string().min(1, "Transportasi wajib dipilih"),
  consume: z.string().min(1, "Konsumsi wajib dipilih"),
  kategori: z.string().optional()
});