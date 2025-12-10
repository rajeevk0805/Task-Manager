import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    return conn;
  } catch (error) {
    // Re-throw the error so it can be handled by the caller
    throw error;
  }
};

export default connectDB;