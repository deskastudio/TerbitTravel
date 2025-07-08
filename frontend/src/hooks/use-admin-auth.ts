// src/hooks/use-admin-auth.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '@/services/adminAuth.service';
import { 
  AdminLoginRequest, 
  AdminUpdateProfileRequest,
  AdminChangePasswordRequest,
  AdminAuthState 
} from '@/types/authAdmin-types';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<AdminAuthState>({
    isAuthenticated: false,
    admin: null,
    token: null,
    loading: true,
    error: null,
  });

  // ✅ SIMPLIFIED: Check authentication dari localStorage saja
  const checkAuth = useCallback(() => {
    console.log('🔍 Checking admin auth from localStorage...');
    
    try {
      const token = adminAuthService.getStoredToken();
      const storedAdmin = adminAuthService.getStoredAdmin();

      console.log('📱 LocalStorage check:', {
        hasToken: !!token,
        hasAdmin: !!storedAdmin,
        isExpired: adminAuthService.isTokenExpired(),
        admin: storedAdmin
      });

      // ✅ Simple check: ada token, ada admin, tidak expired
      if (token && storedAdmin && !adminAuthService.isTokenExpired()) {
        console.log('✅ Admin authenticated from localStorage');
        setState({
          isAuthenticated: true,
          admin: storedAdmin,
          token,
          loading: false,
          error: null,
        });
      } else {
        console.log('❌ Admin not authenticated, clearing data');
        adminAuthService.clearAuthData();
        setState({
          isAuthenticated: false,
          admin: null,
          token: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('❌ Error checking auth:', error);
      adminAuthService.clearAuthData();
      setState({
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Auth check failed'
      });
    }
  }, []); // ✅ No dependencies = no infinite loop

  // Login function
  const login = useCallback(async (credentials: AdminLoginRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await adminAuthService.login(credentials);
      
      console.log('✅ Login successful, updating state');
      setState({
        isAuthenticated: true,
        admin: response.user,
        token: response.token,
        loading: false,
        error: null,
      });

      navigate('/admin/dashboard');
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login gagal';
      console.error('❌ Login failed:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [navigate]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      // ✅ Call logout API (optional)
      try {
        await adminAuthService.logout();
      } catch (error) {
        console.log('⚠️ Logout API failed, but continuing with local logout');
      }
      
      // ✅ Always clear local data
      adminAuthService.clearAuthData();
      setState({
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
        error: null,
      });

      navigate('/admin/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force logout even on error
      adminAuthService.clearAuthData();
      setState({
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
        error: null,
      });
      navigate('/admin/login');
    }
  }, [navigate]);

  // Update profile function
  const updateProfile = useCallback(async (profileData: AdminUpdateProfileRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const updatedAdmin = await adminAuthService.updateProfile(profileData);
      
      setState(prev => ({
        ...prev,
        admin: updatedAdmin,
        loading: false,
      }));

      return updatedAdmin;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memperbarui profil';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  // Change password function
  const changePassword = useCallback(async (passwordData: AdminChangePasswordRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await adminAuthService.changePassword(passwordData);
      
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengubah password';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role: string) => {
    if (!state.admin) return false;
    if (state.admin.role === 'super-admin') return true;
    return state.admin.role === role;
  }, [state.admin]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles: string[]) => {
    if (!state.admin) return false;
    if (state.admin.role === 'super-admin') return true;
    return roles.includes(state.admin.role);
  }, [state.admin]);

  // ✅ SIMPLIFIED: Check auth hanya sekali pada mount
  useEffect(() => {
    console.log('🔄 useAdminAuth: Initial auth check');
    checkAuth();
  }, []); // ✅ Empty dependency = hanya run sekali

  // ✅ SIMPLIFIED: Auto logout hanya ketika benar-benar expired
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const checkExpiration = () => {
      if (adminAuthService.isTokenExpired()) {
        console.log('⏰ Token expired, auto logout');
        logout();
      }
    };

    // Check every 5 minutes (instead of every minute)
    const interval = setInterval(checkExpiration, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.isAuthenticated, logout]);

  return {
    ...state,
    login,
    logout,
    updateProfile,
    changePassword,
    checkAuth,
    clearError,
    hasRole,
    hasAnyRole,
  };
};