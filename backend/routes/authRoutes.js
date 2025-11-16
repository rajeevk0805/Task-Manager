import express from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controller/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

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
        // Use a more reliable way to construct the image URL
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
        res.status(200).json({ 
            imageUrl,
            success: true,
            filename: req.file.filename
        })
    } catch (error) {
        console.error("Error generating image URL:", error);
        res.status(500).json({ 
            message: "Failed to process uploaded file",
            success: false,
            error: error.message 
        });
    }
})

export default router;