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

// Enhanced CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            process.env.CLIENT_URL // Your production frontend URL
        ];
        
        // Check if the origin is in our allowed list
        if (allowedOrigins.includes(origin) || !process.env.CLIENT_URL) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

// Explicitly handle preflight requests for all routes
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.sendStatus(200);
    } else {
        next();
    }
});

// Middleware
app.use(express.json({ limit: '10mb' })) // Increase payload limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static files from uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
try {
    await connectDB();
} catch (error) {
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