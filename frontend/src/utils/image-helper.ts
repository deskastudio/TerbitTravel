// utils/image-helper.ts - SIMPLE LOCALHOST VERSION
export const getImageUrl = (path: string): string => {
  // Handle empty/null path
  if (!path || path.trim() === "") {
    return "https://placehold.co/400x400?text=No+Image";
  }

  // Handle jika path sudah berupa URL lengkap
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Clean path dari prefix yang tidak perlu
  let cleanPath = path;
  if (cleanPath.startsWith("./")) {
    cleanPath = cleanPath.slice(2);
  }

  // Ensure path starts with /
  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }

  // 🎯 SOLUTION: Use localhost untuk static files (gambar), bukan tunnel URL
  const staticBaseUrl =
    import.meta.env.VITE_STATIC_URL ||
    import.meta.env.VITE_UPLOADS_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:5000";

  const finalUrl = `${staticBaseUrl}${cleanPath}`;

  // Debug logging
  if (import.meta.env.VITE_NODE_ENV === "development") {
    console.log(`🖼️ Image URL: ${path} -> ${finalUrl}`);
  }

  return finalUrl;
};
