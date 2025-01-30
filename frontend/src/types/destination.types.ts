// types/destination.types.ts

export interface IDestination {
    _id: string;
    nama: string;
    lokasi: string;
    deskripsi: string;
    foto: string[];
    category: IDestinationCategory;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface IDestinationInput {
    nama: string;
    lokasi: string;
    deskripsi: string;
    category: string;
  }
  
  export interface IDestinationCategory {
    _id: string;
    title: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export type DestinationResponse = {
    message: string;
    data: IDestination;
  };
  
  export type DestinationsResponse = {
    data: IDestination[];
    message?: string;
  };
  
  export type DestinationError = {
    message: string;
    error?: string;
  };