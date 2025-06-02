import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    open: true,
    // ✅ Tambahkan proxy untuk development
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Use localhost for development
        changeOrigin: true,
        secure: false,
        // Tidak perlu rewrite karena backend sudah menggunakan /api prefix
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
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
