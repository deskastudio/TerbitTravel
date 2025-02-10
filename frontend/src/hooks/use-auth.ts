import { create } from 'zustand';
import { User } from '@/types/auth.types';
import authService from '@/services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  googleLogin: (credential: string) => Promise<any>;
  googleRegister: (credential: string) => Promise<any>;
  register: (formData: FormData) => Promise<any>;
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
      set({ 
        user: response.data?.user,
        isAuthenticated: true,
        isLoading: false 
      });
      return response;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  googleLogin: async (credential: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.googleLogin(credential);
      set({ 
        user: response.data?.user,
        isAuthenticated: true,
        isLoading: false 
      });
      return response;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  googleRegister: async (credential: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.googleRegister(credential);
      set({ 
        user: response.data?.user,
        isAuthenticated: true,
        isLoading: false 
      });

      return response;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
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
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null })
}));