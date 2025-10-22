import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 警告：这将在生产构建期间忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 警告：这将在生产构建期间忽略 TypeScript 错误
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

// src/config.ts
const ENV = process.env.NODE_ENV // "development" | "production"

export const BASE_URL =
  ENV === "development"
    ? "http://localhost:5000/api"   // 本地开发
    : "https://tutongbrothers.onrender.com/api"  // 线上生产 - 注意加上 /api


export default nextConfig;

export const CLOUDINARY_URL = "cloudinary://691185462378112:yHQZQU_SMwMfyUBqHBxuUIHVU5o@dewxaup4t"