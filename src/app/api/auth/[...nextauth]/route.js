import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import User from "@/lib/User"; // Updated path based on your folder structure

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/drive" 
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await connectDB();
        try {
          await User.findOneAndUpdate(
            { email: user.email },
            {
              name: user.name,
              email: user.email,
              image: user.image,
              accessToken: account.access_token,
              // শুধুমাত্র নতুন লগইনের সময়ই রিফ্রেশ টোকেন আসে, তাই আগে চেক করে নিচ্ছি
              ...(account.refresh_token && { refreshToken: account.refresh_token }), 
            },
            { upsert: true, new: true }
          );
          return true;
        } catch (error) {
          console.error("[Error] Database Save Error during SignIn:", error);
          return false;
        }
      }
      return true;
    },
    // 🚀 নতুন যোগ করা অংশ: টোকেনটা ফ্রন্টএন্ডে পাঠানোর জন্য
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
});

export { handler as GET, handler as POST };