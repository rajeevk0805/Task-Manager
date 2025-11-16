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
    // Improved error handling
    if(!req.file){
        return res.status(400).json({ 
            message: "No file uploaded",
            success: false 
        });
    }
    
    try {
        // With memory storage, we need to write the file to disk
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const uploadDir = path.join(__dirname, "..", "uploads");
        
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Write buffer to file
        const fileName = Date.now() + "-" + req.file.originalname;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, req.file.buffer);
        
        // Use a more reliable way to construct the image URL
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        const imageUrl = `${baseUrl}/uploads/${fileName}`;
        
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