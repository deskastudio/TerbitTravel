// utils/api-test.ts
import axiosInstance from "@/lib/axios";
import axiosAdmin from "@/lib/axiosAdmin";
import { AxiosError } from "axios";

export const testDestinationAPI = async () => {
  try {
    console.log('Testing destination API...');
    const response = await axiosInstance.get('/destination/getAll');
    console.log('Destination API response:', response);
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      message: `Successfully fetched ${Array.isArray(response.data) ? response.data.length : 'data'}`
    };
  } catch (error) {
    console.error('Destination API test error:', error);
    
    const axiosError = error as AxiosError;
    return {
      success: false,
      error: axiosError.message,
      config: axiosError.config,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data
    };
  }
};

export const testBackendHealth = async () => {
  try {
    const response = await axiosInstance.get('/health');
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      success: false,
      error: axiosError.message,
      status: axiosError.response?.status
    };
  }
};

export const testAuthStatus = async () => {
  try {
    const response = await axiosAdmin.get('/admin-auth/check');
    return {
      success: true,
      status: response.status,
      authenticated: response.data?.authenticated || false,
      user: response.data?.user || null
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      success: false,
      error: axiosError.message,
      status: axiosError.response?.status,
      data: axiosError.response?.data
    };
  }
};
