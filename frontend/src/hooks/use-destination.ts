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
      console.log("Fetching all destinations...");
      const data = await DestinationService.getAllDestinations();
      console.log("Destinations fetched successfully:", data.length);
      setDestinations(data);
      setDestinationsError(null);
    } catch (error) {
      console.error("Error fetching destinations:", error);
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
      console.log("Fetching all categories...");
      const data = await DestinationService.getAllCategories();
      console.log("Categories fetched successfully:", data.length);
      setCategories(data);
      setCategoriesError(null);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
      const fetchDestination = async () => {
        if (!id) {
          console.warn("Cannot fetch destination: ID is empty");
          return;
        }
        
        setIsLoading(true);
        console.log(`Fetching destination with ID: ${id}`);
        
        try {
          const data = await DestinationService.getDestinationById(id);
          console.log("Destination detail fetched successfully:", data);
          setDestination(data);
          setError(null);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`Error fetching destination detail for ID ${id}:`, errorMessage);
          setError(error as Error);
          
          toast({
            variant: "destructive",
            title: "Error!",
            description: `Gagal mengambil detail destinasi: ${errorMessage}`,
          });
        } finally {
          setIsLoading(false);
          setIsInitialized(true);
        }
      };

      fetchDestination();
    }, [id, toast]);

    return { 
      destination, 
      isLoading, 
      error,
      isInitialized, // New flag to indicate if initial fetch is complete
      refetch: () => {
        if (id) {
          // Function to manually refetch data
          setIsLoading(true);
          DestinationService.getDestinationById(id)
            .then(data => {
              setDestination(data);
              setError(null);
            })
            .catch(err => {
              setError(err as Error);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      }
    };
  };

  // Create new destination
  const createDestination = async (data: IDestinationInput, images: File[]) => {
    try {
      setIsCreating(true);
      console.log("Creating new destination:", data);
      await DestinationService.createDestination(data, images);
      await fetchDestinations();
      toast({
        title: "Sukses!",
        description: "Destinasi berhasil ditambahkan.",
      });
    } catch (error) {
      console.error("Error creating destination:", error);
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
      console.log(`Updating destination with ID ${id}:`, data);
      await DestinationService.updateDestination(id, data, newImages);
      await fetchDestinations();
      toast({
        title: "Sukses!",
        description: "Destinasi berhasil diperbarui.",
      });
    } catch (error) {
      console.error(`Error updating destination with ID ${id}:`, error);
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
      console.log(`Deleting destination with ID ${id}`);
      await DestinationService.deleteDestination(id);
      await fetchDestinations();
      toast({
        title: "Sukses!",
        description: "Destinasi berhasil dihapus.",
      });
    } catch (error) {
      console.error(`Error deleting destination with ID ${id}:`, error);
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
      console.log("Creating new category:", title);
      await DestinationService.createCategory(title);
      await fetchCategories();
      toast({
        title: "Sukses!",
        description: "Kategori berhasil ditambahkan.",
      });
    } catch (error) {
      console.error("Error creating category:", error);
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