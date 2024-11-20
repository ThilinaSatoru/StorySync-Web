import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
});

//// Request Interceptor
// apiClient.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//         // Add Authorization token or any custom headers here
//         const token = localStorage.getItem('token'); // Example: Fetch token from localStorage
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// Response Interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        // Global error handling
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default apiClient;
