// src/lib/axiosAdmin.ts - COMPLETE FIXED VERSION
import axios from "axios";

// ✅ PERBAIKAN: Simple URL configuration
const ADMIN_API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const IS_LOCALTUNNEL = ADMIN_API_BASE_URL.includes("loca.lt");
const IS_DEVELOPMENT = import.meta.env.MODE === "development";

console.log("🌐 Admin API Configuration:", {
  baseURL: ADMIN_API_BASE_URL,
  isLocaltunnel: IS_LOCALTUNNEL,
  isDevelopment: IS_DEVELOPMENT,
  mode: import.meta.env.MODE,
});

const adminAxiosInstance = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // ✅ PERBAIKAN: Localtunnel specific headers (tanpa User-Agent)
    ...(IS_LOCALTUNNEL && {
      "bypass-tunnel-reminder": "true",
      // User-Agent dihapus karena browser tidak mengizinkan override
    }),
  },
  // ✅ CRITICAL FIX: Disable credentials untuk localtunnel, enable for others
  withCredentials: !IS_LOCALTUNNEL,
  timeout: IS_LOCALTUNNEL ? 30000 : 10000, // 30s for tunnel, 10s for local
  // ✅ PERBAIKAN: Validate status yang lebih permisif untuk debugging
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
});

// ✅ PERBAIKAN: Request interceptor
adminAxiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🚀 [Admin API] ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`🎯 Target: ${config.baseURL} (Localtunnel: ${IS_LOCALTUNNEL})`);

    // Add Authorization header
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers["Authorization"] = `Bearer ${adminToken}`;
      console.log(`🔑 Auth: Bearer ${adminToken.substring(0, 20)}...`);
    }

    // ✅ PERBAIKAN: Localtunnel specific handling (tanpa User-Agent)
    if (IS_LOCALTUNNEL) {
      // Force disable credentials for localtunnel
      config.withCredentials = false;
      config.headers["bypass-tunnel-reminder"] = "true";
      // User-Agent dihapus - browser mengatur sendiri
      console.log("🚇 Localtunnel headers applied, credentials disabled");
    }

    // ✅ PERBAIKAN: Log headers for debugging
    console.log("📋 Request Headers:", {
      "Content-Type": config.headers["Content-Type"],
      "Authorization": config.headers["Authorization"] ? "Bearer ***" : "None",
      "withCredentials": config.withCredentials,
      "bypass-tunnel-reminder": config.headers["bypass-tunnel-reminder"] || "Not set",
    });

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Retry helper function for tunnel connections
const retryLocaltunnelRequest = async (error: any) => {
  const config = error.config;
  // Only retry for timeout errors with loca.lt or ngrok
  if (
    (error.code === "ECONNABORTED" || error.message.includes("timeout")) &&
    (config.baseURL?.includes("loca.lt") || config.baseURL?.includes("ngrok")) &&
    (!config._retryCount || config._retryCount < 2) // Max 2 retries
  ) {
    config._retryCount = config._retryCount || 0;
    config._retryCount += 1;
    console.log(`🔄 Retry attempt ${config._retryCount}/2 for request to ${config.url}`);
    // Short delay before retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    // If it's the second retry attempt, try a fallback URL if available
    if (config._retryCount === 2) {
      const fallbackUrl = import.meta.env.VITE_API_URL_BACKUP || "http://localhost:5000";
      if (fallbackUrl && fallbackUrl !== config.baseURL) {
        console.log(`🔀 Trying fallback URL: ${fallbackUrl}`);
        config.baseURL = fallbackUrl;
      }
    }
    return adminAxiosInstance(config);
  }
  return Promise.reject(error);
};
adminAxiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ [Admin API] ${response.status} ${response.config.url}`);
    // ✅ Log response headers for CORS debugging
    if (IS_DEVELOPMENT) {
      console.log("📋 Response Headers:", {
        "access-control-allow-origin": response.headers["access-control-allow-origin"],
        "access-control-allow-credentials": response.headers["access-control-allow-credentials"],
        "content-type": response.headers["content-type"],
      });
    }
    return response;
  },
  async (error) => {
    console.error(`\n❌ [Admin API Error] ${error.config?.url}:`);
    // Try to retry localtunnel requests that time out
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      try {
        console.log("🔄 Attempting to retry timed out request...");
        return await retryLocaltunnelRequest(error);
      } catch (retryError) {
        console.error("❌ Retry failed:", retryError);
        // Continue with normal error handling
      }
    }
    // ✅ Enhanced error logging
    const errorInfo = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code,
      url: error.config?.baseURL,
      isLocaltunnel: IS_LOCALTUNNEL,
    };
    console.error("📊 Error Details:", errorInfo);
    // ✅ PERBAIKAN: Specific localtunnel error handling
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("🚫 Network/CORS Error Detected:");
      if (IS_LOCALTUNNEL) {
        console.error("🚇 Localtunnel Specific Troubleshooting:");
        console.error("   1. Open https://terbit-travel.loca.lt in browser first");
        console.error("   2. Click 'Continue to terbit-travel.loca.lt' if warning appears");
        console.error("   3. Check if localtunnel is still running: npx localtunnel --port 5000 --subdomain terbit-travel");
        console.error("   4. Try restarting localtunnel if expired");
        console.error("   5. Alternative: Use ngrok instead");
      }
      console.error("🔍 General Troubleshooting:");
      console.error("   1. Check backend server: http://localhost:5000/api/health");
      console.error("   2. Verify CORS configuration");
      console.error("   3. Check network connectivity");
    }
    // ✅ PERBAIKAN: Handle 511 Network Authentication Required
    if (error.response?.status === 511) {
      console.error("🚫 511 Network Authentication Required:");
      console.error("   - Localtunnel requires browser authentication");
      console.error("   - Visit: https://terbit-travel.loca.lt");
      console.error("   - Accept the warning page");
      console.error("   - Then retry the request");
      // Show user-friendly error
      alert("Localtunnel memerlukan verifikasi browser. Silakan buka https://terbit-travel.loca.lt di browser terlebih dahulu, kemudian coba lagi.");
    }
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized - clearing auth data");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminTokenExpiration");
      if (window.location.pathname.startsWith("/admin") && 
          window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// Default export so other services can import the axios instance
export default adminAxiosInstance;