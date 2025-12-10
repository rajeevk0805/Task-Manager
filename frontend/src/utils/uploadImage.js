

import { API_PATHS } from "./apiPaths.js";
import axiosInstance from "./axiosInstance.js";

const uploadImage = async (imageFile) => {
    // Validate input
    if (!imageFile) {
        throw new Error("No image file provided");
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const response = await axiosInstance.post(
            API_PATHS.IMAGE.UPLOAD_IMAGE,
            formData,
            {
                timeout: 30000, // 30 sec timeout
                // For file uploads, we don't set Content-Type header explicitly
                // Let the browser set it with the correct boundary
                headers: {
                    // Remove Content-Type to let browser set it with boundary for FormData
                }
            }
        );

        // Validate success response
        if (response.data?.success) {
            return response.data;
        }

        throw new Error(response.data?.message || "Image upload failed");
    } catch (error) {
        // Timeout Error
        if (error.code === "ECONNABORTED") {
            throw new Error("Request timeout. Try uploading a smaller image.");
        }

        // Server Response Errors
        if (error.response) {
            const serverMessage = error.response.data?.message || "Failed to upload image";
            const statusCode = error.response.status;
            throw new Error(`Upload failed (${statusCode}): ${serverMessage}`);
        }

        // No Response From Server
        if (error.request) {
            throw new Error("No response from server. Please check your connection and try again.");
        }

        // Unknown Errors
        throw new Error(error.message || "Image upload failed");
    }
};

export default uploadImage;
