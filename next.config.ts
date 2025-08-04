import type { NextConfig } from "next";

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

export default nextConfig;
