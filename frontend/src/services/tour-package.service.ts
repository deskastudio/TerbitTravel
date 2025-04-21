// services/tour-package.service.ts

import axios from "@/lib/axios";
import {
  ITourPackage,
  ITourPackageInput,
  IDestination,
  IHotel,
  IArmada,
  IConsumption,
  IPackageCategory,
} from "@/types/tour-package.types";

export class TourPackageService {
  // ========================
  //     Paket Wisata
  // ========================
  static async getAllPackages(): Promise<ITourPackage[]> {
    const response = await axios.get("/package"); // Ubah dari "/package/getAll"
    return response.data;
  }

  static async createPackage(data: ITourPackageInput): Promise<ITourPackage> {
    try {
      const response = await axios.post("/package", {
        ...data,
        jadwal: data.jadwal.map(schedule => ({
          ...schedule,
          tanggalAwal: new Date(schedule.tanggalAwal).toISOString(),
          tanggalAkhir: new Date(schedule.tanggalAkhir).toISOString()
        }))
      });
      return response.data;
    } catch (error) {
      console.error('Request payload:', data);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }

  static async getPackageById(id: string): Promise<ITourPackage> {
    const response = await axios.get(`/package/${id}`);
    return response.data;
  }

  static async updatePackage(
    id: string,
    data: Partial<ITourPackageInput>
  ): Promise<ITourPackage> {
    const response = await axios.put(`/package/${id}`, data);
    return response.data;
  }

  static async deletePackage(id: string): Promise<void> {
    await axios.delete(`/package/${id}`);
  }

  // ========================
  //  Kategori Paket Wisata
  // ========================
static async getAllCategories(): Promise<IPackageCategory[]> {
  const response = await axios.get("/package-category/getAll"); // Sesuaikan dengan route
  return response.data;
}

static async createCategory(title: string): Promise<{ message: string; data: IPackageCategory }> {
  const response = await axios.post("/package-category/add", { title });
  return response.data;
}

  static async updateCategory(
    id: string,
    title: string
  ): Promise<{ message: string; data: IPackageCategory }> {
    const response = await axios.put(`/package-category/update/${id}`, {
      title,
    });
    return response.data;
  }

  static async deleteCategory(
    id: string
  ): Promise<{ message: string }> {
    const response = await axios.delete(`/package-category/delete/${id}`);
    return response.data;
  }

  // =======================================
  //  Destinasi, Hotel, Armada, Konsumsi
  // =======================================
  static async getDestinations(): Promise<IDestination[]> {
    const response = await axios.get("/destination/getAll");
    return response.data;
  }

  static async getHotels(): Promise<IHotel[]> {
    const response = await axios.get("/hotel/getAll");
    return response.data;
  }

  static async getArmada(): Promise<IArmada[]> {
    const response = await axios.get("/armada/getAll");
    return response.data;
  }

  static async getConsumptions(): Promise<IConsumption[]> {
    const response = await axios.get("/consume/getAll");
    return response.data;
  }
}
