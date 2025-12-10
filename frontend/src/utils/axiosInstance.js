// import axios from "axios"
// import { BASE_URL } from "./apiPaths"

// const axiosInstance=axios.create({
//     baseURL:BASE_URL ,
//     timeout:10000,
//     headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//     },
// })

// //Request Interceptor
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const accessToken = localStorage.getItem("token");
//         if (accessToken) {
//             config.headers["Authorization"] = `Bearer ${accessToken}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// //Response Interceptor
// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         //Handle common errors globally
//         if(error.response){
//             if(error.response.status === 401){
//                 //redirect to login page
//                 window.location.href = "/login";
//             }else if(error.response.status === 500){
//                 console.error("Server error, please try again later.")
//             }
//         }else if(error.code==="ECONNABORTED"){
//             console.error("Request timed out, please try again later.")
//         }
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;

import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        Accept: "application/json",
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
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
        } else {
            console.error("Network error, please check connection.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
