import express from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controller/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const router = express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/profile",protect,getUserProfile)
router.put("/profile",protect,updateUserProfile)

router.post("/upload-image",upload.single("image"),(req,res)=>{
    console.log("Upload request received");
    
    // Log request details for debugging
    console.log("Request headers:", req.headers);
    console.log("Request file:", req.file);
    
    // Improved error handling
    if(!req.file){
        console.log("No file uploaded in request");
        return res.status(400).json({ 
            message: "No file uploaded",
            success: false 
        });
    }
    
    try {
        console.log("Processing uploaded file");
        // With memory storage, we need to write the file to disk
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const uploadDir = path.join(__dirname, "..", "uploads");
        
        console.log("Upload directory path:", uploadDir);
        
        // Ensure uploads directory exists
        try {
            if (!fs.existsSync(uploadDir)) {
                console.log("Creating uploads directory");
                fs.mkdirSync(uploadDir, { recursive: true });
            } else {
                console.log("Uploads directory already exists");
            }
        } catch (dirError) {
            console.error("Error creating/uploads directory:", dirError);
            throw new Error("Failed to create uploads directory: " + dirError.message);
        }
        
        // Write buffer to file
        const fileName = Date.now() + "-" + req.file.originalname;
        const filePath = path.join(uploadDir, fileName);
        
        console.log("Writing file to:", filePath);
        
        try {
            fs.writeFileSync(filePath, req.file.buffer);
            console.log("File written successfully");
        } catch (writeError) {
            console.error("Error writing file:", writeError);
            throw new Error("Failed to write file: " + writeError.message);
        }
        
        // Use a more reliable way to construct the image URL
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        console.log("Base URL:", baseUrl);
        
        const imageUrl = `${baseUrl}/uploads/${fileName}`;
        console.log("Generated image URL:", imageUrl);
        
        res.status(200).json({ 
            imageUrl,
            success: true,
            filename: fileName
        })
    } catch (error) {
        console.error("Error processing uploaded file:", error);
        res.status(500).json({ 
            message: "Failed to process uploaded file",
            success: false,
            error: error.message 
        });
    }
})

export default router;