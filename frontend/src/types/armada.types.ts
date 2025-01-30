export interface IArmada {
    _id: string;
    nama: string;
    kapasitas: number;
    gambar: string[];
    harga: number;
    merek: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface IArmadaInput {
    nama: string;
    kapasitas: number;
    harga: number;
    merek: string;
  }
  
  export interface IArmadaCategory {
    id: string;
    name: string;
  }
  
  export type ArmadaResponse = {
    message: string;
    data: IArmada;
  };
  
  export type ArmadasResponse = {
    data: IArmada[];
    message?: string;
  };
  
  export type ArmadaError = {
    message: string;
    error?: string;
  };