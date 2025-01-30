export interface IUser {
    _id: string;
    nama: string;
    email: string;
    alamat: string;
    noTelp: string;
    instansi?: string;
    foto?: string;
    status?: 'verified' | 'unverified' | 'incomplete_profile';
    createdAt?: string;
    updatedAt?: string;
    lastLogin?: string;
    additionalInfo?: {
      [key: string]: string | number | boolean;
    };
  }
  
  export interface IUserInput {
    nama: string;
    email: string;
    password: string;
    alamat: string;
    noTelp: string;
    instansi?: string;
    foto?: File;
  }
  
  export interface IUserUpdate {
    nama?: string;
    email?: string;
    alamat?: string;
    noTelp?: string;
    instansi?: string;
    foto?: File;
  }
  
  export type UserResponse = {
    message: string;
    data: IUser;
  };
  
  export type UsersResponse = {
    data: IUser[];
    message?: string;
  };
  
  export interface IUserError {
    message: string;
    code?: string;
    details?: string;
  }
  
  export interface IUserState {
    users: IUser[];
    loading: boolean;
    error: IUserError | null;
    totalPages: number;
    currentPage: number;
  }
  
  export interface IUserDetailState {
    user: IUser | null;
    isLoading: boolean;
    error: IUserError | null;
  }