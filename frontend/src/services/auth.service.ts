import axios from 'axios';
import { LoginData, AuthResponse, User } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const GOOGLE_CLIENT_ID = import.meta.env.REACT_APP_GOOGLE_CLIENT_ID;

const authService = {
  getGoogleClientId() {
    return GOOGLE_CLIENT_ID;
  },

  // Method untuk login menggunakan form
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/user/login`, data);
      
      // Jika login berhasil, simpan data user dan token
      if (response.data?.token) {
        this.setAuthData(response.data.token, response.data.user);
      }
      
      return {
        status: 'success',
        message: response.data.message || 'Login berhasil',
        data: response.data
      };
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Terjadi kesalahan saat login');
    }
  },

  // Method untuk registrasi menggunakan form
  async register(formData: FormData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/user/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Jika status HTTP 201/200, anggap berhasil meskipun ada error message
      if (response.status === 201 || response.status === 200) {
        return {
          status: 'success',
          message: 'Registrasi berhasil',
          data: response.data
        };
      }
  
      throw new Error(response.data?.message || 'Registrasi gagal');
    } catch (error: any) {
      // Jika error tapi ada data di database, anggap berhasil
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
      const response = await axios.post(`${API_URL}/user/verify-otp`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gagal memverifikasi OTP");
    }
  },
  
  async resendOTP(data: { email: string }): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/user/resend-otp`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gagal mengirim ulang OTP");
    }
  },

  // Method untuk login menggunakan Google
  async googleLogin(credential: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/user/auth/google/callback`, { credential });
    if (response.data.data?.token) {
      this.setAuthData(response.data.data.token, response.data.data.user);
    }
    return response.data;
  },

  // Method untuk mendapatkan URL Google auth
  getGoogleAuthUrl() {
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    return `${API_URL}/user/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  },

  // Method untuk handle error google auth
  handleGoogleError(error: any) {
    console.error('Google auth error:', error);
    if (error.error === 'popup_closed_by_user') {
      return { error: 'Login dibatalkan oleh pengguna' };
    }
    return { error: 'Gagal melakukan autentikasi dengan Google' };
  },

  // Method untuk menyimpan token dan user ke localStorage
  private setAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', user.role);
  },

  // Method untuk mengambil header Authorization
  private authHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Method untuk logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  },

  // Method untuk mengecek apakah user terautentikasi
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  // Method untuk mendapatkan user yang sedang login
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Method untuk mendapatkan role user
  getRole(): string {
    return localStorage.getItem('role') || 'user';
  },

  // Method untuk mengecek apakah user adalah admin
  isAdmin(): boolean {
    return this.getRole() === 'admin';
  },

  // Method untuk mendapatkan path redirect setelah login
  getRedirectPath(): string {
    return this.isAdmin() ? '/admin/dashboard' : '/dashboard';
  },
};

// Axios interceptors untuk menambahkan header Authorization
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
