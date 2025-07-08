// src/types/authAdmin-types.ts
export interface AdminUser {
    _id: string;
    email: string;
    name: string;
    role: 'admin' | 'super-admin';
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
    isActive: boolean;
  }
  
  export interface AdminLoginRequest {
    email: string;
    password: string;
  }
  
  export interface AdminLoginResponse {
    message: string;
    token: string;
    user: AdminUser;
    expiresIn: number;
  }
  
  export interface AdminUpdateProfileRequest {
    name?: string;
    email?: string;
  }
  
  export interface AdminChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface AdminAuthState {
    isAuthenticated: boolean;
    admin: AdminUser | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface ValidationError {
    field: string;
    message: string;
    value?: any;
  }
  
  export interface ApiError {
    message: string;
    errors?: ValidationError[];
  }