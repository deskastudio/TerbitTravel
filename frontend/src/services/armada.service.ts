import axiosInstance from "@/lib/axios";
import { 
  IArmada, 
  IArmadaInput, 
  ArmadaResponse,
} from "@/types/armada.types";

const ARMADA_BASE_URL = "/armada";

export const ArmadaService = {
  getAllArmadas: async (): Promise<IArmada[]> => {
    const response = await axiosInstance.get<IArmada[]>(`${ARMADA_BASE_URL}/getAll`);
    return response.data;
  },

  getArmadaById: async (id: string): Promise<IArmada> => {
    const response = await axiosInstance.get<IArmada>(`${ARMADA_BASE_URL}/${id}`);
    return response.data;
  },

  createArmada: async (data: IArmadaInput, images: File[]): Promise<ArmadaResponse> => {
    const formData = new FormData();
    formData.append("nama", data.nama);
    formData.append("kapasitas", data.kapasitas.toString());
    formData.append("harga", data.harga.toString());
    formData.append("merek", data.merek);
    
    // Append each image to formData
    images.forEach((image) => {
      formData.append("gambar", image);
    });

    const response = await axiosInstance.post<ArmadaResponse>(
      `${ARMADA_BASE_URL}/add`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateArmada: async (id: string, data: { nama: string; kapasitas: number; harga: number; merek: string }, files?: File[]): Promise<ArmadaResponse> => {
    const formData = new FormData();
    
    // Append armada data
    formData.append("nama", data.nama.toString());
    formData.append("kapasitas", data.kapasitas.toString());
    formData.append("harga", data.harga.toString());
    formData.append("merek", data.merek.toString());

    // Append new images if any
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("gambar", file);
      });
    }

    const response = await axiosInstance.put<ArmadaResponse>(
      `${ARMADA_BASE_URL}/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteArmada: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
      `${ARMADA_BASE_URL}/delete/${id}`
    );
    return response.data;
  },
};