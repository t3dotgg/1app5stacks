import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    dynamicIO: true,
    cacheLife: {
      default: {
        stale: 60 * 60 * 24 * 14, // 14 days
        revalidate: 60 * 60 * 24, // 1 day
        expire: 60 * 60 * 24 * 14, // 14 days
      },
      forever: {
        expire: 999999999,
        revalidate: 999999999,
      },
    },
  },
};

export default nextConfig;
