import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use memory storage instead of disk storage for better Vercel compatibility
const storage = multer.memoryStorage();

//file filter
const fileFilter = (req, file, cb) => {
  // Added image/webp to the allowed types
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, JPG, and WebP are allowed."));
  }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Export a custom middleware that wraps the upload to add error handling
export const uploadSingleImage = (req, res, next) => {
  // Call the multer middleware
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: "File upload error: " + err.message,
        success: false
      });
    }
    
    next();
  });
};

export default upload;