// services/article.service.ts

import axiosInstance from "@/lib/axios";
import { 
  IArticle, 
  IArticleInput, 
  ArticleResponse,
  ICategory,
  ArticlesResponse
} from "@/types/article.types";

export const ArticleService = {
  // Article operations
  getAllArticles: async (
    page = 1, 
    limit = 10, 
    search = "", 
    kategori = "", 
    sort = "terbaru"
  ): Promise<{data: IArticle[], meta: any}> => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (search) params.append("search", search);
      if (kategori && kategori !== "all") params.append("kategori", kategori);
      if (sort) params.append("sort", sort);

      // Menggunakan endpoint blog
      const response = await axiosInstance.get<IArticle[] | ArticlesResponse>(
        `/blog/get?${params.toString()}`
      );
      
      console.log('Raw article response:', response);
      
      // Handle different response formats
      if (Array.isArray(response.data)) {
        // If API returns just an array
        return {
          data: response.data,
          meta: {
            currentPage: page,
            totalPages: Math.ceil(response.data.length / limit),
            totalItems: response.data.length,
            itemsPerPage: limit
          }
        };
      } else if (response.data && 'data' in response.data) {
        // If API returns { data: IArticle[], meta: {...} }
        return {
          data: response.data.data,
          meta: response.data.meta || {
            currentPage: page,
            totalPages: Math.ceil(response.data.data.length / limit),
            totalItems: response.data.data.length,
            itemsPerPage: limit
          }
        };
      }
      
      // Fallback for unexpected response format
      console.error("Unexpected API response format:", response.data);
      return { data: [], meta: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: limit } };
    } catch (error) {
      console.error('Error in getAllArticles:', error);
      throw error;
    }
  },

  getArticleById: async (idOrSlug: string): Promise<IArticle> => {
    try {
      console.log(`Fetching article with ID/slug: ${idOrSlug}`);
      
      // Check if we're dealing with an ID or slug
      const endpoint = idOrSlug.length >= 24 ? `/blog/get/${idOrSlug}` : `/blog/slug/${idOrSlug}`;
      
      const response = await axiosInstance.get<IArticle | { data: IArticle }>(endpoint);
      
      console.log('Article detail response:', response);
      
      // Handle different response formats
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data as IArticle;
    } catch (error) {
      console.error(`Error in getArticleById for ${idOrSlug}:`, error);
      
      // Check for 404 errors
      if ((error as any).response && (error as any).response.status === 404) {
        throw new Error("Artikel tidak ditemukan");
      }
      
      throw error;
    }
  },

  createArticle: async (data: IArticleInput): Promise<ArticleResponse> => {
    try {
      const formData = new FormData();
      
      // Pastikan semua field wajib
      if (!data.judul || !data.penulis || !data.isi || !data.kategori) {
        throw new Error("Semua field wajib diisi (judul, penulis, isi, kategori)");
      }
      
      formData.append("judul", data.judul);
      formData.append("penulis", data.penulis);
      formData.append("isi", data.isi);
      formData.append("kategori", data.kategori);
      
      // Add slug if provided
      if (data.slug) {
        formData.append("slug", data.slug);
      }
      
      // Add description if provided
      if (data.deskripsi) {
        formData.append("deskripsi", data.deskripsi);
      }
      
      // Pastikan gambarUtama tersedia dan valid
      if (!data.gambarUtama || !(data.gambarUtama instanceof File)) {
        throw new Error("Gambar utama wajib diunggah");
      }
      
      formData.append("gambarUtama", data.gambarUtama);
      
      // Tambahkan gambar tambahan jika ada
      if (data.gambarTambahan && Array.isArray(data.gambarTambahan) && data.gambarTambahan.length > 0) {
        data.gambarTambahan.forEach((image) => {
          if (image instanceof File) {
            formData.append("gambarTambahan", image);
          }
        });
      }
  
      // Log untuk debugging
      console.log('Creating article with data:', {
        judul: data.judul,
        penulis: data.penulis,
        isi: data.isi.substring(0, 30) + "...", // Hanya tampilkan sebagian
        kategori: data.kategori,
        gambarUtama: data.gambarUtama ? 'File terlampir' : 'Tidak ada',
        gambarTambahan: data.gambarTambahan ? `${data.gambarTambahan.length} file` : 'Tidak ada'
      });
  
      // Kirim request dengan timeout yang lebih lama
      const response = await axiosInstance.post<ArticleResponse>(
        `/blog/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // Timeout 30 detik
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error in createArticle:', error);
      
      // Log detail error lebih lengkap
      if ((error as any).response) {
        console.error('Error response data:', (error as any).response.data);
        console.error('Error response status:', (error as any).response.status);
        console.error('Error response headers:', (error as any).response.headers);
        
        // Jika ada pesan error spesifik dari server
        if ((error as any).response.data && (error as any).response.data.message) {
          throw new Error((error as any).response.data.message);
        }
        
        // Jika ada detail errors dari validasi
        if ((error as any).response.data && (error as any).response.data.errors) {
          const errorMessages = (error as any).response.data.errors
            .map((err: any) => err.msg || err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
      }
      
      throw error;
    }
  },

  updateArticle: async (id: string, data: IArticleInput): Promise<ArticleResponse> => {
    try {
      const formData = new FormData();
      
      // Tambahkan data teks
      if (data.judul) formData.append("judul", data.judul);
      if (data.penulis) formData.append("penulis", data.penulis);
      if (data.isi) formData.append("isi", data.isi);
      if (data.kategori) formData.append("kategori", data.kategori);
      if (data.slug) formData.append("slug", data.slug);
      if (data.deskripsi) formData.append("deskripsi", data.deskripsi);
      
      // Append main image if exists dan pastikan itu File
      if (data.gambarUtama instanceof File) {
        formData.append("gambarUtama", data.gambarUtama);
      }
      
      // Append additional images if any
      if (data.gambarTambahan && Array.isArray(data.gambarTambahan) && data.gambarTambahan.length > 0) {
        data.gambarTambahan.forEach((image) => {
          if (image instanceof File) {
            formData.append("gambarTambahan", image);
          }
        });
      }

      const response = await axiosInstance.put<ArticleResponse>(
        `/blog/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // Timeout 30 detik
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error in updateArticle:', error);
      if ((error as any).response) {
        console.error('Error response data:', (error as any).response.data);
        console.error('Error response status:', (error as any).response.status);
        
        // Handle specific API error messages
        if ((error as any).response.data && (error as any).response.data.message) {
          throw new Error((error as any).response.data.message);
        }
      }
      throw error;
    }
  },

  deleteArticle: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.delete<{ message: string }>(
        `/blog/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error in deleteArticle:', error);
      if ((error as any).response && (error as any).response.data && (error as any).response.data.message) {
        throw new Error((error as any).response.data.message);
      }
      throw error;
    }
  },

  // Category operations
  getAllCategories: async (): Promise<ICategory[]> => {
    try {
      console.log('Fetching categories...');
      
      // Menggunakan endpoint blog-category
      const response = await axiosInstance.get<ICategory[] | { data: ICategory[] }>(`/blog-category/get`);
      
      console.log('Categories response status:', response.status);
      console.log('Categories response data:', response.data);
      
      // Handle different response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && 'data' in response.data) {
        return response.data.data;
      }
      
      // Fallback for unexpected response format
      console.error("Unexpected API response format for categories:", response.data);
      return [];
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      console.error('Error details:', (error as any).response ? (error as any).response.data : (error as Error).message);
      throw error;
    }
  },

  getCategoryById: async (id: string): Promise<ICategory> => {
    try {
      const response = await axiosInstance.get<ICategory | { data: ICategory }>(`/blog-category/get/${id}`);
      
      // Handle different response formats
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data as ICategory;
    } catch (error) {
      console.error('Error in getCategoryById:', error);
      
      // Check for 404 errors
      if ((error as any).response && (error as any).response.status === 404) {
        throw new Error("Kategori tidak ditemukan");
      }
      
      throw error;
    }
  },

  createCategory: async (data: { title: string }): Promise<{ message: string; data: ICategory }> => {
    try {
      console.log('Creating category with data:', data);
      const response = await axiosInstance.post(`/blog-category/add`, data);
      return response.data;
    } catch (error) {
      console.error('Error in createCategory:', error);
      
      // Handle specific API error messages
      if ((error as any).response && (error as any).response.data && (error as any).response.data.message) {
        throw new Error((error as any).response.data.message);
      }
      
      throw error;
    }
  },

  updateCategory: async (id: string, data: { title: string }): Promise<{ message: string; data: ICategory }> => {
    try {
      const response = await axiosInstance.put(`/blog-category/update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error in updateCategory:', error);
      
      // Handle specific API error messages
      if ((error as any).response && (error as any).response.data && (error as any).response.data.message) {
        throw new Error((error as any).response.data.message);
      }
      
      throw error;
    }
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.delete(`/blog-category/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      
      // Handle specific API error messages
      if ((error as any).response && (error as any).response.data && (error as any).response.data.message) {
        throw new Error((error as any).response.data.message);
      }
      
      throw error;
    }
  }
};