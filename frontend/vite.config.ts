import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // ✅ Consistent dengan env
    port: 5173, // ✅ Match dengan VITE_FRONTEND_URL
    strictPort: true, // ✅ Fail jika port tidak available
    open: true, // ✅ Auto open browser
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ✅ Environment variables validation
  define: {
    // Make sure env vars are available in build
    __FRONTEND_URL__: JSON.stringify(
      process.env.VITE_FRONTEND_URL || "http://localhost:5173"
    ),
    __BACKEND_URL__: JSON.stringify(
      process.env.VITE_BACKEND_URL || "http://localhost:5000"
    ),
  },
});
