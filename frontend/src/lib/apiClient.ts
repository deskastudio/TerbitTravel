import axios from 'axios';

// Base URL untuk API
const apiClient = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com', // Ganti dengan base URL API Anda
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor untuk menambahkan Bearer Token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Tambahkan Bearer Token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Create Data (POST)
export const createData = async (endpoint: string, data: object) => {
    try {
        const response = await apiClient.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('Error creating data:', error);
        throw error;
    }
};

// Read Data (GET)
export const fetchData = async (endpoint: string) => {
    try {
        const response = await apiClient.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Update Data (PUT)
export const updateData = async (endpoint: string, data: object) => {
    try {
        const response = await apiClient.put(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
};

// Delete Data (DELETE)
export const deleteData = async (endpoint: string) => {
    try {
        const response = await apiClient.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};

export default apiClient;
