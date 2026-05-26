import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GeneratedLink from "@/models/GeneratedLink";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ error: "Job ID missing" }, { status: 400 });
    }

    await connectDB();
    const job = await GeneratedLink.findOne({ jobId });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}