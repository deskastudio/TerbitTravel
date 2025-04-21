// auth.types.ts

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nama: string;
  email: string;
  password: string;
  confirmPassword: string;
  alamat: string;
  noTelp: string;
  instansi?: string;
  foto?: File;
}

export interface ProfileData {
  alamat: string;
  noTelp: string;
  instansi?: string;
}

export interface User {
  _id: string;
  nama: string;
  email: string;
  foto?: string;
  alamat: string;
  noTelp: string;
  instansi?: string;
  role: string; // 'user' | 'admin'
  isVerified: boolean;
  googleId?: string; // Optional, if user logged in with Google
}

export interface AuthResponse {
  status: string; // 'success' or 'error'
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

