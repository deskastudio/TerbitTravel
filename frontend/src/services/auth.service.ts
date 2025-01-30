// import axios from 'axios';
// import { LoginFormValues, RegisterFormValues } from '@/schemas/auth.schema';

// const API_URL = process.env.VITE_API_URL;

// export const authService = {
//   async login(data: LoginFormValues) {
//     const response = await axios.post(`${API_URL}/auth/login`, data);
//     return response.data;
//   },

//   async register(data: RegisterFormValues) {
//     const response = await axios.post(`${API_URL}/auth/register`, data);
//     return response.data;
//   },

//   async googleAuth(credential: string) {
//     const response = await axios.post(`${API_URL}/auth/google`, { credential });
//     localStorage.setItem('token', response.data.token);
//     return response.data;
//   }
// };