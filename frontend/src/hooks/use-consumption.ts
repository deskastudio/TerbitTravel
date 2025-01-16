import { useState, useEffect, useCallback } from "react";
import { ConsumptionService } from "@/services/consumption.service";
import { IConsumption, IConsumptionInput } from "@/types/consumption.types";
import { useToast } from "@/hooks/use-toast";

export const useConsumption = () => {
  const [consumptions, setConsumptions] = useState<IConsumption[]>([]);
  const [isLoadingConsumptions, setIsLoadingConsumptions] = useState(false);
  const [consumptionsError, setConsumptionsError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();

  // Fetch all consumptions
  const fetchConsumptions = useCallback(async () => {
    try {
      setIsLoadingConsumptions(true);
      const data = await ConsumptionService.getAllConsumptions();
      setConsumptions(data);
      setConsumptionsError(null);
    } catch (error) {
      setConsumptionsError(error as Error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Gagal mengambil data konsumsi.",
      });
    } finally {
      setIsLoadingConsumptions(false);
    }
  }, [toast]);

  // Load consumptions on mount
  useEffect(() => {
    fetchConsumptions();
  }, [fetchConsumptions]);

  // Get consumption detail by ID
  const useConsumptionDetail = (id: string) => {
    const [consumption, setConsumption] = useState<IConsumption | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const fetchConsumption = async () => {
        if (!id) return;
        
        try {
          setIsLoading(true);
          const data = await ConsumptionService.getConsumptionById(id);
          setConsumption(data);
          setError(null);
        } catch (error) {
          setError(error as Error);
          toast({
            variant: "destructive",
            title: "Error!",
            description: "Gagal mengambil detail konsumsi.",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchConsumption();
    }, [id]);

    return { consumption, isLoading, error };
  };

  // Create new consumption
  const createConsumption = async (data: IConsumptionInput) => {
    try {
      setIsCreating(true);
      await ConsumptionService.createConsumption(data);
      await fetchConsumptions(); // Refresh the list
      toast({
        title: "Sukses!",
        description: "Konsumsi berhasil ditambahkan.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal menambahkan konsumsi: ${(error as Error).message}`,
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Update consumption
  const updateConsumption = async (id: string, data: IConsumptionInput) => {
    try {
      setIsUpdating(true);
      await ConsumptionService.updateConsumption(id, data);
      await fetchConsumptions(); // Refresh the list
      toast({
        title: "Sukses!",
        description: "Konsumsi berhasil diperbarui.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal memperbarui konsumsi: ${(error as Error).message}`,
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete consumption
  const deleteConsumption = async (id: string) => {
    try {
      setIsDeleting(true);
      await ConsumptionService.deleteConsumption(id);
      await fetchConsumptions(); // Refresh the list
      toast({
        title: "Sukses!",
        description: "Konsumsi berhasil dihapus.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal menghapus konsumsi: ${(error as Error).message}`,
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    // Data & States
    consumptions,
    isLoadingConsumptions,
    consumptionsError,
    useConsumptionDetail,

    // Actions
    createConsumption,
    updateConsumption,
    deleteConsumption,
    refreshConsumptions: fetchConsumptions,

    // Loading States
    isCreating,
    isUpdating,
    isDeleting,
  };
};