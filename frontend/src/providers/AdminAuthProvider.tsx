// src/providers/AdminAuthProvider.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { AdminAuthState, AdminUser, AdminLoginRequest, AdminUpdateProfileRequest, AdminChangePasswordRequest } from '@/types/authAdmin-types';

interface AdminAuthContextType extends AdminAuthState {
  login: (credentials: AdminLoginRequest) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (profileData: AdminUpdateProfileRequest) => Promise<AdminUser>;
  changePassword: (passwordData: AdminChangePasswordRequest) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const adminAuth = useAdminAuth();

  return (
    <AdminAuthContext.Provider value={adminAuth}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook untuk menggunakan AdminAuthContext
export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuthContext must be used within AdminAuthProvider');
  }
  return context;
};

// Export default untuk backward compatibility
export default AdminAuthProvider;