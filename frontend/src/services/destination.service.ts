// services/destination.service.ts

import axiosInstance from "@/lib/axios";
import { 
  IDestination,
  IDestinationInput,
  DestinationResponse,
  IDestinationCategory
} from "@/types/destination.types";

const DESTINATION_BASE_URL = "/destination";
const CATEGORY_BASE_URL = "/destination-category";

export const DestinationService = {
  getAllDestinations: async (): Promise<IDestination[]> => {
    const response = await axiosInstance.get<IDestination[]>(`${DESTINATION_BASE_URL}/getAll`);
    return response.data;
  },

  getDestinationById: async (id: string): Promise<IDestination> => {
    const response = await axiosInstance.get<IDestination>(`${DESTINATION_BASE_URL}/${id}`);
    return response.data;
  },

  createDestination: async (data: IDestinationInput, images: File[]): Promise<DestinationResponse> => {
    const formData = new FormData();
    formData.append("nama", data.nama);
    formData.append("lokasi", data.lokasi);
    formData.append("deskripsi", data.deskripsi);
    formData.append("category", data.category);
    
    // Append each image to formData
    images.forEach((image) => {
      formData.append("foto", image);
    });

    const response = await axiosInstance.post<DestinationResponse>(
      `${DESTINATION_BASE_URL}/add`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateDestination: async (id: string, data: IDestinationInput, files?: File[]): Promise<DestinationResponse> => {
    const formData = new FormData();
    
    // Append destination data
    formData.append("nama", data.nama);
    formData.append("lokasi", data.lokasi);
    formData.append("deskripsi", data.deskripsi);
    formData.append("category", data.category);

    // Append new images if any
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("foto", file);
      });
    }

    const response = await axiosInstance.put<DestinationResponse>(
      `${DESTINATION_BASE_URL}/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteDestination: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
      `${DESTINATION_BASE_URL}/delete/${id}`
    );
    return response.data;
  },

  // Category Services
  getAllCategories: async (): Promise<IDestinationCategory[]> => {
    const response = await axiosInstance.get<IDestinationCategory[]>(`${CATEGORY_BASE_URL}/get`);
    return response.data;
  },

  createCategory: async (title: string): Promise<{ message: string; data: IDestinationCategory }> => {
    const response = await axiosInstance.post(`${CATEGORY_BASE_URL}/add`, { title });
    return response.data;
  },

  updateCategory: async (id: string, title: string): Promise<{ message: string; data: IDestinationCategory }> => {
    const response = await axiosInstance.put(`${CATEGORY_BASE_URL}/update/${id}`, { title });
    return response.data;
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`${CATEGORY_BASE_URL}/delete/${id}`);
    return response.data;
  }
};