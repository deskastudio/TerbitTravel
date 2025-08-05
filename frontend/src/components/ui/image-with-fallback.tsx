import React, { useState } from "react";
import {
  getSafeImageUrl,
  handleImageError,
  generateImagePlaceholder,
  getImageUrl,
} from "@/utils/image-utils";

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  width?: number;
  height?: number;
  fallbackText?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  width,
  height,
  fallbackText = "Image",
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(!!src);

  // Get safe image URL with proper backend URL conversion
  const imageUrl = getImageUrl(src);
  const safeImageUrl = getSafeImageUrl(imageUrl, fallbackText);

  const handleError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setHasError(true);
    setIsLoading(false);
    handleImageError(event, fallbackText);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If no src provided or error occurred, show SVG fallback
  if (!src || hasError || !imageUrl) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${
          fallbackClassName || className
        }`}
        style={{ width, height }}
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
        src={safeImageUrl}
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
