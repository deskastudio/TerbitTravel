import axios from '@/lib/axios';
import { Hotel, HotelInput, ApiResponse, PaginatedResponse } from '@/types/hotel.types';

class HotelService {
  private readonly baseUrl = '/hotel';

  async getAllHotels(params?: {
    page?: number;
    limit?: number;
    search?: string;
    stars?: number;
  }): Promise<PaginatedResponse<Hotel>> {
    const response = await axios.get(`${this.baseUrl}/getAll`, { params });
    return response.data;
  }

  async getHotelById(id: string): Promise<ApiResponse<Hotel>> {
    const response = await axios.get(`${this.baseUrl}/get/${id}`);
    return response.data;
  }

  async createHotel(hotelData: HotelInput): Promise<ApiResponse<Hotel>> {
    const formData = new FormData();
    
    // Append text data
    formData.append('nama', hotelData.nama);
    formData.append('alamat', hotelData.alamat);
    formData.append('bintang', hotelData.bintang.toString());
    formData.append('harga', hotelData.harga.toString());
    hotelData.fasilitas.forEach((facility, index) => {
      formData.append(`fasilitas[${index}]`, facility);
    });

    // Append images
    hotelData.gambar.forEach((file) => {
      formData.append('gambar', file);
    });

    const response = await axios.post(`${this.baseUrl}/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateHotel(id: string, hotelData: Partial<HotelInput>): Promise<ApiResponse<Hotel>> {
    const formData = new FormData();
    
    // Append only provided data
    if (hotelData.nama) formData.append('nama', hotelData.nama);
    if (hotelData.alamat) formData.append('alamat', hotelData.alamat);
    if (hotelData.bintang) formData.append('bintang', hotelData.bintang.toString());
    if (hotelData.harga) formData.append('harga', hotelData.harga.toString());
    if (hotelData.fasilitas) {
      hotelData.fasilitas.forEach((facility, index) => {
        formData.append(`fasilitas[${index}]`, facility);
      });
    }
    if (hotelData.gambar) {
      hotelData.gambar.forEach((file) => {
        formData.append('gambar', file);
      });
    }

    const response = await axios.put(`${this.baseUrl}/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteHotel(id: string): Promise<ApiResponse<null>> {
    const response = await axios.delete(`${this.baseUrl}/delete/${id}`);
    return response.data;
  }
}

export const hotelService = new HotelService();