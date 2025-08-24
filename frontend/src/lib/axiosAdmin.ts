// src/lib/axiosAdmin.ts - PERBAIKAN LENGKAP
import axios from "axios";

// ✅ PERBAIKAN: URL configuration yang lebih robust
const ADMIN_API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (envUrl) {
    return envUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  // ✅ FALLBACK: Default untuk development
  return "http://localhost:5000";
})();

console.log("🌐 Admin API Configuration:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  baseURL: ADMIN_API_BASE_URL,
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  currentOrigin: window.location.origin,
});

const adminAxiosInstance = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // ✅ PERBAIKAN: Tambahan header untuk tunnel services, removed Origin header
    ...((ADMIN_API_BASE_URL.includes("ngrok") ||
      ADMIN_API_BASE_URL.includes("loca.lt")) && {
      "ngrok-skip-browser-warning": "true",
      // Browser blocked Origin header removed - set automatically by browser
    }),
  },
  withCredentials: true, // ✅ Diubah ke true agar cookies dikirim pada cross-origin request
  timeout: 10000, // ✅ PERBAIKAN: Kurangi timeout ke 10 detik untuk menghindari menunggu terlalu lama
  // ✅ PERBAIKAN: Validate status yang lebih permisif untuk debugging
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Accept 4xx untuk error handling
  },
});

// ✅ PERBAIKAN: Request interceptor yang lebih robust
adminAxiosInstance.interceptors.request.use(
  (config) => {
    console.log(
      `\n🚀 [Admin API Request] ${config.method?.toUpperCase()} ${config.url}`
    );
    console.log(`📍 Full URL: ${config.baseURL}${config.url}`);
    console.log(`🌐 Frontend Origin: ${window.location.origin}`);
    console.log(`🎯 Backend Target: ${config.baseURL}`);

    // ✅ Add Authorization header if token exists
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers["Authorization"] = `Bearer ${adminToken}`;
      console.log(`🔑 Auth: Bearer ${adminToken.substring(0, 20)}...`);
    } else {
      console.log(`🔑 Auth: None`);
    }

    // ✅ PERBAIKAN: Set ngrok headers jika diperlukan
    if (config.baseURL?.includes("ngrok")) {
      config.headers["ngrok-skip-browser-warning"] = "true";
      console.log(`🚇 Ngrok headers added`);
    }

    // ✅ PERBAIKAN: Ensure proper content type untuk POST requests
    if (config.method === "post" && config.data) {
      if (typeof config.data === "object") {
        config.headers["Content-Type"] = "application/json";
        config.data = JSON.stringify(config.data);
      }
    }

    // ✅ Log request data for debugging
    if (config.data) {
      console.log(
        `📤 Request Data:`,
        typeof config.data === "string"
          ? config.data
          : JSON.stringify(config.data, null, 2)
      );
    }

    // ✅ Log headers (without sensitive data)
    console.log(`📋 Request Headers:`, {
      "Content-Type": config.headers["Content-Type"],
      Accept: config.headers["Accept"],
      Authorization: config.headers["Authorization"] ? "Bearer ***" : "None",
      "ngrok-skip-browser-warning":
        config.headers["ngrok-skip-browser-warning"] || "Not set",
    });

    return config;
  },
  (error) => {
    console.error("❌ [Admin API Request Error]:", error);
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

// ✅ PERBAIKAN: Response interceptor dengan error handling yang lebih baik
adminAxiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      `\n✅ [Admin API Response] ${response.status} ${response.config.url}`
    );
    console.log(`📥 Response Data:`, response.data);

    // ✅ PERBAIKAN: Log response headers untuk debugging CORS
    if (response.headers) {
      console.log(`📋 Response Headers:`, {
        "access-control-allow-origin":
          response.headers["access-control-allow-origin"],
        "access-control-allow-credentials":
          response.headers["access-control-allow-credentials"],
        "content-type": response.headers["content-type"],
      });
    }

    return response;
  },
  async (error: any) => {
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
      data: error.response?.data,
      message: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
      requestData: error.config?.data,
      // ✅ TAMBAHAN: CORS debugging info
      requestOrigin: window.location.origin,
      targetUrl: error.config?.baseURL,
      isCrossOrigin: error.config?.baseURL
        ? !error.config.baseURL.includes(window.location.origin)
        : false,
    };

    console.error("📊 Error Details:", errorInfo);

    // ✅ PERBAIKAN: Enhanced CORS error detection dan handling
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("🚫 CORS or Network Error Detected:");
      console.error("🔍 Troubleshooting Steps:");
      console.error("   1. Check if backend server is running");
      console.error("   2. Check CORS configuration on backend");
      console.error("   3. Verify ngrok URL is correct and active");
      console.error("   4. Check if ngrok tunnel is still open");
      console.error("   5. Try refreshing ngrok tunnel");
      console.error(`📊 Connection Details:`);
      console.error(`   - Frontend Origin: ${window.location.origin}`);
      console.error(`   - Backend URL: ${error.config?.baseURL}`);
      console.error(`   - Is Cross-Origin: ${errorInfo.isCrossOrigin}`);
      console.error(`   - Request Method: ${errorInfo.method}`);
      console.error(`   - Full Request URL: ${errorInfo.fullURL}`);

      // ✅ TAMBAHAN: Specific ngrok troubleshooting
      if (error.config?.baseURL?.includes("ngrok")) {
        console.error("🚇 Ngrok Specific Issues:");
        console.error("   - Ngrok tunnel might have expired");
        console.error("   - Try running: ngrok http 5000");
        console.error("   - Update VITE_API_URL with new ngrok URL");
        console.error("   - Add ngrok-skip-browser-warning header");
      }
    }

    // ✅ Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log("🔒 [Admin 401] Unauthorized - clearing auth data");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminTokenExpiration");

      // Only redirect if we're in admin area and not already on login page
      if (
        window.location.pathname.startsWith("/admin") &&
        window.location.pathname !== "/admin/login"
      ) {
        console.log("🔄 [Admin 401] Redirecting to admin login");
        window.location.href = "/admin/login";
      }
    }

    // ✅ Handle 400 Bad Request with details
    if (error.response?.status === 400) {
      console.error("⚠️ [400 Bad Request] Validation or data issues:");
      console.error("   - Check request data format");
      console.error("   - Verify all required fields are present");
      console.error("   - Check data types match API expectations");
      if (error.response?.data) {
        console.error("   - Server response:", error.response.data);
      }
    }

    // ✅ Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("🚫 [403 Forbidden] CORS or permissions issue:");
      if (error.response?.data?.message?.includes("CORS")) {
        console.error("   - CORS policy violation");
        console.error("   - Check backend CORS configuration");
        console.error("   - Verify origin is in allowed list");
      } else {
        console.error("   - Insufficient permissions");
        console.error("   - Check admin role and permissions");
      }
    }

    return Promise.reject(error);
  }
);

// ✅ PERBAIKAN: Test connection function dengan error details
export const testAdminConnection = async () => {
  try {
    console.log("🔍 Testing admin API connection...");
    console.log(`🎯 Target URL: ${ADMIN_API_BASE_URL}/api/health`);

    const response = await adminAxiosInstance.get("/api/health");
    console.log("✅ Admin API connection successful:", response.data);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    console.error("❌ Admin API connection failed:", error);
    const axiosError = error as any;
    return {
      success: false,
      error: axiosError.message || "Unknown error",
      details: {
        code: axiosError.code,
        status: axiosError.response?.status,
        baseURL: ADMIN_API_BASE_URL,
      },
    };
  }
};

// ✅ PERBAIKAN: Health check function
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${ADMIN_API_BASE_URL}/api/health`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(ADMIN_API_BASE_URL.includes("ngrok") && {
          "ngrok-skip-browser-warning": "true",
        }),
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Backend health check passed:", data);
      return { success: true, data };
    } else {
      console.error(
        "❌ Backend health check failed:",
        response.status,
        response.statusText
      );
      return {
        success: false,
        status: response.status,
        statusText: response.statusText,
      };
    }
  } catch (error: unknown) {
    console.error("❌ Backend health check error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export default adminAxiosInstance;
