import type { NextConfig } from "next";
import withPWA from "next-pwa";
const nextConfig: NextConfig = {
  /* config options here */
  typescript:{
    ignoreBuildErrors:true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: ''
      },
      {
        protocol:"https",
        hostname:"res.cloudinary.com",
        
      },
      {
        protocol:"https",
        hostname:'www.cleanerscompare.com'
      }
    ]
  }
};

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable:  process.env.NODE_ENV === "development", // Temporarily set to false for testing PWA in development
});

export default pwaConfig(nextConfig);
