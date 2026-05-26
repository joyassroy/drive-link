// app/layout.js
import { Providers } from "./providers";
import "./globals.css"; // Next.js default css if exists

export const metadata = {
  title: "MovieNewsBD.Com | DriveLink Engine",
  description: "Automated video metadata cleaning, promo subtitle injection, and high-speed download link generation engine for MovieNewsBD.",
  keywords: ["MovieNewsBD", "Drive Link Generator", "Video Processing Engine", "Metadata Cleaner", "DL Dokan Automation"],
  authors: [{ name: "movienewsbd", url: "https://movienewsbd.com" }],
  icons: {
    // 🚀 এখানে আমি একটা দারুণ Cloud + Movie টাইপের প্রফেশনাল আইকন দিয়ে দিয়েছি
    icon: "https://cdn-icons-png.flaticon.com/512/3172/3172554.png", 
    apple: "https://cdn-icons-png.flaticon.com/512/3172/3172554.png",
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "MovieNewsBD.Com | DriveLink Engine",
    description: "Automated video metadata cleaning and link generation.",
    url: "https://movienewsbd.com",
    siteName: "MovieNewsBD Engine",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}