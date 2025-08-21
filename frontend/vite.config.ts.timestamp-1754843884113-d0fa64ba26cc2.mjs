// vite.config.ts
import path from "path";
import react from "file:///C:/Users/HP/OneDrive/Desktop/TerbitTravel/frontend/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { defineConfig } from "file:///C:/Users/HP/OneDrive/Desktop/TerbitTravel/frontend/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "C:\\Users\\HP\\OneDrive\\Desktop\\TerbitTravel\\frontend";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    // Force localhost
    port: 5173,
    strictPort: true,
    open: "http://localhost:5173",
    // ✅ Force open with localhost
    // ✅ Fix for 504 issues - increased timeout
    hmr: {
      timeout: 5e3
      // Increased timeout to 5 seconds
    },
    watch: {
      usePolling: true
      // Better detection of file changes
    },
    // ✅ Tambahkan proxy untuk development
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        // Use localhost for development
        changeOrigin: true,
        secure: false,
        timeout: 6e4,
        // Increased timeout for backend requests
        // Tidak perlu rewrite karena backend sudah menggunakan /api prefix
        configure: (proxy) => {
          proxy.on("error", (err, _req) => {
            console.log("Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, _req, _res) => {
            console.log("Proxying request to:", proxyReq.path);
          });
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  // ✅ Consistent environment variables
  define: {
    __FRONTEND_URL__: JSON.stringify(
      process.env.VITE_FRONTEND_URL || "http://localhost:5173"
    ),
    __API_URL__: JSON.stringify(
      process.env.VITE_API_URL || "http://localhost:5000"
    )
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxIUFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFRlcmJpdFRyYXZlbFxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSFBcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxUZXJiaXRUcmF2ZWxcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0hQL09uZURyaXZlL0Rlc2t0b3AvVGVyYml0VHJhdmVsL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCJsb2NhbGhvc3RcIiwgLy8gRm9yY2UgbG9jYWxob3N0XHJcbiAgICBwb3J0OiA1MTczLFxyXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcclxuICAgIG9wZW46IFwiaHR0cDovL2xvY2FsaG9zdDo1MTczXCIsIC8vIFx1MjcwNSBGb3JjZSBvcGVuIHdpdGggbG9jYWxob3N0XHJcbiAgICAvLyBcdTI3MDUgRml4IGZvciA1MDQgaXNzdWVzIC0gaW5jcmVhc2VkIHRpbWVvdXRcclxuICAgIGhtcjoge1xyXG4gICAgICB0aW1lb3V0OiA1MDAwLCAvLyBJbmNyZWFzZWQgdGltZW91dCB0byA1IHNlY29uZHNcclxuICAgIH0sXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICB1c2VQb2xsaW5nOiB0cnVlLCAvLyBCZXR0ZXIgZGV0ZWN0aW9uIG9mIGZpbGUgY2hhbmdlc1xyXG4gICAgfSxcclxuICAgIC8vIFx1MjcwNSBUYW1iYWhrYW4gcHJveHkgdW50dWsgZGV2ZWxvcG1lbnRcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMFwiLCAvLyBVc2UgbG9jYWxob3N0IGZvciBkZXZlbG9wbWVudFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgIHRpbWVvdXQ6IDYwMDAwLCAvLyBJbmNyZWFzZWQgdGltZW91dCBmb3IgYmFja2VuZCByZXF1ZXN0c1xyXG4gICAgICAgIC8vIFRpZGFrIHBlcmx1IHJld3JpdGUga2FyZW5hIGJhY2tlbmQgc3VkYWggbWVuZ2d1bmFrYW4gL2FwaSBwcmVmaXhcclxuICAgICAgICBjb25maWd1cmU6IChwcm94eSkgPT4ge1xyXG4gICAgICAgICAgcHJveHkub24oXCJlcnJvclwiLCAoZXJyLCBfcmVxKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJveHkgZXJyb3I6XCIsIGVycik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHByb3h5Lm9uKFwicHJveHlSZXFcIiwgKHByb3h5UmVxLCBfcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJveHlpbmcgcmVxdWVzdCB0bzpcIiwgcHJveHlSZXEucGF0aCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIC8vIFx1MjcwNSBDb25zaXN0ZW50IGVudmlyb25tZW50IHZhcmlhYmxlc1xyXG4gIGRlZmluZToge1xyXG4gICAgX19GUk9OVEVORF9VUkxfXzogSlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgIHByb2Nlc3MuZW52LlZJVEVfRlJPTlRFTkRfVVJMIHx8IFwiaHR0cDovL2xvY2FsaG9zdDo1MTczXCJcclxuICAgICksXHJcbiAgICBfX0FQSV9VUkxfXzogSlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgIHByb2Nlc3MuZW52LlZJVEVfQVBJX1VSTCB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMFwiXHJcbiAgICApLFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNWLE9BQU8sVUFBVTtBQUN2VyxPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFGN0IsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osTUFBTTtBQUFBO0FBQUE7QUFBQSxJQUVOLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQTtBQUFBLElBQ1g7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFlBQVk7QUFBQTtBQUFBLElBQ2Q7QUFBQTtBQUFBLElBRUEsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixTQUFTO0FBQUE7QUFBQTtBQUFBLFFBRVQsV0FBVyxDQUFDLFVBQVU7QUFDcEIsZ0JBQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxTQUFTO0FBQy9CLG9CQUFRLElBQUksZ0JBQWdCLEdBQUc7QUFBQSxVQUNqQyxDQUFDO0FBQ0QsZ0JBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxNQUFNLFNBQVM7QUFDN0Msb0JBQVEsSUFBSSx3QkFBd0IsU0FBUyxJQUFJO0FBQUEsVUFDbkQsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sa0JBQWtCLEtBQUs7QUFBQSxNQUNyQixRQUFRLElBQUkscUJBQXFCO0FBQUEsSUFDbkM7QUFBQSxJQUNBLGFBQWEsS0FBSztBQUFBLE1BQ2hCLFFBQVEsSUFBSSxnQkFBZ0I7QUFBQSxJQUM5QjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
