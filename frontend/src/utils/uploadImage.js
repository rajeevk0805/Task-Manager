import { API_PATHS } from "./apiPaths.js";
import axiosInstance from "./axiosInstance.js";

const uploadImage=async (imageFile)=>{
    const formData = new FormData();
    formData.append("image", imageFile);
    
    try{
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            // Add timeout and better error handling
            timeout: 30000 // 30 second timeout
        });
        
        // Check if the response indicates success
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Failed to upload image");
        }
    } catch (error) {
        // Handle case where error.response might be undefined
        if (error.code === 'ECONNABORTED') {
            console.error("Error uploading image: Request timeout");
            throw new Error("Request timeout. Please try again with a smaller image.");
        } else if (error.response && error.response.data) {
            const errorMessage = error.response.data.message || "Failed to upload image";
            console.error("Error uploading image:", errorMessage);
            throw new Error(errorMessage);
        } else if (error.request) {
            // Request was made but no response received
            console.error("Error uploading image: No response received from server");
            throw new Error("No response from server. Please check your connection and try again.");
        } else {
            // Something else happened
            console.error("Error uploading image:", error.message || error);
            throw new Error(error.message || "Failed to upload image");
        }
    }
}

export default uploadImage;