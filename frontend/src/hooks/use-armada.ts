import { useState, useEffect, useCallback } from "react";
import { ArmadaService } from "@/services/armada.service";
import { IArmada, IArmadaInput } from "@/types/armada.types";
import { useToast } from "@/hooks/use-toast";

export const useArmada = () => {
  const [armadas, setArmadas] = useState<IArmada[]>([]);
  const [isLoadingArmadas, setIsLoadingArmadas] = useState(false);
  const [armadasError, setArmadasError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();

  // Fetch all armadas
  const fetchArmadas = useCallback(async () => {
    try {
      setIsLoadingArmadas(true);
      const data = await ArmadaService.getAllArmadas();
      setArmadas(data);
      setArmadasError(null);
    } catch (error) {
      setArmadasError(error as Error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Gagal mengambil data armada.",
      });
    } finally {
      setIsLoadingArmadas(false);
    }
  }, [toast]);

  // Load armadas on mount
  useEffect(() => {
    fetchArmadas();
  }, [fetchArmadas]);

  // Get armada detail by ID
  const useArmadaDetail = (id: string) => {
    const [armada, setArmada] = useState<IArmada | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const fetchArmada = async () => {
        if (!id) return;
        
        try {
          setIsLoading(true);
          const data = await ArmadaService.getArmadaById(id);
          setArmada(data);
          setError(null);
        } catch (error) {
          setError(error as Error);
          toast({
            variant: "destructive",
            title: "Error!",
            description: "Gagal mengambil detail armada.",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchArmada();
    }, [id]);

    return { armada, isLoading, error };
  };

  // Create new armada
  const createArmada = async (data: IArmadaInput, images: File[]) => {
    try {
      setIsCreating(true);
      await ArmadaService.createArmada(data, images);
      await fetchArmadas();
      toast({
        title: "Sukses!",
        description: "Armada berhasil ditambahkan.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal menambahkan armada: ${(error as Error).message}`,
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Update armada
  const updateArmada = async (id: string, data: IArmadaInput, newImages?: File[]) => {
    try {
      setIsUpdating(true);
      await ArmadaService.updateArmada(id, data, newImages);
      await fetchArmadas();
      toast({
        title: "Sukses!",
        description: "Armada berhasil diperbarui.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal memperbarui armada: ${(error as Error).message}`,
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete armada
  const deleteArmada = async (id: string) => {
    try {
      setIsDeleting(true);
      await ArmadaService.deleteArmada(id);
      await fetchArmadas();
      toast({
        title: "Sukses!",
        description: "Armada berhasil dihapus.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal menghapus armada: ${(error as Error).message}`,
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    // Data & States
    armadas,
    isLoadingArmadas,
    armadasError,
    useArmadaDetail,

    // Actions
    createArmada,
    updateArmada,
    deleteArmada,
    refreshArmadas: fetchArmadas,

    // Loading States
    isCreating,
    isUpdating,
    isDeleting,
  };
};