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
  // ✅ CRITICAL FIX: Disable credentials untuk localtunnel
  withCredentials: !IS_LOCALTUNNEL,
  timeout: 30000,
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

// ✅ PERBAIKAN: Response interceptor with localtunnel error handling
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
  (error) => {
    console.error(`❌ [Admin API Error] ${error.config?.url}:`);
    
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

// ✅ PERBAIKAN: Test connection function for localtunnel
export const testAdminConnection = async () => {
  try {
    console.log("🔍 Testing admin API connection...");
    console.log(`🎯 Target URL: ${ADMIN_API_BASE_URL}/api/health`);
    
    if (IS_LOCALTUNNEL) {
      console.log("🚇 Localtunnel detected - testing with simple fetch first");
      
      // Test with fetch first for localtunnel
      const fetchResponse = await fetch(`${ADMIN_API_BASE_URL}/api/health`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "bypass-tunnel-reminder": "true",
        },
        // No credentials for localtunnel
      });
      
      if (fetchResponse.ok) {
        console.log("✅ Fetch test successful, trying axios...");
      } else {
        console.error("❌ Fetch test failed:", fetchResponse.status, fetchResponse.statusText);
        return {
          success: false,
          error: `Fetch failed: ${fetchResponse.status}`,
          suggestion: "Visit https://terbit-travel.loca.lt in browser first"
        };
      }
    }

    const response = await adminAxiosInstance.get("/api/health");
    console.log("✅ Admin API connection successful:", response.data);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    console.error("❌ Admin API connection failed:", error);
    let errorMessage = "Unknown error";
    let errorCode = undefined;
    let errorStatus = undefined;
    if (typeof error === "object" && error !== null) {
      errorMessage = (error as { message?: string }).message || errorMessage;
      errorCode = (error as { code?: string }).code;
      errorStatus = (error as { response?: { status?: number } }).response?.status;
    }
    return {
      success: false,
      error: errorMessage,
      details: {
        code: errorCode,
        status: errorStatus,
        baseURL: ADMIN_API_BASE_URL,
        isLocaltunnel: IS_LOCALTUNNEL,
      },
    };
  }
};

export default adminAxiosInstance;