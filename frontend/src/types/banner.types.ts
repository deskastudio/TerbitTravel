// types/banner.types.ts - Updated sesuai backend response
export interface Banner {
    _id: string;
    judul: string;
    deskripsi?: string;
    gambar: string;
    link?: string;
    isActive: boolean;
    urutan: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface BannerFormData {
    judul: string;
    deskripsi?: string;
    gambar?: File;
    link?: string;
    isActive: boolean;
    urutan: number;
  }
  
  // Response format sesuai backend yang sudah diperbaiki
  export interface BannerResponse {
    success: boolean;
    message: string;
    data: Banner;
  }
  
  export interface BannersListResponse {
    success: boolean;
    data: Banner[];
  }
  
  export interface BannerStatsResponse {
    success: boolean;
    data: {
      total: number;
      active: number;
      inactive: number;
      recent: number;
      maxAllowed: number;
      remaining: number;
      monthlyStats: Array<{
        month: string;
        count: number;
      }>;
    };
  }
  
  // Error response types
  export interface ValidationError {
    field?: string;
    message: string;
  }
  
  export interface ApiErrorResponse {
    success: boolean;
    message: string;
    error?: string;
    errors?: ValidationError[];
  }
  
  // Axios error with proper typing
  export interface AxiosErrorResponse {
    response?: {
      data: ApiErrorResponse;
      status: number;
      headers: Record<string, string>;
    };
    request?: XMLHttpRequest;
    message: string;
    code?: string;
  }
  
  // Upload progress type
  export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
  }