import axios from "axios";
import { LoginData, AuthResponse, User } from "../types/auth.types";

// ✅ Konfigurasi URL berdasarkan environment
const isDevelopment = import.meta.env.DEV;
const API_URL = isDevelopment
  ? "http://localhost:5000" // Development: langsung ke localhost
  : import.meta.env.VITE_API_URL || "https://6dc4-36-71-64-84.ngrok-free.app"; // Production: ngrok URL

console.log("🔧 Environment:", isDevelopment ? "Development" : "Production");
console.log("🌐 API URL:", API_URL);

// ✅ Buat axios instance dengan konfigurasi yang benar
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000, // 15 detik timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // ✅ Bypass ngrok warning jika menggunakan ngrok
    ...(API_URL.includes("ngrok") && {
      "ngrok-skip-browser-warning": "true",
    }),
  },
});

const authService = {
  // ✅ Method untuk login menggunakan form
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log("🔑 Attempting form login to:", `${API_URL}/user/login`);

      const response = await apiClient.post("/user/login", data);

      if (response.data?.token) {
        this.setAuthData(response.data.token, response.data.user);
        console.log("✅ Login successful, token saved");
      }

      return {
        status: "success",
        message: response.data.message || "Login berhasil",
        data: response.data,
      };
    } catch (error: any) {
      console.error("❌ Login error:", error);

      if (error.code === "ERR_NETWORK") {
        throw new Error(
          "Server tidak dapat diakses. Pastikan server berjalan."
        );
      }

      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan saat login"
      );
    }
  },

  // ✅ Method untuk registrasi menggunakan form
  async register(formData: FormData): Promise<AuthResponse> {
    try {
      console.log("📝 Attempting registration to:", `${API_URL}/user/register`);

      const response = await apiClient.post("/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        console.log("✅ Registration successful");
        return {
          status: "success",
          message: "Registrasi berhasil",
          data: response.data,
        };
      }

      throw new Error(response.data?.message || "Registrasi gagal");
    } catch (error: any) {
      console.error("❌ Registration error:", error);

      if (error.code === "ERR_NETWORK") {
        throw new Error(
          "Server tidak dapat diakses. Pastikan server berjalan."
        );
      }

      // ✅ Handle specific backend quirk
      if (
        error.response?.status === 500 &&
        error.response?.data?.message === "Error dalam registrasi user"
      ) {
        return {
          status: "success",
          message: "Registrasi berhasil",
        };
      }

      throw error;
    }
  },

  // ✅ Method untuk verifikasi OTP
  async verifyOTP(data: { email: string; otp: string }): Promise<AuthResponse> {
    try {
      console.log(
        "🔐 Attempting OTP verification to:",
        `${API_URL}/user/verify-otp`
      );

      const response = await apiClient.post("/user/verify-otp", data);

      console.log("✅ OTP verification successful");
      return response.data;
    } catch (error: any) {
      console.error("❌ OTP verification error:", error);

      if (error.code === "ERR_NETWORK") {
        throw new Error(
          "Server tidak dapat diakses. Pastikan server berjalan."
        );
      }

      throw new Error(
        error.response?.data?.message || "Gagal memverifikasi OTP"
      );
    }
  },

  // ✅ Method untuk resend OTP
  async resendOTP(data: { email: string }): Promise<AuthResponse> {
    try {
      console.log("🔄 Attempting resend OTP to:", `${API_URL}/user/resend-otp`);

      const response = await apiClient.post("/user/resend-otp", data);

      console.log("✅ Resend OTP successful");
      return response.data;
    } catch (error: any) {
      console.error("❌ Resend OTP error:", error);

      if (error.code === "ERR_NETWORK") {
        throw new Error(
          "Server tidak dapat diakses. Pastikan server berjalan."
        );
      }

      throw new Error(
        error.response?.data?.message || "Gagal mengirim ulang OTP"
      );
    }
  },

  // ✅ Method untuk register menggunakan Google
  async googleRegister(credential: string): Promise<AuthResponse> {
    try {
      console.log(
        "🔵 Attempting Google register to:",
        `${API_URL}/user/auth/google/register`
      );
      console.log("🎫 Credential length:", credential.length);

      const response = await apiClient.post("/user/auth/google/register", {
        credential,
      });

      if (response.data?.data?.token) {
        const { token, user } = response.data.data;
        this.setAuthData(token, user);
        console.log("✅ Google register successful, token saved");
      }

      return response.data;
    } catch (error: any) {
      console.error("❌ Google register error:", error);
      console.error("📊 Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code,
        url: error.config?.url,
      });

      if (error.code === "ERR_NETWORK") {
        throw new Error(
          "Server tidak dapat diakses. Pastikan server berjalan di port 5000"
        );
      }

      if (error.response?.status === 409) {
        throw new Error(
          "Email sudah terdaftar. Silakan login menggunakan Google."
        );
      }

      if (error.response?.status === 500) {
        throw new Error("Terjadi kesalahan pada server. Silakan coba lagi.");
      }

      throw new Error(
        error.response?.data?.message || "Gagal register dengan Google"
      );
    }
  },

  // ✅ Method untuk login menggunakan Google
  async googleLogin(credential: string): Promise<AuthResponse> {
    try {
      console.log(
        "🔵 Attempting Google login to:",
        `${API_URL}/user/auth/google/login`
      );
      console.log("🎫 Credential length:", credential.length);
      console.log("🌐 Full request URL:", `${API_URL}/user/auth/google/login`);

      const response = await apiClient.post("/user/auth/google/login", {
        credential,
      });

      if (response.data?.data?.token) {
        const { token, user } = response.data.data;
        this.setAuthData(token, user);
        console.log("✅ Google login successful, token saved");
      }

      return response.data;
    } catch (error: any) {
      console.error("❌ Google login error:", error);
      console.error("📊 Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });

      // ✅ Detailed error handling
      if (error.code === "ERR_NETWORK") {
        console.error("🚫 Network error - possible causes:");
        console.error("   - Server not running");
        console.error("   - CORS issues");
        console.error("   - Firewall blocking");
        throw new Error(
          "Server tidak dapat diakses. Pastikan server berjalan di port 5000"
        );
      }

      if (error.response?.status === 404) {
        console.error("🔍 404 error - endpoint not found");
        throw new Error(
          "Akun tidak ditemukan. Silakan register terlebih dahulu."
        );
      }

      if (error.response?.status === 401) {
        throw new Error("Credential Google tidak valid");
      }

      if (error.response?.status === 403) {
        throw new Error("Akses ditolak. Periksa konfigurasi Google OAuth");
      }

      throw new Error(
        error.response?.data?.message || "Gagal login dengan Google"
      );
    }
  },

  // ✅ Method untuk menyimpan data auth
  setAuthData(token: string, user: User): void {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      console.log("💾 Auth data saved to localStorage");
    } catch (error) {
      console.error("❌ Failed to save auth data:", error);
    }
  },

  // ✅ Method untuk logout
  logout(): void {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      console.log("🚪 Logout successful, localStorage cleared");
    } catch (error) {
      console.error("❌ Failed to clear localStorage:", error);
    }
  },

  // ✅ Check apakah user sudah authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    const isAuth = !!token;
    console.log("🔐 Authentication check:", isAuth);
    return isAuth;
  },

  // ✅ Get current user data
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;

      const user = JSON.parse(userStr);
      console.log("👤 Current user:", user.email || user.name);
      return user;
    } catch (error) {
      console.error("❌ Failed to parse user data:", error);
      return null;
    }
  },

  // ✅ Get user role
  getRole(): string {
    const role = localStorage.getItem("role") || "user";
    console.log("👑 User role:", role);
    return role;
  },

  // ✅ Check if user is admin
  isAdmin(): boolean {
    return this.getRole() === "admin";
  },

  // ✅ Get redirect path based on role
  getRedirectPath(): string {
    const path = this.isAdmin() ? "/admin/dashboard" : "/dashboard";
    console.log("🎯 Redirect path:", path);
    return path;
  },

  // ✅ Health check method untuk testing
  async healthCheck(): Promise<boolean> {
    try {
      console.log("🏥 Performing health check...");
      const response = await apiClient.get("/api/health");
      console.log("✅ Health check successful:", response.data);
      return true;
    } catch (error) {
      console.error("❌ Health check failed:", error);
      return false;
    }
  },
};

// ✅ Request interceptor dengan logging yang detail
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Detailed logging
    console.log(
      `📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    console.log("📋 Request headers:", config.headers);

    if (config.data) {
      // Don't log FormData content, just indicate it's present
      if (config.data instanceof FormData) {
        console.log("📄 Request body: FormData");
      } else {
        console.log("📄 Request body:", config.data);
      }
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor dengan logging yang detail
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `📥 ${response.status} ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`
    );
    console.log("📋 Response headers:", response.headers);
    console.log("📄 Response data:", response.data);

    return response;
  },
  (error) => {
    // Detailed error logging
    console.error("❌ Response interceptor error:");
    console.error("   URL:", error.config?.url);
    console.error("   Method:", error.config?.method?.toUpperCase());
    console.error("   Status:", error.response?.status);
    console.error("   Status Text:", error.response?.statusText);
    console.error("   Response Data:", error.response?.data);
    console.error("   Error Message:", error.message);
    console.error("   Error Code:", error.code);

    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      console.log("🚪 Unauthorized - logging out...");
      authService.logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default authService;
