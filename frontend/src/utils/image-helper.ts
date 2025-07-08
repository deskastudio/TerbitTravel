// utils/image-helper.ts - SIMPLE LOCALHOST VERSION
export const getImageUrl = (path: string): string => {
  // Handle empty/null path
  if (!path || path.trim() === '') {
    return 'https://placehold.co/400x400?text=No+Image';
  }
  
  // Handle jika path sudah berupa URL lengkap
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Clean path dari prefix yang tidak perlu
  let cleanPath = path;
  if (cleanPath.startsWith('./')) {
    cleanPath = cleanPath.slice(2);
  }
  
  // Ensure path starts with /
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }
  
  // SIMPLE: Always localhost:5000 (yang pasti work!)
  return `http://localhost:5000${cleanPath}`;
};