// utils/image-helper.ts
const API_URL = import.meta.env.VITE_API_URL;

export const getImageUrl = (path: string) => {
  if (!path) return 'https://placehold.co/400x400?text=No+Image';
  
  // Jika path sudah berupa URL lengkap
  if (path.startsWith('http')) {
    return path;
  }
  
  return `${API_URL}/${path}`;
};