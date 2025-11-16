import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", process.env.MONGODB_URI ? "URI is set" : "URI is not set");
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error("Please check:");
    console.error("1. Your MONGODB_URI environment variable is correctly set");
    console.error("2. Your IP address is whitelisted in MongoDB Atlas");
    console.error("3. Your MongoDB Atlas cluster is running");
    
    // Re-throw the error so it can be handled by the caller
    throw error;
  }
};

export default connectDB;