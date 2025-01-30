// hooks/useTourPackage.ts

import { useState, useEffect, useCallback } from "react";
import { TourPackageService } from "@/services/tour-package.service";
import {
  ITourPackage,
  IDestination,
  IHotel,
  IArmada,
  IConsumption,
  IPackageCategory,
  ITourPackageInput,
} from "@/types/tour-package.types";
import { useToast } from "@/hooks/use-toast";

export function useTourPackage() {
  // ========================
  //     State Data
  // ========================
  const [packages, setPackages] = useState<ITourPackage[]>([]);
  const [categories, setCategories] = useState<IPackageCategory[]>([]);
  const [destinations, setDestinations] = useState<IDestination[]>([]);
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [armada, setArmada] = useState<IArmada[]>([]);
  const [consumptions, setConsumptions] = useState<IConsumption[]>([]);

  // ========================
  //     State Loading
  // ========================
  // isLoading: menandakan proses fetchAllData (GET data semua reference + packages)
  const [isLoading, setIsLoading] = useState(false);

  // Kita bisa pisahkan state “submit” untuk category & package
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [isSubmittingPackage, setIsSubmittingPackage] = useState(false);

  const [error, setError] = useState<Error | null>(null);

  const { toast } = useToast();

  // ========================
  //   Fetch All Reference
  // ========================
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
 
      const [packagesData, categoriesData, destinationsData, hotelsData, armadaData, consumptionsData] = 
        await Promise.all([
          TourPackageService.getAllPackages(),
          TourPackageService.getAllCategories(), 
          TourPackageService.getDestinations(),
          TourPackageService.getHotels(),
          TourPackageService.getArmada(),
          TourPackageService.getConsumptions()
        ]);
 
      console.log('Fetched packages:', packagesData);
 
      setPackages(packagesData);
      setCategories(categoriesData);
      setDestinations(destinationsData);
      setHotels(hotelsData);
      setArmada(armadaData);
      setConsumptions(consumptionsData);
 
    } catch (err) {
      console.error(err);
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch data"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  //   CRUD Category
  // ========================
  const createCategory = async (title: string) => {
    try {
      setIsSubmittingCategory(true);
      await TourPackageService.createCategory(title);
      // Refresh data agar category baru muncul
      await fetchAllData();
      toast({
        title: "Sukses",
        description: "Kategori berhasil ditambahkan",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan kategori",
      });
      throw err;
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const updateCategory = async (id: string, title: string) => {
    try {
      setIsSubmittingCategory(true);
      await TourPackageService.updateCategory(id, title);
      await fetchAllData();
      toast({
        title: "Sukses",
        description: "Kategori berhasil diperbarui",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui kategori",
      });
      throw err;
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setIsSubmittingCategory(true);
      await TourPackageService.deleteCategory(id);
      await fetchAllData();
      toast({
        title: "Sukses",
        description: "Kategori berhasil dihapus",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus kategori",
      });
      throw err;
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  // ========================
  //   CRUD Package
  // ========================
  const createPackage = async (data: ITourPackageInput) => {
    try {
      setIsSubmittingPackage(true);
      const newPackage = await TourPackageService.createPackage(data);
      // Bisa langsung refetch semua data, atau hanya menambah di state packages
      await fetchAllData();
      toast({
        title: "Sukses",
        description: "Paket berhasil ditambahkan",
      });
      return newPackage;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan paket",
      });
      throw err;
    } finally {
      setIsSubmittingPackage(false);
    }
  };

  const updatePackage = async (id: string, data: Partial<ITourPackageInput>) => {
    try {
      setIsSubmittingPackage(true);
      const updated = await TourPackageService.updatePackage(id, data);
      await fetchAllData();
      toast({
        title: "Sukses",
        description: "Paket berhasil diperbarui",
      });
      return updated;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui paket",
      });
      throw err;
    } finally {
      setIsSubmittingPackage(false);
    }
  };

  const deletePackage = async (id: string) => {
    try {
      setIsSubmittingPackage(true);
      await TourPackageService.deletePackage(id);
      await fetchAllData();
      toast({
        title: "Sukses",
        description: "Paket berhasil dihapus",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus paket",
      });
      throw err;
    } finally {
      setIsSubmittingPackage(false);
    }
  };

  // ========================
  //   useEffect -> Mount
  // ========================
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ========================
  //     Return API
  // ========================
  return {
    // Data
    packages,
    categories,
    destinations,
    hotels,
    armada,
    consumptions,

    // State loading / error
    isLoading, // Loading saat fetchAllData
    isSubmittingCategory,
    isSubmittingPackage,
    error,

    // Category handlers
    createCategory,
    updateCategory,
    deleteCategory,

    // Package handlers
    createPackage,
    updatePackage,
    deletePackage,

    // Refresh
    refreshData: fetchAllData,
  };
}
