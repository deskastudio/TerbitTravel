// src/services/adminAuth.service.ts
import adminAxiosInstance from "@/lib/axiosAdmin";
import {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminUser,
  AdminUpdateProfileRequest,
  AdminChangePasswordRequest,
} from "@/types/authAdmin-types";

const ADMIN_BASE_URL = "/admin";

class AdminAuthService {
  async login(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    try {
      console.log("🔐 Admin login attempt:", {
        email: credentials.email,
        baseURL: adminAxiosInstance.defaults.baseURL,
      });

      const response = await adminAxiosInstance.post<AdminLoginResponse>(
        `${ADMIN_BASE_URL}/login`,
        credentials
      );

      console.log("✅ Admin login response:", response.data);

      const data = response.data;

      // Periksa apakah response berisi token dan user
      if (!data.token || !data.user) {
        console.error("❌ Invalid response structure:", data);
        throw new Error("Response tidak valid dari server");
      }

      // Simpan token dan set expiration
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      // Set expiration time
      const expirationTime = Date.now() + (data.expiresIn || 3600) * 1000;
      localStorage.setItem("adminTokenExpiration", expirationTime.toString());

      console.log("💾 Admin data saved to localStorage:", {
        token: data.token.substring(0, 20) + "...",
        user: data.user,
        expiresAt: new Date(expirationTime).toISOString(),
      });

      return data;
    } catch (error: any) {
      console.error("❌ Admin login error:", error);

      // Check if it's a 401 response (wrong credentials)
      if (error.response?.status === 401) {
        const message =
          error.response?.data?.message || "Email atau password salah";
        throw new Error(message);
      }

      // Enhanced error handling for other errors
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessage = validationErrors
          .map((err: any) => err.message)
          .join(", ");
        throw new Error(errorMessage);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Terjadi kesalahan saat login");
      }
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("🚪 Admin logout attempt");
      // ✅ OPTIONAL: Call logout API, tapi jangan throw error jika gagal
      await adminAxiosInstance.post(`${ADMIN_BASE_URL}/logout`);
      console.log("✅ Admin logout API successful");
    } catch (error) {
      console.log(
        "⚠️ Admin logout API failed, but continuing with local logout:",
        error
      );
    } finally {
      this.clearAuthData();
    }
  }

  async getProfile(): Promise<AdminUser> {
    try {
      console.log("👤 Fetching admin profile");
      const response = await adminAxiosInstance.get<{ data: AdminUser }>(
        `${ADMIN_BASE_URL}/profile`
      );
      console.log("✅ Admin profile fetched:", response.data.data);
      return response.data.data;
    } catch (error: any) {
      console.error("❌ Get profile error:", error);
      throw new Error(error.message || "Gagal mengambil profil");
    }
  }

  async updateProfile(
    profileData: AdminUpdateProfileRequest
  ): Promise<AdminUser> {
    try {
      console.log("✏️ Updating admin profile:", profileData);
      const response = await adminAxiosInstance.put<{ data: AdminUser }>(
        `${ADMIN_BASE_URL}/profile`,
        profileData
      );

      console.log("✅ Profile updated:", response.data.data);

      // Update localStorage dengan data terbaru
      localStorage.setItem("adminUser", JSON.stringify(response.data.data));

      return response.data.data;
    } catch (error: any) {
      console.error("❌ Update profile error:", error);
      throw new Error(error.message || "Gagal memperbarui profil");
    }
  }

  async changePassword(
    passwordData: AdminChangePasswordRequest
  ): Promise<void> {
    try {
      console.log("🔑 Changing admin password");
      await adminAxiosInstance.put(
        `${ADMIN_BASE_URL}/change-password`,
        passwordData
      );
      console.log("✅ Password changed successfully");
    } catch (error: any) {
      console.error("❌ Change password error:", error);
      throw new Error(error.message || "Gagal mengubah password");
    }
  }

  // ✅ HAPUS verifyToken - Tidak diperlukan lagi!
  // async verifyToken(): Promise<AdminUser> { ... }

  getStoredAdmin(): AdminUser | null {
    try {
      const adminData = localStorage.getItem("adminUser");
      if (!adminData) return null;

      const admin = JSON.parse(adminData);
      console.log("📱 Retrieved admin from localStorage:", admin);
      return admin;
    } catch (error) {
      console.error("❌ Error parsing stored admin:", error);
      return null;
    }
  }

  getStoredToken(): string | null {
    const token = localStorage.getItem("adminToken");
    console.log(
      "📱 Retrieved token from localStorage:",
      token ? `${token.substring(0, 20)}...` : "null"
    );
    return token;
  }

  isTokenExpired(): boolean {
    const expirationTime = localStorage.getItem("adminTokenExpiration");
    if (!expirationTime) {
      console.log("⏰ No expiration time found, considering expired");
      return true;
    }

    const isExpired = Date.now() > parseInt(expirationTime);
    console.log("⏰ Token expiration check:", {
      expirationTime: new Date(parseInt(expirationTime)).toISOString(),
      currentTime: new Date().toISOString(),
      isExpired,
    });

    return isExpired;
  }

  clearAuthData(): void {
    console.log("🧹 Clearing admin auth data from localStorage");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminTokenExpiration");

    // ✅ TAMBAHAN: Clear all possible admin-related keys
    const adminKeys = [
      "adminToken",
      "adminUser",
      "adminTokenExpiration",
      "adminAuthExpiry",
      "admin_token",
      "admin_user",
    ];

    adminKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    console.log("✅ Admin auth data cleared");
  }

  // ✅ TAMBAHAN: Force clear session with server call
  async forceClearSession(): Promise<void> {
    try {
      console.log("🧹 Force clearing admin session");

      // Call server to clear session
      await adminAxiosInstance.post("/admin/clear-session");

      // Clear local storage
      this.clearAuthData();

      // Clear any cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        if (name.trim().toLowerCase().includes("admin")) {
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      });

      console.log("✅ Force session clear completed");
    } catch (error) {
      console.log("⚠️ Force clear session failed, clearing locally:", error);
      this.clearAuthData();
    }
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const admin = this.getStoredAdmin();
    const isExpired = this.isTokenExpired();

    const isAuth = !!(token && admin && !isExpired);

    console.log("🔍 Authentication check:", {
      hasToken: !!token,
      hasAdmin: !!admin,
      isExpired,
      isAuthenticated: isAuth,
    });

    return isAuth;
  }
}

export const adminAuthService = new AdminAuthService();
