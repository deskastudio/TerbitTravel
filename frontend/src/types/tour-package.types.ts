export interface ITourPackageInput {
  nama: string;
  deskripsi: string;
  include: string[];
  exclude: string[];
  jadwal: Schedule[];
  status: TourPackageStatus;
  durasi: string;
  harga: number;
  destination: string;  // Hanya ID dari destinasi
  hotel: string;        // Hanya ID dari hotel
  armada: string;       // Hanya ID dari armada
  consume: string;      // Hanya ID dari konsumsi
  kategori: string;     // Hanya ID dari kategori
}

export interface Schedule {
  tanggalAwal: string;
  tanggalAkhir: string;
  status: "tersedia" | "tidak tersedia";
}

export interface exclude {
  _id: string;
}

export interface include {
  _id: string;
}


type TourPackageStatus = 
  | "available" 
  | "booked" 
  | "in_progress" 
  | "completed" 
  | "cancelled";

export interface IDestination {
  _id: string;
  nama: string;
  lokasi: string;
}

export interface IHotel {
  _id: string;
  nama: string;
  bintang: number;
}

export interface IArmada {
  _id: string;
  nama: string;
  kapasitas: number;
}

export interface IConsumption {
  _id: string;
  nama: string;
}

export interface IPackageCategory {
  _id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

// Gabungkan definisi ITourPackageInput dan ITourPackage
export interface ITourPackage {
  _id: string;  // ID unik untuk paket wisata
  nama: string;
  deskripsi: string;
  include: string[];
  exclude: string[];
  jadwal: Schedule[];  // Daftar jadwal perjalanan
  status: TourPackageStatus;  // Status paket wisata
  durasi: string;
  harga: number;
  destination: IDestination;  // Objek lengkap destinasi
  hotel: IHotel;  // Objek lengkap hotel
  armada: IArmada;  // Objek lengkap armada
  consume: IConsumption;  // Objek lengkap konsumsi
  kategori: IPackageCategory;  // Objek lengkap kategori
  createdAt: string;  // Waktu pembuatan paket
  updatedAt: string;  // Waktu terakhir pembaruan paket
}
