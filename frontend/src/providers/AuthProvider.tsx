// src/providers/AuthProvider.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '@/types/auth.types';
import authService from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  register: (formData: FormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.data?.user) {
      setUser(response.data.user);
    }
  };

  const googleLogin = async (credential: string) => {
    const response = await authService.googleLogin(credential);
    if (response.data?.user) {
      setUser(response.data.user);
    }
    return response;
  };

  const register = async (formData: FormData) => {
    return await authService.register(formData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        googleLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}