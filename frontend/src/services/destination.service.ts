// services/destination.service.ts

import axiosInstance from "@/lib/axios";
import {
  IDestination,
  IDestinationInput,
  DestinationResponse,
  IDestinationCategory,
  DestinationsResponse,
} from "@/types/destination.types";

const DESTINATION_BASE_URL = "/destination";
const CATEGORY_BASE_URL = "/destination-category";

export const DestinationService = {
  getAllDestinations: async (): Promise<IDestination[]> => {
    try {
      console.log(
        "🚀 Fetching destinations from:",
        `${DESTINATION_BASE_URL}/getAll`
      );
      const response = await axiosInstance.get<
        IDestination[] | DestinationsResponse
      >(`${DESTINATION_BASE_URL}/getAll`);

      console.log("📥 Raw response:", response);
      console.log("📊 Response data type:", typeof response.data);
      console.log("📊 Response data:", response.data);

      // Handle both cases: API returning array directly or wrapped in a data property
      if (Array.isArray(response.data)) {
        console.log("✅ Response is array, length:", response.data.length);
        // ✅ Add data validation
        const validDestinations = response.data.filter((dest) => {
          const isValid = dest && dest._id && dest.nama;
          if (!isValid) {
            console.warn("⚠️ Invalid destination found:", dest);
          }
          return isValid;
        });
        console.log("✅ Valid destinations:", validDestinations.length);
        return validDestinations;
      } else if (response.data && "data" in response.data) {
        console.log(
          "✅ Response is wrapped object, data length:",
          response.data.data?.length
        );
        const destinations = response.data.data || [];
        // ✅ Add data validation
        const validDestinations = destinations.filter((dest) => {
          const isValid = dest && dest._id && dest.nama;
          if (!isValid) {
            console.warn("⚠️ Invalid destination found:", dest);
          }
          return isValid;
        });
        console.log("✅ Valid destinations:", validDestinations.length);
        return validDestinations;
      }

      console.error("❌ Unexpected API response format:", response.data);
      return [];
    } catch (error) {
      console.error("❌ Error fetching destinations:", error);
      throw error;
    }
  },

  getDestinationById: async (id: string): Promise<IDestination> => {
    try {
      const response = await axiosInstance.get<
        IDestination | DestinationResponse
      >(`${DESTINATION_BASE_URL}/${id}`);

      // Check if response has 'data' property (response wrapped in object)
      if (
        response.data &&
        typeof response.data === "object" &&
        "data" in response.data
      ) {
        // This handles cases where API returns { data: IDestination }
        return response.data.data;
      }

      // Direct response case where API returns IDestination directly
      return response.data as IDestination;
    } catch (error) {
      console.error(`Error fetching destination with id ${id}:`, error);
      throw error;
    }
  },

  createDestination: async (
    data: IDestinationInput,
    images: File[]
  ): Promise<DestinationResponse> => {
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

  updateDestination: async (
    id: string,
    data: IDestinationInput,
    files?: File[]
  ): Promise<DestinationResponse> => {
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
    try {
      const response = await axiosInstance.get<
        IDestinationCategory[] | { data: IDestinationCategory[] }
      >(`${CATEGORY_BASE_URL}/get`);

      // Handle both response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && "data" in response.data) {
        return response.data.data;
      }

      console.error(
        "Unexpected API response format for categories:",
        response.data
      );
      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  createCategory: async (
    title: string
  ): Promise<{ message: string; data: IDestinationCategory }> => {
    const response = await axiosInstance.post(`${CATEGORY_BASE_URL}/add`, {
      title,
    });
    return response.data;
  },

  updateCategory: async (
    id: string,
    title: string
  ): Promise<{ message: string; data: IDestinationCategory }> => {
    const response = await axiosInstance.put(
      `${CATEGORY_BASE_URL}/update/${id}`,
      { title }
    );
    return response.data;
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(
      `${CATEGORY_BASE_URL}/delete/${id}`
    );
    return response.data;
  },
};
