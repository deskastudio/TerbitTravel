import axios from 'axios';
import { LoginData, AuthResponse, User } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

axios.defaults.withCredentials = true; // Enable credentials

const authService = {
  // Method untuk login menggunakan form
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/user/login`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data?.token) {
        this.setAuthData(response.data.token, response.data.user);
      }
      
      return {
        status: 'success',
        message: response.data.message || 'Login berhasil',
        data: response.data
      };
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Server tidak dapat diakses. Pastikan server berjalan.');
      }
      throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat login');
    }
  },

  // Method untuk registrasi menggunakan form
  async register(formData: FormData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/user/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 201 || response.status === 200) {
        return {
          status: 'success',
          message: 'Registrasi berhasil',
          data: response.data
        };
      }
  
      throw new Error(response.data?.message || 'Registrasi gagal');
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Server tidak dapat diakses. Pastikan server berjalan.');
      }
      
      if (error.response?.status === 500 && error.response?.data?.message === 'Error dalam registrasi user') {
        return {
          status: 'success',
          message: 'Registrasi berhasil',
        };
      }
      throw error;
    }
  },

  async verifyOTP(data: { email: string; otp: string }): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/user/verify-otp`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Server tidak dapat diakses. Pastikan server berjalan.');
      }
      throw new Error(error.response?.data?.message || "Gagal memverifikasi OTP");
    }
  },
  
  async resendOTP(data: { email: string }): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/user/resend-otp`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Server tidak dapat diakses. Pastikan server berjalan.');
      }
      throw new Error(error.response?.data?.message || "Gagal mengirim ulang OTP");
    }
  },

  // Method untuk register menggunakan Google
  async googleRegister(credential: string): Promise<AuthResponse> {
    try {
      console.log('Attempting Google register');
      const response = await axios.post(
        `${API_URL}/user/auth/google/register`,
        { credential },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
  
      if (response.data?.data?.token) {
        const { token, user } = response.data.data;
        this.setAuthData(token, user);
      }
  
      return response.data;
    } catch (error: any) {
      console.error('Google register error:', error);
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Server tidak dapat diakses. Pastikan server berjalan di port 5000');
      }
      
      if (error.response?.status === 409) {
        throw new Error('Email sudah terdaftar. Silakan login menggunakan Google.');
      }
  
      if (error.response?.status === 500) {
        throw new Error('Terjadi kesalahan pada server. Silakan coba lagi.');
      }
      
      throw new Error(error.response?.data?.message || 'Gagal register dengan Google');
    }
  },

  // Method untuk login menggunakan Google
  async googleLogin(credential: string): Promise<AuthResponse> {
    try {
      console.log('Attempting Google login');
      const response = await axios.post(
        `${API_URL}/user/auth/google/login`,
        { credential },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data?.data?.token) {
        const { token, user } = response.data.data;
        this.setAuthData(token, user);
      }

      return response.data;
    } catch (error: any) {
      console.error('Google login error:', error);
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Server tidak dapat diakses. Pastikan server berjalan di port 5000');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Akun tidak ditemukan. Silakan register terlebih dahulu.');
      }
      
      throw new Error(error.response?.data?.message || 'Gagal login dengan Google');
    }
  },

  private setAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', user.role);
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getRole(): string {
    return localStorage.getItem('role') || 'user';
  },

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  },

  getRedirectPath(): string {
    return this.isAdmin() ? '/admin/dashboard' : '/dashboard';
  }
};

// Axios interceptors
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true; // Enable credentials for all requests
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default authService;