// types/api.types.ts
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// Define response types for API calls
export interface ApiResponse<T> {
  success: boolean;
  status?: number;
  data?: T;
  message?: string;
}

// Error types
export interface ApiErrorResponse {
  success: false;
  error: string;
  status?: number;
  message?: string;
  code?: string;
  config?: AxiosRequestConfig;
  data?: any;
}

// Type for API test results
export interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
  statusText?: string;
  endpoint?: string;
  triedEndpoints?: string[];
  details?: Record<string, any>;
  message?: string;
}

export interface TestResults {
  healthCheck?: TestResult;
  axiosTest?: TestResult;
  destinationsTest?: TestResult;
  environment?: {
    VITE_API_URL: string;
    currentOrigin: string;
    userAgent: string;
  };
  error?: string;
  details?: string;
}

// CORS Header types
export interface RequestHeaders {
  [key: string]: string | undefined;
  "Content-Type"?: string;
  Accept?: string;
  Authorization?: string;
  "ngrok-skip-browser-warning"?: string;
}

export interface ResponseHeaders {
  [key: string]: string | undefined;
  "access-control-allow-origin"?: string;
  "access-control-allow-credentials"?: string;
  "access-control-allow-methods"?: string;
  "access-control-allow-headers"?: string;
}

// API Error type with guaranteed message property
export class APIError extends Error {
  status?: number;
  code?: string;
  data?: any;

  constructor(
    message: string,
    options?: { status?: number; code?: string; data?: any }
  ) {
    super(message);
    this.name = "APIError";
    if (options) {
      this.status = options.status;
      this.code = options.code;
      this.data = options.data;
    }
  }
}

// Helper function to transform an unknown error to APIError
export function toAPIError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error;
  }

  if (error instanceof Error) {
    return new APIError(error.message);
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return new APIError(error.message);
  }

  return new APIError("Unknown error occurred");
}
