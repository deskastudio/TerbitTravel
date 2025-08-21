// services/banner.service.ts - Fixed dengan auth dan endpoint yang benar
import axiosInstance from "@/lib/axios";
import { 
  Banner, 
  BannerFormData, 
  BannerResponse, 
  BannersListResponse,
  BannerStatsResponse,
  AxiosErrorResponse,
  UploadProgress
} from '@/types/banner.types';

// Helper function untuk handle API errors
const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  
  const axiosError = error as AxiosErrorResponse;
  
  if (axiosError.response) {
    const { data, status } = axiosError.response;
    
    // Handle specific error messages from backend
    if (data.message) {
      throw new Error(data.message);
    }
    
    // Handle validation errors
    if (data.errors && Array.isArray(data.errors)) {
      const errorMessages = data.errors
        .map(err => err.message)
        .filter(Boolean)
        .join(', ');
      throw new Error(errorMessages || 'Validation error');
    }
    
    // Handle HTTP status codes
    switch (status) {
      case 401:
        throw new Error('Unauthorized - Silakan login kembali');
      case 403:
        throw new Error('Access denied - Tidak memiliki akses');
      case 404:
        throw new Error('Data tidak ditemukan');
      case 413:
        throw new Error('File terlalu besar');
      case 429:
        throw new Error('Terlalu banyak request - Coba lagi nanti');
      case 500:
        throw new Error('Server error - Silakan coba lagi');
      default:
        throw new Error(data.error || `HTTP Error ${status}`);
    }
  }
  
  if (axiosError.code === 'NETWORK_ERROR') {
    throw new Error('Koneksi bermasalah - Periksa jaringan internet');
  }
  
  if (axiosError.code === 'ECONNABORTED') {
    throw new Error('Request timeout - Coba lagi');
  }
  
  throw new Error(axiosError.message || 'Terjadi kesalahan tidak dikenal');
};

// Validate file before upload
const validateFile = (file: File): void => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP');
  }
  
  // Check file size (2MB)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Ukuran file maksimal 2MB');
  }
  
  // Check file name
  if (file.name.length > 100) {
    throw new Error('Nama file terlalu panjang (maksimal 100 karakter)');
  }
};

export const BannerService = {
  // Get all banners (Admin only)
  getAllBanners: async (): Promise<Banner[]> => {
    try {
      console.log('🔄 Fetching all banners...');
      
      const response = await axiosInstance.get<BannersListResponse>('/admin/banner/getAll');
      
      console.log('✅ Banners response:', response.status, response.data);
      
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get banner by ID (Admin only)
  getBannerById: async (id: string): Promise<Banner> => {
    try {
      console.log(`🔄 Fetching banner ${id}...`);
      
      if (!id || id.trim() === '') {
        throw new Error('Banner ID is required');
      }
      
      const response = await axiosInstance.get<BannerResponse>(`/admin/banner/get/${id}`);
      
      console.log('✅ Banner detail response:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Banner not found');
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get active banners (Public - no auth needed)
  getActiveBanners: async (): Promise<Banner[]> => {
    try {
      console.log('🔄 Fetching active banners...');
      
      const response = await axiosInstance.get<BannersListResponse>('/banner/active');
      
      console.log('✅ Active banners response:', response.data);
      
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.warn('Failed to fetch active banners:', error);
      return []; // Return empty array for public endpoint
    }
  },

  // Create new banner (Admin only)
  createBanner: async (
    data: BannerFormData, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<BannerResponse> => {
    try {
      console.log('🔄 Creating banner...', data);
      
      // Validation
      if (!data.judul || data.judul.trim() === '') {
        throw new Error('Judul banner wajib diisi');
      }
      
      if (!data.gambar) {
        throw new Error('Gambar banner wajib diunggah');
      }
      
      if (!(data.gambar instanceof File)) {
        throw new Error('Gambar harus berupa file');
      }
      
      // Validate file
      validateFile(data.gambar);
      
      // Prepare form data
      const formData = new FormData();
      formData.append('judul', data.judul.trim());
      
      if (data.deskripsi && data.deskripsi.trim()) {
        formData.append('deskripsi', data.deskripsi.trim());
      }
      
      if (data.link && data.link.trim()) {
        formData.append('link', data.link.trim());
      }
      
      formData.append('isActive', data.isActive.toString());
      formData.append('urutan', data.urutan.toString());
      formData.append('gambar', data.gambar);
      
      // Log form data for debugging
      console.log('📝 Form data prepared:', {
        judul: data.judul,
        deskripsi: data.deskripsi || 'N/A',
        link: data.link || 'N/A',
        isActive: data.isActive,
        urutan: data.urutan,
        gambar: `${data.gambar.name} (${(data.gambar.size / 1024).toFixed(1)}KB)`
      });
      
      const response = await axiosInstance.post<BannerResponse>(
        '/admin/banner/add',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 detik untuk upload
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress: UploadProgress = {
                loaded: progressEvent.loaded,
                total: progressEvent.total,
                percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
              };
              onProgress(progress);
            }
          }
        }
      );
      
      console.log('✅ Banner created successfully:', response.data);
      
      if (response.data.success) {
        return response.data;
      }
      
      throw new Error(response.data.message || 'Failed to create banner');
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update banner (Admin only)
  updateBanner: async (
    id: string, 
    data: BannerFormData,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<BannerResponse> => {
    try {
      console.log('🔄 Updating banner...', id, data);
      
      if (!id || id.trim() === '') {
        throw new Error('Banner ID is required');
      }
      
      // Validate file if provided
      if (data.gambar && data.gambar instanceof File) {
        validateFile(data.gambar);
      }
      
      // Prepare form data
      const formData = new FormData();
      
      if (data.judul && data.judul.trim()) {
        formData.append('judul', data.judul.trim());
      }
      
      if (data.deskripsi !== undefined) {
        formData.append('deskripsi', data.deskripsi.trim());
      }
      
      if (data.link !== undefined) {
        formData.append('link', data.link.trim());
      }
      
      formData.append('isActive', data.isActive.toString());
      formData.append('urutan', data.urutan.toString());
      
      // Append image if provided
      if (data.gambar instanceof File) {
        formData.append('gambar', data.gambar);
      }
      
      const response = await axiosInstance.put<BannerResponse>(
        `/admin/banner/update/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress: UploadProgress = {
                loaded: progressEvent.loaded,
                total: progressEvent.total,
                percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
              };
              onProgress(progress);
            }
          }
        }
      );
      
      console.log('✅ Banner updated successfully:', response.data);
      
      if (response.data.success) {
        return response.data;
      }
      
      throw new Error(response.data.message || 'Failed to update banner');
    } catch (error) {
      handleApiError(error);
    }
  },

  // Delete banner (Admin only)
  deleteBanner: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔄 Deleting banner...', id);
      
      if (!id || id.trim() === '') {
        throw new Error('Banner ID is required');
      }
      
      const response = await axiosInstance.delete(`/admin/banner/delete/${id}`);
      
      console.log('✅ Banner deleted successfully:', response.data);
      
      if (response.data.success) {
        return response.data;
      }
      
      throw new Error(response.data.message || 'Failed to delete banner');
    } catch (error) {
      handleApiError(error);
    }
  },

  // Toggle banner status (Admin only)
  toggleBannerStatus: async (id: string): Promise<BannerResponse> => {
    try {
      console.log('🔄 Toggling banner status...', id);
      
      if (!id || id.trim() === '') {
        throw new Error('Banner ID is required');
      }
      
      const response = await axiosInstance.patch<BannerResponse>(`/admin/banner/toggle-status/${id}`);
      
      console.log('✅ Banner status toggled:', response.data);
      
      if (response.data.success) {
        return response.data;
      }
      
      throw new Error(response.data.message || 'Failed to toggle banner status');
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get banner statistics (Admin only)
  getBannerStats: async (): Promise<BannerStatsResponse['data']> => {
    try {
      console.log('🔄 Fetching banner stats...');
      
      const response = await axiosInstance.get<BannerStatsResponse>('/admin/banner/stats');
      
      console.log('✅ Banner stats:', response.data);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to fetch banner statistics');
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get image URL helper
  getImageUrl: (imagePath: string): string => {
    if (!imagePath) return '';
    
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    
    // Base URL dari environment variable
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 
                   process.env.REACT_APP_API_URL?.replace('/api', '') || 
                   'http://localhost:5000';
    
    return `${baseUrl}/${cleanPath}`;
  },

  // Helper untuk validate banner data
  validateBannerData: (data: Partial<BannerFormData>): string[] => {
    const errors: string[] = [];
    
    if (!data.judul || data.judul.trim() === '') {
      errors.push('Judul banner wajib diisi');
    } else if (data.judul.length > 100) {
      errors.push('Judul maksimal 100 karakter');
    }
    
    if (data.deskripsi && data.deskripsi.length > 500) {
      errors.push('Deskripsi maksimal 500 karakter');
    }
    
    if (data.link && data.link.trim() !== '' && !data.link.match(/^https?:\/\/.+/)) {
      errors.push('Link harus berupa URL yang valid (http/https)');
    }
    
    if (data.urutan !== undefined && (data.urutan < 0 || data.urutan > 99)) {
      errors.push('Urutan harus antara 0-99');
    }
    
    return errors;
  }
};