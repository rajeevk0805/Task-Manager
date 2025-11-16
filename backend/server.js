import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import express from "express";
import connectDB from "./config/db.js";

import cors from "cors"; // Importing cors middleware
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";

const app = express();

// Middleware to handle cors
app.use(cors(
    {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }
));

// Middleware
app.use(express.json({ limit: '10mb' })) // Increase payload limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Connect Database
console.log("Connecting to database...");
try {
    await connectDB();
} catch (error) {
    console.error("Failed to connect to database:", error);
    // Continue running even if database connection fails
    // This allows the upload route to still work
}

// Serve static files from uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');

console.log("Upload directory path:", uploadDir);

// Ensure uploads directory exists
try {
    if (!fs.existsSync(uploadDir)) {
        console.log("Creating uploads directory");
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Uploads directory created:', uploadDir);
    } else {
        console.log('Uploads directory exists:', uploadDir);
    }
} catch (error) {
    console.error('Error ensuring uploads directory exists:', error);
}

app.use('/uploads', express.static(uploadDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Test endpoint for uploads
app.get('/test-upload', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Upload endpoint is accessible',
        uploadDir: uploadDir,
        uploadDirExists: fs.existsSync(uploadDir)
    });
});

// For Vercel deployment, we need to export the app
export default app;

// Start Server only when not in Vercel environment
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}