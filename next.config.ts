import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use "export" for GitHub Pages static export
  // Remove "output" field for Vercel deployment (Vercel handles its own build)
  output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
