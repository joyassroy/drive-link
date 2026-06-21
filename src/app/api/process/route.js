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
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // 🚀 API ব্লক এড়ানোর জন্য Sleep ফাংশন

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
          const { stdout, stderr } = await execPromise(command, { maxBuffer: 1024 * 1024 * 50 });
          
          const match = stdout.match(/__FINAL_RESULT_ARRAY__=(.+)/);
          
          if (match && match[1]) {
              const processedQualities = JSON.parse(match[1]); 
              
              if (processedQualities.length === 0) throw new Error("No qualities generated");

              const finalQualitiesArray = [];
              let mainMovieName = processedQualities[0].movieName;
              
              // 🚀 ১. শুধুমাত্র প্লেয়ার (Abyss) এর জন্য মাস্টার আইডি নেবো
              const masterDriveId = processedQualities[0].driveId;
              let masterAbyssId = null;

              console.log(`[API Queue] Fetching Abyss Player ID ONLY ONCE for Master ID: ${masterDriveId}`);

              // 🟢 Abyss Upload (লুপের বাইরে একবারই কল হবে)
              if (process.env.ABYSS_EMAIL && process.env.ABYSS_PASSWORD) {
                  try {
                      const authRes = await fetch('https://api.abyss.to/auth/login', {
                          method: 'POST', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: process.env.ABYSS_EMAIL, password: process.env.ABYSS_PASSWORD })
                      });
                      const authData = await authRes.json();
                      if (authData?.token) {
                          const abyssRes = await fetch(`https://api.abyss.to/v1/remote/drive/${masterDriveId}`, {
                              method: 'POST', headers: { 'Authorization': `Bearer ${authData.token}`, 'Content-Type': 'application/json' }
                          });
                          if (abyssRes.ok) {
                              const abyssDataFinal = JSON.parse(await abyssRes.text());
                              if (abyssDataFinal?.id) masterAbyssId = abyssDataFinal.id;
                          }
                      }
                  } catch(e) { console.error("Abyss Failed", e); }
              }

              // 🚀 ২. এবার লুপ চালিয়ে বাকি API গুলো কোয়ালিটি অনুযায়ী ফেচ করবো
              for (let i = 0; i < processedQualities.length; i++) {
                  const q = processedQualities[i];
                  const currentDriveId = q.driveId;
                  
                  let dlDokanLink = "Failed", gcloudLink = "Failed", driveCloudLink = "Failed";
                  const gofileLink = `https://d.instantdl.cfd/dokan/gofile.php?drive_id=${currentDriveId}`;

                  console.log(`[API Queue] Fetching Download APIs for Quality: ${q.quality}`);

                  // 🟢 DL Dokan API (প্রতিটা কোয়ালিটির জন্য আলাদা)
                  try {
                      if (process.env.DL_DOKAN_API_KEY) {
                          const dlApiUrl = `https://dldokan.com/userapi/?api_key=${process.env.DL_DOKAN_API_KEY}&drive_id=${currentDriveId}`;
                          const dlRes = await fetch(dlApiUrl);
                          const dlData = await dlRes.json();
                          if (dlData?.success && dlData?.data?.download_url) dlDokanLink = dlData.data.download_url;
                      }
                  } catch (err) {}

                  // 🟢 Drive Cloud API (প্রতিটা কোয়ালিটির জন্য আলাদা)
                  try {
                      if (process.env.DRIVE_CLOUD_API_KEY) {
                          const dcRes = await fetch(`http://new.drivecloud.cc/api/v1/${process.env.DRIVE_CLOUD_API_KEY}/${currentDriveId}`);
                          const dcData = await dcRes.json();
                          driveCloudLink = dcData?.data?.download_url || dcData?.url || dcData?.link || "Error";
                      }
                  } catch (err) {}

                  // 🟢 G Cloud API (প্রতিটা কোয়ালিটির জন্য আলাদা)
                  try {
                      if (process.env.GCLOUD_API_KEY) {
                          const gcApiUrl = `https://gcloud.sbs/api/v1/create/?drive_id=${currentDriveId}&api_key=${process.env.GCLOUD_API_KEY}`;
                          const gcRes = await fetch(gcApiUrl);
                          const gcData = await gcRes.json();
                          if (gcData?.success && gcData?.data?.download_url) gcloudLink = gcData.data.download_url;
                      }
                  } catch (err) {}

                  finalQualitiesArray.push({
                      quality: q.quality,
                      fileSize: q.fileSize,
                      driveId: currentDriveId,
                      driveLink: q.driveLink,
                      abyssId: masterAbyssId,           // 🚀 শুধু প্লেয়ারটা মাস্টার থেকে কপি করা হলো
                      gofileLink: gofileLink,
                      dlDokanLink: dlDokanLink,         // 🟢 আলাদা কোয়ালিটির লিংক
                      driveCloudLink: driveCloudLink,   // 🟢 আলাদা কোয়ালিটির লিংক
                      gcloudLink: gcloudLink            // 🟢 আলাদা কোয়ালিটির লিংক
                  });

                  // ⚠️ API ব্লক এড়াতে প্রতি রিকোয়েস্টের পর ৩.৫ সেকেন্ডের ব্রেক
                  if (i < processedQualities.length - 1) {
                      await sleep(3500); 
                  }
              }

              // 🗄️ Database Update
              await GeneratedLink.findOneAndUpdate(
                { jobId },
                { 
                  status: "completed", 
                  movieName: mainMovieName, 
                  qualities: finalQualitiesArray,
                  driveLink: finalQualitiesArray[0].driveLink, 
                  fileSize: finalQualitiesArray[0].fileSize,   
                }
              );
              console.log(`[Queue Success] Job ${jobId} Completed Properly with individual download links!`);
          } else {
              throw new Error("Python script failed to return qualities array.");
          }
      } catch (error) {
          console.error(`[Queue Error] Job ${jobId} Failed! Reason:`, error.message || error);
          await GeneratedLink.findOneAndUpdate({ jobId }, { status: "failed", movieName: "Process Failed!" });
      }
    });
    
    processNextInQueue();
    return NextResponse.json({ success: true, jobId, message: "Processing started in background!" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}