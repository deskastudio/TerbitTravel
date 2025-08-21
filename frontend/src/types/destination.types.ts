// types/destination.types.ts

export interface IDestination {
  _id: string;
  nama: string;
  lokasi: string;
  deskripsi: string;
  foto: string[];
  category?: IDestinationCategory | string; // Optional - could be populated object, ObjectId string, or undefined
  createdAt?: string;
  updatedAt?: string;
}

export interface IDestinationInput {
  nama: string;
  lokasi: string;
  deskripsi: string;
  category?: string; // Optional category
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
