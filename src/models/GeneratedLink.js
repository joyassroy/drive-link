import mongoose from 'mongoose';

const generatedLinkSchema = new mongoose.Schema({
  jobId: { type: String, unique: true, sparse: true }, 
  status: { type: String, default: "processing" },     
  userEmail: { type: String, required: true },
  movieName: { type: String, default: "Processing in background..." },
  
  // 🟢 Old Fields (পুরনো ডাটাগুলোর জন্য এগুলো আগের মতোই থাকবে)
  driveLink: { type: String, default: "Not generated" },
  gofileLink: { type: String, default: "" },
  dlDokanLink: { type: String, default: "" },
  gcloudLink: { type: String, default: "" },
  driveCloudLink: { type: String, default: "" },
  fileSize: { type: String, default: "Unknown" },
  abyssId: { type: String, default: null },

  // 🚀 New Field: কোয়ালিটি অনুযায়ী সব এপিআই লিংক সেভ করার জন্য
  qualities: {
    type: Array,
    default: []
  },

  // 🚀 New Fields: রিয়েল-টাইম প্রোগ্রেস ট্র্যাক করার জন্য
  progress: { type: Number, default: 0 },
  currentStage: { type: String, default: "Initializing Engine..." },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.GeneratedLink || mongoose.model('GeneratedLink', generatedLinkSchema);