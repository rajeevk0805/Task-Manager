import dotenv from "dotenv";
dotenv.config();

// Debug environment variables
console.log("Environment variables debug:");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "**** (SET)" : "NOT SET");

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

// Serve static files from uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
console.log("Connecting to database...");
try {
    await connectDB();
} catch (error) {
    console.error("Failed to connect to database:", error);
    // Continue running even if database connection fails
    // This allows the upload route to still work
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is running' });
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