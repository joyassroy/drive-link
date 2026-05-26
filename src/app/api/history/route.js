import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GeneratedLink from "@/models/GeneratedLink";

// 📁 1. User-er email onujayi shob history fetch kora
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }

    await connectDB();
    // Shobcheye new data age dekhano hobe (sort by createdAt descending)
    const history = await GeneratedLink.find({ userEmail: email }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error("[Error] Fetching history failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 🗑️ 2. Konopo nirdisto link history theke delete kora
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }

    await connectDB();
    await GeneratedLink.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Link deleted successfully" });
  } catch (error) {
    console.error("[Error] Deleting history item failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}