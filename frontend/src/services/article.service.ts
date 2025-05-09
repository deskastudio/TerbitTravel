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

      // Menggunakan endpoint blog, bukan article
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
      // Menggunakan endpoint blog
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
      formData.append("judul", data.judul);
      formData.append("penulis", data.penulis);
      formData.append("isi", data.isi);
      formData.append("kategori", data.kategori);
      
      // Convert hashtags array to JSON string
      formData.append("hashtags", JSON.stringify(data.hashtags || []));
      
      // Append main image
      if (data.gambarUtama) {
        formData.append("gambarUtama", data.gambarUtama);
      }
      
      // Append additional images
      if (data.gambarTambahan && data.gambarTambahan.length > 0) {
        data.gambarTambahan.forEach((image) => {
          formData.append("gambarTambahan", image);
        });
      }

      console.log('Form data being sent:', Object.fromEntries(formData));

      // Menggunakan endpoint blog
      const response = await axiosInstance.post<ArticleResponse>(
        `/blog/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error in createArticle:', error);
      throw error;
    }
  },

  updateArticle: async (id: string, data: IArticleInput): Promise<ArticleResponse> => {
    try {
      const formData = new FormData();
      formData.append("judul", data.judul);
      formData.append("penulis", data.penulis);
      formData.append("isi", data.isi);
      formData.append("kategori", data.kategori);
      
      // Convert hashtags array to JSON string
      formData.append("hashtags", JSON.stringify(data.hashtags || []));
      
      // Append main image if exists
      if (data.gambarUtama) {
        formData.append("gambarUtama", data.gambarUtama);
      }
      
      // Append additional images if any
      if (data.gambarTambahan && data.gambarTambahan.length > 0) {
        data.gambarTambahan.forEach((image) => {
          formData.append("gambarTambahan", image);
        });
      }

      // Menggunakan endpoint blog
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
      throw error;
    }
  },

  deleteArticle: async (id: string): Promise<{ message: string }> => {
    try {
      // Menggunakan endpoint blog
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
      console.log('Trying to fetch categories from:', '/category/get');
      
      // Mencoba request dengan logging yang lebih lengkap
      const response = await axiosInstance.get(`/category/get`);
      
      console.log('Categories response status:', response.status);
      console.log('Categories response data:', response.data);
      
      // Jika data adalah array langsung, gunakan ini
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // Jika data dibungkus dalam properti data, gunakan ini
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      // Jika format respons tidak sesuai, log error dan return array kosong
      console.error('Unexpected response format:', response.data);
      return [];
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      console.error('Error details:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getCategoryById: async (id: string): Promise<ICategory> => {
    try {
      const response = await axiosInstance.get<ICategory>(`/category/get/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getCategoryById:', error);
      throw error;
    }
  },

  createCategory: async (data: { nama: string, deskripsi: string }): Promise<{ message: string; data: ICategory }> => {
    try {
      console.log('Creating category with data:', data);
      const response = await axiosInstance.post(`/category/add`, data);
      return response.data;
    } catch (error) {
      console.error('Error in createCategory:', error);
      throw error;
    }
  },

  updateCategory: async (id: string, data: { nama: string, deskripsi: string }): Promise<{ message: string; data: ICategory }> => {
    try {
      const response = await axiosInstance.put(`/category/update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error in updateCategory:', error);
      throw error;
    }
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.delete(`/category/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      throw error;
    }
  }
};