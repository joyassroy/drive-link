import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/User";
import GeneratedLink from "@/models/GeneratedLink";
import { exec } from "child_process";
import path from "path";
import util from "util";
import fs from "fs";
import crypto from "crypto";

const execPromise = util.promisify(exec);

const taskQueue = [];
let isProcessing = false;

const processNextInQueue = async () => {
  if (isProcessing || taskQueue.length === 0) return;
  isProcessing = true;
  const currentTask = taskQueue.shift();
  try { await currentTask(); } catch (error) { console.error("[Queue Error]", error); }
  isProcessing = false;
  processNextInQueue();
};

export async function POST(req) {
  try {
    const { videoUrl, folderId, email, customName } = await req.json();

    if (!videoUrl || !folderId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user || !user.refreshToken) {
      return NextResponse.json({ error: "Refresh Token missing. Please Logout and Login again." }, { status: 401 });
    }

    const jobId = crypto.randomUUID();
    await GeneratedLink.create({
      jobId,
      userEmail: email,
      status: "processing"
    });

    const pythonScriptPath = path.join(process.cwd(), "main.py");
    let pythonExecutable = "python3"; 
    const venvPythonPath = path.join(process.cwd(), "venv", "bin", "python3");
    if (fs.existsSync(venvPythonPath)) pythonExecutable = venvPythonPath;

    const command = `"${pythonExecutable}" "${pythonScriptPath}" --url "${videoUrl}" --folder "${folderId}" --refresh_token "${user.refreshToken}" --client_id "${process.env.GOOGLE_CLIENT_ID}" --client_secret "${process.env.GOOGLE_CLIENT_SECRET}" --custom_name "${customName || ''}"`;

    taskQueue.push(async () => {
      console.log(`[Queue] Starting job ${jobId} for: ${email}`);
      try {
          const { stdout, stderr } = await execPromise(command);
          const match = stdout.match(/__FINAL_DRIVE_LINK__=(.+)/);
          
          if (match && match[1]) {
              const finalDriveLink = match[1].trim();
              const idMatch = finalDriveLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
              const driveFileId = idMatch ? idMatch[1] : null;

              if (!driveFileId) throw new Error("No Drive ID");

              const nameMatch = stdout.match(/\[Upload\] Uploading '([^']+)' to Google Drive/);
              const finalMovieName = nameMatch ? nameMatch[1] : `Movie_${driveFileId}`;

              // 🚀 ফাইল সাইজ ম্যাচ করে বের করা
              const sizeMatch = stdout.match(/__FILE_SIZE__=(.+)/);
              const finalFileSize = sizeMatch ? sizeMatch[1].trim() : "Unknown";
              
              let dlDokanLink = "Failed", gcloudLink = "Failed", driveCloudLink = "Failed", gofileLink = `https://d.instantdl.cfd/dokan/gofile.php?drive_id=${driveFileId}`;

              // 🟢 1. DL Dokan API Call
              try {
                if (process.env.DL_DOKAN_API_KEY) {
                  const dlApiUrl = `https://dldokan.com/userapi/?api_key=${process.env.DL_DOKAN_API_KEY}&drive_id=${driveFileId}`;
                  const dlData = await (await fetch(dlApiUrl)).json();
                  if (dlData.success && dlData.data && dlData.data.download_url) {
                    dlDokanLink = dlData.data.download_url;
                  }
                }
              } catch (err) {}

              // 🟢 2. Old DriveCloud API Call
              try {
                if (process.env.DRIVE_CLOUD_API_KEY) {
                  const dcData = await (await fetch(`http://new.drivecloud.cc/api/v1/${process.env.DRIVE_CLOUD_API_KEY}/${driveFileId}`)).json();
                  driveCloudLink = dcData?.data?.download_url || dcData?.url || dcData?.link || "Error";
                }
              } catch (err) {}

              // 🟢 3. New G Cloud API Call
              try {
                if (process.env.GCLOUD_API_KEY) {
                  const gcApiUrl = `https://gcloud.sbs/api/v1/create/?drive_id=${driveFileId}&api_key=${process.env.GCLOUD_API_KEY}`;
                  const gcRes = await fetch(gcApiUrl);
                  const gcData = await gcRes.json();
                  if (gcData.success && gcData.data && gcData.data.download_url) {
                    gcloudLink = gcData.data.download_url;
                  }
                }
              } catch (err) {}

              // 🗄️ Database Update with all links and file size
              await GeneratedLink.findOneAndUpdate(
                { jobId },
                { 
                  status: "completed", 
                  movieName: finalMovieName, 
                  driveLink: finalDriveLink, 
                  fileSize: finalFileSize, // 🚀 ফাইল সাইজ ডাটাবেসে সেভ হচ্ছে
                  gofileLink, 
                  dlDokanLink, 
                  gcloudLink,
                  driveCloudLink 
                }
              );
              console.log(`[Queue Success] Job ${jobId} Completed!`);
          } else {
              throw new Error("Python script failed to return link.");
          }
      } catch (error) {
          console.error(`[Queue Error] Job ${jobId} Failed!`);
          await GeneratedLink.findOneAndUpdate({ jobId }, { status: "failed", movieName: "Process Failed!" });
      }
    });
    
    processNextInQueue();
    return NextResponse.json({ success: true, jobId, message: "Processing started in background!" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}