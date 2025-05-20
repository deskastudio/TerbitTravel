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
  // Tambahkan retry mechanism
  private static async callWithRetry<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: any;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        console.error(`API call failed (attempt ${attempt + 1}/${maxRetries}):`, error);
        lastError = error;
        // Only delay if we're going to retry
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
        }
      }
    }
    throw lastError;
  }

  // ========================
  //     Paket Wisata
  // ========================
  static async getAllPackages(): Promise<ITourPackage[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/package");
        console.log("Response dari API:", response.data);
        
        // Handle jika data tidak valid
        if (!Array.isArray(response.data)) {
          console.error("Data dari API bukan array:", response.data);
          return [];
        }
        
        // Pastikan setiap objek memiliki properti yang diperlukan
        return response.data.map(pkg => {
          // Pastikan semua objek punya properti yang dibutuhkan
          return {
            ...pkg,
            foto: pkg.foto || [],
            include: pkg.include || [],
            exclude: pkg.exclude || [],
            jadwal: pkg.jadwal || []
          };
        });
      });
    } catch (error) {
      console.error("Error fetching packages:", error);
      // Return empty array instead of throwing
      return [];
    }
  }

  static async createPackage(data: ITourPackageInput): Promise<ITourPackage> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.post("/package", {
          ...data,
          jadwal: data.jadwal.map(schedule => ({
            ...schedule,
            tanggalAwal: new Date(schedule.tanggalAwal).toISOString(),
            tanggalAkhir: new Date(schedule.tanggalAkhir).toISOString()
          }))
        });
        return response.data;
      });
    } catch (error) {
      console.error('Request payload:', data);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }

  static async getPackageById(id: string): Promise<ITourPackage> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get(`/package/${id}`);
        
        // Add default values for important fields if missing
        const packageData = response.data;
        return {
          ...packageData,
          foto: packageData.foto || [],
          include: packageData.include || [],
          exclude: packageData.exclude || [],
          jadwal: packageData.jadwal || [],
          destination: packageData.destination || { nama: 'Unnamed Destination', lokasi: 'Unknown Location' },
          hotel: packageData.hotel || { nama: 'Default Hotel', bintang: 3 },
          armada: packageData.armada || { nama: 'Default Transport', kapasitas: 15 },
          consume: packageData.consume || { nama: 'Default Consumption' },
          kategori: packageData.kategori || { _id: 'default', title: 'Default Category' }
        };
      });
    } catch (error) {
      console.error(`Error fetching package with id ${id}:`, error);
      throw error;
    }
  }

  static async updatePackage(
    id: string,
    data: Partial<ITourPackageInput>
  ): Promise<ITourPackage> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.put(`/package/${id}`, data);
        return response.data;
      });
    } catch (error) {
      console.error(`Error updating package with id ${id}:`, error);
      throw error;
    }
  }

  static async deletePackage(id: string): Promise<void> {
    try {
      await this.callWithRetry(async () => {
        await axios.delete(`/package/${id}`);
      });
    } catch (error) {
      console.error(`Error deleting package with id ${id}:`, error);
      throw error;
    }
  }

  // ========================
  //  Kategori Paket Wisata
  // ========================
  static async getAllCategories(): Promise<IPackageCategory[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/package-category/getAll");
        return response.data;
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  static async createCategory(title: string): Promise<{ message: string; data: IPackageCategory }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.post("/package-category/add", { title });
        return response.data;
      });
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  static async updateCategory(
    id: string,
    title: string
  ): Promise<{ message: string; data: IPackageCategory }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.put(`/package-category/update/${id}`, {
          title,
        });
        return response.data;
      });
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw error;
    }
  }

  static async deleteCategory(
    id: string
  ): Promise<{ message: string }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.delete(`/package-category/delete/${id}`);
        return response.data;
      });
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  }

  // =======================================
  //  Destinasi, Hotel, Armada, Konsumsi
  // =======================================
  static async getDestinations(): Promise<IDestination[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/destination/getAll");
        return response.data;
      });
    } catch (error) {
      console.error("Error fetching destinations:", error);
      return [];
    }
  }

  static async getHotels(): Promise<IHotel[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/hotel/getAll");
        return response.data;
      });
    } catch (error) {
      console.error("Error fetching hotels:", error);
      return [];
    }
  }

  static async getArmada(): Promise<IArmada[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/armada/getAll");
        return response.data;
      });
    } catch (error) {
      console.error("Error fetching armada:", error);
      return [];
    }
  }

  static async getConsumptions(): Promise<IConsumption[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/consume/getAll");
        return response.data;
      });
    } catch (error) {
      console.error("Error fetching consumptions:", error);
      return [];
    }
  }

  // =======================================
  //  Fungsi tambahan untuk gambar dan aset
  // =======================================
  static async getPackageImages(packageId: string): Promise<string[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get(`/package/${packageId}/images`);
        return response.data;
      });
    } catch (error) {
      console.error(`Error fetching images for package ${packageId}:`, error);
      // Return placeholder images if API fails
      return [
        "https://source.unsplash.com/random/800x600/?travel",
        "https://source.unsplash.com/random/800x600/?landscape",
        "https://source.unsplash.com/random/800x600/?hotel"
      ];
    }
  }

  // Function to get user profile if they're logged in
  static async getUserProfile(): Promise<any> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get('/user/profile');
        return response.data;
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Function to save favorite packages
  static async saveFavoritePackage(packageId: string): Promise<{ success: boolean; message: string }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.post('/user/favorites', { packageId });
        return response.data;
      });
    } catch (error) {
      console.error(`Error saving favorite package ${packageId}:`, error);
      return { success: false, message: 'Failed to save favorite' };
    }
  }

  // Function to remove favorite packages
  static async removeFavoritePackage(packageId: string): Promise<{ success: boolean; message: string }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.delete(`/user/favorites/${packageId}`);
        return response.data;
      });
    } catch (error) {
      console.error(`Error removing favorite package ${packageId}:`, error);
      return { success: false, message: 'Failed to remove favorite' };
    }
  }
}