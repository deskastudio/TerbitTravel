import { useState, useCallback, useEffect } from 'react';
import { Hotel, HotelInput } from '@/types/hotel.types';
import { hotelService } from '@/services/hotel.service';
import { useToast } from '@/hooks/use-toast';

interface UseHotelOptions {
  page?: number;
  limit?: number;
  search?: string;
  stars?: number;
}

export const useHotel = (options?: UseHotelOptions) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(options?.page || 1);
  const { toast } = useToast();

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await hotelService.getAllHotels({
        page: currentPage,
        limit: options?.limit || 10,
        search: options?.search,
        stars: options?.stars,
      });
      setHotels(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching hotels');
      toast({
        title: 'Error',
        description: 'Failed to fetch hotels',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, options, toast]);

  const createHotel = async (hotelData: HotelInput) => {
    try {
      setLoading(true);
      const response = await hotelService.createHotel(hotelData);
      toast({
        title: 'Success',
        description: 'Hotel created successfully',
      });
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create hotel';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateHotel = async (id: string, hotelData: Partial<HotelInput>) => {
    try {
      setLoading(true);
      const response = await hotelService.updateHotel(id, hotelData);
      toast({
        title: 'Success',
        description: 'Hotel updated successfully',
      });
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update hotel';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteHotel = async (id: string) => {
    try {
      setLoading(true);
      await hotelService.deleteHotel(id);
      toast({
        title: 'Success',
        description: 'Hotel deleted successfully',
      });
      // Refresh the hotel list
      fetchHotels();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete hotel';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return {
    hotels,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    createHotel,
    updateHotel,
    deleteHotel,
    refetch: fetchHotels,
  };
};