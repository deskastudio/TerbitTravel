export interface IHotel {
  _id: string;
  nama: string;
  alamat: string;
  gambar: string[];
  bintang: number;
  harga: number;
  fasilitas: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IHotelInput {
  nama: string;
  alamat: string;
  bintang: number;
  harga: number;
  fasilitas: string[];
}

export type HotelResponse = {
  message: string;
  data: IHotel;
};

export type HotelsResponse = {
  data: IHotel[];
  message?: string;
};

export type HotelError = {
  message: string;
  error?: string;
};