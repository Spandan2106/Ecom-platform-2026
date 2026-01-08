import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.error("Ensure MongoDB is running or check your MONGO_URI connection string.");
    process.exit(1);
  }
};

export default connectDB;
