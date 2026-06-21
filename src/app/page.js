"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

// 🚀 Premium SVG Icons Library
const IconRocket = () => (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5a1.5 1.5 0 0 1 0-2.12l5.66-5.66a1.5 1.5 0 0 1 2.12 0l2.12 2.12a1.5 1.5 0 0 1 0 2.12L12.12 16a1.5 1.5 0 0 1-2.12 0l-.5-.5z"/><path d="m12 15-3-3a22 22 0 0 1-3.93-4.52c-.66-1.12-.22-2.71.9-3.32l1.62-.88c1.33-.72 2.97-.24 3.73 1.05a18 18 0 0 0 3.7 4.74z"/></svg>);
const IconGear = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>);
const IconFolder = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>);
const IconFilm = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>);
const IconTrash = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>);
const IconLightning = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const IconCheckCircle = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const IconXCircle = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>);

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [videoUrl, setVideoUrl] = useState("");
  const [folderId, setFolderId] = useState("");
  const [customName, setCustomName] = useState(""); 
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [generatedData, setGeneratedData] = useState(null); 
  
  // 🚀 রিয়েল-টাইম ডাটা রাখার স্টেট
  const [progressStageText, setProgressStageText] = useState("Initializing Engine...");
  const [progressPercent, setProgressPercent] = useState(0);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("add"); 
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const savedFolder = localStorage.getItem("savedTargetFolderId");
    if (savedFolder) setFolderId(savedFolder);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    document.body.appendChild(script);
  }, []);

  // 🚀 রিফ্রেশ দিলে আগের রানিং কাজ খুঁজে বের করে রিস্টোর করার আসল লজিক
  useEffect(() => {
    const savedJobStr = localStorage.getItem("activeProcessingJob");
    if (savedJobStr) {
      try {
        const savedJob = JSON.parse(savedJobStr);
        startTrackingJob(savedJob.jobId, savedJob.percent, savedJob.stageText);
      } catch (e) {
        localStorage.removeItem("activeProcessingJob");
      }
    }
  }, []);

  const fetchHistory = async (silent = false) => {
    if (!session?.user?.email) return;
    if (!silent) setHistoryLoading(true);
    try {
      const res = await fetch(`/api/history?email=${session.user.email}&_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache", "Expires": "0" }
      });
      const data = await res.json();
      if (res.ok) setHistoryData(data.history || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      if (!silent) setHistoryLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (activeTab === "history") {
      fetchHistory(); 
      // 🚀 প্রতি ৫ সেকেন্ড পর পর হিস্ট্রি চেক করবে, যাতে রিয়েল-টাইম পার্সেন্টেজ আপডেট হয়
      interval = setInterval(() => { fetchHistory(true); }, 5000);
    }
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleDeleteHistory = async (id) => {
    if (!confirm("Are you sure you want to delete this link from history?")) return;
    try {
      const res = await fetch(`/api/history?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setHistoryData(historyData.filter(item => item._id !== id));
        alert("Link deleted successfully!");
      } else {
        alert("Failed to delete link.");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  if (status === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)", color: "#065f46" }}>
        <h3 style={{ animation: "pulse 1.5s infinite", fontSize: "24px", fontWeight: "bold" }}>Loading MovieNewsBD Engine...</h3>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ background: "linear-gradient(135deg, #0f766e 0%, #047857 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ maxWidth: "420px", width: "100%", padding: "50px 30px", textAlign: "center", borderRadius: "24px", backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
          <div style={{ display: "inline-block", padding: "20px", borderRadius: "50%", background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)", marginBottom: "25px", boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)", color: "white" }}>
            <IconGear />
          </div>
          <h2 style={{ color: "#064e3b", marginBottom: "10px", fontSize: "30px", fontWeight: "900" }}>MovieNewsBD.Com</h2>
          <p style={{ color: "#059669", marginBottom: "40px", fontSize: "16px", fontWeight: "600" }}>DriveLink & Metadata Engine</p>
          <button onClick={() => signIn("google")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px 24px", background: "linear-gradient(to right, #10b981, #059669)", color: "white", border: "none", borderRadius: "14px", cursor: "pointer", fontWeight: "bold", width: "100%", fontSize: "18px", transition: "all 0.3s ease", boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.4)" }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <svg style={{ width: "24px", height: "24px", backgroundColor: "white", borderRadius: "50%", padding: "3px", color: "#059669" }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
            </svg>
            Secure Login with Google
          </button>
        </div>
      </div>
    );
  }

  const openDrivePicker = (pickType) => {
    if (!window.gapi) return alert("Google Drive API is still loading...");
    const developerKey = process.env.NEXT_PUBLIC_GCLOUD_API_KEY;
    const oauthToken = session?.accessToken;
    if (!oauthToken || !developerKey) return alert("Configuration or Session Token is missing!");

    window.gapi.load("picker", () => {
      const view = new window.google.picker.DocsView();
      if (pickType === "folder") {
        view.setIncludeFolders(true);
        view.setMimeTypes("application/vnd.google-apps.folder");
        view.setSelectFolderEnabled(true);
      } else {
        view.setIncludeFolders(false);
        view.setMimeTypes("video/mp4,video/x-matroska,video/avi,video/quicktime");
      }

      const picker = new window.google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(oauthToken)
        .setDeveloperKey(developerKey)
        .setCallback((data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const doc = data.docs[0];
            if (pickType === "folder") {
              setFolderId(doc.id);
              localStorage.setItem("savedTargetFolderId", doc.id);
            } else {
              setVideoUrl(doc.url);
            }
          }
        })
        .build();
      picker.setVisible(true);
    });
  };

  // 🚀 রিয়েল-টাইম API Polling ফাংশন
  // 🚀 রিয়েল-টাইম API Polling ফাংশন (Cache-Busting সহ)
  const startTrackingJob = (jobId, initialProgress = 5, initialStageText = "Initializing Engine...") => {
    setLoading(true);
    setProgressPercent(initialProgress);
    setProgressStageText(initialStageText);

    // প্রতি ৩ সেকেন্ড পর পর ডাটাবেস থেকে আসল পার্সেন্টেজ চেক করবে
    const pollInterval = setInterval(async () => {
      try {
        // 🚀 _t=${Date.now()} এবং cache: 'no-store' দিয়ে Next.js এর ক্যাশ বাইপাস করা হলো
        const res = await fetch(`/api/status?jobId=${jobId}&_t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", "Pragma": "no-cache", "Expires": "0" }
        });
        
        const data = await res.json();

        if (data.status === "completed") {
          setProgressPercent(100);
          setProgressStageText("100% Completed Successfully!");
          setLoading(false);
          setMessage("[Success] Video processed & transcoded successfully!");
          setGeneratedData(data);
          
          clearInterval(pollInterval);
          localStorage.removeItem("activeProcessingJob");
        } else if (data.status === "failed") {
          setLoading(false);
          setMessage("[Error] Server failed to process the video. Check logs.");
          
          clearInterval(pollInterval);
          localStorage.removeItem("activeProcessingJob");
        } else {
          // 🚀 ডাটাবেস থেকে রিয়েল-টাইম পার্সেন্টেজ এবং টেক্সট বসাচ্ছে
          const currentPct = data.progress || initialProgress;
          const currentStage = data.currentStage || initialStageText;
          
          setProgressPercent(currentPct);
          setProgressStageText(currentStage);

          // রিফ্রেশের জন্য লোকাল স্টোরেজ আপডেট রাখা হচ্ছে
          localStorage.setItem("activeProcessingJob", JSON.stringify({
            jobId: jobId, percent: currentPct, stageText: currentStage
          }));
        }
      } catch (err) {
        console.error("Error polling status:", err);
      }
    }, 3000); 
  };

  const handleProcessVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedData(null);
    setMessage("");

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, folderId, email: session.user.email, customName }), 
      });

      const data = await response.json();
      
      if (response.ok && data.jobId) {
        // নতুন কাজ শুরু হলে লোকাল স্টোরেজে সেভ করে ট্র্যাকিং শুরু
        localStorage.setItem("activeProcessingJob", JSON.stringify({ jobId: data.jobId, percent: 5, stageText: "Initializing Engine..." }));
        startTrackingJob(data.jobId, 5, "Initializing Engine...");
      } else {
        setLoading(false);
        setMessage(`[Error] ${data.error}`);
      }
    } catch (error) {
      setLoading(false);
      setMessage("[Error] Failed to connect to server.");
    }
  };

  const copyToClipboard = (text) => {
    if (!text || text === "Not generated") return alert("No valid link to copy!");
    navigator.clipboard.writeText(text);
    alert("Link Copied!");
  };

  return (
    <div className="dashboard-layout">
      <style dangerouslySetInnerHTML={{__html: `
        :root { color-scheme: light; }
        body { margin: 0; background-color: #f0fdf4; color: #333; font-family: 'Segoe UI', system-ui, sans-serif; min-height: 100vh; }
        .dashboard-layout { display: flex; min-height: 100vh; background-color: #f0fdf4; }
        
        .sidebar { width: 260px; background: linear-gradient(180deg, #064e3b 0%, #065f46 100%); color: white; padding: 25px 20px; display: flex; flex-direction: column; z-index: 1000; transition: transform 0.3s ease; box-shadow: 4px 0 15px rgba(0,0,0,0.1); }
        .nav-item { padding: 14px 18px; border-radius: 10px; cursor: pointer; margin-bottom: 10px; font-weight: 600; transition: all 0.2s ease; display: flex; align-items: center; gap: 10px; }
        .nav-item.active { background: rgba(255,255,255,0.15); color: #fff; box-shadow: inset 2px 2px 5px rgba(0,0,0,0.1); border-left: 4px solid #34d399; }
        .nav-item:not(.active) { color: #a7f3d0; }
        .nav-item:not(.active):hover { background: rgba(255,255,255,0.05); color: #fff; transform: translateX(5px); }
        
        .main-content { flex: 1; padding: 40px; background-image: radial-gradient(circle at top right, #ecfdf5 0%, #f0fdf4 100%); color: #111; box-sizing: border-box; overflow-y: auto; }
        .mobile-header { display: none; background: #064e3b; color: white; padding: 15px 20px; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 900; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .menu-toggle-btn { background: none; border: none; color: white; font-size: 26px; cursor: pointer; }
        .sidebar-backdrop { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(3px); z-index: 999; }

        .top-brand-header { margin-bottom: 40px; border-bottom: 2px solid #d1fae5; padding-bottom: 20px; }
        .top-brand-title { font-size: 36px; font-weight: 900; background: linear-gradient(to right, #047857, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; }
        
        .custom-input { width: 100%; padding: 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 15px; box-sizing: border-box; transition: all 0.3s ease; background: #f8fafc; }
        .custom-input:focus { border-color: #10b981; background: #fff; outline: none; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15); }
        
        .divider { display: flex; align-items: center; text-align: center; margin: 25px 0; }
        .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 2px dashed #cbd5e1; }
        .divider-text { color: #64748b; font-size: 13px; font-weight: 800; text-transform: uppercase; padding: 0 15px; }

        .drive-btn { width: 100%; padding: 14px; background-color: #f1f5f9; color: #334155; border: 2px solid #cbd5e1; border-radius: 12px; cursor: pointer; font-weight: 700; display: flex; justify-content: center; align-items: center; gap: 10px; font-size: 15px; transition: all 0.2s; }
        .drive-btn:hover { background-color: #e2e8f0; border-color: #94a3b8; }
        
        .submit-btn { width: 100%; padding: 18px; background: linear-gradient(to right, #059669, #10b981); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 800; font-size: 17px; transition: all 0.3s ease; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); text-transform: uppercase; letter-spacing: 1px; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(16, 185, 129, 0.5); }
        .submit-btn:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; transform: none; }

        .progress-box { margin-top: 35px; padding: 25px; background: #ffffff; border-radius: 16px; border: 2px solid #d1fae5; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.05); }
        .progress-text { display: flex; justify-content: space-between; margin-bottom: 15px; font-weight: 800; color: #047857; font-size: 15px; align-items: center; gap: 8px;}
        .progress-container { width: 100%; background-color: #f1f5f9; border-radius: 12px; overflow: hidden; height: 16px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
        .progress-bar { height: 100%; background: linear-gradient(90deg, #059669 0%, #34d399 100%); border-radius: 12px; transition: width 0.8s ease-in-out; position: relative; overflow: hidden; }
        .progress-bar::after { content: ''; position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: linear-gradient(45deg, rgba(255,255,255,.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.2) 50%, rgba(255,255,255,.2) 75%, transparent 75%, transparent); background-size: 2rem 2rem; animation: loadingStripes 1s linear infinite; }
        @keyframes loadingStripes { from { background-position: 2rem 0; } to { background-position: 0 0; } }

        .form-card { background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; }
        
        .link-card { background: #f8fafc; border: 2px solid #e2e8f0; padding: 18px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; gap: 15px; transition: all 0.2s; }
        .link-card:hover { border-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1); }
        .link-label { flex: 0 0 100px; font-weight: 800; color: #334155; font-size: 15px; }
        .link-text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #059669; font-family: monospace; font-size: 15px; background: #ffffff; padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; }
        
        .copy-btn { padding: 10px 20px; background: #0f766e; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 800; color: white; transition: 0.2s; box-shadow: 0 4px 6px rgba(15, 118, 110, 0.2); }
        .copy-btn:hover { background: #047857; transform: scale(1.05); }

        .history-item-card { background-color: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; margin-bottom: 25px; box-shadow: 0 10px 20px rgba(0,0,0,0.02); border-left: 6px solid #10b981; transition: all 0.3s; }
        .history-item-card:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.05); }
        
        .history-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .history-title { font-size: 18px; color: #0f172a; display: flex; align-items: center; gap: 10px; font-weight: 900; word-break: break-word; flex: 1; min-width: 200px; }
        
        .delete-btn { display: flex; align-items: center; justify-content: center; gap: 6px; background: #fff1f2; border: 1px solid #fecdd3; color: #e11d48; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 13px; transition: 0.2s; white-space: nowrap; }
        .delete-btn:hover { background-color: #ffe4e6; border-color: #fda4af; }

        /* 🚀 New CSS For Quality Details Toggle Block */
        .quality-section { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 15px; margin-bottom: 15px; }
        .quality-badge { display: inline-block; padding: 4px 10px; background: #047857; color: white; border-radius: 6px; font-size: 12px; font-weight: 800; margin-bottom: 10px; }
        
        .api-links-details { margin-top: 10px; }
        .toggle-summary { background: #e2e8f0; color: #334155; padding: 12px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; list-style: none; display: flex; justify-content: center; align-items: center; transition: 0.2s; user-select: none; border: 1px solid #cbd5e1; }
        .toggle-summary::-webkit-details-marker { display: none; }
        .toggle-summary:hover { background: #cbd5e1; }
        .toggle-summary::after { content: '▼ Show API Links'; font-size: 13px; }
        details[open] .toggle-summary::after { content: '▲ Hide API Links'; }
        
        .hidden-links-container { padding-top: 15px; animation: slideDown 0.3s ease; border-top: 2px dashed #cbd5e1; margin-top: 15px; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 768px) {
          .dashboard-layout { flex-direction: column; }
          .sidebar { position: fixed; left: 0; top: 0; bottom: 0; transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'}; }
          .mobile-header { display: flex; }
          .sidebar-backdrop { display: ${sidebarOpen ? 'block' : 'none'}; }
          .main-content { padding: 20px; }
          .top-brand-title { font-size: 28px; }
          .form-card { padding: 25px; }
          .link-card { flex-direction: column; align-items: stretch; }
          .link-label { flex: auto; margin-bottom: 5px; }
          
          .history-header { flex-direction: column; align-items: flex-start; }
          .delete-btn { width: 100%; text-align: center; padding: 12px; }
          .history-item-card { padding: 18px; }
        }
      `}} />

      <div className="mobile-header">
        <h2 style={{ fontSize: "22px", margin: 0, fontWeight: "900" }}>MovieNewsBD.Com</h2>
        <button className="menu-toggle-btn" onClick={() => setSidebarOpen(true)}>☰</button>
      </div>
      <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>

      <div className="sidebar">
        <div style={{ marginBottom: "40px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", padding: "12px", background: "rgba(255,255,255,0.1)", borderRadius: "12px", marginBottom: "10px", color: "white" }}>
             <IconRocket />
          </div>
          <h2 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "20px", margin: 0, fontWeight: "900", letterSpacing: "1px" }}>
            <IconGear /> ENGINE PANEL
          </h2>
        </div>
        
        <div style={{ flex: 1 }}>
          <div className={`nav-item ${activeTab === 'add' ? 'active' : ''}`} onClick={() => { setActiveTab('add'); setSidebarOpen(false); }}>
            <IconGear /> Process Movie
          </div>
          <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => { setActiveTab('history'); setSidebarOpen(false); }}>
            <IconFolder /> Link History
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "25px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "12px" }}>
            <img src={session.user.image} alt="Profile" style={{ width: "40px", height: "40px", borderRadius: "10px", border: "2px solid #34d399", objectFit: "cover" }} />
            <div style={{ overflow: "hidden" }}>
              <strong style={{ display: "block", fontSize: "14px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{session.user.name}</strong>
              <span style={{ color: "#a7f3d0", fontSize: "11px" }}>{session.user.email}</span>
            </div>
          </div>
          <button onClick={() => signOut()} style={{ width: "100%", padding: "14px", backgroundColor: "#b91c1c", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "800", transition: "0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor='#991b1b'} onMouseOut={(e) => e.currentTarget.style.backgroundColor='#b91c1c'}>
            Log Out
          </button>
        </div>
      </div>

      <div className="main-content">
        
        <div className="top-brand-header">
           <h1 className="top-brand-title">MovieNewsBD.Com DriveLink</h1>
           <p style={{ color: "#475569", marginTop: "10px", fontSize: "16px", fontWeight: "500" }}>Automated metadata cleaning & link generation engine.</p>
        </div>

        {activeTab === "add" && (
          <>
            <form className="form-card" onSubmit={handleProcessVideo}>
              
              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", marginBottom: "10px", fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>Video URL or Drive Link</label>
                <input type="text" required value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://domain.com/movie.mp4" className="custom-input" />
                <div className="divider"><span className="divider-text">OR PICK FROM DRIVE</span></div>
                <button type="button" className="drive-btn" onClick={() => openDrivePicker("file")}><IconFolder /> Browse Google Drive Files</button>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", marginBottom: "10px", fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>Custom Movie Name (Optional)</label>
                <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="e.g., Avatar 2026 1080p (Leave empty for original name)" className="custom-input" />
              </div>

              <div style={{ marginBottom: "40px" }}>
                <label style={{ display: "block", marginBottom: "10px", fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>Target Google Drive Folder ID</label>
                <input 
                  type="text" 
                  required 
                  value={folderId} 
                  onChange={(e) => {
                    setFolderId(e.target.value);
                    localStorage.setItem("savedTargetFolderId", e.target.value);
                  }} 
                  placeholder="e.g., 1f5sulDL6oeKl..." 
                  className="custom-input" 
                />
                <div className="divider"><span className="divider-text">OR SELECT FOLDER</span></div>
                <button type="button" className="drive-btn" onClick={() => openDrivePicker("folder")}><IconFolder /> Select Output Folder</button>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "System Engine Running..." : "Start Processing Engine"}
              </button>

              {loading && (
                <div className="progress-box">
                  <div className="progress-text">
                    <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><IconLightning /> {progressStageText}</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="progress-container"><div className="progress-bar" style={{ width: `${progressPercent}%` }}></div></div>
                  <p style={{ marginTop: "15px", fontSize: "13px", color: "#64748b", textAlign: "center", fontWeight: "600" }}>Please wait, large files might take a few minutes. Do not close this tab.</p>
                </div>
              )}
            </form>

            {message && !loading && (
              <div style={{ marginTop: "30px", padding: "20px", backgroundColor: message.includes("[Error]") ? "#fff1f2" : "#ecfdf5", color: message.includes("[Error]") ? "#e11d48" : "#047857", borderLeft: message.includes("[Error]") ? "6px solid #f43f5e" : "6px solid #10b981", borderRadius: "12px", fontSize: "16px", fontWeight: "800", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>{message.includes("[Error]") ? <IconXCircle /> : <IconCheckCircle />}</span> {message}
              </div>
            )}

            {generatedData && !loading && (
              <div style={{ marginTop: "40px" }}>
                <h3 style={{ borderBottom: "3px solid #d1fae5", paddingBottom: "15px", marginBottom: "30px", color: "#064e3b", fontSize: "22px", fontWeight: "900", display: "flex", alignItems: "center", gap: "10px" }}><IconLightning /> Final Generated Links</h3>
                
                {generatedData.qualities && generatedData.qualities.length > 0 ? (
                    generatedData.qualities.map((q, idx) => (
                      <div key={idx} className="quality-section">
                        <span className="quality-badge">{q.quality} ({q.fileSize})</span>
                        
                        <div className="link-card" style={{ padding: "12px", borderLeft: "4px solid #ec4899", background: "#fdf2f8", marginTop: "10px", marginBottom: "0" }}>
                          <div className="link-label" style={{ color: "#be185d" }}>Public Page:</div>
                          <div className="link-text" style={{ color: "#ec4899", fontWeight: "bold", background: "white" }}>
                            {typeof window !== "undefined" ? window.location.origin : ""}/share/{generatedData.jobId}?q={q.quality}
                          </div>
                          <button className="copy-btn" style={{ background: "#ec4899" }} onClick={(e) => { e.preventDefault(); copyToClipboard(`${window.location.origin}/share/${generatedData.jobId}?q=${q.quality}`); }}>COPY</button>
                        </div>

                        <details className="api-links-details">
                          <summary className="toggle-summary"></summary>
                          <div className="hidden-links-container">
                            <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">Drive:</div><div className="link-text" style={{ color: "#2563eb" }}>{q.driveLink || "Not found"}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(q.driveLink); }}>COPY</button></div>
                            <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">Gofile:</div><div className="link-text">{q.gofileLink}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(q.gofileLink); }}>COPY</button></div>
                            <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">DL Dokan:</div><div className="link-text">{q.dlDokanLink}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(q.dlDokanLink); }}>COPY</button></div>
                            <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">Drive Cloud:</div><div className="link-text">{q.driveCloudLink}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(q.driveCloudLink); }}>COPY</button></div>
                            <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">Gcloud:</div><div className="link-text">{q.gcloudLink}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(q.gcloudLink); }}>COPY</button></div>
                          </div>
                        </details>
                      </div>
                    ))
                ) : (
                    <div className="quality-section">
                      <div className="link-card" style={{ padding: "12px", borderLeft: "4px solid #ec4899", background: "#fdf2f8" }}>
                        <div className="link-label" style={{ color: "#be185d" }}>Public Page:</div>
                        <div className="link-text" style={{ color: "#ec4899", fontWeight: "bold", background: "white" }}>
                          {typeof window !== "undefined" ? window.location.origin : ""}/share/{generatedData.jobId}
                        </div>
                        <button className="copy-btn" style={{ background: "#ec4899" }} onClick={() => copyToClipboard(`${window.location.origin}/share/${generatedData.jobId}`)}>COPY</button>
                      </div>
                    </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === "history" && (
          <>
            <form className="form-card" style={{ padding: "30px" }}>
              <h2 style={{ marginBottom: "10px", fontSize: "26px", fontWeight: "900", color: "#064e3b" }}>Processed History</h2>
              <p style={{ color: "#475569", marginBottom: "30px", fontSize: "16px", fontWeight: "500" }}>Manage your previously generated links.</p>

              {historyLoading ? (
                <div style={{ textAlign: "center", padding: "50px", color: "#059669", fontWeight: "800", fontSize: "18px" }}><span style={{animation: "pulse 1s infinite inline-block"}}>Loading records...</span></div>
              ) : historyData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "#f8fafc", borderRadius: "16px", border: "2px dashed #cbd5e1", color: "#64748b" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "10px" }}>No History Found!</h3>
                  <p style={{ fontWeight: "500" }}>Movies processed will automatically be saved here.</p>
                </div>
              ) : (
                historyData.map((item) => {
                  const publicShareId = item.jobId || item._id;

                  return (
                    <div className="history-item-card" key={item._id}>
                      <div className="history-header">
                        <strong className="history-title">
                          <IconFilm /> {item.movieName}
                        </strong>
                        <button className="delete-btn" onClick={(e) => { e.preventDefault(); handleDeleteHistory(item._id); }}><IconTrash /> Delete Record</button>
                      </div>
                      
                      {/* 🚀 History Tab এও রিয়েল-টাইম ডাটা শো করানো হলো */}
                      {item.status === "processing" && (
                        <div className="progress-box" style={{ marginTop: "0", marginBottom: "20px" }}>
                          <div className="progress-text">
                            <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><IconLightning /> {item.currentStage || "Processing in background..."}</span>
                            <span>{item.progress || 0}%</span>
                          </div>
                          <div className="progress-container"><div className="progress-bar" style={{ width: `${item.progress || 0}%` }}></div></div>
                          <p style={{ marginTop: "15px", fontSize: "13px", color: "#64748b", textAlign: "center", fontWeight: "600" }}>Running in background. Auto-updating live...</p>
                        </div>
                      )}

                      {item.status === "failed" && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: "20px", padding: "12px", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", fontWeight: "bold", textAlign: "center" }}>
                          <IconXCircle /> Processing Failed. Check server logs.
                        </div>
                      )}

                      {item.status !== "failed" && item.status !== "processing" && (
                        <>
                          {item.qualities && item.qualities.length > 0 ? (
                            item.qualities.map((q, idx) => (
                              <div key={idx} className="quality-section">
                                <span className="quality-badge">{q.quality} ({q.fileSize})</span>
                                
                                <div className="link-card" style={{ padding: "12px", borderLeft: "4px solid #ec4899", background: "#fdf2f8", marginTop: "10px", marginBottom: "0" }}>
                                  <div className="link-label" style={{ color: "#be185d" }}>Public Page:</div>
                                  <div className="link-text" style={{ color: "#ec4899", fontWeight: "bold", background: "white" }}>
                                    {typeof window !== "undefined" ? window.location.origin : ""}/share/{publicShareId}?q={q.quality}
                                  </div>
                                  <button className="copy-btn" style={{ background: "#ec4899", padding: "8px 15px", fontSize: "12px" }} onClick={(e) => { e.preventDefault(); copyToClipboard(`${window.location.origin}/share/${publicShareId}?q=${q.quality}`); }}>COPY</button>
                                </div>

                                <details className="api-links-details">
                                  <summary className="toggle-summary"></summary>
                                  <div className="hidden-links-container">
                                    <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">Drive:</div><div className="link-text" style={{ color: "#2563eb" }}>{q.driveLink || "Not found"}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(q.driveLink); }}>COPY</button></div>
                                    <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">Gofile:</div><div className="link-text">{q.gofileLink}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(q.gofileLink); }}>COPY</button></div>
                                    <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">DL Dokan:</div><div className="link-text">{q.dlDokanLink}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(q.dlDokanLink); }}>COPY</button></div>
                                    <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">Drive Cloud:</div><div className="link-text">{q.driveCloudLink}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(q.driveCloudLink); }}>COPY</button></div>
                                    <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">Gcloud:</div><div className="link-text">{q.gcloudLink}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(q.gcloudLink); }}>COPY</button></div>
                                  </div>
                                </details>
                              </div>
                            ))
                          ) : (
                            <div className="quality-section">
                              <span className="quality-badge" style={{background: '#64748b'}}>Legacy Data</span>
                              
                              <div className="link-card" style={{ padding: "12px", borderLeft: "4px solid #ec4899", background: "#fdf2f8", marginTop: "10px", marginBottom: "0" }}>
                                <div className="link-label" style={{ color: "#be185d" }}>Public Page:</div>
                                <div className="link-text" style={{ color: "#ec4899", fontWeight: "bold", background: "white" }}>
                                  {typeof window !== "undefined" ? window.location.origin : ""}/share/{publicShareId}
                                </div>
                                <button className="copy-btn" style={{ background: "#ec4899", padding: "8px 15px", fontSize: "12px" }} onClick={(e) => { e.preventDefault(); copyToClipboard(`${window.location.origin}/share/${publicShareId}`); }}>COPY</button>
                              </div>

                              <details className="api-links-details">
                                <summary className="toggle-summary"></summary>
                                <div className="hidden-links-container">
                                  <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">Drive:</div><div className="link-text" style={{ color: "#2563eb" }}>{item.driveLink || "Not found"}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(item.driveLink); }}>COPY</button></div>
                                  <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">Gofile:</div><div className="link-text">{item.gofileLink}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(item.gofileLink); }}>COPY</button></div>
                                  <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">DL Dokan:</div><div className="link-text">{item.dlDokanLink}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(item.dlDokanLink); }}>COPY</button></div>
                                  <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">Drive Cloud:</div><div className="link-text">{item.driveCloudLink}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(item.driveCloudLink); }}>COPY</button></div>
                                  <div className="link-card" style={{ padding: "10px", margin: "5px 0" }}><div className="link-label">Gcloud:</div><div className="link-text">{item.gcloudLink}</div><button className="copy-btn" onClick={(e) => { e.preventDefault(); copyToClipboard(item.gcloudLink); }}>COPY</button></div>
                                </div>
                              </details>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}