import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const db = mongoose.connection.db;
    
    // 🚀 Update: Exact logic to find your UUID based on the screenshot
    let query;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
       query = { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { jobId: id }] };
    } else {
       query = { jobId: id }; // Maximum link e ei jobId ta thakbe
    }

    // 🚀 Exact collection name from your screenshot
    const movie = await db.collection("generatedlinks").findOne(query);

    if (!movie) {
        return NextResponse.json({ error: "Movie not found in database" }, { status: 404 });
    }

    return NextResponse.json({ success: true, movie: movie });
  } catch (error) {
    console.error("Share API Error:", error);
    return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500 });
  }
}