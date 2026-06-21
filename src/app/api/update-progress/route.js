import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GeneratedLink from "@/models/GeneratedLink";

export async function POST(req) {
  try {
    const { jobId, progress, currentStage } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    await connectDB();
    
    // 🚀 ডাটাবেসে রিয়েল-টাইম প্রোগ্রেস এবং স্টেজ আপডেট করা হচ্ছে
    const updatedJob = await GeneratedLink.findOneAndUpdate(
      { jobId },
      { 
        progress: progress,
        currentStage: currentStage || "Processing in background..."
      },
      { new: true } // আপডেট হওয়ার পরের ডাটা রিটার্ন করবে
    );

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Progress updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("[Progress Update Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}