

import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        Accept: "application/json",
    },
    withCredentials: true // This is important for CORS requests that need to send cookies/credentials
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Ensure Content-Type is set for POST/PUT requests, except for FormData
        if (!config.headers['Content-Type'] && (config.method === 'post' || config.method === 'put')) {
            // Don't set Content-Type for FormData uploads - let browser set it with boundary
            if (!(config.data instanceof FormData)) {
                config.headers['Content-Type'] = 'application/json';
            }
        }
        
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            // 🔐 Unauthorized - token expired or invalid
            if (status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }

            // ⚠️ Forbidden
            if (status === 403) {
                console.warn("Access denied.");
            }

            // 🔥 Internal Server Error
            if (status === 500) {
                console.error("Server error, please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timed out, please try again later.");
        } else if (error.message === "Network Error") {
            console.error("Network error, please check connection.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
