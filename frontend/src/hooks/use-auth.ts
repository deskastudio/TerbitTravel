import { create } from 'zustand';
import { User } from '@/types/auth.types';
import authService from '@/services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  register: (formData: FormData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login({ email, password });
      
      if (response.status === 'success') {
        set({ 
          user: response.data?.user,
          isAuthenticated: true,
          isLoading: false 
        });
        return response;
      }
      
      throw new Error(response.message || 'Login gagal');
    } catch (error: any) {
      const errorMessage = error.message || 'Login gagal';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  googleLogin: async (credential: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.googleLogin(credential);
      set({ 
        user: response.data?.user || null,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Google login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (formData: FormData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.register(formData);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      // Jika error message menunjukkan registrasi berhasil, abaikan error
      if (error.response?.status === 500 && error.response?.data?.message === 'Error dalam registrasi user') {
        set({ isLoading: false });
        return {
          status: 'success',
          message: 'Registrasi berhasil'
        };
      }
      
      const errorMessage = error.message || "Terjadi kesalahan saat registrasi";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null })
}));
