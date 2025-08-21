// utils/image-helper.ts - IMAGES ALWAYS FROM LOCAL SERVER
/**
 * Gets the correct image URL, always from localhost backend
 * 
 * IMPORTANT: This function ALWAYS returns URLs from localhost:5000
 * regardless of whether the app is running in tunnel mode or not.
 * This ensures fast image loading and prevents CORS issues.
 * 
 * External callbacks (Midtrans, Google) still use the tunnel URL
 * which is managed separately in their respective services.
 */
export const getImageUrl = (path: string): string => {
  // Handle empty/null path
  if (!path || path.trim() === "") {
    return "https://placehold.co/400x400?text=No+Image";
  }

  // Handle if path is already a complete URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Clean path from unnecessary prefix
  let cleanPath = path;
  if (cleanPath.startsWith("./")) {
    cleanPath = cleanPath.slice(2);
  }

  // Ensure path starts with /
  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }
  
  // FIXED: Always use local backend URL (localhost:5000) for images
  // No matter what environment variables are set, images always load from localhost
  const baseUrl = "http://localhost:5000";
  const finalUrl = `${baseUrl}${cleanPath}`;

  // Debug logging
  if (import.meta.env.MODE === "development") {
    console.log(`🖼️ Image URL: ${path} -> ${finalUrl} (Always using local backend)`);
  }

  return finalUrl;
};
