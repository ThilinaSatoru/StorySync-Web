import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export const API_ROUTES = {
    PDF: '/api/pdf',
    AUTHORS: '/author',
    TAGS: '/tag',
    VIDEO: '/api/video'
};

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
        if (error.response) {
            // Server responded with a status outside 2xx
            console.error(`API Error: ${error.response.status} - ${error.response.data.message || error.message}`);
        } else if (error.request) {
            // No response received
            console.error('API Error: No response received', error.request);
        } else {
            // Other errors (e.g., config issues)
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
