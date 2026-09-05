import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sport-store/shared"],
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
};

export default nextConfig;
