import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 1. Allow any domain (Supabase, Freepik, etc.)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // 2. DISABLE server-side optimization locally
    // This fixes the "resolved to private ip" error by letting 
    // the browser fetch images directly.
    unoptimized: true,
  },
};

export default nextConfig;