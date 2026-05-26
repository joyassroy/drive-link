"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// 🚀 Premium SVG Icons
const IconLightningCloud = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg>);
const IconRocket = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5a1.5 1.5 0 0 1 0-2.12l5.66-5.66a1.5 1.5 0 0 1 2.12 0l2.12 2.12a1.5 1.5 0 0 1 0 2.12L12.12 16a1.5 1.5 0 0 1-2.12 0l-.5-.5z"/><path d="m12 15-3-3a22 22 0 0 1-3.93-4.52c-.66-1.12-.22-2.71.9-3.32l1.62-.88c1.33-.72 2.97-.24 3.73 1.05a18 18 0 0 0 3.7 4.74z"/></svg>);
const IconDownload = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const IconServer = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>);
const IconCloudDown = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 17l4 4 4-4"/><path d="M12 12v9"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>);
const IconArrowDown = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>);

// 📋 Premium Icons for Copy Button
const IconCopy = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>);
const IconCheck = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);

export default function PublicSharePage() {
  const params = useParams();
  const id = params?.id;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/share?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setMovie(data.movie);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkClick = (e, link) => {
    if (!link || link === "Failed" || link === "Error") {
      e.preventDefault();
      alert("⚠️ Link Not Found! সার্ভার আপডেট চলছে, একটু পর আবার চেষ্টা করুন।");
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    return url.replace("/view", "/preview");
  };

  // 🚀 ডাইরেক্ট ডাউনলোড জেনারেটর (নতুন ট্যাবে না গিয়ে সোজা ডাউনলোড শুরু করবে)
  const getDirectDownloadUrl = (url) => {
    if (!url) return "";
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f7f6" }}>
        <div style={{ color: "#3b82f6", fontSize: "20px", fontWeight: "bold", animation: "pulse 1.5s infinite" }}>Loading MovieNewsBD Server...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f7f6", color: "#ef4444" }}>
        <h2>❌ Link Expired or Movie Not Found!</h2>
      </div>
    );
  }

  const dateObj = movie.createdAt ? new Date(movie.createdAt) : new Date();
  const formattedDate = dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="share-layout">
      <style dangerouslySetInnerHTML={{__html: `
        body { margin: 0; background: #f0f4f8; color: #333; font-family: 'Segoe UI', system-ui, sans-serif; min-height: 100vh; }
        .share-layout { display: flex; align-items: flex-start; justify-content: center; min-height: 100vh; padding: 20px; box-sizing: border-box; }
        
        .main-card { background: #ffffff; border-radius: 16px; width: 100%; max-width: 500px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); overflow: hidden; padding-bottom: 20px; border: 1px solid #e2e8f0; }
        
        /* 🛡️ ব্র্যান্ড হেডার স্টাইলিং (লাফানো অফ, ডট ব্লিঙ্ক অন) */
        .brand-header { padding: 15px 20px; background-color: white; border-bottom: 1px solid #e2e8f0; text-align: center; position: relative; }
        .header-content { display: inline-flex; align-items: center; justify-content: center; } 
        .status-dot { height: 12px; width: 12px; background-color: #22c55e; border-radius: 50%; display: inline-block; margin-right: 10px; margin-top: 2px; animation: pulseDot 1.5s infinite; }
        .brand-title { font-size: 16px; font-weight: 800; color: #15803d; white-space: nowrap; }

        /* 🟢 গোল চিহ্নের জ্বলানো-নেভানো (Pulse) অ্যানিমেশন */
        @keyframes pulseDot { 
          0% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 
          50% { opacity: 0.4; transform: scale(0.9); box-shadow: 0 0 10px 4px rgba(34, 197, 94, 0.2); } 
          100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } 
        }

        .title-box { background: #4f46e5; color: white; padding: 20px; text-align: center; font-size: 18px; font-weight: 700; line-height: 1.4; word-break: break-word; }
        
        .info-row { display: flex; justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid #f1f5f9; font-size: 15px; background: white; }
        .info-label { color: #64748b; font-weight: 500; }
        .info-value { color: #1e293b; font-weight: 700; text-align: right; word-break: break-word; max-width: 60%; }

        /* 🎬 Watch Box */
        .watch-box { background: #06b6d4; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 12px; margin: 20px; color: black; font-weight: 800; font-size: 16px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3); }
        .watch-box:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(6, 182, 212, 0.5); }
        .watch-box:active { transform: scale(0.98); }
        .play-btn { background: black; color: #06b6d4; padding: 8px 20px; border-radius: 20px; display: flex; align-items: center; gap: 8px; font-size: 14px; }

        .notice-title { text-align: center; color: #16a34a; font-size: 22px; font-weight: 800; margin: 25px 0 15px; }
        .warning-box { background: #dcfce7; border: 1px solid #bbf7d0; color: #14532d; text-align: center; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 700; margin: 0 20px 20px; }
        .server-title { text-align: center; font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 15px; }

        /* 🚀 Download Buttons */
        .btn-container { padding: 0 20px; display: flex; flex-direction: column; gap: 12px; }
        .dl-btn { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-radius: 10px; font-size: 15px; font-weight: 700; color: white; text-decoration: none; transition: 0.2s; cursor: pointer; }
        .dl-btn:active { transform: scale(0.98); }
        .btn-left { display: flex; align-items: center; gap: 10px; }
        .btn-right { display: flex; align-items: center; gap: 8px; }
        
        .btn-instant { background: #5b21b6; }
        .btn-dldokan { background: #1e293b; }
        .btn-gocloud { background: #0f766e; }
        .btn-drivecloud { background: #2563eb; }
        .btn-gcloud { background: #c026d3; }

        .badge { font-size: 10px; padding: 3px 8px; border-radius: 5px; font-weight: 800; white-space: nowrap; text-transform: uppercase; }
        .badge-dark { background: #000; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .badge-red { background: #ef4444; color: white; }

        /* 📋 Copy Section - Premium Button CSS */
        .copy-section { margin: 30px 20px 10px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: center; }
        .link-input { width: 100%; border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; text-align: center; font-size: 13px; color: #64748b; margin-bottom: 15px; outline: none; background: #f8fafc; box-sizing: border-box; }
        
        .copy-btn { width: 100%; background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); }
        .copy-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4); }
        .copy-btn:active { transform: scale(0.98); }
        .copy-btn.copied { background: linear-gradient(135deg, #16a34a, #22c55e); box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3); }
        
        .footer { text-align: center; margin-top: 20px; font-size: 14px; font-weight: 600; color: #475569; }

        .player-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #000; z-index: 99999; display: flex; flex-direction: column; overflow: hidden; }
        .player-header { width: 100%; height: 60px; display: flex; justify-content: flex-end; align-items: center; padding: 0 15px; background: #111; box-sizing: border-box; flex-shrink: 0; }
        .close-player-btn { background: #ef4444; color: white; border: none; padding: 8px 16px; font-size: 14px; font-weight: bold; border-radius: 6px; cursor: pointer; transition: 0.2s; }
        .close-player-btn:hover { background: #dc2626; transform: scale(1.05); }
        .drive-iframe { width: 100%; height: 100%; flex-grow: 1; border: none; background: #000; display: block; }
        
        /* 📱 Mobile Fixes */
        @media (max-width: 600px) {
          .share-layout { padding: 10px; }
          .main-card { border-radius: 12px; }
          .watch-box { margin: 15px; padding: 12px 15px; font-size: 15px; border-radius: 10px; }
          .play-btn { padding: 6px 15px; font-size: 13px; gap: 5px; }

          .dl-btn { font-size: 13px; padding: 12px 14px; flex-direction: row; }
          .btn-left { font-size: 12px; gap: 6px; }
          .btn-right { gap: 6px; }
          .badge { font-size: 9px; padding: 2px 6px; }

          .title-box { font-size: 15px; padding: 15px; }
          .info-row { font-size: 13px; padding: 12px 15px; }
          .brand-title { font-size: 14px; }
          .status-dot { height: 10px; width: 10px; }
        }
      `}} />

      {isPlaying && (
        <div className="player-modal">
          <div className="player-header">
            <button className="close-player-btn" onClick={() => setIsPlaying(false)}>✖ Close</button>
          </div>
          <iframe 
            src={getEmbedUrl(movie.driveLink)} 
            allowFullScreen={true} 
            webkitallowfullscreen="true" 
            mozallowfullscreen="true" 
            className="drive-iframe"
          ></iframe>
        </div>
      )}

      <div className="main-card">
        <div className="brand-header">
          <div className="header-content">
            <span className="status-dot"></span>
            <span className="brand-title">MovienewsBD Cloud Downloader</span>
          </div>
        </div>

        <div className="title-box">
          {movie.movieName || "MovieNewsBD Exclusive"}
        </div>

        <div className="info-row"><span className="info-label">File Name</span><span className="info-value">{movie.movieName || "Unknown File"}</span></div>
        {/* 🚀 ফাইল সাইজ এখন ডাইনামিক। ব্যাকএন্ড থেকে fileSize পাঠালে রিয়েল-টাইম আপডেট হবে */}
        <div className="info-row"><span className="info-label">File Size</span><span className="info-value">{movie.fileSize || "Unknown"}</span></div>
        <div className="info-row"><span className="info-label">File Type</span><span className="info-value">video/x-matroska</span></div>
        <div className="info-row"><span className="info-label">Share Date</span><span className="info-value">{formattedDate}</span></div>

        <div 
          className="watch-box" 
          onClick={() => {
            if (movie.driveLink) setIsPlaying(true);
            else alert("⚠️ Play Link Not Found! মুভিটি এখনো প্রসেস হচ্ছে।");
          }}
        >
          <span>Watch Online</span>
          <div className="play-btn">▶ Play</div>
        </div>

        <div className="notice-title">Download Link Generated</div>

        <div className="warning-box">
          ⚡ কোনো একটি সার্ভার SLOW কাজ করলে, অন্য অপশন ব্যবহার করুন 🔄
        </div>

        <div className="server-title">🚀 High-Speed Servers 👇</div>

        <div className="btn-container">
          {/* 🚀 ডাইরেক্ট ডাউনলোড বাটন (নতুন ট্যাবে যাবে না, সরাসরি ডাউনলোড প্রম্পট আনবে) */}
          <a href={movie.driveLink ? getDirectDownloadUrl(movie.driveLink) : "#"} onClick={(e) => handleLinkClick(e, movie.driveLink)} download className="dl-btn btn-instant">
            <div className="btn-left"><IconLightningCloud /> Instant Download</div>
            <div className="btn-right"><span className="badge badge-dark">High-Speed</span> <IconArrowDown /></div>
          </a>

          <a href={movie.dlDokanLink || "#"} onClick={(e) => handleLinkClick(e, movie.dlDokanLink)} target="_blank" rel="noreferrer" className="dl-btn btn-dldokan">
            <div className="btn-left"><IconRocket /> Download [Fast Cloud]</div>
            <div className="btn-right"><span className="badge badge-red">New</span> <IconArrowDown /></div>
          </a>

          <a href={movie.gofileLink || "#"} onClick={(e) => handleLinkClick(e, movie.gofileLink)} target="_blank" rel="noreferrer" className="dl-btn btn-gocloud">
            <div className="btn-left"><IconDownload /> Direct Download Now</div>
            <div className="btn-right"><IconArrowDown /></div>
          </a>

          <a href={movie.driveCloudLink || "#"} onClick={(e) => handleLinkClick(e, movie.driveCloudLink)} target="_blank" rel="noreferrer" className="dl-btn btn-drivecloud">
            <div className="btn-left"><IconCloudDown /> Download [Always Work]</div>
            <div className="btn-right"><IconArrowDown /></div>
          </a>

          <a href={movie.gcloudLink || "#"} onClick={(e) => handleLinkClick(e, movie.gcloudLink)} target="_blank" rel="noreferrer" className="dl-btn btn-gcloud">
            <div className="btn-left"><IconServer /> G Cloud [10Gbps]</div>
            <div className="btn-right"><IconArrowDown /></div>
          </a>
        </div>

        <div className="copy-section">
          <input type="text" readOnly value={typeof window !== "undefined" ? window.location.href : ""} className="link-input" />
          {/* 🚀 Premium Animated Copy Button */}
          <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
            {copied ? (
              <><IconCheck /> Copied to Clipboard!</>
            ) : (
              <><IconCopy /> Copy Link</>
            )}
          </button>
        </div>

        <div className="footer">
          Made with ❤️ by MovieNewsBD.com
        </div>
      </div>
    </div>
  );
}