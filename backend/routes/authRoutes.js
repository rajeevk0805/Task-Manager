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
    console.log("=== UPLOAD ROUTE START ===");
    
    try {
        console.log("Upload request received");
        
        // Log request details for debugging
        console.log("Request headers:", JSON.stringify(req.headers, null, 2));
        console.log("Request file:", req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            encoding: req.file.encoding,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : "No file");
        
        // Improved error handling
        if(!req.file){
            console.log("No file uploaded in request");
            return res.status(400).json({ 
                message: "No file uploaded",
                success: false 
            });
        }
        
        console.log("Processing uploaded file");
        // With memory storage, we need to write the file to disk
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const uploadDir = path.join(__dirname, "..", "uploads");
        
        console.log("Upload directory path:", uploadDir);
        console.log("Upload directory exists:", fs.existsSync(uploadDir));
        
        // Ensure uploads directory exists
        try {
            if (!fs.existsSync(uploadDir)) {
                console.log("Creating uploads directory");
                fs.mkdirSync(uploadDir, { recursive: true });
                console.log("Uploads directory created successfully");
            } else {
                console.log("Uploads directory already exists");
            }
        } catch (dirError) {
            console.error("Error creating/uploads directory:", dirError);
            return res.status(500).json({ 
                message: "Failed to create uploads directory",
                success: false,
                error: dirError.message 
            });
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
            return res.status(500).json({ 
                message: "Failed to write file to disk",
                success: false,
                error: writeError.message 
            });
        }
        
        // Use a more reliable way to construct the image URL
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        console.log("Base URL:", baseUrl);
        
        const imageUrl = `${baseUrl}/uploads/${fileName}`;
        console.log("Generated image URL:", imageUrl);
        
        console.log("=== UPLOAD ROUTE END SUCCESS ===");
        res.status(200).json({ 
            imageUrl,
            success: true,
            filename: fileName
        })
    } catch (error) {
        console.error("=== UPLOAD ROUTE ERROR ===");
        console.error("Error processing uploaded file:", error);
        console.error("Error stack:", error.stack);
        console.log("=== UPLOAD ROUTE END ERROR ===");
        
        res.status(500).json({ 
            message: "Failed to process uploaded file",
            success: false,
            error: error.message 
        });
    }
})

export default router;