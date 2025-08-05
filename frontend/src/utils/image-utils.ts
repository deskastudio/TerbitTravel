/**
 * Image utility functions for handling fallbacks and preventing infinite loops
 */

// Get backend URL from environment
const getBackendUrl = () => {
  return (
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000"
  );
};

// Generate a local SVG placeholder to avoid external requests
export const generateImagePlaceholder = (
  width = 400,
  height = 300,
  text = "Image"
) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="20%" y="20%" width="60%" height="60%" fill="#e5e7eb" rx="4"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

// Create a simple placeholder data URI
export const IMAGE_PLACEHOLDER = generateImagePlaceholder(400, 300, "No Image");

/**
 * Convert backend image path to full URL
 */
export const getImageUrl = (imagePath?: string): string | null => {
  if (!imagePath || imagePath.trim() === "") {
    return null;
  }

  // If it's already a full URL, return as is
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }

  // Convert relative path to full URL
  const backendUrl = getBackendUrl();
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${backendUrl}${cleanPath}`;
};

/**
 * Safe image URL that won't cause infinite loops
 */
export const getSafeImageUrl = (
  url?: string | null,
  fallbackText = "Image"
): string => {
  if (!url || url.trim() === "") {
    return generateImagePlaceholder(400, 300, fallbackText);
  }

  // Check if it's already a placeholder to prevent loops
  if (url.includes("placeholder.svg") || url.includes("unsplash.com")) {
    return generateImagePlaceholder(400, 300, fallbackText);
  }

  // Convert to full URL if needed
  const fullUrl = getImageUrl(url);
  if (!fullUrl) {
    return generateImagePlaceholder(400, 300, fallbackText);
  }

  return fullUrl;
};

/**
 * Handle image error by setting a safe fallback
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackText = "Image"
) => {
  const img = event.currentTarget;
  if (!img.dataset.errorHandled) {
    img.dataset.errorHandled = "true";
    img.src = generateImagePlaceholder(400, 300, fallbackText);
  }
};

/**
 * Get fallback images for different contexts
 */
export const getFallbackImage = (
  context: "travel" | "hotel" | "destination" | "profile" = "travel"
) => {
  const contextText = {
    travel: "Travel Package",
    hotel: "Hotel",
    destination: "Destination",
    profile: "Profile",
  };

  return generateImagePlaceholder(400, 300, contextText[context]);
};
