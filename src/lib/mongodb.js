// lib/mongodb.js
import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[✅] MongoDB Successfully Connected!");
  } catch (error) {
    console.error("[❌] MongoDB Connection Error:", error);
  }
};

export default connectDB;