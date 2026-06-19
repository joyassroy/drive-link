import mongoose from 'mongoose';

const generatedLinkSchema = new mongoose.Schema({
  jobId: { type: String, unique: true, sparse: true }, 
  status: { type: String, default: "processing" },     
  userEmail: { type: String, required: true },
  movieName: { type: String, default: "Processing in background..." },
  driveLink: { type: String, default: "Not generated" },
  gofileLink: { type: String, default: "" },
  dlDokanLink: { type: String, default: "" },
  gcloudLink: { type: String, default: "" },
  driveCloudLink: { type: String, default: "" }, // 🚀 ওল্ড ড্রাইভ ক্লাউডের জন্য নতুন ফিল্ড যোগ করা হলো
  fileSize: { type: String, default: "Unknown" },
  createdAt: { type: Date, default: Date.now },
  abyssId: { type: String, default: null },
});

export default mongoose.models.GeneratedLink || mongoose.model('GeneratedLink', generatedLinkSchema);