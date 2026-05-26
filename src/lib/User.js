// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  image: String,
  accessToken: String,
  refreshToken: String, // এই টোকেনটাই ড্রাইভ আপলোডের আসল চাবি
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);