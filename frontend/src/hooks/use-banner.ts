// hooks/use-banner.ts - Fixed dengan auth integration
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { 
  Banner, 
  BannerFormData, 
  BannerResponse, 
  UploadProgress 
} from '@/types/banner.types';
import { BannerService } from '@/services/banner.service';

export const useBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  
  const { toast } = useToast();
  const { isAuthenticated, admin } = useAdminAuth();

  // Check if admin has banner permissions
  const hasPermission = useCallback((action: string) => {
    if (!admin) return false;
    if (admin.role === 'super-admin') return true;
    
    const permission = `banner:${action}`;
    return admin.permissions?.includes(permission) || false;
  }, [admin]);

  // Fetch all banners with error handling dan auth check
  const fetchBanners = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !hasPermission('read')) {
      console.warn('⚠️ No permission to fetch banners');
      setBanners([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 Fetching banners...');
      
      const data = await BannerService.getAllBanners();
      
      // Sort by urutan first, then by createdAt
      const sortedBanners = data.sort((a, b) => {
        if (a.urutan !== b.urutan) {
          return a.urutan - b.urutan;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setBanners(sortedBanners);
      console.log(`✅ Loaded ${sortedBanners.length} banners`);
    } catch (error) {
      console.error('❌ Error fetching banners:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat data banner';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, hasPermission, toast]);

  // Add new banner
  const addBanner = async (bannerData: BannerFormData): Promise<boolean> => {
    if (!isAuthenticated || !hasPermission('create')) {
      toast({
        title: "Error",
        description: "Tidak memiliki akses untuk menambah banner",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsAdding(true);
      setUploadProgress(null);
      
      console.log('🔄 Adding banner...', bannerData);
      
      // Validate data
      const validationErrors = BannerService.validateBannerData(bannerData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }
      
      const response: BannerResponse = await BannerService.createBanner(
        bannerData,
        (progress) => setUploadProgress(progress)
      );
      
      // Update local state
      setBanners(prev => {
        const updated = [...prev, response.data];
        return updated.sort((a, b) => {
          if (a.urutan !== b.urutan) {
            return a.urutan - b.urutan;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      });
      
      toast({
        title: "Berhasil",
        description: response.message || "Banner berhasil ditambahkan",
      });
      
      console.log('✅ Banner added successfully');
      return true;
    } catch (error) {
      console.error('❌ Error adding banner:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Gagal menambahkan banner';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAdding(false);
      setUploadProgress(null);
    }
  };

  // Update banner
  const updateBanner = async (id: string, bannerData: BannerFormData): Promise<boolean> => {
    if (!isAuthenticated || !hasPermission('update')) {
      toast({
        title: "Error",
        description: "Tidak memiliki akses untuk mengubah banner",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsUpdating(true);
      setUploadProgress(null);
      
      console.log('🔄 Updating banner...', id, bannerData);
      
      const response: BannerResponse = await BannerService.updateBanner(
        id, 
        bannerData,
        (progress) => setUploadProgress(progress)
      );
      
      // Update local state
      setBanners(prev => {
        const updated = prev.map(banner => 
          banner._id === id ? response.data : banner
        );
        return updated.sort((a, b) => {
          if (a.urutan !== b.urutan) {
            return a.urutan - b.urutan;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      });
      
      toast({
        title: "Berhasil",
        description: response.message || "Banner berhasil diperbarui",
      });
      
      console.log('✅ Banner updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Error updating banner:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Gagal memperbarui banner';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUpdating(false);
      setUploadProgress(null);
    }
  };

  // Delete banner
  const deleteBanner = async (id: string): Promise<boolean> => {
    if (!isAuthenticated || !hasPermission('delete')) {
      toast({
        title: "Error",
        description: "Tidak memiliki akses untuk menghapus banner",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsDeleting(true);
      
      console.log('🔄 Deleting banner...', id);
      
      const response = await BannerService.deleteBanner(id);
      
      // Update local state
      setBanners(prev => prev.filter(banner => banner._id !== id));
      
      toast({
        title: "Berhasil",
        description: response.message || "Banner berhasil dihapus",
      });
      
      console.log('✅ Banner deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting banner:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus banner';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle banner status
  const toggleBannerStatus = async (id: string): Promise<boolean> => {
    if (!isAuthenticated || !hasPermission('update')) {
      toast({
        title: "Error",
        description: "Tidak memiliki akses untuk mengubah status banner",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('🔄 Toggling banner status...', id);
      
      const response = await BannerService.toggleBannerStatus(id);
      
      // Update local state
      setBanners(prev => 
        prev.map(banner => 
          banner._id === id ? response.data : banner
        )
      );
      
      toast({
        title: "Berhasil",
        description: response.message || "Status banner berhasil diubah",
      });
      
      console.log('✅ Banner status toggled successfully');
      return true;
    } catch (error) {
      console.error('❌ Error toggling banner status:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengubah status banner';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  // Get banner by ID with fresh data from server
  const getBannerById = useCallback(async (id: string): Promise<Banner | undefined> => {
    if (!isAuthenticated || !hasPermission('read')) {
      return undefined;
    }

    // First try to find in current banners
    const localBanner = banners.find(banner => banner._id === id);
    if (localBanner) {
      return localBanner;
    }
    
    // If not found locally, fetch from server
    try {
      console.log('🔄 Fetching banner by ID from server...', id);
      const banner = await BannerService.getBannerById(id);
      return banner;
    } catch (error) {
      console.error('❌ Error fetching banner by ID:', error);
      return undefined;
    }
  }, [banners, isAuthenticated, hasPermission]);

  // Get image URL helper
  const getImageUrl = useCallback((imagePath: string): string => {
    return BannerService.getImageUrl(imagePath);
  }, []);

  // Get banner statistics
  const getBannerStats = async () => {
    if (!isAuthenticated || !hasPermission('read')) {
      return null;
    }

    try {
      const stats = await BannerService.getBannerStats();
      return stats;
    } catch (error) {
      console.error('❌ Error fetching banner stats:', error);
      return null;
    }
  };

  // Computed values
  const bannerCount = banners.length;
  const activeBanners = banners.filter(banner => banner.isActive);
  const inactiveBanners = banners.filter(banner => !banner.isActive);
  const canAddMore = bannerCount < 10;
  const remainingSlots = Math.max(0, 10 - bannerCount);

  // Load banners on mount or when auth state changes
  useEffect(() => {
    if (isAuthenticated && hasPermission('read')) {
      fetchBanners();
    } else {
      setBanners([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, hasPermission, fetchBanners]);

  return {
    // Data
    banners,
    bannerCount,
    activeBanners,
    inactiveBanners,
    canAddMore,
    remainingSlots,
    
    // Loading states
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    uploadProgress,
    
    // Actions
    fetchBanners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    getBannerById,
    getBannerStats,
    
    // Helpers
    getImageUrl,
    hasPermission,
    
    // Clear functions
    clearUploadProgress: () => setUploadProgress(null),
  };
};