import axios from 'axios';

const baseURL = 'http://localhost:5000';

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// // Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Ambil token dari localStorage
//     const token = localStorage.getItem('token');
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Jika error 401 dan belum pernah retry
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // Redirect ke halaman login jika token tidak valid
//       if (error.response?.data?.message === 'Invalid token') {
//         localStorage.removeItem('token');
//         window.location.href = '/login';
//         return Promise.reject(error);
//       }

//       try {
//         // Coba refresh token
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (refreshToken) {
//           const response = await axios.post(`${baseURL}/auth/refresh-token`, {
//             refreshToken,
//           });
          
//           const { token } = response.data;
//           localStorage.setItem('token', token);
          
//           // Update header dengan token baru
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return axiosInstance(originalRequest);
//         }
//       } catch (refreshError) {
//         // Jika refresh token gagal, logout user
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         window.location.href = '/login';
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;