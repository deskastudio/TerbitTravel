// lib/axios.ts - FIXED Configuration

import axios from "axios";

// ✅ FIXED: Use environment variable with fallback
const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (envUrl) {
    return envUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  // ✅ FALLBACK: Default untuk development
  return "http://localhost:5000";
})();

console.log("🌐 Main API Configuration:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  baseURL: API_BASE_URL,
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  currentOrigin: window.location.origin,
});

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // ✅ Add special headers for tunneling services, removed Origin header (browser restriction)
    ...((API_BASE_URL.includes("ngrok") ||
      API_BASE_URL.includes("loca.lt")) && {
      "ngrok-skip-browser-warning": "true",
      // Browser blocked Origin header removed - this is set automatically by the browser
    }),
  },
  withCredentials: false, // ✅ FIXED: Set to false to avoid CORS issues with wildcard
  timeout: 30000, // Increased timeout for tunnel connections
});

// ✅ ENHANCED: Request interceptor with better debugging
instance.interceptors.request.use(
  (config) => {
    console.log(
      `\n🚀 [Main API Request] ${config.method?.toUpperCase()} ${config.url}`
    );
    console.log(`📍 Full URL: ${config.baseURL}${config.url}`);
    console.log(`🌐 Frontend Origin: ${window.location.origin}`);
    console.log(`🎯 Backend Target: ${config.baseURL}`);

    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log(`🔑 Auth: Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log(`🔑 Auth: None`);
    }

    // ✅ Add ngrok headers if needed
    if (config.baseURL?.includes("ngrok")) {
      config.headers["ngrok-skip-browser-warning"] = "true";
      console.log(`🚇 Ngrok headers added`);
    }

    // Log request data for debugging
    if (config.data) {
      console.log(`📤 Request Data:`, config.data);
    }

    return config;
  },
  (error) => {
    console.error("❌ [Main API Request Error]:", error);
    return Promise.reject(error);
  }
);

// ✅ ENHANCED: Response interceptor with better error handling
instance.interceptors.response.use(
  (response) => {
    console.log(
      `\n✅ [Main API Response] ${response.status} ${response.config.url}`
    );
    console.log(`📥 Response Data:`, response.data);

    // Log response headers for debugging CORS
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
  async (error) => {
    console.error(`\n❌ [Main API Error] ${error.config?.url}:`);

    // Enhanced error logging
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
      // CORS debugging info
      requestOrigin: window.location.origin,
      targetUrl: error.config?.baseURL,
      isCrossOrigin: error.config?.baseURL
        ? !error.config.baseURL.includes(window.location.origin)
        : false,
    };

    console.error("📊 Error Details:", errorInfo);

    // Enhanced CORS error detection
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("🚫 Network/CORS Error Detected for Main API:");
      console.error("🔍 Troubleshooting Steps:");
      console.error("   1. Check if backend server is running");
      console.error("   2. Check CORS configuration on backend");
      console.error("   3. Verify tunnel URL is correct and active");
      console.error(`📊 Connection Details:`);
      console.error(`   - Frontend Origin: ${window.location.origin}`);
      console.error(`   - Backend URL: ${error.config?.baseURL}`);
      console.error(`   - Is Cross-Origin: ${errorInfo.isCrossOrigin}`);
    }

    // Special case untuk endpoint booking dengan error 401 (keep existing logic)
    if (error.response && error.response.status === 401) {
      console.log("[401 Error] Checking if this is a booking endpoint...");

      const originalConfig = error.config;

      // Khusus untuk booking endpoint
      if (
        originalConfig.url &&
        (originalConfig.url.includes("/api/Bookings/") ||
          originalConfig.url.includes("/api/Payments/"))
      ) {
        console.log("[DEV Mode] Using fallback data for booking endpoint");

        // Untuk metode GET pada booking detail
        if (
          originalConfig.method === "get" &&
          originalConfig.url.includes("/api/Bookings/")
        ) {
          const bookingIdMatch =
            originalConfig.url.match(/\/Bookings\/([^\/]+)/);
          if (bookingIdMatch && bookingIdMatch[1]) {
            const bookingId = bookingIdMatch[1];
            console.log(
              "[DEV Mode] Attempting to retrieve booking from localStorage:",
              bookingId
            );

            // Cek localStorage untuk data booking
            const lastBooking = localStorage.getItem("lastBooking");
            if (lastBooking) {
              try {
                const parsedBooking = JSON.parse(lastBooking);
                if (parsedBooking.bookingId === bookingId) {
                  console.log(
                    "[DEV Mode] Successfully retrieved booking from localStorage"
                  );

                  // Return simulated response dengan data dari localStorage
                  return Promise.resolve({
                    data: parsedBooking,
                    status: 200,
                    statusText: "OK (DEV Mode)",
                  });
                }
              } catch (e) {
                console.error(
                  "[DEV Mode] Error parsing localStorage booking data:",
                  e
                );
              }
            }
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

// ✅ Test connection function
export const testMainAPIConnection = async () => {
  try {
    console.log("🔍 Testing main API connection...");

    // Try both health and destination endpoints
    let response;

    try {
      console.log(`🎯 Trying health endpoint: ${API_BASE_URL}/health`);
      response = await instance.get("/health");
    } catch (err) {
      console.log("Health endpoint failed, trying /api/health");
      console.log(`🎯 Trying alternate endpoint: ${API_BASE_URL}/api/health`);
      response = await instance.get("/api/health");
    }

    console.log("✅ Main API connection successful:", response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("❌ Main API connection failed:", error);
    return {
      success: false,
      error: error.message || "Unknown error",
      details: {
        code: error.code,
        status: error.response?.status,
        baseURL: API_BASE_URL,
      },
    };
  }
};

// ✅ Health check function
export const checkMainAPIHealth = async () => {
  try {
    // Try multiple health endpoint variations
    const healthEndpoints = ["/health", "/api/health", "/status"];
    let response = null;
    let error = null;

    for (const endpoint of healthEndpoints) {
      try {
        console.log(`Trying health endpoint: ${API_BASE_URL}${endpoint}`);
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...((API_BASE_URL.includes("ngrok") ||
              API_BASE_URL.includes("loca.lt")) && {
              "ngrok-skip-browser-warning": "true",
            }),
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ API health check passed at ${endpoint}:`, data);
          return { success: true, data, endpoint };
        }
      } catch (err) {
        console.log(`Health endpoint ${endpoint} failed:`, err);
        error = err;
      }
    }

    // All endpoints failed
    console.error("❌ All API health checks failed");
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "All health endpoints failed",
      triedEndpoints: healthEndpoints,
    };
  } catch (error: any) {
    console.error("❌ Main API health check error:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
};

export default instance;
