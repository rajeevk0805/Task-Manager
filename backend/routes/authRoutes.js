import express from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controller/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload, { uploadSingleImage } from "../middlewares/uploadMiddleware.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Import Cloudinary
import { v2 as cloudinary } from 'cloudinary';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper function to save image locally
const saveLocalImage = (file, res) => {
    try {
        // Generate unique filename
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const filename = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadsDir, filename);
        
        // Save buffer to file
        fs.writeFileSync(filePath, file.buffer);
        
        // Generate URL (assuming static serving from /uploads)
        const imageUrl = `/uploads/${filename}`;
        
        res.status(200).json({ 
            imageUrl: imageUrl,
            success: true,
            filename: file.originalname
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to save image locally",
            success: false,
            error: error.message 
        });
    }
}

// Configure Cloudinary with environment variables
const configureCloudinary = () => {
  let cloudinaryConfigured = false;
  
  try {
    // Check if all required environment variables are set
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return false;
    }
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    cloudinaryConfigured = true;
  } catch (configError) {
    cloudinaryConfigured = false;
  }
  
  return cloudinaryConfigured;
};

const router = express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/profile",protect,getUserProfile)
router.put("/profile",protect,updateUserProfile)

router.post("/upload-image",uploadSingleImage,(req,res)=>{
    // Configure Cloudinary when the route is called
    const cloudinaryConfigured = configureCloudinary();
    
    try {
        // Improved error handling
        if(!req.file){
            return res.status(400).json({ 
                message: "No file uploaded",
                success: false 
            });
        }
        
        // If Cloudinary is configured, use it; otherwise save locally
        if (cloudinaryConfigured) {
            // Upload to Cloudinary
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "task_manager_profiles" },
                (error, result) => {
                    if (error) {
                        // Fallback to local storage
                        saveLocalImage(req.file, res);
                        return;
                    }
                    
                    res.status(200).json({ 
                        imageUrl: result.secure_url,
                        success: true,
                        filename: result.original_filename || req.file.originalname
                    });
                }
            );
            
            // Write buffer to the stream
            uploadStream.end(req.file.buffer);
        } else {
            saveLocalImage(req.file, res);
        }
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to process uploaded file",
            success: false,
            error: error.message 
        });
    }
})

export default router;