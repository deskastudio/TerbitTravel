import React, { useState, useEffect } from "react";
import {
  getSafeImageUrl,
  handleImageError,
  generateImagePlaceholder,
  getImageUrl,
} from "@/utils/image-utils";

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  width?: number;
  height?: number;
  fallbackText?: string;
  fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  width,
  height,
  fallbackText = "Image",
  fallbackSrc,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(!!src);
  const [currentSrc, setCurrentSrc] = useState<string | null | undefined>(src);

  // Debug image loading (in development only)
  useEffect(() => {
    if (import.meta.env.DEV) {
      if (src) {
        console.log(`🖼️ Loading image: ${src}`);
      }
    }
  }, [src]);

  // Update current source if props change
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(!!src);
  }, [src]);

  // Get safe image URL with proper backend URL conversion
  const imageUrl = getImageUrl(currentSrc);
  const safeImageUrl = getSafeImageUrl(imageUrl || fallbackSrc, fallbackText);

  const handleError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    // If we're using the main source and it failed, try the fallback if provided
    if (currentSrc === src && fallbackSrc && !hasError) {
      console.log(`🖼️ Primary image failed, trying fallback: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
      return;
    }
    
    // Otherwise use the SVG fallback
    setHasError(true);
    setIsLoading(false);
    handleImageError(event, fallbackText);
    
    if (import.meta.env.DEV) {
      console.warn(`🖼️ Image failed to load: ${currentSrc}`);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    
    if (import.meta.env.DEV && currentSrc) {
      console.log(`✅ Image loaded successfully: ${currentSrc}`);
    }
  };

  // If no src provided or error occurred after all attempts, show SVG fallback
  if ((!currentSrc && !fallbackSrc) || (hasError && !imageUrl)) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${
          fallbackClassName || className
        }`}
        style={{ width, height }}
        title={`Image not available: ${alt}`}
      >
        <svg
          className="w-1/3 h-1/3 text-gray-400 min-w-6 min-h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`bg-gray-100 animate-pulse flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          <svg
            className="w-1/3 h-1/3 text-gray-300 min-w-6 min-h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      <img
        src={safeImageUrl || generateImagePlaceholder(width || 400, height || 300, fallbackText)}
        alt={alt}
        className={`${className} ${isLoading ? "hidden" : "block"}`}
        onError={handleError}
        onLoad={handleLoad}
        style={{ width, height }}
      />
    </>
  );
};

export default ImageWithFallback;
