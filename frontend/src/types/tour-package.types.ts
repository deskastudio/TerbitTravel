// tour-package.types.ts dengan perbaikan

export interface ITourPackageInput {
  nama: string;
  deskripsi: string;
  include: string[];
  exclude: string[];
  jadwal: Schedule[];
  status: TourPackageStatus;
  durasi: string;
  harga: number;
  destination: string; // Hanya ID dari destinasi
  hotel: string; // Hanya ID dari hotel
  armada: string; // Hanya ID dari armada
  consume: string; // Hanya ID dari konsumsi
  kategori: string; // Hanya ID dari kategori
  foto?: string[]; // Tambahkan field foto yang optional
}

export interface Schedule {
  tanggalAwal: string;
  tanggalAkhir: string;
  status: "tersedia" | "tidak tersedia";
  keterangan?: string; // Keterangan tambahan untuk jadwal
}

export interface exclude {
  _id: string;
}

export interface include {
  _id: string;
}

export type TourPackageStatus =
  | "available"
  | "booked"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface IDestination {
  _id: string;
  nama: string;
  lokasi: string;
  // tambahkan properti opsional untuk foto dan deskripsi
  foto?: string[];
  deskripsi?: string;
}

export interface IPackageCategory {
  _id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  // tambahkan properti opsional
  deskripsi?: string;
  icon?: string;
}

// Tambahkan interface untuk ulasan
export interface IReview {
  _id: string;
  packageId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  komentar: string;
  tanggal: string;
}

// Tambahkan interface untuk user
export interface IUser {
  _id: string;
  nama: string;
  email: string;
  telepon: string;
  alamat?: string;
  foto?: string;
}

// Gabungkan definisi ITourPackageInput dan ITourPackage
export interface ITourPackage {
  _id: string; // ID unik untuk paket wisata
  nama: string;
  deskripsi: string;
  include: string[];
  exclude: string[];
  jadwal: Schedule[]; // Daftar jadwal perjalanan
  status: TourPackageStatus; // Status paket wisata
  durasi: string;
  harga: number;
  destination: IDestination; // Objek lengkap destinasi
  hotel: IHotel; // Objek lengkap hotel
  armada: IArmada; // Objek lengkap armada
  consume: IConsumption; // Objek lengkap konsumsi
  kategori: IPackageCategory; // Objek lengkap kategori
  createdAt: string; // Waktu pembuatan paket
  updatedAt: string; // Waktu terakhir pembaruan paket
  // Deprecated: Use destination.foto instead
  foto?: string[]; // Array URL foto paket wisata
  // For backward compatibility
  imageUrl?: string; // URL gambar utama paket wisata
  // Additional optional properties
  minimalPeserta?: number; // Minimal peserta
  deskripsiTambahan?: string; // Deskripsi tambahan
  isFavorite?: boolean; // Flag untuk status favorit (client-side only)
}

// Interface untuk data booking
export interface IBooking {
  _id: string;
  userId: string;
  packageId: string;
  package: ITourPackage;
  tanggalAwal: string;
  tanggalAkhir: string;
  jumlahPeserta: number;
  totalHarga: number;
  status: BookingStatus;
  pembayaran: {
    metode: PaymentMethod;
    status: PaymentStatus;
    tanggal?: string;
    buktiPembayaran?: string;
  };
  userData: {
    nama: string;
    email: string;
    telepon: string;
    alamat?: string;
    instansi?: string;
    catatan?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Interface untuk booking status
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

// Interface untuk payment method
export type PaymentMethod =
  | "bank_transfer"
  | "e_wallet"
  | "credit_card"
  | "cash";

// Interface untuk payment status
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IHotel {
  _id: string;
  nama: string;
  alamat: string;
  gambar: string[]; // Sesuai dengan field di database
  bintang: number;
  harga: number;
  fasilitas: string[];
}

export interface IArmada {
  _id: string;
  nama: string;
  kapasitas: string[]; // Sesuai dengan field di database - array string
  gambar: string[]; // Sesuai dengan field di database
  harga: number;
  merek: string;
}

export interface IConsumption {
  _id: string;
  nama: string;
  harga: number;
  lauk: string[]; // Sesuai dengan field di database
}
