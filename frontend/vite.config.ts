import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // Force localhost
    port: 5173,
    strictPort: true,
    open: "http://localhost:5173", // ✅ Force open with localhost
    // ✅ Fix for 504 issues - increased timeout
    hmr: {
      timeout: 5000, // Increased timeout to 5 seconds
    },
    watch: {
      usePolling: true, // Better detection of file changes
    },
    // ✅ Tambahkan proxy untuk development
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Use localhost for development
        changeOrigin: true,
        secure: false,
        timeout: 60000, // Increased timeout for backend requests
        // Tidak perlu rewrite karena backend sudah menggunakan /api prefix
        configure: (proxy) => {
          proxy.on("error", (err, _req) => {
            console.log("Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, _req, _res) => {
            console.log("Proxying request to:", proxyReq.path);
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ✅ Consistent environment variables
  define: {
    __FRONTEND_URL__: JSON.stringify(
      process.env.VITE_FRONTEND_URL || "http://localhost:5173"
    ),
    __API_URL__: JSON.stringify(
      process.env.VITE_API_URL || "http://localhost:5000"
    ),
  },
});
