import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"; // NextAuth থেকে লগইন করা ইউজার ধরতে
import dbConnect from '@/lib/mongodb'; // তোমার ডাটাবেস কানেকশন ফাইল
import GeneratedLink from '@/models/GeneratedLink';

function extractDriveId(url) {
  if (!url) return null;
  const match = url.match(/[-\w]{25,}/);
  return match ? match[0] : null;
}

export async function POST(req) {
  try {
    await dbConnect();

    // ১. লগইন করা ইউজারের ইনফো বের করা
    const session = await getServerSession(); 
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    const { movieName, fileUrl } = await req.json();

    // 🚀 Abyss API Call Shuru
    let generatedAbyssId = null;
    const driveId = extractDriveId(fileUrl);
    console.log("Extracted Drive ID:", driveId);
    if (driveId) {
      try {
        const abyssRes = await fetch(`https://api.abyss.to/v1/remote/drive/${driveId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.ABYSS_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        const abyssData = await abyssRes.json();
        console.log("Abyss API Response:", abyssData);
        if (abyssData && abyssData.id) {
          generatedAbyssId = abyssData.id;
        } else if (abyssData && abyssData.slug) {
          generatedAbyssId = abyssData.slug;
        }
      } catch (abyssError) {
        console.log("Abyss Fetch Error:", abyssError);
        console.error("Abyss Upload Error:", abyssError);
        // Error হলেও আমরা প্রসেস থামাবো না, বাকিগুলো সেভ করবো
      }
    }
    else {
        console.log("No Drive ID found from URL!");
    }
    // 🚀 Abyss API Call Sesh

    // ২. API Key গুলো কল করা (এখানে তোমার একচুয়াল জেনারেট লজিক বসবে)
    // উদাহরণস্বরূপ: DL_Dokan API Call
    /* const dlDokanRes = await fetch(`https://dldokan.com/api?api=${process.env.DL_DOKAN_API_KEY}&url=${fileUrl}`);
    const dlData = await dlDokanRes.json();
    const finalDlLink = dlData.shortenedUrl; 
    */

    // আপাতত আমি ডামি লিংক দিচ্ছি, তুমি তোমার আসল API fetch দিয়ে রিপ্লেস করে নিও:
    const finalGofile = `https://gofile.io/d/generated_id_for_${movieName}`;
    const finalDlDokan = `https://dldokan.com/link_generated`;
    const finalGcloud = `https://gcloud.com/generated_link`;

    // ৩. ডাটাবেসে ইউজারের নামে সেভ করা
    const newRecord = await GeneratedLink.create({
      userEmail: session.user.email, // এই ইমেইল দিয়েই ইন-ফিউচার ডাটা খুঁজব
      movieName: movieName,
      driveLink: fileUrl,            // অরিজিনাল ফাইল ইউআরএল সেভ করে রাখলাম
      abyssId: generatedAbyssId,     // 🚀 Abyss এর আইডি সেভ হলো
      gofileLink: finalGofile,
      dlDokanLink: finalDlDokan,
      gcloudLink: finalGcloud,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Links generated & saved successfully!",
      data: newRecord 
    }, { status: 201 });

  } catch (error) {
    console.error("Error generating links:", error);
    return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
  }
}