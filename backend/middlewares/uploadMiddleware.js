import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (error) {
    console.error("Error creating uploads directory:", error);
}

// Use memory storage instead of disk storage for better Vercel compatibility
const storage = multer.memoryStorage();

//file filter
const fileFilter = (req, file, cb) => {
  console.log("File filter processing file:", file);
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    console.log("File type accepted");
    cb(null, true);
  } else {
    console.log("File type rejected:", file.mimetype);
    cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."));
  }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export default upload;