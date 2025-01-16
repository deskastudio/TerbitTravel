// hooks/useDestination.ts

import { useState, useEffect, useCallback } from "react";
import { DestinationService } from "@/services/destination.service";
import { IDestination, IDestinationInput, IDestinationCategory } from "@/types/destination.types";
import { useToast } from "@/hooks/use-toast";

export const useDestination = () => {
  const [destinations, setDestinations] = useState<IDestination[]>([]);
  const [categories, setCategories] = useState<IDestinationCategory[]>([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [destinationsError, setDestinationsError] = useState<Error | null>(null);
  const [categoriesError, setCategoriesError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();

  // Fetch all destinations
  const fetchDestinations = useCallback(async () => {
    try {
      setIsLoadingDestinations(true);
      const data = await DestinationService.getAllDestinations();
      setDestinations(data);
      setDestinationsError(null);
    } catch (error) {
      setDestinationsError(error as Error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Gagal mengambil data destinasi.",
      });
    } finally {
      setIsLoadingDestinations(false);
    }
  }, [toast]);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      const data = await DestinationService.getAllCategories();
      setCategories(data);
      setCategoriesError(null);
    } catch (error) {
      setCategoriesError(error as Error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Gagal mengambil data kategori.",
      });
    } finally {
      setIsLoadingCategories(false);
    }
  }, [toast]);

  // Load data on mount
  useEffect(() => {
    fetchDestinations();
    fetchCategories();
  }, [fetchDestinations, fetchCategories]);

  // Get destination detail by ID
  const useDestinationDetail = (id: string) => {
    const [destination, setDestination] = useState<IDestination | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const fetchDestination = async () => {
        if (!id) return;
        
        try {
          setIsLoading(true);
          const data = await DestinationService.getDestinationById(id);
          setDestination(data);
          setError(null);
        } catch (error) {
          setError(error as Error);
          toast({
            variant: "destructive",
            title: "Error!",
            description: "Gagal mengambil detail destinasi.",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchDestination();
    }, [id]);

    return { destination, isLoading, error };
  };

  // Create new destination
  const createDestination = async (data: IDestinationInput, images: File[]) => {
    try {
      setIsCreating(true);
      await DestinationService.createDestination(data, images);
      await fetchDestinations();
      toast({
        title: "Sukses!",
        description: "Destinasi berhasil ditambahkan.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal menambahkan destinasi: ${(error as Error).message}`,
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Update destination
  const updateDestination = async (id: string, data: IDestinationInput, newImages?: File[]) => {
    try {
      setIsUpdating(true);
      await DestinationService.updateDestination(id, data, newImages);
      await fetchDestinations();
      toast({
        title: "Sukses!",
        description: "Destinasi berhasil diperbarui.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal memperbarui destinasi: ${(error as Error).message}`,
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete destination
  const deleteDestination = async (id: string) => {
    try {
      setIsDeleting(true);
      await DestinationService.deleteDestination(id);
      await fetchDestinations();
      toast({
        title: "Sukses!",
        description: "Destinasi berhasil dihapus.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal menghapus destinasi: ${(error as Error).message}`,
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  // Category management functions
  const createCategory = async (title: string) => {
    try {
      await DestinationService.createCategory(title);
      await fetchCategories();
      toast({
        title: "Sukses!",
        description: "Kategori berhasil ditambahkan.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal menambahkan kategori: ${(error as Error).message}`,
      });
      throw error;
    }
  };

  return {
    // Data & States
    destinations,
    categories,
    isLoadingDestinations,
    isLoadingCategories,
    destinationsError,
    categoriesError,
    useDestinationDetail,

    // Actions
    createDestination,
    updateDestination,
    deleteDestination,
    createCategory,
    refreshDestinations: fetchDestinations,
    refreshCategories: fetchCategories,

    // Loading States
    isCreating,
    isUpdating,
    isDeleting,
  };
};