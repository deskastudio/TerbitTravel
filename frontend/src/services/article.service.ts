// services/article.service.ts

import axiosInstance from "@/lib/axios";
import { 
  IArticle, 
  IArticleInput, 
  ArticleResponse,
  ICategory
} from "@/types/article.types";

export const ArticleService = {
  // Article operations
  getAllArticles: async (page = 1, limit = 10, search = "", kategori = ""): Promise<{data: IArticle[], meta: any}> => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (search) params.append("search", search);
      if (kategori && kategori !== "all") params.append("kategori", kategori);

      // Menggunakan endpoint blog
      const response = await axiosInstance.get<{data: IArticle[], meta: any}>(
        `/blog/get?${params.toString()}`
      );
      console.log('Raw article response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getAllArticles:', error);
      throw error;
    }
  },

  getArticleById: async (id: string): Promise<IArticle> => {
    try {
      const response = await axiosInstance.get<IArticle>(`/blog/get/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getArticleById:', error);
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
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        // Jika ada pesan error spesifik dari server
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
        
        // Jika ada detail errors dari validasi
        if (error.response.data && error.response.data.errors) {
          const errorMessages = error.response.data.errors
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
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error in updateArticle:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
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
      throw error;
    }
  },

  // Category operations
  getAllCategories: async (): Promise<ICategory[]> => {
    try {
      console.log('Fetching categories...');
      
      // Menggunakan endpoint blog-category
      const response = await axiosInstance.get(`/blog-category/get`);
      
      console.log('Categories response status:', response.status);
      console.log('Categories response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      console.error('Error details:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getCategoryById: async (id: string): Promise<ICategory> => {
    try {
      const response = await axiosInstance.get<ICategory>(`/blog-category/get/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getCategoryById:', error);
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
      throw error;
    }
  },

  updateCategory: async (id: string, data: { title: string }): Promise<{ message: string; data: ICategory }> => {
    try {
      const response = await axiosInstance.put(`/blog-category/update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error in updateCategory:', error);
      throw error;
    }
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.delete(`/blog-category/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      throw error;
    }
  }
};